<template>
  <span>
    <el-button :loading="loading" type="text" size="small" @click="initForm">{{ this.$t('common.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('product.company.set.edit_title')"
      width="600px"
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
        <el-button type="primary" circle icon="el-icon-plus" size="mini" style="position: absolute; top: 408px; left: 12px;" @click="addWebsites"/>
        <el-form-item v-for="(item, index) in company.websites" :key="index" :label="'系统地址' + (index + 1)">
          <el-input v-model="item.name" :class="company.websites.length > 1 ? 'halfWidth' : 'fullWidth'"/>
          <el-input v-model="item.remark" style="width: 115px" placeholder="备注"/>
          <el-button v-if="company.websites.length > 1" icon="el-icon-remove-outline" size="small" style="min-width: 50px; font-size: 20px; padding: 6px; vertical-align: bottom;" @click="removeWebsite(index)"/>
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
const _ = require('lodash')
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
        contractEffectiveDate: '',
        websites: []
      },
      rule: {
        en: [{ required: true, message: this.$t('product.company.set.verify_message.name_en'), trigger: 'blur' }],
        zh: [{ required: true, message: this.$t('product.company.set.verify_message.name_zh'), trigger: 'blur' }],
        acronym: [{ required: true, message: this.$t('product.company.set.verify_message.acronym'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    addWebsites() {
      this.company.websites.push({ name: '', remark: '' })
    },
    removeWebsite(index) {
      this.company.websites.splice(index, 1)
    },
    initForm() {
      this.company.websites = []
      this.$api.company.getCompany(this.id).then(res => {
        this.company.acronym = res.data.acronym
        this.company.secondary = res.data.secondary
        this.company.en = res.data.en
        this.company.zh = res.data.zh
        this.company.address = res.data.address
        this.company.email = res.data.email
        this.company.phone = res.data.phone
        if (res.data.websites.length === 0) {
          this.company.websites = [{ name: '' }]
        } else {
          res.data.websites.forEach(item => {
            const website = item.split('-')
            if (website.length === 1) {
              this.company.websites.push({ name: item })
            } else {
              this.company.websites.push({ name: website[0], remark: website[1] })
            }
          })
        }
        // this.company.websites = res.data.websites

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
          const data = _.cloneDeep(this.company)
          const websites = []
          this.company.websites.forEach(item => {
            websites.push(item.name + '-' + item.remark)
          })
          data.websites = websites
          this.$api.company.editCompany(this.id, data).then(_ => {
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
  .fullWidth {
    width: 72%;
  }
  .halfWidth {
    width: 60%;
  }
</style>
