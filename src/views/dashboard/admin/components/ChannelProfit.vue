<template>
  <el-card v-loading="loading" class="channelProfit" style="padding:16px 16px 0;margin-bottom:32px;">
    <div slot="header" class="clearfix">
      <span>{{ $t('home.channelPerformanceTop') }}</span>
    </div>
    <div id="channelProfit"/>
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
      loading: false
    }
  },
  watch: {
    afyp: function(val, oldVal) { // 监听charData，当放生变化时，触发这个回调函数绘制图表
      console.log('new: %s, old: %s', val, oldVal)
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
      this.$api.statistics.fetchTop({ item, groupBy, max }).then(res => {
        this.afyp = res.data
        this.loading = false
      })
    },
    drawChart: function() {
      this.chart && this.chart.destroy()
      this.chart = new G2.Chart({
        container: 'channelProfit',
        forceFit: true,
        height: 300,
        padding: [20, 20, 50, 90]
      })
      this.chart.source(this.afyp)
      this.chart.scale('value', {
        alias: this.$t('home.sale'),
        min: 0,
        formatter: function(val) {
          return accounting.formatMoney(val, '', 2)
        }
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
      this.chart.interval().position('key*value')
      this.chart.render()
    }
  }
}
</script>

<style scoped>

</style>
