<template>
  <div class="bigScreen-header">
    <div class="left">
      <div class="time" v-html="currentTime"></div>
    </div>
    <div class="title">{{title}}</div>
    <div class="right">
      <div class="user">
        <Icons type="icon-yonghu" color="#3DDDFF" :size="32" />
        <span>{{$store.state.self.selfInfo.id | StringStr(10)}}</span>
      </div>
      <div class="exit">
        <Icons type="icon-tuichu" color="#3DDDFF" :size="32" @click="$store.dispatch('loginOut')" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentTime: '',
    }
  },
  computed: {
    title () {
      return this.$store.getters.getPageTitle
    }
  },
  methods: {

    getDate () {
      let weeks = new Array('日', '一', '二', '三', '四', '五', '六')

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
      return `${year}-${month}-${date}  ${hour}:${minute}    周${week}`.replace(new RegExp(/( )/g), '&nbsp')
    }
  },
  beforeCreate () {
    // this.$store.commit('setPageTitle', '停车管理')
  },
  created () {
    this.currentTime = this.getDate()
    this.timer && clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.currentTime = this.getDate()
    }, 1000)

  },
  mounted () {
  }
}
</script>
<style scoped lang="less">
.bigScreen-header {
  background: url('~@v_Parking_img/header.png');
  background-size: 100% 100%;
  height: 100%;
  position: relative;
  padding: 0 36px;
  display: flex;
  justify-content: space-between;
  .left,
  .right {
    display: flex;
    width: 250px;
    height: 46px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #44f3fe;
  }
  .left {
    align-items: flex-end;
  }
  .title {
    font-size: 36px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #44c4ff;
    letter-spacing: 8px;
    display: flex;
    align-items: center;
    text-shadow: 0px 11px 15px rgba(97, 234, 243, 0.3);
  }
  .right {
    justify-content: space-around;
    .user {
      display: flex;
      align-items: center;
      span {
        padding-left: 8px;
      }
    }
    .exit {
      cursor: pointer;
    }
  }
}
</style>
