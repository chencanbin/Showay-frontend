<template>
  <div>
    <el-upload
      :disabled="disableUpload"
      :http-request="uploadFile"
      :show-file-list="false"
      action=""
      name="iconFile"
      list-type="picture-card"
      class="banner-uploader">
      <img v-if="imgSrc" :src="imgSrc" class="banner">
      <el-progress v-if="percentCompleted > 0" :percentage="percentCompleted" type="circle" style="position: absolute; top: 10px; left: 165px"/>
      <i v-if="percentCompleted === 0 && !imgSrc" class="el-icon-plus banner_upload_img"/>
    </el-upload>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ImageUpload',
  props: {
    chequeCopy: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      imgSrc: '',
      percentCompleted: 0,
      disableUpload: false
    }
  },
  methods: {
    // 文件上传
    async uploadFile(params) {
      this.disableUpload = true
      this.imgSrc = ''
      const _file = params.file
      const isLt2M = _file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.disableUpload = false
        this.$message.error('请上传2M以下的文件')
        return false
      }
      let url = ''
      await this.$api.document.getCompanyToken(_file.name).then(res => {
        url = res.data.url
      }).catch(_ => {
        this.percentCompleted = 0
        this.disableUpload = false
        return false
      })
      if (!url) {
        return false
      }
      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          this.percentCompleted = percentCompleted
        }
      }
      axios.put(url, _file, config).then(res => {
        this.percentCompleted = 0
        this.disableUpload = false
        if (res.status === 200) {
          this.$api.document.getCompanyDownloadLink(_file.name).then(res => {
            this.imgSrc = res.data.url
            this.$emit('afterComplete', _file.name)
          })
          this.$message({
            type: 'success',
            message: '上传成功'
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

<style lang="scss" rel="stylesheet/scss" type="text/scss">
  .banner-uploader .el-upload--picture-card {
    width: 100%;
    height: 100%;
  }

  .banner-uploader .el-upload {
    width: 100%;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .banner {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
