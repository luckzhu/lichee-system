<template>
  <div>
    <div class="issue-info">
      <p>
        填报期号：
        <span>20200514</span>
      </p>
      <p>
        生产基地：
        <span>不知道种点啥的荔枝基地</span>
      </p>
    </div>
    <lb-table :column="tableData.column" :data="tableData.data" border stripe align="center" />

    <footer>
      <el-button type="primary">保存但不提交</el-button>
      <el-button type="success">数据无误并提交</el-button>
    </footer>
  </div>
</template>

<script>
import LbTable from '@/components/LbTable'

export default {
  name: 'Form',
  components: {
    LbTable
  },
  data() {
    return {
      tableData: {
        column: [
          {
            prop: 'breedName',
            label: '品种',
            width: '80px'
          },
          {
            prop: 'onMarket',
            label: '是否上市',

            render: (h, scope) => {
              return (
                <div>
                  <el-radio-group v-model={scope.row.onMarket}>
                    <el-radio label={1}>是</el-radio>
                    <el-radio label={0}>否</el-radio>
                  </el-radio-group>
                </div>
              )
            }
          },
          {
            label: '本周上市情况',

            children: [
              {
                label: '基地本周上市量（公斤）',
                prop: 'MarketVolume_thisWeek',
                align: 'center',
                render: (h, scope) => {
                  return (
                    <div>
                      <el-input-number
                        v-model={scope.row.MarketVolume_thisWeek}
                        controls={false}
                        size='small'
                        disabled={!scope.row.onMarket}
                      ></el-input-number>
                    </div>
                  )
                }
              },
              {
                label: '基地田头大宗最高价（元/公斤）',
                prop: 'highestPrice_thisWeek',
                align: 'center',
                render: (h, scope) => {
                  return (
                    <div>
                      <el-input-number
                        v-model={scope.row.MarketVolume_thisWeek}
                        controls={false}
                        size='small'
                        disabled={!scope.row.onMarket}
                      ></el-input-number>
                    </div>
                  )
                }
              },
              {
                label: '基地田头大宗最低价（元/公斤）',
                prop: 'lowestPrice_thisWeek',
                align: 'center',
                render: (h, scope) => {
                  return (
                    <div>
                      <el-input-number
                        v-model={scope.row.MarketVolume_thisWeek}
                        controls={false}
                        size='small'
                        disabled={!scope.row.onMarket}
                      ></el-input-number>
                    </div>
                  )
                }
              }
            ]
          },
          {
            label: '下周预计上市情况',
            children: [
              {
                label: '预计下周价格（元/公斤）',
                prop: 'price_nextWeek',
                align: 'center',
                render: (h, scope) => {
                  return (
                    <div>
                      <el-input-number
                        v-model={scope.row.MarketVolume_thisWeek}
                        controls={false}
                        size='small'
                        disabled={!scope.row.onMarket}
                      ></el-input-number>
                    </div>
                  )
                }
              },
              {
                label: '预计下周基地上市量（公斤）',
                prop: 'MarketVolume_nextWeek',
                align: 'center',
                render: (h, scope) => {
                  return (
                    <div>
                      <el-input-number
                        v-model={scope.row.MarketVolume_thisWeek}
                        controls={false}
                        size='small'
                        disabled={!scope.row.onMarket}
                      ></el-input-number>
                    </div>
                  )
                }
              }
            ]
          }
        ],
        data: [
          {
            breedName: '妃子笑',
            onMarket: 1,
            MarketVolume_thisWeek: 10,
            highestPrice_thisWeek: 20,
            lowestPrice_thisWeek: 30,
            price_nextWeek: 40,
            MarketVolume_nextWeek: 15
          },
          {
            breedName: '白糖罂',
            onMarket: 1,
            MarketVolume_thisWeek: 10,
            highestPrice_thisWeek: 20,
            lowestPrice_thisWeek: 30,
            price_nextWeek: 40,
            MarketVolume_nextWeek: 15
          },
          {
            breedName: '桂味',
            onMarket: 0
          },
          {
            breedName: '黑叶',
            onMarket: 1,
            MarketVolume_thisWeek: 10,
            highestPrice_thisWeek: 20,
            lowestPrice_thisWeek: 30,
            price_nextWeek: 40,
            MarketVolume_nextWeek: 15
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
footer {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  height: 50px;
  padding-top: 10px;
  padding-right: 20px;
  background-color: rgba(17, 1, 1, 0.7);
  width: 100%;
  z-index: 100;
  overflow: hidden;
  text-align: right;
}
</style>
