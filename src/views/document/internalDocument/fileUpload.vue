<template>
  <el-upload v-loading="loading" :disabled="disabled" :http-request="uploadFile" :show-file-list="false" class="file-upload" drag action="">
    <i class="el-icon-upload" />
    <div class="el-upload__text">{{ $t("document.upload_tips") }}</div>
    <!--<el-button :loading="loading" size="small" icon="el-icon-upload" type="primary" disable>{{ buttonText + percentCompleted }}</el-button>-->
  </el-upload>
</template>

<script>
import axios from "axios";

export default {
  name: "FileUpload",
  data() {
    return {
      fileList: [],
      percentCompleted: "",
      buttonText: "上传文件",
      loading: false,
      disabled: false,
    };
  },
  methods: {
    // 文件上传
    async uploadFile(params) {
      this.loading = true;
      this.disabled = true;
      this.buttonText = "正在上传...";
      const _file = params.file;
      const isLt100M = _file.size / 1024 / 1024 < 100;
      // 通过 FormData 对象上传文件
      if (!isLt100M) {
        this.$message.error(this.$t("document.upload_error"));
        return false;
      }
      let url = "";
      await this.$api.document
        .getPrivateToken(_file.uid)
        .then((res) => {
          url = res.data.url;
        })
        .catch((_) => {
          this.buttonText = "上传文件";
          this.percentCompleted = "";
          this.disableUpload = false;
          this.loading = false;
          return false;
        });
      if (!url) {
        return false;
      }
      const config = {
        onUploadProgress: (progressEvent) => {
          this.percentCompleted =
            "(" +
            Math.round((progressEvent.loaded * 100) / progressEvent.total) +
            "%" +
            ")";
        },
      };
      axios
        .put(url, _file, config)
        .then((res) => {
          this.loading = false;
          this.disabled = false;
          this.buttonText = "上传文件";
          this.percentCompleted = "";
          if (res.status === 200) {
            this.$message({
              type: "success",
              message: this.$t("common.success"),
            });
            this.$emit("afterComplete", _file);
          } else {
            this.$message({
              type: "error",
              message: res.statusText,
            });
          }
        })
        .catch((error) => {
          if (error && error.response) {
            console.log(error.response);
          }
          this.buttonText = "上传文件";
          this.percentCompleted = "";
          this.disableUpload = false;
          this.loading = false;
          return false;
        });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">
.file-upload .el-upload {
  margin-top: 20px;
  width: 100%;
  height: 150px;
}
.file-upload .el-upload-dragger {
  width: 100%;
  color: $--purple;
  background: $--purple-assist;
  height: 150px;
  .el-icon-upload {
    color: $--purple;
  }
}
</style>
