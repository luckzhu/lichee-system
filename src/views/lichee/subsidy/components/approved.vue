<template>
  <div class="brand-mark">
    <div style="margin-bottom: 20px">
      <el-button type="primary">核准所选物流</el-button>
      <export-excel table-id="subsidy" file-name="物流补助核准汇总表" :filter-arr="['selection']">导出汇总表</export-excel>
    </div>
    <!-- 表格 -->
    <lb-table
      id="subsidy"
      ref="brandTable"
      :column="tableDesc"
      :data="tableData"
      border
      stripe
      align="center"
      @selection-change="handleSelectionChange"
    />
  </div>
</template>

<script>
import { licheeBreedMap } from '@/utils/submit'
import ExportExcel from '@/components/Export2Excel'
import { queryBase, queryIdentification } from '@/api/base'

export default {
  name: 'Subsidy',
  components: {
    ExportExcel
  },
  data() {
    return {
      licheeBreedMap,
      bases: [],
      breeds: [],
      tableDesc: [
        {
          type: 'selection'
        },
        {
          label: '生产基地',
          prop: ''
        },
        {
          label: '物流企业',
          prop: ''
        },
        {
          label: '承运数量（件）',
          prop: ''
        },
        {
          label: '重量规格（公斤/件）',
          prop: ''
        },
        {
          label: '承运总重（吨）',
          prop: '',
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
          prop: ''
        },
        {
          label: '到达日期',
          prop: ''
        },
        {
          label: '收货信息',
          children: [
            { label: '收货人', prop: '' },
            { label: '联系电话', prop: '' },
            { label: '收货地址', prop: '' }
          ]
        },
        {
          label: '核准物流补助（吨）',
          prop: ''
        },
        {
          label: '选择批号',
          width: '200px',
          render: (h, scope) => {
            return (
              <el-select v-model={scope.row.batchNumber}>
                <el-option value={1} label='批号1'></el-option>
                <el-option value={2} label='批号2'></el-option>
              </el-select>
            )
          }
        }
      ],
      tableData: [],
      subsidyIds: []
    }
  },
  mounted() {
    this.getBaseAndBreed()
    this.getIdentification()
  },
  methods: {
    async getBaseAndBreed() {
      const { rows: bases } = await queryBase()
      this.bases = bases
    },
    async getIdentification() {
      const { rows: data } = await queryIdentification()
      this.tableData = data
    },
    changeBreed(baseId) {
      const { detail: breeds } = this.bases.filter(
        item => item.id === baseId
      )[0]
      this.breeds = breeds
    },
    handleSelectionChange(val) {
      const arr = []
      val.map(item => {
        if (!arr.includes(item.id)) {
          arr.push(item.id)
        }
      })
      this.subsidyIds = arr
    }
  }
}
</script>

