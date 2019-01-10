<template>
  <div class="basic-container">
    <el-card>
      <slot/>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BasicContainer'
}
</script>

<style lang="scss">
.basic-container {
  padding: 8px 10px;
  border-radius: 10px;
  box-sizing: border-box;
  .el-card {
    width: 100%;
  }
  &:first-child {
    padding-top: 0;
  }
}
</style>
