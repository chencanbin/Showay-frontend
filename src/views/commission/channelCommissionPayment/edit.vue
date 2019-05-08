<template>
  <span>
    <el-button type="text" size="mini" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">{{ this.$t('action.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      title="编辑到账记录"
      width="400px">
      <el-form ref="payment" :model="payment" label-width="80px">
        <el-form-item label="保单号" prop="name">
          {{ commissionPayment.insurancePolicy.number }}
        </el-form-item>
        <el-form-item label="应发" prop="name">
          {{ getSymbol(commissionPayment.currency) + formatterCurrency(commissionPayment.calculatedAmount) }}
        </el-form-item>
        <el-form-item label="期序" prop="name">
          {{ commissionPayment.year }}
        </el-form-item>
        <el-form-item label="实发" prop="name">
          <el-input v-model="payment.amount" placeholder="请输入实发">
            <template slot="prepend">{{ getSymbol(payment.currency) }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="payment.status"
            placeholder="请选择状态"
            style="width: 100%">
            <el-option
              v-for="item in commissionPaymentStatus"
              :key="item.id"
              :label="item[language]"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="支票号码" prop="chequeNumber">
          <el-input v-model="payment.chequeNumber" placeholder="请输入支票号码"/>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="payment.remarks" placeholder="请输入备注"/>
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
import { commissionPaymentStatus } from '@/utils/constant'
import { getSymbol } from '@/utils'
import Cookies from 'js-cookie'
const currencyFormatter = require('currency-formatter')
const _ = require('lodash')
export default {
  directives: { elDragDialog },
  props: {
    activeName: {
      type: Number,
      default() {
        return 0
      }
    },
    commissionPayment: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      language: 'en',
      commissionPaymentStatus,
      roles: [],
      payment: {
        id: '',
        status: '',
        amount: '',
        chequeNumber: '',
        remarks: ''
      },
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    initForm() {
      this.language = Cookies.get('language') || 'zh-CN'
      this.payment = _.cloneDeep(this.commissionPayment)
      this.dialogVisible = true
    },
    formatterCurrency(value) {
      return currencyFormatter.format(Math.floor(value * 100) / 100, { symbol: '' })
    },
    getSymbol,
    handleClose() {
      this.$refs['payment'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['payment'].validate((valid) => {
        if (valid) {
          this.$api.channel.editChannelCommissionPayment(this.payment.id, this.payment).then(_ => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('client/FetchChannelCommissionPayment', { status: this.activeName })
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
