<template>
  <span class="demo">
    <el-button v-if="showButton" type="text" @click="initForm()">{{ $t("common.edit") }}</el-button>
    <el-dialog id="commissionTableDialog" :fullscreen="fullscreen" :visible="commissionTableDialogVisible" :before-close="handleClose" class="dialog-body" append-to-body>
      <!--<el-button icon="el-icon-plus" type="text" @click="addNewRow">添加新行</el-button>-->
      <el-row slot="title" class="title" style="position: relative">
        <el-col :xs="24" :sm="24" :lg="12" style="height: 40px; line-height: 40px">
          <span style="font-size: 16px">{{
            $t("product.commission.commission_table.title", [title])
          }}</span>
          <span v-show="effectiveDate" style="font-size: 16px; margin-left: 5px">({{ effectiveDate }})</span>
          <span style="color: #999; font-family: YouYuan; margin-left: 10px">{{
            editStatus
          }}</span>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="{ span: 8, offset: 3 }">
          <el-input ref="search" v-model="wildcard" :placeholder="
              $t('product.commission.commission_table.search_placeholder')
            " @input="search">
            <div v-if="wildcard" slot="suffix">
              {{ currentCount }} / {{ matchCount }}
            </div>
            <!-- <i slot="prefix" class="el-input__icon el-icon-search" /> -->
            <el-button slot="append" icon="el-icon-arrow-down" @click="searchNext" />
            <el-button slot="append" icon="el-icon-arrow-up" @click="searchLast" />
          </el-input>
        </el-col>
      </el-row>
      <div @click="onPageClicked()" @mousemove="onPageClicked()" @keyup="onPageClicked()">
        <hot-table v-loading="loading" ref="basicTable" :settings="settings" />
      </div>
      <el-dialog :close-on-click-modal="false" :visible.sync="timeDialogVisible" :title="$t('product.commission.commission_table.effectDateTitle')" width="400px" append-to-body>
        <el-form ref="configForm" label-width="70px">
          <el-form-item :label="$t('product.commission.commission_table.effectDate')">
            <el-date-picker v-model="effectiveDate" type="datetime" value-format="timestamp" style="width: 100%" />
          </el-form-item>
          <el-form-item :label="$t('common.remarks')" prop="remarks">
            <el-input v-model="remarks" :placeholder="$t('common.remarks_placeholder')" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" type="primary" @click="handlePublish">{{ $t("common.submitButton") }}</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button type="primary" @click="handleTimeDialogOpen">{{
            $t("product.commission.commission_table.publish_button")
          }}</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { HotTable } from "@handsontable/vue";
import "../../../../node_modules/handsontable-pro/dist/handsontable.full.min.css";
import TimeoutMixin from "@/views/layout/mixin/TimeoutHandler";

const _ = require("lodash");
export default {
  components: {
    HotTable,
  },
  mixins: [TimeoutMixin],
  props: {
    id: {
      type: Number,
      default: 0,
    },
    commissionRemarks: {
      type: String,
      default: "",
    },
    created: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: Number,
      default: 0,
    },
    showButton: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    effectiveDate: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      overrideTitle: "",
      activeName: "basic",
      wildcard: "", // 搜索关键字
      ffyap: true,
      matchCount: 0,
      currentCount: 0,
      searchResult: [],
      editStatus: "", // 修改cell时,页面的状态显示
      errorCoordinate: [],
      selectedRows: [], // 选中行数的数组
      remarks: "",
      fullscreen: true,
      commissionTableDialogVisible: false,
      timeDialogVisible: false,
      setOverrideDialogVisible: false,
      loading: false,
      buttonLoading: false,
      basicHotInstance: "",
      settings: {
        colWidths: [250, 250, 120, 70],
        colHeaders: [],
        startCols: 21,
        startRows: 20,
        search: true,
        comments: true,
        commentedCellClassName: "td_error",
        currentRowClassName: "currentRow",
        currentColClassName: "currentColumn",
        renderer: function (instance, TD, row, col, prop, value) {
          if (row % 2 === 0) {
            TD.style.backgroundColor = "#E7E8F5";
          } else {
            TD.style.backgroundColor = "#fafafa";
          }
          TD.innerHTML = value;
        },
        height: document.body.offsetHeight - 160,
        stretchH: "all",
        autoWrapRow: false,
        autoWrapCol: false,
        rowHeaders: true,
        rowHeaderWidth: 65,
        fixedColumnsLeft: 1,
        rowHeights: 45,
        columnHeaderHeight: 45,
        contextMenu: {
          callback: (key, selection, clickEvent) => {
            let type = 0;
            if (this.activeName === "override") {
              type = 1;
            } else if (this.activeName === "overall") {
              type = 2;
            }
            if (key === "row_above") {
              this.$api.basicCommission
                .commissionTableDraft(this.id, {
                  data: [{ row: selection[0].start.row - 1, value: 1 }],
                  action: "insertRow",
                  type,
                }).catch((_) => {
                  this.basicHotInstance.undo();
                });
            } else if (key === "row_below") {
              this.$api.basicCommission
                .commissionTableDraft(this.id, {
                  data: [{ row: selection[0].start.row, value: 1 }],
                  action: "insertRow",
                  type,
                }).catch((_) => {
                  this.basicHotInstance.undo();
                });
            } else if (key === "remove_row") {
              const data = [];
              selection.forEach((item) => {
                if (item.start.row === item.end.row) {
                  data.push({ row: item.start.row, value: 1 });
                } else {
                  const value = item.end.row - item.start.row + 1;
                  data.push({ row: item.start.row, value });
                }
              });
              this.$api.basicCommission.commissionTableDraft(this.id, {
                data,
                type,
                action: "deleteRow",
              })
                .catch((_) => {
                  this.basicHotInstance.undo();
                });
            }
          },
          items: {
            row_above: {
              name: this.$t("product.commission.commission_table.row_above"),
            },
            row_below: {
              name: this.$t("product.commission.commission_table.row_below"),
            },
            remove_row: {
              name: this.$t("product.commission.commission_table.remove_row"),
            }
          },
        },
        afterBeginEditing: (row, coloumn) => {
          this.editStatus = this.$t(
            "product.commission.commission_table.edit_status.modifying"
          );
        },
        afterChange: (changes, source) => {
          if (source === "loadData") {
            return;
          }
          if (changes) {
            const data = [];
            let type = 0;
            if (this.activeName === "override") {
              type = 1;
            } else if (this.activeName === "overall") {
              type = 2;
            }
            changes.forEach(([row, column, oldValue, newValue]) => {
              if (oldValue === newValue) {
                this.editStatus = "";
                return;
              }
              let value = "";
              if (newValue) {
                value = _.toString(newValue);
              }
              if (value && value.substr(-1) === "%") {
                value = value.substr(0, value.length - 1);
              }
              data.push({ row, column, value });
            });
            if (data.length === 0) {
              return;
            }
            this.editStatus = this.$t(
              "product.commission.commission_table.edit_status.saving"
            );
            this.$api.basicCommission
              .commissionTableDraft(this.id, { data, type })
              .then((res) => {
                const date = new Date();
                this.editStatus = this.$t(
                  "product.commission.commission_table.edit_status.latest_save",
                  [
                    date.getHours() +
                    ":" +
                    date.getMinutes() +
                    ":" +
                    date.getSeconds(),
                  ]
                );
              })
              .catch((error) => {
                debugger
                console.log('...........................')
                console.log(error)
                this.basicHotInstance.undo();
                this.editStatus = "";
              });
          }
        },
        afterScrollVertically: (_) => {
          this.$nextTick(function () {
            // 为了解决scrollTop 偶尔为0的情况
            setTimeout(() => {
              const scrollTop = document.querySelector(".wtHolder").scrollTop;
              const clientHeight = document.querySelector(".wtHolder").clientHeight;
              const scrollHeight = document.querySelector(".wtHolder").scrollHeight;
              if (scrollTop + clientHeight >= scrollHeight) {
                this.basicHotInstance.alter("insert_row");
              }
            }, 0);
          });
        },
      },
    };
  },
  created() {
    console.log(document.body.offsetHeight);
  },
  methods: {
    initColumn() {
      const colHeaders = [
        this.$t("product.commission.commission_table.col_header.product_name"),
        this.$t("product.commission.commission_table.col_header.ENG_name"),
        this.$t("product.commission.commission_table.col_header.product_id"),
        this.$t("product.commission.commission_table.col_header.period"),
      ];
      // const columns = [{ data: 'zh', renderer: this.textFormatter }, { data: 'en', renderer: this.textFormatter }, { data: 'pId' }, { data: 'years' }]
      const columns = [
        { renderer: this.textFormatter },
        { renderer: this.textFormatter },
        {},
        {},
      ];
      const colWidths = [];
      for (let i = 1; i <= 15; i++) {
        colWidths.push(85);
        colHeaders.push(
          this.$t("product.commission.commission_table.col_header.year", [i])
        );
        columns.push({ renderer: this.toPercent });
      }
      colWidths.push(85);
      colHeaders.push(
        this.$t("product.commission.commission_table.col_header.after_15_year")
      );
      columns.push({ renderer: this.toPercent });

      this.settings.colHeaders = colHeaders;
      this.settings.colWidths = _.concat(this.settings.colWidths, colWidths);
      this.settings.columns = columns;
    },
    // 格式化百分比的cell
    toPercent(instance, td, row, col, prop, value, cellProperties) {
      td.style.cssText = "text-align: right;";
      value = _.toString(value);
      if (value && value.substr(-1) === "%") {
        value = value.substr(0, value.length - 1);
      }
      if (value && isNaN(value)) {
        td.innerText = "";
        return td;
      }

      if (Number(value) <= 0) {
        td.innerText = "";
      } else {
        td.innerText = _.toNumber(value).toFixed(2) + "%";
      }
      if (row % 2 === 0) {
        td.style.backgroundColor = "#E7E8F5";
      } else {
        td.style.backgroundColor = "#fafafa";
      }
      return td;
    },
    textFormatter(instance, td, row, col, prop, value, cellProperties) {
      td.style.cssText = "text-align: center; word-break: keep-all;";
      td.innerText = value;
      if (row % 2 === 0) {
        td.style.backgroundColor = "#E7E8F5";
      } else {
        td.style.backgroundColor = "#fafafa";
      }
      return td;
    },
    initForm() {
      const that = this;
      window.onbeforeunload = function (e) {
        that.$api.basicCommission.commissionTableDraft(that.id, {
          releaseLock: true,
        });
        return "关闭提示";
      };
      window.onresize = function (e) {
        that.basicHotInstance.updateSettings({
          height: document.body.offsetHeight - 160
        });
      };
      this.commissionTableDialogVisible = true;
      this.initColumn();
      this.activeName = "basic";
      this.editStatus = "";
      this.remarks = this.commissionRemarks;
      this.$nextTick(() => {
        this.basicHotInstance = this.$refs.basicTable.hotInstance;
        this.loadBasicData();
      });
    },
    loadBasicData() {
      this.loading = true;
      // const initData = []
      // for (let x = 0; x < 21; x++) {
      //   for (let y = 0; y < 1000; y++) {
      //     initData.push([y, x, ''])
      //   }
      // }
      // this.basicHotInstance.setDataAtRowProp(initData, 'loadData')
      this.settings.colWidths.push(85);
      this.settings.colHeaders.push("FFYAP");
      this.settings.columns.push({ renderer: this.toPercent });
      this.basicHotInstance.updateSettings({
        colWidths: this.settings.colWidths,
        colHeaders: this.settings.colHeaders,
        columns: this.settings.columns,
      });
      this.$api.basicCommission
        .fetchCommissionList(this.id)
        .then((res) => {
          const result = [];
          if (this.created && res.data.list.length === 0) {
            for (let x = 0; x < 21; x++) {
              for (let y = 0; y < 1000; y++) {
                result.push([y, x, ""]);
              }
            }
          } else {
            res.data.list.forEach((item) => {
              result.push([item.row, item.column, item.value.basic]);
            });

          }
          this.basicHotInstance.setDataAtRowProp(result, "loadData");
          this.basicHotInstance.render();
          this.loading = false;
        })
        .catch((_) => {
          this.loading = false;
          this.commissionTableDialogVisible = false;
        });
    },
    handleClose() {
      this.$confirm(this.$t("common.tooltip.close"), this.$t("common.prompt"), {
        confirmButtonText: this.$t("common.confirmButton"),
        cancelButtonText: this.$t("common.cancelButton"),
        type: "warning",
      }).then(() => {
        this.wildcard = "";
        this.$api.basicCommission
          .commissionTableDraft(this.id, { releaseLock: true })
          .then((res) => {
            this.$store.dispatch("commission/FetchBasicCommissionTableList", {
              id: this.companyId,
            });
            this.commissionTableDialogVisible = false;
            window.onbeforeunload = null;
          });
      });
    },
    handleCloseSetOverrideDialog() {
      if (this.activeName === "basic") {
        this.loadBasicData();
      } else if (this.activeName === "override") {
        this.loadOverrideData();
      } else {
        this.loadOverallData();
      }
      this.setOverrideDialogVisible = false;
    },
    handleTimeDialogOpen() {
      this.timeDialogVisible = true;
      this.effectiveDate = new Date().valueOf();
    },
    handlePublish() {
      const commentsPlugin = this.basicHotInstance.getPlugin("comments");
      this.errorCoordinate.forEach((item) => {
        commentsPlugin.removeCommentAtCell(item.row, item.column);
      });
      this.buttonLoading = true;
      this.$api.basicCommission
        .publishCommissionTableDraft(this.id, this.effectiveDate, this.remarks)
        .then((res) => {
          this.buttonLoading = false;
          this.timeDialogVisible = false;
          this.commissionTableDialogVisible = false;
          this.$store.dispatch("commission/FetchBasicCommissionTableList", {
            id: this.companyId,
          });
        })
        .catch((error) => {
          this.buttonLoading = false;
          const data = error.data;
          if (data && data.coordinate) {
            this.errorCoordinate = data.coordinate;
            data.coordinate.forEach((item) => {
              this.basicHotInstance.scrollViewportTo(item.row, item.column);
              this.basicHotInstance.render();
              const td = this.basicHotInstance.getCell(
                item.row,
                item.column,
                true
              );
              commentsPlugin.setCommentAtCell(
                item.row,
                item.column,
                error.message
              );
              td.setAttribute("title", error.message);
            });
          }
          this.buttonLoading = false;
          this.timeDialogVisible = false;
        });
    },
    searchAction() {
      const hotInstance = this.basicHotInstance;;
      const search = hotInstance.getPlugin("search");
      this.searchResult = search.query(this.wildcard);
      if (this.searchResult.length > 0) {
        this.matchCount = this.searchResult.length;
        this.currentCount = 1;
        hotInstance.toPhysicalRow(this.searchResult[0].row);
        hotInstance.selectRows(this.searchResult[0].row);
        hotInstance.render();
      } else {
        this.matchCount = 0;
        this.currentCount = 0;
      }
      setTimeout((_) => {
        this.$refs.search.focus();
      }, 500);
    },
    search: _.debounce(function () {
      this.searchAction();
    }, 500),
    searchNext() {
      const hotInstance = this.basicHotInstance;
      if (this.currentCount >= this.matchCount) {
        hotInstance.toVisualRow(this.searchResult[this.matchCount - 1].row);
        hotInstance.selectRows(this.searchResult[this.matchCount - 1].row);
      } else {
        this.currentCount++;
        const row = this.searchResult[this.currentCount - 1].row;
        if (!row) {
          return;
        }
        hotInstance.toVisualRow(row);
        hotInstance.selectRows(row);
      }
    },
    searchLast() {
      const hotInstance = this.basicHotInstance;
      if (this.currentCount <= 1) {
        hotInstance.toVisualRow(this.searchResult[0].row);
        hotInstance.selectRows(this.searchResult[0].row);
      } else {
        this.currentCount--;
        const row = this.searchResult[this.currentCount].row;
        hotInstance.toVisualRow(row);
        hotInstance.selectRows(row);
      }
    },
    ffyapChange() {
      this.loadOverallData();
    },
  },
};
</script>

<style lang="scss" type="text/scss">
.htCore {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  color: #3a4735;
  font-size: 14px;
}

.htContextMenu:not(.htGhostTable) {
  z-index: 2200;
}
.handsontable th {
  background: #fafafa;
  color: #3a4735;
  font-weight: bold;
  vertical-align: bottom;
}
.handsontable input,
.handsontable textarea {
  line-height: 45px;
}
.handsontable td,
.handsontable th {
  padding-left: 5px;
  padding-right: 5px;
  height: 20px;
  min-width: 50px;
  vertical-align: middle;
  border-color: #e0e2e4;
  background: #fafafa;
}
.handsontable tbody th.ht__highlight,
.handsontable thead th.ht__highlight {
  background-color: #fafafa;
}
.currentRow {
  color: $--content;
}
/*.handsontable tr:nth-child(odd) td {*/
/*background: #E7E8F5;*/
/*}*/

/*.handsontable tr:nth-child(odd):hover > td {*/
/*background: #E7E8F5;*/
/*}*/
/*.handsontable tr:nth-child(even):hover > td {*/
/*background-color: #fafafa;*/
/*}*/
.handsontable .searchClass {
  background: #71b7ee !important;
}
#commissionTableDialog,
.dialog-footer,
#setOverrideDialog .dialog-footer {
  padding-top: 0px;
}

#commissionTableDialog .el-dialog__body,
#setOverrideDialog .el-dialog__body {
  padding: 10px;
}

#commissionTableDialog .el-dialog__header {
  padding: 0;
  margin: 0;
}
#commissionTableDialog .el-dialog__close {
  color: #909399;
}
#commissionTableDialog .el-dialog {
  background-color: #f8f8f8;
}
#commissionTableDialog .el-dialog__footer {
  box-shadow: 2px -2px 4px hsla(0, 0%, 8%, 0.15);
  padding-top: 10px;
  padding-bottom: 10px;
}
.td_error {
  border: 2px solid red !important;
}

#commissionTableDialog .el-tabs__active-bar {
  top: 0;
}
#commissionTableDialog .el-tabs--border-card > .el-tabs__content {
  padding: 10px;
  background: #fafafa;
}
#commissionTableDialog {
  .el-dialog__header {
    background: $--purple;
    color: #fff;
    .title {
      box-shadow: 0 2px 4px hsla(0, 0%, 8%, 0.15);
      padding: 25px 15px 5px 15px;
    }
  }
  .el-input__suffix-inner {
    &::before {
      display: none;
    }
    position: relative;
    font-size: 16px;
    line-height: 40px;
  }
}
</style>
