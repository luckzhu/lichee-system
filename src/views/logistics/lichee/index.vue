<template>
  <div class="brand-mark">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="dialogFormVisible = true">新增物流补助</el-button>
      <p class="describe">
        <a href="http://file.gdnjtg.cn/gdlz/物流信息登记表导入模板.xlsx" download="物流信息登记表导入模板.xlsx">
          <span class="download">下载导入模板</span>
        </a>
        （提示：时间格式为：2020-06-01）
      </p>
    </div>
    <!-- 表格 -->
    <lb-table ref="brandTable" :column="tableDesc" :data="tableData" border stripe align="center" />
    <!-- 表单 -->
    <ele-form-dialog
      v-model="formData"
      :form-desc="formDesc"
      :request-fn="handleSubmit"
      :rules="rules"
      :visible.sync="dialogFormVisible"
      title="新增物流补助"
      label-position="left"
      :is-responsive="false"
      width="700px"
      :dialog-attrs="{ 'close-on-click-modal': false }"
      @request-success="handleSuccess"
    >
      <template v-slot:selectExcel>
        <upload-excel-component :on-success="handleUploadSuccess" :before-upload="beforeUpload" />
      </template>

      <!-- 由于插件自带的type:number 默认值有bug,所有改用slot的写法 -->
      <template v-for="item in numFields" v-slot:[item]="{ desc, data, field, formData }">
        <el-input-number
          :key="item"
          v-model="formData[item]"
          style="width:200px"
          :controls="false"
        />
      </template>

      <template v-slot:sendTime="{ desc, data, field, formData }">
        <el-date-picker v-model="formData.sendTime" type="date" value-format="yyyy-MM-dd" />
      </template>
      <template v-slot:landTime="{ desc, data, field, formData }">
        <el-date-picker v-model="formData.landTime" type="date" value-format="yyyy-MM-dd" />
      </template>

      <!-- 存在初始校验的bug,所以改为slot -->
      <template v-slot:regionCode="{ desc, data, field, formData }">
        <el-cascader v-model="formData.regionCode" :props="cascaderProps" />
      </template>
      <template v-slot:unitId="{ desc, data, field, formData }">
        <el-select v-model="formData.unitId" filterable>
          <el-option
            v-for="option in units"
            :key="option.id"
            :label="option.unitName"
            :value="option.id"
          />
        </el-select>
      </template>
    </ele-form-dialog>
  </div>
</template>

<script>
import { licheeBreedMap } from '@/utils/submit'
import { queryRegion } from '@/api/normal'
import { queryUnit } from '@/api/user'
import { queryLogisticsInfoByLogUnit, addLogisticsInfo } from '@/api/base'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { parseTime } from '@/utils/index'

export default {
  name: 'Subsidy',
  components: {
    UploadExcelComponent
  },
  data() {
    return {
      uploadData: [],
      // 控制是否显示
      dialogFormVisible: false,
      licheeBreedMap,
      units: [],
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
      tableDesc: [
        {
          label: '地市',
          prop: 'regionCode',
          formatter(row) {
            return row.cityName + row.countyName
          }
        },
        {
          label: '生产企业',
          prop: 'unitName',
          minWidth: '200px'
        },
        {
          label: '承运数量（件）',
          prop: 'num',
          width: '120px'
        },
        {
          label: '重量规格（公斤/件）',
          prop: 'weight',
          width: '140px'
        },
        {
          label: '发货日期',
          prop: 'sendTime',
          formatter: row => parseTime(row.sendTime, '{y}-{m}-{d}')
        },
        {
          label: '到达日期',
          prop: 'landTime',
          formatter: row => parseTime(row.landTime, '{y}-{m}-{d}')
        },
        {
          label: '收货信息',
          children: [
            { label: '收货人', prop: 'name', align: 'center' },
            { label: '联系电话', prop: 'phone', align: 'center' },
            {
              label: '收货地址',
              prop: 'address',
              width: '240px',
              align: 'center'
            }
          ]
        }
      ],
      tableData: [],
      formData: {},
      numFields: ['num', 'weight'],
      formDesc: {
        isUpload: {
          type: 'radio',
          label: '填写方式',
          default: 'handle',
          options: [
            { text: '手动填写', value: 'handle' },
            { text: '导入excel', value: 'upload' }
          ],
          required: true
        },
        regionCode: {
          label: '地市',
          required: true,
          valueFormatter(regionCode) {
            return regionCode[regionCode.length - 1]
          }
        },
        unitId: {
          label: '生产企业',
          required: true
        },
        selectExcel: {
          label: '选择excel',
          vif(data) {
            return data.isUpload === 'upload'
          }
        },
        num: {
          label: '承运数量（件）',
          required: true,
          vif(data) {
            return data.isUpload === 'handle'
          }
        },
        weight: {
          label: '重量规格（公斤/件）',
          required: true,
          vif(data) {
            return data.isUpload === 'handle'
          }
        },
        sendTime: {
          label: '发货日期',
          required: true,
          vif(data) {
            return data.isUpload === 'handle'
          }
        },
        landTime: {
          label: '到达日期',
          required: true,
          vif(data) {
            return data.isUpload === 'handle'
          }
        },
        name: {
          type: 'input',
          label: '收货人',
          required: true,
          vif(data) {
            return data.isUpload === 'handle'
          }
        },
        phone: {
          type: 'input',
          label: '联系电话',
          required: true,
          vif(data) {
            return data.isUpload === 'handle'
          }
        },
        address: {
          type: 'input',
          label: '收货地址',
          required: true,
          vif(data) {
            return data.isUpload === 'handle'
          }
        }
      },
      // 校检规则
      rules: {}
    }
  },
  mounted() {
    this.getUnit()
    this.getLogistics()
  },
  methods: {
    async getUnit() {
      const { rows: units } = await queryUnit({
        state: 2,
        unitType: 1,
        pageSize: 10000
      })
      this.units = units
    },
    async getLogistics() {
      const { rows: data } = await queryLogisticsInfoByLogUnit()
      this.tableData = data
    },
    handleSubmit(data) {
      console.log(data)
      let postData
      if (data.isUpload === 'handle') {
        delete data.isUpload
        delete data.selectExcel
        // 后台需要传递这样的data string 而不是正常的 JSON 对象
        postData = JSON.stringify([data])
      } else {
        postData = JSON.stringify(this.generateCode(data, this.uploadData))
      }
      console.log(postData)
      return new Promise(async(resolve, reject) => {
        await addLogisticsInfo({ data: postData })
        resolve(data)
      })
    },
    // 当选择上次excel时，转换数据格式
    generateCode(data, uploadData) {
      const propsArr = [
        'num',
        'weight',
        'sendTime',
        'landTime',
        'name',
        'phone',
        'address'
      ]
      const { regionCode, unitId } = data
      const arr = []
      uploadData.map((item, index) => {
        const values = Object.values(item)
        const obj = { regionCode, unitId }
        values.forEach((ele, index) => {
          Object.assign(obj, { [propsArr[index]]: ele })
        })
        arr.push(obj)
      })
      return arr
    },
    handleSuccess(data) {
      // 关闭弹窗
      this.dialogFormVisible = false
      // 重置formData
      this.formData = {}
      this.$message.success('创建成功')
      this.getLogistics()
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleUploadSuccess({ results, header }) {
      this.$message('数据已导入，待提交后生效')
      this.uploadData = results
    }
  }
}
</script>

<style lang="scss" scoped>
.describe {
  display: inline-block;
  font-size: 14px;
  vertical-align: top;
  margin-left: 20px;
  .download {
    cursor: pointer;
    color: #409eff;
    text-decoration: underline;
  }
}
</style>

