<template>
  <span>
    <el-button :loading="loading" type="text" icon="el-icon-edit" size="small" @click="initForm">{{ this.$t('common.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('product.company.set.edit_contact_title')"
      top="50px"
      width="500px"
      append-to-body>
      <el-form ref="contact" :model="contact" label-width="110px">
        <el-form-item :label="$t('product.company.set.contacts_name')" prop="name">
          <el-input ref="name" v-model="contact.name" autofocus/>
        </el-form-item>
        <el-form-item :label="$t('product.company.set.contacts_title')" prop="title">
          <el-input v-model="contact.title"/>
        </el-form-item>
        <el-form-item :label="$t('product.company.set.contacts_phone')" prop="phone">
          <el-input v-model="contact.phone"/>
        </el-form-item>
        <el-form-item :label="$t('product.company.set.contacts_email')" prop="email">
          <el-input v-model="contact.email"/>
        </el-form-item>
        <el-form-item :label="$t('product.company.set.contacts_address')" prop="address">
          <el-input v-model="contact.address"/>
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
import elDragDialog from '@/directive/el-dragDialog'
const _ = require('lodash')

export default {
  directives: { elDragDialog },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    company: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      contact: {}
    }
  },
  methods: {
    initForm() {
      this.dialogVisible = true
      this.contact = _.cloneDeep(this.data)
    },
    handleClose() {
      this.$refs['contact'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['contact'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.company.editCompanyContact(this.contact.id, this.contact).then(_ => {
            this.$message({
              message: this.$t('common.success'),
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('company/FetchCompanyContact', { company: this.company.id })
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
