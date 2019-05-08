<template>
  <span>
    <el-button type="text" size="small" icon="el-icon-edit" @click="initForm">{{ this.$t('common.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('document.edit_title')"
      top="50px"
      width="450px"
      append-to-body>
      <el-form ref="folder" :model="folder" :rules="rule" label-width="100px">
        <el-form-item :label="$t('document.file_name')" prop="name">
          <el-input ref="folderName" v-model="folder.name" autofocus @submit.native.prevent/>
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
    folderId: {
      type: Number,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      folder: {
        id: 0,
        name: '',
        parent: 1
      },
      rule: {
        name: [{ required: true, message: this.$t('document.set.file_name'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    initForm() {
      this.folder = _.cloneDeep(this.data)
      this.dialogVisible = true
      this.$nextTick(function() {
        this.$refs.folderName.focus()
      })
    },
    handleClose() {
      this.$refs['folder'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['folder'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.data.resourceKey) {
            this.$api.document.editFile(this.folder.id, this.folder).then(_ => {
              this.$message({
                message: this.$t('common.success'),
                type: 'success',
                duration: 5 * 1000
              })
              this.$store.dispatch('document/FetchFolderById', { id: this.folderId })
              this.handleClose()
              this.loading = false
            }).catch(_ => {
              this.loading = false
            })
          } else {
            this.$api.document.editFolder(this.folder.id, this.folder).then(_ => {
              this.$message({
                message: this.$t('common.success'),
                type: 'success',
                duration: 5 * 1000
              })
              this.$store.dispatch('document/FetchFolderById', { id: this.folderId })
              this.handleClose()
              this.loading = false
            }).catch(_ => {
              this.loading = false
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
