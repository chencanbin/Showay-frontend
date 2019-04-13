<template>
  <el-card style="padding:16px 16px 0;margin-bottom:32px;">
    <div slot="header" class="clearfix">
      <span>渠道业绩比例分布</span>
    </div>
    <div id="channelPie"/>
  </el-card>
</template>

<script>
import G2 from '@antv/g2'
import accounting from 'accounting'

export default {
  name: '',
  data() {
    return {
      afyp: []
    }
  },
  watch: {
    afyp: function(val, oldVal) { // 监听charData，当放生变化时，触发这个回调函数绘制图表
      console.log('new: %s, old: %s', val, oldVal)
      this.drawChart(val)
    }
  },
  created() {
    this.getAFYP(8, 3, 5)
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    getAFYP(item, groupBy, max) {
      this.$api.statistics.fetchTop({ item, groupBy, max, other: '' }).then(res => {
        this.afyp = res.data
      })
    },
    drawChart: function() {
      this.chart && this.chart.destroy()
      this.chart = new G2.Chart({
        container: 'channelPie',
        forceFit: true,
        height: 300,
        padding: [20, 30, 40, 40]
      })
      this.chart.source(this.afyp)
      this.chart.coord('theta')
      this.chart.scale('value', {
        min: 0,
        formatter: function(val) {
          return accounting.formatMoney(val, '', 2)
        }
      })
      this.chart.tooltip({
        showTitle: false
      })
      this.chart.intervalStack().position('value').color('key').label('value', {
        offset: -40,
        // autoRotate: false,
        textStyle: {
          textAlign: 'center',
          shadowBlur: 2,
          shadowColor: 'rgba(0, 0, 0, .45)'
        }
      }).tooltip('key*value', function(key, value) {
        return {
          name: key,
          value: value
        }
      }).style({
        lineWidth: 1,
        stroke: '#fff'
      })
      this.chart.render()
    }
  }
}
</script>

<style scoped>

</style>
