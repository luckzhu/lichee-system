<template>
  <div class="contract">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="onAddContract">新增合同</el-button>
      <p class="standard">
        <span class="book">合同备案模板（点击下载）</span>。
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
      show-summary
      :summary-method="getSummaries"
    />
    <!-- 表单 -->
    <ele-form-dialog
      v-model="formData"
      :form-desc="formDesc"
      :request-fn="handleSubmit"
      :rules="rules"
      :visible.sync="dialogFormVisible"
      title="新增合同"
      label-position="left"
      :is-responsive="false"
      width="700px"
      :dialog-attrs="{ 'close-on-click-modal': false }"
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

      <template v-slot:contractFile>
        <UploadFile
          url="https://file.gdnjtg.cn/upload?projectName=gdlz"
          file-types="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :file-size="10"
          :file-limit="1"
          @getFileList="handleFile"
        >上传许可证</UploadFile>
        <div>
          <a :href="uploadedContractFile.url" target="blank">{{ uploadedContractFile.name }}</a>
        </div>
      </template>
    </ele-form-dialog>
  </div>
</template>

<script>
import { licheeBreedMap } from '@/utils/submit'
import { queryBase, addContract, delContract, queryContract } from '@/api/base'
import UploadFile from '@/components/UploadFile'

export default {
  name: 'Contract',
  components: {
    // eslint-disable-next-line
    UploadFile
  },
  data() {
    const isUpload = (rule, value, callback) => {
      if (!this.formData.contractFile) {
        callback(new Error('请上传合同盖章件'))
      } else {
        callback()
      }
    }
    return {
      // 控制是否显示
      dialogFormVisible: false,
      btnLoading: false,
      licheeBreedMap,
      bases: [],
      breeds: [],
      tableDesc: [
        {
          label: '生产基地',
          prop: 'baseName'
        },
        {
          label: '品种',
          prop: 'bId',
          width: '80px',
          formatter: row => licheeBreedMap.get(row.bId)
        },
        {
          label: '采购对象',
          prop: 'purchase'
        },
        {
          label: '采购重量（吨）',
          prop: 'weight'
        },
        {
          label: '采购价格（元/公斤）',
          prop: 'price'
        },
        {
          label: '合同盖章件',
          prop: 'contractFile',
          render: (h, scope) => {
            if (scope.row.contractFile) {
              const { url, name } = JSON.parse(scope.row.contractFile)
              return (
                <div>
                  <a href={url} target='_blank'>
                    {name}
                  </a>
                </div>
              )
            }
          }
        },
        {
          label: '操作',
          render: (h, scope) => {
            return (
              <div className='button-group'>
                <el-button
                  type='danger'
                  onClick={() => this.deleteContract(scope.row)}
                >
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      tableData: [],
      formData: {},
      uploadedContractFile: {},
      fileList: [],
      numFields: ['weight', 'price'],
      formDesc: {
        baseId: {
          label: '生产基地',
          required: true
        },
        bId: {
          label: '品种',
          required: true
        },
        purchase: {
          type: 'input',
          label: '采购对象',
          required: true
        },
        weight: {
          label: '采购重量（吨）',
          required: true
        },
        price: {
          label: '采购价格（元/公斤）',
          required: true
        },
        contractFile: {
          label: '上传合同盖章件'
        }
      },
      editingContract: {},
      // 校检规则
      rules: {
        contractFile: [{ validator: isUpload }]
      }
    }
  },

  mounted() {
    this.getContract()
    this.getBaseAndBreed()
  },
  methods: {
    async getContract() {
      const { rows: data } = await queryContract()
      this.tableData = data
    },
    // 表格 总重合计栏
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (column.property === 'weight') {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            let result = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            if (result.toString().indexOf('.') > -1) {
              result = result.toFixed(4)
            }
            sums[index] = result
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    onAddContract() {
      this.formData = {}
      this.uploadedContractFile = {}
      this.dialogFormVisible = true
    },
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
        try {
          const res = await addContract(data)
          resolve(res)
        } catch (error) {
          reject(new Error())
        }
      })
    },
    handleSuccess(res) {
      this.getContract()
      // 关闭弹窗
      this.dialogFormVisible = false
      // 重置formData
      this.formData = {}
      this.$message.success('创建成功')
    },
    editContract(row) {
      this.formData = row
      console.log(this.formData)
      this.dialogFormVisible = true
    },

    deleteContract(row) {
      this.$confirm(`是否确定删除此合同？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await delContract({ id: row.id })
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getContract()
          } else {
            this.$message({
              type: 'danger',
              message: '删除失败!'
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
    handleFile(file, row) {
      const [contractFile] = file
      this.uploadedContractFile = contractFile
      this.formData.contractFile = JSON.stringify(contractFile)
    },
    deleteFile(index) {
      this.formData.contractFile.splice(index, 1)
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.contract {
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
