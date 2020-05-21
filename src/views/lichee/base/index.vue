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
          <el-button :disabled="approved" type="primary" @click="approve">审核通过</el-button>
          <el-button :disabled="approved" type="danger" @click="sendBack">退回</el-button>
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
import {
  queryBase,
  queryBaseByRegionCode,
  validBase,
  generateBaseAccount
} from '@/api/base'
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
            label: '企业字号',
            width: '200px'
          },
          {
            prop: 'cityName',
            label: '市/县（区）',
            width: '100px',
            formatter: row => row.cityName + row.countyName
          },
          {
            prop: 'address',
            label: '基地详细地址',
            width: '160px'
          },
          {
            prop: 'contactName',
            label: '联系人'
          },
          {
            prop: 'contactPhone',
            label: '手机号',
            width: '120px'
          },
          {
            prop: 'scale',
            label: '基地面积（亩）',
            width: '120px'
          },
          {
            prop: 'yield',
            label: '预计产量（公斤）',
            width: '120px'
          },
          {
            prop: 'coldScale',
            label: '冷库容积（m³）',
            width: '120px'
          },
          {
            prop: 'coldCar',
            label: '冷链车（台）',
            width: '120px'
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
            width: '100px',
            render: (h, scope) => {
              const { state } = scope.row
              return (
                <div>
                  <el-tag type={state ? stateMap[state].type : ''}>
                    {state !== 0 && !state ? '无状态' : stateMap[state].label}
                  </el-tag>
                </div>
              )
            }
          },
          {
            prop: 'haveAccount',
            label: '基地账号',
            width: '100px',
            renderHeader: (h, scope) => {
              return (
                <el-tooltip
                  class='item'
                  effect='dark'
                  content='生成基地账号后，基地可用手机短信登录系统'
                  placement='top-start'
                >
                  <div class='title-icon'>{scope.column.label}<i class='el-icon-warning'></i></div>
                </el-tooltip>
              )
            },
            render: (h, scope) => {
              const { haveAccount } = scope.row
              return (
                <div>
                  <el-tag type={haveAccount ? 'success' : 'info'}>
                    {haveAccount ? '已生成' : '未生成'}
                  </el-tag>
                </div>
              )
            }
          },
          {
            label: '操作',
            width: '240px',
            render: (h, scope) => {
              let create
              if (this.roles.includes('nongye')) {
                create = (
                  <el-button
                    type='warning'
                    disabled={scope.row.state !== 2}
                    onClick={() => {
                      this.createBaseAccount(scope.row)
                    }}
                  >
                    创建基地账号
                  </el-button>
                )
              }
              return (
                <div className='button-group'>
                  <el-button
                    type={scope.row.state !== 2 ? 'primary' : 'warning'}
                    onClick={() => {
                      this.toBaseForm(scope.row)
                    }}
                  >
                    {this.roles.includes('shiji') && scope.row.state !== 2
                      ? '审核'
                      : '查看'}
                  </el-button>
                  {create}
                </div>
              )
            }
          }
        ],
        data: []
      },
      baseId: -1,
      disabled: false,
      approved: false
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
      // 除了退回再修改，提交后不让编辑
      if (row.state !== 3) {
        this.disabled = true
      }
      // 审核通过后，禁用审核按钮
      if (row.state === 2) {
        this.approved = true
      } else {
        this.approved = false
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
.title-icon{
  display: flex;
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
