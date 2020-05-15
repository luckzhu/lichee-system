<template>
  <div class="form-wrapper">
    <ele-form-dialog
      v-model="formData"
      :form-desc="formDesc"
      :request-fn="handleSubmit"
      :rules="rules"
      label-position="left"
      :is-responsive="false"
      :visible.sync="dialogFormVisible"
      title="新增生产基地"
      :dialog-attrs="{ top: '8vh','close-on-click-modal':false }"
      @request-success="handleSuccess"
    />
  </div>
</template>

<script>
export default {
  name: 'FormDialog',
  data() {
    return {
      dialogFormVisible: false,
      // 表单数据
      formData: {},
      formDesc: {
        enterpriseName: {
          type: 'input',
          label: '企业字号',
          required: true // 必填简写
        },
        cityAndCounty: {
          type: 'cascader',
          label: '地级市/县（区）',
          layout: 12,
          options: [
            {
              value: 'dongman',
              label: '动漫',
              children: [
                { value: 'dongmanzatan', label: '动漫杂谈' },
                { value: 'donghuajishu', label: '动画技术' },
                { value: 'dongmanzixun', label: '动漫资讯' }
              ]
            },
            {
              value: 'biancheng',
              label: '编程',
              children: [
                { value: 'vue', label: 'Vue' },
                { value: 'css', label: 'CSS' },
                { value: 'html', label: 'HTML' },
                { value: 'js', label: 'JavaScript' }
              ]
            }
          ]
        },
        address: {
          type: 'input',
          label: '基地详细地址',
          layout: 12,
          required: true // 必填简写
        },
        contact: {
          type: 'input',
          label: '联系人',
          required: true,
          layout: 12
        },
        phone: {
          type: 'input',
          label: '手机号',
          required: true,
          layout: 12
        },
        area: {
          type: 'input',
          label: '基地面积（亩）',
          layout: 12,
          required: true // 必填简写
        },
        yield: {
          type: 'input',
          label: '预计产量（公斤）',
          layout: 12,
          required: true // 必填简写
        },
        coldStorageVolume: {
          type: 'input',
          label: '冷库容积（m³）',
          layout: 12
        },
        coldChainCar: {
          type: 'input',
          label: '冷链车（台）',
          layout: 12
        },
        classifyingEquipments: {
          type: 'radio',
          label: '分级设备',
          required: true,
          layout: 12,
          options: [
            { text: '有', value: 1 },
            { text: '无', value: 0 }
          ]
        },
        balingEquipment: {
          type: 'radio',
          label: '打包设备',
          required: true,
          layout: 12,
          options: [
            { text: '有', value: 1 },
            { text: '无', value: 0 }
          ]
        },
        expressSite: {
          type: 'radio',
          label: '快递驻点',
          required: true,
          layout: 12,
          options: [
            { text: '有', value: 1 },
            { text: '无', value: 0 }
          ]
        },
        exportFiling: {
          type: 'radio',
          label: '出口备案',
          required: true,
          layout: 12,
          options: [
            { text: '有', value: 1 },
            { text: '无', value: 0 }
          ]
        },

        breed1: {
          children: {
            isHave: {
              type: 'radio',
              label: '妃子笑',
              required: true,
              options: [
                { text: '有生产', value: 1 },
                { text: '未生产', value: 0 }
              ]
            },
            area: {
              vif: data => data.breed1.isHave,
              type: 'input',
              label: '采收面积',
              required: true,
              layout: 12
            },
            field: {
              vif: data => data.breed1.isHave,
              type: 'input',
              label: '预计产量',
              required: true,
              layout: 12
            }
          }
        },
        breed2: {
          children: {
            isHave: {
              type: 'radio',
              label: '白糖罂',
              required: true,
              options: [
                { text: '有生产', value: 1 },
                { text: '未生产', value: 0 }
              ]
            },
            area: {
              vif: data => data.breed2.isHave,
              type: 'input',
              label: '采收面积',
              required: true,
              layout: 12
            },
            field: {
              vif: data => data.breed2.isHave,
              type: 'input',
              label: '预计产量',
              required: true,
              layout: 12
            }
          }
        },
        breed3: {
          children: {
            isHave: {
              type: 'radio',
              label: '桂味',
              required: true,
              options: [
                { text: '有生产', value: 1 },
                { text: '未生产', value: 0 }
              ]
            },
            area: {
              vif: data => data.breed3.isHave,
              type: 'input',
              label: '采收面积',
              required: true,
              layout: 12
            },
            field: {
              vif: data => data.breed3.isHave,
              type: 'input',
              label: '预计产量',
              required: true,
              layout: 12
            }
          }
        },
        breed4: {
          children: {
            isHave: {
              type: 'radio',
              label: '黑叶',
              required: true,
              options: [
                { text: '有生产', value: 1 },
                { text: '未生产', value: 0 }
              ]
            },
            area: {
              vif: data => data.breed4.isHave,
              type: 'input',
              label: '采收面积',
              required: true,
              layout: 12
            },
            field: {
              vif: data => data.breed4.isHave,
              type: 'input',
              label: '预计产量',
              required: true,
              layout: 12
            }
          }
        },
        breed5: {
          children: {
            isHave: {
              type: 'radio',
              label: '糯米糍',
              required: true,
              options: [
                { text: '有生产', value: 1 },
                { text: '未生产', value: 0 }
              ]
            },
            area: {
              vif: data => data.breed5.isHave,
              type: 'input',
              label: '采收面积',
              required: true,
              layout: 12
            },
            field: {
              vif: data => data.breed5.isHave,
              type: 'input',
              label: '预计产量',
              required: true,
              layout: 12
            }
          }
        },
        breed6: {
          children: {
            isHave: {
              type: 'radio',
              label: '怀枝',
              required: true,
              options: [
                { text: '有生产', value: 1 },
                { text: '未生产', value: 0 }
              ]
            },
            area: {
              vif: data => data.breed6.isHave,
              type: 'input',
              label: '采收面积',
              required: true,
              layout: 12
            },
            field: {
              vif: data => data.breed6.isHave,
              type: 'input',
              label: '预计产量',
              required: true,
              layout: 12
            }
          }
        }
      },
      rules: {}
    }
  },
  created() {
    this.$on('open', () => {
      this.dialogFormVisible = true
    })
  },
  methods: {
    handleSubmit(data) {
      console.log(data)
      // 模拟异步请求
      return new Promise(resolve => {
        resolve(data)
      })
    },
    handleSuccess(data) {
      // 关闭弹窗
      this.dialogFormVisible = false
      // 重置formData
      this.formData = {}
      this.$message.success('创建成功')
    }
  }
}
</script>

<style lang="scss">
.form-wrapper {
  background-color: #efefef;
  width: 50%;
}
</style>
