<template>
  <div class="module">
    <slot name="title"></slot>
    <slot name="line"></slot>
    <slot name="body"></slot>
  </div>
</template>

<script>
export default {
  directives: {
    title: {
      inserted: el => {
        console.log(el);

        el.innerHTML = '123'
      }
    }
  },
  data () {
    return {

    }
  },
  methods: {

  },
  created () {

  },
  mounted () {

  }
}
</script>
<style scoped lang="less">
.module {
  width: 480px;
  & > div:not(:first-child) {
    margin-top: 4px;
  }
}
</style>
