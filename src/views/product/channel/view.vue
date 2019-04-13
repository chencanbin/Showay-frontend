<template>
  <el-dialog
    id="channelCommissionPreviewTable"
    :visible="dialogVisible"
    :before-close="handleClose"
    :fullscreen="true"
    :title="title">
    <!--<div style="display: inline-block; position: absolute; right: 20px; z-index: 3000;">-->
    <!--<el-button :loading="loading" size="small" plain icon="el-icon-download" type="primary" @click="exportExcel()">导出</el-button>-->
    <!--</div>-->
    <basic-container>
      <el-form :inline="true" class="search-input" @submit.native.prevent>
        <el-form-item label="" prop="wildcard">
          <el-input
            v-model="wildcard"
            clearable
            placeholder="搜索 (供应商 | 产品)"
            @input="search">
            <i slot="prefix" class="el-input__icon el-icon-search"/>
          </el-input>
        </el-form-item>
      </el-form>
      <pagination :total="total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
      <div class="table-container">
        <el-table v-loading="loading" :data="data" :height="tableHeight" stripe>
          <el-table-column fixed prop="company.name" label="供应商" min-width="200"/>
          <el-table-column fixed prop="product.name" label="产品名称" min-width="200"/>
          <el-table-column v-for="(year, index) in columnYear" :key="index" :label="year" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.conditions[index] ? formatToPercent(scope.row.conditions[index].rate) : '-' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </basic-container>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
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
      tableHeight: document.body.clientHeight - 140,
      wildcard: '',
      dialogVisible: false,
      id: '',
      title: '',
      timestamp: '',
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
    search: _.debounce(function() {
      this.getViewData(this.id, { wildcard: this.wildcard })
    }, 500),
    openDialog(channelPolicyObj, channelName) {
      this.id = channelPolicyObj.id
      this.timestamp = channelPolicyObj.timestamp
      this.title = `渠道佣金预览 - ${channelName} ( ${parseTime(channelPolicyObj.timestamp, '{y}-{m}-{d}')} )`
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
      params = Object.assign({ timestamp: this.timestamp }, params)
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
      this.wildcard = ''
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
      padding: 10px
    }
  }
</style>
