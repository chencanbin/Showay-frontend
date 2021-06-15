<template>
  <div>
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
