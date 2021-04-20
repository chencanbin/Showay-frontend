<template>
  <span style="margin-right: 5px">
    <el-col 
      span.number="24" 
      style="margin-bottom: 20px">
      <!--<div class="el-table-add-row" style="margin-top: 0" @click="initForm"><span>+ 添加</span></div>-->
      <el-button 
        class="el-table-add-row" 
        plain 
        type="primary" 
        @click="initForm"
      >+ {{ $t("common.add") }}</el-button
      >
    </el-col>
    <!--<el-button :loading="loading" icon="el-icon-setting" type="text" size="small" style="margin-left: 5px" >-->
    <!--渠道佣金-->
    <!--</el-button>-->
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('product.channel.set.add_policy.title')"
      append-to-body
      width="600px"
    >
      <el-form
        ref="policy"
        :model="policy"
        :rules="rulePolicy"
        label-width="100px"
      >
        <el-form-item
          :label="$t('product.channel.set.add_policy.type')"
          prop="type"
        >
          <el-select
            v-model="policy.type"
            :placeholder="$t('product.channel.set.add_policy.type_placeholder')"
            style="width: 100%"
            @change="onTypeChange"
          >
            <el-option
              key="0"
              :label="$t('product.channel.set.add_policy.all')"
              value="all"
            />
            <el-option
              key="1"
              :label="$t('product.channel.set.add_policy.company')"
              value="companies"
            />
            <el-option
              key="2"
              :label="$t('product.channel.set.add_policy.product')"
              value="products"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="policy.type === 'products'"
          :label="$t('product.channel.set.add_policy.product')"
          prop="products"
        >
          <el-select
            v-if="policy.type === 'products'"
            ref="product"
            :loading="productLoading"
            :remote-method="searchProduct"
            :placeholder="
              $t('product.channel.set.add_policy.product_placeholder')
            "
            v-model="policy.products"
            multiple
            remote
            filterable
            value-key="id"
            style="width: 100%"
          >
            <el-option
              v-for="item in products"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="policy.type === 'companies'"
          :label="$t('product.channel.set.add_policy.company')"
          prop="companies"
        >
          <el-select
            v-if="policy.type === 'companies'"
            ref="product"
            :loading="companyLoading"
            :remote-method="searchCompany"
            :placeholder="
              $t('product.channel.set.add_policy.company_placeholder')
            "
            v-model="policy.companies"
            multiple
            remote
            filterable
            value-key="id"
            style="width: 100%"
          >
            <el-option
              v-for="item in companies"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="policy.type"
          :label="$t('product.channel.set.add_policy.term')"
          prop="term"
        >
          <el-select
            v-model="policy.term"
            :placeholder="$t('product.channel.set.add_policy.term_placeholder')"
            style="width: 100%"
          >
            <el-option
              v-for="item in totalYear"
              :key="item"
              :label="`${item}`"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="policy.term > 1"
          :label="$t('product.channel.set.add_policy.userDefined')"
          prop="userDefined"
        >
          <el-select
            v-if="policy.term > 1"
            v-model="policy.userDefined"
            :placeholder="
              $t('product.channel.set.add_policy.user_defined_placeholder')
            "
            style="width: 100%"
            @change="userDefinedChange"
          >
            <el-option
              v-for="item in generateDefinedYear"
              :key="item"
              :label="`${item}`"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="item in getUserDefined"
          :label="item.label"
          :key="item.id"
          :prop="`conditions.${item.value}`"
          :rules="[
            {
              required: true,
              message: $t(
                'product.channel.set.add_policy.verify_message.commission_rate'
              ),
              trigger: 'blur',
            },
            { required: true, trigger: 'blur', validator: validateNumber },
          ]"
        >
          <el-input v-model="policy.conditions[item.value]">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item 
          :label="$t('common.remarks')" 
          prop="remark">
          <el-input v-model="policy.remark" />
        </el-form-item>
      </el-form>
      <div 
        slot="footer" 
        class="dialog-footer">
        <el-button @click="handleClose">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button 
          type="primary" 
          @click="handleSubmit">{{
            $t("common.submitButton")
          }}</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import elDragDialog from "@/directive/el-dragDialog";

const _ = require("lodash");

export default {
  directives: { elDragDialog },
  data() {
    return {
      dialogVisible: false,
      productLoading: false,
      companyLoading: false,
      products: [],
      companies: [],
      policy: {
        remark: "",
        type: "",
        products: [],
        companies: [],
        term: "",
        userDefined: "",
        conditions: [],
      },
      totalYear: _.range(1, 16),
      rulePolicy: {
        type: [
          {
            required: true,
            message: this.$t(
              "product.channel.set.add_policy.verify_message.type"
            ),
            trigger: ["blur", "change"],
          },
        ],
        term: [
          {
            required: true,
            message: this.$t(
              "product.channel.set.add_policy.verify_message.term"
            ),
            trigger: "blur",
          },
        ],
        userDefined: [
          {
            required: true,
            message: this.$t(
              "product.channel.set.add_policy.verify_message.userDefined"
            ),
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    generateDefinedYear() {
      let years = [];
      years = _.range(1, Number(this.policy.term) + 1);
      return years;
    },
    getUserDefined() {
      const result = [];

      // this.policy.commissionRates = []
      if (this.policy.term === 1 || this.policy.userDefined === 1) {
        result.push({ label: this.$t("common.year", [1]), value: 1 });
      } else if (this.policy.userDefined > 1) {
        for (let i = 0; i < this.policy.userDefined; i++) {
          result.push({ label: this.$t("common.year", [i + 1]), value: i });
        }
      }
      if (
        this.policy.userDefined &&
        this.policy.userDefined < this.policy.term
      ) {
        result.push({
          label: this.$t("common.after_i_year", [this.policy.userDefined]),
          value: this.policy.userDefined + 1,
        });
      }
      return result;
    },
  },
  methods: {
    initForm() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.$refs["policy"].resetFields();
      this.dialogVisible = false;
    },
    handleSubmit() {
      this.$refs["policy"].validate((valid) => {
        if (valid) {
          const result = {
            remarks: this.policy.remark,
            term: this.policy.term,
            conditions: [],
            companies: this.policy.companies,
            products: this.policy.products,
          };
          _.forEach(_.compact(this.policy.conditions), (item) => {
            result.conditions.push({ ratio: item });
          });
          this.$emit("addPolicy", result);
          this.$message({
            message: this.$t("common.success"),
            type: "success",
            duration: 5 * 1000,
          });
          this.handleClose();
        } else {
          return false;
        }
      });
    },
    getProducts(params) {
      this.$api.product.fetchProductList(params).then((res) => {
        this.products = res.data.list;
      });
    },
    getCompanies(params) {
      this.$api.company.fetchCompanyList(params).then((res) => {
        this.companies = res.data.list;
      });
    },
    searchProduct(query) {
      this.productLoading = true;
      this.$api.product
        .fetchProductList({ wildcard: query })
        .then((res) => {
          this.products = res.data.list;
          this.productLoading = false;
        })
        .catch((_) => {
          this.productLoading = false;
        });
    },
    searchCompany(query) {
      this.companyLoading = true;
      this.$api.company
        .fetchCompanyList({ wildcard: query })
        .then((res) => {
          this.companies = res.data.list;
          this.companyLoading = false;
        })
        .catch((_) => {
          this.companyLoading = false;
        });
    },
    onTypeChange(value) {
      if (value === "products") {
        this.policy.companies = [];
        this.getProducts();
      } else if (value === "companies") {
        this.policy.products = [];
        this.getCompanies();
      } else {
        this.policy.companies = [];
        this.policy.products = [];
      }
    },
    userDefinedChange(value) {
      this.policy.conditions = [];
    },
    validateNumber(rule, value, callback) {
      const reg = /^[0-9]+.?[0-9]*$/;
      if (value > 100) {
        callback(
          new Error(
            this.$t(
              "product.channel.set.add_policy.verify_message.commission_rate_exceed"
            )
          )
        );
      }
      if (reg.test(value)) {
        callback();
      }
      callback(
        new Error(
          this.$t(
            "product.channel.set.add_policy.verify_message.commission_rate_is_number"
          )
        )
      );
    },
  },
};
</script>
