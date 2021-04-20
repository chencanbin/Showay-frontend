<template>
  <el-dialog
    id="channelCommissionPreviewTable"
    :visible="dialogVisible"
    :before-close="handleClose"
    :fullscreen="true"
    :title="title"
  >
    <!--<div style="display: inline-block; position: absolute; right: 20px; z-index: 3000;">-->
    <!--<el-button :loading="loading" size="small" plain icon="el-icon-download" type="primary" @click="exportExcel()">导出</el-button>-->
    <!--</div>-->
    <el-row>
      <el-form 
        :inline="true" 
        @submit.native.prevent>
        <el-form-item
          :label="$t('product.channel.view.company')"
          class="search_item"
          prop="params.companies"
        >
          <el-select
            :loading="companyLoading"
            :remote-method="searchCompany"
            :placeholder="
              $t('product.channel.set.add_policy.company_placeholder')
            "
            v-model="params.companies"
            multiple
            remote
            filterable
            @focus="onCompanyFocus"
            @change="getViewData"
          >
            <el-option
              v-for="item in companies"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('product.channel.view.exclude_company')"
          class="search_item"
          prop="params.nCompanies"
        >
          <el-select
            :loading="companyLoading"
            :remote-method="searchCompany"
            :placeholder="
              $t('product.channel.set.add_policy.company_placeholder')
            "
            v-model="params.nCompanies"
            multiple
            remote
            filterable
            @focus="onCompanyFocus"
            @change="getViewData"
          >
            <el-option
              v-for="item in companies"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('product.channel.view.product')"
          class="search_item"
          prop="params.products"
        >
          <el-select
            :loading="productLoading"
            :remote-method="searchProduct"
            :placeholder="
              $t('product.channel.set.add_policy.product_placeholder')
            "
            v-model="params.products"
            multiple
            remote
            filterable
            @focus="onProductFocus"
            @change="getViewData"
          >
            <el-option
              v-for="item in products"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('product.channel.view.exclude_product')"
          class="search_item"
          prop="params.nproducts"
        >
          <el-select
            :loading="productLoading"
            :remote-method="searchProduct"
            :placeholder="
              $t('product.channel.set.add_policy.product_placeholder')
            "
            v-model="params.nProducts"
            multiple
            remote
            filterable
            @focus="onProductFocus"
            @change="getViewData"
          >
            <el-option
              v-for="item in products"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="hasPermission(100034)"
            :loading="exportLoading"
            type="primary"
            size="small"
            icon="el-icon-download"
            @click="exportPDF()"
          >{{ $t("common.export") }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <basic-container>
        <div class="table-container">
          <el-table
            v-loading="loading"
            :data="data"
            :height="tableHeight"
            stripe
          >
            <el-table-column
              :label="$t('product.channel.view.company')"
              fixed
              prop="company.name"
              min-width="200"
            />
            <el-table-column
              :label="$t('product.channel.view.product')"
              fixed
              prop="product.name"
              min-width="200"
            />
            <el-table-column
              v-for="(year, index) in columnYear"
              :key="index"
              :label="year"
              width="100"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.conditions[index]
                    ? formatToPercent(scope.row.conditions[index].rate)
                    : "-"
                }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :total="total"
            :page="listQuery.page"
            :limit="listQuery.limit"
            @pagination="pagination"
            @update:page="updatePage"
            @update:limit="updateLimit"
          />
        </div>
      </basic-container>
    </el-row>
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
      activeName: "basic",
      tableHeight: document.body.clientHeight - 180,
      loading: false,
      productLoading: false,
      companyLoading: false,
      exportLoading: false,
      wildcard: "",
      companies: [],
      nCompanies: [],
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
      this.id = channelPolicyObj.id;
      this.channelName = channelName;
      this.timestamp = channelPolicyObj.timestamp;
      this.title = `${this.$t(
        "product.channel.view.title"
      )} - ${channelName} ( ${parseTime(
        channelPolicyObj.timestamp,
        "{y}-{m}-{d}"
      )} )`;
      this.getViewData();
      this.dialogVisible = true;
    },
    getProducts(params) {
      params = Object.assign({ timestamp: this.timestamp }, params);
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
    handleTabClick(tab, event) {
      this.activeName = tab.name;
    },
    // exportExcel() {
    //   window.location.href = process.env.BASE_API + `/commissionTable/${this.id}/export`
    // },
    exportPDF() {
      const url =
        process.env.BASE_API +
        `/channelCommissionTable/${this.id}/export?&${param(this.params)}`;
      const fileName = `${this.channelName} ( ${parseTime(
        this.timestamp,
        "{y}-{m}-{d}"
      )} ).pdf`;
      this.exportLoading = true;
      const language = Cookies.get("language");
      axios
        .get(url, {
          responseType: "blob",
          headers: {
            "content-language": language || "zh-CN",
            "Accept-Language": language || "zh-CN",
          },
        })
        .then((res) => {
          const blob = new Blob([res.data]);
          const downloadElement = document.createElement("a");
          const href = window.URL.createObjectURL(blob); //  创建下载的链接
          downloadElement.href = href;
          downloadElement.download = fileName; //  下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //  点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放blob对象
          this.exportLoading = false;
        })
        .catch((_) => {
          this.exportLoading = false;
        });
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
#channelCommissionPreviewTable {
  .el-dialog__body {
    padding: 10px;
  }
}
</style>
