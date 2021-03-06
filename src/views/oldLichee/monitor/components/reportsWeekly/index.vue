<template>
  <div>
    <lb-table
      :column="tableColumn"
      :data="tableData.data"
      :merge="['issue']"
      border
      align="center"
      :cell-class-name="cellClass"
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
      tableData: {
        column: [
          {
            prop: 'issue',
            label: '期号'
          },
          {
            prop: 'name',
            label: '基地名称',
            minWidth: '100px',
            formatter: row => {
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
            formatter: row => parseTime(row.dataBegin, '{y}-{m}-{d}')
          },
          {
            prop: 'dataEnd',
            label: '结束日期',
            formatter: row => parseTime(row.dataEnd, '{y}-{m}-{d}')
          },
          {
            prop: 'endTime',
            label: '截止日期',
            formatter: row => parseTime(row.endTime, '{y}-{m}-{d}')
          },
          {
            prop: 'state',
            label: '填报状态',
            render: (h, scope) => {
              return (
                <div>
                  <el-tag type={stateMap[scope.row.state].type}>
                    {stateMap[scope.row.state].label}
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
                    disabled={scope.row.currIssue === 0}
                    onClick={() => {
                      this.handleEdit(scope.$index, scope.row)
                    }}
                  >
                    填报
                  </el-button>
                </div>
              )
            }
          }
        ],
        mobileColumn: [
          {
            prop: 'issue',
            label: '期号',
            width: '140px'
          },
          {
            prop: 'state',
            label: '填报状态',
            width: '80px',
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
                    disabled={scope.row.currIssue === 0}
                    onClick={() => {
                      this.handleEdit(scope.$index, scope.row)
                    }}
                  >
                    填报
                  </el-button>
                </div>
              )
            }
          },
          {
            prop: 'endTime',
            label: '截止日期',
            width: '100px',
            formatter: row => parseTime(row.endTime, '{y}-{m}-{d}')
          }
        ],
        data: []
      }
    }
  },
  computed: {
    ...mapGetters(['device']),
    roles() {
      return this.$store.getters.roles
    },
    tableColumn() {
      return this.device === 'desktop'
        ? this.tableData.column
        : this.tableData.mobileColumn
    }
  },
  mounted() {
    this.getIssue(this.roles)
  },
  methods: {
    handleEdit(index, row) {
      const { id } = row
      this.$router.push({
        path: '/lichee/weeklyForm',
        query: { id }
      })
    },
    getIssue(roles) {
      if (roles.includes('nongye')) {
        queryIssueByUnitId().then(res => {
          this.tableData.data = res.rows
        })
      } else if (roles.includes('jidi')) {
        queryIssueByBaseId().then(res => {
          this.tableData.data = res.rows
        })
      }
    },
    cellClass({ row, column, rowIndex, columnIndex }) {
      if (row.currIssue === 1) {
        return 'currIssue'
      }
    }
  }
}
</script>

<style lang="scss" >
.currIssue {
  color: #b33038;
}
</style>
