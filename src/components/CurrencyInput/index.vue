<template>
  <el-input
    ref="input"
    :value="formatValue"
    :placeholder="placeholder"
    @change="onChange"
    @focus="selectAll"
    @blur="onBlur"/>
</template>

<script>
import accounting from 'accounting'
export default {
  name: 'CurrencyInput',
  props: {
    value: {
      type: Number,
      default: 0,
      desc: '数值'
    },
    symbol: {
      type: String,
      default: '',
      desc: '货币标识符'
    },
    decimal: {
      type: Number,
      default: 2,
      desc: '小数位'
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      currencyValue: accounting.unformat(this.value),
      focused: false
    }
  },
  computed: {
    formatValue: function() {
      if (this.focused) {
        return this.currencyValue
      } else {
        return accounting.formatMoney(this.currencyValue, this.symbol, this.decimal)
      }
    }
  },
  methods: {
    onChange: function(value) {
      this.currencyValue = accounting.unformat(value)
      this.$emit('input', this.currencyValue)
    },
    onBlur: function() {
      this.focused = false
    },
    selectAll: function(event) {
      this.focused = true
      setTimeout(function() {
        event.target.select()
      }, 0)
    }
  }
}
</script>

<style scoped>

</style>
