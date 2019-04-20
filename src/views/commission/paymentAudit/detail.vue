<template>
  <span id="paymentDetail">
    <el-button v-loading="loading" type="text" size="mini" @click="initForm">{{ generateButtonText() }}</el-button>
    <el-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      :title= "generateTitle()"
      :fullscreen="true"
      center>
      <el-row v-permission="[1]" style="margin-bottom: 10px">
        <el-button v-if="status === '-1'" :disabled="disableSubmit" type="primary" @click="handleSubmit">提交审核</el-button>
      </el-row>
      <el-table
        v-loading="mergedPaymentLoading"
        :max-height="height"
        :data="mergedPayment.payments"
        stripe
        border
        @selection-change="handleSelectionChange">
        <el-table-column
          v-if="checkPermission([1]) && status === '-1'"
          align="center"
          type="selection"
          width="55" />
        <el-table-column label="保单号" prop="insurancePolicy.number" show-overflow-tooltip/>
        <el-table-column label="受保人" prop="insurancePolicy.beneficiary" width="80"/>
        <el-table-column label="期序" width="80">
          <template slot-scope="scope">
            <span>第 {{ scope.row.year }} 期</span>
          </template>
        </el-table-column>
        <el-table-column label="保费">
          <template slot-scope="scope">
            <span class="left_text">{{ getSymbol(scope.row.currency) }}</span><span class="right_text">{{ formatterCurrency(scope.row.premium) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="保费等额港币">
          <template slot-scope="scope">
            <div v-if="scope.row.currency !== 'HKD'">
              <span class="left_text">HK$ </span><span class="right_text">{{ formatterCurrency(scope.row.premiumInHkd) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="汇率" prop="exchangeRateToHkd" width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.currency !== 'HKD'" style="float: right">
              {{ scope.row.exchangeRateToHkd }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="预计应发">
          <template slot-scope="scope">
            <span class="left_text">HK$ </span><span class="right_text">{{ formatterCurrency(scope.row.calculatedAmountInHkd) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预计实发" prop="amount">
          <template slot-scope="scope">
            <span class="left_text">HK$ </span><span class="right_text">{{ formatterCurrency(scope.row.predictedAmountInHkd) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实发" prop="amount">
          <template slot-scope="scope">
            <div v-if="scope.row.amount">
              <span class="left_text">HK$ </span><span class="right_text">{{ formatterCurrency(scope.row.amount) }}</span>
            </div>
            <div v-else>
              <span class="left_text">HK$ </span><span class="right_text">{{ formatterCurrency(scope.row.predictedAmountInHkd) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="佣金率">
          <template slot-scope="scope">
            <div style="float: right">{{ formatPercent(scope.row.commissionRate) }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPermission([1]) && status === '-1'" label="操作">
          <template slot-scope="scope">
            <edit :payment="scope.row" :key="scope.row.id"/>
          </template>
        </el-table-column>
      </el-table>
      <div v-permission="[1, 3]" v-if="status === '0'" slot="footer" class="dialog-footer">
        <el-button :loading="rejectLoading" @click="handleReject">拒绝</el-button>
        <el-button :loading="approveLoading" type="primary" @click="handleApprove">批准</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import edit from './edit'
import { getSymbol } from '@/utils'
import checkPermission from '@/utils/permission' // 权限判断函数
import permission from '@/directive/permission/index.js' // 权限判断指令

const _ = require('lodash')
const currencyFormatter = require('currency-formatter')
export default {
  name: 'MergedPayment',
  components: {
    edit
  },
  directives: { permission },
  props: {
    channel: {
      type: Object,
      default() {
        return {}
      }
    },
    status: {
      type: String,
      default() {
        return ''
      }
    },
    id: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      height: window.screen.height - 220,
      dialogVisible: false,
      selectedRow: [],
      rejectLoading: false,
      approveLoading: false
    }
  },
  computed: {
    ...mapState({
      mergedPayment: state => state.commission.mergedPayment,
      mergedPaymentLoading: state => state.commission.mergedPaymentLoading
    }),
    disableSubmit: function() {
      return this.selectedRow.length === 0
    }
  },
  methods: {
    checkPermission,
    initForm() {
      this.getMergedPayment()
      this.dialogVisible = true
    },
    getRandom() {
      return Math.random()
    },
    generateTitle() {
      if (this.status === '-1') {
        return `${this.channel.name} 待发放佣金`
      } else if (this.status === '0') {
        return `${this.channel.name} 待审核佣金`
      }
    },
    generateButtonText() {
      if (this.status === '-1') {
        return '待发放列表'
      } else if (this.status === '0') {
        return '待审核列表'
      }
    },
    getSymbol,
    handleClose() {
      this.dialogVisible = false
    },
    getMergedPayment() {
      this.$store.dispatch('commission/FetchMergedPayment', { id: this.id, params: { channel: this.channel.id }})
    },
    formatterCurrency(value) {
      return currencyFormatter.format(value, { symbol: '' })
    },
    handleSelectionChange(val) {
      this.selectedRow = val
    },
    formatPercent(value) {
      return _.toNumber(value).toFixed(2) + '%'
    },
    handleReject() {
      this.rejectLoading = true
      this.$api.commission.mergedPaymentReject(this.id).then(_ => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.$store.dispatch('commission/FetchAuditPayment', { status: 0 })
        this.dialogVisible = false
        this.rejectLoading = false
      }).catch(_ => {
        this.rejectLoading = false
      })
    },
    handleApprove() {
      this.approveLoading = true
      this.$api.commission.mergedPaymentApprove(this.id).then(_ => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.$store.dispatch('commission/FetchAuditPayment', { status: 0 })
        this.dialogVisible = false
        this.approveLoading = false
      }).catch(_ => {
        this.approveLoading = false
      })
    },
    handleSubmit() {
      this.$confirm('此操作会将选中的渠道佣金记录提交审核, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            const data = []
            _.forEach(this.selectedRow, item => {
              let obj = {}
              if (item.amount) {
                obj = { id: item.id, amount: item.amount }
              } else {
                obj = { id: item.id, amount: item.predictedAmountInHkd }
              }
              // if(item.currency !== 'HKD') {
              //   obj.exchangeRate = item.exchangeRateToHkd
              // }
              data.push(obj)
            })
            this.$api.commission.mergedPayment({ payments: data }).then(res => {
              this.getMergedPayment()
              this.$store.dispatch('commission/FetchAuditPayment', { status: -1 })
              instance.confirmButtonLoading = false
              done()
            }).catch(_ => {
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  #paymentDetail .el-dialog__body {
    padding: 5px 20px;
  }
</style>
