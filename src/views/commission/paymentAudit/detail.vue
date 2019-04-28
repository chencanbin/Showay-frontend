<template>
  <span id="paymentDetail">
    <el-button type="text" size="small" @click="initForm">{{ generateButtonText() }}</el-button>
    <el-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      :title= "generateTitle()"
      :fullscreen="true"
      center>
      <el-row v-permission="[1]" style="margin-bottom: 10px">
        <el-button v-if="status === '-1'" :disabled="disableSubmit" type="primary" @click="handleSubmit">{{ $t('commission.payment.submit_audit') }}</el-button>
        <span style="margin-left: 20px;">已选中实发金额:
          <count-to
            :start-val="0"
            :end-val="selectSum"
            :duration="2000"
            decimals="2"
            prefix="HK$ "
            style="font-weight: bold;"/>
        </span>
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
        <el-table-column :label="$t('client.insurance_policy.number')" prop="insurancePolicy.number" show-overflow-tooltip/>
        <el-table-column :label="$t('client.insurance_policy.beneficiary_name')" prop="insurancePolicy.beneficiary" width="80"/>
        <el-table-column :label="$t('commission.credit.year')" width="80">
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
        <el-table-column :label="$t('common.exchangeRate')" prop="exchangeRateToHkd" width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.currency !== 'HKD'" style="float: right">
              {{ scope.row.exchangeRateToHkd }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('commission.payment.calculatedAmountInHkd')" min-width="100px">
          <template slot-scope="scope">
            <span class="left_text">HK$ </span><span class="right_text">{{ formatterCurrency(scope.row.calculatedAmountInHkd) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('commission.payment.predictedAmountInHkd')" prop="amount" min-width="100px">
          <template slot-scope="scope">
            <span class="left_text">HK$ </span><span class="right_text">{{ formatterCurrency(scope.row.predictedAmountInHkd) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('commission.payment.amount')" prop="amount" min-width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.amount">
              <span class="left_text">HK$ </span><span class="right_text">{{ formatterCurrency(scope.row.amount) }}</span>
            </div>
            <div v-else>
              <span class="left_text">HK$ </span><span class="right_text">{{ formatterCurrency(scope.row.predictedAmountInHkd) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.commission_rate')">
          <template slot-scope="scope">
            <div style="float: right">{{ formatPercent(scope.row.commissionRate) }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPermission([1]) && status === '-1'" :label="$t('common.action')">
          <template slot-scope="scope">
            <edit :payment="scope.row" :key="scope.row.id"/>
          </template>
        </el-table-column>
      </el-table>
      <div v-permission="[1, 3]" v-if="status === '0'" slot="footer" class="dialog-footer">
        <el-button :loading="rejectLoading" @click="handleReject">{{ $t('common.reject') }}</el-button>
        <el-button :loading="approveLoading" type="primary" @click="handleApprove">{{ $t('common.approve') }}</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import edit from './edit'
import { getSymbol } from '@/utils'
import checkPermission from '@/utils/permission' // 权限判断函数
import CountTo from 'vue-count-to'

import permission from '@/directive/permission/index.js' // 权限判断指令

const _ = require('lodash')
const currencyFormatter = require('currency-formatter')
export default {
  name: 'MergedPayment',
  components: {
    edit,
    CountTo
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
        return `${this.channel.name} ${this.$t('commission.payment.audit_commission')}`
      } else if (this.status === '0') {
        return `${this.channel.name} ${this.$t('commission.payment.audit_commission')}`
      }
    },
    generateButtonText() {
      if (this.status === '-1') {
        return this.$t('commission.payment.generated_list')
      } else if (this.status === '0') {
        return this.$t('commission.payment.audit_list')
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
      return currencyFormatter.format(Math.floor(value * 100) / 100, { symbol: '' })
    },
    handleSelectionChange(val) {
      this.selectedRow = val
      let selectSum = 0
      _.forEach(val, item => {
        if (item.amount) {
          selectSum = selectSum + _.toFinite(item.amount)
        } else {
          selectSum = selectSum + _.toFinite(item.predictedAmountInHkd)
        }
      })
      this.selectSum = selectSum
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
<style lang="scss" rel="stylesheet/scss">
  #paymentDetail .el-dialog__body {
    padding: 5px 20px;
  }
</style>
