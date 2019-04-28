<template>
  <el-card v-loading="loading" style="padding:16px 16px 0;margin-bottom:32px;">
    <div slot="header" class="clearfix">
      <span>{{ $t('home.channelPerformanceScale') }}</span>
    </div>
    <div id="channelPie"/>
  </el-card>
</template>

<script>
import G2 from '@antv/g2'
import accounting from 'accounting'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  name: '',
  data() {
    return {
      afyp: [],
      total: 0,
      loading: false
    }
  },
  watch: {
    afyp: function(val, oldVal) { // 监听charData，当放生变化时，触发这个回调函数绘制图表
      this.drawChart(val)
    }
  },
  created() {
    if (this.checkPermission([1])) {
      this.getAFYP(8, 3, 5)
    }
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    checkPermission,
    getAFYP(item, groupBy, max) {
      this.loading = true
      this.$api.statistics.fetchTop({ item, groupBy, max, other: '' }).then(res => {
        this.afyp = res.data
        this.afyp.forEach(item => {
          this.total += item.value
        })
        this.loading = false
      })
    },
    drawChart: function() {
      const total = this.total
      this.chart && this.chart.destroy()
      this.chart = new G2.Chart({
        container: 'channelPie',
        forceFit: true,
        height: 300,
        padding: [20, 40, 40, 40]
      })
      this.chart.source(this.afyp)
      this.chart.coord('theta')
      this.chart.scale('value', {
        min: 0
      })
      this.chart.tooltip({
        showTitle: false
      })
      this.chart.intervalStack().position('value').color('key').label('value', {
        formatter: function formatter(val, item) {
          if (Number(val) === 0) {
            return
          }
          return item.point.key + ': ' + (accounting.unformat(val) / total).toFixed(2) + '%'
        }
      }).tooltip('key*value', function(key, value) {
        return {
          name: key,
          value: accounting.formatMoney(value, '', 2)
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
