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
        @request-error="handleError"
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
import { queryRegion } from '@/api/normal'
import { register, checkOrgCode } from '@/api/user'

export default {
  name: 'Register',
  data() {
    const validateRePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const contactPhone = (rule, value, callback) => {
      const mobileReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (value !== '' && !mobileReg.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    const orgCode = (rule, value, callback) => {
      const orgCodeReg = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/
      if (value === '') {
        callback(new Error('请输入统一社会信用代码'))
      } else if (value !== '' && !orgCodeReg.test(value)) {
        callback(new Error('请输入正确的统一社会信用代码'))
      } else {
        checkOrgCode({ orgCode: value }).then(res => {
          if (res.code === 201) {
            callback(new Error('该统一社会信用代码的企业已存在'))
          } else if (res.code === 200) {
            // const data = res.data.info
            // data.regionCode = [data.regionCode.substring(0, 4), data.regionCode]
            // data.unitName = data.name
            // data.roleId = 1
            // this.formData = data
            // console.log(this.formData)
            callback()
          } else {
            callback()
          }
        })
      }
    }
    // const account = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请填写用户名'))
    //   } else {
    //     checkAccount({ account: value }).then(res => {
    //       if (res.code === 201) {
    //         callback(new Error('用户名已存在'))
    //       } else {
    //         callback()
    //       }
    //     })
    //   }
    // }

    return {
      // 表单数据
      formData: {},
      formDesc: {
        unitName: {
          type: 'input',
          label: '企业名称',
          required: true // 必填简写
        },
        regionCode: {
          type: 'cascader',
          label: '地级市/县（区）',
          required: true,
          attrs: {
            props: {
              lazy: true,
              value: 'code',
              label: 'name',
              lazyLoad(node, resolve) {
                const { level } = node
                if (level === 0) {
                  queryRegion().then(res => {
                    const nodes = res.filter(item => item.type === 1)
                    resolve(nodes)
                  })
                } else {
                  const { code } = node.data
                  queryRegion({ code }).then(res => {
                    const nodes = res.map(item => ({
                      code: item.code,
                      name: item.name,
                      leaf: true
                    }))
                    resolve(nodes)
                  })
                }
              }
            }
          }
        },
        orgCode: {
          type: 'input',
          label: '统一社会信用代码',
          required: true // 必填简写
        },
        // account: {
        //   type: 'input',
        //   label: '用户名',
        //   required: true
        // },
        pwd: {
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
          type: 'radio',
          label: '单位类型',
          required: true,
          options: [
            { text: '荔枝企业', value: 1 },
            { text: '物流企业', value: 2 }
          ]
        },
        contactName: {
          type: 'input',
          label: '姓名',
          required: true
        },
        contactPhone: {
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
        pwd: [
          {
            min: 6,
            max: 18,
            message: '密码至少6个字符,最多18个字符！',
            trigger: 'blur'
          }
        ],
        rePassword: [{ validator: validateRePassword, trigger: 'blur' }],
        contactPhone: [{ validator: contactPhone, trigger: 'blur' }],
        orgCode: [{ validator: orgCode, trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleSubmit(data) {
      const { regionCode } = data
      data.regionCode = regionCode[regionCode.length - 1]
      delete data.rePassword

      return new Promise(async(resolve, reject) => {
        try {
          const res = await register(data)
          if (res.code === 200) {
            resolve(data)
          } else {
            reject(res.data.info)
          }
        } catch (error) {
          reject(new Error(error))
        }
      })
    },

    handleSuccess(data) {
      this.$router.push('/')
    },
    // eslint-disable-next-line handle-callback-err
    handleError(error) {
      this.$message('注册失败,请重试或联系管理员')
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
