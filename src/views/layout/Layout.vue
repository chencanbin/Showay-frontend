<template>
  <div
    :class="classObj"
    tabindex="0"
    class="app-wrapper"
    @click="onPageClicked()"
    @mousemove="onPageClicked()"
    @keyup="onPageClicked()"
  >
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <navbar />
      <!--<tags-view/>-->
      <app-main />
    </div>
    <el-dialog
      id="timeout"
      :close-on-click-modal="false"
      :visible="timeoutDialog"
      :before-close="handleTimeoutDialogClose"
      title="提示"
      width="400px"
    >
      <span
      >由于长时间未操作系统，系统将在{{
        parseTime(closeTime, "{i}:{s}")
      }}后登出</span
      >
    </el-dialog>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import TimeoutMixin from "./mixin/TimeoutHandler";
export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
  },
  mixins: [ResizeMixin, TimeoutMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
    timeoutDialog() {
      return this.$store.state.app.timeoutDialog;
    },
  },
  created() {
    // window.setInterval(this.tTime, 1000) //关闭定时弹窗
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("closeSideBar", { withoutAnimation: false });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" type="text/scss">
@import "~@/styles/mixin.scss";
#timeout {
  .el-dialog__body {
    padding-bottom: 30px;
  }
}

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
