<template>
  <span id="trace">
    <el-button type="text" size="small" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">{{ $t("audit.detail") }}</el-button>
    <el-dialog v-el-drag-dialog :visible="dialogVisible" :before-close="handleClose" :title="$t('audit.detail_title')" top="10px" width="3.125rem">
      <div class="block">
        <el-timeline v-loading="loading">
          <el-timeline-item v-for="trace in traceList" :key="trace.id" :timestamp="dateFormat(trace.timestamp)" placement="top">
            <div class="content-wrapper">
              <div class="row">
                <div class="label">{{$t("common.action")}}:</div>
                <div class="content">{{ getTraceDesc(trace.type) }}</div>
              </div>
              <div class="row">
                <div class="label">{{ $t("audit.doer") }}:</div>
                <div class="content">{{ trace.doer.name }}</div>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import elDragDialog from "@/directive/el-dragDialog";
import { parseTime } from "@/utils";
import { insurancePolicyTrace } from "@/utils/constant";
import Cookies from "js-cookie";

export default {
  name: "",
  directives: { elDragDialog },
  props: {
    number: {
      type: String,
      default: "",
      desc: "保单号",
    },
  },
  data() {
    return {
      language: "",
      traceList: [],
      dialogVisible: false,
      loading: false,
    };
  },
  methods: {
    initForm() {
      this.dialogVisible = true;
      this.language = Cookies.get("language") || "zh-CN";
      this.loading = true;
      this.$api.product
        .traceInsurancePolicy(this.number)
        .then((res) => {
          this.traceList = res.data.list;
          this.loading = false;
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    dateFormat(date) {
      return parseTime(date);
    },
    handleClose() {
      this.dialogVisible = false;
    },
    getTraceDesc(type) {
      for (let i = 0; i < insurancePolicyTrace.length; i++) {
        if (insurancePolicyTrace[i].id === type) {
          return insurancePolicyTrace[i][this.language];
        }
      }
    },
  },
};
</script>

<style type="text/scss" lang="scss">
#trace {
  h4 {
    margin: 10px 0;
    font-weight: 400;
    color: #1f2f3d;
  }
  p {
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
  }
  .el-card {
    padding: 0 15px;
  }
  .el-card.is-always-shadow {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .el-timeline-item__node {
    background: $--purple;
  }
  .block {
    height: 80vh;
    overflow: auto;
  }
  .content-wrapper {
    width: 470px;
    height: 92px;
    padding: 10px 24px;
    background: #f6f6f7;
    border-radius: 6px;
    .row {
      line-height: 36px;
      height: 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
      .content {
        color: $--content;
      }
      .label {
        color: $--label;
      }
    }
  }
}
</style>
