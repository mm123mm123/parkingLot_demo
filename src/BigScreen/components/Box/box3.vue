<template>
  <div class="g-box3">
    <div class="box-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="less">
@border-color: #44f3fe;
@border-size: 0px;
.g-box3 {
  position: relative;
  width: 104px;
  height: 40px;
  background: url('~@v_img/Box/box1.png');
  background-size: 100% 100%;
  .box-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
