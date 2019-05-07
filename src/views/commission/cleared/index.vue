<template>
  <div id="paymentAudit" class="table-container">
    <basic-container>
      <el-form :inline="true" class="search-input" style="margin-left: 10px" @submit.native.prevent>
        <el-form-item label="" prop="wildcard">
          <el-input
            v-model="wildcard"
            :placeholder="$t('commission.payment.search')"
            clearable
            @input="search">
            <i slot="prefix" class="el-input__icon el-icon-search"/>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            :clearable="true"
            :unlink-panels="true"
            v-model="year"
            type="daterange"
            value-format="timestamp"
            style="margin-left: 20px;"/>
        </el-form-item>
      </el-form>
      <pagination :total="auditPayment.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
      <el-table v-loading="auditPaymentLoading" :height="height" :data="auditPayment.list" stripe border>
        <el-table-column :label="$t('commission.payment.channel')" prop="channel.name" min-width="150"/>
        <el-table-column :label="$t('commission.payment.amountInHkd')" min-width="150">
          <template slot-scope="scope">
            <span class="left_text">HK$ </span><span class="right_text">{{ formatterCurrency(scope.row.amountInHkd) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('commission.payment.chequeNumber')" prop="chequeNumber" min-width="150"/>
        <el-table-column :label="$t('common.remarks')" prop="remarks" min-width="150"/>
        <el-table-column :label="$t('commission.payment.chequeIssueDate')" :formatter="dateFormat" prop="chequeIssueDate"/>
        <el-table-column :label="$t('commission.payment.chequeCopy')" prop="chequeCopy" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="viewScanFile(scope.row.chequeCopy)">{{ $t('common.view') }}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.action')" width="150" align="center">
          <template slot-scope="scope">
            <detail :channel="scope.row.channel" :id="scope.row.id" :cheque-number="scope.row.chequeNumber"/>
          </template>
        </el-table-column>
      </el-table>
    </basic-container>
  </div>
</template>

<script>
import { parseTime, getYearFirst, getYearLast } from '@/utils'
import pagination from '@/components/Pagination'
import { mapState } from 'vuex'
import detail from './detail'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'

const currencyFormatter = require('currency-formatter')
const _ = require('lodash')
export default {
  name: 'ChannelCommissionPayment',
  components: {
    pagination,
    detail
  },
  data() {
    return {
      year: [getYearFirst(new Date()), getYearLast(new Date())],
      wildcard: '',
      height: document.body.clientHeight - 120,
      chequeCopy: [],
      listQuery: {
        page: 1,
        limit: 50
      }
    }
  },
  computed: {
    ...mapState({
      auditPayment: state => state.commission.auditPayment,
      auditPaymentLoading: state => state.commission.auditPaymentLoading
    })
  },
  watch: {
    year: function(val) {
      console.log(val)
      this.getAuditPayment({ status: 3, wildcard: this.wildcard })
    }
  },
  created() {
    this.getAuditPayment({ status: 3 })
  },
  methods: {
    search: _.debounce(function() {
      this.getAuditPayment({ status: 3, wildcard: this.wildcard })
    }, 500),
    formatterCurrency(value) {
      return currencyFormatter.format(Math.floor(value * 100) / 100, { symbol: '' })
    },
    percentFormatter(row, column) {
      const number = row[column.property]
      return _.toNumber(number).toFixed(2) + '%'
    },
    formatterPercent(value) {
      return _.toNumber(value).toFixed(2) + '%'
    },
    // 格式化事件
    dateFormat(row, column) {
      const date = row[column.property]
      return parseTime(date, '{y}-{m}-{d}')
    },
    viewScanFile(key) {
      this.$api.document.getCompanyDownloadLink(key).then(res => {
        this.chequeCopy = [res.data.url]
        const image = new Image()
        image.src = this.chequeCopy
        const viewer = new Viewer(image, {
          hidden: function() {
            viewer.destroy()
          }
        })
        viewer.show()
      })
    },
    getAuditPayment(params) {
      if (this.year) {
        params = Object.assign({ geDate: this.year[0], leDate: this.year[1] }, params)
      }
      this.$store.dispatch('commission/FetchAuditPayment', params)
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit
      const max = pageObj.limit
      const params = { offset, max }
      this.getAuditPayment(params)
    },
    updatePage(val) {
      this.listQuery.page = val
    },
    updateLimit(val) {
      this.listQuery.limit = val
    }
  }
}
</script>
<style type="text/scss" lang="scss">
  .channelCommissionPayment-table-expand {
    font-size: 0;
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 33.3%;
      label {
        color: #99a9bf;
      }
    }
  }

  .left_text {
    display: inline-block;
    float: left;
  }

  .right_text {
    display: inline-block;
    float: right;
  }
  #paymentAudit {
    .search-input {
      margin-left: 0;
    }
    .el-card__body {
      padding: 0px
    }
  }
</style>
