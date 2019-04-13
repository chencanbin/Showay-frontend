<template>
  <el-upload
    :disabled="disabled"
    :http-request="uploadFile"
    :show-file-list="false"
    action="">
    <el-button :loading="loading" size="small" icon="el-icon-upload" type="primary" disable>{{ buttonText + percentCompleted }}</el-button>
  </el-upload>
</template>

<script>
import axios from 'axios'

export default {
  name: 'FileUpload',
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
      const _file = params.file
      const isLt20M = _file.size / 1024 / 1024 < 20
      // 通过 FormData 对象上传文件
      if (!isLt20M) {
        this.$message.error('请上传20M以下的文件')
        return false
      }
      let url = ''
      await this.$api.document.getCompanyToken(_file.uid).then(res => {
        url = res.data.url
      }).catch(_ => {
        this.buttonText = '上传文件'
        this.percentCompleted = ''
        this.disableUpload = false
        this.loading = false
        return false
      })
      if (!url) {
        return false
      }
      const config = {
        onUploadProgress: (progressEvent) => {
          this.percentCompleted = '(' + Math.round((progressEvent.loaded * 100) / progressEvent.total) + '%' + ')'
        }
      }
      axios.put(url, _file, config).then(res => {
        this.loading = false
        this.disabled = false
        this.buttonText = '上传文件'
        this.percentCompleted = ''
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          this.$emit('afterComplete', _file)
        } else {
          this.$message({
            type: 'error',
            message: res.statusText
          })
        }
      }).catch(error => {
        if (error && error.response) {
          console.log(error.response)
        }
        this.buttonText = '上传文件'
        this.percentCompleted = ''
        this.disableUpload = false
        this.loading = false
        return false
      })
    }
  }
}
</script>
