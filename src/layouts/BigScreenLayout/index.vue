<template>
  <div class="page">
    <div class="blackLayout" id="screen">
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import * as screenfull from '@/utils/screenFull'
import initScreen from '@/utils/bigScreen'
export default {
  name: 'index',
  components: {
  },
  data () {
    return {
      compoList: []
    }
  },
  methods: {
  },
  mounted () {
    screenfull.full()
    const { width, height } = this.$store.getters.getPageSize
    initScreen(width, height, 'screen')
  },
  watch: {
  },
}
</script>

<style scoped lang="less">
.page {
  width: 100%;
  height: 100%;
  background: #000;
  color: #fff;
  font-size: 16px;
  .blackLayout {
    width: 100%;
    height: 100%;
    position: relative;
    .content {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
