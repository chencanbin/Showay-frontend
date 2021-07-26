<template>
  <el-col class="el-table-add-col">
    <!--<div class="el-table-add-row" @click="initForm"><span>+ 添加</span></div>-->
    <el-button class="el-table-add-row" plain type="primary" @click="initForm">
      <i class="iconfont icon_add_small create-icon" /> <span>{{ $t("common.add") }}</span>
    </el-button>
    <el-dialog v-el-drag-dialog append-to-body :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('enterprise.set.add_title')" width="500px">
      <el-form ref="enterprise" :model="enterprise" :rules="ruleEnterprise" label-width="90px">
        <el-form-item :label="$t('enterprise.name')" prop="name">
          <el-input v-model="enterprise.name" :placeholder="$t('enterprise.name')" />
        </el-form-item>
        <el-form-item :label="$t('enterprise.email')" prop="email">
          <el-input v-model="enterprise.email" :placeholder="$t('enterprise.email')" />
        </el-form-item>
        <el-form-item :label="$t('enterprise.account')" prop="title">
          <el-input v-model="enterprise.account" :placeholder="$t('enterprise.account')" />
        </el-form-item>
        <el-form-item :label="$t('enterprise.certificate')" prop="deadline">
          <el-upload class="avatar-uploader" :show-file-list="false" action="" :auto-upload="false" :on-change="handleFileUploaderChange">
            <img v-if="enterprise.certificate" :src="enterprise.certificate" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button :loading="buttonLoading" type="primary" @click="handleSubmit">{{
            $t("common.submitButton")
          }}</el-button>
      </div>
    </el-dialog>
  </el-col>
</template>

<script type="text/ecmascript-6">
import elDragDialog from "@/directive/el-dragDialog";

export default {
  directives: { elDragDialog },
  data() {
    return {
      loading: false,
      buttonLoading: false,
      disabled: false,
      dialogVisible: false,
      attachmentName: '',
      enterprise: {
        name: '',
        account: '',
        email: '',
        certificate: '',
      },
      ruleEnterprise: {
        name: [{ required: true, message: this.$t("enterprise.set.name"), trigger: "blur", }],
        email: [{ required: true, message: this.$t("enterprise.set.email"), trigger: "blur", }],
        account: [{ required: true, message: this.$t("enterprise.set.account"), trigger: "blur", }],
      },
    };
  },
  methods: {
    initForm() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.$refs["enterprise"].resetFields();
      this.dialogVisible = false;
    },
    handleFileUploaderChange(file) {
      const self = this
      let reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = function (event) {
        let img_base64 = this.result
        self.enterprise.coverImage = img_base64
      }
      console.log(self.enterprise.coverImage)
    },
    async uploadFile(params) {
      this.attachmentName = params.file.name
      return
      this.loading = true;
      this.disabled = true;
      this.buttonText = "正在上传...";
      debugger
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
        .catch((error) => {
          console.log(error)
          if (error && error.response) {
            console.log(error.response);
          }
          this.percentCompleted = "";
          this.disabled = false;
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
          this.percentCompleted = "";
          if (res.status === 200) {
            this.$message({
              type: "success",
              message: this.$t("common.success"),
            });
            console.log(_file)
          } else {
            this.$message({
              type: "error",
              message: res.statusText,
            });
          }
        })
        .catch((error) => {
          debugger
          if (error && error.response) {
            console.log(error.response);
          }
          this.percentCompleted = "";
          this.disabled = false;
          this.loading = false;
          return false;
        });
    },
    handleSubmit() {
      this.buttonLoading = true
      this.$refs["enterprise"].validate((valid) => {
        console.log(this.enterprise)
        if (valid) {
          this.$api.enterprise.create(this.enterprise).then(res => {
            this.buttonLoading = false;
            this.dialogVisible = false;
            this.$emit('fetchDate');
            this.$message({
              message: this.$t("common.success"),
              type: "success",
              duration: 5 * 1000,
            });
          }).catch((_) => {
            this.buttonLoading = false;
          });
        } else {
          this.buttonLoading = true
        }
        // if (valid) {
        //   this.loading = true;
        //   this.$api.user
        //     .addUser(this.account)
        //     .then((_) => {
        //       this.$message({
        //         message: this.$t("common.success"),
        //         type: "success",
        //         duration: 5 * 1000,
        //       });
        //       this.$store.dispatch("FetchUserList");
        //       this.handleClose();
        //       this.loading = false;
        //     })
        //     .catch((_) => {
        //       this.loading = false;
        //     });
        // } else {
        //   return false;
        // }
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
