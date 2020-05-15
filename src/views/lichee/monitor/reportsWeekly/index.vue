<template>
  <div>
    <lb-table
      :column="tableData.column"
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
            prop: 'baseName',
            label: '基地名称',
            minWidth: '100px'
          },
          {
            prop: 'period',
            label: '填报周期'
          },
          {
            prop: 'deadline',
            label: '截止日期'
          },
          {
            prop: 'breeds',
            label: '已登记品种',
            minWidth: '140px'
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
        data: [
          {
            id: 1,
            issue: '20200506',
            period: '0430 ~ 0506',
            deadline: '0508',
            baseName: '不知道种点啥的荔枝基地',
            breeds: '妃子笑，白糖罂，桂味，黑叶，糯米糍，怀枝',
            state: -1
          },
          {
            id: 2,
            issue: '20200506',
            period: '0430 ~ 0506',
            deadline: '0508',
            baseName: '不知道种点啥的荔枝基地22',
            breeds: '妃子笑，白糖罂',
            state: 1
          },
          {
            id: 3,
            issue: '20200513',
            period: '0507 ~ 0513',
            deadline: '0515',
            baseName: '不知道种点啥的荔枝基地',
            breeds: '妃子笑，白糖罂，桂味，黑叶，糯米糍，怀枝',
            state: 2
          },
          {
            id: 4,
            issue: '20200513',
            period: '0507 ~ 0513',
            deadline: '0515',
            baseName: '不知道种点啥的荔枝基地22',
            breeds: '妃子笑，白糖罂',
            state: 3
          }
        ]
      }
    }
  },
  methods: {
    handleEdit(index, row) {
      const { id } = row

      this.$router.push({
        path: '/lichee/weeklyForm',
        query: { id }
      })
      console.log(index, row)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
