<template>
  <div id="cleared" class="table-container">
    <basic-container>
      <el-form :inline="true" class="search-input" @submit.native.prevent>
        <!--<el-form-item label="" prop="wildcard">-->
        <!--<el-input-->
        <!--v-model="wildcard"-->
        <!--clearable-->
        <!--:placeholder="$t('commission.payment.search')"-->
        <!--@input="search">-->
        <!--<i slot="prefix" class="el-input__icon el-icon-search"/>-->
        <!--</el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <!--<pagination :total="cleared.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>-->
      <el-table
        v-loading="clearedLoading"
        :height="height"
        :data="cleared.list"
        stripe
        border
        row-key="id"
        @expand-change="expandChange">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div>
              <el-form id="policy-table-expand" label-position="left" inline >
                <el-form-item :label="$t('client.insurance_policy.premium')" class="cleared-form-item">
                  <span>{{ numberFormat(scope.row, scope.row.premium) }}</span>
                </el-form-item>
                <el-form-item :label="$t('common.exchangeRate')" class="cleared-form-item">
                  <span>{{ scope.row.exchangeRateToHkd }}</span>
                </el-form-item>
                <el-form-item :label="$t('common.commission_rate')" class="cleared-form-item">
                  <span>{{ Math.floor(scope.row.commissionRate * 100) / 100 }}%</span>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('client.insurance_policy.number')" prop="insurancePolicy.number" min-width="100px" show-overflow-tooltip/>
        <el-table-column :label="$t('client.insurance_policy.sn')" prop="insurancePolicy.sn" min-width="100px" show-overflow-tooltip/>
        <el-table-column :label="$t('common.amount')" prop="amount" min-width="120">
          <template slot-scope="scope">
            <span class="left_text">HK$ </span>
            <span class="right_text">{{ formatterCurrency(scope.row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.profit')" prop="profit" min-width="120">
          <template slot-scope="scope">
            <span class="left_text">HK$ </span>
            <span class="right_text">{{ formatterCurrency(scope.row.profit) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.remarks')" prop="remarks" min-width="120"/>
        <el-table-column width="120">
          <template slot-scope="scope">
            <detail :payments="scope.row.payments"/>
          </template>
        </el-table-column>
      </el-table>
    </basic-container>
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import detail from './detail'
import { mapState } from 'vuex'
import { commissionPaymentStatus } from '@/utils/constant'
import { getSymbol } from '@/utils'
import Cookies from 'js-cookie'
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
      wildcard: '',
      commissionPaymentStatus,
      language: Cookies.get('language') || 'zh-CN',
      height: document.body.clientHeight - 120,
      expandKeys: [],
      listQuery: {
        page: 1,
        limit: 50
      }
    }
  },
  computed: {
    ...mapState({
      cleared: state => state.commission.cleared,
      clearedLoading: state => state.commission.clearedLoading
    })
  },
  created() {
    this.getCleared()
  },
  methods: {
    getSymbol,
    search: _.debounce(function() {
      this.getCleared({ wildcard: this.wildcard })
    }, 500),
    statusFormatter(value) {
      let result = ''
      _.forEach(commissionPaymentStatus, item => {
        if (value === item.id) {
          result = item[this.language]
          return
        }
      })
      return result
    },
    percentFormatter(row, column) {
      const number = row[column.property]
      return _.toNumber(number).toFixed(2) + '%'
    },
    formatterPercent(value) {
      return _.toNumber(value).toFixed(2) + '%'
    },
    getCleared(params) {
      this.$store.dispatch('commission/FetchCleared', params)
    },
    handleClick(tab, event) {
      this.getAuditPayment({ status: tab.name })
    },
    formatterCurrency(value) {
      return currencyFormatter.format(Math.floor(value * 100) / 100, { symbol: '' })
    },
    numberFormat(row, value) {
      return currencyFormatter.format(value, { code: row.currency })
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
    },
    expandChange(row, expandedRows) {
      if (this.expandKeys.indexOf(row.id) >= 0) {
        // 收起当前行
        this.expandKeys.shift()
        return
      }
      this.expandKeys.shift()
      this.expandKeys.push(row.id)
      if (expandedRows.length > 1) {
        // 只展开当前选项
        expandedRows.shift()
      }
    }
  }
}
</script>
<style type="text/scss" lang="scss">
  .viewer-container {
    z-index: 5000;
  }
  .left_text {
    display: inline-block;
    float: left;
  }

  .right_text {
    display: inline-block;
    float: right;
  }
  #cleared {
    .el-table__expanded-cell {
      padding: 20px;
    }
    .cleared-form-item{
      margin-right: 0;
      margin-bottom: 0;
      width: 20%;
      label {
        color: #99a9bf;
      }
    }
    .search-input {
      margin-left: 0;
    }
    .el-card__body {
      padding: 0px
    }
  }
</style>
