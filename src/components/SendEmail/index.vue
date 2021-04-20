<template>
  <div>
    <el-dialog
      id="sendEmail"
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('sendEmail.title')"
      :fullscreen="true"
      append-to-body
    >
      <basic-container>
        <el-card
          class="box-card"
          style="width: 100%; margin-left: auto; margin-right: auto"
        >
          <el-form 
            label-width="80px" 
            style="padding: 10px">
            <el-form-item :label="$t('sendEmail.to')">
              <el-input v-model="to" />
            </el-form-item>
            <el-form-item :label="$t('sendEmail.subject')">
              <el-input v-model="subject" />
            </el-form-item>
            <el-form-item :label="$t('sendEmail.attachment')">
              <el-upload
                ref="upload"
                :on-remove="handleRemoveAttachment"
                :before-upload="beforeUpload"
                :file-list="attachments"
                :auto-upload="false"
                action=""
              >
                <el-button 
                  slot="trigger" 
                  size="small" 
                  type="primary">{{
                    $t("sendEmail.select_attachment")
                  }}</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('sendEmail.content')">
              <tinymce 
                v-if="showTinymce" 
                v-model="body" 
                :height="300" />
            </el-form-item>
          </el-form>
        </el-card>
        <div 
          class="clearfix" 
          style="text-align: center; margin-bottom: 10px">
          <el-button
            :loading="sendEmailLoading"
            type="primary"
            @click="sendEmail()"
          >{{ $t("sendEmail.button") }}</el-button
          >
        </div>
      </basic-container>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible="templateDialogVisible"
      :before-close="handleTemplateClose"
      :title="$t('sendEmail.select_template_title')"
      width="400px"
      append-to-body
    >
      <el-form label-width="80px">
        <el-form-item 
          :label="$t('sendEmail.template')" 
          prop="templateId">
          <el-select
            v-model="templateId"
            :placeholder="$t('sendEmail.set.template')"
            :remote-method="searchTemplate"
            filterable
            remote
            style="width: 100%"
            @focus="onTemplateFocus"
          >
            <el-option
              v-for="item in templates"
              :key="item.id"
              :value="item.id"
              :label="item.title"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div 
        slot="footer" 
        class="dialog-footer">
        <el-button @click="handleTemplateClose">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button 
          type="primary" 
          @click="afterSelectTempate">{{
            $t("common.confirmButton")
          }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import Cookies from "js-cookie";
import { parseTime } from "@/utils";
const currencyFormatter = require("currency-formatter");

export default {
  name: "Template",
  components: { Tinymce },
  data() {
    return {
      dialogVisible: false,
      templateDialogVisible: false,
      showTinymce: true,
      policy: {},
      to: "",
      loading: false,
      sendEmailLoading: false,
      templates: [],
      templateId: "",
      attachments: [],
      subject: "",
      body: "",
      signature: "",
    };
  },
  methods: {
    openEmailDialog(policy) {
      this.policy = policy;
      this.to = policy.applicant.email;
      this.templateDialogVisible = true;
      this.getTemplateList();
    },
    searchTemplate(value) {
      this.getTemplateList({ title: value });
    },
    onTemplateFocus() {
      this.getTemplateList();
    },
    getTemplateList(params) {
      let data = { isBuiltin: false };
      if (params) {
        data = Object.assign(params, data);
      }

      this.$api.template.fetchTemplateList(data).then((res) => {
        this.templates = res.data.list;
      });
    },
    beforeUpload(file) {
      const _self = this;
      // 获取并记录图片的base64编码
      const reader = new FileReader();
      reader.readAsDataURL(file); // 读出 base64
      reader.onload = function () {
        // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
        const dataURL = reader.result; // base64
        _self.attachments.push({ name: file.name, data: dataURL });
      };
    },
    sendEmail() {
      this.sendEmailLoading = true;
      window.Email.send({
        Host: "smtp.exmail.qq.com",
        Username: "auto_info@fortuneasset.com.hk",
        Password: "Fam2019!",
        To: this.to,
        From: "auto_info@fortuneasset.com.hk",
        Subject: this.subject,
        Body: this.body,
        Attachments: this.attachments,
      }).then((message) => {
        if (message === "OK") {
          this.$message({
            message: this.$t("sendEmail.send_success"),
            type: "success",
            duration: 5 * 1000,
          });
          this.handleClose();
        } else {
          this.$message({
            message: message,
            type: "error",
            duration: 5 * 1000,
          });
        }

        this.sendEmailLoading = false;
      });
    },
    handleClose() {
      this.subject = "";
      this.body = "";
      this.attachments = [];
      this.to = "";
      this.showTinymce = false;
      this.dialogVisible = false;
    },
    handleTemplateClose() {
      this.templateDialogVisible = false;
    },
    afterSelectTempate() {
      this.handleTemplateClose();
      this.dialogVisible = true;
      this.showTinymce = true;
      if (!this.templateId) {
        return;
      }
      let language = Cookies.get("language") || "zh-CN";
      if (language === "zh-CN") {
        language = "zh_CN";
      } else if (language === "zh-TW") {
        language = "zh_TW";
      }
      this.$api.template.getTemplateById(this.templateId).then((res) => {
        let signature = "";
        if (res.data.signature) {
          res.data.signature.forEach((item) => {
            if (item.locale === language) {
              signature = item.name;
            }
          });
        }
        if (res.data.body) {
          res.data.body.forEach((item) => {
            if (item.locale === language) {
              let body = item.name.replace(
                /\${name}/g,
                this.policy.applicant.name
              );
              body = body.replace(
                /\${premium}/g,
                currencyFormatter.format(this.policy.premium, {
                  code: this.policy.currency,
                })
              );
              body = body.replace(/\${number}/g, this.policy.number || "");
              body = body.replace(
                /\${dueDate}/g,
                parseTime(this.policy.dueDate, "{y}-{m}-{d}")
              );
              body = body.replace(/\${signature}/g, signature);
              this.body = body;
            }
          });
        }
        if (res.data.subject) {
          res.data.subject.forEach((item) => {
            if (item.locale === language) {
              this.subject = item.name;
            }
          });
        }
      });
    },
    handleRemoveAttachment(file, fileList) {
      this.attachments = fileList;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
#sendEmail {
  .el-dialog__body {
    padding: 10px;
  }
}
</style>
