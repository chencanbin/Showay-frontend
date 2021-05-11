<template>
  <div class="basic-container">
    <el-card>
      <slot />
    </el-card>
  </div>
</template>

<script>
export default {
  name: "BasicContainer",
};
</script>

<style lang="scss" type="text/scss">
.basic-container {
  border-radius: 8px;
  box-sizing: border-box;
  .el-card {
    width: 100%;
  }
  &:first-child {
    padding-top: 0;
  }
}
</style>
