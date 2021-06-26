<template>
  <basic-container id="riderBenefits">
    <!-- <el-button type="text" size="small" style="margin-right: 5px" @click="initForm">
      {{ $t("client.insurance_policy.riderBenefits") }}
    </el-button> -->
    <!-- <el-dialog :visible="dialogVisible" :before-close="handleClose" :fullscreen="true" :title="$t('client.insurance_policy.riderBenefits_title')" append-to-body> -->
    <!-- <div class="header">
      <add :company-id="companyId" :currency="currency" :submit-date="submitDate" style="margin-top: 10px" @afterAdd="afterAdd" />
    </div> -->
    <el-table :data="riderBenefits" stripe>
      <el-table-column :label="$t('client.insurance_policy.product')" prop="product.name" />
      <el-table-column :label="$t('client.insurance_policy.premium')">
        <template slot-scope="scope">
          <span class="left_text">{{ getSymbol(currency) }}</span><span class="right_text">{{
              formatterCurrency(scope.row.premium)
            }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('client.insurance_policy.amountInsured')" prop="amountInsured">
        <template slot-scope="scope">
          <span class="left_text">{{ getSymbol(currency) }}</span><span class="right_text">{{
              formatterCurrency(scope.row.amountInsured)
            }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('client.insurance_policy.riderBenefits_status')" prop="policyStatus" min-width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="danger">
            {{ formatterRiderBenefitStatus(scope.row.status) }}
          </el-tag>
          <el-tag v-if="scope.row.status === 0" type="success">
            {{ formatterRiderBenefitStatus(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.action')">
        <template slot-scope="scope">
          <edit :rider-benefit="scope.row" :company-id="companyId" :currency="currency" :submit-date="submitDate" />
          <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">{{ $t("common.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-bottom">
      <add class="add-rider-button" :company-id="companyId" :currency="currency" :submit-date="submitDate" @afterAdd="afterAdd" />
      <div class="action-bottom" style="text-align: center">
        <el-button :loading="saveLoading" type="primary" @click="handleSubmit">{{ $t("common.submitButton") }}</el-button>
      </div>
    </div>
    <!-- </el-dialog> -->
  </basic-container>
</template>

<script>
import add from "./addRiderBenefit";
import { getSymbol } from "@/utils";
import edit from "./editRiderBenefit";
import { riderBenefitStatus } from "@/utils/constant";
import Cookies from "js-cookie";
import { getYearFirst, getYearLast } from "@/utils";

const _ = require("lodash");
const currencyFormatter = require("currency-formatter");

export default {
  name: "RiderBenefits",
  components: {
    add,
    edit,
  },
  // props: {
  //   data: {
  //     type: Array,
  //     default() {
  //       return [];
  //     },
  //   },
  //   id: {
  //     type: Number,
  //     default() {
  //       return 0;
  //     },
  //   },
  //   submitDate: {
  //     type: Number,
  //     default() {
  //       return 0;
  //     },
  //   },
  //   currency: {
  //     type: String,
  //     default() {
  //       return "";
  //     },
  //   },
  //   companyId: {
  //     type: Number,
  //     default() {
  //       return 0;
  //     },
  //   },
  //   listQuery: {
  //     type: Object,
  //     default() {
  //       return {};
  //     },
  //   },
  //   year: {
  //     type: String,
  //     default() {
  //       return "";
  //     },
  //   },
  // },
  data() {
    return {
      language: "",
      saveLoading: false,
      dialogVisible: false,
      riderBenefits: [],
      id: 0,
      submitDate: 0,
      currency: '',
      companyId: 0,
      listQuery: {},
      year: ''
    };
  },
  created() {
    const params = this.$route.params;
    this.id = params.id;
    this.submitDate = params.submitDate;
    this.currency = params.currency;
    this.companyId = params.companyId;
    this.listQuery = params.listQuery;
    this.year = params.year;
    this.language = Cookies.get("language") || "zh-CN";
    this.riderBenefits = params.data;
  },
  methods: {
    getSymbol,
    formatterCurrency(value) {
      return currencyFormatter.format(Math.floor(value * 100) / 100, {
        symbol: "",
      });
    },
    initForm() {
      this.language = Cookies.get("language") || "zh-CN";
      this.riderBenefits = this.data;
      this.dialogVisible = true;
    },
    afterAdd(riderBenefit) {
      this.riderBenefits.push(riderBenefit);
    },
    handleClose() {
      this.dialogVisible = false;
      const offset = (this.listQuery.page - 1) * this.listQuery.limit;
      const max = this.listQuery.limit;
      let params = { sort: "sn,submitDate", order: "asc,asc", max, offset };
      if (this.year) {
        const geSubmitDate = getYearFirst(this.year);
        const leSubmitDate = getYearLast(this.year);
        params = Object.assign({ geSubmitDate, leSubmitDate, ...params });
      }
      this.$store.dispatch("client/FetchInsurancePolicyList", { params });
    },
    // 处理删除保单事件
    handleDelete(index, row) {
      this.$confirm(
        this.$t("client.insurance_policy.tooltip.delete_riderBenefit"),
        this.$t("common.prompt"),
        {
          confirmButtonText: this.$t("common.confirmButton"),
          cancelButtonText: this.$t("common.cancelButton"),
          type: "warning",
        }
      ).then(() => {
        this.riderBenefits.splice(index, 1);
      });
    },
    handleSubmit() {
      this.saveLoading = true;
      const data = [];
      this.riderBenefits.forEach((item) => {
        const result = {
          product: item.product.id,
          premium: item.premium,
          status: item.status,
        };
        if (item.amountInsured) {
          result.amountInsured = item.amountInsured;
        }
        data.push(result);
      });
      this.$api.client
        .editInsurancePolicy(this.id, { riderBenefits: data })
        .then((_) => {
          this.$message({
            message: this.$t("common.success"),
            type: "success",
            duration: 5 * 1000,
          });
          // const params = { sort: 'sn,submitDate', order: 'asc,asc' }
          // this.$store.dispatch('client/FetchInsurancePolicyList', { params })
          this.handleClose();
          this.saveLoading = false;
        })
        .catch((_) => {
          this.saveLoading = false;
        });
    },
    formatterRiderBenefitStatus(id) {
      let result = "";
      _.forEach(riderBenefitStatus, (item) => {
        if (id === item.id) {
          result = item[this.language];
          return;
        }
      });
      return result;
    },
  },
};
</script>

<style type="text/scss"  lang="scss" scoped>
#riderBenefits {
  .action-bottom {
    display: flex;
    align-items: center;
    padding-right: 10px;
    .el-button {
      width: 92px;
    }
  }
}
</style>
