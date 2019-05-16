<template>
  <el-card v-loading="loading" style="padding:16px 16px 0;margin-bottom:32px;">
    <div slot="header" class="clearfix">
      <span>{{ $t('home.channelPerformanceScale') }}</span>
      <el-date-picker
        :editable="false"
        :clearable="false"
        :unlink-panels="true"
        v-model="year"
        type="daterange"
        value-format="timestamp"
        style="margin-left: 20px; width: 240px"/>
    </div>
    <div id="channelPie"/>
  </el-card>
</template>

<script>
import G2 from '@antv/g2'
import accounting from 'accounting'
import { getYearFirst, getYearLast } from '@/utils'

export default {
  name: '',
  data() {
    return {
      afyp: [],
      year: [getYearFirst(new Date()), getYearLast(new Date())],
      total: 0,
      loading: false
    }
  },
  watch: {
    afyp: function(val, oldVal) { // 监听charData，当放生变化时，触发这个回调函数绘制图表
      this.drawChart(val)
    },
    year: function(val) {
      this.getAFYP(8, 3, 5)
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
      this.loading = true
      this.$api.statistics.fetchTop({ item, groupBy, max, other: '', from: this.year[0], to: this.year[1] }).then(res => {
        this.afyp = res.data
        this.afyp.forEach(item => {
          this.total += item.value
        })
        if (this.total === 0) {
          this.afyp = []
        }
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
        padding: [30, 40, 40, 40]
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
          if (parseFloat((accounting.unformat(val) / total).toFixed(2)) === 0) {
            return
          }
          return item.point.key + ': ' + (accounting.unformat(val) / total).toFixed(2) * 100 + '%'
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
