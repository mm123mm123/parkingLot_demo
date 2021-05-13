<template>
  <div class="g-line1">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right">
      <div class="item" v-for="(item, i) in 4" :key="'line_item'+i"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.g-line1 {
  width: 100%;
  height: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    width: 110px;
    height: 4px;
    background: linear-gradient(0deg, #62fbff 0%, #3dddff 100%);
  }
  .center {
    flex: 1;
    margin: 0 9px;
    height: 4px;
    background: #16314e;
  }
  .right {
    width: 64px;
    display: flex;
    justify-content: space-between;
    .item {
      width: 13px;
      height: 8px;
      transform: skewX(20deg);
      &:nth-child(2n + 1) {
        background: linear-gradient(90deg, #3dddff 0%, #ffffff 100%);
      }
      &:nth-child(2n) {
        background: linear-gradient(-90deg, #3dddff 0%, #ffffff 100%);
      }
    }
  }
}
</style>
