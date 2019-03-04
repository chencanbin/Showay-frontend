<template>
  <div class="table-container">
    <basic-container>
      <el-table
        v-loading="loading"
        :max-height="height"
        :data="insurancePolicy.list"
        stripe>
        <!--
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="policy-table-expand">
              <el-form-item label="渠道:">
                <span>{{ scope.row.channel.name }}</span>
              </el-form-item>
              <el-form-item label="签单员:">
                <span>{{ scope.row.agent.name }}</span>
              </el-form-item>
              <el-form-item label="保额:">
                <span>{{ numberFormat(scope.row, scope.row.amountInsured) }}</span>
              </el-form-item>
              <el-form-item label="保费:">
                <span>{{ numberFormat(scope.row, scope.row.premium) }}</span>
              </el-form-item>
              <el-form-item label="生效时间:">
                <span>{{ getFormattedDate(scope.row.issueDate) }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
-->
        <el-table-column
          prop="number"
          label="保单号"
          min-width="120"/>
        <el-table-column
          :formatter="dateFormat"
          prop="submitDate"
          label="申请日期"
          min-width="100"/>
        <el-table-column
          :formatter="formatterPolicyStatus"
          prop="policyStatus"
          label="保单状态"
          min-width="100"/>
        <el-table-column
          prop="applicant.name"
          label="申请人"/>
        <el-table-column
          prop="beneficiary.name"
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

        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <detail :data="scope.row"/>
            <edit :data="scope.row"/>
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <add/>
      <pagination :total="insurancePolicy.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
    </basic-container>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { policyStatus } from '@/utils/constant'
import Cookies from 'js-cookie'
import { mapGetters, mapState } from 'vuex'
import add from './add'
import edit from './edit'
import detail from './detail'
import pagination from '@/components/Pagination'
const _ = require('lodash')
const currencyFormatter = require('currency-formatter')
export default {
  name: 'InsurancePolicy',
  components: {
    add,
    edit,
    detail,
    pagination
  },
  data() {
    return {
      height: window.screen.height - 260,
      listQuery: {
        page: 1,
        limit: 50
      },
      language: Cookies.get('language') || 'en'
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState(
      {
        insurancePolicy: state => state.client.insurancePolicyList
      })
  },
  created() {
  },
  mounted() {
    this.getInsurancePolicyList()
  },
  methods: {

    // 获取保单列表
    getInsurancePolicyList(params) {
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

<style type="text/scss"  lang="scss">
  .policy-table-expand {
    font-size: 0;
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 25%;
      label {
        color: #99a9bf;
      }
    }
  }
</style>
