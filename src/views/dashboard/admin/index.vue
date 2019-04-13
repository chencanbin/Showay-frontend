<template>
  <div class="dashboard-editor-container">
    <panel-group :overall="overall" @panelClick="panelClick"/>
    <el-row :gutter="8">
      <el-col :xs="24" :sm="24" :lg="24">
        <profit/>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24">
        <cleared-credit/>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="24" :sm="24" :lg="12">
        <channel-profit/>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <channel-pie/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import G2Bar from '@/components/Charts/G2Bar'
import G2Pie from '@/components/Charts/G2Pie'
import clearedCredit from './components/ClearedCredit'
import profit from './components/profit'
import channelProfit from './components/ChannelProfit'
import ChannelPie from './components/ChannelPie'

export default {
  name: 'DashboardAdmin',
  components: {
    G2Bar,
    G2Pie,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TodoList,
    BoxCard,
    clearedCredit,
    profit,
    channelProfit,
    ChannelPie
  },
  data() {
    return {
      overall: {
        creditSum: 0, //  已到账
        pendingCreditSum: 0, // 应收未收
        pendingPaymentSum: 0,
        paymentSum: 0, // 应发未发
        policyCount: 0 // 保单数
      }
    }
  },
  created() {
    this.$api.statistics.fetchOverall().then(res => {
      this.overall.creditSum = parseFloat(res.data.creditSum)
      this.overall.pendingCreditSum = parseFloat(res.data.pendingCreditSum)
      this.overall.paymentSum = parseFloat(res.data.paymentSum)
      this.overall.policyCount = parseFloat(res.data.policyCount)
      this.overall.pendingPaymentSum = parseFloat(res.data.pendingPaymentSum)
    })
  },
  methods: {
    panelClick(type) {
      if (type === 'creditSum') {
        this.$router.push({ path: '/commission/commissionCredit', query: { type: '1' }})
      } else if (type === 'pendingCreditSum') {
        this.$router.push({ path: '/commission/commissionCredit', query: { type: '0' }})
      } else if (type === 'paymentSum') {
        this.$router.push({ path: '/commission/paymentAudit' })
      } else if (type === 'policyCount') {
        this.$router.push({ path: '/policy' })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" type="text/scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
