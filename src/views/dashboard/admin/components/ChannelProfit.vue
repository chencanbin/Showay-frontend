<template>
  <el-card
    v-loading="loading"
    class="channelProfit"
    style="padding: 16px 16px 0; margin-bottom: 32px"
  >
    <div 
      slot="header" 
      class="clearfix">
      <span style="float: left; font-weight: bold; line-height: 36px">{{
        $t("home.channelPerformanceTop")
      }}</span>
      <div style="display: inline-block; float: right">
        <el-date-picker
          :editable="false"
          :clearable="false"
          :unlink-panels="true"
          v-model="year"
          type="year"
          value-format="timestamp"
          style="margin-left: 20px; width: 120px"
        />
      </div>
    </div>
    <div id="channelProfit" />
  </el-card>
</template>

<script>
import G2 from "@antv/g2";
import accounting from "accounting";
import { getYearFirst, getYearLast } from "@/utils";

export default {
  name: "",
  data() {
    return {
      afyp: [],
      year: new Date(),
      loading: false,
    };
  },
  watch: {
    afyp: function (val, oldVal) {
      // 监听charData，当放生变化时，触发这个回调函数绘制图表
      this.drawChart(val);
    },
    year: function (val) {
      this.getAFYP(8, 3, 5);
    },
  },
  created() {
    this.getAFYP(8, 3, 5);
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    getAFYP(item, groupBy, max) {
      this.loading = true;
      this.$api.statistics
        .fetchTop({
          item,
          groupBy,
          max,
          from: getYearFirst(this.year),
          to: getYearLast(this.year),
        })
        .then((res) => {
          this.afyp = [];
          res.data.forEach((item) => {
            if (item.value > 0) {
              this.afyp.push(item);
            }
          });
          this.loading = false;
        });
    },
    drawChart: function () {
      this.chart && this.chart.destroy();
      this.chart = new G2.Chart({
        container: "channelProfit",
        forceFit: true,
        height: 350,
        padding: [30, 20, 60, 90],
      });
      this.chart.source(this.afyp);
      this.chart.scale("value", {
        alias: this.$t("home.sale"),
        min: 0,
        formatter: function (val) {
          return accounting.formatMoney(val, "", 2);
        },
      });
      this.chart.axis("value", {
        label: {
          textStyle: {
            fill: "#aaaaaa",
          },
        },
      });
      this.chart.axis("key", {
        label: {
          textStyle: {
            fill: "#aaaaaa",
          },
        },
      });
      this.chart.interval().position("key*value");
      this.chart.render();
    },
  },
};
</script>

<style scoped>
</style>
