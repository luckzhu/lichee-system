<template>
  <div class="brand-mark">
    <div style="margin-bottom: 20px">
      <p class="standard">
        <span class="book">合同备案模板（点击下载）</span>。
      </p>
    </div>
    <!-- 表格 -->
    <lb-table
      ref="brandTable"
      :column="tableDesc"
      :data="tableData"
      border
      stripe
      align="center"
      show-summary
      :summary-method="getSummaries"
    />
  </div>
</template>

<script>
import { licheeBreedMap } from '@/utils/submit'
import { queryContractByRegion } from '@/api/base'
import UploadFile from '@/components/UploadFile'

export default {
  name: 'Contract',
  components: {
    // eslint-disable-next-line
    UploadFile
  },
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
          label: '采购对象',
          prop: 'purchase'
        },
        {
          label: '采购重量（吨）',
          prop: 'weight'
        },
        {
          label: '采购价格（元/公斤）',
          prop: 'price'
        },
        {
          label: '合同盖章件',
          prop: 'contractFile',
          render: (h, scope) => {
            if (scope.row.contractFile) {
              const { url, name } = JSON.parse(scope.row.contractFile)
              return (
                <div>
                  <a href={url} target='_blank'>
                    {name}
                  </a>
                </div>
              )
            } else {
              return <div>未上传合同</div>
            }
          }
        }
      ],
      tableData: []
    }
  },

  mounted() {
    this.getContract()
  },
  methods: {
    async getContract() {
      const { rows: data } = await queryContractByRegion()
      this.tableData = data
    },
    // 表格 总重合计栏
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (column.property === 'weight') {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
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
