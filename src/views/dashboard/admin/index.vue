<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData"/>
    <el-card style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div slot="header" class="clearfix">
        <span>公司收益趋势</span>
      </div>
      <g2-line :char-data="serverData" :id="'c1'"/>
    </el-card>
    <el-row :gutter="8">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card style="padding:16px 16px 0;margin-bottom:32px;">
          <div slot="header" class="clearfix">
            <span>公司业绩环比</span>
          </div>
          <g2-line :char-data="serverData" :id="'c5'"/>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card style="padding:16px 16px 0;margin-bottom:32px;">
          <div slot="header" class="clearfix">
            <span>公司业绩同比</span>
          </div>
          <g2-line :char-data="serverData" :id="'c4'"/>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card style="padding:16px 16px 0;margin-bottom:32px;" shadow="hover">
          <div slot="header" class="clearfix">
            <span>渠道业绩</span>
          </div>
          <g2-bar :char-data="barData" :id="'c2'"/>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card style="padding:16px 16px 0;margin-bottom:32px;">
          <div slot="header" class="clearfix">
            <span>渠道业绩比例分布</span>
          </div>
          <g2-pie :char-data="pieData" :id="'c3'"/>
        </el-card>
      </el-col>
    </el-row>
    <!--<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
    <!--<line-chart :chart-data="lineChartData"/>-->
    <!--</el-row>-->

    <!--<el-row :gutter="32">-->
    <!--<el-col :xs="24" :sm="24" :lg="8">-->
    <!--<div class="chart-wrapper">-->
    <!--<raddar-chart/>-->
    <!--</div>-->
    <!--</el-col>-->
    <!--<el-col :xs="24" :sm="24" :lg="8">-->
    <!--<div class="chart-wrapper">-->
    <!--<pie-chart/>-->
    <!--</div>-->
    <!--</el-col>-->
    <!--<el-col :xs="24" :sm="24" :lg="8">-->
    <!--<div class="chart-wrapper">-->
    <!--<bar-chart/>-->
    <!--</div>-->
    <!--</el-col>-->
    <!--</el-row>-->

    <!--<el-row :gutter="8">-->
    <!--&lt;!&ndash;<el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;"/>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
    <!--<el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}"-->
    <!--style="margin-bottom:30px;">-->
    <!--<todo-list/>-->
    <!--</el-col>-->
    <!--<el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}"-->
    <!--style="margin-bottom:30px;">-->
    <!--<box-card/>-->
    <!--</el-col>-->
    <!--</el-row>-->

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
import G2Line from '@/components/Charts/G2Line'
import G2Bar from '@/components/Charts/G2Bar'
import G2Pie from '@/components/Charts/G2Pie'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    G2Line,
    G2Bar,
    G2Pie,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TodoList,
    BoxCard
  },
  data() {
    return {
      serverData: [
        { time: '2018-1-1 00:00:00', runCount: Math.random() * 100 },
        { time: '2018-2-1 00:30:00', runCount: Math.random() * 100 },
        { time: '2018-3-1 01:00:00', runCount: Math.random() * 100 },
        { time: '2018-4-1 01:30:00', runCount: Math.random() * 100 },
        { time: '2018-5-1 02:00:00', runCount: Math.random() * 100 },
        { time: '2018-6-1 02:30:00', runCount: Math.random() * 100 },
        { time: '2018-7-1 03:00:00', runCount: Math.random() * 100 },
        { time: '2018-8-1 03:30:00', runCount: Math.random() * 100 },
        { time: '2018-9-1 04:00:00', runCount: Math.random() * 100 },
        { time: '2018-10-1 04:30:00', runCount: Math.random() * 100 },
        { time: '2018-11-1 05:00:00', runCount: Math.random() * 100 },
        { time: '2018-12-1 05:30:00', runCount: Math.random() * 100 },
        { time: '2019-1-1 06:00:00', runCount: Math.random() * 100 },
        { time: '2019-2-1 06:30:00', runCount: Math.random() * 100 },
        { time: '2019-3-1 07:00:00', runCount: Math.random() * 100 }
      ],
      barData: [
        {
          channel: 'JMC',
          sales: 38
        }, {
          channel: 'Showay',
          sales: 52
        }, {
          channel: 'CHAN',
          sales: 61
        }, {
          channel: '罗梓文',
          sales: 145
        }, {
          channel: '阮菲',
          sales: 48
        }],
      pieData: [{
        item: 'JMC',
        count: 40,
        percent: 0.4
      }, {
        item: 'Showay',
        count: 21,
        percent: 0.21
      }, {
        item: 'CHAN',
        count: 17,
        percent: 0.17
      }, {
        item: '罗梓文',
        count: 13,
        percent: 0.13
      }, {
        item: '阮菲',
        count: 9,
        percent: 0.09
      }],
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
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
