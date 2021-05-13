<template>
  <div class="g-line3">
    <div class="left" :style="{width: (width || 120) + 'px'}"></div>
    <div class="center"></div>
    <div class="right"></div>
  </div>
</template>

<script>
export default {
  name: 'gLine3',
  props: {
    width: {
      type: Number,
      default: 120
    },
  }
}
</script>

<style scoped lang="less">
.g-line3 {
  width: 100%;
  height: 8px;
  display: flex;
  justify-content: space-between;

  .left {
    width: 120px;
    height: 2px;
    background: #3dddff;
  }
  .center {
    width: 15px;
  }
  .right {
    flex: 1;
    height: 2px;
    background-image: linear-gradient(
      to right,
      #3dddff 0%,
      #3dddff 80%,
      transparent 50%
    );
    background-size: 10px 1px;
    background-repeat: repeat-x;
  }
}
</style>
