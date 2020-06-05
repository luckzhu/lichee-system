<template>
  <div class="brand-mark">
    <div style="margin-bottom: 20px">
      <p class="standard">
        申领品牌标识的产品必须符合
        <span class="book">《“广东荔枝”区域公用品牌产品供应标准》（点击下载）</span>。
      </p>
    </div>
    <!-- 表格 -->
    <lb-table ref="brandTable" :column="tableDesc" :data="tableData" border stripe align="center" />
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import { licheeBreedMap } from '@/utils/submit'
import { queryIdentificationByRegion } from '@/api/base'

export default {
  name: 'BrandAudit',
  data() {
    return {
      licheeBreedMap,
      tableDesc: [
        {
          label: '生产基地',
          prop: 'baseName'
        },
        {
          label: '品种',
          prop: 'bId',
          width: '80px',
          formatter: row => licheeBreedMap.get(row.bId)
        },
        {
          label: '数量（件）',
          prop: 'num'
        },
        {
          label: '上市日期',
          prop: 'saleDate',
          formatter: row => parseTime(row.saleDate, '{y}-{m}-{d}')
        },
        {
          label: '包装规格（公斤/件）',
          prop: 'packing'
        },
        {
          label: '总重（吨）',
          prop: 'weight',
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
          label: '批号',
          prop: 'batchNumber',
          renderHeader: (h, scope) => {
            return (
              <el-tooltip
                class='item'
                effect='dark'
                content='批号由系统自动生成'
                placement='top-start'
              >
                <div class='title-icon'>
                  {scope.column.label}
                  <i class='el-icon-warning'></i>
                </div>
              </el-tooltip>
            )
          }
        }
      ],
      tableData: []
    }
  },
  mounted() {
    this.getIdentification()
  },
  methods: {
    async getIdentification() {
      const { rows: data } = await queryIdentificationByRegion()
      this.tableData = data
    }
  }
}
</script>

<style lang="scss" scoped>
.brand-mark {
  .standard {
    display: inline-block;
    font-size: 14px;
    vertical-align: top;
    margin-left: 20px;
    .book {
      cursor: pointer;
      color: #409eff;
      text-decoration: underline;
    }
  }

  .button-group {
    display: flex;
    justify-content: center;
  }
}
</style>

<style lang="scss">
.brand-mark {
  .canceled {
    color: rgb(180, 178, 178);
    text-decoration: line-through;
  }
}
</style>
