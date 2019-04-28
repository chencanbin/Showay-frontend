<template>
  <span>
    <el-button :loading="loading" type="text" icon="el-icon-edit" size="small" @click="initForm">{{ this.$t('common.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="$t('product.company.set.edit_title')"
      width="500px"
      append-to-body>
      <el-form ref="company" :model="company" :rules="rule" label-width="120px">
        <el-form-item :label="$t('product.company.set.name_en')" prop="en">
          <el-input v-model="company.en"/>
        </el-form-item>
        <el-form-item :label="$t('product.company.set.name_zh')" prop="zh">
          <el-input v-model="company.zh"/>
        </el-form-item>
        <el-form-item :label="$t('product.company.set.acronym')" prop="acronym">
          <el-input v-model="company.acronym"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="company.phone"/>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="company.email"/>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="company.address"/>
        </el-form-item>
        <el-form-item label="系统地址" prop="website">
          <el-input v-model="company.website"/>
        </el-form-item>
        <el-form-item :label="$t('product.company.set.contractEffectiveDate')" prop="contractEffectiveDate">
          <el-date-picker
            v-model="company.contractEffectiveDate"
            type="date"
            value-format="timestamp"
            style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('product.company.set.secondary')" prop="secondary">
          <el-switch
            v-model="company.secondary"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">{{ $t('common.submitButton') }}</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import elDragDialog from '@/directive/el-dragDialog'
export default {
  directives: { elDragDialog },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      company: {
        acronym: '',
        secondary: false,
        en: '',
        zh: '',
        phone: '',
        email: '',
        address: '',
        website: '',
        contractEffectiveDate: ''
      },
      rule: {
        en: [{ required: true, message: this.$t('product.company.set.verify_message.name_en'), trigger: 'blur' }],
        zh: [{ required: true, message: this.$t('product.company.set.verify_message.name_zh'), trigger: 'blur' }],
        acronym: [{ required: true, message: this.$t('product.company.set.verify_message.acronym'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    initForm() {
      this.$api.company.getCompany(this.id).then(res => {
        this.company.acronym = res.data.acronym
        this.company.secondary = res.data.secondary
        this.company.en = res.data.en
        this.company.zh = res.data.zh
        this.company.address = res.data.address
        this.company.email = res.data.email
        this.company.phone = res.data.phone
        this.company.website = res.data.website
        this.company.contractEffectiveDate = res.data.contractEffectiveDate
        this.dialogVisible = true
      })
    },
    handleClose() {
      this.$refs['company'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['company'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.company.editCompany(this.id, this.company).then(_ => {
            this.$message({
              message: this.$t('common.success'),
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('company/FetchCompanyList')
            this.loading = false
            this.handleClose()
          }).catch(_ => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">

</style>
