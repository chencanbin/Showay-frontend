<template>
  <el-card v-loading="loading" class="clearedCredit">
    <div slot="header" class="clearfix">
      <span class="card-header-title">{{
        $t("home.comparison")
      }}</span>
      <div class="card-header-action">
        <el-select :remote-method="searchCompany" :loading="companyLoading" v-model="company" :placeholder="$t('common.company_placeholder')" filterable remote clearable style="margin-right: 20px" @focus="onCompanyFocus">
          <el-option v-for="item in companies" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-date-picker :editable="false" :clearable="false" v-model="year" type="year" value-format="timestamp" style="width: 120px" />
        <el-button-group style="margin-left: 20px">
          <div size="mini" :class="activeName === 0 ? 'button-active' : 'button-no-active'" class="self-button" @click="clearCreditMonth()">{{ $t("home.month") }}</div>
          <div size="mini" :class="activeName === 1 ? 'button-active' : 'button-no-active'" class="self-button" @click="clearCreditQuarter()">{{ $t("home.quarter") }}</div>
          <div size="mini" :class="activeName === 2 ? 'button-active' : 'button-no-active'" class="self-button" @click="clearCreditYear()">{{ $t("home.year") }}</div>
        </el-button-group>
      </div>
    </div>
    <div id="clearedCredit" />
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import G2 from "@antv/g2";
import accounting from "accounting";
import { getYearFirst, getYearLast } from "@/utils";
export default {
  data() {
    return {
      year: new Date(),
      buttonClearCreditMonth: "primary",
      buttonClearCreditQuarter: "",
      buttonClearCreditYear: "",
      clearedCredit: [],
      insurancePolicyCount: [],
      sourceData: [],
      chart: null,
      Shape: G2.Shape,
      loading: false,
      company: "",
      groupBy: 7,
      activeName: 0
    };
  },
  computed: {
    ...mapState({
      companyLoading: (state) => state.company.companyLoading,
      companies: (state) => state.company.companyList.list,
    }),
  },
  // 监听API接口传过来的数据  2018-08-21更新
  watch: {
    sourceData: function (val, oldVal) {
      // 监听charData，当放生变化时，触发这个回调函数绘制图表
      this.drawChart(val);
    },
    company: function (val) {
      this.company = val;
      this.getTrend(0, 1);
    },
    year: function (val) {
      this.getTrend(0, 1);
    },
  },
  created() {
    const that = this;
    this.Shape.registerShape("interval", "textInterval", {
      draw: function draw(cfg, group) {
        const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
        const value = cfg.origin._origin.value;
        group.addShape("text", {
          attrs: {
            text: value,
            textAlign: "center",
            x: points[1].x + cfg.size / 2,
            y: points[1].y,
            fontFamily: "PingFang SC",
            fontSize: 14,
            fill: "#BBB",
          },
        });
        const polygon = group.addShape("polygon", {
          attrs: {
            points: points.map(function (point) {
              return [point.x, point.y];
            }),
            fill: cfg.color,
          },
        });
        return polygon;
      },
    });
    this.Shape.registerShape("interval", "fallFlag", {
      getPoints: function getPoints(_ref) {
        const x = _ref.x;
        const y = _ref.y;
        const y0 = _ref.y0;
        const size = _ref.size;
        return [
          {
            x: x + size,
            y: y0 + size,
          },
          {
            x: x,
            y: y,
          },
        ];
      },
      draw: function draw(cfg, group) {
        if (
          cfg.origin._origin ===
          that.clearedCredit[that.clearedCredit.length - 1]
        ) {
          return;
        }
        const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
        const p1 = points[0];
        const width = 9;
        const washaway = cfg.origin._origin.washaway;
        group.addShape("text", {
          attrs: {
            text: (washaway * 100).toFixed(1) + " %",
            x: p1.x - width / 2 - 14,
            y: p1.y - 14,
            fontFamily: "PingFang SC",
            fontSize: 12,
            fill: "#BBB",
          },
        });
        const polygon = group.addShape("image", {
          attrs: {
            x: p1.x - 16,
            y: p1.y - 16,
            img:
              "https://zos.alipayobjects.com/rmsportal/JuBdciUyUAkewNAetxtS.png",
            width: 32,
            height: 32,
          },
        });
        return polygon; // 将自定义Shape返回
      },
    });
    this.getTrend(0, 1);
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    onCompanyFocus() {
      this.getCompanies();
    },
    searchCompany(query) {
      this.getCompanies({ wildcard: query });
    },
    getCompanies(params) {
      this.$store.dispatch("company/FetchCompanyList", params);
    },
    clearCreditYear() {
      this.groupBy = 5;
      this.activeName = 2;
      this.getTrend(0, 0);
      this.buttonClearCreditMonth = "";
      this.buttonClearCreditQuarter = "";
      this.buttonClearCreditYear = "primary";
    },
    clearCreditQuarter() {
      this.groupBy = 6;
      this.activeName = 1;
      this.getTrend(0, 1);
      this.buttonClearCreditMonth = "";
      this.buttonClearCreditQuarter = "primary";
      this.buttonClearCreditYear = "";
    },
    clearCreditMonth() {
      this.groupBy = 7;
      this.activeName = 0;
      this.getTrend(0, 1);
      this.buttonClearCreditMonth = "primary";
      this.buttonClearCreditQuarter = "";
      this.buttonClearCreditYear = "";
    },
    getTrend(delta, lastYear) {
      this.loading = true;
      let clearedCreditParams = {
        item: 0,
        groupBy: this.groupBy,
        delta,
        from: getYearFirst(this.year),
        to: getYearLast(this.year),
      };
      let insurancePolicyCount = {
        item: 5,
        groupBy: this.groupBy,
        delta,
        from: getYearFirst(this.year),
        to: getYearLast(this.year),
      };
      if (lastYear) {
        clearedCreditParams = Object.assign({ lastYear }, clearedCreditParams);
        insurancePolicyCount = Object.assign(
          { lastYear },
          insurancePolicyCount
        );
        // clearedCreditParams = { item: 0, groupBy, delta, lastYear, from: getCurrentYearFirst(), to: getCurrentYearLast(), target }
        // insurancePolicyCount = { item: 5, groupBy, delta, lastYear, from: getCurrentYearFirst(), to: getCurrentYearLast(), target }
      }
      if (this.company) {
        clearedCreditParams = Object.assign(
          { company: this.company },
          clearedCreditParams
        );
        insurancePolicyCount = Object.assign(
          { company: this.company },
          insurancePolicyCount
        );
      }
      this.$api.statistics
        .fetchTrend({ ...clearedCreditParams })
        .then((res) => {
          this.clearedCredit = res.data;
          const sourceData = [];
          this.$api.statistics
            .fetchTrend({ ...insurancePolicyCount })
            .then((res) => {
              this.insurancePolicyCount = res.data;
              this.insurancePolicyCount.forEach((item, index) => {
                if (item.series) {
                  sourceData.push({
                    key: item.key,
                    value: this.clearedCredit[index].value,
                    series: this.clearedCredit[index].series,
                    count: item.value,
                    countSeries: item.series,
                  });
                } else {
                  sourceData.push({
                    key: item.key,
                    value: this.clearedCredit[index].value,
                    series: this.clearedCredit[index].key,
                    count: item.value,
                    countSeries: item.key,
                  });
                }
              });
              this.sourceData = sourceData;
              this.loading = false;
            });
        });
    },
    drawChart: function () {
      this.chart && this.chart.destroy();
      this.chart = new G2.Chart({
        container: "clearedCredit",
        forceFit: true,
        height: 310,
        padding: [20, 30, 70, 80],
      });
      this.chart.source(this.sourceData, {
        series: {
          formatter: (val) => {
            return val + " " + this.$t("home.sale");
          },
        },
        countSeries: {
          formatter: (val) => {
            return val + " " + this.$t("home.count");
          },
        },
      });
      this.chart.axis("count", {
        grid: null,
      });
      this.chart.tooltip({
        showTitle: false,
      });
      this.chart.scale("value", {
        min: 0,
        formatter: function (val) {
          return accounting.formatMoney(val, "", 2);
        },
      });
      this.chart.interval().position("key*value").color("series", ['#515CC3', '#E96030']).adjust([{ type: "dodge", marginRatio: 1 / 32 }]);
      this.chart.line().position("key*count").color("countSeries", ['#515CC3', '#E96030']).size(1);
      // this.chart.interval().position('key*count').color('series').adjust([{
      //   type: 'dodge',
      //   marginRatio: 1 / 32
      // }])
      this.chart.render();
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" type="text/scss" scoped>
.clearedCredit {
  .el-button-group {
    padding-left: 3px;
    padding-right: 3px;
    background: #f6f6f6;
    border-radius: 6px;
  }
  .self-button {
    width: 54px;
    height: 28px;
    line-height: 28px;
    border: 0;
    font-size: 14px;
    display: inline-block;
    text-align: center;
  }
  .self-button:focus {
    border: 0;
  }
  .button-active {
    background: #ffffff;
    border-radius: 6px;
    color: $--purple;
    font-weight: bold;
  }
  .button-no-active {
    font-weight: 400;
    color: $--label;
    background-color: transparent;
  }
}
</style>
