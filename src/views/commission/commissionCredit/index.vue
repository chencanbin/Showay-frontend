<template>
  <div id="credit" class="table-container">
    <basic-container>
      <!--<el-form :inline="true" style="display: inline-block; position: absolute; right: 10px; z-index: 1000;">-->
      <!--<el-form-item label="切换排序">-->
      <!--<el-switch v-model="mode">-->
      <!--</el-switch>-->
      <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<component v-bind:is="getComponent"></component>-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="status in creditStatus"
          :key="status.id"
          :name="status.id + ''"
          :label="statusFormatter(status.id)">
          <el-form :inline="true" class="search-input" @submit.native.prevent>
            <el-form-item v-if="activeName === '1' && selectData.length > 0">
              <el-button type="primary" size="small" @click="batchPay">批量外发</el-button>
            </el-form-item>
            <el-form-item label="" prop="wildcard">
              <el-input
                v-model="wildcard"
                clearable
                placeholder="搜索(保单号 | 投保人)"
                @input="search">
                <i slot="prefix" class="el-input__icon el-icon-search"/>
              </el-input>
            </el-form-item>
            <el-form-item label="" prop="dateRange">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp"
                @change="onDateRangeChange"/>
            </el-form-item>
            <el-form-item label="切换排序">
              <el-switch v-model="mode" @change="onSwitchChange"/>
            </el-form-item>
          </el-form>
          <el-tag class="tag-sum" type="success">
            <i class="el-icon-info" style="margin-right: 5px"/>
            <span style="margin-right: 30px;">{{ selectTotalText }}:
              <count-to
                :start-val="0"
                :end-val="selectTotal"
                :duration="2000"
                suffix="条"
                style="font-weight: bold;"/>
            </span>
            <span style="margin-right: 30px">{{ selectSumText }}:
              <count-to
                :start-val="0"
                :end-val="selectSum"
                :duration="2000"
                prefix="HK$"
                style="font-weight: bold;"/>
            </span>
            <span style="margin-right: 30px">{{ totalText }}:
              <count-to
                :start-val="0"
                :end-val="commissionCredit.total"
                :duration="2000"
                suffix="条"
                style="font-weight: bold;"/>
            </span>
            <span>{{ sumText }}:
              <count-to
                :start-val="0"
                :end-val="sum"
                :duration="2000"
                prefix="HK$"
                style="font-weight: bold; font-size: 16px"/>
            </span>
          </el-tag>
          <el-table
            v-loading="loading"
            :row-key="getRandom"
            :height="height"
            :data="commissionCredit.list"
            :row-class-name="tableRowClassName"
            border
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40" align="center"/>
            <el-table-column label="保单号" prop="insurancePolicy.number" min-width="100px" show-overflow-tooltip/>
            <el-table-column label="保费" min-width="140">
              <template slot-scope="scope">
                <span class="left_text">{{ getSymbol(scope.row.currency) }}</span><span class="right_text">{{ formatterCurrency(scope.row.insurancePolicy.premium) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="投保人" prop="insurancePolicy.applicant.name" show-overflow-tooltip/>
            <el-table-column label="期序" prop="year" align="center"/>
            <el-table-column
              :formatter="formatterIssueDate"
              label="申请日期"
              prop="insurancePolicy.submitDate"
              min-width="100"/>
            <el-table-column
              :formatter="formatterIssueDate"
              label="生效日期"
              prop="insurancePolicy.issueDate"
              min-width="100"/>
            <el-table-column label="应发" min-width="120">
              <template slot-scope="scope">
                <span class="left_text">{{ getSymbol(scope.row.currency) }}</span><span class="right_text">{{ formatterCurrency(scope.row.calculatedAmount) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="实发" prop="amount" min-width="120">
              <template slot-scope="scope">
                <span class="left_text">HK$</span>
                <span class="right_text">{{ formatterCurrency(scope.row.amount) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" min-width="80" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 0" style="color: #409eff;" >{{ statusFormatter(scope.row.status) }}</el-tag>
                <el-tag v-if="scope.row.status === 1" type="warning">{{ statusFormatter(scope.row.status) }}</el-tag>
                <el-tag v-if="scope.row.status === 2" type="success">{{ statusFormatter(scope.row.status) }}</el-tag>
                <el-tag v-if="scope.row.status === 3" type="success">{{ statusFormatter(scope.row.status) }}</el-tag>
                <!--<statusBadge v-if="scope.row.status === 0" :text="statusFormatter(scope.row.status)" type="processing-badge"/>-->
                <!--<statusBadge v-if="scope.row.status === 1" :text="statusFormatter(scope.row.status)" type="warning-badge"/>-->
                <!--<statusBadge v-if="scope.row.status === 2" :text="statusFormatter(scope.row.status)" type="error-badge"/>-->
                <!--<statusBadge v-if="scope.row.status === 3" :text="statusFormatter(scope.row.status)" type="success-badge"/>-->
              </template>
            </el-table-column>
            <!--<el-table-column label="备注" prop="remarks" min-width="140"/>-->
            <el-table-column v-if="activeName !== '2'" label="操作">
              <template slot-scope="scope">
                <edit
                  v-if="scope.row.status === 0"
                  :commission-credit="scope.row"
                  :active-name="activeName"/>
                <audit v-if="scope.row.status === 1" :commission-credit="scope.row" :active-name="activeName"/>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :total="commissionCredit.total"
            :page="listQuery.page"
            :limit="listQuery.limit"
            @pagination="pagination"
            @update:page="updatePage"
            @update:limit="updateLimit"/>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import { mapGetters, mapState } from 'vuex'
import { parseTime, getSymbol } from '@/utils'
import { creditStatus } from '@/utils/constant'
import edit from './edit'
import audit from './audit'
import Cookies from 'js-cookie'
import CountTo from 'vue-count-to'
const currencyFormatter = require('currency-formatter')
const _ = require('lodash')

export default {
  name: 'CommissionCredit',
  components: {
    pagination,
    edit,
    audit,
    CountTo
  },
  data() {
    return {
      mode: false,
      dateRange: '',
      totalText: '',
      sumText: '',
      selectTotalText: '',
      selectSumText: '',
      height: window.screen.height - 390,
      creditStatus,
      language: Cookies.get('language') || 'zh-CN',
      activeName: '0',
      wildcard: '',
      sum: 0,
      total: 0,
      selectTotal: 0,
      selectSum: 0,
      queryCondition: {},
      listQuery: {
        page: 1,
        limit: 50
      },
      selectRow: [],
      selectData: []
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({ commissionCredit: state => state.commission.commissionCredit })
  },
  watch: {
    selectData(data) {
      this.selectRow = []
      if (data.length > 0) {
        data.forEach((item, index) => {
          this.selectRow.push(this.commissionCredit.list.indexOf(item))
        })
      }
    }
  },
  created() {
    this.commissionCredit.total = 0
    this.queryCondition = { status: this.activeName, wildcard: this.wildcard, sort: 'year,submitDate', order: 'asc,desc' }
    this.getCommissionCreditList()
  },
  methods: {
    search: _.debounce(function() {
      this.getCommissionCreditList({ wildcard: this.wildcard })
    }, 500),
    getCommissionCreditSum(params) {
      let data = { status: this.activeName, wildcard: this.wildcard }
      if (this.dateRange) {
        data = _.assign(data, { geDueDate: this.dateRange[0], leDueDate: this.dateRange[1] })
      }
      data = _.assign(data, params)
      this.$api.commission.getCommissionCreditSum(data).then(res => {
        this.sum = Number(res.data.sum)
      })
    },
    getCommissionCreditList(params) {
      if (this.dateRange) {
        this.queryCondition = _.assign(this.queryCondition, { geDueDate: this.dateRange[0], leDueDate: this.dateRange[1] })
      }
      this.queryCondition = _.assign(this.queryCondition, params)
      this.$store.dispatch('commission/FetchCommissionCredit', this.queryCondition)
      if (this.activeName === '0') {
        this.totalText = '预计待收总数'
        this.sumText = '预计待收总额'
        this.selectTotalText = '已选预计待收总数'
        this.selectSumText = '已选预计待收总额'
        this.getCommissionCreditSum({ calculated: '' })
      } else if (this.activeName === '1') {
        this.totalText = '已到账总数'
        this.sumText = '已到账总额'
        this.selectTotalText = '已选已到账总数'
        this.selectSumText = '已选已到账总额'
        this.getCommissionCreditSum({ amount: '' })
      } else if (this.activeName === '3') {
        this.totalText = '已结清总数'
        this.sumText = '已结清总额'
        this.selectTotalText = '已选已结清总数'
        this.selectSumText = '已选已结清总额'
        this.getCommissionCreditSum({ amount: '' })
      }
    },
    getSymbol,
    formatterCurrency(value) {
      return currencyFormatter.format(value, { symbol: '' })
    },
    formatterIssueDate(row, column) {
      const date = row.insurancePolicy.issueDate
      return parseTime(date, '{y}-{m}-{d}')
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
    getRandom() {
      return Math.random()
    },
    handleTabClick() {
      this.queryCondition.status = this.activeName
      this.getCommissionCreditList()
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
    },
    onDateRangeChange(value) {
      this.getCommissionCreditList()
    },
    onSwitchChange() {
      if (this.mode) {
        const query = { status: this.activeName, sort: 'number,issueDate', order: 'desc,desc', wildcard: this.wildcard }
        this.queryCondition = query
        this.getCommissionCreditList()
      } else {
        const query = { status: this.activeName, sort: 'year,submitDate', order: 'asc,desc', wildcard: this.wildcard }
        this.queryCondition = query
        this.getCommissionCreditList()
      }
    },
    handleSelectionChange(selected) {
      this.selectData = selected
      this.selectTotal = selected.length
      let calculatedAmountInHkd = 0
      _.forEach(selected, item => {
        calculatedAmountInHkd = calculatedAmountInHkd + Number(item.calculatedAmountInHkd)
      })
      this.selectSum = calculatedAmountInHkd
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.selectRow.includes(rowIndex)) {
        return 'selected-row'
      }
    },
    batchPay() {
      const ids = []
      _.forEach(this.selectData, item => {
        ids.push(item.id)
      })
      this.$confirm('是否批量处理已选中的记录?', '提示', {
        confirmButtonText: '外发',
        cancelButtonText: '取消',
        type: 'warning',
        callback: (action, instance) => {
          if (action === 'confirm') {
            this.$api.commission.CommissionCreditClear({ ids: ids }).then(_ => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 5 * 1000
              })
              this.$store.dispatch('commission/FetchCommissionCredit', { status: this.activeName })
              this.dialogVisible = false
            })
          }
        }
      })
      //   .then(() => {
      //   this.$api.commission.CommissionCreditClear(ids).then(_ => {
      //     this.$message({
      //       message: '操作成功',
      //       type: 'success',
      //       duration: 5 * 1000
      //     })
      //     this.$store.dispatch('commission/FetchCommissionCredit', {status: this.activeName})
      //     this.dialogVisible = false
      //   })
      // }).catch(() => {
      //   this.$api.commission.CommissionCreditReject(ids).then(_ => {
      //     this.$message({
      //       message: '操作成功',
      //       type: 'success',
      //       duration: 5 * 1000
      //     })
      //     this.$store.dispatch('commission/FetchCommissionCredit', {status: this.activeName})
      //     this.dialogVisible = false
      //   })
      // })
      // // this.$api.commission.CommissionCreditClear(this.commissionCredit.id).then(_ => {
      //   this.$message({
      //     message: '操作成功',
      //     type: 'success',
      //     duration: 5 * 1000
      //   })
      //   this.$store.dispatch('commission/FetchCommissionCredit', {status: this.activeName})
      //   this.dialogVisible = false
      // })
    }
  }

}
</script>
<style type="text/scss" lang="scss">
  .left_text {
    display: inline-block;
    float: left;
  }

  .right_text {
    display: inline-block;
    float: right;
  }

  #credit {
    .el-card__body {
      padding: 10px
    }
    .el-table tr td:first-child {
      padding-left: 0px;
    }
    .search-input {
      margin-top: 0;
    }
  }

  .tag-sum {
    margin-bottom: 10px;
    width: 100%;
    font-size: 14px;
    line-height: 35px;
    height: 35px;
  }
  .el-table .selected-row {
    background: #e1eedc;
  }
  .el-table .selected-row:hover {
    td {
      background: #e1eedc!important;
    }
  }
</style>
