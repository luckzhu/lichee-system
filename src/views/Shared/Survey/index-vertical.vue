<template>
  <div>
    <lb-table :column="columns" :data="tableData" border align="center" />
    <footer>
      <el-button type="primary" @click="save">保存但不提交</el-button>
      <el-button type="success" @click="submit">数据无误并提交</el-button>
    </footer>
  </div>
</template>

<script>
import { getUnitIndustry, addOrUpdateUnitIndustry } from '@/api/base'

export default {
  props: {
    categoryAndBreed: {
      type: Object,
      default: () => {
        return {
          name: '柚子',
          categoryId: 200,
          bIds: {
            201: '红肉蜜柚',
            302: '白肉蜜柚',
            303: '沙田柚'
          }
        }
      }
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  computed: {
    columns() {
      const general = [
        {
          prop: 'bId',
          label: '品种',
          formatter: (row) => this.categoryAndBreed.bIds[row.bId]
        },
        {
          prop: 'isProduce',
          label: '是否生产',
          minWidth: '140px',
          render: (h, scope) => {
            return (
              <div>
                <el-radio-group v-model={scope.row.isProduce}>
                  <el-radio label={1}>是</el-radio>
                  <el-radio label={0}>否</el-radio>
                </el-radio-group>
              </div>
            )
          }
        }
      ]
      const indicator = [
        {
          label: '采收面积（亩）',
          present: 'recoveryScale',
          next: 'nextRecoveryScale'
        },
        {
          label: '成花率（%）',
          present: 'flowerRate',
          next: 'nextFlowerRate'
        },
        {
          label: '种植密度（棵/亩）',
          present: 'plantingDensity',
          next: 'nextPlantingDensity'
        },
        {
          label: '挂果量（个/棵）',
          present: 'fruitBearing',
          next: 'nextFruitBearing'
        },
        {
          label: '上市时间（*月*日）',
          present: 'saleTime',
          next: 'nextSaleTime'
        },
        {
          label: '上市价格（元/公斤）',
          present: 'salePrice',
          next: 'nextSalePrice'
        },
        {
          label: '产量（吨）',
          present: 'yield',
          next: 'nextYield'
        },
        {
          label: '种植成本（元/亩）',
          type: 'multiField',
          children: [
            { label: '人工成本', field: 'laborCost' },
            { label: '农药、肥料等', field: 'pesticides' },
            { label: '种苗', field: 'seedlings' },
            { label: '机械', field: 'mechanics' },
            { label: '其他', field: 'other' },
            { label: '合计', field: 'sum' }
          ]
        }
      ]
      const arr = []
      indicator.forEach((item) => {
        if (item.type === 'multiField') {
          const childArr = []
          item.children.forEach((child) => {
            childArr.push({
              label: child.label,
              prop: child.field,
              minWidth: '150px',
              align: 'center',
              render: (h, scope) => {
                return (
                  <div>
                    <el-input-number
                      v-model={scope.row[child.field]}
                      controls={false}
                      min={0}
                      size='small'
                    ></el-input-number>
                  </div>
                )
              }
            })
          })
          arr.push({ label: item.label, children: childArr })
        } else {
          arr.push({
            label: item.label,
            children: [
              {
                label: '2019年',
                prop: item.present,
                minWidth: '150px',
                align: 'center',
                render: (h, scope) => {
                  return (
                    <div>
                      <el-input-number
                        v-model={scope.row[item.present]}
                        controls={false}
                        min={0}
                        size='small'
                      ></el-input-number>
                    </div>
                  )
                }
              },
              {
                label: '2020年',
                prop: item.next,
                minWidth: '150px',
                align: 'center',
                render: (h, scope) => {
                  return (
                    <div>
                      <el-input-number
                        v-model={scope.row[item.next]}
                        controls={false}
                        min={0}
                        size='small'
                      ></el-input-number>
                    </div>
                  )
                }
              }
            ]
          })
        }
      })
      return [...general, ...arr]
    }
  },
  mounted() {
    this.getBaseSurveyTable()
  },
  methods: {
    async getBaseSurveyTable() {
      const initData = this.initData()
      const { data: { info }} = await getUnitIndustry({ year: 2020 })
      if (info && info.length === 0) {
        this.tableData = initData
      } else {
        this.tableData = info
      }
    },
    initData() {
      const breedIds = this.categoryAndBreed.bIds
      const initData = []
      for (const key in breedIds) {
        initData.push({ bId: Number(key) })
      }
      return initData
    },
    save() {
      this.postData()
    },
    submit() {
      this.postData()
    },
    async  postData() {
      const postData = JSON.stringify(this.tableData)
      const res = await addOrUpdateUnitIndustry({ data: postData })
      console.log(res)
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
