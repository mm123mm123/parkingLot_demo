<template>
  <div class="g-box1">
    <div class="bg">
      <div class="bg2"></div>
    </div>
    <div class="box-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="less">
@border-color: #44f3fe;
@border-size: 12px;
.g-box1 {
  position: relative;
  width: 100%;
  height: 100%;
  // background: rgba(33, 193, 255, 0.15);
  background: rgba(0, 0, 0, 0.01);
  border: 1px solid rgba(68, 243, 254, 0.33);
  box-shadow: 0px 0px 25px 0px rgba(68, 243, 254, 0.33) inset;
  .bg,
  .bg2 {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    min-height: 50px;
    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: @border-size;
      height: @border-size;
    }
  }
  .bg,
  .bg2 {
    &::before {
      left: 0;
      border-left: 1px solid @border-color;
    }
  }
  .bg,
  .bg2 {
    &::after {
      right: 0;
      border-right: 1px solid @border-color;
    }
  }
  .bg::before,
  .bg2::after {
    top: 0;
    border-top: 1px solid @border-color;
  }
  .bg::after,
  .bg2::before {
    bottom: 0;
    border-bottom: 1px solid @border-color;
  }
  .box-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
