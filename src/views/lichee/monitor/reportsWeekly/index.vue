<template>
  <div>
    <lb-table
      :column="tableColumn"
      :data="tableData.data"
      :merge="['issue']"
      border
      stripe
      align="center"
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
            minWidth: '100px'
          },
          {
            prop: 'dataBegin',
            label: '开始日期',
            formatter: row => parseTime(row.dataBegin, '{y}-{m}-{d}')
          },
          {
            prop: 'dataEnd',
            label: '结束日期',
            formatter: row => parseTime(row.dataBegin, '{y}-{m}-{d}')
          },
          {
            prop: 'endTime',
            label: '截止日期',
            formatter: row => parseTime(row.dataBegin, '{y}-{m}-{d}')
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
            label: '期号'
          },
          {
            prop: 'name',
            label: '基地名称',
            minWidth: '100px'
          },
          {
            label: '操作',
            render: (h, scope) => {
              return (
                <div>
                  <el-button
                    size='mini'
                    type='primary'
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
            prop: 'endTime',
            label: '截止日期',
            formatter: row => parseTime(row.dataBegin, '{y}-{m}-{d}')
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
