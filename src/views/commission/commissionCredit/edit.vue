<template>
  <span class="credit-edit">
    <el-button type="text" size="mini" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">{{ this.$t('action.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="编辑到账记录"
      top="50px"
      width="400px">
      <div v-if="locked && credit.currency !== 'HKD'" class="lock-icon" @click="unlockCalculate()">
        <svg-icon icon-class="lock"/>
      </div>
      <div v-if="!locked && credit.currency !== 'HKD'" class="lock-icon" @click="lockCalculate()">
        <svg-icon icon-class="unlock" />
      </div>
      <el-form ref="credit" :model="credit" label-width="90px">
        <el-form-item label="保单号" prop="name">
          {{ commissionCredit.insurancePolicy.number }}
        </el-form-item>
        <el-form-item label="期序" prop="name">
          第{{ commissionCredit.year }}期
        </el-form-item>
        <el-form-item label="保费" prop="name">
          {{ getSymbol(commissionCredit.currency) + formatterCurrency(commissionCredit.premium) }}
        </el-form-item>
        <el-form-item label="佣金率" prop="name">
          {{ formatterNumber(commissionCredit.commissionRate) + '%' }}
        </el-form-item>
        <el-form-item label="应收" prop="name">
          {{ getSymbol(commissionCredit.currency) + formatterCurrency(commissionCredit.calculatedAmount) }}
        </el-form-item>
        <el-form-item v-if="credit.currency !== 'HKD'" label="汇率" prop="exchangeRateToHkd" >
          <el-input v-model="credit.exchangeRateToHkd" placeholder="请输入汇率" @input="onExchangeRateInput"/>
        </el-form-item>
        <el-form-item label="实收">
          <currency-input ref="amount" :value="credit.amount" symbol="HK$ " @input="onAmountInput" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="credit.remarks" placeholder="请输入备注"/>
        </el-form-item>
        <el-form-item v-if="isBoolean(credit.ffyap)" label="FFYAP" prop="name">
          <el-checkbox v-model="credit.ffyap"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import elDragDialog from '@/directive/el-dragDialog'
import currencyInput from '@/components/CurrencyInput'
import { getSymbol } from '@/utils'
const currencyFormatter = require('currency-formatter')

const _ = require('lodash')
export default {
  directives: { elDragDialog },
  components: {
    currencyInput
  },
  props: {
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
        return 0
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
      credit: {
        id: '',
        ffyap: '',
        remarks: '',
        amount: '',
        exchangeRateToHkd: ''
      },
      locked: true,
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  created() {
  },
  methods: {
    initForm() {
      this.credit = _.cloneDeep(this.commissionCredit)
      this.$nextTick(function() {
        this.$refs['amount'].currencyValue = Number(this.credit.calculatedAmountInHkd).toFixed(2)
      })
      this.dialogVisible = true
    },
    isBoolean(value) {
      return typeof value === 'boolean'
    },
    handleClose() {
      this.$refs['credit'].resetFields()
      this.dialogVisible = false
    },
    formatterCurrency(value) {
      return currencyFormatter.format(value, { symbol: '' })
    },
    getSymbol,
    handleSubmit() {
      this.$refs['credit'].validate((valid) => {
        if (valid) {
          this.$api.commission.editCommissionCredit(this.credit.id, this.credit).then(_ => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            if (this.dateRange) {
              this.$store.dispatch('commission/FetchCommissionCredit', { status: this.activeName, geDueDate: this.dateRange[0], leDueDate: this.dateRange[1], wildcard: this.wildcard })
            } else {
              this.$store.dispatch('commission/FetchCommissionCredit', { status: this.activeName, wildcard: this.wildcard })
            }
            this.handleClose()
          })
        } else {
          return false
        }
      })
    },
    formatterNumber(value) {
      return _.toNumber(value).toFixed(2)
    },
    unlockCalculate() {
      this.locked = !this.locked
    },
    lockCalculate() {
      this.locked = !this.locked
    },
    onAmountInput(val) {
      this.credit.amount = val
      if (this.locked) {
        if (parseInt(this.credit.calculatedAmount) === 0) {
          return
        }
        this.credit.exchangeRateToHkd = (val / this.credit.calculatedAmount).toFixed(2)
      }
    },
    onExchangeRateInput(val) {
      if (this.locked) {
        this.credit.amount = (val * this.credit.calculatedAmount).toFixed(2)
        this.$refs.amount.onChange(this.credit.amount)
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
  .credit-edit {
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-form-item--medium .el-form-item__content, .el-form-item--medium .el-form-item__label {
      line-height: 30px;
    }
  }
  .lock-icon {
    display: inline-block;
    position: absolute;
    top: 296px;
    font-size: 18px;
    z-index: 1000;
  }
</style>
