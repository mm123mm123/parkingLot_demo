<template>
  <div class="g-side">
    <div class="g-side-menu">
      <el-menu
        :router="true"
        :collapse="collapse"
        class="el-menu-vertical-demo"
        :collapse-transition="true"
        @open="handleOpen"
        background-color="#1F293D"
        text-color="#fff"
        active-text-color="#3FB1E3"
        :default-active="activeRoute"
      >
        <el-submenu :index="'menu' + index" v-for="(item, index) in list" :key="'menu' + index">
          <template slot="title">
            <Icons class="icon" :type="item.icon" color="#fff" :size="20" />
            <span>{{item.name}}</span>
          </template>
          <el-menu-item-group>
            <div :key="'subMenu' + subIndex" v-for="(subItem, subIndex) in item.children">
              <el-submenu
                :index="'subItem'+subIndex"
                v-if="subItem.children && subItem.children.length"
              >
                <template
                  slot="title"
                  :disabled="!subItem.route"
                  :index="subItem.route"
                  :route="subItem.route"
                  @click="handleClick(subItem)"
                >{{subItem.name}}</template>
              </el-submenu>
              <el-menu-item
                v-else
                :disabled="!subItem.route"
                :index="subItem.route"
                :route="subItem.route"
                @click="handleClick(subItem)"
              >{{subItem.name}}</el-menu-item>
            </div>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>

      <Icons
        class="menuIcon"
        :type="collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
        color="#fff"
        :size="24"
        @click="collapse = !collapse"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideMenu',
  data () {
    return {
      collapse: false,
      activeRoute: '',
    }
  },
  watch: {
    $route (to) {
      const path = to.path
      this.activeRoute = path
    }
  },
  computed: {
    list () {
      let list = this.$store.getters.getTemplateSideMenu.map(x => {
        const { icon, name, menu: children } = x
        return { icon, name, children }
      })
      return list
    }
  },
  methods: {
    handleOpen (key, keyPath) {
    },
    handleClick () {
      // this.collapse = true
    },
  },
  created () {
    this.activeRoute = this.$route.path
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.g-side {
  border-top: 1px solid #eee;
  background-color: #1f293d;
  height: 100%;
  box-shadow: 3px 0px 5px rgba(0, 0, 0, 0.1);

  &-menu {
    height: calc(100% - 125px);
    overflow-y: scroll;
    .icon {
      padding-right: 10px;
    }
    .menuIcon {
      position: absolute;
      text-align: center;
      left: 21px;
      bottom: 25px;
      cursor: pointer;
    }
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
/deep/ .el-menu {
  border-right: none;
}
/deep/ .el-menu-item-group__title {
  padding: 0 0;
}
/*滚动条样式*/
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: transparent;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background: #252525;
  border-radius: 4px;
}
::-webkit-scrollbar-button:start {
  background-color: transparent;
  background-size: 6px 6px;
}
::-webkit-scrollbar-button:end {
  background-color: transparent;
  background-size: 6px 6px;
}
</style>
