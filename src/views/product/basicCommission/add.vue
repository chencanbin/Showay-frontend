<template>
  <el-col class="el-table-add-col">
    <el-button class="el-table-add-row" plain type="primary" @click="initForm"><i class="iconfont icon_add_small create-icon" /> <span>{{ $t("common.add") }}</span></el-button>
    <!--<div class="el-table-add-row" @click="initForm"><span>+ 添加</span></div>-->
    <!--<el-button :loading="loading" type="primary" size="small" icon="el-icon-plus" @click="initForm">添加</el-button>-->
    <el-dialog v-el-drag-dialog append-to-body :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('product.commission.add.title')" width="500px">
      <el-form ref="commission" :model="commission" :rules="rule" label-width="100px">
        <el-form-item :label="$t('product.commission.add.company')" prop="companyId">
          <!-- <el-select ref="company" v-model="commission.companyId" :remote-method="remoteSearch" :placeholder="$t('product.commission.add.company_rule_message')" remote filterable style="width: 100%" @change="onCompanyChange">
            <el-option v-for="company in companyList" :key="company.id" :value="company.id" :label="company.name" />
          </el-select> -->
          {{companyName}}
        </el-form-item>
        <el-form-item :label="$t('product.commission.add.broker')" prop="affectedBrokers">
          <el-select ref="broker" v-model="commission.affectedBrokers" multiple :remote-method="remoteBrokerSearch" :placeholder="$t('product.commission.add.broker_rule_message')" remote filterable style="width: 100%">
            <el-option v-for="broker in brokerList" :key="broker.id" :value="broker.id" :label="broker.name" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('product.commission.add.template')" prop="template">
          <el-select ref="commissionTableList" v-model="commission.template" :disabled="disableTemplate" :placeholder="$t('product.commission.add.template_placeholder')" clearable style="width: 100%">
            <el-option v-for="commissionTable in commissionTableList" :key="commissionTable.id" :value="commissionTable.id" :label="getFormattedDate(commissionTable.effectiveDate) + `(${commissionTable.remarks || ''})`" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="commission.template" :label="$t('product.commission.add.generate_commission_rate')" prop="generateRates">
          <el-checkbox v-model="commission.generateRates" />
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-radio-group v-model="commission.template" style="margin-left: 70px">-->
        <!--<el-radio :label="false">以最新佣金表为模板</el-radio>-->
        <!--<el-radio :label="true">空白佣金表</el-radio>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->
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
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog";
import { parseTime } from "@/utils";

export default {
  directives: { elDragDialog },
  props: {
    companyId: {
      type: Number
    },
    companyName: {
      type: String
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      commission: {
        companyId: this.companyId,
        affectedBrokers: [],
        template: "",
        generateRates: false,
      },
      commissionTableList: [],
      brokerList: [],
      rule: {
        companyId: [
          {
            required: true,
            message: this.$t("product.commission.add.company_rule_message"),
            trigger: "blur",
          },
        ],
        borker: [
          {
            required: true,
            message: this.$t("product.commission.add.borker_rule_message"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    disableTemplate() {
      if (this.commission.companyId) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    initForm() {
      this.fetchBrokerList();
      this.dialogVisible = true;
      this.getCommissionTableList(this.companyId)
    },
    fetchBrokerList(params) {
      this.$api.broker.fetch(params).then(res => {
        this.brokerList = res.data.list
      })
    },
    getCommissionTableList(id, params) {
      this.$api.basicCommission.fetchCommissionTableList(id, params).then((res) => {
        this.commissionTableList = res.data.list;
      });
    },
    remoteSearch(query) {
      this.$store.dispatch("company/FetchCompanyList", { name: query });
    },
    remoteBrokerSearch(name) {
      this.fetchBrokerList({ name })
    },
    getFormattedDate(value) {
      if (isNaN(value)) {
        return value;
      }
      return parseTime(value, "{y}-{m}-{d}");
    },
    handleClose() {
      this.$refs["commission"].resetFields();
      this.dialogVisible = false;
    },
    handleSubmit() {
      this.$refs["commission"].validate((valid) => {
        if (valid) {
          this.loading = true;
          const data = { company: this.commission.companyId, affectedBrokers: this.commission.affectedBrokers };
          if (this.commission.template || this.commission.template === 0) {
            data.template = this.commission.template;
          }
          let api = this.$api.basicCommission.addCommission;
          if (this.commission.generateRates) {
            data.generateRates = this.commission.generateRates;
          }
          api(data).then((res) => {
            this.$emit(
              "afterAddCommissionTable",
              res.data.id,
              this.commission.companyId
            );
            this.$message({
              message: this.$t("common.success"),
              type: "success",
              duration: 5 * 1000,
            });
            this.$store.dispatch("commission/FetchBasicCommissionTableList", {
              id: this.commission.companyId,
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
<style lang="scss" rel="stylesheet/scss" scoped>
.el-table-add-col {
  width: 900px;
  padding: 0;
}
</style>
