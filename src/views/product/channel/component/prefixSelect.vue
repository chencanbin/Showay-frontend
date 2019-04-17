<template>
  <el-select v-model="value" placeholder="请选择" @change="valueChange">
    <el-option key="0" label="所有" value="all"/>
    <el-option key="1" label="公司" value="companies"/>
    <el-option key="2" label="产品" value="products"/>
  </el-select>
</template>

<script>
export default {
  name: 'PrefixSelect',
  props: {
    nameType: {
      type: String,
      default() {
        return ''
      }
    },
    row: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      value: this.nameType
    }
  },
  methods: {
    valueChange(value) {
      console.log(value)
      this.$emit('nameTypeChange', { value, row: this.row })
    }
  }
}
</script>

<style scoped>

</style>
