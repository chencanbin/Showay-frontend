<template>
  <span>
    <el-button
      :loading="loading"
      type="text"
      icon="el-icon-edit"
      style="margin-right: 5px"
      @click="initForm">编辑</el-button>
    <el-dialog
      id="commissionTableDialog"
      :fullscreen="fullscreen"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="'佣金策略表( ' + title + ' )'"
      class="dialog-body">
      <!--<el-button icon="el-icon-plus" type="text" @click="addNewRow">添加新行</el-button>-->
      <div slot="title" class="title">
        <div class="el-dialog__title" style="display: inline-block;">{{ title + ' 佣金策略表' }}</div>
        <span style="color: #999; font-family: YouYuan; margin-left: 10px">{{ editStatus }}</span>
      </div>
      <el-tabs v-model="activeName" type="border-card" tab-position="bottom" @tab-click="handleTabClick">
        <el-tab-pane label="基础佣金表" name="basic">
          <hot-table v-loading="loading" ref="basicTable" :settings="settings"/>
        </el-tab-pane>
        <el-tab-pane label="Override佣金表" name="override">
          <hot-table v-loading="loading" ref="overrideTable" :settings="settings"/>
        </el-tab-pane>
        <el-tab-pane label="总佣金表" name="overall">
          <hot-table v-loading="loading" ref="overallTable" :settings="settings"/>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        :visible.sync="timeDialogVisible"
        width="300px"
        title="佣金生效时间"
        append-to-body>
        <el-date-picker
          v-model="effectiveDate"
          type="datetime"
          value-format="timestamp"
          style="width: 100%"/>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" type="primary" @click="handlePublish">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        id="setOverrideDialog"
        :title="overrideTitle"
        :visible.sync="setOverrideDialogVisible"
        width="90%"
        append-to-body>
        <hot-table v-loading="loading" ref="setOverrideHotInstance" :settings="setOverrideSettings"/>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="handleCloseSetOverrideDialog">确定</el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="buttonLoading" type="primary" @click="timeDialogVisible = true">发布</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { HotTable } from '@handsontable/vue'
import '../../../../node_modules/handsontable-pro/dist/handsontable.full.min.css'
const _ = require('lodash')

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
      overrideTitle: '',
      activeName: 'basic',
      editStatus: '', // 修改cell时,页面的状态显示
      errorCoordinate: [],
      selectedRows: [], // 选中行数的数组
      effectiveDate: (new Date()).valueOf(), // 有效时间
      fullscreen: true,
      dialogVisible: false,
      timeDialogVisible: false,
      setOverrideDialogVisible: false,
      loading: false,
      buttonLoading: false,
      basicHotInstance: '',
      overrideHotInstance: '',
      overallHotInstance: '',
      setOverrideHotInstance: '',
      setOverrideSettings: {
        columns: [],
        startCols: 15,
        startRows: 1,
        colHeaders: [],
        height: 120,
        stretchH: 'all',
        rowHeights: 50,
        columnHeaderHeight: 45,
        afterChange: (changes, source) => {
          if (source === 'loadData') {
            return
          }
          if (changes) {
            const data = []
            let column = 0
            let value
            changes.forEach(([row, prop, oldValue, newValue]) => {
              column = this.setOverrideHotInstance.propToCol(prop) + 4
              if (newValue) {
                value = _.toString(newValue)
              }
              if (value && value.substr(-1) === '%') {
                value = value.substr(0, value.length - 1)
              }
              _.forEach(this.selectedRows, row => {
                data.push({ row, column, value })
              })
            })
            this.$api.commission.commissionTableDraft(this.id, { data, type: 1 }).catch(_ => {
              this.setOverrideHotInstance.redo()
            })
          }
        }
      },
      settings: {
        colWidths: [250, 250, 120, 70],
        colHeaders: [],
        startCols: 20,
        startRows: 99,
        height: window.screen.height - 330,
        stretchH: 'all',
        autoWrapRow: false,
        autoWrapCol: false,
        rowHeaders: true,
        fixedColumnsLeft: 1,
        columnHeaderHeight: 45,
        contextMenu: {
          items: {
            'override': { // Own custom option
              name: '设置Override',
              callback: (key, selection, clickEvent) => {
                const serialNumberArray = []
                const rowLengthArray = []
                this.selectedRows = []
                selection.forEach(item => {
                  if (item.start.row === item.end.row) {
                    this.selectedRows = _.union(this.selectedRows, [item.start.row])
                  } else {
                    this.selectedRows = _.union(this.selectedRows, _.range(item.start.row, item.end.row + 1))
                  }
                })
                this.selectedRows.forEach(row => {
                  const result = _.compact(this.basicHotInstance.getDataAtRow(row))
                  serialNumberArray.push(result[0])
                  rowLengthArray.push(result.length)
                })
                this.overrideTitle = _.join(serialNumberArray, ', ')
                this.showSetOverrideDialogVisible(_.min(rowLengthArray))
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
            let column = 0
            let value
            changes.forEach(([row, prop, oldValue, newValue]) => {
              column = this.basicHotInstance.propToCol(prop)
              if (newValue) {
                value = _.toString(newValue)
              }
              if (value && value.substr(-1) === '%') {
                value = value.substr(0, value.length - 1)
              }
              data.push({ row, column, value })
            })
            this.editStatus = '正在保存.....'
            let type = 0
            if (this.activeName === 'override') {
              type = 1
            } else if (this.activeName === 'overall') {
              type = 2
            }
            this.$api.commission.commissionTableDraft(this.id, { data, type }).then(res => {
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
    this.initColumn()
  },

  methods: {
    initColumn() {
      // this.$api.commission.fetchCommissionTable(3).then(res => {
      //   console.log(res)
      // })

      const colHeaders = ['计划名称', 'ENG name', '产品编号', '年期']
      const columns = [{ data: 'zh', renderer: this.textFormatter }, { data: 'en', renderer: this.textFormatter }, { data: 'pId' }, { data: 'years' }]
      const colWidths = []
      for (let i = 1; i <= 15; i++) {
        colWidths.push(85)
        colHeaders.push('第' + i + '年')
        columns.push({ data: 'year' + i, renderer: this.toPercent })
      }
      colWidths.push(85)
      colHeaders.push('15年以后')
      columns.push({ data: 'after15', renderer: this.toPercent })
      if (this.activeName === 'basic') {
        colWidths.push(85)
        colHeaders.push('FFYAP')
        columns.push({ data: 'ffyap', renderer: this.toPercent })
      }
      // overrideHeaders.push('15年以后')
      // overrideColumns.push({ data: 'after15', renderer: this.toPercent })
      this.settings.colHeaders = colHeaders
      this.settings.colWidths = _.concat(this.settings.colWidths, colWidths)
      this.settings.columns = columns
    },
    // 显示批量设置Override的弹框
    showSetOverrideDialogVisible(minLength) {
      this.setOverrideDialogVisible = true
      this.$nextTick(() => {
        const overrideHeaders = []
        const overrideColumns = []
        this.setOverrideHotInstance = this.$refs.setOverrideHotInstance.hotInstance
        _.forEach(_.range(1, minLength - 3), i => {
          if (i > 15) {
            overrideHeaders.push('15年以后')
            overrideColumns.push({ data: 'after15', renderer: this.toPercent })
          } else {
            overrideHeaders.push('第' + i + '年')
            overrideColumns.push({ data: 'year' + i, renderer: this.toPercent })
          }
        })
        this.setOverrideSettings.colHeaders = overrideHeaders
        this.setOverrideSettings.columns = overrideColumns
        _.forEach(_.range(0, minLength - 4), i => {
          this.setOverrideHotInstance.setDataAtCell(0, i, '', 'loadData')
        })
      })
    },
    handleTabClick(tab, event) {
      if (this.activeName === 'basic') {
        this.initColumn()
        this.loadBasicData()
      } else if (this.activeName === 'override') {
        this.initColumn()
        this.loadOverrideData()
      } else if (this.activeName === 'overall') {
        this.initColumn()
        this.loadOverallData()
        this.overallHotInstance.render()
      }
    },
    // 格式化百分比的cell
    toPercent(instance, td, row, col, prop, value, cellProperties) {
      td.style.cssText = 'text-align: right;'
      value = _.toString(value)
      if (value && value.substr(-1) === '%') {
        value = value.substr(0, value.length - 1)
      }
      if (value && isNaN(value)) {
        td.innerText = value
        td.style.border = '1px solid red'
        td.setAttribute('title', '格式必须要数字')
        return td
      }

      if (Number(value) === 0) {
        td.innerText = ''
      } else {
        td.innerText = _.toNumber(value).toFixed(2) + '%'
      }
      return td
    },
    textFormatter(instance, td, row, col, prop, value, cellProperties) {
      td.style.cssText = 'text-align: center;'
      td.innerText = value
      return td
    },
    initForm() {
      this.dialogVisible = true
      this.editStatus = ''
      this.$nextTick(() => {
        this.basicHotInstance = this.$refs.basicTable.hotInstance
        this.overrideHotInstance = this.$refs.overrideTable.hotInstance
        this.overallHotInstance = this.$refs.overallTable.hotInstance
        this.loadBasicData()
      })
    },
    loadBasicData() {
      this.loading = true
      this.$api.commission.fetchCommissionList(this.id).then(res => {
        res.data.list.forEach(item => {
          this.basicHotInstance.setDataAtCell(item.row, item.column, item.value.basic, 'loadData')
        })
        this.loading = false
      })
    },
    loadOverrideData() {
      this.loading = true
      this.$api.commission.fetchCommissionList(this.id).then(res => {
        res.data.list.forEach(item => {
          this.overrideHotInstance.setDataAtCell(item.row, item.column, item.value.override, 'loadData')
        })
        this.loading = false
      })
    },
    loadOverallData() {
      this.loading = true
      this.$api.commission.fetchCommissionList(this.id).then(res => {
        res.data.list.forEach(item => {
          this.overallHotInstance.setDataAtCell(item.row, item.column, item.value.overall, 'loadData')
        })
        this.loading = false
      })
    },
    handleClose() {
      this.$store.dispatch('commission/FetchCommissionTableList', {})
      this.dialogVisible = false
    },
    handleCloseSetOverrideDialog() {
      if (this.activeName === 'basic') {
        this.loadBasicData()
      } else if (this.activeName === 'override') {
        this.loadOverrideData()
      } else {
        this.loadOverallData()
      }
      this.setOverrideDialogVisible = false
    },
    handlePublish() {
      this.buttonLoading = true
      this.$api.commission.publishCommissionTableDraft(this.id, this.effectiveDate).then(res => {
        this.buttonLoading = false
        this.timeDialogVisible = false
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
            td.className = 'td_error'
            td.setAttribute('title', error.message)
          })
        }
        this.buttonLoading = false
        this.timeDialogVisible = false
      })
    }
  }
}
</script>

<style lang="scss" type="text/scss">
  .htCore {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    color: #3a4735;
    font-size: 14px;
  }

  .htContextMenu:not(.htGhostTable) {
    z-index: 2200;
  }
  .handsontable th {
    background: #fafafa;
    color: #3a4735;
    font-weight: bold;
    vertical-align: bottom;
  }
  .handsontable td, .handsontable th {
    padding-left: 5px;
    padding-right: 5px;
    line-height: 1.7;
    min-width: 50px;
    vertical-align: middle;
    border-color: #e0e2e4;
    background: #fafafa;
  }
  .handsontable tbody th.ht__highlight, .handsontable thead th.ht__highlight {
    background-color: #fafafa;
  }
  .handsontable tr:nth-child(odd) > td {
    background: #e1eedc!important;
  }
  .handsontable tr:nth-child(odd):hover > td {
    background: #e1eedc;
  }
  .handsontable tr:nth-child(even):hover > td {
    background-color: #fafafa;
  }

  #commissionTableDialog, .dialog-footer, #setOverrideDialog .dialog-footer{
    padding-top: 0px;
  }

  #commissionTableDialog .el-dialog__body, #setOverrideDialog .el-dialog__body {
    padding: 10px;
  }

  #commissionTableDialog .el-dialog__header {
    padding: 0;
  }

  #commissionTableDialog .el-dialog {
    background-color: #f8f8f8;
  }
  #commissionTableDialog .el-dialog__footer {
    box-shadow: 2px -2px 4px hsla(0, 0%, 8%, .15);
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .td_error {
    border: 1px solid red !important;
  }

  #commissionTableDialog .el-tabs__active-bar {
    top: 0
  }
  #commissionTableDialog .el-tabs--border-card > .el-tabs__content {
    padding: 10px;
    background: #fafafa;
  }
  #commissionTableDialog {
    .el-dialog__header {
      background: url("../../../assets/images/commissionBanner.png") no-repeat;
      background-size: cover;
      //filter: blur(20px);
      .title {
        box-shadow: 0 2px 4px hsla(0,0%,8%,.15);
        padding: 40px 15px 5px 15px;
      }
    }
  }
</style>
