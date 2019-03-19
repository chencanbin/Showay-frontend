<template>
  <span>
    <el-button type="text" size="mini" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">外发</el-button>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      center
      title="到账审核"
      width="400px">
      <el-form ref="audit" label-width="150px">
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
          {{ getSymbol(commissionCredit.currency) + formatterCurrency(commissionCredit.amount) }}
        </el-form-item>
        <el-form-item label="兑港币汇率" prop="name">
          {{ commissionCredit.exchangeRateToHkd }}
        </el-form-item>
        <!--<el-form-item label="备注" prop="remarks">-->
        <!--{{commissionCredit.remarks}}-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="danger" @click="handleReject">退回待发</el-button>
        <el-button :loading="loading" type="primary" @click="handleClear">外发</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSymbol } from '@/utils'
import elDragDialog from '@/directive/el-dragDialog'
const currencyFormatter = require('currency-formatter')

export default {
  directives: { elDragDialog },
  props: {
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
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    initForm() {
      this.dialogVisible = true
    },
    handleReject() {
      this.$api.commission.CommissionCreditReject({ ids: [this.commissionCredit.id] }).then(_ => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.$store.dispatch('commission/FetchCommissionCredit', { status: this.activeName })
        this.dialogVisible = false
      })
    },
    formatterCurrency(value) {
      return currencyFormatter.format(value, { symbol: '' })
    },
    getSymbol,
    handleClear() {
      this.$api.commission.CommissionCreditClear({ ids: [this.commissionCredit.id] }).then(_ => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.$store.dispatch('commission/FetchCommissionCredit', { status: this.activeName })
        this.dialogVisible = false
      })
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
</style>
