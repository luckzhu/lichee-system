<template>
  <div class="brand-mark">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="onAddContract">新增合同</el-button>
      <p class="standard">
        <span class="book">合同备案模板（点击下载）</span>。
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
      title="新增合同"
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
        <el-select v-model="formData.bId">
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
import { queryBase, addContract, delContract, queryContract } from '@/api/base'

export default {
  name: 'Contract',
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
          prop: 'contractFile '
        },
        {
          label: '操作',
          width: '160px',
          render: (h, scope) => {
            return (
              <div className='button-group'>
                <el-button
                  type='primary'
                  onClick={() => this.editContract(scope.row)}
                >
                  编辑
                </el-button>
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
          type: 'input',
          label: '采购重量（吨）',
          required: true
        },
        price: {
          type: 'input',
          label: '采购价格（元/公斤）',
          required: true
        },
        contract: {
          type: 'upload-file',
          label: '上传合同盖章件',
          attrs: {
            action: 'https://file.gdnjtg.cn/upload', // 上传地址
            fileSize: 10, // 大小限制(MB)
            withCredentials: true,
            accept: 'application/pdf',
            limit: 1,
            multiple: false,
            data: {
              projectName: 'gdlz'
            },
            name: 'file',
            handleResponse(response, file) {
              console.log(response, file)
              // 根据响应结果, 设置 URL
              return {
                name: 'w22222.pdf',
                url: response.data.info,
                size: file.size
              }
            }
          }
        }
      },
      // 校检规则
      rules: {}
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
    onAddContract() {
      this.formData = {}
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
        const res = await addContract(data)
        console.log(res)
        resolve(data)
      })
    },

    handleSuccess(data) {
      this.tableData.push(data)
      // 关闭弹窗
      this.dialogFormVisible = false
      // 重置formData
      this.formData = {}
      this.$message.success('创建成功')
    },
    editContract(row) {
      this.formData = row
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
