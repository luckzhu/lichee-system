<template>
  <div class="brand-mark">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="dialogFormVisible = true">新增品牌标识申领</el-button>
      <p class="standard">
        申领品牌标识的产品必须符合
        <span class="book">《“广东荔枝”区域公用品牌产品供应标准》（点击下载）</span>。
      </p>
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
      title="新增品牌标识申领"
      label-position="left"
      :is-responsive="false"
      width="700px"
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
    </ele-form-dialog>
  </div>
</template>

<script>
import { licheeBreedMap } from '@/utils/submit'
import { queryBase, addIdentification, cancelIdentification } from '@/api/base'

export default {
  name: 'Brand',
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
          prop: 'baseId'
        },
        {
          label: '品种',
          prop: 'bId',
          width: '80px',
          formatter: row => licheeBreedMap.get(row.bId)
        },
        {
          label: '数量（件）',
          prop: 'num'
        },
        {
          label: '上市日期',
          prop: 'saleDay'
        },
        {
          label: '包装规格（公斤/件）',
          prop: 'packing'
        },
        {
          label: '总重（吨）',
          prop: 'weight',
          formatter: row => (row.num * row.packing) / 1000,
          renderHeader: (h, scope) => {
            return (
              <el-tooltip
                class='item'
                effect='dark'
                content='总重由系统自动计算=数量*包装规格/1000'
                placement='top-start'
              >
                <div class='title-icon'>
                  {scope.column.label}
                  <i class='el-icon-warning'></i>
                </div>
              </el-tooltip>
            )
          }
        },
        {
          label: '批号',
          prop: 'batchNumber',
          renderHeader: (h, scope) => {
            return (
              <el-tooltip
                class='item'
                effect='dark'
                content='点确定后批号由系统自动生成'
                placement='top-start'
              >
                <div class='title-icon'>
                  {scope.column.label}
                  <i class='el-icon-warning'></i>
                </div>
              </el-tooltip>
            )
          }
        },
        {
          label: '操作',
          width: '160px',
          render: (h, scope) => {
            return (
              <div className='button-group'>
                <el-button
                  type='primary'
                  disabled={!!scope.row.batchNumber}
                  onClick={() => this.generateBatchNumber(scope.row)}
                >
                  确定
                </el-button>
                <el-button
                  type='danger'
                  disabled={scope.row.isCanceled}
                  onClick={() => this.cancelBatchNumber(scope.row)}
                >
                  作废
                </el-button>
              </div>
            )
          }
        }
      ],
      tableData: [],
      formData: {},
      formDesc: {
        baseId: {
          label: '生产基地',
          required: true
        },
        bId: {
          label: '品种',
          required: true
        },
        num: {
          type: 'input',
          label: '数量（件）',
          required: true
        },
        saleDay: {
          type: 'date',
          label: '上市日期',
          required: true,
          attrs: {
            valueFormat: 'yyyyMMdd'
          }
        },
        packing: {
          type: 'input',
          label: '包装规格（公斤/件）',
          required: true
        }
      },
      // 校检规则
      rules: {}
    }
  },
  mounted() {
    this.getBaseAndBreed()
  },
  methods: {
    async getBaseAndBreed() {
      const { rows: bases } = await queryBase()
      this.bases = bases
    },
    changeBreed(baseId) {
      const { detail: breeds } = this.bases.filter(
        item => item.id === baseId
      )[0]
      this.breeds = breeds
    },
    handleSubmit(data) {
      return new Promise(async(resolve, reject) => {
        const res = await addIdentification({ data })
        console.log(res)
        resolve(data)
      })
    },
    handleSuccess(data) {
      // 关闭弹窗
      this.dialogFormVisible = false
      // 重置formData
      this.formData = {}
      this.$message.success('创建成功')
    },
    generateBatchNumber(row) {
      // 地市编号A+基地序号01 日期20200530 本基地当天登记排序001
      const batchNumber = row.saleDay + '001'
      this.$confirm(`将自动生产批号, ${batchNumber}，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          row.batchNumber = batchNumber
          this.$message({
            type: 'success',
            message: '生成成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    cancelBatchNumber(row) {
      if (!row.batchNumber) return this.$message('请先生成批号')
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
      if (row.isCanceled && column.property === 'batchNumber') {
        return 'canceled'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.brand-mark {
  .standard {
    display: inline-block;
    font-size: 14px;
    vertical-align: top;
    margin-left: 20px;
    .book {
      cursor: pointer;
      color: #409eff;
      text-decoration: underline;
    }
  }

  .button-group {
    display: flex;
    justify-content: center;
  }
}
</style>

<style lang="scss">
.brand-mark {
  .canceled {
    color: rgb(180, 178, 178);
    text-decoration: line-through;
  }
}
</style>
