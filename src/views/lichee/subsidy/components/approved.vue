<template>
  <div class="subsidy-approved">
    <div style="margin-bottom: 20px">
      <el-button type="primary" size="mini" @click="openDialog">核准所选物流</el-button>

      <el-select v-model="state" style="margin-left:20px" placeholder="状态筛选">
        <el-option
          v-for="item in stateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <export-excel
        table-id="subsidy"
        file-name="物流补助核准汇总表"
        :filter-arr="['selection','handle']"
      >导出汇总表</export-excel>
      <span class="describe">提示：核准物流前，请先绑定批号</span>
    </div>
    <!-- 表格 -->
    <lb-table
      id="subsidy"
      ref="brandTable"
      :column="tableDesc"
      :data="myTableData"
      border
      stripe
      align="center"
      show-summary
      :summary-method="getSummaries"
      @selection-change="handleSelectionChange"
    />

    <el-dialog
      title="核准物流补助"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <div class="operation">
        <section class="item">
          <el-table
            :data="selectedData"
            border
            highlight-current-row
            style="width: 100%;margin-top:20px;"
          >
            <el-table-column
              v-for="item of selectedTableDesc"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              min-width="item.minWidth"
              :formatter="item.formatter"
            />
          </el-table>
          <!-- <lb-table
            id="subsidy"
            ref="brandTable"
            :column="selectedTableDesc"
            :data="selectedData"
            border
            stripe
            align="center"
          />-->
          <div class="button-group">
            <el-button type="primary" @click="confirmLogistics(1)">核准以上物流补助</el-button>
            <el-button type="danger" @click="confirmLogistics(0)">取消核准以上物流补助</el-button>
          </div>
        </section>
      </div>
    </el-dialog>

    <el-dialog title="选择批号" :visible.sync="batchNumberDialogVisible" width="30%">
      <div class="operation">
        <section class="item">
          <!-- <p class="title">选择批号：</p> -->
          <el-select v-model="identificationId" placeholder="请选择">
            <el-option
              v-for="item in identification"
              :key="item.id"
              :label="item.batchNumber"
              :value="item.id"
            />
          </el-select>
          <el-button type="primary" class="button" @click="confirmBind">确定绑定</el-button>
        </section>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ExportExcel from '@/components/Export2Excel'
import {
  queryLogisticsInfoByProUnit,
  queryIdentification,
  confirmLogistics,
  bindIdentificaionToLogis
} from '@/api/base'
import { parseTime } from '@/utils/index'

export default {
  name: 'Subsidy',
  components: {
    ExportExcel
  },
  data() {
    return {
      tableDesc: [
        {
          type: 'selection',
          className: 'selection',
          selectable: row => {
            return row.batchNumber
          }
        },
        {
          label: '序号',
          type: 'index'
        },
        {
          label: '生产企业',
          prop: 'unitName',
          minWidth: '200px'
        },
        {
          label: '物流企业',
          prop: 'logUnitName',
          minWidth: '200px'
        },
        {
          label: '承运数量（件）',
          prop: 'num',
          minWidth: '120px'
        },
        {
          label: '重量规格（公斤/件）',
          prop: 'weight',
          minWidth: '140px'
        },
        {
          label: '承运总重（吨）',
          prop: 'totalWeight',
          minWidth: '140px',
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
          label: '发货日期',
          prop: 'sendTime',
          minWidth: '100px',
          formatter: row => parseTime(row.sendTime, '{y}-{m}-{d}')
        },
        {
          label: '到达日期',
          prop: 'landTime',
          minWidth: '100px',
          formatter: row => parseTime(row.landTime, '{y}-{m}-{d}')
        },
        {
          label: '收货信息',
          children: [
            {
              label: '收货人',
              prop: 'name',
              align: 'center',
              minWidth: '100px'
            },
            {
              label: '联系电话',
              prop: 'phone',
              align: 'center',
              minWidth: '100px'
            },
            {
              label: '收货地址',
              prop: 'address',
              align: 'center',
              minWidth: '200px'
            }
          ]
        },
        {
          label: '核准物流补助（吨）',
          prop: 'confirm',
          minWidth: '140px',
          render: (h, scope) => {
            const { confirm } = scope.row
            if (confirm === 1) {
              return <el-tag type='success'>已核准</el-tag>
            } else {
              return <el-tag>未核准</el-tag>
            }
          }
        },
        {
          label: '已绑定批号',
          minWidth: '140px',
          prop: 'batchNumber'
        },
        {
          label: '操作',
          minWidth: '140px',
          className: 'handle',
          render: (h, scope) => {
            return (
              <el-button
                onClick={() => this.bindBatchNumber(scope.row)}
                type='primary'
              >
                绑定批号
              </el-button>
            )
          }
        }
      ],
      // TO DO 应重构为tableDesc的条件渲染
      selectedTableDesc: [
        {
          label: '生产企业',
          prop: 'unitName',
          minWidth: '160px'
        },
        {
          label: '物流企业',
          prop: 'logUnitName',
          minWidth: '160px'
        },
        {
          label: '承运数量（件）',
          prop: 'num',
          minWidth: '120px'
        },
        {
          label: '重量规格（公斤/件）',
          prop: 'weight',
          minWidth: '140px'
        },
        {
          label: '承运总重（吨）',
          minWidth: '140px',
          formatter: row => {
            return (row.num * row.weight) / 1000
          },
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
          label: '发货日期',
          prop: 'sendTime',
          minWidth: '100px',
          formatter: row => parseTime(row.sendTime, '{y}-{m}-{d}')
        },
        {
          label: '到达日期',
          prop: 'landTime',
          minWidth: '100px',
          formatter: row => parseTime(row.landTime, '{y}-{m}-{d}')
        },
        // {
        //   label: '收货信息',
        //   children: [
        { label: '收货人', prop: 'name', align: 'center' },
        { label: '联系电话', prop: 'phone', align: 'center' },
        {
          label: '收货地址',
          prop: 'address',
          align: 'center',
          minWidth: '160px'
        }
        // ]
        // }
      ],
      tableData: [],
      identification: [],
      selectedIds: [],
      dialogVisible: false,
      batchNumberDialogVisible: false,
      // 选择的是batchNumber，但是需要传递identificationId
      identificationId: null,
      editingLogistics: {},
      stateOptions: [
        { value: 100, label: '所有补助' },
        { value: 0, label: '未核准' },
        { value: 1, label: '已核准' }
      ],
      state: 100
    }
  },
  computed: {
    selectedData() {
      return this.tableData.filter(item => this.selectedIds.includes(item.id))
    },
    myTableData() {
      const { state } = this
      let tableData = this.tableData
      // 其实应该是判断不等于100，但由于confirm不给初始状态
      // 所以需要单独判断
      if (state === 1) {
        tableData = tableData.filter(item => item.confirm === state)
      } else if (state === 0) {
        tableData = tableData.filter(
          item => item.confirm === state || !item.confirm
        )
      }
      return tableData
    }
  },
  mounted() {
    this.getIdentification()
    this.getLogistics()
  },
  methods: {
    async getLogistics() {
      const { rows: data } = await queryLogisticsInfoByProUnit({
        pageSize: 100000
      })
      data.map(item => {
        let result = (item.num * item.weight) / 1000
        if (result.toString().indexOf('.') > -1) {
          result = result.toFixed(4)
        }
        this.$set(item, 'totalWeight', result)
      })
      this.tableData = data
    },
    async getIdentification() {
      // state=2，只找确定过的批号
      const { rows: data } = await queryIdentification({ state: 2 })
      this.identification = data
    },
    openDialog() {
      const { selectedIds } = this
      if (selectedIds.length === 0) {
        this.$message('请至少选择一条物流信息')
        return
      }
      this.dialogVisible = true
    },
    async confirmLogistics(confirm) {
      const { selectedIds } = this
      const id = selectedIds.join(',')
      const res = await confirmLogistics({ confirm, id })

      this.$message(res.data.info)
      this.dialogVisible = false
      this.getLogistics()
    },
    bindBatchNumber(row) {
      this.editingLogistics = row
      this.batchNumberDialogVisible = true
    },
    async confirmBind() {
      const { identificationId } = this
      const { id: logisticsId } = this.editingLogistics
      const res = await bindIdentificaionToLogis({
        identificationId,
        logisticsId
      })
      if (res.code === 200) {
        this.$message.success('绑定成功')
        this.batchNumberDialogVisible = false
        this.getLogistics()
      } else {
        this.$message(res.data.info)
      }
    },
    handleSelectionChange(val) {
      const arr = []
      val.map(item => {
        if (!arr.includes(item.id)) {
          arr.push(item.id)
        }
      })
      this.selectedIds = arr
    },
    // 表格 合计栏
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      const needSummary = ['num', 'totalWeight']
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计'
          return
        }
        if (needSummary.includes(column.property)) {
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
        } else if (column.property === 'confirm') {
          const values = data.map(item =>
            item.confirm === 1 ? Number(item['totalWeight']) : Number(0)
          )
          if (!values.every(value => isNaN(value))) {
            sums[index] = values
              .reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
              .toFixed(4)
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.describe {
  display: inline-block;
  font-size: 14px;
  margin-left: 20px;
}
.operation {
  .item {
    margin: 0 0 30px 10px;
    .button-group {
      margin-top: 20px;
    }
    .button {
      margin-left: 20px;
    }
  }
}
</style>
