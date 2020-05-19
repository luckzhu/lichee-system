<template>
  <div class="form-wrapper">
    <ele-form
      v-model="myFormData"
      :form-desc="formDesc"
      :request-fn="handleSubmit"
      :rules="rules"
      label-position="left"
      :is-responsive="false"
      :is-show-cancel-btn="false"
      :is-dialog="true"
      :disabled="disabled"
      @request-success="handleSuccess"
      @request-error="handleError"
    />
  </div>
</template>

<script>
import { queryRegion } from '@/api/normal'
import { addBase } from '@/api/base'

export default {
  name: 'FormDialog',
  props: {
    // eslint-disable-next-line
    formData: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
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
      formDesc: {
        name: {
          type: 'input',
          label: '企业字号',
          required: true // 必填简写
        },
        regionCode: {
          type: 'cascader',
          label: '地级市/县（区）',
          required: true,
          layout: 12,
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
        address: {
          type: 'input',
          label: '基地详细地址',
          layout: 12,
          required: true // 必填简写
        },
        contactName: {
          type: 'input',
          label: '联系人',
          required: true,
          layout: 12
        },
        contactPhone: {
          type: 'input',
          label: '手机号',
          required: true,
          attrs: {
            controls: false
          },
          layout: 12
        },
        scale: {
          type: 'number',
          label: '基地面积（亩）',
          attrs: {
            controls: false
          },
          layout: 12,
          required: true // 必填简写
        },
        yield: {
          type: 'number',
          label: '预计产量（公斤）',
          attrs: {
            controls: false
          },
          layout: 12,
          required: true // 必填简写
        },
        coldScale: {
          type: 'number',
          label: '冷库容积（m³）',
          attrs: {
            controls: false
          },
          layout: 12
        },
        coldCar: {
          type: 'number',
          label: '冷链车（台）',
          attrs: {
            controls: false,
            'step-strictly': true
          },
          layout: 12
        },
        levelDevice: {
          type: 'radio',
          label: '分级设备',
          required: true,
          layout: 12,
          options: [
            { text: '有', value: 1 },
            { text: '无', value: 0 }
          ]
        },
        packDevice: {
          type: 'radio',
          label: '打包设备',
          required: true,
          layout: 12,
          options: [
            { text: '有', value: 1 },
            { text: '无', value: 0 }
          ]
        },
        arrestPoint: {
          type: 'radio',
          label: '快递驻点',
          required: true,
          layout: 12,
          options: [
            { text: '有', value: 1 },
            { text: '无', value: 0 }
          ]
        },
        exportFile: {
          type: 'radio',
          label: '出口备案',
          layout: 12,
          options: [
            { text: '有', value: 1 },
            { text: '无', value: 0 }
          ]
        },

        breed_101: {
          type: 'radio',
          label: '妃子笑',
          required: true,
          layout: 24,
          options: [
            { text: '有生产', value: 1 },
            { text: '未生产', value: 0 }
          ]
        },
        scale_101: {
          vif: data => data.breed_101,
          type: 'number',
          label: '采收面积',
          attrs: {
            controls: false
          },
          required: true,
          layout: 8
        },
        yield_101: {
          vif: data => data.breed_101,
          type: 'number',
          label: '预计产量',
          attrs: {
            controls: false
          },
          required: true,
          layout: 8
        },

        breed_102: {
          type: 'radio',
          label: '白糖罂',
          required: true,
          layout: 24,
          options: [
            { text: '有生产', value: 1 },
            { text: '未生产', value: 0 }
          ]
        },
        scale_102: {
          vif: data => data.breed_102,
          type: 'number',
          label: '采收面积',
          attrs: {
            controls: false
          },
          required: true,
          layout: 8
        },
        yield_102: {
          vif: data => data.breed_102,
          type: 'number',
          label: '预计产量',
          attrs: {
            controls: false
          },
          required: true,
          layout: 8
        },

        breed_103: {
          type: 'radio',
          label: '桂味',
          required: true,
          layout: 24,
          options: [
            { text: '有生产', value: 1 },
            { text: '未生产', value: 0 }
          ]
        },
        scale_103: {
          vif: data => data.breed_103,
          type: 'number',
          label: '采收面积',
          attrs: {
            controls: false
          },
          required: true,
          layout: 8
        },
        yield_103: {
          vif: data => data.breed_103,
          type: 'number',
          label: '预计产量',
          attrs: {
            controls: false
          },
          required: true,
          layout: 8
        },

        breed_104: {
          type: 'radio',
          label: '黑叶',
          required: true,
          layout: 24,
          options: [
            { text: '有生产', value: 1 },
            { text: '未生产', value: 0 }
          ]
        },
        scale_104: {
          vif: data => data.breed_104,
          type: 'number',
          label: '采收面积',
          attrs: {
            controls: false
          },
          required: true,
          layout: 8
        },
        yield_104: {
          vif: data => data.breed_104,
          type: 'number',
          label: '预计产量',
          attrs: {
            controls: false
          },
          required: true,
          layout: 8
        },

        breed_105: {
          type: 'radio',
          label: '糯米糍',
          required: true,
          layout: 24,
          options: [
            { text: '有生产', value: 1 },
            { text: '未生产', value: 0 }
          ]
        },
        scale_105: {
          vif: data => data.breed_105,
          type: 'number',
          label: '采收面积',
          attrs: {
            controls: false
          },
          required: true,
          layout: 8
        },
        yield_105: {
          vif: data => data.breed_105,
          type: 'number',
          label: '预计产量',
          attrs: {
            controls: false
          },
          required: true,
          layout: 8
        },

        breed_106: {
          type: 'radio',
          label: '怀枝',
          required: true,
          layout: 24,
          options: [
            { text: '有生产', value: 1 },
            { text: '未生产', value: 0 }
          ]
        },
        scale_106: {
          vif: data => data.breed_106,
          type: 'number',
          label: '采收面积',
          attrs: {
            controls: false
          },
          required: true,
          layout: 8
        },
        yield_106: {
          vif: data => data.breed_106,
          type: 'number',
          label: '预计产量',
          attrs: {
            controls: false
          },
          required: true,
          layout: 8
        }
      },
      myFormData: this.formData,
      rules: {
        phone: [{ validator: phone, trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleSubmit(data) {
      const postData = this.converData(data)
      console.log(postData)
      return new Promise((resolve, reject) => {
        addBase(postData).then(res => {
          if (res.code === 200) {
            resolve(data)
          } else {
            reject(res.data.info)
          }
        })
      })
    },
    // convert breed data structor for post
    converData(obj) {
      const { regionCode } = obj
      obj.regionCode = regionCode[regionCode.length - 1]
      const data = []
      const bIds = ['101', '102', '103', '104', '105', '106']

      bIds.forEach(item => {
        if (obj[`breed_${item}`] === 1) {
          data.push({
            bId: item,
            scale: obj[`scale_${item}`],
            yield: obj[`yield_${item}`]
          })
        }
        delete obj[`breed_${item}`]
        delete obj[`scale_${item}`]
        delete obj[`yield_${item}`]
      })

      obj.bId = 100 // 代表荔枝
      obj.data = JSON.stringify(data)

      return obj
    },
    handleSuccess(data) {
      // 关闭弹窗
      this.dialogFormVisible = false
      // 重置formData
      // this.formData = {}
      this.$message.success('基地提交成功，进入待审核状态')
    },
    handleError(error) {
      this.$message.success(error)
    }
  }
}
</script>

<style lang="scss">
// .form-wrapper {
//   background-color: #efefef;
//   width: 50%;
// }
</style>
