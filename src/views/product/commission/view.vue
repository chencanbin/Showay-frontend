<template>
  <el-dialog id="commissionTable" :visible="dialogVisible" :before-close="handleClose" :title="title" :fullscreen="fullscreen" width="90%">
    <div class="wildcard-wrapper">
      <el-input v-model="wildcard" :placeholder="$t('product.commission.view.search')" clearable style="width: 300px" @input="search">
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
      <el-button size="small" plain icon="el-icon-download" type="primary" @click="exportExcel()">{{ $t("common.export") }}</el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('product.commission.view.basic_tab')" name="basic">
        <basic-container>
          <el-table v-loading="viewLoading" :data="data" stripe>
            <el-table-column :label="$t('product.commission.view.table_header.acronym')" prop="product.acronym" width="100" fixed="left" show-overflow-tooltip />
            <el-table-column :label="$t('product.commission.view.table_header.name')" prop="product.name" show-overflow-tooltip min-width="180" fixed="left" />
            <el-table-column :label="$t('product.commission.view.table_header.enName')" prop="product.enName" show-overflow-tooltip min-width="180" fixed="left" />
            <el-table-column :label="$t('product.commission.view.table_header.period')" prop="product.period" width="80" />
            <el-table-column v-for="(year, index) in columnYear" :key="index" :label="year" width="90">
              <template slot-scope="scope">
                <span>{{
                scope.row.conditions[index]
                  ? numberFormatter(
                    scope.row.conditions[index].basicCommissionRate
                  )
                  : "-"
              }}</span>
              </template>
            </el-table-column>
            <el-table-column label="FFYAP" width="80">
              <template slot-scope="scope">
                <span>{{ getFFYAP(scope.row.extraConditions) }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination :total="total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit" />
        </basic-container>
      </el-tab-pane>
      <el-tab-pane :label="$t('product.commission.view.overall_tab')" name="overall">
        <basic-container>
          <span style="margin-bottom: 10px; display: inline-block">
            <el-checkbox v-model="ffyap" label="FFYAP" @change="ffyapChange" />
          </span>
          <el-table v-loading="viewLoading" :data="data" stripe>
            <el-table-column :label="$t('product.commission.view.table_header.acronym')" prop="product.acronym" width="120" fixed="left" show-overflow-tooltip />
            <el-table-column :label="$t('product.commission.view.table_header.name')" prop="product.name" fixed="left" min-width="180" show-overflow-tooltip />
            <el-table-column :label="$t('product.commission.view.table_header.enName')" prop="product.enName" fixed="left" min-width="180" show-overflow-tooltip />
            <el-table-column :label="$t('product.commission.view.table_header.period')" prop="product.period" width="80" />
            <el-table-column v-for="(year, index) in columnYear" :key="index" :label="year" align="right" width="90">
              <template slot-scope="scope">
                <div>
                  {{
                  scope.row.conditions[index]
                    ? numberFormatter(
                      scope.row.conditions[index].overallCommissionRate
                    )
                    : "-"
                }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <pagination :total="total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit" />
        </basic-container>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import pagination from "@/components/Pagination";
import axios from "axios";
import Cookies from "js-cookie";

const _ = require("lodash");
export default {
  name: "CommissionView",
  components: {
    pagination,
  },
  data() {
    return {
      viewLoading: false,
      ffyap: true,
      effectiveDate: "",
      status: "",
      companyName: "",
      activeName: "basic",
      wildcard: "",
      tableHeight: document.body.clientHeight - 180,
      dialogVisible: false,
      title: "",
      id: "",
      data: [],
      total: 0,
      columnYear: [],
      fullscreen: true,
      listQuery: {
        page: 1,
        limit: 50,
      },
      offset: 0,
      max: 50,
    };
  },
  methods: {
    search: _.debounce(function () {
      this.listQuery = { page: 1, limit: 50 };
      this.getCommissionTableList({ wildcard: this.wildcard });
    }, 500),
    openDialog(id, effectiveDate, status) {
      this.dialogVisible = true;
      this.viewLoading = true;
      this.effectiveDate = effectiveDate;
      console.log(this.effectiveDate);
      this.status = status;
      this.data = [];
      this.$api.commission
        .fetchCommissionTable(id, { ffyap: this.ffyap })
        .then((res) => {
          this.data = res.data.list;
          this.total = res.data.total;
          this.id = id;
          this.title = this.$t("product.commission.view.title", [
            res.data.company.name + " ( " + effectiveDate + " ) ",
          ]);
          this.companyName = res.data.company.name;
          const conditionLengthArray = [];
          this.columnYear = [];
          _.forEach(res.data.list, (item) => {
            conditionLengthArray.push(item.conditions.length);
          });
          _.forEach(_.range(1, _.max(conditionLengthArray) + 1), (item) => {
            if (item > 15) {
              this.columnYear.push(
                this.$t("product.commission.view.after_15_year")
              );
            } else {
              this.columnYear.push(
                this.$t("product.commission.view.year", [item])
              );
            }
          });
          this.viewLoading = false;
        })
        .catch((_) => {
          this.viewLoading = false;
        });
    },
    getCommissionTableList(p) {
      this.viewLoading = true;
      const params = {
        offset: this.offset,
        max: this.max,
        ffyap: this.ffyap,
        wildcard: this.wildcard,
      };
      this.$api.commission
        .fetchCommissionTable(this.id, params)
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
              this.columnYear.push(
                this.$t("product.commission.view.after_15_year")
              );
            } else {
              this.columnYear.push(
                this.$t("product.commission.view.year", [item])
              );
            }
          });
          this.viewLoading = false;
        })
        .catch((_) => {
          this.viewLoading = true;
        });
    },
    handleClose() {
      this.wildcard = "";
      this.listQuery = { page: 1, limit: 50 };
      this.dialogVisible = false;
    },
    numberFormatter(value) {
      return _.toNumber(value).toFixed(2) + "%";
    },
    getFFYAP(value) {
      let result = "";
      value.forEach((item) => {
        for (const i in item) {
          if (i === "ffyap") {
            result = this.numberFormatter(item[i]);
          }
        }
      });
      return result;
    },
    exportExcel() {
      const _this = this;
      const fileName = `${this.companyName} EffectiveDate ${this.effectiveDate}.xlsx`;
      const url = process.env.BASE_API + `/commissionTable/${this.id}/export`;
      const language = Cookies.get("language");
      const CancelToken = axios.CancelToken;
      if (this.status === 2) {
        this.$confirm(
          this.$t("product.commission.tooltip.export"),
          this.$t("common.prompt"),
          {
            confirmButtonText: this.$t("common.confirmButton"),
            cancelButtonText: this.$t("common.cancelButton"),
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                axios
                  .get(url, {
                    responseType: "blob",
                    headers: {
                      "content-language": language || "zh-CN",
                      "Accept-Language": language || "zh-CN",
                    },
                    cancelToken: new CancelToken(function executor(c) {
                      _this.cancelTokenFn = c;
                    }),
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
                    instance.confirmButtonLoading = false;
                    done();
                  })
                  .catch((_) => {
                    instance.confirmButtonLoading = false;
                  });
              }
              if (action === "cancel") {
                instance.confirmButtonLoading = false;
                this.cancelTokenFn && this.cancelTokenFn();
                this.cancelTokenFn = null;
                done();
              }
            },
          }
        );
      } else {
        this.$confirm(
          this.$t("product.commission.tooltip.download"),
          this.$t("common.prompt"),
          {
            confirmButtonText: this.$t("common.confirmButton"),
            cancelButtonText: this.$t("common.cancelButton"),
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                axios
                  .get(url, {
                    responseType: "blob",
                    headers: {
                      "content-language": language || "zh-CN",
                      "Accept-Language": language || "zh-CN",
                    },
                    cancelToken: new CancelToken(function executor(c) {
                      _this.cancelTokenFn = c;
                    }),
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
                    instance.confirmButtonLoading = false;
                    done();
                  })
                  .catch((_) => {
                    instance.confirmButtonLoading = false;
                  });
              }
              if (action === "cancel") {
                instance.confirmButtonLoading = false;
                this.cancelTokenFn && this.cancelTokenFn();
                this.cancelTokenFn = null;
                done();
              }
            },
          }
        );
      }
      // window.location.href = process.env.BASE_API + `/commissionTable/${this.id}/export`
    },
    pagination(pageObj) {
      this.offset = (pageObj.page - 1) * pageObj.limit;
      this.max = pageObj.limit;
      this.getCommissionTableList();
    },
    updatePage(val) {
      this.listQuery.page = val;
    },
    updateLimit(val) {
      this.listQuery.limit = val;
    },
    ffyapChange() {
      this.getCommissionTableList({ ffyap: this.ffyap });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">
#commissionTable .el-dialog__body {
  .wildcard-wrapper {
    display: inline-block;
    position: absolute;
    right: 34px;
    top: 80px;
    z-index: 3000;
  }
  .el-tabs__header {
    margin-bottom: 0;
    margin-left: 24px;
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .el-tabs__active-bar {
    display: none;
  }
  .el-tabs__item {
    height: auto;
    line-height: normal;
    font-size: 14px;
    background: #f2f2f8;
    border-radius: 20px;
    font-weight: 500;
    color: #8e919f;
    margin-right: 30px;
    padding: 8px 17px !important;
  }
  .el-tabs__item.is-active {
    border: 1px solid $--purple;
    color: $--purple;
  }
  padding: 10px 10px 5px 10px;
  .el-tabs--border-card > .el-tabs__content {
    padding: 10px;
  }
}
</style>
