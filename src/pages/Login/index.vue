<template>
  <div class="login-bag">
    <div class="login-wrap">
      <div class="header-content">
        <div class="header-logo">
          <h2 style="margin-left: 20px">{{ $store.getters.getConfigData('projectName') }}</h2>
          <h4>{{ $store.getters.getConfigData('subtitle') }}</h4>
          <span>Power By YOS</span>
        </div>
      </div>
      <div class="common-topbar-nav">
        <div class="all-nav">&#9776;</div>
        <ul class="common-topbar-nav-list">
          <li
              v-for="(item, i) in showSliderList"
              :key="'navItem' + i"
              :class="{active: item.dataName === activeName}"
              @click="chooseNav(item.dataName)"
              :style="{color: item.dataName === activeName ? item.color : '#fff'}"
          >
            {{ item.name }}
            <img v-if="item.recommend" src="@img/login/hot.png"/>
            <i :style="{'background': item.color}"></i>
          </li>
        </ul>
        <div class="btn-slider">
          <el-switch v-model="choosed" active-color="#25b1d4" inactive-color="#999"></el-switch>
        </div>
      </div>
      <div class="login-content">
        <div class="wrapper-login">
          <div class="slider-item">
            <div class="show-img">
              <div class="slider-find-class">
                <ul>
                  <li
                      v-for="(item, i) in activeSlider.children"
                      :key="'slider-item' + activeSlider.dataName + i"
                      v-show="activeItem === activeSlider.dataName + i"
                  >
                    <div
                        class="caption custom-fade"
                        v-html="item.html"
                        :style="{'--color': activeSlider.color}"
                    ></div>
                    <div class="slider-imgs custom-imgs">
                      <img :src="requireImg(item.imgPath, 'show-imgs1.png')"/>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="img-bars">
                <ul>
                  <li
                      class="bars-li lf"
                      v-for="(barItem, n) of activeSlider.children"
                      :key="'barItem' + activeName + n"
                      @click="chooseItem(n)"
                  >
                    <div class="cir" :class="{active: n === activeItemIndex && choosed}"></div>
                    <div
                        v-if="!choosed"
                        class="circleProgress_wrapper"
                        :class="{active: n === activeItemIndex && !choosed}"
                    >
                      <div class="wrapper right">
                        <div class="circleProgress rightcircle"></div>
                      </div>
                      <div class="wrapper left">
                        <div class="circleProgress leftcircle"></div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <LoginForm class="loginForm"/>
          <span class="versions" id="versions">版本:{{ $store.getters.getConfigData('version') }}</span>
        </div>
        <div class="index-box-container">
          <ul class="index-box-row">
            <li>
              <a>
                <img src="@img/login/index-world.png"/>
                <h2>速联万物</h2>
                <p>场库、路侧一站式接入</p>
              </a>
            </li>
            <li>
              <a>
                <img src="@img/login/index-cloud.png"/>
                <h2>数据中台</h2>
                <p>快速获取、提供服务</p>
              </a>
            </li>
            <li>
              <a>
                <img src="@img/login/blockchain.png"/>
                <h2>区块链应用</h2>
                <p>未缴账单分布式账本</p>
              </a>
            </li>
            <li>
              <a>
                <img src="@img/login/index-data.png"/>
                <h2>数据智能</h2>
                <p>提高企业工作效率</p>
              </a>
            </li>
            <li>
              <a>
                <img src="@img/login/index-service.png"/>
                <h2>运营管理</h2>
                <p>基于城市大脑智慧出行运营管理</p>
              </a>
            </li>
            <li>
              <a>
                <img src="@img/login/index-monitor.png"/>
                <h2>云边融合</h2>
                <p>云端、边缘计算端融合</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <footer class="footer">
        <p>© 2016-{{ thisYear }} Power By YOS</p>
      </footer>
    </div>
  </div>
</template>
<script>
import md5 from 'md5'
import LoginForm from '@compo/Login/LoginForm'

export default {
  components: {
    LoginForm
  },
  data: function () {
    return {
      // thisYear: new Date().getFullYear(),
      thisYear: 2021,
      showSliderList: [],
      activeName: '',
      activeSlider: {},
      activeItemIndex: 0,
      timer: null,
      choosed: false,
    }
  },
  watch: {
    choosed(value) {
      if (value) {
        this.timer && clearInterval(this.timer)
      } else {
        this.bannerStart()
      }
    }
  },
  computed: {
    activeItem() {
      return this.activeName + this.activeItemIndex
    }
  },
  created() {
    this.$store.dispatch('getLoginConfigData').then(res => {
      const firstShow = this.$store.getters.getFirstShow
      const showSliderList = this.$store.getters.getShowSliderList
      this.activeName = firstShow
      this.showSliderList = showSliderList
      this.activeSlider = this.showSliderList.find(x => x.dataName === firstShow)
      console.log(this.activeSlider);
      this.bannerStart()
    })
  },
  mounted() {
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
  },
  methods: {
    requireImg(src, def) {
      try {
        return require('@img/login/' + src)
      } catch (error) {
        return require('@img/login/' + def)
      }
    },
    chooseNav(dataName) {
      this.activeName = dataName
      this.activeSlider = this.showSliderList.find(x => x.dataName === dataName)
      this.activeItemIndex = 0
      this.choosed = false
      this.bannerStart()
    },
    chooseItem(index) {
      this.timer && clearInterval(this.timer)
      this.activeItemIndex = index
      this.choosed = true

    },
    bannerStart() {
      const count = this.activeSlider.children.length
      this.timer && clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (count - 1 > this.activeItemIndex) {
          this.activeItemIndex++
        } else {
          this.activeItemIndex = 0
        }
      }, 5000);
    },

  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/style/index.less';

@keyframes custom-fade {
  to {
    opacity: 1;
    top: 100px;
  }
}

@keyframes custom-imgs {
  to {
    opacity: 1;
    top: 50px;
  }
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}

.login-bag {
  width: 100vw;
  height: 100vh;
  min-width: 1200px;
  min-height: 706px;
  background-color: #2c2d35;
  overflow: hidden;
  position: relative;
}

.login-wrap {
  width: 100%;
  position: absolute;
  color: #fff;
  top: 50%;
  transform: translateY(-50%);

  .header-content {
    height: 64px;
    line-height: 32px;

    .header-logo {
      float: left;
      position: relative;
    }

    h2,
    h4 {
      display: inline-block;
      font-weight: 500;
      margin-bottom: 0;
      line-height: 60px;
      color: #fff;
      padding: 0 4px;
    }

    span {
      display: block;
      position: absolute;
      height: 20px;
      line-height: 20px;
      color: #fff;
      font-size: 12px;
      top: 4px;
      right: -90px;
    }
  }

  .common-topbar-nav {
    font-size: 14px;
    height: 60px;
    overflow: hidden;
    border-top: 1px solid #4d5359;
    border-bottom: 1px solid #4d5359;
    position: relative;

    .all-nav {
      float: left;
      height: 60px;
      line-height: 60px;
      padding: 0 20px;
      color: #fff;
      cursor: default;
      text-align: center;
      font-size: 20px;
    }

    ul {
      float: left;
      position: relative;

      li {
        float: left;
        height: 60px;
        line-height: 60px;
        padding: 0 16px;
        position: relative;
        color: #fff;
        cursor: pointer;
        text-transform: uppercase;
        transition: 0.2s;

        &:hover > i,
        &.active > i {
          width: 100%;
          left: 0;
        }

        i {
          position: absolute;
          transition: 0.3s;
          width: 0;
          left: 50%;
          bottom: 0;
          height: 5px;
        }

        img {
          position: absolute;
          top: 8px;
          right: 4px;
          width: 24px;
        }
      }
    }

    .btn-slider {
      position: absolute;
      right: 20px;
      top: 20px;

      /deep/ .el-switch .el-switch__core {
        width: 60px !important;
      }
    }
  }

  .login-content {
    height: 520px;

    .wrapper-login {
      width: 1140px;
      height: 420px;
      margin: 0 auto;
      position: relative;
      overflow: hidden;

      .slider-item {
        overflow: hidden;
        width: 740px;
        float: left;

        .show-img {
          width: 740px;
          height: 420px;
          position: relative;
        }
      }

      .slider-find-class {
        position: relative;

        span {
          color: #e43041;
        }

        ul li {
          margin: 0;
          padding: 0;
          position: relative;

          .caption {
            position: absolute;
            top: 155px;
            text-align: left;
            color: #fff;
            width: 360px;
            opacity: 0;

            &.custom-fade {
              animation: 1s forwards custom-fade;
            }

            /deep/ h2 {
              font-size: 26px !important;
              font-weight: 500;
            }

            /deep/ p {
              margin: 0;
              line-height: 24px;
              letter-spacing: 1px;
              color: #ddd;

              span {
                font-size: 16px;
                padding: 4px;
                color: var(--color);
              }
            }
          }

          .slider-imgs {
            position: absolute;
            top: 155px;
            right: 0px;
            width: 380px;
            opacity: 0;
            text-align: center;

            &.custom-imgs {
              animation: 1s forwards custom-imgs;
            }

            img {
              max-width: 100%;
            }
          }
        }
      }

      .img-bars {
        position: absolute;
        bottom: 25px;
        left: 50%;
        transform: translate(-50%, 0);

        ul {
          width: 100%;
          margin: 0 auto;

          li {
            display: inline-block;
            width: 35px;
            cursor: pointer;
            position: relative;
            @borderColor1: #666;
            @borderColor2: #fff;
            @size: 16px;

            .cir {
              width: @size;
              height: @size;
              border-radius: 50%;
              box-sizing: border-box;
              overflow: hidden;
              position: relative;
              border: 1px solid @borderColor1;

              &.active {
                border-color: @borderColor2;
              }
            }

            .circleProgress_wrapper {
              width: @size;
              height: @size;
              position: absolute;
              top: 0;
              left: 0;

              .wrapper {
                width: @size / 2;
                height: @size;
                position: absolute;
                top: 0;
                overflow: hidden;
              }

              .right {
                right: 0;
              }

              .left {
                left: 0;
              }

              .circleProgress {
                width: @size;
                height: @size;
                border-radius: 50%;
                position: absolute;
                top: 0;
                transform: rotate(-135deg);
                z-index: 100;
              }

              .rightcircle {
                border-top: 1px solid @borderColor2;
                border-right: 1px solid @borderColor2;
                right: 0;
              }

              .leftcircle {
                border-bottom: 1px solid @borderColor2;
                border-left: 1px solid @borderColor2;
                left: 0;
              }

              &.active .rightcircle {
                animation: circleProgressLoad_right 5s linear;
              }

              &.active .leftcircle {
                animation: circleProgressLoad_left 5s linear;
              }

              @keyframes circleProgressLoad_right {
                0% {
                  transform: rotate(-135deg);
                }
                50%,
                100% {
                  transform: rotate(45deg);
                }
              }

              @keyframes circleProgressLoad_left {
                0%,
                50% {
                  transform: rotate(-135deg);
                }
                100% {
                  transform: rotate(45deg);
                }
              }
            }
          }
        }
      }

      .versions {
        border: 1px solid #eee;
        text-align: center;
        padding: 0 15px;
        display: inline-block;
        position: absolute;
        bottom: 30px;
        left: 0;
        line-height: 20px;
        border-radius: 15px;
        font-size: 12px;
        color: #fff;
      }
    }

    .index-box-container {
      position: absolute;
      height: 100px;
      width: 100%;
      z-index: 100;
      background-color: rgba(255, 255, 255, 0.2);

      .index-box-row {
        margin: auto;
        max-width: 1349px;
        transition: opacity 0.3s 0.6s, visibility 0s 0.6s, margin-top 0s 0.6s;
        overflow: hidden;
        display: flex;

        li {
          flex: 1;

          &:not(:first-child) a {
            border-left: 1px solid #727577;
          }

          a {
            height: 100px;
            position: relative;
            display: block;
            padding: 28px 0 28px 68px;
            transition: all 0.3s;
            border-color: rgba(255, 255, 255, 0.06);

            img {
              position: absolute;
              left: 20px;
              top: 34px;
              width: 32px;
              -webkit-filter: grayscale(100%);
              -moz-filter: grayscale(100%);
              -ms-filter: grayscale(100%);
              filter: grayscale(100%);
            }

            h2 {
              color: #fff;
              font-weight: bolder;
              height: 18px;
              font-size: 16px;
              margin-bottom: 4px;
              margin-top: 0;
              line-height: normal;
              text-align: left;
            }

            p {
              color: #fff;
              font-size: 12px;
              line-height: 20px;
              text-align: left;
            }
          }
        }
      }
    }
  }

  .footer p {
    line-height: 35px;
    width: 90%;
    margin: 0 auto;
    color: #888;
    text-align: center;
  }

  .loginForm {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
}
</style>
