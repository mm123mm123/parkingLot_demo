<template>
  <div class="g-line2">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right"></div>
  </div>
</template>

<style scoped lang="less">
.g-line2 {
  width: 100%;
  height: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    width: 110px;
  }
  .center {
    flex: 1;
    margin: 0 9px;
    height: 4px;
    background: #16314e;
  }
  .right {
    width: 150px;
    position: relative;
    &::after {
      display: block;
      content: '';
      width: 90%;
      height: 1px;
      position: absolute;
      top: -5px;
      right: 5px;
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
  .left,
  .right {
    height: 4px;
    background: linear-gradient(0deg, #62fbff 0%, #3dddff 100%);
  }
}
</style>
