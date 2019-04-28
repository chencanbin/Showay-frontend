<template>
  <div class="table-container">
    <basic-container>
      <el-form :inline="true" class="search-input" @submit.native.prevent>
        <el-form-item label="" prop="wildcard">
          <el-input
            v-model="wildcard"
            :placeholder="$t('audit.search')"
            clearable
            @input="search">
            <i slot="prefix" class="el-input__icon el-icon-search"/>
          </el-input>
        </el-form-item>
      </el-form>
      <pagination :total="insurancePolicy.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
      <el-table
        v-loading="insurancePolicyLoading"
        :height="height"
        :data="insurancePolicy.list"
        stripe>
        <el-table-column
          :label="$t('client.insurance_policy.number')"
          prop="number"
          show-overflow-tooltip
          min-width="120"/>
        <el-table-column
          :formatter="dateFormat"
          :label="$t('client.insurance_policy.submitDate')"
          prop="submitDate"
          min-width="150"/>
        <el-table-column
          :label="$t('client.insurance_policy.applicant_name')"
          prop="applicant.name"
          show-overflow-tooltip
          min-width="150"/>
        <el-table-column
          :label="$t('client.insurance_policy.beneficiary_name')"
          prop="beneficiary.name"
          show-overflow-tooltip
          min-width="150"/>
        <el-table-column
          :label="$t('client.insurance_policy.company_name')"
          prop="company.name"
          min-width="150"
          show-overflow-tooltip/>
        <el-table-column
          :label="$t('client.insurance_policy.product_name')"
          prop="product.name"
          min-width="200"
          show-overflow-tooltip/>
        <el-table-column :label="$t('common.action')" width="150">
          <template slot-scope="scope">
            <trace :number="scope.row.number"/>
          </template>
        </el-table-column>
      </el-table>
    </basic-container>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { policyStatus } from '@/utils/constant'
import Cookies from 'js-cookie'
import { mapState } from 'vuex'
import pagination from '@/components/Pagination'
import trace from './trace'
const _ = require('lodash')
const currencyFormatter = require('currency-formatter')
export default {
  name: 'InsurancePolicy',
  components: {
    pagination,
    trace
  },
  data() {
    return {
      height: document.body.clientHeight - 130,
      wildcard: '',
      listQuery: {
        page: 1,
        limit: 50
      },
      language: Cookies.get('language') || 'zh-CN'
    }
  },
  computed: {
    ...mapState(
      {
        insurancePolicyLoading: state => state.client.insurancePolicyLoading,
        insurancePolicy: state => state.client.insurancePolicyList
      })
  },
  created() {
  },
  mounted() {
    this.getInsurancePolicyList()
  },
  methods: {
    search: _.debounce(function() {
      this.getInsurancePolicyList({ wildcard: this.wildcard })
    }, 500),
    // 获取保单列表
    getInsurancePolicyList(params) {
      params = Object.assign({ sort: 'submitDate,sn', order: 'asc,asc', wildcard: this.wildcard, ...params })
      this.$store.dispatch('client/FetchInsurancePolicyList', { params })
    },

    // 格式化事件
    dateFormat(row, column) {
      const date = row[column.property]
      return parseTime(date, '{y}-{m}-{d}')
    },
    getFormattedDate(value) {
      return parseTime(value, '{y}-{m}-{d}')
    },
    numberFormat(row, value) {
      return currencyFormatter.format(value, { code: row.currency })
    },
    // 处理删除保单事件
    handleAudit(index, row) {
      this.$api.product.traceInsurancePolicy(row.number).then(res => {
        console.log(res)
      })
    },

    // 格式化保单状态
    formatterPolicyStatus(row, column) {
      const id = row[column.property]
      let result = ''
      _.forEach(policyStatus, item => {
        if (id === item.id) {
          result = item[this.language]
          return
        }
      })
      return result
    },

    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit
      const max = pageObj.limit
      const params = { offset, max }
      this.getInsurancePolicyList(params)
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
