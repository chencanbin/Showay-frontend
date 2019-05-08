<template>
  <span>
    <el-button type="text" size="small" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">审核</el-button>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      center
      title="到账审核"
      width="400px">
      <el-form ref="credit" :model="credit" label-width="150px">
        <el-form-item label="保单号" prop="name">
          {{ commissionCredit.insurancePolicy.number }}
        </el-form-item>
        <el-form-item label="应发" prop="name">
          {{ getSymbol(commissionCredit.currency) + formatterCurrency(commissionCredit.calculatedAmount) }}
        </el-form-item>
        <el-form-item label="期序" prop="name">
          第{{ commissionCredit.year }}期
        </el-form-item>
        <el-form-item label="实发" prop="name">
          {{ formatterCurrency(commissionCredit.amount) }}
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          {{ commissionCredit.remarks }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="danger" @click="handleReject">拒绝</el-button>
        <el-button :loading="loading" type="primary" @click="handleClear">批准</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import elDragDialog from '@/directive/el-dragDialog'
import { getSymbol } from '@/utils'
const currencyFormatter = require('currency-formatter')

export default {
  directives: { elDragDialog },
  props: {
    activeName: {
      type: Number,
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
      this.$api.commission.CommissionCreditReject(this.commissionCredit.id).then(_ => {
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
      return currencyFormatter.format(Math.floor(value * 100) / 100, { symbol: '' })
    },
    getSymbol,
    handleClear() {
      this.$api.commission.CommissionCreditClear(this.commissionCredit.id).then(_ => {
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
}
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
</style>
