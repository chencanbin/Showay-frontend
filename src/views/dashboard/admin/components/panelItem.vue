<template>
  <div class="card-panel">
    <!--<div class="card-panel-icon-wrapper icon-people">-->
    <!--<svg-icon icon-class="income" class-name="card-panel-icon" />-->
    <!--</div>-->
    <div class="card-panel-description">
      <div class="card-panel-text">{{ title }}</div>
      <count-to
        :start-val="0"
        :end-val="count"
        :duration="2600"
        class="card-panel-num"
      />
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
  height: 108px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  border-radius: 4px;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
  &:hover {
    .card-panel-icon-wrapper {
      color: #fff;
    }
    .icon-people {
      background: #40c9c6;
    }
    .icon-message {
      background: #36a3f7;
    }
    .icon-payment-sum {
      background: #e6a23c;
    }
    .icon-money {
      background: #f4516c;
    }
    .icon-shopping {
      background: #34bfa3;
    }
  }
  .icon-people {
    color: #40c9c6;
  }
  .icon-message {
    color: #36a3f7;
  }
  .icon-payment-sum {
    color: #e6a23c;
  }
  .icon-money {
    color: #f4516c;
  }
  .icon-shopping {
    color: #34bfa3;
  }
  .card-panel-icon-wrapper {
    float: left;
    margin: 14px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }
  .card-panel-icon {
    float: left;
    font-size: 48px;
  }
  .card-panel-description {
    text-align: center;
    font-weight: bold;
    margin-top: 26px;
    .card-panel-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
    }
    .card-panel-num {
      font-size: 20px;
    }
  }
}
</style>
