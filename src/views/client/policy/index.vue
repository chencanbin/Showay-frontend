<template>
  <div id="policy" class="table-container">
    <basic-container>
      <el-form :inline="true" class="search-input" @submit.native.prevent>
        <el-form-item label="" prop="wildcard">
          <el-input
            v-model="wildcard"
            clearable
            placeholder="请输入搜索内容"
            @input="search">
            <i slot="prefix" class="el-input__icon el-icon-search"/>
          </el-input>
        </el-form-item>
      </el-form>
      <el-date-picker v-model="year" type="year" clearable style="width: 180px" placeholder="根据申请日期过滤"/>
      <add-client style="display:inline-block; margin-top: 9px"/>
      <pagination :total="insurancePolicy.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
      <el-table
        v-loading="loading"
        :height="height"
        :data="insurancePolicy.list"
        stripe
        row-key="id"
        @sort-change="handleSubmitDateSort"
        @expand-change="expandChange">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div>
              <el-form id="policy-table-expand" label-position="left" inline >
                <el-form-item label="签单员:" class="policy-form-item">
                  <span>{{ scope.row.agent.name }}</span>
                </el-form-item>
                <el-form-item label="保额:" class="policy-form-item">
                  <span>{{ numberFormat(scope.row, scope.row.amountInsured) }}</span>
                </el-form-item>
                <el-form-item label="保费:" class="policy-form-item">
                  <span>{{ numberFormat(scope.row, scope.row.premium) }}</span>
                </el-form-item>
                <el-form-item label="续保计划" class="policy-form-item" style="width: 17%;">
                  <span>{{ formatterPremiumPlan(scope.row.premiumPlan) }}</span>
                </el-form-item>
                <el-form-item label="生效时间:" class="policy-form-item">
                  <span>{{ getFormattedDate(scope.row.issueDate) }}</span>
                </el-form-item>
                <el-form-item class="policy-form-item action">
                  <!--<detail :data="scope.row"/>-->
                  <edit v-if="!isIneffectiveStatus(scope.row.policyStatus)" :data="scope.row"/>
                  <riderBenefits v-if="!isIneffectiveStatus(scope.row.policyStatus)" :data="scope.row.riderBenefits" :id="scope.row.id" :company-id="scope.row.company.id" :currency="scope.row.currency"/>
                  <renewal v-if="!isIneffectiveStatus(scope.row.policyStatus) && (scope.row.premiumPlan === 3 || scope.row.riderBenefits.length > 0)" :id="scope.row.id" :currency="scope.row.currency" :premium-plan="scope.row.premiumPlan"/>
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-refresh"
                    @click="handleReset(scope.row.id)">重置
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.$index, scope.row)">删除
                  </el-button>
                </el-form-item>
              </el-form>
              <!--<div v-if="scope.row.riderBenefits && scope.row.riderBenefits.length > 0">-->
              <!--<div style="margin-top: 10px; font-size: 14px; font-weight: bold; color: #99a9bf;">副险列表</div>-->
              <!--<div style="margin-top: 10px">-->
              <!--<el-table :data="scope.row.riderBenefits" style="width: 100%" stripe>-->
              <!--<el-table-column prop="product.name" label="产品"/>-->
              <!--<el-table-column prop="amountInsured" label="保费"/>-->
              <!--<el-table-column prop="premium" label="保额"/>-->
              <!--</el-table>-->
              <!--</div>-->
              <!--</div>-->
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="number"
          label="保单号"
          show-overflow-tooltip
          min-width="120"/>
        <el-table-column
          prop="sn"
          label="内部编号"
          show-overflow-tooltip
          min-width="120"/>
        <el-table-column
          :formatter="dateFormat"
          prop="submitDate"
          label="申请日期"
          min-width="100"
          sortable="custom"/>
        <el-table-column
          prop="policyStatus"
          label="保单状态"
          min-width="100">
          <template slot-scope="scope">
            <el-tag v-if="isIneffectiveStatus(scope.row.policyStatus)" type="danger">
              {{ formatterPolicyStatus(scope.row.policyStatus) }}
            </el-tag>
            <el-tag v-else type="success">
              {{ formatterPolicyStatus(scope.row.policyStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="applicant.name"
          show-overflow-tooltip
          label="申请人"/>
        <el-table-column
          prop="beneficiary.name"
          show-overflow-tooltip
          label="受保人"/>
        <el-table-column
          prop="company.name"
          min-width="150"
          show-overflow-tooltip
          label="保险公司"/>
        <el-table-column
          prop="product.name"
          min-width="200"
          show-overflow-tooltip
          label="产品"/>
        <el-table-column
          prop="channel.name"
          min-width="150"
          show-overflow-tooltip
          label="渠道"/>
      </el-table>
      <add/>
    </basic-container>
  </div>
</template>

<script>
import { parseTime, getYearFirst, getYearLast } from '@/utils'
import { policyStatus, premiumPlan } from '@/utils/constant'
import Cookies from 'js-cookie'
import { mapGetters, mapState } from 'vuex'
import add from './add'
import edit from './edit'
import detail from './detail'
import addClient from './addClient'
import riderBenefits from './riderBenefits'
import renewal from './renewal'
import pagination from '@/components/Pagination'
const _ = require('lodash')
const currencyFormatter = require('currency-formatter')
export default {
  name: 'InsurancePolicy',
  components: {
    add,
    edit,
    detail,
    addClient,
    riderBenefits,
    renewal,
    pagination
  },
  data() {
    return {
      height: document.body.clientHeight - 190,
      wildcard: '',
      year: '',
      listQuery: {
        page: 1,
        limit: 50
      },
      language: Cookies.get('language') || 'zh-CN',
      expandKeys: []
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState(
      {
        insurancePolicy: state => state.client.insurancePolicyList
      })
  },
  watch: {
    year(val) {
      if (val) {
        const geSubmitDate = getYearFirst(val)
        const leSubmitDate = getYearLast(val)
        this.getInsurancePolicyList({ geSubmitDate, leSubmitDate })
      } else {
        this.getInsurancePolicyList()
      }
    }
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
      params = Object.assign({ sort: 'submitDate', order: 'desc', ...params })
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
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该保单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.client.deleteInsurancePolicy(row.id).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getInsurancePolicyList()
        })
      })
    },
    handleReset(id) {
      console.log(new Date(this.year).getFullYear())
      this.$confirm('此操作将重置保单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.client.resetInsurancePolicy(id).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getInsurancePolicyList()
        })
      })
    },
    // 格式化保单状态
    formatterPolicyStatus(id) {
      let result = ''
      _.forEach(policyStatus, item => {
        if (id === item.id) {
          result = item[this.language]
          return
        }
      })
      return result
    },

    formatterPremiumPlan(id) {
      let result = ''
      _.forEach(premiumPlan, item => {
        if (id === item.id) {
          result = item[this.language]
          return
        }
      })
      return result
    },

    isIneffectiveStatus(status) {
      if (status === 3 || status === 6 || status === 7) {
        return true
      } else {
        return false
      }
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
    },
    handleSubmitDateSort({ column, order, prop }) {
      let tem = 'asc'
      if (order === 'descending') {
        tem = 'desc'
      } else {
        tem = 'asc'
      }
      if (prop) {
        this.getInsurancePolicyList({ sort: prop, order: tem })
      } else {
        this.getInsurancePolicyList()
      }
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

<style type="text/scss"  lang="scss" scope>
  #policy {
    .el-table__expanded-cell {
      padding: 20px;
    }
    .policy-form-item{
      margin-right: 0;
      margin-bottom: 0;
      width: 14%;
      label {
        color: #99a9bf;
      }
    }
    .action {
      width: 25%;
    }
  }

</style>
