<template>
  <div class="brand-mark">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="dialogFormVisible = true">新增物流补助</el-button>
    </div>
    <!-- 表格 -->
    <lb-table
      ref="brandTable"
      :column="tableDesc"
      :data="tableData"
      border
      stripe
      align="center"
      :cell-class-name="cellClass"
    />
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
      width="550px"
      @request-success="handleSuccess"
    >
      <!-- select 存在初始校验的bug,所以改为slot -->
      <template v-slot:baseId="{ desc, data, field, formData }">
        <el-select v-model="formData.baseId" @change="changeBreed">
          <el-option
            v-for="option in bases"
            :key="option.id"
            :label="option.name"
            :value="option.id"
          />
        </el-select>
      </template>

      <!-- 品种根据上面的基地选择后动态变化 -->
      <template v-slot:bId="{ desc, data, field, formData }">
        <el-select v-model="formData.bId" placeholder="请先选择基地">
          <el-option
            v-for="option in breeds"
            :key="option.id"
            :label="licheeBreedMap.get(option.bId)"
            :value="option.bId"
          />
        </el-select>
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

      <template v-slot:saleDate="{ desc, data, field, formData }">
        <el-date-picker
          v-model="formData.saleDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        />
      </template>
    </ele-form-dialog>
  </div>
</template>

<script>
import { licheeBreedMap } from '@/utils/submit'
import {
  queryBase,
  queryIdentification,
  addIdentification,
  cancelIdentification
} from '@/api/base'

export default {
  name: 'Subsidy',
  data() {
    return {
      // 控制是否显示
      dialogFormVisible: false,
      licheeBreedMap,
      bases: [],
      breeds: [],
      tableDesc: [
        {
          label: '生产基地',
          prop: ''
        },
        {
          label: '物流企业',
          prop: ''
        },
        {
          label: '承运数量（件）',
          prop: ''
        },
        {
          label: '重量规格（公斤/件）',
          prop: ''
        },
        {
          label: '承运总重（吨）',
          prop: ''
        },
        {
          label: '发货日期',
          prop: ''
        },
        {
          label: '到达日期',
          prop: ''
        },
        {
          label: '收货信息',
          children: [
            { label: '收货人', prop: '' },
            { label: '联系电话', prop: '' },
            { label: '收货地址', prop: '' }
          ]
        }
      ],
      tableData: [],
      formData: {},
      numFields: ['num', 'packing'],
      formDesc: {
        baseId: {
          label: '生产基地',
          required: true
        },
        bId: {
          label: '物流企业',
          required: true
        },
        num: {
          label: '承运数量（件）',
          required: true
        },
        packing: {
          label: '重量规格（公斤/件）',
          required: true
        },
        packing1: {
          label: '承运总重（吨）',
          required: true
        },
        saleDate: {
          label: '发货日期',
          required: true
        },
        saleDate1: {
          label: '到达日期',
          required: true
        },
        saleDate2: {
          label: '收货人',
          required: true
        },
        saleDate3: {
          label: '联系电话',
          required: true
        },
        saleDate4: {
          label: '收货地址',
          required: true
        }
      },
      // 校检规则
      rules: {}
    }
  },
  mounted() {
    this.getBaseAndBreed()
    this.getIdentification()
  },
  methods: {
    async getBaseAndBreed() {
      const { rows: bases } = await queryBase()
      this.bases = bases
    },
    async getIdentification() {
      const { rows: data } = await queryIdentification()
      this.tableData = data
    },
    changeBreed(baseId) {
      const { detail: breeds } = this.bases.filter(
        item => item.id === baseId
      )[0]
      this.breeds = breeds
    },
    handleSubmit(data) {
      data.weight = (data.num * data.packing) / 1000 // 计算总重
      data.state = 0 // 初始状态为0，作废后为-1
      // console.log(this.isExceedYield(data))

      return new Promise(async(resolve, reject) => {
        if (this.isExceedYield(data)) {
          this.$alert(
            '该品种总重（数量*包装规格）大于该生产基地登记该品种的预计产量，请重新填写数量或包装规格!'
          )
          reject()
        } else {
          await addIdentification(data)
          resolve(data)
        }
      })
    },
    isExceedYield(data) {
      const { baseId, bId, weight } = data
      const breed = this.findBreed(baseId, bId)
      return weight >= breed.yield / 1000
    },
    findBreed(baseId, bId) {
      return this.bases
        .find(base => base.id === baseId)
        .detail.find(breed => breed.bId === bId)
    },
    handleSuccess(data) {
      // 关闭弹窗
      this.dialogFormVisible = false
      // 重置formData
      this.formData = {}
      this.$message.success('创建成功')
      this.getIdentification()
    },
    generateBatchNumber(row) {
      const { id } = row
      this.$confirm(`系统将自动生产批号，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await addIdentification({ id, state: 2 })
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '生成成功!'
            })
            this.getIdentification()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    cancelBatchNumber(row) {
      this.$confirm(
        `是否作废该批号 ${row.batchNumber}，作废后，该条记录和批号继续保留，是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async() => {
          const res = await cancelIdentification({ id: row.id })
          if (res === 200) {
            this.$message({
              type: 'success',
              message: '作废成功!'
            })
            this.getIdentification()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    cellClass({ row, column, rowIndex, columnIndex }) {
      if (row.state === -1) {
        return 'canceled'
      }
    }
  }
}
</script>

