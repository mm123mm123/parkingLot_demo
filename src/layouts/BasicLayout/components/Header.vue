<template>
  <div class="Header">
    <div class="logo">
      <img v-if="logoLargeUrl" :src="logoLargeUrl" />
      <div v-else>{{$store.getters.getTemplateTitle | StringStr(28)}}</div>
    </div>
    <div class="center"></div>
    <div class="right">
      <div class="time">{{currentTime}}</div>
      <div class="user">
        <Icons type="el-icon-user" />
        <!-- <span>{{userId | StringStr(10)}}</span> -->
        <span>{{userId}}</span>
      </div>
      <div class="exit">
        <el-dropdown placement="bottom" trigger="click" @command="handleUser">
          <div class="icon">
            <Icons type="icon-kaiqi" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
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
      messageList: [],
      msgList: [],
      timer: null,
      currentTime: '',
    }
  },
  computed: {
    userId () {
      return this.$store.state.self.selfInfo.id
    }
  },
  methods: {
    handleUser (item) {
      if (item === 'logout') {
        this.logout()
      }
    },
    logout () {
      this.$store.dispatch('loginOut')
    },
    getDate () {
      let weeks = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六')

      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      let date = now.getDate()
      let hour = now.getHours()
      hour = hour < 10 ? '0' + hour : hour
      let minute = now.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      let day = now.getDay()
      var week = weeks[day]
      return `${year}年${month}月${date}日 ${hour}:${minute} ${week}`
    }
  },
  watch: {
  },
  created () {
    this.routePath = this.$route.path

    this.currentTime = this.getDate()
    this.timer && clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.currentTime = this.getDate()
    }, 1000)
  },
  mounted () {
  },
  beforeDestroy () {
    this.timer && clearInterval(this.timer)
  }
}
</script>
<style scoped lang="less">
@import '~@/assets/style/index.less';

.Header,
.right,
.user {
  display: flex;
  align-items: center;
}

.Header {
  height: 56px;
  width: 100%;
  position: relative;
  z-index: 100;
  overflow: hidden;
  background: #1f293d;
  color: #fff;
  display: grid;
  grid-template-columns: 200px 1fr auto;
  .logo {
    text-align: center;
  }
  .right {
    display: grid;
    grid-column-gap: 12px;
    grid-template-columns: 200px 1fr 36px;
  }
  .user {
    overflow: hidden;
    i {
      font-size: 24px;
    }
    span {
      padding-left: 6px;
    }
  }
  .exit {
    i {
      font-size: 24px;
      cursor: pointer;
      color: #fff;
    }
    i:hover {
      color: @light-blue;
    }
    i:active {
      color: @blue;
    }
  }
}
</style>
