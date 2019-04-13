<template>
  <el-col span.number="24" class="el-table-add-col">
    <div class="el-table-add-row" @click="initForm"><span>+ 添加文件夾</span></div>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="添加文件夾"
      top="50px"
      width="450px">
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
  </el-col>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import elDragDialog from '@/directive/el-dragDialog'
export default {
  directives: { elDragDialog },
  data() {
    return {
      dialogVisible: false,
      folder: {
        name: '',
        parent: '1'
      },
      rule: {
        name: [{ required: true, message: '请输入文件名', trigger: 'blur' }]
      }
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
      this.$refs['folder'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['folder'].validate((valid) => {
        if (valid) {
          this.$api.document.createFolder(this.folder).then(_ => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('document/FetchFolderById', { id: 1 })
            this.handleClose()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
