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
  background: #fff;
  padding: 24px 24px 40px 24px;
  min-height: 78vh;
  .el-card {
    border-radius: 8px;
    width: 100%;
  }
  // &:first-child {
  //   padding-top: 0;
  // }
}
</style>
