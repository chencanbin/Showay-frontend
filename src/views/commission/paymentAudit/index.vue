<template>
  <div id="paymentAudit" class="table-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="item in status" :name="item.id" :label="statusFormatter(item.id)" :key="item.id" lazy>
        <el-form :inline="true" class="filter-form" @submit.native.prevent>
          <el-form-item label="" prop="wildcard">
            <el-input v-model="wildcard" :placeholder="$t('commission.payment.search')" clearable @input="search">
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </el-form-item>
        </el-form>
        <basic-container>
          <el-table v-loading="auditPaymentLoading" :data="auditPayment.list" stripe border>
            <el-table-column :label="$t('commission.payment.channel')" prop="channel.name" min-width="150" />
            <el-table-column :label="$t('commission.payment.calculatedTotalInHkd')" min-width="175">
              <template slot-scope="scope">
                <span class="left_text">HK$ </span><span class="right_text">{{
                formatterCurrency(scope.row.calculatedTotalInHkd)
              }}</span>
              </template>
            </el-table-column>
            <!--<el-table-column :label="$t('commission.payment.predictedTotalInHkd')" min-width="120">-->
            <!--<template slot-scope="scope">-->
            <!--<span class="left_text">HK$ </span><span class="right_text">{{ formatterCurrency(scope.row.predictedTotalInHkd) }}</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column :label="$t('commission.payment.amountInHkd')" min-width="120">
              <template slot-scope="scope">
                <span class="left_text">HK$ </span><span class="right_text">{{
                formatterCurrency(scope.row.amountInHkd)
              }}</span>
              </template>
            </el-table-column>
            <el-table-column :formatter="dateFormatter" :label="$t('client.insurance_policy.submitDate')" prop="creationDate" min-width="120" />
            <el-table-column v-if="activeName === '3'" :label="$t('commission.payment.chequeNumber')" prop="chequeNumber" />
            <el-table-column v-if="activeName === '3'" :label="$t('commission.payment.chequeCopy')" prop="chequeCopy" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="viewScanFile(scope.row.chequeCopy)">{{ $t("common.view") }}</el-button>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.status')" width="100" align="center">
              <template slot-scope="scope">
                <el-tag v-if="activeName === '-1'" class="primary_status">{{
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
                <!--<statusBadge v-if="activeName === '-1'" :text="statusFormatter(activeName)" type="processing-badge"/>-->
                <!--<statusBadge v-if="activeName === '0'" :text="statusFormatter(activeName)" type="warning-badge"/>-->
                <!--<statusBadge v-if="activeName === '2'" :text="statusFormatter(activeName)" type="success-badge"/>-->
                <!--<statusBadge v-if="activeName === '3'" :text="statusFormatter(activeName)"/>-->
              </template>
            </el-table-column>
            <el-table-column v-if="hasPermission(100072) && activeName !== '3'" :label="$t('common.action')" width="150" align="center">
              <template slot-scope="scope">
                <detail v-if="activeName === '-1'" :channel="scope.row.channel" :id="scope.row.id || 0" :status="activeName" />
                <detail v-if="activeName === '0'" :channel="scope.row.channel" :id="scope.row.id || 0" :status="activeName" />
                <clear v-if="hasPermission(100072) && activeName === '2'" :id="scope.row.id || 0" />
              </template>
            </el-table-column>
          </el-table>
          <div class="table-bottom payment-audit-bottom">
            <pagination :total="auditPayment.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit" />
          </div>
        </basic-container>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import pagination from "@/components/Pagination";
import statusBadge from "@/components/StatusBadge";
import { mapState } from "vuex";
import { parseTime } from "@/utils";
import { commissionPaymentStatus } from "@/utils/constant";
import { hasPaymentStatuses } from "@/utils/permission";
import Cookies from "js-cookie";
import detail from "./detail";
import clear from "./clear";
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";

const currencyFormatter = require("currency-formatter");
const _ = require("lodash");
export default {
  name: "ChannelCommissionPayment",
  components: {
    pagination,
    statusBadge,
    detail,
    clear,
  },
  data() {
    return {
      activeName: "-1",
      wildcard: "",
      status: [],
      language: Cookies.get("language") || "zh-CN",
      height: document.body.clientHeight - 200,
      chequeCopy: [],
      listQuery: {
        page: 1,
        limit: 50,
      },
    };
  },
  computed: {
    ...mapState({
      auditPayment: (state) => state.commission.auditPayment,
      auditPaymentLoading: (state) => state.commission.auditPaymentLoading,
    }),
  },
  created() {
    this.filterPaymentStatus();
    this.activeName = this.status[0].id;
    this.getAuditPayment({ status: this.status[0].id });
  },
  methods: {
    hasPaymentStatuses,
    filterPaymentStatus() {
      _.forEach(commissionPaymentStatus, (item) => {
        if (this.hasPaymentStatuses(item.role)) {
          this.status.push(item);
        }
      });
    },
    search: _.debounce(function () {
      this.getAuditPayment({
        status: this.activeName,
        wildcard: this.wildcard,
      });
    }, 500),
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
    dateFormatter(row) {
      return parseTime(row.creationDate, "{y}-{m}-{d}");
    },
    percentFormatter(row, column) {
      const number = row[column.property];
      return _.toNumber(number).toFixed(2) + "%";
    },
    formatterPercent(value) {
      return _.toNumber(value).toFixed(2) + "%";
    },
    viewScanFile(key) {
      this.$api.document.getCompanyDownloadLink(key).then((res) => {
        this.chequeCopy = [res.data.url];
        const image = new Image();
        image.src = this.chequeCopy;
        const viewer = new Viewer(image, {
          hidden: function () {
            viewer.destroy();
          },
        });
        viewer.show();
      });
    },
    getAuditPayment(params) {
      this.$store.dispatch("commission/FetchAuditPayment", params);
    },
    handleClick(tab, event) {
      this.getAuditPayment({ status: tab.name });
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit;
      const max = pageObj.limit;
      const params = { offset, max };
      this.getAuditPayment(params);
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
#paymentAudit {
  .el-table td {
    font-size: 14px;
    border-bottom: 1px solid #edf1f8;
  }
  .el-table th > .cell {
    padding-left: 16px;
  }
  .el-table--border td:first-child .cell {
    padding-left: 0;
  }
  .filter-form {
    margin-top: 0;
    margin-left: 0;
    display: flex;
    border-radius: 8px;
    background: #fff;
    margin-bottom: 16px;
    padding: 20px 24px;
    .el-form-item {
      display: flex;
      align-items: center;
      margin-bottom: 0;
    }
  }
  .bottom-wrapper {
    background: #fff;
    width: 100%;
    height: 60px;
  }
  .el-tabs__nav {
    .el-tabs__item {
      background: #fff;
      width: 100px;
      text-align: center;
      border: 1px solid #e9e8f0;
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

  .primary_status {
    color: $--purple;
    background: $--purple-assist;
  }

  .payment-audit-bottom {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
