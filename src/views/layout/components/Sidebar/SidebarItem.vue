<template>
  <div v-if="!item.hidden && item.children && item.children.length > 0" class="menu-wrapper">
    <template v-if=" hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <app-link :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <item v-if="onlyOneChild.meta" :icon="onlyOneChild.meta.icon || item.meta.icon" :title="generateTitle(onlyOneChild.meta.title)" @click.native="onMenuItemClick(item)" />
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu v-else ref="submenu" :index="resolvePath(item.path)" :show-timeout="100" :hide-timeout="300">
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta.icon" :title="generateTitle(item.meta.title)" @click.native="onMenuItemClick(item)" />
      </template>

      <template v-for="child in item.children">
        <div :key="child.path">
          <sidebar-item v-if="child.children && child.children.length > 0" :is-nest="true" :item="child" :key="child.path" :base-path="resolvePath(child.path)" class="nest-menu" />
          <app-link v-else :to="resolvePath(child.path)" :key="child.name">
            <el-menu-item :index="resolvePath(child.path)">
              <item v-if="child.meta" :icon="child.meta.icon" :title="generateTitle(child.meta.title)" />
            </el-menu-item>
          </app-link>
        </div>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { generateTitle } from "@/utils/i18n";
import { isExternal } from "@/utils";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";
export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  directives: {
    sidebarItem: {
      bind(el, binding, vNode) {
        console.log(vNode)
        const componentInstance = vNode.componentInstance;
        const active = componentInstance.active;

        // const active = vNode.context.$parent.active;
        if (active && componentInstance.$children.length >= 1) {
          const itemNode = componentInstance.$children[0];
          const icon = itemNode.icon;
          const iconName = icon.slice(0, -4);
          itemNode.icon = `${iconName}_select`;
        }
      },
      // update(el, binding, vNode) {
      //   const componentInstance = vNode.componentInstance;
      //   const active = componentInstance.active;

      //   // const active = vNode.context.$parent.active;
      //   if (active && componentInstance.$children.length >= 1) {
      //     const itemNode = componentInstance.$children[0];
      //     const icon = itemNode.icon;
      //     const iconName = icon.slice(0, -4);
      //     itemNode.icon = `${iconName}_select`;
      //   }
      // }
      // update(el, binding, vNode) {
      //   console.log('........................')
      //   console.log()
      // }
    },
  },
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      onlyOneChild: null,
      currentChild: '',
      currentChildrenList: []
    };
  },
  methods: {
    onMenuItemClick(item, children) {
      this.$emit('menuClick', item)
      // this.$forceUpdate();
      // this.$set(item, 'isActive', updateFlat + 1)
      // if (this.currentChild) {
      //   const iconStr = this.currentChild.meta.icon.slice(0, -7)
      //   this.currentChild.meta.icon = `${iconStr}_nor`
      // }
      // console.log(this.currentChildrenList)
      // if (this.currentChildrenList.length) {
      //   this.currentChildrenList.forEach(item => {
      //     const iconStr = item.meta.icon.slice(0, -7)
      //     item.meta.icon = `${iconStr}_nor`
      //   })
      // }

      // this.currentChild = item
      // this.currentChildrenList = children;
      // const iconStr = item.meta.icon.slice(0, -4)
      // item.meta.icon = `${iconStr}_select`
    },
    hasOneShowingChild(children, parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }
      return false;
    },
    resolvePath(routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath;
      }
      return path.resolve(this.basePath, routePath);
    },
    isExternalLink(routePath) {
      return isExternal(routePath);
    },
    generateTitle,
  },
};
</script>
<style lang="scss" scoped>
.menu-wrapper {
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
}
</style>
