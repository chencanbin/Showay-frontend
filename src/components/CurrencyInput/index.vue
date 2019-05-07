<template>
  <el-input
    ref="input"
    :value="formatValue"
    :placeholder="placeholder"
    @input="onChange"
    @focus="selectAll"
    @blur="onBlur">
    <slot name="prepend"/>
  </el-input>
</template>

<script>
import accounting from 'accounting'
export default {
  name: 'CurrencyInput',
  props: {
    value: {
      type: String | Number,
      default: '',
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
      if (!isNaN(value)) {
        this.currencyValue = value
      }
    },
    onBlur: function(event) {
      this.currencyValue = accounting.unformat(this.currencyValue)
      this.focused = false
      this.$emit('input', this.currencyValue)
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
