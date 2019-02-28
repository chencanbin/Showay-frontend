<template>
  <span>
    <span :class="type" class="badge-status-dot badge-status-processing"/>
    <span v-if="text" class="badge-status-text">{{ text }}</span>
  </span>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    type: {
      type: String,
      default: 'default-badge'
    },
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
  @-webkit-keyframes statusProcessing {
    0% {
      -webkit-transform:scale(.8);
      transform:scale(.8);
      opacity:.5
    }
    to {
      -webkit-transform:scale(2.4);
      transform:scale(2.4);
      opacity:0
    }
  }
  @keyframes statusProcessing {
    0% {
      -webkit-transform:scale(.8);
      transform:scale(.8);
      opacity:.5
    }
    to {
      -webkit-transform:scale(2.4);
      transform:scale(2.4);
      opacity:0
    }
  }

  .processing-badge {
    background-color: #409EFF;
    &:after {
      border: 1px solid #409EFF;
    }
  }
  .error-badge {
    background-color: #F56C6C;
    &:after {
      border: 1px solid #F56C6C;
    }
  }
  .warning-badge {
    background-color: #E6A23C;
    &:after {
      border: 1px solid #E6A23C;
    }
  }
  .default-badge {
    background-color: #909399;
    &:after {
      border: 1px solid #909399;
    }
  }
  .success-badge {
    background-color: #67C23A;
    &:after {
      border: 1px solid #67C23A;
    }
  }
  .badge-status-processing {
    position: relative;
  }
  .badge-status-dot {
    width: 6px;
    height: 6px;
    display: inline-block;
    border-radius: 50%;
    vertical-align: middle;
    top: -1px;
  }
  .badge-status-processing:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    content: '';
    -webkit-animation: statusProcessing 1.2s infinite ease-in-out;
    animation: statusProcessing 1.2s infinite ease-in-out;
  }
  .badge-status-text {
    color: #000;
    font-size: 14px;
    margin-left: 8px;
  }
</style>
