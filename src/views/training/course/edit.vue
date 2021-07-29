<template>
  <span>
    <!--<div class="el-table-add-row" @click="initForm"><span>+ 添加</span></div>-->
    <el-button 
      type="text" 
      size="small" 
      @click="initForm">{{
        this.$t("common.edit")
      }}</el-button>
    <el-dialog 
      v-el-drag-dialog 
      :close-on-click-modal="false" 
      :visible="dialogVisible" 
      :before-close="handleClose" 
      :title="$t('course.set.add_title')" 
      append-to-body 
      width="500px">
      <el-form 
        ref="course" 
        :model="course" 
        :rules="ruleCourse" 
        label-width="90px">
        <el-form-item 
          :label="$t('course.title')" 
          prop="title">
          <el-input 
            v-model="course.title" 
            :placeholder="$t('course.title')" />
        </el-form-item>
        <el-form-item 
          :label="$t('course.coverImage')" 
          prop="deadline">
          <el-upload 
            :show-file-list="false" 
            :auto-upload="false" 
            :on-change="handleFileUploaderChange" 
            class="avatar-uploader" 
            action="">
            <img 
              v-if="course.coverImage" 
              :src="course.coverImage" 
              class="avatar" >
            <i 
              v-else 
              class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item 
          :label="$t('course.type')" 
          prop="online">
          <el-radio-group v-model="course.online">
            <el-radio :label="true">{{ $t("course.online") }}</el-radio>
            <el-radio :label="false">{{ $t("course.offline") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item 
          v-if="!course.online" 
          :label="$t('course.deadline')" 
          prop="deadline">
          <el-date-picker 
            v-model="course.deadline" 
            :placeholder="$t('course.deadline')" 
            value-format="timestamp" 
            style="width: 100%" 
            type="datetime" />
        </el-form-item>

        <el-form-item 
          v-if="!course.online" 
          :label="$t('course.description')" 
          prop="description">
          <el-input 
            v-model="course.description" 
            :placeholder="$t('course.description')" />
        </el-form-item>
        <el-form-item 
          v-if="!course.online" 
          :label="$t('course.quota')" 
          prop="quota">
          <el-input 
            v-model="course.quota" 
            :placeholder="$t('course.set.quota')" />
        </el-form-item>
        <el-form-item 
          v-if="course.online" 
          :label="$t('course.attachments')" 
          prop="deadline">
          <el-upload 
            v-loading="loading" 
            :disabled="disabled" 
            :http-request="uploadFile" 
            :show-file-list="false" 
            class="file-upload" 
            action="">
            <el-button type="text">{{
              attachmentName || "+点击上传附件"
            }}</el-button>
            <!-- <i class="el-icon-upload" />
            <div class="el-upload__text">{{ $t("document.upload_tips") }}</div> -->
            <!-- <el-link :loading="loading" size="small" icon="el-icon-upload" type="primary" disable>上传附件</el-link> -->
          </el-upload>
        </el-form-item>
      </el-form>

      <div 
        slot="footer" 
        class="dialog-footer">
        <el-button @click="handleClose">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button 
          :loading="buttonLoading" 
          type="primary" 
          @click="handleSubmit">{{ $t("common.submitButton") }}</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import elDragDialog from "@/directive/el-dragDialog";

export default {
  directives: { elDragDialog },
  props: {
    course: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      loading: false,
      buttonLoading: false,
      disabled: false,
      dialogVisible: false,
      attachmentName: "",
      ruleCourse: {
        title: [
          {
            required: true,
            message: this.$t("course.set.title"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    initForm() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.$refs["course"].resetFields();
      this.dialogVisible = false;
    },
    handleFileUploaderChange(file) {
      const self = this;
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function (event) {
        let img_base64 = this.result;
        self.course.coverImage = img_base64;
      };
      console.log(self.course.coverImage);
    },
    async uploadFile(params) {
      this.attachmentName = params.file.name;
      return;
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
        .catch((error) => {
          console.log(error);
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
            console.log(_file);
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
          this.percentCompleted = "";
          this.disabled = false;
          this.loading = false;
          return false;
        });
    },
    handleSubmit() {
      this.buttonLoading = true;
      this.$refs["course"].validate((valid) => {
        if (valid) {
          this.$api.course
            .update(this.course.id, this.course)
            .then((res) => {
              this.buttonLoading = false;
              this.dialogVisible = false;
              this.$emit("fetchDate");
              this.$message({
                message: this.$t("common.success"),
                type: "success",
                duration: 5 * 1000,
              });
            })
            .catch((_) => {
              this.buttonLoading = false;
            });
        } else {
          this.buttonLoading = true;
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
