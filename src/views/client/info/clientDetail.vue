<template>
  <span>
    <a class="link" @click.stop="initForm">{{ name || "-" }}</a>
    <el-dialog v-el-drag-dialog id="client-detail-dialog" :close-on-click-modal="false" :before-close="handleClose" :visible="dialogVisible" :title="$t('client.insurance_policy.set.insurance_policy_detail')" width="75%" append-to-body>
      <el-form v-loading="loading" label-position="left" inline class="detail-form" style="padding-bottom: 20px">
        <el-form-item :label="$t('client.info.name')">
          <span>{{ data.zh }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.info.enName')">
          <span>{{ data.en }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.info.idNumber')">
          <span>{{ data.idNumber }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.info.locale')">
          <span>{{ data.locale }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.info.sex')">
          <span>{{
            data.sex === 0 ? $t("client.info.male") : $t("client.info.female")
          }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.info.birthday')">
          <span>{{ data.birthday }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.info.phone')">
          <span>{{ data.phone }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.info.email')">
          <span>{{ data.email }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { parseTime } from "@/utils";
import elDragDialog from "@/directive/el-dragDialog";

export default {
  directives: { elDragDialog },
  props: {
    name: {
      type: String,
      default() {
        return "";
      },
    },
    id: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
      data: {
        zh: "",
        en: "",
        englishName: "",
        idNumber: "",
        sex: 0,
        locale: "",
        birthday: "",
        phone: "",
        email: "",
      },
      dialogVisible: false,
      loading: false,
    };
  },
  methods: {
    initForm() {
      this.loading = true;
      this.$api.client
        .getClientById(this.id)
        .then((res) => {
          this.data = res.data;
          this.loading = false;
        })
        .catch((_) => {
          this.loading = false;
        });
      this.dialogVisible = true;
    },
    getFormattedDate(value) {
      return parseTime(value, "{y}-{m}-{d}");
    },
    // 格式化保单状态
    handleClose() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style type="text/scss"  lang="scss">
.link:hover {
  color: $--purple;
}
#client-detail-dialog {
  .detail-form {
    font-size: 0;
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 26%;
      margin-right: 50px;
      label {
        color: #99a9bf;
      }
    }
  }
  .el-dialog__body {
    padding-top: 20px;
  }
}
</style>
