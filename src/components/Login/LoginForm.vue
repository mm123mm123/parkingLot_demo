<template>
  <div class="ms-login">
    <p>账户密码登录</p>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
      <el-form-item prop="username">
        <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
            type="password"
            placeholder="请输入密码"
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
        ></el-input>
      </el-form-item>
      <el-checkbox v-model="remember" style="padding-bottom: 12px">记住密码</el-checkbox>
      <div class="login-btn">
        <GLoading v-if="loading" background="rgba(0, 0, 0, 0.8)"/>
        <!-- <div
        class="login-btn"
        v-loading="loading"
        element-loading-spinner="el-icon-loading"
        element-loading-text="登录中"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        >-->
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import md5 from 'md5'

export default {
  name: 'loginForm',
  data: function () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      remember: true,
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}]
      },
      loading: false
    }
  },
  created() {
  },
  mounted() {
    this.ruleForm = {
      username: localStorage.getItem('username'),
      password: localStorage.getItem('password')
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
              .dispatch('login', {
                user: this.ruleForm.username,
                pass: md5(this.ruleForm.password)
              })
              .then((res) => {
                if (res.code === 1000) {
                  if (this.remember) {
                    localStorage.setItem('username', this.ruleForm.username)
                    localStorage.setItem('password', this.ruleForm.password)
                  }

                  this.$store.dispatch('getUiTemplate').then((res) => {
                    const {templateTypes, outsideUrl} = this.$store.getters.getConfigData()
                    const type = this.$store.getters.getTemplateType

                    let path
                    let top_bar = this.$store.getters.getTemplateTopBar
                    if (!path && top_bar.length) {
                      for (const item of top_bar) {
                        if (item.route) {
                          path = item.route
                          break
                        }
                      }
                    }

                    let side_menu = this.$store.getters.getTemplateSideMenu.map(x => x.menu || []).flat()
                    if (!path && side_menu.length) {
                      for (const item of side_menu) {
                        if (item.route) {
                          path = item.route
                          break
                        }
                      }
                    }

                    if (templateTypes.includes(type)) {
                      this.$router.push(path || '/')           //目前path为/bigScreen/parking/index’，最终通过这里路由推到大屏
                    } else {
                      const token = this.$store.getters.getToken
                      const redirectUrl = `${outsideUrl[type]}${path}?id=${token}`
                      // alert(redirectUrl)
                      window.location.href = redirectUrl
                    }
                  })
                }
                this.loading = false
              })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/style/index.less';

.ms-login {
  width: 330px;
  height: 384px;
  padding: 36px;
  background: url('~@/assets/img/login/login.png');
  border-radius: 10px;
  color: #fff;

  p {
    font-size: 24px;
    text-align: center;
    height: 48px;
    line-height: 48px;
  }

  .ms-content {
    padding: 24px 0;

    .el-form-item {
      margin-bottom: 18px;
    }

    .el-input {
      /deep/ .el-input__inner {
        background: transparent;
        height: 50px;
        color: #fff;
        border: 1px solid #eee;
      }
    }

    .el-checkbox {
      @color: #2ce9ff;

      /deep/ .el-checkbox__input {
        .el-checkbox__inner {
          background-color: #fff;
          border-color: @color;
        }

        &.is-checked {
          .el-checkbox__inner {
            background-color: @color;
          }
        }
      }

      /deep/ .el-checkbox__label {
        color: @color;
      }
    }
  }

  .login-btn {
    position: relative;

    .el-button {
      width: 100%;
      height: 50px;
      font-size: 18px;
      background: #2ce9ff;
      color: #fff;
    }
  }
}
</style>
