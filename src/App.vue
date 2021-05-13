<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style lang="less">
@import '~@/assets/style/index.less';

html, body {
  margin: 0;
  height: 100%;
  color: #333;
  font-size: 14px;
  font-weight: 400;
  box-sizing: border-box;
  background-color: #edf2f5;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
}

*, *::before, *::after {
  box-sizing: inherit;
}

ul, li, h1, h2, h3, h4, h5, h6 {
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
  background: @backgroundColor;
}

ul, ol {
  list-style: none;
}

a {
  text-decoration: none;
}

p {
  margin: 0;
}

.BMap_cpyCtrl {
  display: none;
}
.anchorBL {
  display: none;
}
</style>
