<template>
  <div class="full-calendar-header">
    <div class="header-left">
      <slot name="header-left"/>
    </div>
    <div class="header-center">
      <span class="prev-month" @click.stop="goPrev">{{ leftArrow }}</span>
      <span class="title">{{ title }}</span>
      <span class="next-month" @click.stop="goNext">{{ rightArrow }}</span>
    </div>
    <div class="header-right">
      <slot name="header-right"/>
    </div>
  </div>
</template>
<script type="text/babel">
import moment from 'moment'

export default {
  props: {
    currentMonth: {
      type: Object,
      default: function() {
        return {}
      }
    },
    titleFormat: {
      type: Object,
      default: function() {
        return {}
      }
    },
    firstDay: {
      type: Number,
      default: function() {
        return 0
      }
    },
    monthNames: {
      type: Object,
      default: function() {
        return {}
      }
    },
    locale: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      leftArrow: '<',
      rightArrow: '>'
    }
  },
  computed: {
    title() {
      if (!this.currentMonth) return
      return this.currentMonth.locale(this.locale).format('MMMM YYYY')
    }
  },
  methods: {
    goPrev() {
      const newMonth = moment(this.currentMonth).subtract(1, 'months').startOf('month')
      this.$emit('change', newMonth)
    },
    goNext() {
      const newMonth = moment(this.currentMonth).add(1, 'months').startOf('month')
      this.$emit('change', newMonth)
    }
  }
}
</script>
<style lang="scss" type="text/scss">
.full-calendar-header{
  display: flex;
  align-items: center;
  .header-left,.header-right{
    flex:1;
  }
  .header-center{
    flex:3;
    text-align:center;
    .title{
      margin: 0 10px;
    }
    .prev-month,.next-month{
      cursor: pointer;
    }
  }
}
</style>
