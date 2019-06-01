<template>
  <span>
    <el-button type="text" size="small" @click="initForm">{{ this.$t('common.edit') }}</el-button>
    <el-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('template.set.edit_template')"
      :fullscreen="true"
      class="edit_template"
      append-to-body>
      <basic-container>
        <el-form label-width="80px" style="width: 100%; padding: 10px; margin-left: auto; margin-right: auto">
          <el-form-item :label="$t('template.title')">
            <el-input v-model="title" :disabled="isBuiltin"/>
          </el-form-item>
        </el-form>
        <el-card class="box-card" style="width: 100%; height: 550px; margin-left: auto; margin-right: auto">
          <div slot="header" class="clearfix">
            <span>简体中文</span>
          </div>
          <el-form label-width="80px" style="padding: 10px;">
            <el-form-item label="主题">
              <el-input v-model="zh_CN.subject"/>
            </el-form-item>
            <el-form-item label="签名">
              <el-input v-model="zh_CN.signature"/>
            </el-form-item>
            <el-form-item label="正文">
              <tinymce v-if="active" v-model="zh_CN.body" :height="300"/>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card class="box-card" style="width: 100%; height: 550px; margin-left: auto; margin-right: auto">
          <div slot="header" class="clearfix">
            <span>繁体中文</span>
          </div>
          <el-form label-width="80px" style="padding: 10px;">
            <el-form-item label="主題">
              <el-input v-model="zh_TW.subject"/>
            </el-form-item>
            <el-form-item label="签名">
              <el-input v-model="zh_TW.signature"/>
            </el-form-item>
            <el-form-item label="正文">
              <tinymce v-if="active" v-model="zh_TW.body" :height="300" />
            </el-form-item>
          </el-form>
        </el-card>
        <el-card class="box-card" style="width: 100%; height: 550px; margin-left: auto; margin-right: auto">
          <div slot="header" class="clearfix">
            <span>English</span>
          </div>
          <el-form label-width="80px" style="padding: 10px;">
            <el-form-item label="Subject">
              <el-input v-model="en.subject"/>
            </el-form-item>
            <el-form-item label="Signature">
              <el-input v-model="en.signature"/>
            </el-form-item>
            <el-form-item label="Body">
              <tinymce v-if="active" v-model="en.body" :height="300" />
            </el-form-item>
          </el-form>
        </el-card>
        <div style="text-align: center; margin-bottom: 15px">
          <el-button :loading="loading" type="primary" @click="saveTemplate()">{{ $t('common.submitButton') }}</el-button>
        </div>
      </basic-container>
    </el-dialog>
  </span>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
  name: 'Template',
  components: { Tinymce },
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
      loading: false,
      active: false,
      isBuiltin: false,
      dialogVisible: false,
      title: '',
      sendEmailLoading: false,
      zh_CN: {
        subject: '',
        body: '',
        signature: ''
      },
      zh_TW: {
        subject: '',
        body: '',
        signature: ''
      },
      en: {
        subject: '',
        body: '',
        signature: ''
      }
    }
  },
  methods: {
    initForm() {
      this.dialogVisible = true
      this.active = true
      this.$api.template.getTemplateById(this.id).then(res => {
        this.title = res.data.title
        this.isBuiltin = res.data.isBuiltin
        if (res.data.subject) {
          res.data.subject.forEach(item => {
            if (item.locale === 'en') {
              this.en.subject = item.name
            } else if (item.locale === 'zh_CN') {
              this.zh_CN.subject = item.name
            } else if (item.locale === 'zh_TW') {
              this.zh_TW.subject = item.name
            }
          })
        }
        if (res.data.body) {
          res.data.body.forEach(item => {
            if (item.locale === 'en') {
              this.en.body = item.name
            } else if (item.locale === 'zh_CN') {
              this.zh_CN.body = item.name
            } else if (item.locale === 'zh_TW') {
              this.zh_TW.body = item.name
            }
          })
        }
        if (res.data.signature) {
          res.data.signature.forEach(item => {
            if (item.locale === 'en') {
              this.en.signature = item.name
            } else if (item.locale === 'zh_CN') {
              this.zh_CN.signature = item.name
            } else if (item.locale === 'zh_TW') {
              this.zh_TW.signature = item.name
            }
          })
        }
      })
    },
    handleClose() {
      this.active = false
      this.dialogVisible = false
    },
    saveTemplate() {
      this.loading = true
      let data = {
        body: {
          localizedNames: [
            { locale: 'en', name: this.en.body },
            { locale: 'zh_CN', name: this.zh_CN.body },
            { locale: 'zh_TW', name: this.zh_TW.body }
          ]
        },
        subject: {
          localizedNames: [
            { locale: 'en', name: this.en.subject },
            { locale: 'zh_CN', name: this.zh_CN.subject },
            { locale: 'zh_TW', name: this.zh_TW.subject }
          ]
        },
        signature: {
          localizedNames: [
            { locale: 'en', name: this.en.signature },
            { locale: 'zh_CN', name: this.zh_CN.signature },
            { locale: 'zh_TW', name: this.zh_TW.signature }
          ]
        }
      }
      if (!this.isBuiltin) {
        data = Object.assign({ title: this.title }, data)
      }
      this.$api.template.editTemplateById(this.id, data).then(res => {
        this.loading = false
        this.handleClose()
        this.$emit('submitSuccess')
      }).catch(_ => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
  .edit_template {
    .el-dialog__body {
      padding: 10px;
    }
  }
  .box-card {
    margin-bottom: 10px;
  }
</style>
