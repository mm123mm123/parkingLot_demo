<template>
  <div class="layout">
    <div class="header">
      <Header />
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from '@v_Parking_compo/Header'

export default {
  components: {
    Header
  },
  data () {
    return {

    }
  },
  methods: {

  },
  async beforeCreate () {
    this.$store.dispatch('fetchSelfInfo')
    this.$store.dispatch('getUiTemplate')
  },
  created () {

  },
  mounted () {

  }
}
</script>
<style scoped lang="less">
.layout {
  height: 100%;
  user-select: none;
  .header {
    height: 83px;
    width: 1140px;
    margin: 0 auto;
    position: relative;
    z-index: 1000;
  }
  .content {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    
  }
}
</style>
