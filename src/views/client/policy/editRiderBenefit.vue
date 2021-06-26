<template>
  <span>
    <!--<el-row style="margin-bottom: 5px">-->
    <!--<el-button type="primary" icon="el-icon-plus" style="margin-right: 10px" @click="initForm">添加副险</el-button>-->
    <!--</el-row>-->
    <el-button type="text" size="small" icon="el-icon-edit" @click="initForm">{{
        this.$t("common.edit")
      }}</el-button>
    <el-dialog v-el-drag-dialog :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('client.insurance_policy.set.edit_riderBenefits_title')" width="600px" append-to-body>
      <el-form ref="riderBenefit" :model="riderBenefit" :rules="riderBenefitRule" label-width="80px" class="riderBenefit">
        <el-form-item :label="$t('client.insurance_policy.product')" prop="product" style="width: 100%">
          <el-select v-model="riderBenefit.product" :loading="loading" :remote-method="searchProduct" :placeholder="$t('client.insurance_policy.set.product_name')" value-key="id" filterable clearable remote style="width: 100%" @focus="onProductFocus">
            <el-option v-for="item in products" :key="item.id" :label="item.name" :value="item">
              <span style="float: left; margin-right: 15px">{{
                item.name
              }}</span><span style="float: left; font-weight: bold">{{
                item.acryonym
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.premium')" prop="premium">
          <currency-input ref="premium" v-model="riderBenefit.premium" :symbol="getSymbol(currency)" :placeholder="$t('client.insurance_policy.set.premium')" />
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.amountInsured')" prop="amountInsured">
          <currency-input ref="amountInsured" v-model="riderBenefit.amountInsured" :symbol="getSymbol(currency)" :placeholder="$t('client.insurance_policy.set.amountInsured')" />
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.riderBenefits_status')" prop="policyStatus">
          <el-select v-model="riderBenefit.status" :placeholder="
              $t('client.insurance_policy.set.riderBenefits_status')
            " filterable style="width: 100%">
            <el-option v-for="item in riderBenefitStatus" :key="item.id" :label="item[language]" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import currencyInput from "@/components/CurrencyInput";
import elDragDialog from "@/directive/el-dragDialog";
import { getSymbol } from "@/utils";
import { riderBenefitStatus } from "@/utils/constant";
import Cookies from "js-cookie";

import { mapGetters } from "vuex";

export default {
  directives: { elDragDialog },
  components: {
    currencyInput,
  },
  props: {
    submitDate: {
      type: Number,
      default() {
        return 0;
      },
    },
    riderBenefit: {
      type: Object,
      default() {
        return {};
      },
    },
    companyId: {
      type: Number,
      default() {
        return 0;
      },
    },
    currency: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      riderBenefitStatus,
      dialogVisible: false,
      products: [],
      language: "",
      queryProduct: {
        name: "",
        company: this.companyId,
        offset: 0,
        max: 50,
      },
      riderBenefitRule: {
        premium: [
          {
            required: true,
            message: this.$t("client.insurance_policy.set.premium"),
            trigger: "blur",
          },
        ],
        product: [
          {
            required: true,
            message: this.$t("client.insurance_policy.set.product_name"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["loading"]),
  },
  methods: {
    getSymbol,
    initForm() {
      this.language = Cookies.get("language") || "zh-CN";
      this.products = [this.riderBenefit.product];
      this.dialogVisible = true;
    },
    handleClose() {
      this.$refs["riderBenefit"].clearValidate();
      this.dialogVisible = false;
    },
    searchProduct(query) {
      this.queryProduct.name = query;
      this.queryProduct.sort = "localizedNames";
      this.queryProduct.order = "asc";
      this.getProducts();
    },
    getProducts() {
      this.products = [];
      if (this.submitDate) {
        this.queryProduct.timestamp = this.submitDate;
      }
      this.$api.product.fetchProductList(this.queryProduct).then((res) => {
        this.products = res.data.list;
      });
    },
    onProductFocus() {
      this.queryProduct.name = "";
      this.getProducts();
    },
    handleSubmit() {
      this.$refs["riderBenefit"].validate((valid) => {
        if (valid) {
          this.handleClose();
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
.riderBenefit {
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>
