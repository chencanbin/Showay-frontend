<template>
  <div class="full-calendar-header">
    <div class="header-left">
      <slot name="header-left" />
    </div>
    <div class="header-center">
      <svg class="prev-month iconfont" aria-hidden="true" @click.stop="goPrev">
        <use xlink:href="#icon-61" />
      </svg>
      <!--<span class="title">{{ title }}</span>-->
      <el-date-picker :editable="false" :clearable="false" v-model="currentMonth" prefix-icon="false" type="month" placeholder="选择日期" style="width: 100px" @change="handleDateChange" />
      <svg class="next-month iconfont" aria-hidden="true" @click.stop="goNext">
        <use xlink:href="#icon-61" />
      </svg>
    </div>
    <div class="header-right">
      <slot name="header-right" />
    </div>
  </div>
</template>
<script type="text/babel">
import moment from "moment";

export default {
  props: {
    currentMonth: {
      type: Object,
      default: function () {
        return {};
      },
    },
    titleFormat: {
      type: Object,
      default: function () {
        return {};
      },
    },
    firstDay: {
      type: Number,
      default: function () {
        return 0;
      },
    },
    monthNames: {
      type: Object,
      default: function () {
        return {};
      },
    },
    locale: {
      type: String,
      default: function () {
        return "";
      },
    },
  },
  data() {
    return {
      leftArrow: "<",
      rightArrow: ">",
    };
  },
  computed: {
    title() {
      if (!this.currentMonth) return;
      return this.currentMonth.locale(this.locale);
      // return this.currentMonth.locale(this.locale).format('MMMM YYYY')
      // return this.currentMonth
    },
  },
  methods: {
    goPrev() {
      const newMonth = moment(this.currentMonth)
        .subtract(1, "months")
        .startOf("month");
      this.$emit("change", newMonth);
    },
    goNext() {
      const newMonth = moment(this.currentMonth)
        .add(1, "months")
        .startOf("month");
      this.$emit("change", newMonth);
    },
    handleDateChange(val) {
      const newMonth = moment(this.currentMonth);
      this.$emit("change", newMonth);
    },
  },
};
</script>
<style lang="scss" type="text/scss">
.full-calendar-header {
  display: flex;
  align-items: center;
  .el-input__suffix-inner {
    display: none;
  }
  .header-left,
  .header-right {
    flex: 1;
  }
  .header-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      margin: 0 10px;
    }
    .prev-month {
      transform: rotate(180deg);
    }
    .next-month {
      margin-right: 0;
    }
  }
  .el-input__inner {
    border: 0px;
  }
}
</style>
