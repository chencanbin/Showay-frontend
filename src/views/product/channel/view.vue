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
            :placeholder="$t('product.channel.view.search')"
            clearable
            @input="search">
            <i slot="prefix" class="el-input__icon el-icon-search"/>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="hasPermission(100034)"
            :loading="exportLoading"
            type="primary"
            size="small"
            icon="el-icon-download"
            @click="exportPDF()">{{ $t('common.export') }}</el-button>
        </el-form-item>
      </el-form>
      <pagination :total="total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
      <div class="table-container">
        <el-table v-loading="loading" :data="data" :height="tableHeight" stripe>
          <el-table-column :label="$t('product.channel.view.company')" fixed prop="company.name" min-width="200"/>
          <el-table-column :label="$t('product.channel.view.product')" fixed prop="product.name" min-width="200"/>
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
import { parseTime } from '@/utils'
import pagination from '@/components/Pagination'
import axios from 'axios'
import { numberAcronym } from '@/utils/constant'
import Cookies from 'js-cookie'

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
      loading: false,
      exportLoading: false,
      wildcard: '',
      dialogVisible: false,
      id: '',
      title: '',
      timestamp: '',
      channelName: '',
      data: [],
      total: 0,
      columnYear: [],
      params: {},
      listQuery: {
        page: 1,
        limit: 50
      }
    }
  },
  methods: {
    search: _.debounce(function() {
      this.listQuery = { page: 1, limit: 50 }
      this.getViewData(this.id, { wildcard: this.wildcard })
    }, 500),
    openDialog(channelPolicyObj, channelName) {
      this.id = channelPolicyObj.id
      this.channelName = channelName
      this.timestamp = channelPolicyObj.timestamp
      this.title = `${this.$t('product.channel.view.title')} - ${channelName} ( ${parseTime(channelPolicyObj.timestamp, '{y}-{m}-{d}')} )`
      this.getViewData(this.id)
    },
    getViewData(id, params) {
      this.params = Object.assign({ timestamp: this.timestamp, wildcard: this.wildcard }, params)
      this.loading = true
      this.$api.channel.previewChannelCommission(id, this.params).then(res => {
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
            this.columnYear.push(this.$t('common.after_15_year'))
          } else {
            if (Cookies.get('language') === 'en') {
              this.columnYear.push(this.$t('common.year', [numberAcronym[item - 1]]))
            } else {
              this.columnYear.push(this.$t('common.year', [item]))
            }
          }
        })
        this.dialogVisible = true
        this.loading = false
      }).catch(_ => {
        this.loading = false
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
    // exportExcel() {
    //   window.location.href = process.env.BASE_API + `/commissionTable/${this.id}/export`
    // },
    exportPDF() {
      const url = process.env.BASE_API + `/channelCommissionTable/${this.id}/export`
      const fileName = `${this.channelName} ( ${parseTime(this.timestamp, '{y}-{m}-{d}')} ).pdf`
      this.exportLoading = true
      axios.get(url, {
        responseType: 'blob',
        params: this.params
      }).then(res => {
        const blob = new Blob([res.data])
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob) //  创建下载的链接
        downloadElement.href = href
        downloadElement.download = fileName //  下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() //  点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放blob对象
        this.exportLoading = false
      }).catch(_ => {
        console.log(_)
        this.exportLoading = false
      })
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
