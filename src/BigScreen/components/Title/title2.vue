<template>
  <div class="g-title2">
    <div class="diamond"></div>
    <div class="text">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="less">
.g-title2 {
  padding: 0 8px;
  height: 30px;
  display: flex;
  align-items: center;
  user-select: none;
  .diamond {
    @size: 8px;
    width: @size;
    height: @size;
    position: relative;
    &::after {
      display: block;
      content: '';
      width: 100%;
      height: 100%;
      background: #3dddff;
      position: absolute;
      left: 0;
      top: 0;
      transform: rotate(45deg);
      box-shadow: 0 0 10px #9dd8f9;
    }
    transform: scaleY(1.3);
  }
  .text {
    margin-left: 8px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    font-weight: 600;
    color: #3dddff;
  }
}
</style>
