<template>
  <div class="register">
    <!-- <div class="title">
      <p>广东荔枝系统</p>
      <p>用户注册</p>
    </div>-->
    <div class="form">
      <ele-form
        v-model="formData"
        :form-desc="formDesc"
        :request-fn="handleSubmit"
        :rules="rules"
        label-position="left"
        :is-show-back-btn="false"
        :is-show-cancel-btn="false"
        submit-btn-text="注册"
        @request-success="handleSuccess"
      />
      <div class="tips">
        <router-link to="/login">
          <span>已有账号？立即登录</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import EleForm from 'vue-ele-form'
export default {
  components: {
    EleForm
  },
  data() {
    const validateRePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const phone = (rule, value, callback) => {
      const mobileReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (value !== '' && !mobileReg.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }

    return {
      // 表单数据
      formData: {},
      formDesc: {
        unitName: {
          type: 'input',
          label: '企业名称',
          required: true // 必填简写
        },
        orgCode: {
          type: 'input',
          label: '统一社会信用代码',
          required: true // 必填简写
        },
        account: {
          type: 'input',
          label: '用户名',
          required: true
        },
        password: {
          type: 'password',
          label: '密码',
          required: true
        },
        rePassword: {
          type: 'password',
          label: '重复密码',
          required: true
        },
        roleId: {
          type: 'select',
          label: '单位类型',
          required: true,
          options: [
            { text: '荔枝企业', value: 1 },
            { text: '物流企业', value: 2 }
          ]
        },
        realName: {
          type: 'input',
          label: '姓名',
          required: true
        },
        phone: {
          type: 'input',
          label: '联系手机',
          required: true
        }
        // vcode: {
        //   type: 'input',
        //   label: '验证码',
        //   layout: 12,
        //   required: true
        // },
        // vcodeImage: {
        //   type: 'image',
        //   layout: 12,
        //   default: 'http://gdmpxt.org:80/ValidateCodeServlet',
        //   style: {
        //     // 可以在此调整大小
        //     width: '80px',
        //     height: '32px'
        //   },
        //   attrs: {
        //     isShowPreview: false // 默认值开启图片预览功能，可以设置为false，关闭
        //   }
        // }
      },
      rules: {
        unitName: [
          {
            min: 5,
            max: 120,
            message: '单位名称至少5个字符,最多120个字符！',
            trigger: 'blur'
          }
        ],
        user_name: [
          {
            min: 2,
            max: 16,
            message: '长度在 2 到 16 个字符,由字母开头，可由字母和数字组成!',
            trigger: 'blur'
          }
        ],
        password: [
          {
            min: 6,
            max: 18,
            message: '密码至少6个字符,最多18个字符！',
            trigger: 'blur'
          }
        ],
        rePassword: [{ validator: validateRePassword, trigger: 'blur' }],
        phone: [{ validator: phone, trigger: 'blur' }],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur']
          }
        ]
      }
    }
  },
  methods: {
    handleSubmit(data) {
      // eslint-disable-next-line no-console
      console.log(data)
      return Promise.resolve()
    },
    handleSuccess() {
      this.$message.success('创建成功')
    }
  }
}
</script>

<style lang="scss">
.register {
  height: 100%;
  background-image: url("../../assets/loginBg.png");
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .form {
    padding: 30px 50px;
    width: 480px;
    // border: 1px solid #adadad;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    position: relative;
  }
  .tips {
    font-size: 14px;
    color: #292926;
    position: absolute;
    right: 20px;
  }
}
</style>
