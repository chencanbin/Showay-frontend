<template>
  <el-card v-loading="loading" style="background: #fff; padding: 10px 16px 0; margin-bottom: 16px" class="profit">
    <div slot="header" class="clearfix">
      <span style="float: left; font-weight: bold; line-height: 36px">{{
        $t("home.companyProfit")
      }}</span>
      <div style="display: inline-block; float: right">
        <el-button-group style="margin-left: 20px">
          <div size="mini" :class="activeName === 0 ? 'button-active' : 'button-no-active'" class="self-button" @click="profitMonth()">{{ $t("home.month") }}</div>
          <div size="mini" :class="activeName === 1 ? 'button-active' : 'button-no-active'" class="self-button" @click="profitQuarter()">{{ $t("home.quarter") }}</div>
          <div size="mini" :class="activeName === 2 ? 'button-active' : 'button-no-active'" class="self-button" @click="profitYear()">{{ $t("home.year") }}</div>
        </el-button-group>
        <el-date-picker :editable="false" :clearable="false" :unlink-panels="true" v-model="year" type="year" value-format="timestamp" style="margin-left: 20px; width: 120px" />
      </div>
    </div>
    <div id="profitTrend" />
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
      year: new Date(),
      buttonProfitMonth: "primary",
      buttonProfitQuarter: "",
      buttonProfitYear: "",
      profit: [],
      chart: null,
      loading: false,
      activeName: 0,
    };
  },
  // 监听API接口传过来的数据  2018-08-21更新
  watch: {
    year: function (val) {
      if (this.activeName === 0) {
        this.profitMonth();
      } else if (this.activeName === 1) {
        this.profitQuarter();
      } else {
        this.profitYear();
      }
    },
    profit: function (val, oldVal) {
      // 监听charData，当放生变化时，触发这个回调函数绘制图表
      this.drawChart(val);
    },
  },
  created() {
    this.getProfit(4, 7);
  },
  methods: {
    profitYear() {
      this.activeName = 2;
      this.getProfit(4, 5);
      this.buttonProfitMonth = "";
      this.buttonProfitQuarter = "";
      this.buttonProfitYear = "";
    },
    profitQuarter() {
      this.activeName = 1;
      this.getProfit(4, 6);
      this.buttonProfitMonth = "";
      this.buttonProfitQuarter = "";
      this.buttonProfitYear = "";
    },
    profitMonth() {
      this.activeName = 0;
      this.getProfit(4, 7);
      this.buttonProfitMonth = "";
      this.buttonProfitQuarter = "";
      this.buttonProfitYear = "";
    },
    getProfit(item, groupBy) {
      this.loading = true;
      this.$api.statistics
        .fetchTrend({
          item,
          groupBy,
          from: getYearFirst(this.year),
          to: getYearLast(this.year),
        })
        .then((res) => {
          this.profit = res.data;
          this.loading = false;
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    drawChart: function () {
      this.chart && this.chart.destroy();
      this.chart = new G2.Chart({
        container: "profitTrend",
        forceFit: true,
        height: 300,
        padding: [20, 40, 50, 90],
      });
      this.chart.source(this.profit);
      this.chart.scale("value", {
        alias: this.$t("home.sale"),
        min: 0,
        formatter: function (val) {
          return accounting.formatMoney(val, "", 2);
        },
      });
      this.chart.scale("key", {
        range: [0, 1],
      });
      this.chart.axis("value", {
        label: {
          textStyle: {
            fill: "#8E919F",
          },
        },
      });
      this.chart.axis("key", {
        label: {
          textStyle: {
            fill: "#8E919F",
          },
        },
      });
      this.chart.area().position("key*value").color('#E7E8F5').shape('smooth');
      this.chart.line().position("key*value").color('#515CC3').shape('smooth');
      this.chart.render();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" type="text/scss">
.profit {
  .el-button-group {
    padding: 6px 4px;
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
    color: #8e919f;
    background-color: transparent;
  }

}
</style>
