<template>
  <span>
    <el-button type="text" size="small" @click="initForm">{{ $t('common.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('client.info.set.edit_title')"
      width="450px"
      top="50px"
      append-to-body>
      <el-form ref="client" :model="client" :rules="rule" label-width="100px">
        <el-form-item :label="$t('client.info.type')" prop="type">
          <el-select
            v-model="client.isOrganization"
            style="width: 100%">
            <el-option key="0" :label="$t('client.info.individual')" :value="false"/>
            <el-option key="1" :label="$t('client.info.organization')" :value="true"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('client.info.name')" prop="zh">
          <el-input v-model="client.zh" :placeholder="$t('client.info.set.name')"/>
        </el-form-item>
        <el-form-item :label="$t('client.info.enName')" prop="en">
          <el-input v-model="client.en" :placeholder="$t('client.info.set.enName')"/>
        </el-form-item>
        <el-form-item :label="$t('client.info.idNumber')" prop="idNumber">
          <el-input v-model="client.idNumber" :placeholder="client.isOrganization ? $t('client.info.set.organization_id') : $t('client.info.set.idNumber')"/>
        </el-form-item>
        <el-form-item v-show="!client.isOrganization" :label="$t('client.info.sex')" prop="sex">
          <el-radio-group v-model="client.sex">
            <el-radio :label="0">{{ $t('client.info.male') }}</el-radio>
            <el-radio :label="1">{{ $t('client.info.female') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="!client.isOrganization" :label="$t('client.info.locale')" prop="locale">
          <el-select v-model="client.locale" filterable style="width: 100%">
            <el-option-group v-for="group in country" :key="group.label" :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.code"
                :label="item[language]"
                :value="item.code"/>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item :label="client.isOrganization ? $t('client.info.established_time') : $t('client.info.birthday')" prop="birthday">
          <el-date-picker
            v-model="client.birthday"
            :placeholder="client.isOrganization ? $t('client.info.set.established_time') : $t('client.info.set.birthday')"
            style="width: 100%"
            type="date"/>
        </el-form-item>
        <el-form-item :label="$t('client.info.phone')" prop="phone">
          <el-input v-model="client.phone" :placeholder="$t('client.info.set.phone')"/>
        </el-form-item>
        <el-form-item :label="$t('client.info.email')" prop="email">
          <el-input v-model="client.email" :placeholder="$t('client.info.set.email')"/>
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
import { country } from '@/utils/country'
import Cookies from 'js-cookie'
import elDragDialog from '@/directive/el-dragDialog'

export default {
  directives: { elDragDialog },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    listQuery: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      language: 'en',
      country: [{
        label: this.$t('client.info.commonly_use_country'),
        options: [{ 'code': 'CN', 'zh-TW': '中國', 'en': 'China', 'zh-CN': '中国' },
          { 'code': 'HK', 'zh-TW': '香港', 'en': 'Hong Kong', 'zh-CN': '香港' }]
      }, {
        label: this.$t('client.info.all_country'),
        options: country
      }],
      dialogVisible: false,
      loading: false,
      client: {},
      rule: {
        idNumber: [{ required: true, message: this.$t('client.info.set.idNumber'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    initForm() {
      this.language = Cookies.get('language') || 'zh-CN'
      this.$api.client.getClientById(this.data.id).then(res => {
        this.client = res.data
      })
      this.dialogVisible = true
    },
    handleClose() {
      this.$refs['client'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['client'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.client.updateClient(this.client.id, this.client).then(_ => {
            this.$message({
              message: this.$t('common.success'),
              type: 'success',
              duration: 5 * 1000
            })
            const offset = (this.listQuery.page - 1) * this.listQuery.limit
            const max = this.listQuery.limit
            this.$store.dispatch('client/FetchClientList', { params: { offset, max }})
            this.handleClose()
            this.loading = false
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
