<template>
  <div>
    <el-button type="primary" class="add" @click="addBase">新增生产基地</el-button>
    <lb-table :column="tableData.column" :data="tableData.data" border stripe align="center" />

    <!-- 新增基地表单 -->
    <!-- <div class="addDailog">
      <el-dialog
        title="新增生产基地"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
        width="50%"
        top="10vh"
        center
      >
        <add-base-form ref="addBaseForm" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>-->

    <AddBaseFormDialog ref="addBaseForm" />
  </div>
</template>

<script>
import LbTable from '@/components/LbTable'
// import AddBaseForm from './components/AddBaseForm'
import AddBaseFormDialog from './components/AddBaseFormDialog'
import { queryBase } from '@/api/base'
import { stateMap } from '@/utils/submit'

export default {
  name: 'Base',
  components: {
    LbTable,
    // AddBaseForm,
    AddBaseFormDialog
  },
  data() {
    return {
      tableData: {
        column: [
          {
            prop: 'enterpriseName',
            label: '企业字号'
          },
          {
            prop: 'cityAndCounty',
            label: '地级市/县（区）'
          },
          {
            prop: 'address',
            label: '基地详细地址'
          },
          {
            prop: 'contact',
            label: '联系人'
          },
          {
            prop: 'phone',
            label: '手机号'
          },
          {
            prop: 'area',
            label: '基地面积（亩）'
          },
          {
            prop: 'yield',
            label: '预计产量（公斤）'
          },
          {
            prop: 'coldStorageVolume',
            label: '冷库容积（m³）'
          },
          {
            prop: 'coldChainCar',
            label: '冷链车（台）'
          },
          {
            prop: 'classifyingEquipments',
            label: '分级设备',
            formatter: row => (row.classifyingEquipments ? '有' : '无')
          },
          {
            prop: 'balingEquipment',
            label: '打包设备',
            formatter: row => (row.balingEquipment ? '有' : '无')
          },
          {
            prop: 'expressSite',
            label: '快递驻点',
            formatter: row => (row.expressSite ? '有' : '无')
          },
          {
            prop: 'exportFiling',
            label: '出口备案',
            formatter: row => (row.exportFiling ? '有' : '无')
          },
          {
            prop: 'state',
            label: '状态',
            render: (h, scope) => {
              return (
                <div>
                  <el-tag type={stateMap[scope.row.state].type}>
                    {stateMap[scope.row.state].label}
                  </el-tag>
                </div>
              )
            }
          }
        ],
        data: [
          {
            enterpriseName: '老字号',
            cityAndCounty: '广东省天河区',
            address: '农科院创新大楼231',
            contact: '大傻子',
            phone: '12345678900',
            area: 20,
            yield: 30,
            coldStorageVolume: 40,
            coldChainCar: 15,
            classifyingEquipments: 1,
            balingEquipment: 0,
            expressSite: 1,
            exportFiling: 1,
            state: 1
          },
          {
            enterpriseName: '老字号',
            cityAndCounty: '广东省天河区',
            address: '农科院创新大楼230',
            contact: '二傻子',
            phone: '12345678900',
            area: 20,
            yield: 30,
            coldStorageVolume: 40,
            coldChainCar: 15,
            classifyingEquipments: 1,
            balingEquipment: 0,
            expressSite: 1,
            exportFiling: 1,
            state: 1
          }
        ]
      }
    }
  },
  mounted() {
    queryBase().then(res => {
      console.log(res)
    })
  },
  methods: {
    addBase() {
      console.log(111)
      this.$refs.addBaseForm.$emit('open')
      console.log(22)
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
