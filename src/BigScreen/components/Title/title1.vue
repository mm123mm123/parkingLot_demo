<template>
  <div class="g-title1">
    <img src="@v_img/Title/title1.png" />
    <div class="text">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="less">
.g-title1 {
  padding: 0 12px;
  height: 30px;
  display: flex;
  align-items: center;
  user-select: none;
  .text {
    margin-left: 18px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    font-weight: 600;
    text-shadow: 0 0 15px #9dd8f9;
    background: linear-gradient(0deg, #9dd8f9 0%, #dff3fe 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
