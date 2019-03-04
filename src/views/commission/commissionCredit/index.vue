<template>
  <div class="table-container">
    <basic-container>
      <el-table v-loading="loading" :max-height="height" :data="commissionCredit.list" stripe border>
        <el-table-column label="保单号" prop="insurancePolicy.number" min-width="120px"/>
        <el-table-column label="投保人" prop="insurancePolicy.applicant.name"/>
        <el-table-column label="期序" prop="year"/>
        <el-table-column :formatter="formatterIssueDate" label="签发日期" prop="insurancePolicy.issueDate" min-width="100"/>
        <el-table-column label="应发数额" min-width="140">
          <template slot-scope="scope">
            <span class="left_text">{{ getSymbol(scope.row.currency) }}</span><span class="right_text">{{ formatterCurrency(scope.row.calculatedAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实发数额" prop="amount" min-width="140">
          <template slot-scope="scope">
            <span class="left_text">{{ getSymbol(scope.row.currency) }}</span><span class="right_text">{{ formatterCurrency(scope.row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template slot-scope="scope">
            <statusBadge v-if="scope.row.status === 0" :text="statusFormatter(scope.row.status)" type="processing-badge"/>
            <statusBadge v-if="scope.row.status === 1" :text="statusFormatter(scope.row.status)" type="success-badge"/>
            <statusBadge v-if="scope.row.status === 2" :text="statusFormatter(scope.row.status)"/>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remarks" min-width="150"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <edit v-if="scope.row.status !== 2" :commission-credit="scope.row"/>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="commissionCredit.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
    </basic-container>
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import statusBadge from '@/components/StatusBadge'
import edit from './edit'
import { mapGetters, mapState } from 'vuex'
import { creditStatus } from '@/utils/constant'
import { parseTime } from '@/utils'
import Cookies from 'js-cookie'
const currencyFormatter = require('currency-formatter')
const _ = require('lodash')
export default {
  name: 'CommissionCredit',
  components: {
    pagination,
    statusBadge,
    edit
  },
  data() {
    return {
      language: Cookies.get('language') || 'en',
      height: window.screen.height - 290,
      listQuery: {
        page: 1,
        limit: 50
      }
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({ commissionCredit: state => state.commission.commissionCredit })
  },
  created() {
    this.getCommissionCreditList()
  },
  methods: {
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该管理员账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.user.deleteUser(row.id).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getUsers()
        })
      })
    },
    formatterIssueDate(row, column) {
      const date = row.insurancePolicy.issueDate
      return parseTime(date, '{y}-{m}-{d}')
    },
    formatterCurrency(value) {
      return currencyFormatter.format(value, { symbol: '' })
    },
    statusFormatter(value) {
      let result = ''
      _.forEach(creditStatus, item => {
        if (item.id === value) {
          result = item[this.language]
          return
        }
      })
      return result
    },
    getSymbol(currency) {
      if (currency === 'HKD') {
        return 'HK$'
      } else if (currency === 'USD') {
        return '$'
      } else if (currency === 'CNY') {
        return '￥'
      }
    },
    getCommissionCreditList(params) {
      // this.$api.commission.fetchCommissionCredit(param).then(res => {
      //     this.commissionCredit = res.data
      // })
      this.$store.dispatch('commission/FetchCommissionCredit', params)
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit
      const max = pageObj.limit
      const params = { offset, max }
      this.getCommissionCreditList(params)
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
<style>
  .left_text {
    display: inline-block;
    float: left;
  }
  .right_text {
    display: inline-block;
    float: right;
  }
</style>
