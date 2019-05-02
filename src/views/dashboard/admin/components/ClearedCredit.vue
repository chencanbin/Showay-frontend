<template>
  <el-card v-loading="loading" style="padding:16px 16px 0;margin-bottom:32px;" class="clearedCredit">
    <div slot="header" class="clearfix">
      <span>{{ $t('home.comparison') }}</span>
      <el-select
        :remote-method="searchCompany"
        :loading="companyLoading"
        v-model="company"
        :placeholder="$t('common.company_placeholder')"
        filterable
        remote
        clearable
        style="margin-left: 20px"
        @focus="onCompanyFocus">
        <el-option
          v-for="item in companies"
          :key="item.id"
          :label="item.name"
          :value="item.id"/>
      </el-select>
      <el-button-group style="margin-left: 20px">
        <el-button :type="buttonClearCreditMonth" size="small" @click="clearCreditMonth()">{{ $t('home.month') }}</el-button>
        <el-button :type="buttonClearCreditQuarter" size="small" @click="clearCreditQuarter()">{{ $t('home.quarter') }}</el-button>
        <el-button :type="buttonClearCreditYear" size="small" @click="clearCreditYear()">{{ $t('home.year') }}</el-button>
      </el-button-group>
    </div>
    <div id="clearedCredit"/>
  </el-card>
</template>

<script>
import { mapState } from 'vuex'
import G2 from '@antv/g2'
import accounting from 'accounting'
import { getCurrentYearFirst, getCurrentYearLast } from '@/utils'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  data() {
    return {
      buttonClearCreditMonth: 'primary',
      buttonClearCreditQuarter: '',
      buttonClearCreditYear: '',
      clearedCredit: [],
      insurancePolicyCount: [],
      sourceData: [],
      chart: null,
      Shape: G2.Shape,
      loading: false,
      company: '',
      groupBy: 7
    }
  },
  computed: {
    ...mapState({
      companyLoading: state => state.company.companyLoading,
      companies: state => state.company.companyList.list
    })
  },
  // 监听API接口传过来的数据  2018-08-21更新
  watch: {
    sourceData: function(val, oldVal) { // 监听charData，当放生变化时，触发这个回调函数绘制图表
      this.drawChart(val)
    },
    company: function(val) {
      this.company = val
      this.getTrend(0, 1)
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
    if (this.checkPermission([1])) {
      this.getTrend(0, 1)
    }
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    checkPermission,
    onCompanyFocus() {
      this.getCompanies()
    },
    searchCompany(query) {
      this.getCompanies({ wildcard: query })
    },
    getCompanies(params) {
      this.$store.dispatch('company/FetchCompanyList', params)
    },
    clearCreditYear() {
      this.groupBy = 5
      this.getTrend(0, 0)
      this.buttonClearCreditMonth = ''
      this.buttonClearCreditQuarter = ''
      this.buttonClearCreditYear = 'primary'
    },
    clearCreditQuarter() {
      this.groupBy = 6
      this.getTrend(0, 1)
      this.buttonClearCreditMonth = ''
      this.buttonClearCreditQuarter = 'primary'
      this.buttonClearCreditYear = ''
    },
    clearCreditMonth() {
      this.groupBy = 7
      this.getTrend(0, 1)
      this.buttonClearCreditMonth = 'primary'
      this.buttonClearCreditQuarter = ''
      this.buttonClearCreditYear = ''
    },
    getTrend(delta, lastYear) {
      this.loading = true
      let clearedCreditParams = { item: 0, groupBy: this.groupBy, delta, from: getCurrentYearFirst(), to: getCurrentYearLast() }
      let insurancePolicyCount = { item: 5, groupBy: this.groupBy, delta, from: getCurrentYearFirst(), to: getCurrentYearLast() }
      if (lastYear) {
        clearedCreditParams = Object.assign({ lastYear }, clearedCreditParams)
        insurancePolicyCount = Object.assign({ lastYear }, insurancePolicyCount)
        // clearedCreditParams = { item: 0, groupBy, delta, lastYear, from: getCurrentYearFirst(), to: getCurrentYearLast(), target }
        // insurancePolicyCount = { item: 5, groupBy, delta, lastYear, from: getCurrentYearFirst(), to: getCurrentYearLast(), target }
      }
      if (this.company) {
        clearedCreditParams = Object.assign({ target: this.company }, clearedCreditParams)
        insurancePolicyCount = Object.assign({ target: this.company }, insurancePolicyCount)
      }
      this.$api.statistics.fetchTrend({ ...clearedCreditParams }).then(res => {
        this.clearedCredit = res.data
        const sourceData = []
        this.$api.statistics.fetchTrend({ ...insurancePolicyCount }).then(res => {
          this.insurancePolicyCount = res.data
          this.insurancePolicyCount.forEach((item, index) => {
            if (item.series) {
              sourceData.push({ key: item.key, value: this.clearedCredit[index].value, series: this.clearedCredit[index].series, count: item.value, countSeries: item.series })
            } else {
              sourceData.push({ key: item.key, value: this.clearedCredit[index].value, series: this.clearedCredit[index].key, count: item.value, countSeries: item.key })
            }
          })
          this.sourceData = sourceData
          this.loading = false
        })
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
      this.chart.source(this.sourceData, {
        series: {
          formatter: val => {
            return val + ' ' + this.$t('home.sale')
          }
        },
        countSeries: {
          formatter: val => {
            return val + ' ' + this.$t('home.count')
          }
        }
      })
      this.chart.axis('count', {
        grid: null
      })
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
      this.chart.line().position('key*count').color('countSeries').size(1)
      // this.chart.interval().position('key*count').color('series').adjust([{
      //   type: 'dodge',
      //   marginRatio: 1 / 32
      // }])
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
