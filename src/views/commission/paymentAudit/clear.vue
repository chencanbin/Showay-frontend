<template>
  <span>
    <el-button type="text" size="small" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">结清</el-button>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('commission.payment.cleared_title')"
      top="50px"
      width="600px">
      <el-form ref="clear" :model="clear" label-width="100px">
        <el-form-item :label="$t('commission.payment.chequeNumber')" prop="chequeNumber">
          <el-input v-model="clear.chequeNumber" :placeholder="$t('commission.payment.set.chequeNumber')"/>
        </el-form-item>
        <el-form-item :label="$t('commission.payment.chequeCopy')" prop="chequeCopy">
          <image-upload :cheque-copy="clear.chequeCopy" @afterComplete="setChequeCopy"/>
        </el-form-item>
        <el-form-item :label="$t('user.effectiveDate')" prop="effectiveDate">
          <el-date-picker
            v-model="clear.chequeIssueDate"
            :placeholder="$t('user.set.effectiveDate')"
            type="date"
            value-format="timestamp"
            style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('common.remarks')" prop="chequeNumber">
          <el-input v-model="clear.remarks" :placeholder="$t('common.remarks_placeholder')"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">{{ $t('common.submitButton') }}</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import imageUpload from '@/components/upload/imageUpload'
import elDragDialog from '@/directive/el-dragDialog'

export default {
  directives: { elDragDialog },
  components: {
    imageUpload
  },
  props: {
    id: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      clear: {
        chequeNumber: '',
        chequeCopy: '',
        chequeIssueDate: '',
        remarks: ''
      },
      dialogVisible: false,
      loading: false
    }
  },
  methods: {
    initForm() {
      this.dialogVisible = true
    },
    handleClose() {
      this.$refs['clear'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['clear'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.commission.mergedPaymentClear(this.id, this.clear).then(_ => {
            this.$message({
              message: this.$t('common.success'),
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('commission/FetchAuditPayment', { status: 2 })
            this.handleClose()
            this.loading = false
          }).catch(_ => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    setChequeCopy(key) {
      console.log(key)
      this.clear.chequeCopy = key
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
</style>
