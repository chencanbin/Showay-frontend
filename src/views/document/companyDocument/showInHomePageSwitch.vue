<template>
  <el-switch :active-text="$t('document.advertising')" :value="file.showInHomePage" @change="handleChange"/>
</template>

<script>
export default {
  name: '',
  props: {
    file: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    handleChange(value) {
      this.file.showInHomePage = value
      this.loading = true
      this.$api.document.editFile(this.file.id, this.file).then(_ => {
        this.$message({
          message: this.$t('common.success'),
          type: 'success',
          duration: 5 * 1000
        })
        this.loading = false
      }).catch(_ => {
        this.file.showInHomePage = !value
        this.loading = false
      })
    }
  }
}
</script>

