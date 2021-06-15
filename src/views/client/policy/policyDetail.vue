<template>
  <span>
    <a class="link" @click="initForm">{{ policyNumber }}</a>
    <el-dialog v-el-drag-dialog id="policy-detail-dialog" :close-on-click-modal="false" :before-close="handleClose" :visible="dialogVisible" :title="$t('client.insurance_policy.set.insurance_policy_detail')" append-to-body>
      <!-- <el-form v-loading="loading" label-position="left" inline class="detail-form" style="padding-bottom: 20px">
        <el-form-item :label="$t('client.insurance_policy.sn')">
          <span>{{ data.sn }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.channel')">
          <span>{{ data.channel.name }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.agent_name')">
          <span>{{ data.agent.name }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.applicant_name')">
          <span>{{ data.applicant.name }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.insured_name')">
          <span>{{ data.insured.name }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.company_name')">
          <span>{{ data.company.name }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.product_name')">
          <span>{{ data.product.name }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.amountInsured')">
          <span v-if="!data.amountInsured || data.amountInsured === 0">N/A</span>
          <span v-else>{{ numberFormat(data, data.amountInsured) }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.premium')">
          <span>{{ numberFormat(data, data.premium) }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.premiumPlan')">
          <span>{{ formatterPremiumPlan(data.premiumPlan) }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.issueDate')">
          <span>{{ getFormattedDate(data.issueDate) }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.submitDate')">
          <span>{{ getFormattedDate(data.submitDate) }}</span>
        </el-form-item>
      </el-form> -->
      <div class="detail_wrapper">
        <div class="content_wrapper">
          <div class="row">
            <div class="label">{{$t('client.insurance_policy.sn')}}</div>
            <div class="content">{{ data.sn }}</div>
          </div>
          <div class="row">
            <div class="label">{{$t('client.insurance_policy.applicant_name')}}</div>
            <div class="content">{{ data.applicant.name }}</div>
          </div>
          <div class="row">
            <div class="label">{{$t('client.insurance_policy.channel')}}</div>
            <div class="content">{{ data.channel.name }}</div>
          </div>
          <div class="row">
            <div class="label">{{$t('client.insurance_policy.agent_name')}}</div>
            <div class="content">{{ data.agent.name }}</div>
          </div>
          <div class="row">
            <div class="label">{{$t('client.insurance_policy.insured_name')}}</div>
            <div class="content">{{ data.insured.name }}</div>
          </div>
          <div class="row">
            <div class="label">{{$t('client.insurance_policy.company_name')}}</div>
            <div class="content">{{ data.company.name }}</div>
          </div>
          <div class="row">
            <div class="label">{{$t('client.insurance_policy.product_name')}}</div>
            <div class="content">{{ data.product.name }}</div>
          </div>
          <div class="row">
            <div class="label">{{$t('client.insurance_policy.amountInsured')}}</div>
            <div class="content">
              <span v-if="!data.amountInsured || data.amountInsured === 0">N/A</span>
              <span v-else>{{ numberFormat(data, data.amountInsured) }}</span>
            </div>
          </div>
        </div>
        <div class="content_wrapper">
          <div class="row">
            <div class="label">{{$t('client.insurance_policy.premium')}}</div>
            <div class="content">{{ numberFormat(data, data.premium) }}</div>
          </div>
          <div class="row">
            <div class="label">{{$t('client.insurance_policy.premiumPlan')}}</div>
            <div class="content">{{ formatterPremiumPlan(data.premiumPlan) }}</div>
          </div>
          <div class="row">
            <div class="label">{{$t('client.insurance_policy.issueDate')}}</div>
            <div class="content">{{ getFormattedDate(data.issueDate) }}</div>
          </div>
          <div class="row">
            <div class="label">{{$t('client.insurance_policy.submitDate')}}</div>
            <div class="content">{{ getFormattedDate(data.submitDate) }}</div>
          </div>
        </div>
      </div>

      <div v-if="data.riderBenefits && data.riderBenefits.length > 0">
        <div style="
            padding: 0px 10px 10px 0;
            font-size: 14px;
            font-weight: bold;
            color: #99a9bf;
          ">
          {{ $t("client.insurance_policy.riderBenefits_title") }}
        </div>
        <div style="padding: 0px 10px 30px 0">
          <el-table :data="data.riderBenefits" style="width: 100%" stripe>
            <el-table-column :label="$t('client.insurance_policy.product_name')" prop="product.name" />
            <el-table-column :label="$t('client.insurance_policy.premiumPlan')" prop="amountInsured" />
            <el-table-column :label="$t('client.insurance_policy.amountInsured')" prop="premium" />
          </el-table>
        </div>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { parseTime } from "@/utils";
import { premiumPlan } from "@/utils/constant";
import elDragDialog from "@/directive/el-dragDialog";
import Cookies from "js-cookie";
const currencyFormatter = require("currency-formatter");
const _ = require("lodash");

export default {
  directives: { elDragDialog },
  props: {
    policyNumber: {
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
        channel: "",
        agent: "",
        company: "",
        applicant: "",
        insured: "",
        product: "",
      },
      dialogVisible: false,
      loading: false,
      language: Cookies.get("language") || "zh-CN",
    };
  },
  methods: {
    initForm() {
      this.loading = true;
      this.$api.client
        .getInsurancePolicyById(this.id)
        .then((res) => {
          this.data = res.data;
          this.loading = false;
        })
        .catch((_) => {
          this.loading = false;
        });
      this.dialogVisible = true;
    },
    numberFormat(row, value) {
      return currencyFormatter.format(value, { code: row.currency });
    },
    getFormattedDate(value) {
      return parseTime(value, "{y}-{m}-{d}");
    },
    // 格式化保单状态
    formatterPremiumPlan(id) {
      let result = "";
      _.forEach(premiumPlan, (item) => {
        if (id === item.id) {
          result = item[this.language];
          return;
        }
      });
      return result;
    },
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
#policy-detail-dialog {
  .el-dialog {
    margin-top: 50px;
    width: 718px;
    top: 0px;
    .el-dialog__body {
      padding: 24px 32px 32px 32px;
    }
  }
  .detail_wrapper {
    display: flex;
    .content_wrapper {
      background: #f6f6f7;
      width: 315px;
      border-radius: 6px;
      padding: 24px;
      &:first-child {
        margin-right: 24px;
      }
      .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        font-size: 14px;
        .label {
          color: $--label;
        }
        .content {
          color: $--content;
          width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: right;
        }
      }
    }
  }
  .detail-form {
    font-size: 0;
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      margin-right: 50px;
      label {
        color: $--label;
      }
    }
  }
  .el-dialog__body {
    padding-top: 20px;
  }
}
</style>
