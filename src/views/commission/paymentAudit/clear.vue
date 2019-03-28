<template>
  <span>
    <el-button type="text" size="mini" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">结清</el-button>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="结清佣金"
      top="50px"
      width="600px">
      <el-form ref="clear" :model="clear" label-width="100px">
        <el-form-item label="支票号码" prop="chequeNumber">
          <el-input v-model="clear.chequeNumber" placeholder="请输入支票号码"/>
        </el-form-item>
        <el-form-item label="支票扫描件" prop="chequeCopy">
          <image-upload :cheque-copy="clear.chequeCopy" @afterComplete="setChequeCopy"/>
        </el-form-item>
        <el-form-item label="备注" prop="chequeNumber">
          <el-input v-model="clear.remarks" placeholder="请输入备注"/>
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
      this.dialogVisible = true
    },
    handleClose() {
      this.$refs['clear'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['clear'].validate((valid) => {
        if (valid) {
          this.$api.commission.mergedPaymentClear(this.id, this.clear).then(_ => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('commission/FetchAuditPayment', { status: 2 })
            this.handleClose()
          })
        } else {
          return false
        }
      })
    },
    setChequeCopy(key) {
      this.clear.chequeCopy = key
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
</style>
