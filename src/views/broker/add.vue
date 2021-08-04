<template>
  <el-col class="el-table-add-col">
    <!--<div class="el-table-add-row" @click="initForm"><span>+ 添加</span></div>-->
    <el-button class="el-table-add-row" plain type="primary" @click="initForm">
      <i class="iconfont icon_add_small create-icon" /> <span>{{ $t("common.add") }}</span>
    </el-button>
    <el-dialog v-el-drag-dialog append-to-body :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('broker.set.add_title')" width="500px">
      <el-form ref="broker" :model="broker" :rules="ruleBroker" label-width="120px">
        <el-form-item :label="$t('broker.name_en')" prop="en">
          <el-input v-model="broker.en" :placeholder="$t('broker.set.name_en')" />
        </el-form-item>
        <el-form-item :label="$t('broker.name_zh')" prop="zhCN">
          <el-input v-model="broker.zhCN" :placeholder="$t('broker.set.name_zh')" />
        </el-form-item>
        <el-form-item :label="$t('broker.email')" prop="email">
          <el-input v-model="broker.email" :placeholder="$t('broker.set.email')" />
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
      broker: {
        en: '',
        zhCN: '',
        email: '',
      },
      ruleBroker: {
        en: [
          {
            required: true,
            message: this.$t("broker.verify_message.name_en"),
            trigger: "blur",
          },
        ],
        zhCN: [
          {
            required: true,
            message: this.$t("broker.verify_message.name_zh"),
            trigger: "blur",
          },
        ],
        email: [{ required: true, message: this.$t("broker.verify_message.email"), trigger: "blur", }],
      },
    };
  },
  methods: {
    initForm() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.$refs["broker"].resetFields();
      this.dialogVisible = false;
    },
    handleSubmit() {
      this.buttonLoading = true
      this.$refs["broker"].validate((valid) => {
        if (valid) {
          const data = { localizedNames: [] };
          data.email = this.broker.email
          data.localizedNames.push({ name: this.broker.en, locale: "en" });
          data.localizedNames.push({
            name: this.broker.zhCN,
            locale: "zh_CN",
          });
          this.$api.broker.create(data).then(res => {
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
