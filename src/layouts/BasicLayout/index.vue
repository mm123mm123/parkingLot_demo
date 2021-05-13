<template>
  <el-container style="height: 100%;">
    <el-container>
      <el-header :height="'56px'">
        <Header />
      </el-header>
      <el-container style="overflow: auto">
        <el-aside width="auto">
          <SideMenu />
        </el-aside>
        <el-main>
          <!-- <div v-if="showBreadcrumb">
          <el-breadcrumb
            v-if="route.name"
            separator-class="el-icon-arrow-right"
            style="padding-bottom: 20px;"
          >
            <el-breadcrumb-item :to="{ path: route.path }" v-if="route.name">{{route.name}}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.subName">{{route.subName}}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.itemName">{{route.itemName}}</el-breadcrumb-item>
          </el-breadcrumb>
          </div>-->
          <div style="width: 100%; height: 100%;">
            <transition name="fade">
              <router-view />
            </transition>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>

import Header from './components/Header'
import SideMenu from './components/SideMenu'
export default {
  name: 'index',
  components: {
    Header, SideMenu
  },
  data () {
    return {
      routePath: '',
      hasSideMenu: false,
      logoLargeUrl: '',
      side_menu: [],
      fullSreen: true
    }
  },
  async beforeCreate () {
    this.$store.dispatch('fetchSelfInfo')
    this.$store.dispatch('fetchUserPermissionTree')
    this.$store.dispatch('getUiTemplate').then(res => {
      this.logoLargeUrl = this.$store.state.template.logoLargeUrl
      this.side_menu = this.$store.getters.getTemplateSideMenu
    })
  },
  async created () {
  },
  mounted () {
    let env = process.env.NODE_ENV
    let envType = process.env.VUE_APP_TYPE
  },
  methods: {
    changeSreen () {
      this.fullSreen = !this.fullSreen
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/base.less';

.el-header {
  padding: 0 0;
  transition: all 0.4s;
  overflow: hidden;
  &.hidden {
    height: 0 !important;
  }
}

.el-main {
  background: @backgroundColor;
  // min-width: 1200px;
  display: flex;
  padding: 0;
  position: relative;
}
.fade-enter-active {
  transition: all 0.3s ease;
  transition-delay: 0.4s;
}
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter {
  transform: scale(0.5);
  opacity: 0;
}
.fade-leave-to {
  transform: scale(0.5);
  opacity: 0;
}
</style>
