<template>
  <div>
    <lb-table
      ref="brandTable"
      :column="tableDesc"
      :data="tableData"
      border
      stripe
      align="center"
      :merge="['cityName','countyName']"
      pagination
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[5, 10, 20, 30]"
      :pager-count="5"
      :current-page.sync="currentPage"
      :total="records"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @p-current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { queryUnit } from '@/api/user'
export default {
  data() {
    return {
      tableDesc: [
        {
          label: '序号',
          type: 'index'
        },
        {
          label: '市',
          prop: 'cityName',
          width: '100px'
        },
        {
          label: '县/区',
          prop: 'countyName',
          width: '100px'
        },
        {
          label: '企业名称',
          prop: 'unitName',
          minWidth: '300px'
        },
        {
          label: '联系人',
          prop: 'contactName'
        },
        {
          label: '手机',
          prop: 'contactPhone'
        }
      ],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      records: 20
    }
  },
  mounted() {
    this.getEnterprises({})
  },
  methods: {
    async getEnterprises({
      pageSize = this.pageSize,
      page = this.currentPage
    }) {
      const { rows: data, records } = await queryUnit({ pageSize, page })
      this.tableData = data
      this.records = records
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getEnterprises({})
    },
    handleCurrentChange(val) {
      this.getEnterprises({ page: val })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
