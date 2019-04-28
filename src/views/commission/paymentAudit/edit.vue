<template>
  <span>
    <el-button type="text" size="small" icon="el-icon-edit" @click="initForm">{{ this.$t('common.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="编辑发放记录"
      width="400px"
      append-to-body>
      <el-form ref="payment" :model="payment" label-width="80px">
        <el-form-item :label="$t('client.insurance_policy.number')" prop="number">
          {{ payment.insurancePolicy.number }}
        </el-form-item>
        <el-form-item :label="$t('commission.payment.calculatedAmount')" prop="calculatedAmount">
          {{ 'HK$ ' + formatterCurrency(payment.calculatedAmountInHkd) }}
        </el-form-item>
        <el-form-item :label="$t('commission.payment.amount')" prop="amount">
          <!--<el-input v-model="payment.amount" placeholder="请输入实发数额">-->
          <!--<template slot="prepend">{{ getSymbol(payment.currency) }}</template>-->
          <!--</el-input>-->
          <currency-input v-model="payment.amount" placeholder="请输入实发" symbol="HK$ "/>
        </el-form-item>
        <el-form-item :label="$t('common.remarks')" prop="remarks">
          <el-input v-model="payment.remarks" :placeholder="$t('common.remarks_placeholder')"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ $t('common.submitButton') }}</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import currencyInput from '@/components/CurrencyInput'
import elDragDialog from '@/directive/el-dragDialog'
const currencyFormatter = require('currency-formatter')
import { getSymbol } from '@/utils'

const _ = require('lodash')
export default {
  directives: { elDragDialog },
  components: {
    currencyInput
  },
  props: {
    payment: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      paymentCopy: {}
    }
  },
  methods: {
    initForm() {
      this.paymentCopy = _.cloneDeep(this.payment)
      this.dialogVisible = true
      this.payment.amount = this.payment.predictedAmountInHkd
    },
    handleClose() {
      this.payment.amount = this.paymentCopy.amount
      this.dialogVisible = false
    },
    formatterCurrency(value) {
      return currencyFormatter.format(Math.floor(value * 100) / 100, { symbol: '' })
    },
    getSymbol,
    handleSubmit() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
</style>
