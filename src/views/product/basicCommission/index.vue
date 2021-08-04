<template>
  <div id="commissionTable" class="table-container">
    <commission-table ref="commissionTable" :id="commissionTableId" :company-id="companyId" :created="true" :show-button="false" />
    <div>
      <div class="header">
        <el-form :inline="true" class="search-input" @submit.native.prevent>
          <el-form-item label="" prop="wildcard">
            <el-input v-model="wildcard" :placeholder="$t('product.company.search_company_placeholder')" clearable @input="search">
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </el-form-item>
        </el-form>

      </div>
      <basic-container>
        <el-table class="commission_table" v-loading="companyLoading" ref="companyTable" :expand-row-keys="expandKeys" :data="companyList.list" row-key="id" stripe @row-click="expandChange">
          <el-table-column :label="$t('product.company.table_header.name')" prop="name" min-width="150px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.acronym }} - {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('product.company.table_header.level')" prop="level" min-width="100px">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.secondary" type="warning">{{
                $t("product.company.levelTab.level2")
              }}</el-tag>
              <el-tag v-else type="success">{{
                $t("product.company.levelTab.level1")
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :formatter="dateFormat" :label="$t('product.company.table_header.contractEffectiveDate')" prop="contractEffectiveDate" min-width="100px" />
        </el-table>

        <div class="table-bottom" style="justify-content: flex-end">
          <!-- <add v-if="hasPermission(100015)" @afterAddCommissionTable="handleAfterCreateCommissionTable" /> -->
          <pagination :total="companyList.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit" />
        </div>
      </basic-container>
      <el-dialog v-el-drag-dialog :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('common.password_verify') + ' - ' + name" width="400px">
        <el-input v-model="password" :placeholder="$t('login.password_placeholder')" type="password" />
        <div class="tips_text">* {{ $t("common.password_verify_text") }}</div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{
          $t("common.cancelButton")
        }}</el-button>
          <el-button :loading="submitLoading" type="primary" @click="handleDelete">{{ $t("common.submitButton") }}</el-button>
        </div>
      </el-dialog>
      <commission-view ref="commissionView" />

      <el-drawer class="commission-detail-wrapper" :modal="false" :title="currentRow.acronym+' - '+currentRow.name" :visible.sync="drawer" :direction="direction">
        <div v-loading="commissionTableListLoading" class="commission-detail">
          <el-timeline v-loading="commissionTableListLoading" id="commissionTableList">
            <div v-if="commissionTableList.list && commissionTableList.list.length === 0" style="text-align: center; color: #909399">
              {{$t("product.commission.commission_table_list.no_commission_table")}}
            </div>
            <el-timeline-item v-for="(commissionTable, index) in commissionTableList.list" :type="getCommissionStatus(commissionTable.status)" :key="index" :timestamp="getFormattedDate(commissionTable.effectiveDate)" placement="top">
              <el-dropdown class="action-dropdown">
                <el-button type="primary" plain size="mini">
                  <i class="el-icon-more" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="hasPermission(100017) && commissionTable.status !== 0">
                    <el-button size="small" type="text" @click="handleView(commissionTable.id,
                              getFormattedDate(commissionTable.effectiveDate),
                              commissionTable.status)">{{ $t("common.view") }}</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="hasPermission(100018)">
                    <commission-table :company-id="currentRow.id" :id="commissionTable.id" :commission-remarks="commissionTable.remarks" :title="commissionTable.company.name" :effective-date="
                            getFormattedDate(commissionTable.effectiveDate)" />

                  </el-dropdown-item>
                  <el-dropdown-item v-if="hasPermission(100020) && commissionTable.status !== 0">
                    <el-button :ref="`export_${commissionTable.id}`" size="small" type="text" @click="exportExcel(commissionTable)">{{ $t("common.export") }}</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="hasPermission(100019)">
                    <el-button size="small" type="text" @click="verifyPassword(currentRow.id, commissionTable.id)">{{ $t("common.delete") }}
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <div class="commission_info">
                <div class="row">
                  <span class="label">{{$t("product.commission.commission_table_list.status")}}:</span>
                  <span class="content">
                    <el-tag v-if="commissionTable.status === 0" type="info" size="mini">{{$t("product.commission.commission_table_list.status_info")}}</el-tag>
                    <el-tag v-if="commissionTable.status === 1" type="success" size="mini">{{$t("product.commission.commission_table_list.status_success")}}</el-tag>
                    <el-tag v-if="commissionTable.status === 2" type="warning" size="mini">{{$t("product.commission.commission_table_list.status_warning" )}}</el-tag>
                  </span>
                </div>
                <div class="row">
                  <span class="label">{{$t("product.commission.commission_table_list.product_count")}}:</span>
                  <span class="content"> {{ commissionTable.policyCount }} </span>
                </div>
                <div class="row" v-if="commissionTable.remarks">
                  <span class="label">{{ $t("common.remarks") }}:</span>
                  <span class="content remark"> {{ commissionTable.remarks }}</span>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
        <add v-if="hasPermission(100015)" :companyId="currentRow.id" :companyName="currentRow.name" @afterAddCommissionTable="handleAfterCreateCommissionTable" class="create_commission_table" />
      </el-drawer>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/Pagination";
import { parseTime } from "@/utils";
import { mapState, mapGetters } from "vuex";
import commissionTable from "./commissionTable";
import add from "./add";
import commissionView from "./view";
import axios from "axios";
import sha256 from "sha256";
import elDragDialog from "@/directive/el-dragDialog";
import Cookies from "js-cookie";

const _ = require("lodash");
export default {
  components: {
    add,
    commissionView,
    commissionTable,
    pagination,
  },
  directives: { elDragDialog },
  data: function () {
    return {
      dialogVisible: false,
      companyId: 0,
      commissionTableId: 0,
      password: "",
      submitLoading: false,
      wildcard: "",
      expandKeys: [],
      showExpandRow: false,
      height: document.body.clientHeight - 222,
      cancelTokenFn: null, // 取消请求方法
      listQuery: {
        page: 1,
        limit: 50,
      },
      drawer: false,
      direction: 'rtl',
      currentRow: ''
    };
  },
  computed: {
    ...mapGetters(["name"]),
    ...mapState({
      commissionTableListLoading: (state) =>
        state.commission.commissionTableListLoading,
      companyLoading: (state) => state.company.companyLoading,
      companyList: (state) => state.company.companyList,
      commissionTableList: (state) => state.commission.commissionTableList,
    }),
    isSuperAdmin() {
      if (this.$store.getters.roles[0].id = 1) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.getCompanyList();
    // this.getCommissionTableList()
  },
  methods: {
    search: _.debounce(function () {
      this.getCompanyList({ wildcard: this.wildcard });
    }, 500),
    getCommissionTableList(id, params) {
      if (this.isSuperAdmin) {
        this.$store.dispatch("commission/FetchBasicCommissionTableList", { id, params });
      } else {
        this.$store.dispatch("commission/FetchCommissionTableList", { id, params });
      }

    },
    getCompanyList(param) {
      this.$store.dispatch("company/FetchCompanyList", param);
    },
    companyChange(value) {
      this.getCommissionTableList(value);
    },
    dateFormat(row, column) {
      const date = row[column.property];
      return parseTime(date, "{y}-{m}-{d}");
    },
    getCommissionStatus(val) {
      if (val === 0) {
        return "info";
      } else if (val === 1) {
        return "success";
      } else if (val === 2) {
        return "warning";
      }
    },
    getFormattedDate(value) {
      return parseTime(value, "{y}-{m}-{d}");
    },
    remoteSearch(query) {
      this.$store.dispatch("company/FetchCompanyList", { name: query });
    },
    verifyPassword(companyId, commissionTableId) {
      this.companyId = companyId;
      this.commissionTableId = commissionTableId;
      this.dialogVisible = true;
    },
    handleDelete() {
      this.submitLoading = true;
      this.$api.commission
        .deleteCommission(this.commissionTableId, sha256(this.password))
        .then((res) => {
          this.$message({
            message: this.$t("common.success"),
            type: "success",
            duration: 5 * 1000,
          });
          this.getCommissionTableList(this.companyId);
          this.handleDelete();
          this.submitLoading = false;
        })
        .catch((_) => {
          this.dialogVisible = false;
          this.submitLoading = false;
        });
    },
    exportExcel(row) {
      const _this = this;
      const effectiveDate = parseTime(row.effectiveDate, "{y}-{m}-{d}");
      const fileName = `${row.company.name} EffectiveDate ${effectiveDate}.xlsx`;
      const url = process.env.BASE_API + `/commissionTable/${row.id}/export`;
      const language = Cookies.get("language");
      const CancelToken = axios.CancelToken;
      if (row.status === 2) {
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
    },
    // exportExcel(row) {
    //   if (row.status === 2) {
    //     this.$confirm('导出的部分不包含未发布的内容, 是否继续导出?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       window.location.href = process.env.BASE_API + `/commissionTable/${row.id}/export`
    //     })
    //   } else {
    //     window.location.href = process.env.BASE_API + `/commissionTable/${row.id}/export`
    //   }
    // },
    handleClose() {
      this.password = "";
      this.dialogVisible = false;
    },
    handleView(id, effectiveDate, status) {
      this.$refs.commissionView.openDialog(id, effectiveDate, status);
    },
    dbRowClick(row) {
      this.$refs.commissionView.openDialog(row.id);
    },
    handleAfterCreateCommissionTable(id, companyId) {
      this.commissionTableId = id;
      this.companyId = companyId;
      this.$refs.commissionTable.initForm();
    },
    toggleCommissionTableList(row) {
      if (this.expandKeys[0] && row.id !== this.expandKeys[0]) {
        this.showExpandRow = true;
      } else {
        this.showExpandRow = !this.showExpandRow;
      }
      this.$refs.companyTable.toggleRowExpansion(row, this.showExpandRow);
    },
    expandChange(row) {
      this.getCommissionTableList(row.id);
      this.drawer = true;
      this.currentRow = row
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit;
      const max = pageObj.limit;
      const params = { offset, max };
      this.getCommissionTableList("", params);
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
#commissionTable {
  .el-table__body-wrapper {
    overflow-y: auto !important;
    padding-bottom: 20px;
  }

  .commission-detail-wrapper {
    .el-timeline-item__node--normal {
      left: 0;
    }
    .el-drawer {
      width: 550px !important;
      padding-left: 24px;
      padding-right: 24px;
    }
    .el-drawer__header {
      height: 70px;
      margin-bottom: 0;
      border-bottom: 1px solid #e9e8f0;
      margin-bottom: 16px;
      margin-top: 10px;
      font-size: 18px;
      font-weight: bold;
      color: #42475f;
      padding: 0 0 0 12px;
    }
    .el-drawer__body {
      overflow: auto;
      .commission-detail {
        padding: 16px 0 50px 0;
        .el-timeline-item__timestamp {
          color: $--content;
          font-weight: 400;
          font-size: 14px;
        }
        .el-timeline-item__content {
          width: 450px;
          .action-dropdown {
            position: absolute;
            left: 140px;
            top: -2px;
          }

          .commission_info {
            width: 450px;
            background: #f6f6f7;
            border-radius: 6px;
            padding: 12px 24px;
            .row {
              min-height: 36px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 14px;
              .label {
                color: $--label;
                flex: 1;
              }
              .content {
                color: $--content;
              }
              .remark {
                line-height: 2;
                flex: 4;
                text-align: right;
              }
            }
          }
        }
      }
    }
  }
  .create_commission_table {
    position: fixed;
    bottom: 0;
    right: 36px;
    width: 464px;
    .el-button {
      span {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>

