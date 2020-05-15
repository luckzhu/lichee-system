<template>
  <el-dialog
    title="您已超时登录"
    :visible.sync="visible"
    :show-close="false"
    width="500px"
  >
    <el-form
      ref="loginForm"
      :model="loginForm"
      label-width="80px"
      :rules="loginRules"
    >
      <el-form-item prop="username" label="账号">
        <el-input v-model="loginForm.username" placeholder="账号" />
      </el-form-item>

      <el-form-item prop="password" label="密码">
        <el-input v-model="loginForm.password" type="password" placeholder="密码" />
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin:20px auto 20px auto;" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {},
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    visible() {
      return this.$store.state.user.loginVisable
    }
  },
  mounted() {

  },

  methods: {
    handleLogin() {
      var $this = this
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then((res) => {
              this.loading = false
              $this.$message({
                message: '登录成功，请重新操作',
                type: 'success'
              })
              $this.$store.commit('user/SET_LoginDialog', false)
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
