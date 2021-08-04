<template>
  <el-dialog id="compareProduct" :visible="dialogVisible" :before-close="handleClose" :fullscreen="true" :title="title" append-to-body>
    <div class="table-container">
      <div class="header">
        <el-form :inline="true" @submit.native.prevent>
          <el-form-item :label="$t('product.channel.view.product')" class="search_item" prop="params.products">
            <el-select :loading="productLoading" :remote-method="searchProduct" :placeholder="
              $t('product.channel.set.add_policy.product_placeholder')
            " v-model="params.products" multiple remote filterable @focus="onProductFocus" @change="getViewData">
              <el-option v-for="item in products" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <i class="el-icon-close icon-closeFc" @click="handleClose" style="margin-top: -15px"></i>
      </div>
      <basic-container>
        <el-table v-loading="loading" :data="data" stripe :height="tableHeight">
          <el-table-column v-for="(year, index) in columnYear" :key="index" :label="year" width="100">
            <template slot-scope="scope">
              <span>{{
                  scope.row.conditions[index]
                    ? formatToPercent(scope.row.conditions[index].rate)
                    : "-"
                }}</span>
            </template>
          </el-table-column>
        </el-table>
      </basic-container>
    </div>

  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { parseTime, param } from "@/utils";
import pagination from "@/components/Pagination";
import axios from "axios";
import { numberAcronym } from "@/utils/constant";
import Cookies from "js-cookie";
const _ = require("lodash");
export default {
  name: "CommissionView",
  components: {
    pagination,
  },
  data() {
    return {
      tableHeight: document.body.clientHeight - 200,
      loading: false,
      productLoading: false,
      companyLoading: false,
      exportLoading: false,
      wildcard: "",
      products: [],
      nProducts: [],
      dialogVisible: false,
      id: "",
      title: "",
      timestamp: "",
      channelName: "",
      data: [],
      total: 0,
      columnYear: [],
      params: {
        companies: [],
        nCompanies: [],
        products: [],
        nProducts: [],
      },
      listQuery: {
        page: 1,
        limit: 50,
      },
    };
  },
  methods: {
    search: _.debounce(function () {
      this.listQuery = { page: 1, limit: 50 };
      this.getViewData({ wildcard: this.wildcard });
    }, 500),
    openDialog(channelPolicyObj, channelName) {
      // this.id = channelPolicyObj.id;
      // this.channelName = channelName;
      // this.timestamp = channelPolicyObj.timestamp;
      // this.title = `${this.$t(
      //   "product.channel.view.title"
      // )} - ${channelName} ( ${parseTime(
      //   channelPolicyObj.timestamp,
      //   "{y}-{m}-{d}"
      // )} )`;
      this.getViewData();
      this.dialogVisible = true;
    },
    getProducts(params) {
      params = Object.assign({ timestamp: this.timestamp }, params);
      this.$api.product.fetchProductList(params).then((res) => {
        this.products = res.data.list;
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
    onProductFocus() {
      this.getProducts();
    },
    onCompanyFocus() {
      this.getCompanies();
    },
    getViewData(params) {
      this.params = Object.assign({ timestamp: this.timestamp }, this.params);
      this.loading = true;
      this.$api.channel
        .previewChannelCommission(this.id, this.params)
        .then((res) => {
          this.data = res.data.list;
          this.total = res.data.total;
          const conditionLengthArray = [];
          this.columnYear = [];
          _.forEach(res.data.list, (item) => {
            conditionLengthArray.push(item.conditions.length);
          });
          _.forEach(_.range(1, _.max(conditionLengthArray) + 1), (item) => {
            if (item > 15) {
              this.columnYear.push(this.$t("common.after_15_year"));
            } else {
              if (Cookies.get("language") === "en") {
                this.columnYear.push(
                  this.$t("common.year", [numberAcronym[item - 1]])
                );
              } else {
                this.columnYear.push(this.$t("common.year", [item]));
              }
            }
          });
          this.loading = false;
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    handleClose() {
      this.wildcard = "";
      this.dialogVisible = false;
    },
    formatToPercent(number) {
      if (number) {
        return _.toNumber(number).toFixed(2) + "%";
      }
    },
    updatePage(val) {
      this.listQuery.page = val;
    },
    updateLimit(val) {
      this.listQuery.limit = val;
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit;
      const max = pageObj.limit;
      const params = { offset, max, role: 2 };
      this.getViewData(params);
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">
#compareProduct {
  .el-dialog__header {
    display: none;
  }
  .header {
    height: 100%;
    padding: 20px 40px 0 40px;
    display: flex;
    justify-content: space-between;
  }
  .basic-container {
    min-height: 100%;
    padding-bottom: 0;
  }
  .el-dialog.is-fullscreen {
    overflow: hidden;
  }

  .el-select {
    width: 300px;
    margin-right: 20px;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
