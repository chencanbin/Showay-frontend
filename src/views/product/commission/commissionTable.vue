<template>
  <span class="demo">
    <el-button
      v-if="showButton"
      :loading="loading"
      size="small"
      type="text"
      @click="initForm"
    >{{ $t("common.edit") }}</el-button
    >
    <el-dialog
      id="commissionTableDialog"
      :fullscreen="fullscreen"
      :visible="commissionTableDialogVisible"
      :before-close="handleClose"
      class="dialog-body"
      append-to-body
    >
      <!--<el-button icon="el-icon-plus" type="text" @click="addNewRow">添加新行</el-button>-->
      <el-row 
        slot="title" 
        class="title" 
        style="position: relative">
        <el-col
          :xs="24"
          :sm="24"
          :lg="12"
          style="height: 40px; line-height: 40px"
        >
          <span style="font-size: 16px">{{
            $t("product.commission.commission_table.title", [title])
          }}</span>
          <span 
            v-show="effectiveDate" 
            style="font-size: 16px; margin-left: 5px"
          >({{ effectiveDate }})</span
          >
          <span style="color: #999; font-family: YouYuan; margin-left: 10px">{{
            editStatus
          }}</span>
        </el-col>
        <el-col 
          :xs="24" 
          :sm="24" 
          :lg="{ span: 8, offset: 4 }">
          <el-input
            ref="search"
            v-model="wildcard"
            :placeholder="
              $t('product.commission.commission_table.search_placeholder')
            "
            @input="search"
          >
            <div 
              v-if="wildcard" 
              slot="suffix" 
              style="margin-top: 10px">
              {{ currentCount }} / {{ matchCount }}
            </div>
            <i 
              slot="prefix" 
              class="el-input__icon el-icon-search" />
            <el-button
              slot="append"
              icon="el-icon-arrow-down"
              @click="searchNext"
            />
            <el-button
              slot="append"
              icon="el-icon-arrow-up"
              @click="searchLast"
            />
          </el-input>
        </el-col>
      </el-row>
      <div
        @click="onPageClicked()"
        @mousemove="onPageClicked()"
        @keyup="onPageClicked()"
      >
        <el-tabs 
          v-model="activeName" 
          type="border-card" 
          tab-position="bottom">
          <el-tab-pane
            :label="$t('product.commission.commission_table.basic_tab')"
            name="basic"
          >
            <hot-table
              v-loading="loading"
              ref="basicTable"
              :settings="settings"
            />
          </el-tab-pane>
          <el-tab-pane
            :label="$t('product.commission.commission_table.override_tab')"
            name="override"
          >
            <hot-table
              v-loading="loading"
              ref="overrideTable"
              :settings="settings"
            />
          </el-tab-pane>
          <el-tab-pane
            :label="$t('product.commission.commission_table.overall_tab')"
            name="overall"
          >
            <span style="margin-bottom: 10px; display: inline-block">
              <el-checkbox
                v-model="ffyap"
                label="FFYAP"
                @change="ffyapChange"
              />
            </span>
            <hot-table
              v-loading="loading"
              ref="overallTable"
              :settings="overAllSettings"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="timeDialogVisible"
        :title="$t('product.commission.commission_table.effectDateTitle')"
        width="400px"
        append-to-body
      >
        <el-form 
          ref="configForm" 
          label-width="70px">
          <el-form-item
            :label="$t('product.commission.commission_table.effectDate')"
          >
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
            :loading="buttonLoading"
            type="primary"
            @click="handlePublish"
          >{{ $t("common.submitButton") }}</el-button
          >
        </div>
      </el-dialog>

      <el-dialog
        id="setOverrideDialog"
        :close-on-click-modal="false"
        :title="overrideTitle"
        :visible.sync="setOverrideDialogVisible"
        width="90%"
        append-to-body
      >
        <hot-table
          v-loading="loading"
          ref="setOverrideHotInstance"
          :settings="setOverrideSettings"
        />
        <div 
          slot="footer" 
          class="dialog-footer">
          <el-button
            :loading="buttonLoading"
            type="primary"
            @click="handleCloseSetOverrideDialog"
          >{{ $t("common.submitButton") }}</el-button
          >
        </div>
      </el-dialog>
      <div 
        slot="footer" 
        class="dialog-footer">
        <el-button @click="handleClose">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button 
          type="primary" 
          @click="handleTimeDialogOpen">{{
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
      overrideHotInstance: "",
      overallHotInstance: "",
      setOverrideHotInstance: "",
      setOverrideSettings: {
        columns: [],
        startCols: 15,
        startRows: 1,
        colHeaders: [],
        height: 120,
        stretchH: "all",
        rowHeights: 45,
        columnHeaderHeight: 45,
        afterChange: (changes, source) => {
          if (source === "loadData") {
            return;
          }
          if (changes) {
            const data = [];
            let value;
            changes.forEach(([row, column, oldValue, newValue]) => {
              column = column + 4;
              if (newValue) {
                value = _.toString(newValue);
              }
              if (value && value.substr(-1) === "%") {
                value = value.substr(0, value.length - 1);
              }
              _.forEach(this.selectedRows, (row) => {
                data.push({ row, column, value });
              });
            });
            this.$api.commission
              .commissionTableDraft(this.id, { data, type: 1 })
              .catch((_) => {
                this.setOverrideHotInstance.redo();
              });
          }
        },
      },
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
            TD.style.backgroundColor = "#e1eedc";
          } else {
            TD.style.backgroundColor = "#fafafa";
          }
          TD.innerHTML = value;
        },
        height: window.screen.height - 330,
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
              this.$api.commission
                .commissionTableDraft(this.id, {
                  data: [{ row: selection[0].start.row - 1, value: 1 }],
                  action: "insertRow",
                  type,
                })
                .then((res) => {
                  if (this.activeName === "basic") {
                    this.overrideHotInstance.alter(
                      "insert_row",
                      selection[0].start.row
                    );
                  }
                })
                .catch((_) => {
                  this.basicHotInstance.undo();
                });
            } else if (key === "row_below") {
              this.$api.commission
                .commissionTableDraft(this.id, {
                  data: [{ row: selection[0].start.row, value: 1 }],
                  action: "insertRow",
                  type,
                })
                .then((res) => {
                  if (this.activeName === "basic") {
                    this.overrideHotInstance.alter(
                      "insert_row",
                      selection[0].start.row + 1
                    );
                  }
                })
                .catch((_) => {
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
              this.$api.commission
                .commissionTableDraft(this.id, {
                  data,
                  type,
                  action: "deleteRow",
                })
                .then((res) => {
                  data.forEach((item) => {
                    if (this.activeName === "basic") {
                      this.overrideHotInstance.alter("remove_row", item.row);
                    }
                  });
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
            },
            override: {
              // Own custom option
              name: this.$t(
                "product.commission.commission_table.override_setting"
              ),
              callback: (key, selection, clickEvent) => {
                const serialNumberArray = [];
                const rowLengthArray = [];
                this.selectedRows = [];
                let flag = true; // 作为标记，判断是否打开批量设置override的弹框
                selection.forEach((item) => {
                  if (item.start.row === item.end.row) {
                    this.selectedRows = _.union(this.selectedRows, [
                      item.start.row,
                    ]);
                  } else {
                    this.selectedRows = _.union(
                      this.selectedRows,
                      _.range(item.start.row, item.end.row + 1)
                    );
                  }
                });
                this.selectedRows.forEach((row) => {
                  const result = _.compact(
                    this.basicHotInstance.getDataAtRow(row)
                  );

                  // 判断最后一个column FFYAP有没有值， 如果有, 将结果的长度减1
                  if (this.basicHotInstance.getDataAtCell(row, 20)) {
                    rowLengthArray.push(result.length - 1);
                  } else {
                    rowLengthArray.push(result.length);
                  }
                  serialNumberArray.push(
                    this.basicHotInstance.getDataAtCell(row, 2)
                  );

                  if (!this.basicHotInstance.getDataAtCell(row, 3)) {
                    flag = false;
                  }
                });
                if (flag) {
                  console.log(_.min(rowLengthArray));
                  this.overrideTitle = _.join(serialNumberArray, ", ");
                  this.showSetOverrideDialogVisible(_.min(rowLengthArray));
                }
              },
            },
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
            this.$api.commission
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
              .catch((_) => {
                this.basicHotInstance.undo();
                this.overallHotInstance.undo();
                this.overrideHotInstance.undo();
                this.editStatus = "";
              });
          }
        },
        afterScrollVertically: (_) => {
          this.$nextTick(function () {
            // 为了解决scrollTop 偶尔为0的情况
            setTimeout(() => {
              const scrollTop = document.querySelector(".wtHolder").scrollTop;
              const clientHeight = document.querySelector(".wtHolder")
                .clientHeight;
              const scrollHeight = document.querySelector(".wtHolder")
                .scrollHeight;
              if (scrollTop + clientHeight >= scrollHeight) {
                this.basicHotInstance.alter("insert_row");
                this.overrideHotInstance.alter("insert_row");
              }
            }, 0);
          });
        },
      },
      overAllSettings: {
        colWidths: [250, 250, 120, 70],
        colHeaders: [],
        startCols: 20,
        startRows: 20,
        search: true,
        height: document.body.clientHeight - 235,
        stretchH: "all",
        autoWrapRow: false,
        autoWrapCol: false,
        rowHeaders: true,
        rowHeaderWidth: 65,
        fixedColumnsLeft: 1,
        columnHeaderHeight: 45,
        rowHeights: 45,
        renderer: function (instance, TD, row, col, prop, value) {
          if (row % 2 === 0) {
            TD.style.backgroundColor = "#e1eedc";
          } else {
            TD.style.backgroundColor = "#fafafa";
          }
          TD.innerHTML = value;
        },
        contextMenu: {
          items: {
            override: {
              // Own custom option
              name: this.$t(
                "product.commission.commission_table.override_setting"
              ),
              callback: (key, selection, clickEvent) => {
                const serialNumberArray = [];
                const rowLengthArray = [];
                this.selectedRows = [];
                selection.forEach((item) => {
                  if (item.start.row === item.end.row) {
                    this.selectedRows = _.union(this.selectedRows, [
                      item.start.row,
                    ]);
                  } else {
                    this.selectedRows = _.union(
                      this.selectedRows,
                      _.range(item.start.row, item.end.row + 1)
                    );
                  }
                });
                this.selectedRows.forEach((row) => {
                  const result = _.compact(
                    this.basicHotInstance.getDataAtRow(row)
                  );
                  serialNumberArray.push(result[0]);
                  rowLengthArray.push(result.length);
                });
                this.overrideTitle = _.join(serialNumberArray, ", ");
                this.showSetOverrideDialogVisible(_.min(rowLengthArray));
              },
            },
          },
        },
        afterScrollVertically: (_) => {
          this.$nextTick(function () {
            // 为了解决scrollTop 偶尔为0的情况
            setTimeout(() => {
              const scrollTop = document.querySelector(".wtHolder").scrollTop;
              const clientHeight = document.querySelector(".wtHolder")
                .clientHeight;
              const scrollHeight = document.querySelector(".wtHolder")
                .scrollHeight;
              if (scrollTop + clientHeight >= scrollHeight) {
                this.overallHotInstance.alter("insert_row");
              }
            }, 0);
          });
        },
      },
    };
  },
  watch: {
    activeName(val) {
      if (val === "basic") {
        this.loadBasicData();
        // this.basicHotInstance.updateSettings({ data: Handsontable.helper.createSpreadsheetData(800, 20) })
      } else if (val === "override") {
        this.loadOverrideData();
        // this.overrideHotInstance.updateSettings({ data: Handsontable.helper.createSpreadsheetData(800, 20) })
      } else if (val === "overall") {
        this.loadOverallData();
        // this.overallHotInstance.updateSettings({ data: Handsontable.helper.createSpreadsheetData(800, 20) })
      }
    },
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
    initOverAll() {
      const colHeaders = [
        this.$t("product.commission.commission_table.col_header.product_name"),
        this.$t("product.commission.commission_table.col_header.ENG_name"),
        this.$t("product.commission.commission_table.col_header.product_id"),
        this.$t("product.commission.commission_table.col_header.period"),
      ];
      const columns = [
        { renderer: this.textFormatter, readOnly: true },
        { renderer: this.textFormatter, readOnly: true },
        { readOnly: true },
        { readOnly: true },
      ];
      const colWidths = [];
      for (let i = 1; i <= 15; i++) {
        colWidths.push(85);
        colHeaders.push(
          this.$t("product.commission.commission_table.col_header.year", [i])
        );
        columns.push({ renderer: this.toPercent, readOnly: true });
      }
      colWidths.push(85);
      colHeaders.push(
        this.$t("product.commission.commission_table.col_header.after_15_year")
      );
      columns.push({ renderer: this.toPercent, readOnly: true });
      this.overAllSettings.colHeaders = colHeaders;
      this.overAllSettings.colWidths = _.concat(
        this.settings.colWidths,
        colWidths
      );
      this.overAllSettings.columns = columns;
    },
    // 显示批量设置Override的弹框
    showSetOverrideDialogVisible(minLength) {
      this.setOverrideDialogVisible = true;
      this.$nextTick(() => {
        const overrideHeaders = [];
        const overrideColumns = [];
        this.setOverrideHotInstance = this.$refs.setOverrideHotInstance.hotInstance;
        console.log(_.range(1, minLength - 3, 1));
        _.forEach(_.range(1, minLength - 3, 1), (i) => {
          if (i > 15) {
            overrideHeaders.push(
              this.$t(
                "product.commission.commission_table.col_header.after_15_year"
              )
            );
            overrideColumns.push({ renderer: this.toPercent });
          } else {
            overrideHeaders.push(
              this.$t("product.commission.commission_table.col_header.year", [
                i,
              ])
            );
            overrideColumns.push({ renderer: this.toPercent });
          }
        });
        this.setOverrideSettings.colHeaders = overrideHeaders;
        this.setOverrideSettings.columns = overrideColumns;
        const result = [];
        // 批量设置完override后，清空override 表数据
        _.forEach(_.range(0, minLength - 4), (i) => {
          result.push([1, i, ""]);
          // this.setOverrideHotInstance.setDataAtCell(0, i, '', 'loadData')
        });

        this.basicHotInstance.setDataAtRowProp(result, "loadData");
      });
    },
    handleTabClick(tab, event) {
      if (this.activeName === "basic") {
        this.loadBasicData();
        // this.basicHotInstance.updateSettings({ data: Handsontable.helper.createSpreadsheetData(800, 20) })
      } else if (this.activeName === "override") {
        this.loadOverrideData();
        // this.overrideHotInstance.updateSettings({ data: Handsontable.helper.createSpreadsheetData(800, 20) })
      } else if (this.activeName === "overall") {
        this.loadOverallData();
        // this.overallHotInstance.updateSettings({ data: Handsontable.helper.createSpreadsheetData(800, 20) })
      }
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
        td.style.backgroundColor = "#e1eedc";
      } else {
        td.style.backgroundColor = "#fafafa";
      }
      return td;
    },
    textFormatter(instance, td, row, col, prop, value, cellProperties) {
      td.style.cssText = "text-align: center; word-break: keep-all;";
      td.innerText = value;
      if (row % 2 === 0) {
        td.style.backgroundColor = "#e1eedc";
      } else {
        td.style.backgroundColor = "#fafafa";
      }
      return td;
    },
    initForm() {
      const that = this;
      window.onbeforeunload = function (e) {
        that.$api.commission.commissionTableDraft(that.id, {
          releaseLock: true,
        });
        return "关闭提示";
      };
      this.commissionTableDialogVisible = true;
      this.initColumn();
      this.initOverAll();
      this.activeName = "basic";
      this.editStatus = "";
      this.remarks = this.commissionRemarks;
      this.$nextTick(() => {
        this.basicHotInstance = this.$refs.basicTable.hotInstance;
        this.overrideHotInstance = this.$refs.overrideTable.hotInstance;
        this.overallHotInstance = this.$refs.overallTable.hotInstance;
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
      this.$api.commission
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
    loadOverrideData() {
      this.loading = true;
      this.settings.colWidths.pop();
      this.settings.colHeaders.pop();
      this.settings.columns.pop();
      this.basicHotInstance.updateSettings({
        colWidths: this.settings.colWidths,
        colHeaders: this.settings.colHeaders,
        columns: this.settings.columns,
      });
      this.$api.commission
        .fetchCommissionList(this.id)
        .then((res) => {
          const result = [];
          res.data.list.forEach((item) => {
            result.push([item.row, item.column, item.value.override]);
          });

          this.overrideHotInstance.setDataAtRowProp(result, "loadData");
          this.overrideHotInstance.render();
          this.loading = false;
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    loadOverallData() {
      this.loading = true;
      // const initData = []
      // for (let x = 0; x < 21; x++) {
      //   for (let y = 0; y < 1000; y++) {
      //     initData.push([y, x, ''])
      //   }
      // }
      // this.overallHotInstance.setDataAtRowProp(initData, 'loadData')
      this.$api.commission
        .fetchCommissionList(this.id, { ffyap: this.ffyap })
        .then((res) => {
          const result = [];
          res.data.list.forEach((item) => {
            result.push([item.row, item.column, item.value.overall]);
            // this.overallHotInstance.setDataAtCell(item.row, item.column, item.value.overall, 'loadData')
          });
          this.overallHotInstance.setDataAtRowProp(result, "loadData");
          this.overallHotInstance.render();
          this.loading = false;
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    handleClose() {
      this.$confirm(this.$t("common.tooltip.close"), this.$t("common.prompt"), {
        confirmButtonText: this.$t("common.confirmButton"),
        cancelButtonText: this.$t("common.cancelButton"),
        type: "warning",
      }).then(() => {
        this.wildcard = "";
        this.$api.commission
          .commissionTableDraft(this.id, { releaseLock: true })
          .then((res) => {
            this.$store.dispatch("commission/FetchCommissionTableList", {
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
      this.$api.commission
        .publishCommissionTableDraft(this.id, this.effectiveDate, this.remarks)
        .then((res) => {
          this.buttonLoading = false;
          this.timeDialogVisible = false;
          this.commissionTableDialogVisible = false;
          this.$store.dispatch("commission/FetchCommissionTableList", {
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
      let hotInstance;
      if (this.activeName === "basic") {
        hotInstance = this.basicHotInstance;
      } else if (this.activeName === "override") {
        hotInstance = this.overrideHotInstance;
      } else {
        hotInstance = this.overallHotInstance;
      }
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
      let hotInstance;
      if (this.activeName === "basic") {
        hotInstance = this.basicHotInstance;
      } else if (this.activeName === "override") {
        hotInstance = this.overrideHotInstance;
      } else {
        hotInstance = this.overallHotInstance;
      }
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
      let hotInstance;
      if (this.activeName === "basic") {
        hotInstance = this.basicHotInstance;
      } else if (this.activeName === "override") {
        hotInstance = this.overrideHotInstance;
      } else {
        hotInstance = this.overallHotInstance;
      }
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
.el-dialog__headerbtn {
  top: 5px;
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
  background-color: #00aa72 !important;
  color: #fafafa;
}
/*.handsontable tr:nth-child(odd) td {*/
/*background: #e1eedc;*/
/*}*/

/*.handsontable tr:nth-child(odd):hover > td {*/
/*background: #e1eedc;*/
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
    background: url("../../../assets/images/commissionBanner.png") no-repeat;
    background-size: cover;
    //filter: blur(20px);
    .title {
      box-shadow: 0 2px 4px hsla(0, 0%, 8%, 0.15);
      padding: 25px 15px 5px 15px;
    }
  }
}
</style>
