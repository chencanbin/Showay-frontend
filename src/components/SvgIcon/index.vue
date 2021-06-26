<template>
  <svg :class="svgClass" aria-hidden="true" @click="click">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    },
  },
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" type="text/scss">
.svg-icon {
  width: 1em;
  height: 1em;
  font-size: 20px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
