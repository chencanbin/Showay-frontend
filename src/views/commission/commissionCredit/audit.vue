<template>
  <span id="audit">
    <el-button type="text" size="small" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">外发</el-button>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('commission.credit.set.audit_title')"
      width="400px">
      <el-form ref="audit" label-position="left" label-width="150px">
        <el-form-item :label="$t('client.insurance_policy.number')">
          {{ commissionCredit.insurancePolicy.number }}
        </el-form-item>
        <el-form-item :label="$t('commission.credit.year')">
          {{ $t('commission.credit.years',[commissionCredit.year]) }}
        </el-form-item>
        <el-form-item :label="$t('common.calculatedAmount')">
          {{ getSymbol(commissionCredit.currency) + ' ' + formatterCurrency(commissionCredit.calculatedAmount) }}
        </el-form-item>
        <el-form-item v-if="commissionCredit.currency !== 'HKD'" :label="$t('commission.credit.calculatedAmountInHkd')">
          {{ 'HK$ ' + formatterCurrency(commissionCredit.calculatedAmountInHkd) }}
        </el-form-item>
        <el-form-item v-if="commissionCredit.currency !== 'HKD'" :label="$t('common.exchangeRate')">
          {{ commissionCredit.exchangeRateToHkd }}
        </el-form-item>
        <el-form-item :label="$t('common.amount')">
          {{ 'HK$ ' + formatterCurrency(commissionCredit.amount) }}
        </el-form-item>
        <el-form-item :label="$t('common.remarks')" prop="remarks">
          {{ commissionCredit.remarks }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="rejectLoading" @click="handleReject">{{ $t('commission.credit.rollback') }}</el-button>
        <el-button :loading="clearLoading" type="primary" @click="handleClear">{{ $t('commission.credit.pay') }}</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { getSymbol } from '@/utils'
import elDragDialog from '@/directive/el-dragDialog'
const currencyFormatter = require('currency-formatter')

export default {
  directives: { elDragDialog },
  props: {
    sort: {
      type: String,
      default() {
        return ''
      }
    },
    order: {
      type: String,
      default() {
        return ''
      }
    },
    wildcard: {
      type: String,
      default() {
        return ''
      }
    },
    dateRange: {
      type: Array,
      default() {
        return []
      }
    },
    activeName: {
      type: String,
      default() {
        return ''
      }
    },
    commissionCredit: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      rejectLoading: false,
      clearLoading: false
    }
  },
  methods: {
    initForm() {
      this.dialogVisible = true
    },
    handleReject() {
      this.rejectLoading = true
      this.$api.commission.CommissionCreditReject({ ids: [this.commissionCredit.id] }).then(_ => {
        this.$message({
          message: this.$t('common.success'),
          type: 'success',
          duration: 5 * 1000
        })
        if (this.dateRange) {
          this.$store.dispatch('commission/FetchCommissionCredit', { status: this.activeName, geDueDate: this.dateRange[0], leDueDate: this.dateRange[1], wildcard: this.wildcard, sort: this.sort, order: this.order })
        } else {
          this.$store.dispatch('commission/FetchCommissionCredit', { status: this.activeName, wildcard: this.wildcard, sort: this.sort, order: this.order })
        }
        this.dialogVisible = false
        this.rejectLoading = false
      }).catch(_ => {
        this.rejectLoading = false
      })
    },
    formatterCurrency(value) {
      return currencyFormatter.format(Math.floor(value * 100) / 100, { symbol: '' })
    },
    getSymbol,
    handleClear() {
      this.clearLoading = true
      this.$api.commission.CommissionCreditClear({ ids: [this.commissionCredit.id] }).then(_ => {
        this.$message({
          message: this.$t('common.success'),
          type: 'success',
          duration: 5 * 1000
        })
        this.$store.dispatch('commission/FetchCommissionCredit', { status: this.activeName })
        this.dialogVisible = false
        this.clearLoading = false
      }).catch(_ => {
        this.clearLoading = false
      })
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
  #audit {
    .el-dialog__body {
      padding: 20px 60px;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
  }
</style>
