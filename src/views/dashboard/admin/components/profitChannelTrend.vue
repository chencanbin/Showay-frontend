<template>
  <el-card v-loading="loading" class="profit-channel">
    <div slot="header" class="clearfix">
      <span class="card-header-title">{{
        $t("home.channelProfitTrend", [""])
      }}</span>
      <div class="card-header-action">
        <el-button-group class="button-group">
          <div :class="activeName === 0 ? 'button-active' : 'button-no-active'" class="self-button" @click="profitMonth()">{{ $t("home.month") }}</div>
          <div :class="activeName === 1 ? 'button-active' : 'button-no-active'" class="self-button" @click="profitQuarter()">{{ $t("home.quarter") }}</div>
          <div :class="activeName === 2 ? 'button-active' : 'button-no-active'" class="self-button" @click="profitYear()">{{ $t("home.year") }}</div>
        </el-button-group>
        <el-select v-model="channel" :placeholder="$t('client.insurance_policy.set.channel_name')" filterable remote clearable>
          <el-option v-for="item in channels.list" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-date-picker :editable="false" :clearable="false" :unlink-panels="true" v-model="year" type="year" value-format="timestamp" class="date-picker" />
      </div>
    </div>
    <div id="profitChannelTrend" />
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import G2 from "@antv/g2";
import accounting from "accounting";
import { getYearFirst, getYearLast } from "@/utils";
export default {
  name: "",
  data() {
    return {
      activeName: 0,
      channel: "",
      year: new Date(),
      buttonProfitMonth: "",
      buttonProfitQuarter: "",
      buttonProfitYear: "",
      profit: [],
      chart: null,
      loading: false,
    };
  },
  computed: {
    ...mapState({
      channels: (state) => state.user.users,
    }),
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
    channel: function (val) {
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
    this.getChannel();
    this.getProfit(8, 7);
  },
  methods: {
    getChannel(params) {
      const role = { role: 2 };
      if (params) {
        params.role = role;
      } else {
        params = role;
      }
      this.$store.dispatch("FetchUserList", params);
    },
    profitYear() {
      this.activeName = 2;
      this.getProfit(8, 5);
      this.buttonProfitMonth = "";
      this.buttonProfitQuarter = "";
      this.buttonProfitYear = "";
    },
    profitQuarter() {
      this.activeName = 1;
      this.getProfit(8, 6);
      this.buttonProfitMonth = "";
      this.buttonProfitQuarter = "";
      this.buttonProfitYear = "";
    },
    profitMonth() {
      this.activeName = 0;
      this.getProfit(8, 7);
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
          user: this.channel,
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
        container: "profitChannelTrend",
        forceFit: true,
        height: 310,
        padding: [20, 40, 20, 90],
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
      // this.chart.tooltip({
      //   crosshairs: {
      //     type: 'line'
      //   }
      // })
      this.chart.area().position("key*value").color('#E7E8F5').shape('smooth');
      this.chart.line().position("key*value").color('#515CC3').shape('smooth');
      this.chart.render();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" type="text/scss">
.profit-channel {
  background: #fff;
  .el-select {
    width: 180px;
  }
  .button-group {
    margin-right: 20px;
  }
  .el-button-group {
    padding: 3px;
    background: #f6f6f6;
    border-radius: 6px;
    display: flex;
  }
  .date-picker {
    margin-left: 20px;
    width: 77px;
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
    font-size: 12px;
  }
  .button-no-active {
    font-weight: 400;
    color: $--label;
    background-color: transparent;
    font-size: 12px;
  }
}
</style>
