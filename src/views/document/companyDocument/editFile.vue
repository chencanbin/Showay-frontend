<template>
  <span>
    <el-button type="text" size="small" icon="el-icon-edit" @click="initForm">{{ this.$t('action.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      title="编辑文件"
      width="450px"
      append-to-body>
      <el-form ref="file" :model="file" :rules="rule" label-width="100px">
        <el-form-item label="文件名:" prop="name">
          <el-input ref="fileName" v-model="file.name" autofocus @submit.native.prevent/>
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
    id: {
      type: Number,
      default() {
        return 0
      }
    },
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
      file: {
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
      this.file = _.cloneDeep(this.data)
      this.dialogVisible = true
      this.$nextTick(function() {
        this.$refs.fileName.focus()
      })
    },
    handleClose() {
      this.$refs['file'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['file'].validate((valid) => {
        this.loading = true
        if (valid) {
          this.$api.document.editFile(this.file.id, this.file).then(_ => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('document/FetchFolderById', { id: this.id })
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
