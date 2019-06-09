<template>
  <span id="clearedDetail">
    <el-button type="text" size="small" @click="initForm">{{ $t('commission.payment.payment_detail') }}</el-button>
    <el-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      :fullscreen="true"
      :title= "generateTitle()">
      <el-table
        v-loading="mergedPaymentLoading"
        :max-height="height"
        :data="mergedPayment.payments"
        stripe
        border>
        <el-table-column :label="$t('client.insurance_policy.number')" prop="insurancePolicy.number" show-overflow-tooltip>
          <template slot-scope="scope">
            <policy-detail :policy-number="scope.row.insurancePolicy.number" :id="scope.row.insurancePolicy.id"/>
          </template>
        </el-table-column>
        <el-table-column :label="$t('client.insurance_policy.insured_name')" prop="insurancePolicy.beneficiary" width="120"/>
        <el-table-column :label="$t('commission.credit.year')" width="100">
          <template slot-scope="scope">
            <span>{{ $t('commission.credit.years',[scope.row.year]) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('client.insurance_policy.premium')" min-width="100px">
          <template slot-scope="scope">
            <span class="left_text">{{ getSymbol(scope.row.currency) }}</span><span class="right_text">{{ formatterCurrency(scope.row.premium) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('commission.payment.premiumInHkd')" min-width="120px">
          <template slot-scope="scope">
            <div v-if="scope.row.currency !== 'HKD'">
              <span class="left_text">HK$ </span><span class="right_text">{{ formatterCurrency(scope.row.premiumInHkd) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.exchangeRate')" prop="exchangeRateToHkd" width="140">
          <template slot-scope="scope">
            <div v-if="scope.row.currency !== 'HKD'" style="float: right">
              {{ scope.row.exchangeRateToHkd }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.commission_rate')">
          <template slot-scope="scope">
            <div style="float: right">{{ formatPercent(scope.row.commissionRate) }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('commission.payment.amount')" prop="amount" min-width="100px">
          <template slot-scope="scope">
            <span class="left_text">HK$ </span><span class="right_text">{{ formatterCurrency(scope.row.amount) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import { getSymbol } from '@/utils'
import CountTo from 'vue-count-to'
import policyDetail from '../../client/policy/policyDetail'

const _ = require('lodash')
const currencyFormatter = require('currency-formatter')
export default {
  name: 'MergedPayment',
  components: {
    CountTo,
    policyDetail
  },
  props: {
    channel: {
      type: Object,
      default() {
        return {}
      }
    },
    chequeNumber: {
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
      approveLoading: false,
      selectSum: 0
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
    initForm() {
      this.getMergedPayment()
      this.dialogVisible = true
    },
    getRandom() {
      return Math.random()
    },
    generateTitle() {
      return `${this.$t('commission.payment.payment_detail')} - ${this.$t('commission.payment.chequeNumber')} : ${this.chequeNumber}`
    },
    generateButtonText() {
      // if (this.status === '-1') {
      //   return this.$t('commission.payment.generated_list')
      // } else if (this.status === '0') {
      //   return this.$t('commission.payment.audit_list')
      // }
    },
    getSymbol,
    handleClose() {
      this.dialogVisible = false
    },
    getMergedPayment() {
      this.$store.dispatch('commission/FetchMergedPayment', { id: this.id, params: { channel: this.channel.id }})
    },
    formatterCurrency(value) {
      return currencyFormatter.format(Math.floor(value * 100) / 100, { symbol: '' })
    },
    formatPercent(value) {
      return _.toNumber(value).toFixed(2) + '%'
    },
    handleReject() {
      this.rejectLoading = true
      this.$api.commission.mergedPaymentReject(this.id).then(_ => {
        this.$message({
          message: this.$t('common.success'),
          type: 'success',
          duration: 5 * 1000
        })
        this.$store.dispatch('commission/FetchAuditPayment', { status: 3 })
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
          message: this.$t('common.success'),
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
      this.$confirm(this.$t('commission.payment.tooltip.audit'), this.$t('common.prompt'), {
        confirmButtonText: this.$t('common.confirmButton'),
        cancelButtonText: this.$t('common.cancelButton'),
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
<style lang="scss" rel="stylesheet/scss" type="text/scss">
  #clearedDetail {
    .el-dialog__body {
      padding: 5px 20px;
    }
    tr:nth-child(odd) td {
      background-color: #ffffff;
    }
    tr:nth-child(even) td {
      background-color: #fafafa;
    }
  }
</style>
