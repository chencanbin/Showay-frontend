<template>
  <div class="table-container">
    <basic-container>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="status in commissionPaymentStatus" :label="statusFormatter(status.id)" :name="status.id" :key="status.id">
          <el-form-item label="" prop="wildcard">
            <el-input v-model="wildcard" clearable placeholder="搜索" @input="search">
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </el-form-item>
          <el-table v-loading="loading" :data="channelCommissionPayment.list" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="right" inline class="channelCommissionPayment-table-expand" label-width="80px">
                  <el-form-item label="供应商:">
                    <span>{{ scope.row.insurancePolicy.company.name }}</span>
                  </el-form-item>
                  <el-form-item label="险种:">
                    <span>{{ scope.row.insurancePolicy.product.name }}</span>
                  </el-form-item>
                  <el-form-item label="受保人:">
                    <span>{{
                      scope.row.insurancePolicy.beneficiary.name
                    }}</span>
                  </el-form-item>
                  <el-form-item label="保额:">
                    <span style="margin-right: 5px">{{
                      getSymbol(scope.row.currency)
                    }}</span><span>{{
                      formatterCurrency(scope.row.insurancePolicy.amountInsured)
                    }}</span>
                  </el-form-item>
                  <el-form-item label="AFYP:">
                    <span style="margin-right: 5px">{{
                      getSymbol(scope.row.currency)
                    }}</span><span>{{ formatterCurrency(scope.row.afyp) }}</span>
                  </el-form-item>
                  <el-form-item label="佣金率:">
                    <span>{{
                      formatterPercent(scope.row.commissionRate)
                    }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="保单号" prop="insurancePolicy.number" min-width="120px" />
            <el-table-column label="期序" prop="year" width="50" />
            <el-table-column label="渠道" prop="channel.name" />
            <el-table-column label="上级渠道" prop="amount">
              <template slot-scope="scope">
                <div v-if="!scope.row.forSuperior">
                  <span>{{ scope.row.superior.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="预计到账" prop="amount" min-width="120">
              <template slot-scope="scope">
                <span class="left_text">{{
                  getSymbol(scope.row.currency)
                }}</span><span class="right_text">{{
                  formatterCurrency(scope.row.calculatedAmount)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="渠道外发" prop="amount" min-width="140">
              <template slot-scope="scope">
                <span class="left_text">{{
                  getSymbol(scope.row.currency)
                }}</span><span class="right_text">{{
                  formatterCurrency(scope.row.amount)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" min-width="100">
              <template slot-scope="scope">
                <!--<statusBadge v-if="scope.row.status === 0" :text="statusFormatter(scope.row.status)" type="processing-badge"/>-->
                <!--<statusBadge v-if="scope.row.status === 1" :text="statusFormatter(scope.row.status)" type="error-badge"/>-->
                <!--<statusBadge v-if="scope.row.status === 2" :text="statusFormatter(scope.row.status)" type="success-badge"/>-->
                <!--<statusBadge v-if="scope.row.status === 3" :text="statusFormatter(scope.row.status)"/>-->
                <el-tag v-if="activeName === '-1'">{{
                  statusFormatter(activeName)
                }}</el-tag>
                <el-tag v-if="activeName === '0'" type="warning">{{
                    statusFormatter(activeName)
                  }}</el-tag>
                <el-tag v-if="activeName === '2'" type="success">{{
                    statusFormatter(activeName)
                  }}</el-tag>
                <el-tag v-if="activeName === '3'" type="info">{{
                    statusFormatter(activeName)
                  }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remarks" min-width="150" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <edit v-if="scope.row.status !== 3" :commission-payment="scope.row" :active-name="activeName" />
              </template>
            </el-table-column>
          </el-table>
          <pagination :total="channelCommissionPayment.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit" />
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import pagination from "@/components/Pagination";
import statusBadge from "@/components/StatusBadge";
import { mapGetters, mapState } from "vuex";
import { commissionPaymentStatus } from "@/utils/constant";
import { parseTime } from "@/utils";
import edit from "./edit";
import { getSymbol } from "@/utils";
import Cookies from "js-cookie";
const currencyFormatter = require("currency-formatter");
const _ = require("lodash");
export default {
  name: "ChannelCommissionPayment",
  components: {
    pagination,
    statusBadge,
    edit,
  },
  data() {
    return {
      activeName: "0",
      wildcard: "",
      commissionPaymentStatus,
      language: Cookies.get("language") || "zh-CN",
      height: window.screen.height - 310,
      listQuery: {
        page: 1,
        limit: 50,
      },
    };
  },
  computed: {
    ...mapGetters(["loading"]),
    ...mapState({
      channelCommissionPayment: (state) =>
        state.client.channelCommissionPayment,
    }),
  },
  created() {
    this.getChannelCommissionPayment({ status: 0 });
  },
  methods: {
    search: _.debounce(function () {
      this.getChannelCommissionPayment({
        status: this.activeName,
        wildcard: this.wildcard,
      });
    }, 500),
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该管理员账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api.user.deleteUser(row.id).then((res) => {
          this.$message({
            message: this.$t("common.success"),
            type: "success",
            duration: 5 * 1000,
          });
          this.getUsers();
        });
      });
    },
    dateFormat(row, column) {
      const date = row[column.property];
      return parseTime(date);
    },
    statusFormatter(value) {
      let result = "";
      _.forEach(commissionPaymentStatus, (item) => {
        if (value === item.id) {
          result = item[this.language];
          return;
        }
      });
      return result;
    },
    formatterCurrency(value) {
      return currencyFormatter.format(Math.floor(value * 100) / 100, {
        symbol: "",
      });
    },
    getSymbol,
    percentFormatter(row, column) {
      const number = row[column.property];
      return _.toNumber(number).toFixed(2) + "%";
    },
    formatterPercent(value) {
      return _.toNumber(value).toFixed(2) + "%";
    },
    getChannelCommissionPayment(params) {
      this.$store.dispatch("client/FetchChannelCommissionPayment", params);
    },
    handleClick(tab, event) {
      this.getChannelCommissionPayment({ status: tab.paneName });
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit;
      const max = pageObj.limit;
      const params = { offset, max };
      this.getChannelCommissionPayment(params);
    },
    updatePage(val) {
      this.listQuery.page = val;
    },
    updateLimit(val) {
      this.listQuery.limit = val;
    },
  },
};
</script>
<style type="text/scss" lang="scss">
.el-card__body {
  padding: 10px;
}
.channelCommissionPayment-table-expand {
  font-size: 0;
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33.3%;
    label {
      color: #99a9bf;
    }
  }
}

.left_text {
  display: inline-block;
  float: left;
}

.right_text {
  display: inline-block;
  float: right;
}
</style>
