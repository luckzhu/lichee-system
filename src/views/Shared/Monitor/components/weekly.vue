<template>
  <div>
    <lb-table
      :column="columns"
      :data="tableData"
      :merge="['issue']"
      border
      align="center"
      :cell-class-name="cellClass"
      pagination
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10,50,200,500]"
      :pager-count="5"
      :current-page.sync="page"
      :total="total"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @p-current-change="handleCurrentChange"
    />
    <router-view />
  </div>
</template>

<script>
import LbTable from '@/components/LbTable'
import { stateMap } from '@/utils/submit'
import { queryIssueByUnitId, queryIssueByBaseId } from '@/api/task'
import { parseTime } from '@/utils/index'
import { mapGetters } from 'vuex'

export default {
  name: 'ReportsWeekly',
  components: {
    LbTable
  },
  data() {
    return {
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {
    ...mapGetters(['device']),
    isMobile() {
      return this.device === 'mobile'
    },
    columns() {
      const detailColumns = []
      if (!this.isMobile) {
        detailColumns.push(
          {
            prop: 'name',
            label: '基地名称',
            minWidth: '100px',
            formatter: (row) => {
              if (row.name) {
                return row.name
              } else {
                return this.$store.getters.name
              }
            }
          },
          {
            prop: 'dataBegin',
            label: '开始日期',
            formatter: (row) => parseTime(row.dataBegin, '{y}-{m}-{d}')
          },
          {
            prop: 'dataEnd',
            label: '结束日期',
            formatter: (row) => parseTime(row.dataEnd, '{y}-{m}-{d}')
          },
          {
            prop: 'endTime',
            label: '截止日期',
            formatter: (row) => parseTime(row.endTime, '{y}-{m}-{d}')
          }
        )
      }
      return [
        {
          prop: 'issue',
          label: '期号',
          minWidth: '130px'
        },
        ...detailColumns,
        {
          prop: 'state',
          label: '填报状态',
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
          render: (h, scope) => {
            return (
              <div>
                <el-button
                  size='mini'
                  type='primary'
                  // disabled={scope.row.currIssue === 0}
                  onClick={() => { this.handleEdit(scope.$index, scope.row) }}
                >
                  填报
                </el-button>
              </div>
            )
          }
        }
      ]
    },
    roles() {
      return this.$store.getters.roles
    },
    isBase() {
      return this.roles.includes('jidi')
    },
    category() {
      return this.$route.meta.category
    },
    bId() {
      return this.$route.meta.bId
    }
  },
  mounted() {
    this.getIssue()
  },
  methods: {
    handleEdit(index, row) {
      const { id } = row
      this.$router.push({
        path: `/form/weekly/${this.category}`,
        query: { id }
      })
    },
    async getIssue() {
      const { bId, page, pageSize } = this
      if (this.isBase) {
        const { rows, records } = await queryIssueByBaseId({ bId, page, pageSize })
        this.tableData = rows
        this.total = records
      } else {
        const { rows, records } = await queryIssueByUnitId({ bId, page, pageSize })
        this.tableData = rows
        this.total = records
      }
    },
    cellClass({ row, column, rowIndex, columnIndex }) {
      if (row.currIssue === 1) {
        return 'currIssue'
      }
    },
    handleCurrentChange(currentPage) {
      this.page = currentPage
      this.getIssue()
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.getIssue()
    }
  }
}
</script>

<style lang="scss" >
.currIssue {
  color: #b33038;
}
</style>
