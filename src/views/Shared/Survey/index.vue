<template>
  <div>
    <table
      v-if="isRenderTable"
      class="table table-border table-bordered text-c"
      style="margin-bottom: 60px; white-space: nowrap"
    >
      <tr>
        <td colspan="2">指标（2020年为预计数目）</td>
        <td v-for="(breed, key) in categoryAndBreed.bIds" :key="key">
          {{ breed }}
        </td>
      </tr>
      <template v-for="item in indicator">
        <tr :key="item.label + 'present'">
          <td rowspan="2">{{ item.label }}</td>
          <td>2019年</td>
          <td v-for="(breed, key) in categoryAndBreed.bIds" :key="key">
            <template v-if="item.type === 'date'">
              <el-date-picker
                v-model="tableData[key][item.present]"
                type="date"
                placeholder="选择日期"
                style="width: 150px"
                value-format="yyyy-MM-dd"
              />
            </template>
            <template v-else>
              <el-input-number
                v-model="tableData[key][item.present]"
                :controls="false"
                :min="0"
                :max="item.max || Infinity"
                style="width: 150px"
              />
            </template>
          </td>
        </tr>
        <tr :key="item.label + 'next'">
          <td>2020年</td>
          <td v-for="(breed, key) in categoryAndBreed.bIds" :key="key">
            <template v-if="item.type === 'date'">
              <el-date-picker
                v-model="tableData[key][item.next]"
                type="date"
                placeholder="选择日期"
                style="width: 150px"
                value-format="yyyy-MM-dd"
              />
            </template>
            <template v-else>
              <el-input-number
                v-model="tableData[key][item.next]"
                :controls="false"
                :min="0"
                :max="item.max || Infinity"
                style="width: 150px"
              />
            </template>
          </td>
        </tr>
      </template>

      <tr>
        <td :rowspan="8">{{ indicatorPart2.label }}</td>
      </tr>

      <tr v-for="item in indicatorPart2.children" :key="item.field">
        <td>{{ item.label }}</td>
        <td v-for="(breed, key) in categoryAndBreed.bIds" :key="key">
          <el-input-number
            v-model="tableData[key][item.field]"
            :controls="false"
            style="width: 150px"
          />
        </td>
      </tr>
    </table>

    <footer>
      <el-button type="primary" @click="save">保存数据</el-button>
      <!-- <el-button type="success" @click="submit">数据无误并提交</el-button> -->
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
            202: '白肉蜜柚',
            203: '沙田柚'
          }
        }
      }
    }
  },
  data() {
    return {
      tableData: {
        201: {},
        202: {},
        203: {}
      },
      indicator: [
        {
          label: '采收面积（亩）',
          present: 'recoveryScale',
          next: 'nextRecoveryScale'
        },
        {
          label: '种植密度（棵/亩）',
          present: 'plantingDensity',
          next: 'nextPlantingDensity'
        },
        {
          label: '成花率（%）',
          present: 'flowerRate',
          next: 'nextFlowerRate',
          max: 100
        },
        {
          label: '坐果率（%）',
          present: 'fruitBearing',
          next: 'nextFruitBearing',
          max: 100
        },
        {
          label: '上市时间',
          present: 'saleTime',
          next: 'nextSaleTime',
          type: 'date'
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
        }
      ],
      indicatorPart2: {
        label: '种植成本（元/亩）',
        children: [
          { label: '人工成本', field: 'laborCost' },
          { label: '农药、肥料等', field: 'pesticides' },
          { label: '土地成本', field: 'landCost' },
          { label: '种苗', field: 'seedlings' },
          { label: '机械', field: 'mechanics' },
          { label: '其他', field: 'other' },
          { label: '合计', field: 'sum' }
        ]
      },
      isRenderTable: false
    }
  },
  computed: {},
  mounted() {
    this.getBaseSurveyTable()
  },
  methods: {
    async getBaseSurveyTable() {
      const {
        data: { info }
      } = await getUnitIndustry({
        year: 2020,
        bId: this.categoryAndBreed.categoryId
      })

      if (info && info.length === 0) {
        this.initData()
      } else {
        this.revertData(info)
      }

      this.isRenderTable = true
    },
    initData() {
      const obj = {}
      Object.keys(this.categoryAndBreed.bIds).forEach((item) => {
        Object.assign(obj, { [item]: {}})
      })
      this.tableData = obj
    },
    revertData(data) {
      const obj = {}
      data.forEach((item) => {
        for (const key in item) {
          if (!item[key]) {
            delete item[key]
          }
        }
        Object.assign(obj, { [item.bId]: item })
      })
      Object.keys(this.categoryAndBreed.bIds).forEach((ele) => {
        const objKeys = Object.keys(obj)
        if (!objKeys.includes(ele)) {
          Object.assign(obj, { [ele]: {}})
        }
      })
      this.tableData = obj
    },
    save() {
      this.postData()
    },
    submit() {
      this.postData()
    },
    async postData() {
      const postData = this.convertData(this.tableData)
      const res = await addOrUpdateUnitIndustry({
        data: JSON.stringify(postData)
      })
      if (res.code === 200) {
        this.$message.success('操作成功')
      } else {
        this.$message.error('操作失败')
      }

      this.getBaseSurveyTable()
    },
    convertData(data) {
      const arr = []
      for (const key in data) {
        if (data[key]) {
          arr.push(
            Object.assign(data[key], {
              bId: Number(key),
              year: 2020
            })
          )
        }
      }
      console.log(arr)
      return arr
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
