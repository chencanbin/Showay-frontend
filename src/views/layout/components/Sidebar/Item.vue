<template>
  <div>
    <!-- <i :class="icon" class="iconfont" v-sidebar-item="icon" /> -->
    <svg class="iconfont" aria-hidden="true">
      <use :xlink:href="'#' + icon"></use>
    </svg>
    <span slot="title">{{ title }}</span>
  </div>
</template>
<script>
export default {
  name: 'MenuItem',
  // functional: true,

  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  // render(h, context) {
  //   const { icon, title } = context.props;
  //   const vnodes = [];

  //   if (icon) {
  //     vnodes.push(<i class="" class={`iconfont ${icon}`} />);
  //   }

  //   if (title) {
  //     vnodes.push(<span slot="title">{title}</span>);
  //   }
  //   return vnodes;
  // },
};
</script>
