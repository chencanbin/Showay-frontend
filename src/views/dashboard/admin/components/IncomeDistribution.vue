<template>
  <el-card v-loading="loading" class="income">
    <div slot="header" class="clearfix">
      <span class="card-header-title">{{
        $t("home.balance")
      }}</span>
      <div class="card-header-action">
        <el-select v-model="channel" :placeholder="$t('client.insurance_policy.set.channel_name')" filterable remote clearable style="margin-left: 10px">
          <el-option v-for="item in channels.list" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-date-picker :editable="false" :clearable="false" :unlink-panels="true" v-model="year" type="year" value-format="timestamp" style="margin-left: 20px; width: 120px" />
      </div>
    </div>
    <div id="IncomeDistribution">
      <div v-show="income.length === 0" style="position: absolute; top: 50%; right: 50%; color: #cccccc">
        {{ $t("common.no_data") }}
      </div>
    </div>
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
      income: [],
      loading: false,
      channel: "",
      year: new Date(),
    };
  },
  computed: {
    ...mapState({
      channels: (state) => state.user.users,
    }),
  },
  watch: {
    income: function (val, oldVal) {
      // 监听charData，当放生变化时，触发这个回调函数绘制图表
      this.drawChart(val);
    },
    year: async function (val) {
      this.income = [];
      await this.fetchPayment();
      await this.fetchProfit();
      await this.fetchBrokerExpenses();
    },
    channel: async function (val) {
      this.income = [];
      await this.fetchPayment();
      await this.fetchProfit();
      await this.fetchBrokerExpenses();
    },
  },
  async created() {
    await this.fetchPayment();
    await this.fetchProfit();
    await this.fetchBrokerExpenses();
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    fetchPayment() {
      this.loading = true;
      this.$api.statistics
        .fetchTrend({
          item: 2,
          groupBy: 0,
          user: this.channel,
          from: getYearFirst(this.year),
          to: getYearLast(this.year),
        })
        .then((res) => {
          const payment = parseFloat(res.data[0].value);
          if (payment !== 0) {
            this.income.push({
              key: this.$t("home.paymentSum"),
              value: payment,
            });
          }
          this.loading = false;
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    fetchBrokerExpenses() {
      this.$api.statistics
        .fetchTrend({
          item: 12,
          groupBy: 0,
          user: this.channel,
          from: getYearFirst(this.year),
          to: getYearLast(this.year),
        })
        .then((res) => {
          const brokerExpenses = parseFloat(res.data[0].value);
          if (brokerExpenses !== 0) {
            this.income.push({
              key: this.$t("common.expenses"),
              value: brokerExpenses,
            });
          }
        });
    },
    fetchProfit() {
      this.$api.statistics
        .fetchTrend({
          item: 13,
          groupBy: 0,
          user: this.channel,
          from: getYearFirst(this.year),
          to: getYearLast(this.year),
        })
        .then((res) => {
          const profit = parseFloat(res.data[0].value);
          if (profit !== 0) {
            this.income.push({ key: this.$t("common.profit"), value: profit });
          }
        });
    },
    drawChart: function () {
      this.chart && this.chart.destroy();
      this.chart = new G2.Chart({
        container: "IncomeDistribution",
        forceFit: true,
        height: 327,
        padding: [20, 40, 40, 40],
      });
      this.chart.source(this.income);
      this.chart.coord("theta", {
        radius: 0.75,
        innerRadius: 0.65
      });
      this.chart.scale("value", {
        min: 0,
      });
      this.chart.tooltip({
        showTitle: false,
      });
      this.chart
        .intervalStack()
        .position("value")
        .color("key", ['#515CC3', '#E96030'])
        .label("value", {
          formatter: function formatter(val, item) {
            return item.point.key + ": " + accounting.formatMoney(val, "", 2);
          },
        })
        .tooltip("key*value", function (key, value) {
          return {
            name: key,
            value: accounting.formatMoney(value, "", 2),
          };
        })
        .style({
          lineWidth: 1,
          stroke: "#fff",
        });
      this.chart.render();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped type="text/scss">
.income {
  position: relative;
  margin-bottom: 16px;
}
</style>
