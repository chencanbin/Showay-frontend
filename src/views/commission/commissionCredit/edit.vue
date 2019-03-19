<template>
  <span>
    <el-button type="text" size="mini" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">{{ this.$t('action.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="编辑到账记录"
      width="400px">
      <el-form ref="credit" :model="credit" label-width="80px">
        <el-form-item label="保单号" prop="name">
          {{ commissionCredit.insurancePolicy.number }}
        </el-form-item>
        <el-form-item label="应发数额" prop="name">
          {{ getSymbol(commissionCredit.currency) + formatterCurrency(commissionCredit.calculatedAmount) }}
        </el-form-item>
        <el-form-item label="期序" prop="name">
          第{{ commissionCredit.year }}期
        </el-form-item>
        <el-form-item label="实发数额" prop="name">
          <currency-input v-model="credit.amount" symbol="HK$"/>
        </el-form-item>
        <el-form-item v-if="credit.currency !== 'HKD'" label="汇率" prop="exchangeRateToHkd" >
          <el-input v-model="credit.exchangeRateToHkd" placeholder="请输入汇率"/>
        </el-form-item>
        <el-form-item v-if="credit.ffyap" label="FFYAP" prop="name">
          <el-checkbox v-model="credit.ffyap"/>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="credit.remarks" placeholder="请输入备注"/>
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
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    initForm() {
      this.credit = _.cloneDeep(this.commissionCredit)
      this.dialogVisible = true
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
            this.$store.dispatch('commission/FetchCommissionCredit', { status: this.activeName })
            this.handleClose()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
</style>
