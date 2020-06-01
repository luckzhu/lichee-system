<template>
  <div>
    <lb-table
      ref="brandTable"
      :column="tableDesc"
      :data="tableData"
      border
      stripe
      align="center"
      :merge="['cityName','countyName']"
      pagination
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[5, 10, 20, 30]"
      :pager-count="5"
      :current-page.sync="currentPage"
      :total="records"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @p-current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { queryUnit, validUnit } from '@/api/user'
import { stateMap } from '@/utils/submit'

export default {
  data() {
    return {
      tableDesc: [
        {
          label: '序号',
          type: 'index'
        },
        {
          label: '市',
          prop: 'cityName',
          width: '100px'
        },
        {
          label: '县/区',
          prop: 'countyName',
          width: '100px'
        },
        {
          label: '企业名称',
          prop: 'unitName',
          minWidth: '200px'
        },
        {
          label: '统一社会信用代码',
          prop: 'orgCode',
          minWidth: '200px'
        },
        {
          label: '联系人',
          prop: 'contactName'
        },
        {
          label: '手机',
          prop: 'contactPhone',
          minWidth: '100px'
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
          label: '操作',
          width: '220px',
          render: (h, scope) => {
            return (
              <div className='button-group'>
                <el-button
                  type='primary'
                  loading={scope.row === this.currentClick && this.loading}
                  onClick={() => this.handleValidUnit(scope.row, 2)}
                >
                  审核通过
                </el-button>
                <el-button
                  type='danger'
                  loading={scope.row === this.currentClick && this.loading}
                  onClick={() => this.handleValidUnit(scope.row, 3)}
                >
                  退回
                </el-button>
              </div>
            )
          }
        }
      ],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      records: 20,
      loading: false,
      currentClick: null
    }
  },
  mounted() {
    this.getEnterprises()
  },
  methods: {
    async getEnterprises({
      pageSize = this.pageSize,
      page = this.currentPage
    } = {}) {
      const { rows: data, records } = await queryUnit({ pageSize, page })
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
    },
    async handleValidUnit(row, state) {
      this.currentClick = row
      this.loading = true
      const { userId } = row
      const res = await validUnit({ userId, state })
      if (res.code === 200) {
        this.$message(res.data.info)
        this.getEnterprises()
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
