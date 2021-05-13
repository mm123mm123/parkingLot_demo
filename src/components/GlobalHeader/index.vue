<template>
  <div class="GlobalHeader">
  </div>
</template>

<script>
export default {
  props: {
    logoLargeUrl: {
      type: String
    },
    top_bar: {
      type: Array
    }
  },
  data () {
    return {
      routePath: '',
      messageList: []
    }
  },
  computed: {
    userId () {
      return this.$store.state.self.selfInfo.id
    }
  },
  methods: {
  },
  watch: {
    $route (to) {
      const path = to.path
      this.routePath = path
    }
  },
  created () {
    this.routePath = this.$route.path
  },
  mounted () {
  }
}
</script>
<style scoped lang="less">
@import '~@/assets/style/base.less';

@text-active: #2cc9fd; // 文字active颜色
@icon-active-bgColor: rgba(255, 255, 255, 0.2); // 图标active背景

.GlobalHeader,
.logo,
.top-bar {
  display: flex;
}
.GlobalHeader {
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 100;
  overflow: hidden;
  color: #fff;
}
</style>
