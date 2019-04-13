<template>
  <div :id="id"/>
</template>

<script>
import G2 from '@antv/g2'
import accounting from 'accounting'

export default {
  props: {
    charData: {
      type: Array,
      default: function() {
        return {
          data: []
        }
      }
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null
    }
  },
  // 监听API接口传过来的数据  2018-08-21更新
  watch: {
    charData: function(val, oldVal) { // 监听charData，当放生变化时，触发这个回调函数绘制图表
      this.drawChart(val)
    }
  },
  created() {
    console.log(this.id)
    this.drawChart()
  },
  methods: {
    drawChart: function() {
      this.chart && this.chart.destroy()
      this.chart = new G2.Chart({
        container: this.id,
        forceFit: true,
        height: 250,
        padding: [20, 30, 30, 80]
      })
      this.chart.source(this.charData)
      this.chart.scale('value', {
        tickInterval: 20,
        formatter: function(val) {
          return accounting.formatMoney(val, '', 2)
        }
      })
      this.chart.interval().position('key*value')
      this.chart.render()
    }
  }
}
</script>
