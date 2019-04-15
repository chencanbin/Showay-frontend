<template>
  <span>
    <el-button type="text" size="mini" icon="el-icon-edit" @click="initForm">{{ this.$t('action.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="编辑文件夾"
      top="50px"
      width="450px"
      append-to-body>
      <el-form ref="folder" :model="folder" :rules="rule" label-width="100px">
        <el-form-item label="文件夹名:" prop="name">
          <el-input v-model="folder.name" @submit.native.prevent/>
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
        name: [{ required: true, message: '请输入文件名', trigger: 'blur' }]
      }
    }
  },
  methods: {
    initForm() {
      this.folder = _.cloneDeep(this.data)
      this.dialogVisible = true
    },
    handleClose() {
      this.$refs['folder'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['folder'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.document.editFolder(this.folder.id, this.folder).then(_ => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('document/FetchFolderById', { id: 2 })
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
