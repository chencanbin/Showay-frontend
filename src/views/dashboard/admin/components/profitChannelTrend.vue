<template>
  <el-card v-loading="loading" style="background:#fff;padding:10px 16px 0;margin-bottom:32px;" class="profit">
    <div slot="header" class="clearfix">
      <span style="float: left; font-weight: bold; line-height: 36px">{{ $t('home.channelProfitTrend', ['']) }}</span>
      <div style="display: inline-block; float: right">
        <el-button-group style="margin-left: 20px">
          <el-button :type="buttonProfitMonth" size="small" @click="profitMonth()">{{ $t('home.month') }}</el-button>
          <el-button :type="buttonProfitQuarter" size="small" @click="profitQuarter()">{{ $t('home.quarter') }}</el-button>
          <el-button :type="buttonProfitYear" size="small" @click="profitYear()">{{ $t('home.year') }}</el-button>
        </el-button-group>
        <el-select
          v-model="channel"
          :placeholder="$t('client.insurance_policy.set.channel_name')"
          filterable
          remote
          clearable
          style="margin-left: 20px">
          <el-option
            v-for="item in channels.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <el-date-picker
          :editable="false"
          :clearable="false"
          :unlink-panels="true"
          v-model="year"
          type="year"
          value-format="timestamp"
          style="margin-left: 20px; width: 120px"/>
      </div>
    </div>
    <div id="profitChannelTrend"/>
  </el-card>

</template>

<script>
import { mapState } from 'vuex'
import G2 from '@antv/g2'
import accounting from 'accounting'
import { getYearFirst, getYearLast } from '@/utils'

export default {
  name: '',
  data() {
    return {
      activeName: 0,
      channel: '',
      year: new Date(),
      buttonProfitMonth: 'primary',
      buttonProfitQuarter: '',
      buttonProfitYear: '',
      profit: [],
      chart: null,
      loading: false
    }
  },
  computed: {
    ...mapState({
      channels: state => state.user.users
    })
  },
  // 监听API接口传过来的数据  2018-08-21更新
  watch: {
    year: function(val) {
      if (this.activeName === 0) {
        this.profitMonth()
      } else if (this.activeName === 1) {
        this.profitQuarter()
      } else {
        this.profitYear()
      }
    },
    channel: function(val) {
      if (this.activeName === 0) {
        this.profitMonth()
      } else if (this.activeName === 1) {
        this.profitQuarter()
      } else {
        this.profitYear()
      }
    },
    profit: function(val, oldVal) { // 监听charData，当放生变化时，触发这个回调函数绘制图表
      this.drawChart(val)
    }
  },
  created() {
    this.getChannel()
    this.getProfit(8, 7)
  },
  methods: {
    getChannel(params) {
      const role = { role: 2 }
      if (params) {
        params.role = role
      } else {
        params = role
      }
      this.$store.dispatch('FetchUserList', params)
    },
    profitYear() {
      this.activeName = 2
      this.getProfit(8, 5)
      this.buttonProfitMonth = ''
      this.buttonProfitQuarter = ''
      this.buttonProfitYear = 'primary'
    },
    profitQuarter() {
      this.activeName = 1
      this.getProfit(8, 6)
      this.buttonProfitMonth = ''
      this.buttonProfitQuarter = 'primary'
      this.buttonProfitYear = ''
    },
    profitMonth() {
      this.activeName = 0
      this.getProfit(8, 7)
      this.buttonProfitMonth = 'primary'
      this.buttonProfitQuarter = ''
      this.buttonProfitYear = ''
    },
    getProfit(item, groupBy) {
      this.loading = true
      this.$api.statistics.fetchTrend({ item, groupBy, from: getYearFirst(this.year), to: getYearLast(this.year), user: this.channel }).then(res => {
        this.profit = res.data
        this.loading = false
      }).catch(_ => {
        this.loading = false
      })
    },
    drawChart: function() {
      this.chart && this.chart.destroy()
      this.chart = new G2.Chart({
        container: 'profitChannelTrend',
        forceFit: true,
        height: 300,
        padding: [20, 40, 50, 90]
      })
      this.chart.source(this.profit)
      this.chart.scale('value', {
        alias: this.$t('home.sale'),
        min: 0,
        formatter: function(val) {
          return accounting.formatMoney(val, '', 2)
        }
      })
      this.chart.scale('key', {
        range: [0, 1]
      })
      this.chart.axis('value', {
        label: {
          textStyle: {
            fill: '#aaaaaa'
          }
        }
      })
      this.chart.axis('key', {
        label: {
          textStyle: {
            fill: '#aaaaaa'
          }
        }
      })
      // this.chart.tooltip({
      //   crosshairs: {
      //     type: 'line'
      //   }
      // })
      this.chart.line().position('key*value')
      this.chart.point().position('key*value').size(3).shape('circle').style({
        stroke: '#fff',
        lineWidth: 1
      })
      this.chart.render()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" type="text/scss">
  .profit {
    .el-button:focus, .el-button:hover {
      color: #409eff;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
    .el-button--primary {
      color: #fff;
      background-color: #409eff;
      border-color: #409eff;
    }
    .el-button--primary:focus, .el-button--primary:hover {
      background: #66b1ff;
      border-color: #66b1ff;
      color: #fff;
    }
  }
</style>
