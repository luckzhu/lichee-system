<template>
  <div class="form-wrapper">
    <ele-form
      v-model="myFormData"
      :form-desc="formDesc"
      :rules="rules"
      label-position="left"
      :is-responsive="false"
      :is-show-cancel-btn="false"
      :is-show-submit-btn="isShowSubmit"
      :is-dialog="true"
      :disabled="disabled"
      :is-loading="isLoading"
      :request-fn="handleSubmit"
      @request-success="handleSuccess"
      @request-error="handleError"
    >
      <!-- 由于插件自带的type:number 默认值有bug,所有改用slot的写法 -->
      <template v-for="item in numFields" v-slot:[item]="{ formData }">
        <el-input-number
          :key="item"
          v-model="formData[item]"
          :controls="false"
          :step-strictly="item === 'coldCar' ? true:false"
        />
      </template>
      <!-- 存在初始校验的bug,所以改为slot -->
      <template v-slot:regionCode="{ formData }">
        <el-cascader v-model="formData.regionCode" :props="cascaderProps" />
      </template>
    </ele-form>
  </div>
</template>

<script>
import { queryRegion } from '@/api/normal'
import { addBase } from '@/api/base'
import { mapGetters } from 'vuex'

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
    },
    baseId: {
      type: Number,
      default: -1
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
    const ifRequired = (rule, value, callback) => {
      const breedCode = rule.field.split('_')[1]
      const isOn = this.myFormData[`breed_${breedCode}`]
      if (isOn === 1 && value !== 0 && !value) {
        callback(new Error('请填写该指标'))
      } else {
        callback()
      }
    }
    return {
      numFields: [
        'scale',
        'yield',
        'coldScale',
        'coldCar',
        'scale_101',
        'yield_101',
        'scale_102',
        'yield_102',
        'scale_103',
        'yield_103',
        'scale_104',
        'yield_104',
        'scale_105',
        'yield_105',
        'scale_106',
        'yield_106'
      ],
      cascaderProps: {
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
              const nodes = res
                .filter(item => item.type === 2)
                .map(item => ({
                  code: item.code,
                  name: item.name,
                  leaf: true
                }))
              resolve(nodes)
            })
          }
        }
      },
      isLoading: false,
      formError: {},
      // 表单数据
      formDesc: {
        name: {
          type: 'input',
          label: '企业字号',
          required: true // 必填简写
        },
        regionCode: {
          label: '地级市/县（区）',
          required: true,
          layout: 12
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
          label: '基地面积（亩）',
          layout: 12,
          required: true // 必填简写
        },
        yield: {
          label: '预计产量（公斤）',
          layout: 12,
          required: true // 必填简写
        },
        coldScale: {
          label: '冷库容积（m³）',
          layout: 12
        },
        coldCar: {
          label: '冷链车（台）',
          attrs: {
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
          required: true,
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
          layout: 8,
          options: [
            { text: '有生产', value: 1 },
            { text: '未生产', value: 0 }
          ]
        },
        scale_101: {
          label: '采收面积（亩）',
          layout: 8
        },
        yield_101: {
          label: '预计产量（公斤）',
          layout: 8
        },

        breed_102: {
          type: 'radio',
          label: '白糖罂',
          required: true,
          layout: 8,
          options: [
            { text: '有生产', value: 1 },
            { text: '未生产', value: 0 }
          ]
        },
        scale_102: {
          label: '采收面积（亩）',
          layout: 8
        },
        yield_102: {
          label: '预计产量（公斤）',
          layout: 8
        },

        breed_103: {
          type: 'radio',
          label: '桂味',
          required: true,
          layout: 8,
          options: [
            { text: '有生产', value: 1 },
            { text: '未生产', value: 0 }
          ]
        },
        scale_103: {
          label: '采收面积（亩）',
          layout: 8
        },
        yield_103: {
          label: '预计产量（公斤）',
          layout: 8
        },

        breed_104: {
          type: 'radio',
          label: '黑叶',
          required: true,
          layout: 8,
          options: [
            { text: '有生产', value: 1 },
            { text: '未生产', value: 0 }
          ]
        },
        scale_104: {
          label: '采收面积（亩）',
          layout: 8
        },
        yield_104: {
          label: '预计产量（公斤）',
          layout: 8
        },

        breed_105: {
          type: 'radio',
          label: '糯米糍',
          required: true,
          layout: 8,
          options: [
            { text: '有生产', value: 1 },
            { text: '未生产', value: 0 }
          ]
        },
        scale_105: {
          label: '采收面积（亩）',
          layout: 8
        },
        yield_105: {
          label: '预计产量（公斤）',
          layout: 8
        },

        breed_106: {
          type: 'radio',
          label: '怀枝',
          required: true,
          layout: 8,
          options: [
            { text: '有生产', value: 1 },
            { text: '未生产', value: 0 }
          ]
        },
        scale_106: {
          label: '采收面积（亩）',
          layout: 8
        },
        yield_106: {
          label: '预计产量（公斤）',
          layout: 8
        }
      },
      myFormData: this.formData,
      rules: {
        contactPhone: [{ validator: phone, trigger: 'blur' }],
        scale_101: [{ validator: ifRequired, trigger: 'blur' }],
        yield_101: [{ validator: ifRequired, trigger: 'blur' }],
        scale_102: [{ validator: ifRequired, trigger: 'blur' }],
        yield_102: [{ validator: ifRequired, trigger: 'blur' }],
        scale_103: [{ validator: ifRequired, trigger: 'blur' }],
        yield_103: [{ validator: ifRequired, trigger: 'blur' }],
        scale_104: [{ validator: ifRequired, trigger: 'blur' }],
        yield_104: [{ validator: ifRequired, trigger: 'blur' }],
        scale_105: [{ validator: ifRequired, trigger: 'blur' }],
        yield_105: [{ validator: ifRequired, trigger: 'blur' }],
        scale_106: [{ validator: ifRequired, trigger: 'blur' }],
        yield_106: [{ validator: ifRequired, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['device', 'roles']),
    isShowSubmit() {
      return !this.roles.includes('shiji')
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

      if (this.baseId !== -1) {
        obj.id = this.baseId
        delete obj.detail
      }
      obj.state = 1
      return obj
    },
    handleSuccess(data) {
      this.$message.success('基地提交成功，进入待审核状态')
      this.$emit('closeDialog')
    },
    handleError(error) {
      this.$message.error(error)
    }
  }
}
</script>

<style lang="scss">
.form-wrapper {
  .el-button {
    position: absolute;
    right: 0;
  }
}
</style>
