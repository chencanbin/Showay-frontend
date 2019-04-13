<template>
  <el-card style="padding:16px 16px 0;margin-bottom:32px;" class="clearedCredit">
    <div slot="header" class="clearfix">
      <span>公司业绩同比</span>
      <el-button-group style="margin-left: 20px">
        <el-button :type="buttonClearCreditMonth" size="small" @click="clearCreditMonth()">按月统计</el-button>
        <el-button :type="buttonClearCreditQuarter" size="small" @click="clearCreditQuarter()">按季统计</el-button>
        <el-button :type="buttonClearCreditYear" size="small" @click="clearCreditYear()">按年统计</el-button>
      </el-button-group>
    </div>
    <div id="clearedCredit"/>
  </el-card>
</template>

<script>
import G2 from '@antv/g2'
import accounting from 'accounting'
import { getCurrentYearFirst, getCurrentYearLast } from '@/utils'

export default {
  data() {
    return {
      buttonClearCreditMonth: 'primary',
      buttonClearCreditQuarter: '',
      buttonClearCreditYear: '',
      clearedCredit: [],
      chart: null,
      Shape: G2.Shape
    }
  },
  // 监听API接口传过来的数据  2018-08-21更新
  watch: {
    clearedCredit: function(val, oldVal) { // 监听charData，当放生变化时，触发这个回调函数绘制图表
      console.log('new: %s, old: %s', val, oldVal)
      this.drawChart(val)
    }
  },
  created() {
    const that = this
    this.Shape.registerShape('interval', 'textInterval', {
      draw: function draw(cfg, group) {
        const points = this.parsePoints(cfg.points) // 将0-1空间的坐标转换为画布坐标
        const value = cfg.origin._origin.value
        group.addShape('text', {
          attrs: {
            text: value,
            textAlign: 'center',
            x: points[1].x + cfg.size / 2,
            y: points[1].y,
            fontFamily: 'PingFang SC',
            fontSize: 12,
            fill: '#BBB'
          }
        })
        const polygon = group.addShape('polygon', {
          attrs: {
            points: points.map(function(point) {
              return [point.x, point.y]
            }),
            fill: cfg.color
          }
        })
        return polygon
      }
    })
    this.Shape.registerShape('interval', 'fallFlag', {
      getPoints: function getPoints(_ref) {
        const x = _ref.x
        const y = _ref.y
        const y0 = _ref.y0
        const size = _ref.size
        return [{
          x: x + size,
          y: y0 + size
        }, {
          x: x,
          y: y
        }]
      },
      draw: function draw(cfg, group) {
        if (cfg.origin._origin === that.clearedCredit[that.clearedCredit.length - 1]) {
          return
        }
        const points = this.parsePoints(cfg.points) // 将0-1空间的坐标转换为画布坐标
        const p1 = points[0]
        const width = 9
        const washaway = cfg.origin._origin.washaway
        group.addShape('text', {
          attrs: {
            text: (washaway * 100).toFixed(1) + ' %',
            x: p1.x - width / 2 - 14,
            y: p1.y - 14,
            fontFamily: 'PingFang SC',
            fontSize: 12,
            fill: '#BBB'
          }
        })
        const polygon = group.addShape('image', {
          attrs: {
            x: p1.x - 16,
            y: p1.y - 16,
            img: 'https://zos.alipayobjects.com/rmsportal/JuBdciUyUAkewNAetxtS.png',
            width: 32,
            height: 32
          }
        })
        return polygon // 将自定义Shape返回
      }
    })
    this.getClearedCreditTrend(0, 7, 0, 1)
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    clearCreditYear() {
      this.getClearedCreditTrend(0, 5, 0)
      this.buttonClearCreditMonth = ''
      this.buttonClearCreditQuarter = ''
      this.buttonClearCreditYear = 'primary'
    },
    clearCreditQuarter() {
      this.getClearedCreditTrend(0, 6, 0, 1)
      this.buttonClearCreditMonth = ''
      this.buttonClearCreditQuarter = 'primary'
      this.buttonClearCreditYear = ''
    },
    clearCreditMonth() {
      this.getClearedCreditTrend(0, 7, 0, 1)
      this.buttonClearCreditMonth = 'primary'
      this.buttonClearCreditQuarter = ''
      this.buttonClearCreditYear = ''
    },
    getClearedCreditTrend(item, groupBy, delta, lastYear) {
      let params = {}
      if (lastYear) {
        params = { item, groupBy, delta, lastYear, from: getCurrentYearFirst(), to: getCurrentYearLast() }
      } else {
        params = { item, groupBy, delta, from: getCurrentYearFirst(), to: getCurrentYearLast() }
      }
      this.$api.statistics.fetchTrend({ ...params }).then(res => {
        this.clearedCredit = res.data
      })
    },
    drawChart: function() {
      this.chart && this.chart.destroy()
      this.chart = new G2.Chart({
        container: 'clearedCredit',
        forceFit: true,
        height: 300,
        padding: [20, 30, 70, 80]
      })
      this.chart.source(this.clearedCredit)
      this.chart.tooltip({
        showTitle: false
      })
      this.chart.scale('value', {
        min: 0,
        formatter: function(val) {
          return accounting.formatMoney(val, '', 2)
        }
      })
      this.chart.interval().position('key*value').color('series').adjust([{
        type: 'dodge',
        marginRatio: 1 / 32
      }])
      //  this.chart.interval().position('key*value').color('#E4E4E4').shape('fallFlag')
      this.chart.render()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" type="text/scss" scoped>
  .clearedCredit {
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

    .el-button--primary:focus, .el-button--primary:hover {
      background: #66b1ff;
      border-color: #66b1ff;
      color: #fff;
    }
  }
</style>
