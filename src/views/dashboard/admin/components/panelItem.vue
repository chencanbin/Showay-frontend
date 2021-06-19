<template>
  <div class="card-panel" style="border-radius: 6px;">
    <!--<div class="card-panel-icon-wrapper icon-people">-->
    <!--<svg-icon icon-class="income" class-name="card-panel-icon" />-->
    <!--</div>-->
    <div class="card-panel-description">
      <div class="card-panel-text">{{ title }}</div>
      <div class="data-contrast">同比
        <span v-if="contrast === 0" class="equal">-</span>
        <span v-else-if="contrast > 0" class="increase">+{{contrast}}%</span>
        <span v-else-if="contrast < 0" class="reduce">{{contrast}}%</span>
      </div>
      <div class="icon-contrast">
        <svg v-if="contrast === 0" class="iconfont" aria-hidden="true">
          <use xlink:href="#icon_shouye_peizhi"></use>
        </svg>
        <svg v-else-if="contrast > 0" class="iconfont" aria-hidden="true">
          <use xlink:href="#icon_increase"></use>
        </svg>
        <svg v-else-if="contrast < 0" class="iconfont" aria-hidden="true">
          <use xlink:href="#icon_reduce"></use>
        </svg>
        <!-- <i v-else-if="contrast > 0" class="el-icon-top"></i>
        <i v-else-if="contrast < 0" class="el-icon-bottom"></i> -->
      </div>
      <count-to :start-val="0" :end-val="count" :duration="2600" class="card-panel-num" />
    </div>
  </div>
</template>

<script>
import CountTo from "vue-count-to";

export default {
  components: {
    CountTo,
  },
  props: {
    contrast: { // 对比数据
      type: Number,
      default() {
        return 12.5
      }
    },
    title: {
      type: String,
      default() {
        return "";
      },
    },
    item: {
      type: Number,
      default() {
        return 0;
      },
    },
    groupBy: {
      type: Number,
      default() {
        return 0;
      },
    },
    from: {
      type: Number,
      default() {
        return 0;
      },
    },
    to: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
      count: 0,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.$api.statistics
        .fetchTrend({
          item: this.item,
          groupBy: this.groupBy,
          from: this.from,
          to: this.to,
        })
        .then((res) => {
          this.count = parseFloat(res.data[0].value);
        });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped type="text/scss">
.card-panel {
  height: 150px;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);

  .card-panel-text {
    font-weight: bold;
    color: #43475f;
    font-size: 18px;
    position: absolute;
    top: 24px;
    left: 24px;
  }
  .data-contrast {
    color: $--label;
    font-size: 14px;
    font-weight: 500;
    position: absolute;
    top: 26px;
    right: 24px;

    .increase {
      font-weight: bold;
      color: $--purple;
    }
    .reduce {
      font-weight: bold;
      color: $--yellow;
    }
  }

  .icon-contrast {
    position: absolute;
    bottom: 24px;
    left: 24px;
  }
  .card-panel-num {
    position: absolute;
    right: 24px;
    bottom: 24px;
    color: #3e425e;
    font-size: 28px;
    font-weight: bold;
  }
}
</style>
