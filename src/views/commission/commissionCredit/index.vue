<template>
  <div id="credit" class="table-container">
    <!--<el-form :inline="true" style="display: inline-block; position: absolute; right: 10px; z-index: 1000;">-->
    <!--<el-form-item label="切换排序">-->
    <!--<el-switch v-model="mode">-->
    <!--</el-switch>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--<component v-bind:is="getComponent"></component>-->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane v-for="status in creditStatus" :key="status.id" :name="status.id + ''" :label="statusFormatter(status.id)">
        <el-form :inline="true" class="filter-form" @submit.native.prevent>
          <el-form-item v-if="activeName === '1' && selectData.length > 0">
            <el-button type="primary" size="small" @click="batchPay">{{
                  $t("commission.credit.batchPay")
                }}</el-button>
          </el-form-item>
          <el-form-item label="" class="search-input" prop="wildcard">
            <el-input v-model="wildcard" :placeholder="$t('commission.credit.search')" clearable @input="search">
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="dateRange">
            <el-date-picker v-model="dateRange" :unlink-panels="true" :start-placeholder="$t('commission.credit.start')" :end-placeholder="$t('commission.credit.end')" :picker-options="pickerOptions" value-format="timestamp" type="daterange" range-separator="-" @change="onDateRangeChange" />
          </el-form-item>
          <el-form-item label="期序">
            <el-select v-model="term" clearable style="width: 90px">
              <el-option v-for="item in generateDefaultTerm()" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('commission.credit.switch_sort')">
            <el-switch v-model="mode" @change="onSwitchChange" />
          </el-form-item>
        </el-form>

        <basic-container>
          <el-row>
            <div class="tag-sum">
              <i class="el-icon-info" style="margin-right: 5px" />
              <span class="count-item">{{ selectTotalText }}:
                <count-to class="count-num" :start-val="0" :end-val="selectTotal" :duration="2000" :suffix="$t('commission.credit.count')" />
              </span>
              <span class="count-item">{{ selectSumText }}:
                <count-to class="count-num" :start-val="0" :end-val="selectSum" :duration="2000" prefix="HK$ " />
              </span>
              <span class="count-item">{{ totalText }}:
                <count-to class="count-num" :start-val="0" :end-val="commissionCredit.total" :duration="2000" :suffix="$t('commission.credit.count')" />
              </span>
              <span class="count-item">{{ sumText }}:
                <count-to class="count-num" :start-val="0" :end-val="sum" :duration="2000" prefix="HK$ " />
              </span>
            </div>
          </el-row>
          <el-table v-loading="commissionCreditLoading" stripe :data="commissionCredit.list" :row-class-name="tableRowClassName" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="80" align="center" v-if="activeName !== '-1'" />
            <el-table-column :label="$t('client.insurance_policy.number')" prop="insurancePolicy.number" min-width="100px" show-overflow-tooltip>
              <template slot-scope="scope">
                <policy-detail :policy-number="scope.row.insurancePolicy.number" :id="scope.row.insurancePolicy.id" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('client.insurance_policy.premium')" min-width="140">
              <template slot-scope="scope">
                <span class="left_text">{{ getSymbol(scope.row.currency) }}</span><span class="right_text">{{
                formatterCurrency(scope.row.premium)
              }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('client.insurance_policy.applicant_name')" prop="insurancePolicy.applicant.name" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <client-detail :id="scope.row.insurancePolicy.applicant.id" :name="scope.row.insurancePolicy.applicant.name" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('commission.credit.year')" prop="year" align="center" />
            <el-table-column :formatter="formatterSubmitDate" :label="$t('client.insurance_policy.submitDate')" prop="insurancePolicy.submitDate" min-width="120" show-overflow-tooltip />
            <el-table-column :formatter="formatterIssueDate" :label="$t('client.insurance_policy.issueDate')" prop="insurancePolicy.issueDate" min-width="100" show-overflow-tooltip />
            <el-table-column :label="$t('common.calculatedAmount')" min-width="120" v-if="activeName !== '-1'">
              <template slot-scope="scope">
                <span class="left_text">{{ getSymbol(scope.row.currency) }}</span><span class="right_text">{{
                formatterCurrency(scope.row.calculatedAmount)
              }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.amount')" prop="amount" min-width="120" v-if="activeName !== '-1'">
              <template slot-scope="scope">
                <span class="left_text">HK$ </span>
                <span class="right_text">{{
                formatterCurrency(scope.row.amount)
              }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.status')" min-width="80" align="center" v-if="activeName !== '-1'">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 0" class="primary_status">{{
                  statusFormatter(scope.row.status)
                }}</el-tag>
                <el-tag v-if="scope.row.status === 1" type="warning">{{
                  statusFormatter(scope.row.status)
                }}</el-tag>
                <el-tag v-if="scope.row.status === 2" type="success">{{
                  statusFormatter(scope.row.status)
                }}</el-tag>
                <el-tag v-if="scope.row.status === 3" type="success">{{
                  statusFormatter(scope.row.status)
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.status')" min-width="200" align="center">
              <template slot-scope="scope">
                <el-tag class="primary_status">{{
                  statusFormatter(0)
                }}</el-tag>
                <div class="horizontal-line" :class="scope.row.status <= 0 ? 'info_bg': ''"></div>
                <el-tag :class="scope.row.status <= 0 ? 'info_tag': 'warning_tag'">{{
                  statusFormatter(1)
                }}</el-tag>
                <div class="horizontal-line" :class="scope.row.status <= 1 ? 'info_bg': ''"></div>
                <el-tag :class="scope.row.status <= 1 ? 'info_tag': 'success_tag'">{{
                  statusFormatter(2)
                }}</el-tag>
              </template>
            </el-table-column>
            <!--<el-table-column label="备注" prop="remarks" min-width="140"/>-->
            <el-table-column v-if="activeName !== '2' && activeName !== '-1'" :label="$t('common.action')" width="100">
              <template slot-scope="scope">
                <edit v-if="scope.row.status === 0" :commission-credit="scope.row" :wildcard="wildcard" :date-range="dateRange" :active-name="activeName" :key="scope.row.id" :sort="sort" :order="order" :term="term" :list-query="listQuery" />
                <audit v-if="scope.row.status === 1" :commission-credit="scope.row" :active-name="activeName" :wildcard="wildcard" :date-range="dateRange" :sort="sort" :order="order" :list-query="listQuery" />
              </template>
            </el-table-column>
          </el-table>
          <div class="table-bottom">
            <pagination :total="commissionCredit.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit" />
          </div>
        </basic-container>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import pagination from "@/components/Pagination";
import { mapState } from "vuex";
import { parseTime, getSymbol } from "@/utils";
import { creditStatus } from "@/utils/constant";
import edit from "./edit";
import audit from "./audit";
import policyDetail from "../../client/policy/policyDetail";
import clientDetail from "../../client/info/clientDetail";
import Cookies from "js-cookie";
import CountTo from "vue-count-to";
import {
  getCurrentYearFirst,
  getCurrentYearLast,
  getYearFirst,
  getYearLast,
} from "@/utils";
const currencyFormatter = require("currency-formatter");
const _ = require("lodash");
const now = new Date();
export default {
  name: "CommissionCredit",
  components: {
    pagination,
    edit,
    audit,
    policyDetail,
    CountTo,
    clientDetail,
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: now.getFullYear() - 10,
            onClick(picker) {
              const time = new Date().setFullYear(now.getFullYear() - 10);
              const start = getYearFirst(time);
              const end = getYearLast(time);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: now.getFullYear() - 9,
            onClick(picker) {
              const time = new Date().setFullYear(now.getFullYear() - 9);
              const start = getYearFirst(time);
              const end = getYearLast(time);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: now.getFullYear() - 8,
            onClick(picker) {
              const time = new Date().setFullYear(now.getFullYear() - 8);
              const start = getYearFirst(time);
              const end = getYearLast(time);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: now.getFullYear() - 7,
            onClick(picker) {
              const time = new Date().setFullYear(now.getFullYear() - 7);
              const start = getYearFirst(time);
              const end = getYearLast(time);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: now.getFullYear() - 6,
            onClick(picker) {
              const time = new Date().setFullYear(now.getFullYear() - 6);
              const start = getYearFirst(time);
              const end = getYearLast(time);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: now.getFullYear() - 5,
            onClick(picker) {
              const time = new Date().setFullYear(now.getFullYear() - 5);
              const start = getYearFirst(time);
              const end = getYearLast(time);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: now.getFullYear() - 4,
            onClick(picker) {
              const time = new Date().setFullYear(now.getFullYear() - 4);
              const start = getYearFirst(time);
              const end = getYearLast(time);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: now.getFullYear() - 3,
            onClick(picker) {
              const time = new Date().setFullYear(now.getFullYear() - 3);
              const start = getYearFirst(time);
              const end = getYearLast(time);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: now.getFullYear() - 2,
            onClick(picker) {
              const time = new Date().setFullYear(now.getFullYear() - 2);
              const start = getYearFirst(time);
              const end = getYearLast(time);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: now.getFullYear() - 1,
            onClick(picker) {
              const time = new Date().setFullYear(now.getFullYear() - 1);
              const start = getYearFirst(time);
              const end = getYearLast(time);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      mode: false,
      sort: "year,submitDate",
      order: "asc,desc",
      dateRange: [getCurrentYearFirst(), getCurrentYearLast()],
      term: "",
      totalText: "",
      sumText: "",
      selectTotalText: "",
      selectSumText: "",
      creditStatus,
      language: Cookies.get("language") || "zh-CN",
      activeName: "-1",
      wildcard: "",
      sum: 0,
      total: 0,
      selectTotal: 0,
      selectSum: 0,
      queryCondition: {},
      listQuery: {
        page: 1,
        limit: 50,
      },
      selectRow: [],
      selectData: [],
    };
  },
  computed: {
    ...mapState({
      commissionCredit: (state) => state.commission.commissionCredit,
      commissionCreditLoading: (state) =>
        state.commission.commissionCreditLoading,
    }),
  },
  watch: {
    selectData(data) {
      this.selectRow = [];
      if (data.length > 0) {
        data.forEach((item, index) => {
          this.selectRow.push(this.commissionCredit.list.indexOf(item));
        });
      }
    },
    term(val) {
      this.getCommissionCreditList({ wildcard: this.wildcard });
    },
  },
  created() {
    if (this.$route.query.type) {
      this.activeName = this.$route.query.type;
    }
    this.commissionCredit.total = 0;
    this.queryCondition = {
      status: this.activeName,
      wildcard: this.wildcard,
      sort: "year,submitDate",
      order: "asc,desc",
    };
    this.getCommissionCreditList();
  },
  methods: {
    search: _.debounce(function () {
      this.listQuery = { page: 1, limit: 50 };
      this.getCommissionCreditList({ wildcard: this.wildcard });
    }, 500),
    getCommissionCreditSum(params) {
      let data = { wildcard: this.wildcard };
      if (this.activeName !== '-1') {
        data['status'] = this.activeName
      }
      if (this.dateRange) {
        data = _.assign(data, {
          geDueDate: this.dateRange[0],
          leDueDate: this.dateRange[1],
        });
      }
      if (this.term) {
        data = _.assign(data, { term: this.term });
      }
      data = _.assign(data, params);
      this.$api.commission.getCommissionCreditSum(data).then((res) => {
        this.sum = Number(res.data.sum);
      });
    },
    getCommissionCreditList(params) {
      if (this.activeName === '-1') {
        delete this.queryCondition.status
      }
      if (this.dateRange) {
        this.queryCondition = _.assign(this.queryCondition, {
          geDueDate: this.dateRange[0],
          leDueDate: this.dateRange[1],
        });
      } else {
        delete this.queryCondition.geDueDate;
        delete this.queryCondition.leDueDate;
      }
      if (this.term) {
        this.queryCondition = _.assign(this.queryCondition, {
          term: this.term,
        });
      } else {
        delete this.queryCondition.term;
      }
      this.queryCondition = _.assign(this.queryCondition, params);
      this.$store.dispatch(
        "commission/FetchCommissionCredit",
        this.queryCondition
      );
      if (this.activeName === "0") {
        this.totalText = this.$t("commission.credit.calculated_count");
        this.sumText = this.$t("commission.credit.calculated_amount_total");
        this.selectTotalText = this.$t(
          "commission.credit.calculated_selected_count"
        );
        this.selectSumText = this.$t(
          "commission.credit.calculated_selected_sum"
        );
        this.getCommissionCreditSum({ calculated: "", ...params });
      } else if (this.activeName === "1") {
        this.totalText = this.$t("commission.credit.amount_count");
        this.sumText = this.$t("commission.credit.amount_total");
        this.selectTotalText = this.$t(
          "commission.credit.amount_selected_count"
        );
        this.selectSumText = this.$t("commission.credit.amount_selected_sum");
        this.getCommissionCreditSum({ amount: "", ...params });
      } else if (this.activeName === "3") {
        this.totalText = this.$t("commission.credit.cleared_count");
        this.sumText = this.$t("commission.credit.cleared_total");
        this.selectTotalText = this.$t(
          "commission.credit.cleared_selected_count"
        );
        this.selectSumText = this.$t("commission.credit.cleared_selected_sum");
        this.getCommissionCreditSum({ amount: "", ...params });
      }
    },
    getSymbol,
    generateDefaultTerm() {
      return _.range(1, 16);
    },
    formatterCurrency(value) {
      return currencyFormatter.format(Math.floor(value * 100) / 100, {
        symbol: "",
      });
    },
    formatterIssueDate(row, column) {
      const date = row.insurancePolicy.issueDate;
      return parseTime(date, "{y}-{m}-{d}");
    },
    formatterSubmitDate(row, column) {
      const date = row.insurancePolicy.submitDate;
      return parseTime(date, "{y}-{m}-{d}");
    },
    statusFormatter(value) {
      let result = "";
      _.forEach(creditStatus, (item) => {
        if (item.id === value) {
          result = item[this.language];
          return;
        }
      });
      return result;
    },
    getRandom() {
      return Math.random();
    },
    handleTabClick() {
      this.queryCondition.status = this.activeName;
      this.$set(this.queryCondition, "max", 50);
      this.$set(this.queryCondition, "offset", 0);
      this.getCommissionCreditList();
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit;
      const max = pageObj.limit;
      const params = { offset, max };
      this.getCommissionCreditList(params);
    },
    updatePage(val) {
      this.listQuery.page = val;
    },
    updateLimit(val) {
      this.listQuery.limit = val;
    },
    onDateRangeChange(value) {
      this.getCommissionCreditList();
    },
    onSwitchChange() {
      if (this.mode) {
        this.sort = "number,issueDate";
        this.order = "desc,desc";
        const query = {
          status: this.activeName,
          sort: this.sort,
          order: this.order,
          wildcard: this.wildcard,
        };
        this.queryCondition = query;
        this.getCommissionCreditList();
      } else {
        this.sort = "year,submitDate";
        this.order = "asc,desc";
        const query = {
          status: this.activeName,
          sort: this.sort,
          order: this.order,
          wildcard: this.wildcard,
        };
        this.queryCondition = query;
        this.getCommissionCreditList();
      }
    },
    handleSelectionChange(selected) {
      this.selectData = selected;
      this.selectTotal = selected.length;
      let calculatedAmountInHkd = 0;
      _.forEach(selected, (item) => {
        calculatedAmountInHkd =
          calculatedAmountInHkd + Number(item.calculatedAmountInHkd);
      });
      this.selectSum = calculatedAmountInHkd;
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.selectRow.includes(rowIndex)) {
        return "selected-row";
      }
    },
    batchPay() {
      const ids = [];
      _.forEach(this.selectData, (item) => {
        ids.push(item.id);
      });
      this.$confirm(
        this.$t("commission.credit.tooltip.batchPay"),
        this.$t("common.prompt"),
        {
          confirmButtonText: this.$t("commission.credit.pay"),
          cancelButtonText: this.$t("common.cancelButton"),
          type: "warning",
          callback: (action, instance) => {
            if (action === "confirm") {
              this.$api.commission
                .CommissionCreditClear({ ids: ids })
                .then((_) => {
                  this.$message({
                    message: this.$t("common.success"),
                    type: "success",
                    duration: 5 * 1000,
                  });
                  this.$store.dispatch("commission/FetchCommissionCredit", {
                    status: this.activeName,
                  });
                  this.dialogVisible = false;
                });
            }
          },
        }
      );
    },
  },
};
</script>
<style type="text/scss" lang="scss">
.left_text {
  display: inline-block;
  float: left;
}

.right_text {
  display: inline-block;
  float: right;
}
.el-picker-panel__sidebar {
  width: 80px;
  .el-picker-panel__shortcut {
    text-align: center;
    padding: 2px 0;
  }
}
#credit {
  .table-bottom {
    display: flex;
    justify-content: flex-end;
  }

  .el-card__body {
    padding: 0px;
  }
  .el-table td {
    font-size: 14px;
    border-bottom: 1px solid #edf1f8;
  }
  th:first-child {
    padding-left: 0;
  }
  .el-table__row td:first-child {
    padding-left: 16px;
    .cell {
      padding-left: 0;
    }
  }
  .el-table th > .cell {
    padding-left: 14px;
  }
  .el-tabs__nav {
    .el-tabs__item {
      background: #fff;
      width: 100px;
      text-align: center;
      border: 1px solid #edf1f8;
      padding-right: 0;
      padding-left: 0;
    }
    .el-tabs__item:nth-child(2) {
      border-radius: 6px 0px 0px 6px;
      border-right: 0;
    }
    .el-tabs__item:last-of-type {
      border-radius: 0px 6px 6px 0px;
      border-left: 0;
    }
    .el-tabs__active-bar {
      width: 15px !important;
      height: 4px;
      border-radius: 3px 3px 0px 0px;
      left: 42.5px;
    }
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .el-checkbox__inner {
    width: 20px;
    height: 20px;
    &::after {
      height: 7px;
      top: 4px;
      left: 7px;
    }
    &::before {
      top: 8px;
    }
  }

  // .el-tabs__nav:nth-child(0) {
  //   border-radius: 6px 0px 0px 6px;

  //   color: red;
  //   background: red;
  // }
  .filter-form {
    margin-top: 0;
    margin-left: 0;
    display: flex;
    border-radius: 8px;
    background: #fff;
    margin-bottom: 16px;
    padding: 15px 24px;
    .el-form-item {
      display: flex;
      align-items: center;
      margin-bottom: 0;
    }
    .search-input .el-input--suffix {
      &::before {
        font-family: "iconfont";
        font-size: 24px;
        content: "\E6AC";
        position: absolute;
        top: 0;
        left: 0.0625rem;
        color: #b5b9c6;
      }
      .el-input__inner {
        width: 250px;
        padding-left: 44px !important;
      }
    }
  }
  .bottom-wrapper {
    background: #fff;
    width: 100%;
    height: 60px;
  }
  .horizontal-line {
    width: 30px;
    height: 1px;
    background: $--purple;
    display: inline-block;
    vertical-align: middle;
    margin-left: 4px;
    margin-right: 4px;
  }
}

.tag-sum {
  margin-bottom: 16px;
  padding-left: 16px;
  width: 100%;
  font-size: 14px;
  line-height: 50px;
  height: 50px;
  overflow-x: auto;
  overflow-y: hidden;
  color: $--purple;
  background: $--purple-assist;
  border-radius: 6px;
  border: 1px solid #e7e8f5;
  display: flex;
  align-items: center;
  i {
    font-size: 24px;
  }
  .count-item {
    margin-right: 50px;
    .count-num {
      font-weight: 800;
    }
  }
}
.primary_status {
  color: $--purple;
  background: $--purple-assist;
  border: 0;
}
.info_tag {
  color: $--label;
  background: #f6f6f7;
  border: 0;
}
.warning_tag {
  color: $--orange;
  background: $--orange-assist;
  border: 0;
}
.success_tag {
  color: $--green;
  background: $--green-assist;
  border: 0;
}
.info_bg {
  background: #e3e2eb !important;
}
</style>
