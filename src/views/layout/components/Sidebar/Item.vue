<template>
  <div v-change-icon @click="handleForceUpdate">
    <i class="iconfont" :class="icon" />
    <span slot="title">{{title}}</span>
  </div>
</template>
<script>
export default {
  name: "MenuItem",
  // functional: true,
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  directives: {
    'changeIcon': {
      bind: (el, binding, vNode) => {
        // if (binding.value && binding.value.meta && binding.value.meta.icon) {
        //   const icon = binding.value.meta.icon;

        // }
        console.log(vNode)
        const active = vNode.context.$parent.active
        const iconStr = vNode.context.icon;
        if (active) {
          vNode.context.icon = `${iconStr.slice(0, -4)}_select`
          // item.meta.icon = `${iconStr}_select`
        }
      },
      update: (el, binding, vNode) => {
        // console.log(vNode)
        // const active = vNode.context.$parent.active
        // const iconStr = vNode.context.icon;
        // if (active) {

        //   console.log(`${iconStr.slice(0, -4)}_select`)
        //   vNode.context.icon = `${iconStr.slice(0, -4)}_select`
        //   // item.meta.icon = `${iconStr}_select`
        // }
        const active = vNode.context.$parent.active
        const iconStr = vNode.context.icon;
        console.log(iconStr)
        if (active) {
          // vNode.context.icon = `${iconStr.slice(0, -4)}_select`
          // item.meta.icon = `${iconStr}_select`
        }
      }
    }
  },
  methods: {
    handleForceUpdate() {
      // this.$forceUpdate();
    }
  },
  // render(h, context) {
  //   const { icon, title } = context.props;
  //   const vnodes = [];

  //   if (icon) {
  //     vnodes.push();
  //   }

  //   if (title) {
  //     vnodes.push();
  //   }
  //   return vnodes;
  // },
};
</script>
