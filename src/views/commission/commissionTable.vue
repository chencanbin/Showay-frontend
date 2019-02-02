<template>
  <span>
    <el-button
      :loading="loading"
      type="text"
      icon="el-icon-edit"
      style="margin-right: 10px"
      @click="initForm">编辑</el-button>
    <el-dialog
      id="commissionTableDialog"
      :fullscreen="fullscreen"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="'佣金策略表( ' + title + ' )'"
      class="dialog-body">
      <!--<el-button icon="el-icon-plus" type="text" @click="addNewRow">添加新行</el-button>-->
      <div slot="title" style="box-shadow: 0 2px 4px hsla(0,0%,8%,.15); padding: 15px;">
        <span slot="title" class="el-dialog__title">{{ title + ' 佣金策略表' }}</span>
        <span style="color: #999; font-family: YouYuan; margin-left: 10px">{{ editStatus }}</span>
      </div>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="基础佣金表" name="basic">
          <hot-table v-loading="loading" ref="basicTable" :settings="settings"/>
        </el-tab-pane>
        <el-tab-pane label="override佣金表" name="override">
          <hot-table v-loading="loading" ref="overrideTable" :settings="settings"/>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-form>
          <el-form-item label="生效时间:" style="width: 320px; display: inline-block; float: left">
            <el-date-picker
              v-model="effectiveDate"
              type="datetime"
              value-format="timestamp"
              style="margin-right: 10px"/>
          </el-form-item>
        </el-form>
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="buttonLoading" type="primary" @click="handlePublish">发布</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable-pro'
import '../../../node_modules/handsontable-pro/dist/handsontable.full.min.css'

export default {
  components: {
    HotTable
  },
  props: {
    id: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: 'basic',
      editStatus: '',
      errorCoordinate: [],
      rowHeights: '100px',
      effectiveDate: (new Date()).valueOf(),
      fullscreen: true,
      dialogVisible: false,
      loading: false,
      buttonLoading: false,
      basicHotInstance: '',
      overrideHotInstance: '',
      settings: {
        colWidths: [120, 250, 250, 80],
        colHeaders: [],
        data: Handsontable.helper.createSpreadsheetData(99, 20),
        height: window.screen.height - 320,
        stretchH: 'all',
        autoWrapRow: false,
        autoWrapCol: false,
        rowHeaders: true,
        fixedColumnsLeft: 1,
        contextMenu: {
          callback: function(key, selection, clickEvent) {
          },
          items: {
            'override': { // Own custom option
              name: '设置Override',
              callback: function(key, selection, clickEvent) {
              }
            }
          }
        },
        afterBeginEditing: (row, coloumn) => {
          this.editStatus = '正在修改.....'
        },
        afterChange: (changes, source) => {
          if (source === 'loadData') {
            return
          }
          if (changes) {
            const data = []
            let x = 0
            let y = ''
            let value
            changes.forEach(([row, prop, oldValue, newValue]) => {
              y = this.basicHotInstance.propToCol(prop)
              x = row
              if (newValue) {
                value = newValue
              }
              data.push({ x, y, value })
            })
            this.editStatus = '正在保存.....'
            this.$api.commission.commissionTableDraft(this.id, { data }).then(res => {
              const date = new Date()
              this.editStatus = '最近保存 ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
            }).catch(_ => {
              this.basicHotInstance.redo()
              this.editStatus = ''
            })
          }
        }
      }
    }
  },
  created() {
    this.settings.colHeaders = ['产品编号', '计划名称', 'ENG name', '年期']
    this.settings.columns = [{ data: 'pId' }, { data: 'zh' }, { data: 'en' }, { data: 'years' }]
    for (let i = 1; i <= 15; i++) {
      this.settings.colWidths.push(85)
      this.settings.colHeaders.push('第' + i + '年')
      this.settings.columns.push({ data: 'year' + i, renderer: this.toPercent })
    }
    this.settings.colWidths.push(85)
    this.settings.colHeaders.push('15年以后')
    this.settings.columns.push({ data: 'after15', renderer: this.toPercent })
  },
  methods: {
    handleTabClick(tab, event) {
      if (this.activeName === 'basic') {
        this.loadBasicData()
      } else if (this.activeName === 'override') {
        this.loadOverrideData()
      }
    },
    toPercent(instance, td, row, col, prop, value, cellProperties) {
      td.style.cssText = 'text-align: right;'
      if (value && isNaN(value)) {
        td.innerText = value
        td.style.border = '1px solid red'
        td.setAttribute('title', '格式必须要数字')
        return td
      }
      const num = Number(value).toFixed()
      if (Number(value) === 0) {
        td.innerText = ''
      } else {
        td.innerText = num + '%'
      }
      return td
    },
    initForm() {
      this.loading = true
      this.dialogVisible = true
      this.editStatus = ''
      this.$nextTick(() => {
        this.basicHotInstance = this.$refs.basicTable.hotInstance
        this.overrideHotInstance = this.$refs.overrideTable.hotInstance
        this.loadBasicData()
      })
    },
    loadBasicData() {
      this.$api.commission.fetchCommissionList(this.id).then(res => {
        res.data.list.forEach(item => {
          this.basicHotInstance.setDataAtCell(item.x, item.y, item.value, 'loadData')
        })
        this.loading = false
      })
    },
    loadOverrideData() {
      this.$api.commission.fetchCommissionList(this.id).then(res => {
        res.data.list.forEach(item => {
          this.overrideHotInstance.setDataAtCell(item.x, item.y, item.value, 'loadData')
        })
        this.loading = false
      })
    },
    handleClose() {
      this.$store.dispatch('commission/FetchCommissionTableList', {})
      this.dialogVisible = false
    },
    handlePublish() {
      this.buttonLoading = true
      this.$api.commission.publishCommissionTableDraft(this.id, this.effectiveDate).then(res => {
        this.buttonLoading = false
        this.dialogVisible = false
        this.$store.dispatch('commission/FetchCommissionTableList', {})
      }).catch(error => {
        const data = error.data
        this.buttonLoading = false
        if (data && data.coordinate) {
          this.errorCoordinate = data.coordinate
          data.coordinate.forEach(item => {
            this.basicHotInstance.scrollViewportTo(item.row, item.column)
            this.basicHotInstance.render()
            const td = this.basicHotInstance.getCell(item.row, item.column, true)
            td.style.border = '1px solid red'
            td.setAttribute('title', error.message)
          })
        }
        this.buttonLoading = false
      })
    }
    // addNewRow() {
    //   const hotInstance = this.$refs.table.hotInstance
    //   hotInstance.alter('insert_row')
    // }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
  .htCore {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    color: #606266;
    font-size: 14px;
  }

  .htContextMenu:not(.htGhostTable) {
    z-index: 2200;
  }

  .handsontable td, .handsontable th {
    padding-left: 5px;
    padding-right: 5px;
    line-height: 1.7;
    min-width: 50px;
    vertical-align: middle;
  }

  /*.handsontable tbody tr:nth-of-type(odd) td {*/
    /*background: #fafafa !important;*/
  /*}*/

  #commissionTableDialog .dialog-footer {
    padding-top: 0px;
  }

  #commissionTableDialog .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  #commissionTableDialog .el-dialog__header {
    padding: 0;
  }

  #commissionTableDialog .el-dialog__footer {
    box-shadow: 2px -2px 4px hsla(0, 0%, 8%, .15);
    padding-top: 20px;
  }
</style>
