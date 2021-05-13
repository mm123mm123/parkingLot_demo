<template>
  <div class="g-box2">
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
@border-size: 0px;
.g-box2 {
  position: relative;
  width: 100%;
  // background: rgba(33, 193, 255, 0.15);
  background: rgba(0, 0, 0, 0.01);
  border: 1px solid rgba(68, 243, 254, 0.33);
  box-shadow: 0px 0px 25px 0px rgba(68, 243, 254, 0.33) inset;
  .bg,
  .bg2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 20px;
    height: 100%;
    overflow: hidden;
    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: @border-size;
      height: @border-size;
      border: 3px solid transparent;
    }
  }
  .bg,
  .bg2 {
    &::before {
      top: 0;
      border-top-color: @border-color;
    }
  }
  .bg,
  .bg2 {
    &::after {
      bottom: 0;
      border-bottom-color: @border-color;
    }
  }
  .bg::before,
  .bg2::after {
    left: 0;
    border-left-color: @border-color;
  }
  .bg::after,
  .bg2::before {
    right: 0;
    border-right-color: @border-color;
  }
  .box-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
