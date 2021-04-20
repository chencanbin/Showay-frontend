<template>
  <!--<div class="el-table-add-row" @click="initForm"><span style="font-size: 12px">+ 添加渠道佣金策略</span></div>-->
  <!--<el-button class="el-table-add-row" plain type="primary" size="small" style="height: 40px" @click="initForm" >+ {{ $t('product.channel.set.add_title') }}</el-button>-->
  <!--<el-button :loading="loading" type="primary" size="small" icon="el-icon-plus" @click="initForm">添加</el-button>-->
  <el-dialog
    id="createChannelCommissionTableDialog"
    :visible="dialogVisible"
    :before-close="handleClose"
    :fullscreen="true"
    :title="$t('product.channel.set.add_title')"
    center
  >
    <el-table
      id="createChannelCommissionTable"
      :data="policies"
      :max-height="tableHeight"
      stripe
      row-key="id"
    >
      <el-table-column
        :label="$t('product.channel.set.priority')"
        type="index"
        width="80"
      />
      <el-table-column
        :label="$t('product.channel.set.name')"
        prop="name"
        min-width="300"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="product in scope.row.products"
            :key="product.id"
            style="margin-right: 10px; margin-bottom: 5px"
          >{{ product.name }}</el-tag
          >
          <el-tag
            v-for="company in scope.row.companies"
            :key="company.id"
            style="
              margin-right: 10px;
              margin-bottom: 5px;
              color: #409eff;
              background-color: rgba(64, 158, 255, 0.1);
              border: 1px solid rgba(64, 158, 255, 0.2);
            "
          >{{ company.name }}</el-tag
          >
          <el-tag
            v-if="!scope.row.products && !scope.row.companies"
            type="success"
          >{{ $t("product.channel.set.add_policy.all") }}</el-tag
          >
          <el-tag
            v-if="
              scope.row.products &&
                scope.row.companies &&
                scope.row.products.length === 0 &&
                scope.row.companies.length === 0
            "
            type="success"
          >{{ $t("product.channel.set.add_policy.all") }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('product.channel.set.term')"
        prop="term"
        width="60"
        align="center"
      />
      <el-table-column
        v-for="(year, index) in columnYear"
        :key="index"
        :label="year"
        width="70"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.conditions[index]
              ? scope.row.conditions[index].ratio + "%"
              : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('common.remarks')"
        prop="remarks"
        align="center"
        min-width="150"
      />
      <el-table-column 
        :label="$t('common.action')" 
        width="80" 
        align="center">
        <template slot-scope="scope">
          <el-button
            :loading="loading"
            type="text"
            size="small"
            icon="el-icon-delete"
            @click="deleteRow(scope.$index)"
          >{{ $t("common.delete") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <addPolicy @addPolicy="onAddPolicy" />
    <div 
      slot="footer" 
      class="dialog-footer">
      <el-button @click="handleClose">{{
        $t("common.cancelButton")
      }}</el-button>
      <el-button 
        type="primary" 
        @click="timeDialogVisible = true">{{
          $t("common.submitButton")
        }}</el-button>
    </div>
    <!-- 佣金生效时间弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="timeDialogVisible"
      :title="$t('product.channel.set.save_dialog_title')"
      width="400px"
      append-to-body
    >
      <el-form 
        ref="configForm" 
        label-width="80px">
        <el-form-item :label="$t('product.channel.set.effectiveDate')">
          <el-date-picker
            v-model="effectiveDate"
            type="datetime"
            value-format="timestamp"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item 
          :label="$t('common.remarks')" 
          prop="remarks">
          <el-input
            v-model="remarks"
            :placeholder="$t('common.remarks_placeholder')"
          />
        </el-form-item>
      </el-form>
      <div 
        slot="footer" 
        class="dialog-footer" 
        style="text-align: center">
        <el-button
          :loading="saveLoading"
          type="primary"
          @click="handleSubmit"
        >{{ this.$t("common.confirmButton") }}</el-button
        >
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import addPolicy from "./addPolicy";
import Sortable from "sortablejs";
import prefixSelect from "./component/prefixSelect";
const _ = require("lodash");
export default {
  components: {
    prefixSelect,
    addPolicy,
  },
  props: {
    // id: {
    //   type: Number,
    //   default() {
    //     return 0
    //   }
    // }
  },
  data() {
    return {
      id: "",
      effectiveDate: "",
      originalPolicies: [],
      policies: [],
      tableHeight: window.screen.height - 320,
      companies: [],
      products: [],
      columnYear: [],
      dialogVisible: false,
      timeDialogVisible: false,
      buttonLoading: false,
      remarks: "",
      saveLoading: false,
      loading: false,
      index: 0,
    };
  },
  methods: {
    initForm(id) {
      this.id = id;
      this.index = 0;
      this.policies = [];
      this.effectiveDate = new Date().valueOf();
      this.dialogVisible = true;
    },

    // 格式化策略数据, 原始策略数据的conditions 只提供缩减版的数组，需要将数据进行展开
    formatterData(policies) {
      const conditionLengthArray = [];
      this.columnYear = [];
      _.forEach(policies, (item) => {
        const conditionsOriginalSize = item.conditions.length;
        const lastCondition = item.conditions[conditionsOriginalSize - 1];
        for (let i = 0; i < item.term - conditionsOriginalSize; i++) {
          item.conditions.push(lastCondition);
        }
        conditionLengthArray.push(item.conditions.length);
      });
      this.policies = policies;
      _.forEach(_.range(1, _.max(conditionLengthArray) + 1), (item) => {
        if (item > 15) {
          this.columnYear.push(this.$t("common.after_15_year"));
        } else {
          this.columnYear.push(this.$t("common.year", [item]));
        }
      });
    },
    handleClose() {
      this.$confirm(this.$t("common.tooltip.close"), this.$t("common.prompt"), {
        confirmButtonText: this.$t("common.confirmButton"),
        cancelButtonText: this.$t("common.cancelButton"),
        type: "warning",
      }).then(() => {
        this.remarks = "";
        this.timeDialogVisible = false;
        this.dialogVisible = false;
      });
    },
    handleSubmit() {
      this.saveLoading = true;
      // 处理companies 和 products 字段, 只提交id的数组
      const data = _.cloneDeep(this.originalPolicies);
      _.forEach(data, (item) => {
        const products = [];
        const companies = [];
        _.forEach(item.products, (product) => {
          products.push(product.id);
        });
        _.forEach(item.companies, (company) => {
          companies.push(company.id);
        });
        item.products = products;
        item.companies = companies;
      });
      this.$api.channel
        .createChannelCommissionPolicy({
          channel: this.id,
          policies: data,
          effectiveDate: this.effectiveDate,
          remarks: this.remarks,
        })
        .then((res) => {
          this.dialogVisible = false;
          this.timeDialogVisible = false;
          this.saveLoading = false;
          this.$store.dispatch("client/FetchChannelCommissionTable", {
            channel: this.id,
          });
        })
        .catch((_) => {
          this.saveLoading = false;
        });
    },
    getProducts(params) {
      this.$api.product.fetchProductList().then((res) => {
        this.products = res.data.list;
      });
    },
    getCompanies(params) {
      this.$api.company.fetchCompanyList(params).then((res) => {
        this.companies = res.data.list;
      });
    },
    onAddPolicy(result) {
      // clone 添加的策略对象, 并添加到原始数据的数组中
      const originalResult = _.cloneDeep(result);
      this.index = this.index + 1;
      result.id = this.index;
      this.originalPolicies.push(originalResult);
      this.policies.push(result);
      this.formatterData(this.policies);
      this.rowDrop();
    },
    // 行拖拽函数
    rowDrop() {
      const tbody = document.querySelector(
        "#createChannelCommissionTable .el-table__body-wrapper tbody"
      );
      const _this = this;
      Sortable.create(tbody, {
        // onEnd({ newIndex, oldIndex }) {
        //   const oldRow = _this.policies[oldIndex]
        //   const newRow = _this.policies[newIndex]
        //   _this.policies[newIndex] = oldRow
        //   _this.policies[oldIndex] = newRow
        //   _this.originalPolicies = _.cloneDeep(_this.policies)
        // }
        onEnd({ newIndex, oldIndex }) {
          const targetRow = _this.policies.splice(oldIndex, 1)[0];
          _this.policies.splice(newIndex, 0, targetRow);
          _this.originalPolicies = _.cloneDeep(_this.policies);
          console.log(_this.originalPolicies);
        },
      });
    },
    deleteRow(index) {
      this.policies.splice(index, 1);
      this.originalPolicies = _.cloneDeep(this.policies);
    },
    getUsers(param) {
      const role = { role: 2 };
      if (param) {
        param.role = role;
      } else {
        param = role;
      }
      this.$store.dispatch("FetchUserList", param);
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">
</style>
