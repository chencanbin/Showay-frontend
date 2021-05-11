<template>
  <el-col :xl="12" :lg="12" :md="10" :sm="10" xs="10" class="el-table-add-col">
    <!--<div class="el-table-add-row" @click="initForm"><span>+ 添加</span></div>-->
    <el-button class="el-table-add-row" plain type="primary" @click="initForm">+ {{ this.$t("common.add") }}</el-button>
    <el-dialog v-el-drag-dialog :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('client.info.set.add_title')" top="50px" width="450px">
      <el-form ref="client" :model="client" :rules="rule" label-width="80px">
        <el-form-item :label="$t('client.info.type')" prop="type">
          <el-select v-model="client.isOrganization" style="width: 100%">
            <el-option key="0" :label="$t('client.info.individual')" :value="false" />
            <el-option key="1" :label="$t('client.info.organization')" :value="true" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('client.info.name')" prop="name">
          <el-input v-model="client.name" :placeholder="$t('client.info.set.name')" />
        </el-form-item>
        <el-form-item :label="$t('client.info.enName')" prop="englishName">
          <el-input v-model="client.englishName" :placeholder="$t('client.info.set.enName')" />
        </el-form-item>
        <el-form-item :label="$t('client.info.idNumber')" prop="idNumber">
          <el-input v-model="client.idNumber" :placeholder="
              client.isOrganization
                ? $t('client.info.set.organization_id')
                : $t('client.info.set.idNumber')
            " />
        </el-form-item>
        <el-form-item v-show="!client.isOrganization" :label="$t('client.info.sex')" prop="sex">
          <el-radio-group v-model="client.sex">
            <el-radio :label="0">{{ $t("client.info.male") }}</el-radio>
            <el-radio :label="1">{{ $t("client.info.female") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="!client.isOrganization" :label="$t('client.info.locale')" prop="locale">
          <el-select v-model="client.locale" :placeholder="$t('client.info.set.locale')" filterable style="width: 100%">
            <el-option-group v-for="group in country" :key="group.label" :label="group.label">
              <el-option v-for="item in group.options" :key="item.code" :label="item[language]" :value="item.code" />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item :label="
            client.isOrganization
              ? $t('client.info.established_time')
              : $t('client.info.birthday')
          " prop="birthday">
          <el-date-picker v-model="client.birthday" :placeholder="
              client.isOrganization
                ? $t('client.info.set.established_time')
                : $t('client.info.set.birthday')
            " style="width: 100%" type="date" />
        </el-form-item>
        <el-form-item :label="$t('client.info.phone')" prop="phone">
          <el-input v-model="client.phone" />
        </el-form-item>
        <el-form-item :label="$t('client.info.email')" prop="email">
          <el-input v-model="client.email" />
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
import { country } from "@/utils/country";
import elDragDialog from "@/directive/el-dragDialog";
import Cookies from "js-cookie";
export default {
  directives: { elDragDialog },
  props: {
    listQuery: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      language: "en",
      country: [
        {
          label: "常用国家",
          options: [
            { code: "CN", "zh-TW": "中國", en: "China", "zh-CN": "中国" },
            { code: "HK", "zh-TW": "香港", en: "Hong Kong", "zh-CN": "香港" },
          ],
        },
        {
          label: "所有国家",
          options: country,
        },
      ],
      dialogVisible: false,
      loading: false,
      client: {
        isOrganization: false,
        name: "",
        englishName: "",
        idNumber: "",
        sex: 0,
        locale: "",
        birthday: "",
        phone: "",
        email: "",
      },
      rule: {
        name: [
          {
            required: true,
            message: this.$t("client.info.set.name"),
            trigger: "blur",
          },
        ],
        idNumber: [
          {
            required: true,
            message: this.$t("client.info.set.idNumber"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    initForm() {
      this.language = Cookies.get("language") || "zh-CN";
      this.dialogVisible = true;
    },
    handleClose() {
      this.$refs["client"].resetFields();
      this.dialogVisible = false;
    },
    handleSubmit() {
      this.$refs["client"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.client.localizedNames = [];
          this.client.localizedNames.push({
            name: this.client.englishName,
            locale: "en",
          });
          this.client.localizedNames.push({
            name: this.client.name,
            locale: "zh_CN",
          });
          this.$api.client
            .createClient(this.client)
            .then((_) => {
              this.$message({
                message: this.$t("common.success"),
                type: "success",
                duration: 5 * 1000,
              });
              const offset = (this.listQuery.page - 1) * this.listQuery.limit;
              const max = this.listQuery.limit;
              this.$store.dispatch("client/FetchClientList", {
                params: { offset, max },
              });
              this.handleClose();
              this.loading = false;
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
