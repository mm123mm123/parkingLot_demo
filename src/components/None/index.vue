<template>
<div class="none">
  <div class="image-slot">
    <img v-if="type === 'message'" style="width: 150px" src="@img/none/none2.png">
    <img v-else-if="type === 'pic'" src="@img/none/none3.png">
    <img v-else style="width: 180px" src="@img/none/none1.png">
    <p v-if="text" style="margin-top: -5px">{{text}}</p>
  </div>
</div>
</template>

<script>
export default {
  name: 'None',
  props: ['type', 'text'],
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
  .none {
    width: 100%;
    line-height: inherit;
    text-align: center;
    color: #cfd0d5;
    img {
      width: 50px;
      display: inline-block;
      height: auto;
    }
  }
</style>
