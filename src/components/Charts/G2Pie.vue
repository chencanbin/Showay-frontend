<template>
  <div :id="id" />
</template>

<script>
import G2 from "@antv/g2";
export default {
  props: {
    charData: {
      type: Array,
      default: function () {
        return {
          data: [],
        };
      },
    },
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  // 监听API接口传过来的数据  2018-08-21更新
  watch: {
    charData: function (val, oldVal) {
      // 监听charData，当放生变化时，触发这个回调函数绘制图表
      console.log("new: %s, old: %s", val, oldVal);
      this.drawChart(val);
    },
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart: function () {
      this.chart && this.chart.destory();
      this.chart = new G2.Chart({
        container: this.id,
        forceFit: true,
        height: 250,
        padding: [20, 30, 40, 40],
      });
      this.chart.source(this.charData, {
        percent: {
          formatter: function formatter(val) {
            val = val * 100 + "%";
            return val;
          },
        },
      });
      this.chart.coord("theta");
      this.chart
        .intervalStack()
        .position("percent")
        .color("item")
        .label("percent", {
          offset: -40,
          // autoRotate: false,
          textStyle: {
            textAlign: "center",
            shadowBlur: 2,
            shadowColor: "rgba(0, 0, 0, .45)",
          },
        })
        .tooltip("item*percent", function (item, percent) {
          percent = percent * 100 + "%";
          return {
            name: item,
            value: percent,
          };
        })
        .style({
          lineWidth: 1,
          stroke: "#fff",
        });
      this.chart.render();
    },
  },
};
</script>
