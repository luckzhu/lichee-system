<template>
  <div class="subsidy-approved">
    <div style="margin-bottom: 20px">
      <!-- <el-select v-model="state" style="margin-left:20px" placeholder="状态筛选">
        <el-option
          v-for="item in stateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->
      <export-excel table-id="subsidy" file-name="物流补助核准汇总表">导出汇总表</export-excel>
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
    />
    <!-- 分页 -->
    <!-- pagination
      :current-page.sync="currentPage"
      :total="records"
      :page-size="pageSize"
    @p-current-change="handleCurrentChange"-->
  </div>
</template>

<script>
import ExportExcel from '@/components/Export2Excel'
import { queryLogisticsByRegion } from '@/api/base'
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
        }
      ],
      tableData: [],
      currentPage: 1,
      pageSize: 100000,
      records: 20,
      stateOptions: [
        { value: 100, label: '所有补助' },
        { value: 0, label: '未核准' },
        { value: 1, label: '已核准' }
      ],
      state: 100
    }
  },
  computed: {
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
    this.getLogistics()
  },
  methods: {
    async getLogistics({
      pageSize = this.pageSize,
      page = this.currentPage
    } = {}) {
      const { rows: data, records } = await queryLogisticsByRegion({
        pageSize,
        page
      })
      data.map(item => {
        let result = (item.num * item.weight) / 1000
        if (result.toString().indexOf('.') > -1) {
          result = result.toFixed(4)
        }
        this.$set(item, 'totalWeight', result)
      })
      this.tableData = data
      this.records = records
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getEnterprises()
    },
    handleCurrentChange(val) {
      this.getEnterprises({ page: val })
    }
  }
}
</script>

<style lang="scss" scoped>
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

<style lang='scss'>
// 放在一个类名下, 防止污染其他样式
// .subsidy-approved {
//   .el-table {
//     overflow: auto;
//   }
//   .el-table__body-wrapper,
//   .el-table__header-wrapper,
//   .el-table__footer-wrapper {
//     overflow: visible;
//   }
//   .el-table::after {
//     position: relative !important;
//   }
// }
</style>
