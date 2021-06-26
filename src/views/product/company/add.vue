<template>
  <el-col class="el-table-add-col">
    <!--<div class="el-table-add-row" @click="initForm"><span>+ 添加</span></div>-->
    <el-button class="el-table-add-row" plain type="primary" size="small" @click="initForm"><i class="iconfont icon_add_small create-icon" /> <span>{{ $t("common.add") }}</span></el-button>
    <el-dialog append-to-body v-el-drag-dialog :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('product.company.set.add_title')" top="50px" width="600px">
      <el-form ref="company" :model="company" :rules="rule" label-width="110px">
        <el-form-item :label="$t('product.company.set.name_en')" prop="en">
          <el-input ref="en" v-model="company.en" autofocus />
        </el-form-item>
        <el-form-item :label="$t('product.company.set.name_zh')" prop="zhCN">
          <el-input v-model="company.zhCN" />
        </el-form-item>
        <el-form-item :label="$t('product.company.set.acronym')" prop="acronym">
          <el-input v-model="company.acronym" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="company.phone" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="company.email" />
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="company.address" />
        </el-form-item>
        <el-button type="primary" circle icon="el-icon-plus" size="mini" class="add-contact-button" @click="addWebsites" />
        <el-form-item v-for="(item, index) in company.websites" :key="index" :label="'系统地址' + (index + 1)">
          <el-input v-model="item.name" :class="company.websites.length > 1 ? 'halfWidth' : 'fullWidth'" placeholder="系统地址" />
          <el-input v-model="item.remark" class="remark_input" placeholder="备注" />
          <el-button v-if="company.websites.length > 1" icon="el-icon-remove-outline" size="small" style="
              min-width: 50px;
              font-size: 20px;
              padding: 6px;
              vertical-align: bottom;
            " @click="removeWebsite(index)" />
        </el-form-item>
        <el-form-item :label="$t('product.company.set.contractEffectiveDate')" prop="contractEffectiveDate">
          <el-date-picker v-model="company.contractEffectiveDate" type="date" value-format="timestamp" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="$t('product.company.set.secondary')" prop="secondary" style="margin-right: 20px">
          <el-switch v-model="company.secondary" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">{{
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
      dialogVisible: false,
      loading: false,
      company: {
        en: "",
        zhCN: "",
        acronym: "",
        phone: "",
        email: "",
        address: "",
        contractEffectiveDate: "",
        secondary: false,
        names: {},
        websites: [{ name: "", remark: "" }],
      },
      rule: {
        en: [
          {
            required: true,
            message: this.$t("product.company.set.verify_message.name_en"),
            trigger: "blur",
          },
        ],
        zhCN: [
          {
            required: true,
            message: this.$t("product.company.set.verify_message.name_zh"),
            trigger: "blur",
          },
        ],
        acronym: [
          {
            required: true,
            message: this.$t("product.company.set.verify_message.acronym"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    addWebsites() {
      this.company.websites.push({ name: "", remark: "" });
    },
    removeWebsite(index) {
      this.company.websites.splice(index, 1);
    },
    initForm() {
      this.dialogVisible = true;
      this.$nextTick(function () {
        this.$refs["en"].focus();
      });
    },
    handleClose() {
      this.$refs["company"].resetFields();
      this.company.websites = [{ name: "", remark: "" }];
      this.dialogVisible = false;
    },
    handleSubmit() {
      this.$refs["company"].validate((valid) => {
        if (valid) {
          this.loading = true;
          const data = { acronym: "", localizedNames: [] };
          data.acronym = this.company.acronym;
          data.secondary = this.company.secondary;
          // data.contact = this.company.contact
          data.address = this.company.address;
          data.email = this.company.email;
          data.phone = this.company.phone;
          const websites = [];
          this.company.websites.forEach((item) => {
            websites.push(item.name + "-" + item.remark);
          });
          data.websites = websites;
          data.contractEffectiveDate = this.company.contractEffectiveDate;
          data.localizedNames.push({ name: this.company.en, locale: "en" });
          data.localizedNames.push({
            name: this.company.zhCN,
            locale: "zh_CN",
          });
          this.$api.company
            .addCompany(data)
            .then((_) => {
              this.$message({
                message: this.$t("common.success"),
                type: "success",
                duration: 5 * 1000,
              });
              this.$store.dispatch("company/FetchCompanyList");
              this.loading = false;
              this.handleClose();
            })
            .catch((_) => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.el-table-add-col {
  width: 900px;
}
.remark_input {
  width: 115px;
}
.add-contact-button {
  position: absolute;
  margin-top: 3px;
  left: 38px;
}
.fullWidth {
  width: 70%;
}
.halfWidth {
  width: 58%;
}
</style>
