<template>
  <div :class="classObj" tabindex="0" class="app-wrapper" @click="onPageClicked()" @mousemove="onPageClicked()" @keyup="onPageClicked()">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <navbar/>
      <!--<tags-view/>-->
      <app-main/>
    </div>
    <el-dialog
      id="timeout"
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      title="提示"
      width="400px">
      <span>由于长时间未操作系统，系统将在{{ parseTime(closeTime, '{i}:{s}') }}后登出</span>
    </el-dialog>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import store from '@/store'
import { parseTime } from '@/utils'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      lTime: new Date().getTime(), // 最后一次点击的时间
      ctTime: new Date().getTime(), // 当前时间
      tWarning: 5 * 60 * 1000, // 超过时间5min
      tOut: 10 * 60 * 1000, // 超时时间10min
      closeTime: 10 * 60 * 1000,
      dialogVisible: false
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  created() {
    window.setInterval(this.tTime, 1000)
  },
  methods: {
    parseTime,
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    },
    onPageClicked() {
      this.dialogVisible = false
      this.lTime = new Date().getTime()
      this.closeTime = this.tOut
    },
    handleClose() {
      this.dialogVisible = false
      this.lTime = new Date().getTime()
      this.closeTime = this.tOut
    },
    tTime() {
      this.ctTime = new Date().getTime()
      this.closeTime = this.closeTime - 1000
      if (this.closeTime <= 0) {
        window.onbeforeunload = null
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      } else if (this.ctTime - this.lTime > this.tWarning && !this.dialogVisible) {
        this.dialogVisible = true
      }
    }
  }
}
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
    &.mobile.openSidebar{
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
