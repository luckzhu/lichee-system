<template>
  <div>
    <el-button v-if="roles.includes('nongye')" type="primary" class="add" @click="addBase">新增生产基地</el-button>
    <lb-table :column="tableData.column" :data="tableData.data" border stripe align="center" />

    <!-- 新增基地表单 -->
    <div class="addDailog">
      <el-dialog
        title="新增生产基地"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
        width="50%"
        top="10vh"
        center
      >
        <add-base-form ref="addBaseForm" :key="baseKey" :form-data="formData" />
        <!-- <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">{{ submitText }}</el-button>
        </div> -->
      </el-dialog>
    </div>

    <!-- <AddBaseFormDialog ref="addBaseForm" /> -->
  </div>
</template>

<script>
import LbTable from '@/components/LbTable'
// import AddBaseForm from './components/AddBaseForm'
import AddBaseForm from './components/AddBaseForm'
import { queryBase, queryBaseByRegionCode } from '@/api/base'

export default {
  name: 'Base',
  components: {
    LbTable,
    AddBaseForm
  },
  data() {
    return {
      dialogFormVisible: false,
      formData: {},
      tableData: {
        column: [
          {
            prop: 'name',
            label: '企业字号'
          },
          {
            prop: 'cityName',
            label: '地级市/县（区）',
            formatter: row => row.cityName + row.countyName
          },
          {
            prop: 'address',
            label: '基地详细地址'
          },
          {
            prop: 'contactName',
            label: '联系人'
          },
          {
            prop: 'contactPhone',
            label: '手机号'
          },
          {
            prop: 'scale',
            label: '基地面积（亩）'
          },
          {
            prop: 'yield',
            label: '预计产量（公斤）'
          },
          {
            prop: 'coldScale',
            label: '冷库容积（m³）'
          },
          {
            prop: 'coldCar',
            label: '冷链车（台）'
          },
          {
            prop: 'levelDevice',
            label: '分级设备',
            formatter: row => (row.classifyingEquipments ? '有' : '无')
          },
          {
            prop: 'packDevice',
            label: '打包设备',
            formatter: row => (row.balingEquipment ? '有' : '无')
          },
          {
            prop: 'arrestPoint',
            label: '快递驻点',
            formatter: row => (row.expressSite ? '有' : '无')
          },
          {
            prop: 'exportFile',
            label: '出口备案',
            formatter: row => (row.exportFiling ? '有' : '无')
          },
          {
            prop: 'state',
            label: '状态',
            render: (h, scope) => {
              return (
                <div>
                  <el-tag type={scope.row.state === 0 ? '' : 'success'}>
                    {scope.row.state === 0 ? '未审核' : '已审核'}
                  </el-tag>
                </div>
              )
            }
          },
          {
            label: '操作',
            render: (h, scope) => {
              return (
                <div>
                  <el-button
                    type='primary'
                    onClick={() => {
                      this.toBaseForm(scope.row)
                    }}
                  >
                    {this.roles.includes('shiji') ? '审核' : '查看'}
                  </el-button>
                </div>
              )
            }
          }
        ],
        data: []
      },
      baseKey: -1
    }
  },
  computed: {
    roles() {
      return this.$store.getters.roles
    },
    submitText() {
      if (this.roles.includes('shiji')) {
        return '审核通过'
      } else {
        return '提交'
      }
    }
  },
  mounted() {
    this.getBaseList(this.roles)
  },
  methods: {
    addBase() {
      this.formData = {}
      this.baseKey = -1
      this.dialogFormVisible = true
    },
    submit() {
      this.$refs.addBaseForm.handleSubmit()
    },
    toBaseForm(row) {
      console.log(row)
      const temp = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
      this.baseKey = row.id
      temp.regionCode = [temp.regionCode.substring(0, 4), temp.regionCode]

      const bIds = ['101', '102', '103', '104', '105', '106']
      bIds.forEach(item => {
        temp[`breed_${item}`] = 0
      })
      temp.detail.forEach(item => {
        temp[`breed_${item.bId}`] = 1
        temp[`scale_${item.bId}`] = item.scale
        temp[`yield_${item.bId}`] = item.yield
      })
      this.formData = JSON.parse(JSON.stringify(temp))
    },
    getBaseList(roles) {
      if (roles.includes('shiji')) {
        queryBaseByRegionCode().then(res => {
          this.tableData.data = res.rows
        })
      } else {
        queryBase().then(res => {
          this.tableData.data = res.rows
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.add {
  margin-bottom: 20px;
}
</style>

<style lang="scss">
.addDailog {
  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 40px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }

  .el-dialog__body {
    overflow: auto;
  }
}
</style>
