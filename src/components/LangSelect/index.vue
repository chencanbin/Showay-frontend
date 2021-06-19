<template>
  <el-dropdown trigger="click" @command="handleSetLanguage">
    <div class="international-icon">
      <svg slot="reference" class="iconfont" aria-hidden="true">
        <use xlink:href="#icon_languade"></use>
      </svg>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language === 'zh-TW'" command="zh-TW" style="padding: 5px 10px">繁體中文</el-dropdown-item>
      <el-dropdown-item :disabled="language === 'zh-CN'" command="zh-CN" style="padding: 5px 10px">简体中文</el-dropdown-item>
      <el-dropdown-item :disabled="language === 'en'" command="en" style="padding: 5px 10px">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    language() {
      return this.$store.getters.language;
    },
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang;
      this.$store.dispatch("setLanguage", lang);
      // this.$message({
      //   message: 'Switch Language Success',
      //   type: 'success'
      // })
      location.reload(true);
    },
  },
};
</script>

<style scoped>
.international-icon {
  font-size: 36px;
  cursor: pointer;
  vertical-align: -5px !important;
}
</style>

