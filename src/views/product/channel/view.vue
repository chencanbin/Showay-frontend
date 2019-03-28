<template>
  <el-dialog
    id="channelCommissionPreviewTable"
    :visible="dialogVisible"
    :before-close="handleClose"
    :fullscreen="true"
    title="渠道佣金预览">
    <!--<div style="display: inline-block; position: absolute; right: 20px; z-index: 3000;">-->
    <!--<el-button :loading="loading" size="small" plain icon="el-icon-download" type="primary" @click="exportExcel()">导出</el-button>-->
    <!--</div>-->
    <div class="table-container">
      <el-table :data="data" :max-height="tableHeight" stripe>
        <el-table-column fixed prop="company.name" label="供应商" min-width="200"/>
        <el-table-column fixed prop="product.name" label="产品名称" min-width="200"/>
        <el-table-column v-for="(year, index) in columnYear" :key="index" :label="year" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.conditions[index] ? formatToPercent(scope.row.conditions[index].rate) : '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import pagination from '@/components/Pagination'

const _ = require('lodash')
export default {
  name: 'CommissionView',
  components: {
    pagination
  },
  data() {
    return {
      activeName: 'basic',
      tableHeight: window.screen.height - 250,
      dialogVisible: false,
      id: '',
      data: [],
      total: 0,
      columnYear: [],
      listQuery: {
        page: 1,
        limit: 50
      }
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    openDialog(id) {
      this.id = id
      console.log(this.id)
      // this.$api.channel.previewChannelCommission(id).then(res => {
      //   this.data = res.data.list
      //   this.total = res.data.total
      //   this.id = id
      //   const conditionLengthArray = []
      //   this.columnYear = []
      //   _.forEach(res.data.list, item => {
      //     conditionLengthArray.push(item.conditions.length)
      //   })
      //   _.forEach(_.range(1, _.max(conditionLengthArray) + 1), item => {
      //     if (item > 15) {
      //       this.columnYear.push('15年之后')
      //     } else {
      //       this.columnYear.push('第' + item + '年')
      //     }
      //   })
      //   this.dialogVisible = true
      // })
      this.getViewData(this.id)
    },
    getViewData(id, params) {
      this.$api.channel.previewChannelCommission(id, params).then(res => {
        this.data = res.data.list
        this.total = res.data.total
        this.id = id
        const conditionLengthArray = []
        this.columnYear = []
        _.forEach(res.data.list, item => {
          conditionLengthArray.push(item.conditions.length)
        })
        _.forEach(_.range(1, _.max(conditionLengthArray) + 1), item => {
          if (item > 15) {
            this.columnYear.push('15年之后')
          } else {
            this.columnYear.push('第' + item + '年')
          }
        })
        this.dialogVisible = true
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    formatToPercent(number) {
      if (number) {
        return _.toNumber(number).toFixed(2) + '%'
      }
    },
    handleTabClick(tab, event) {
      this.activeName = tab.name
    },
    exportExcel() {
      window.location.href = process.env.BASE_API + `/commissionTable/${this.id}/export`
    },
    updatePage(val) {
      this.listQuery.page = val
    },
    updateLimit(val) {
      this.listQuery.limit = val
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit
      const max = pageObj.limit
      const params = { offset, max, role: 2 }
      this.getViewData(this.id, params)
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">
  #channelCommissionPreviewTable {
    .el-dialog__body {
      padding: 0
    }
  }
</style>
