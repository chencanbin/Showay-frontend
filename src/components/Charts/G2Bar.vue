<template>
  <div :id="id"/>
</template>

<script>
import G2 from '@antv/g2'
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
      console.log('new: %s, old: %s', val, oldVal)
      this.drawChart(val)
    }
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    drawChart: function() {
      this.chart && this.chart.destory()
      this.chart = new G2.Chart({
        container: this.id,
        forceFit: true,
        height: 250,
        padding: [20, 30, 30, 40]
      })
      this.chart.source(this.charData)
      this.chart.scale('sales', {
        tickInterval: 20
      })
      this.chart.interval().position('channel*sales')
      this.chart.render()
    }
  }
}
</script>
