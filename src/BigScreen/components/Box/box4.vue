<template>
  <div class="g-box4">
    <div class="bg">
      <div class="bg2"></div>
    </div>
    <div class="box-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="less">
@border-color: #61d8fa;
@border-size: 1px;
@clip-size: @border-size * 10;
@bg-size: @clip-size / 2 + @border-size;
.g-box4 {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.01);
  box-shadow: 0px 0px 25px 0px rgba(68, 243, 254, 0.33) inset;
  border: @border-size solid rgba(68, 243, 254, 0.33);
  clip-path: polygon(
    0 0,
    calc(100% - @clip-size) 0,
    100% @clip-size,
    100% 100%,
    0 100%
  );
  background: linear-gradient(-135deg, @border-color @bg-size, transparent 0)
    top right;
  background-size: 50% 50%;
  background-repeat: no-repeat;

  .bg,
  .bg2 {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    min-height: 20px;
    overflow: hidden;
  }
  .bg::before,
  .bg::after,
  .bg2::after {
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    border: 3px solid transparent;
  }
  .bg {
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
  .bg::after {
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
