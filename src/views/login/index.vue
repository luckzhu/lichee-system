<template>
  <div class="login-container">
    <div class="title-container">
      <h3 class="title">广东荔枝区域公用品牌管理系统</h3>
    </div>

    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="phone-login">
        <span @click="switchPhoneLogin">{{ isPhoneLogin ? '账号密码登录' : '手机短信快捷登录' }}</span>
      </div>

      <!-- 手机验证码登录 -->
      <template v-if="isPhoneLogin">
        <el-form-item prop="phone">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="phone"
            v-model="loginForm.phone"
            placeholder="手机号"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="code">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            v-model="loginForm.code"
            placeholder="请输入6位数验证码"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="getLoginMsg">
            <el-button :disabled="msgCoolDown">
              <span v-if="msgCoolDown" class="count">{{ count }}s 后重发</span>
              <span v-else>发送验证码</span>
            </el-button>
          </span>
        </el-form-item>
      </template>

      <template v-else>
        <el-form-item prop="account">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="account"
            v-model="loginForm.account"
            placeholder="信用代码"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </template>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登 录</el-button>

      <div class="tips">
        <router-link to="/signup">
          <span>没有账号？立即注册</span>
        </router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getMsg } from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  data() {
    const phone = (rule, value, callback) => {
      const mobileReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (value !== '' && !mobileReg.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    const code = (rule, value, callback) => {
      var codeReg = new RegExp('^[0-9]{6}$')
      if (value !== '' && !codeReg.test(value)) {
        callback(new Error('请输入6位数字验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        account: 'mtp6300138',
        password: 'mtp6300138',
        phone: '18110294220',
        code: ''
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }],
        phone: [
          { required: true, trigger: 'blur' },
          { validator: phone, trigger: 'blur' }
        ],
        code: [
          { required: true, trigger: 'blur' },
          { validator: code, trigger: 'blur' }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      isPhoneLogin: true,
      msgCoolDown: false,
      timer: null,
      count: 30
    }
  },
  computed: {
    ...mapGetters(['device'])
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    if (this.device === 'desktop') {
      this.isPhoneLogin = false
    } else {
      this.isPhoneLogin = true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isPhoneLogin) {
            this.phoneLogin()
          } else {
            this.$store
              .dispatch('user/login', this.loginForm)
              .then(res => {
                this.$router.push({ path: this.redirect || '/lichee/monitor' })
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    phoneLogin() {
      this.$store
        .dispatch('user/phonelogin', this.loginForm)
        .then(res => {
          // 202跳转到旧系统
          if (res.code === 202) {
            window.location.href = `http://gdmpxt.org/${res.data.info.forwardUrl}`
          } else {
            this.$router.push({ path: this.redirect || '/' })
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    switchPhoneLogin() {
      this.isPhoneLogin = !this.isPhoneLogin
    },
    getLoginMsg() {
      if (this.timer) return
      this.$refs.loginForm.validateField('phone', valid => {
        if (!valid) {
          getMsg({ account: this.loginForm.account }).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '短信发送成功'
              })
              this.timeCount()
            }
          })
        }
      })
    },
    timeCount() {
      const TIME_COUNT = 30
      if (!this.timer) {
        this.msgCoolDown = true
        this.count = TIME_COUNT
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.msgCoolDown = false
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #292926;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url("../../assets/loginBg.png");
  display: flex;
  // justify-content: center;
  padding-top: 140px;
  align-items: center;
  flex-direction: column;

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  overflow: hidden;
  .phone-login {
    font-size: 14px;
    width: 100%;
    text-align: right;
    margin-bottom: 10px;
    color: #b33038;
    span {
      cursor: pointer;
    }
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;

    margin: 0 auto;
    overflow: hidden;
  }

  @media screen and (max-width: 778px) {
    .login-form {
      width: 80%;
    }
  }

  .tips {
    font-size: 14px;
    color: #292926;
    margin-bottom: 10px;
    text-align: right;
    // span {
    //   &:first-of-type {
    //     margin-right: 16px;
    //   }
    // }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 60px;
      letter-spacing: 4px;
      color: #b33038;
      text-align: center;
      font-weight: bold;
      white-space: nowrap;
    }
  }

  @media screen and (max-width: 778px) {
    .title-container {
      .title {
        font-size: 40px;
        white-space: pre-wrap;
      }
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
