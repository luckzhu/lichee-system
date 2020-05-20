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
        :width="dialogWidth"
        top="10vh"
        center
      >
        <add-base-form ref="addBaseForm" :key="baseId" :form-data="formData" :disabled="disabled" />
        <div v-if="roles.includes('shiji')" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="approve">审核通过</el-button>
          <el-button type="danger" @click="sendBack">退回</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- <AddBaseFormDialog ref="addBaseForm" /> -->
  </div>
</template>

<script>
import LbTable from '@/components/LbTable'
import { stateMap } from '@/utils/submit'
import AddBaseForm from './components/AddBaseForm'
import { queryBase, queryBaseByRegionCode, validBase, generateBaseAccount } from '@/api/base'
import { mapGetters } from 'vuex'

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
                  <el-tag
                    type={scope.row.state ? stateMap[scope.row.state].type : ''}
                  >
                    {scope.row.state ? stateMap[scope.row.state].label : ''}
                  </el-tag>
                </div>
              )
            }
          },
          {
            label: '操作',
            width: '200px',
            render: (h, scope) => {
              return (
                <div className='button-group'>
                  <el-button
                    type='primary'
                    onClick={() => {
                      this.toBaseForm(scope.row)
                    }}
                  >
                    {this.roles.includes('shiji') ? '审核' : '查看'}
                  </el-button>
                  <el-button
                    type='warning'
                    disabled={scope.row.state !== 2}
                    onClick={() => {
                      this.createBaseAccount(scope.row)
                    }}
                  >
                    创建基地账号
                  </el-button>
                </div>
              )
            }
          }
        ],
        data: []
      },
      baseId: -1,
      disabled: false
    }
  },
  computed: {
    ...mapGetters(['device', 'roles']),
    submitText() {
      if (this.roles.includes('shiji')) {
        return '审核通过'
      } else {
        return '提交'
      }
    },
    dialogWidth() {
      console.log(this.device)
      if (this.device === 'desktop') {
        return '1200px'
      } else {
        return '95%'
      }
    }
  },
  mounted() {
    this.getBaseList(this.roles)
  },
  methods: {
    addBase() {
      this.disabled = false
      this.formData = {}
      this.baseId = -1
      this.dialogFormVisible = true
    },
    approve() {
      validBase({ id: this.baseId, state: 2 }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '审核通过',
            type: 'success'
          })
        }
      })
    },
    sendBack() {
      validBase({ id: this.baseId, state: 3 }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '退回成功',
            type: 'success'
          })
        }
      })
    },
    toBaseForm(row) {
      if (row.state !== 3) {
        this.disabled = true
      }

      const temp = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
      this.baseId = row.id
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
    },
    // 审核通过后创建基地账号
    createBaseAccount(row) {
      generateBaseAccount({ id: row.id }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '基地账号创建成功！',
            type: 'success'
          })
        }
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add {
  margin-bottom: 20px;
}
.button-group {
  display: flex;
  justify-content: center;
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
