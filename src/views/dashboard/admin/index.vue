<template>
  <div class="dashboard-editor-container">
    <panel-group :overall="overall" @panelClick="panelClick"/>
    <el-row :gutter="8">
      <el-col :xs="24" :sm="24" :lg="16">
        <profit-channel-trend v-permission="[2]"/>
      </el-col>
      <el-col v-permission="[1, 2]" :xs="24" :sm="24" :lg="8">
        <fileList/>
      </el-col>
      <el-col v-permission="[1]" :xs="24" :sm="24" :lg="checkPermission([2]) ? 24 : 16">
        <profit-trend v-permission="[1]"/>
      </el-col>
      <el-col v-permission="[1]" :xs="24" :sm="24" :lg="24">
        <cleared-credit/>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="24" :sm="24" :lg="12">
        <channel-profit v-permission="[1]"/>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <channel-pie v-permission="[1]"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import PieChart from './components/PieChart'
import clearedCredit from './components/ClearedCredit'
import profitTrend from './components/profitTrend'
import profitChannelTrend from './components/profitChannelTrend'
import channelProfit from './components/ChannelProfit'
import ChannelPie from './components/ChannelPie'
import fileList from './components/fileList'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    PieChart,
    clearedCredit,
    profitTrend,
    profitChannelTrend,
    channelProfit,
    ChannelPie,
    fileList
  },
  directives: { permission },
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
    checkPermission,
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
