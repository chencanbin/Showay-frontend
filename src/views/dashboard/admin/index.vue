<template>
  <div class="dashboard-editor-container">
    <panel-group />
    <el-row :gutter="8">
      <el-row 
        :gutter="8" 
        type="flex" 
        justify="left">
        <!-- 公告列表 -->
        <el-col 
          v-if="showHomePage(13)" 
          :xs="24" 
          :sm="24" 
          :lg="8">
          <fileList />
        </el-col>
        <el-col 
          v-if="showHomePage(14)" 
          :xs="24" 
          :sm="24" 
          :lg="16">
          <income-distribution />
        </el-col>
      </el-row>
      <!-- 渠道业绩趋势 -->
      <el-col 
        v-if="showHomePage(9)" 
        :xs="24" 
        :sm="24" 
        :lg="24">
        <profit-channel-trend />
      </el-col>
      <!-- 公司收益趋势 -->
      <el-col 
        v-if="showHomePage(8)" 
        :xs="24" 
        :sm="24" 
        :lg="24">
        <profit-trend />
      </el-col>
      <!-- 公司业绩同比 -->
      <el-col 
        v-if="showHomePage(10)" 
        :xs="24" 
        :sm="24" 
        :lg="24">
        <cleared-credit />
      </el-col>
    </el-row>
    <el-row 
      :gutter="8" 
      type="flex" 
      justify="center">
      <!-- 渠道业绩Top5 -->
      <el-col v-if="showHomePage(11)">
        <channel-profit />
      </el-col>
      <!-- 渠道业绩分布 -->
      <el-col v-if="showHomePage(12)">
        <channel-pie />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup";
import PieChart from "./components/PieChart";
import clearedCredit from "./components/ClearedCredit";
import profitTrend from "./components/profitTrend";
import profitChannelTrend from "./components/profitChannelTrend";
import channelProfit from "./components/ChannelProfit";
import ChannelPie from "./components/ChannelPie";
import fileList from "./components/fileList";
import incomeDistribution from "./components/IncomeDistribution";
import { showHomePage } from "@/utils/permission";

export default {
  name: "DashboardAdmin",
  components: {
    PanelGroup,
    PieChart,
    clearedCredit,
    profitTrend,
    profitChannelTrend,
    channelProfit,
    ChannelPie,
    fileList,
    incomeDistribution,
  },
  data() {
    return {
      overall: {
        creditSum: 0, //  已到账
        pendingCreditSum: 0, // 应收未收
        pendingPaymentSum: 0,
        paymentSum: 0, // 应发未发
        policyCount: 0, // 保单数
      },
    };
  },
  created() {
    // this.$api.statistics.fetchOverall().then(res => {
    //   this.overall.creditSum = parseFloat(res.data.creditSum)
    //   this.overall.pendingCreditSum = parseFloat(res.data.pendingCreditSum)
    //   this.overall.paymentSum = parseFloat(res.data.paymentSum)
    //   this.overall.policyCount = parseFloat(res.data.policyCount)
    //   this.overall.pendingPaymentSum = parseFloat(res.data.pendingPaymentSum)
    // })
  },
  methods: {
    showHomePage,
    panelClick(type) {
      if (type === "creditSum") {
        this.$router.push({
          path: "/commission/commissionCredit",
          query: { type: "1" },
        });
      } else if (type === "pendingCreditSum") {
        this.$router.push({
          path: "/commission/commissionCredit",
          query: { type: "0" },
        });
      } else if (type === "paymentSum") {
        this.$router.push({ path: "/commission/paymentAudit" });
      } else if (type === "policyCount") {
        this.$router.push({ path: "/policy" });
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" type="text/scss">
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .el-card__header {
    padding: 10px;
  }
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
