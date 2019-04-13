<template>
  <el-upload
    :disabled="disabled"
    :http-request="uploadFile"
    :show-file-list="false"
    action="">
    <el-button :loading="loading" size="small" type="primary" disable>{{ buttonText + percentCompleted }}</el-button>
  </el-upload>
</template>

<script>
import axios from 'axios'

export default {
  name: 'FileUpload',
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
      fileList: [],
      percentCompleted: '',
      buttonText: '上传文件',
      loading: false,
      disabled: false
    }
  },
  methods: {
    // 文件上传
    async uploadFile(params) {
      this.loading = true
      this.disabled = true
      this.buttonText = '正在上传...'
      console.log(params)
      const _file = params.file
      const isLt20M = _file.size / 1024 / 1024 < 20
      // 通过 FormData 对象上传文件
      const formData = new FormData()
      formData.append('file', _file)
      if (!isLt20M) {
        this.$message.error('请上传20M以下的文件')
        return false
      }
      let url = ''
      if (this.id === 1) {
        await this.$api.document.getCompanyToken(_file.uid).then(res => {
          url = res.data.url
        })
      } else if (this.id === 2) {
        await this.$api.document.getPrivateToken(_file.uid).then(res => {
          url = res.data.url
        })
      }
      const config = {
        onUploadProgress: (progressEvent) => {
          this.percentCompleted = '(' + Math.round((progressEvent.loaded * 100) / progressEvent.total) + '%' + ')'
        }
      }
      axios.put(url, formData, config).then(res => {
        this.loading = false
        this.disabled = false
        this.buttonText = '添加文件'
        this.percentCompleted = ''
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          this.$api.document.createFile({
            'name': _file.name,
            'parent': this.id,
            'size': _file.size,
            'extension': _file.type,
            'resourceKey': _file.uid
          })
        } else {
          this.$message({
            type: 'error',
            message: res.statusText
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
