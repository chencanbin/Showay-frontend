<template>
  <el-card v-loading="loading" style="position: relative; padding: 16px 16px 0;margin-bottom: 32px;">
    <div slot="header" class="clearfix">
      <span style="float: left; font-weight: bold; line-height: 36px">{{ $t('home.channelPerformanceScale') }}</span>
      <div style="display: inline-block; float: right">
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
    <div id="channelPie">
      <div v-show="afyp.length === 0" style="position: absolute; top: 50%; right: 50%; color: #cccccc">{{ $t('common.no_data') }}</div>
    </div>
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
      year: new Date(),
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
      this.total = 0
      this.$api.statistics.fetchTop({ item, groupBy, max, other: '', from: getYearFirst(this.year), to: getYearLast(this.year) }).then(res => {
        this.afyp = []
        res.data.forEach(item => {
          if (item.value > 0) {
            this.afyp.push(item)
          }
        })
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
        height: 350,
        padding: [50, 40, 50, 40]
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
          return item.point.key + ': ' + ((accounting.unformat(val) / total) * 100).toFixed(2) + '%'
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
