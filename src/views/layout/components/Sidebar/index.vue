<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu :show-timeout="300" :default-active="$route.path" :collapse="isCollapse" mode="vertical" background-color="#fff" text-color="#8E919F" active-text-color="#515CC3">
      <sidebar-item v-for="(route, index) in permission_routers" :key="route.path" :item="route" :base-path="route.path" ref="sidebarItem" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(["permission_routers", "sidebar"]),
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  data() {
    return {
      currentRoute: {},
      currentIndex: 0
    }
  },
  watch: {
  },
  methods: {
    // 初始化icon
    initRouters(routers, path) {
      if (routers && routers.length > 0) {
        routers.forEach(item => {
          if (!item.hidden && item.children && item.children.length > 0) {
            this.initRouters(item.children, path)
          } else {
            console.log(item.path)
            if (item.path === path) {
            }
          }
        })
      }
    }
  }
};
</script>
