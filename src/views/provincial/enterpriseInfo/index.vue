<template>
  <div>
    <div class="filter-wrapper">
      <div class="filter">
        <el-select v-model="state" placeholder="状态筛选">
          <el-option
            v-for="item in stateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="filter">
        <el-autocomplete
          v-model="searchUnitName"
          style="width:260px"
          :fetch-suggestions="querySearch"
          placeholder="请输入企业名称或统一社会信用代码"
          :trigger-on-focus="false"
          value-key="unitName"
          @select="handleSelect"
        />
      </div>
    </div>
    <lb-table
      ref="brandTable"
      v-loading="tableLoading"
      :column="tableDesc"
      :data="mytableData.slice( (currentPage - 1) * pageSize, currentPage * pageSize )"
      border
      stripe
      align="center"
      :merge="['cityName','countyName']"
      pagination
      :current-page.sync="currentPage"
      :total="total"
      :page-size="pageSize"
      @p-current-change="handleCurrentChange"
    />

  </div>
</template>

<script>
import { queryUnit, validUnit } from '@/api/user'
import { stateMap } from '@/utils/submit'

export default {
  data() {
    return {
      stateMap,
      tableDesc: [
        {
          label: '序号',
          type: 'index',
          render: (h, scope) => {
            return (
              <div>
                {scope.$index + 1 + (this.currentPage - 1) * this.pageSize}
              </div>
            )
          }
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
          minWidth: '200px'
        },
        {
          label: '统一社会信用代码',
          prop: 'orgCode',
          minWidth: '200px'
        },
        {
          label: '联系人',
          prop: 'contactName'
        },
        {
          label: '手机',
          prop: 'contactPhone',
          minWidth: '100px'
        },
        {
          prop: 'state',
          label: '状态',
          width: '100px',
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
          width: '280px',
          render: (h, scope) => {
            return (
              <div className='button-group'>
                <el-button type='warning' onClick={() => this.editUnitBase(scope.row.id)} >查看基地</el-button>
                <el-button
                  type='primary'
                  loading={scope.row === this.currentClick && this.loading}
                  onClick={() => this.handleValidUnit(scope.row, 2)}
                >
                  审核通过
                </el-button>
                <el-button
                  type='danger'
                  loading={scope.row === this.currentClick && this.loading}
                  onClick={() => this.handleValidUnit(scope.row, 3)}
                >
                  退回
                </el-button>
              </div>
            )
          }
        }
      ],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      loading: false,
      currentClick: null,
      state: 100,
      stateOptions: [
        { value: 100, label: '所有状态' },
        { value: 0, label: '已保存' },
        { value: 2, label: '审核通过' },
        { value: 3, label: '退回待修改' }
      ],
      searchUnitName: null,
      tableLoading: false
    }
  },
  computed: {
    mytableData() {
      const { state, searchUnitName } = this
      let tableData = this.tableData
      if (state !== 100) {
        tableData = tableData.filter(item => item.state === state)
      }
      if (searchUnitName) {
        return tableData.filter(
          item =>
            item.unitName.indexOf(searchUnitName) !== -1 ||
            item.orgCode.indexOf(searchUnitName) !== -1
        )
      }
      return tableData
    },
    total() {
      return this.mytableData.length
    }
  },
  mounted() {
    this.getEnterprises()
  },
  methods: {
    async getEnterprises() {
      this.tableLoading = true
      const { rows: data } = await queryUnit({ pageSize: 100000 })
      this.tableData = data
      this.tableLoading = false
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    },
    async handleValidUnit(row, state) {
      this.currentClick = row
      this.loading = true
      const { userId } = row
      try {
        const res = await validUnit({ userId, state })
        if (res.code === 200) {
          this.$message(res.data.info)
          this.getEnterprises()
        }
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    querySearch(queryString, cb) {
      const tableData = this.mytableData
      const results = queryString
        ? tableData.filter(this.createFilter(queryString))
        : tableData
      // 调用 callback 返回建议列表的数据
      cb(results)
      console.log(results)
    },
    createFilter(queryString) {
      return item => {
        return (
          item.unitName.toLowerCase().indexOf(queryString.toLowerCase()) !==
            -1 ||
          item.orgCode.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        )
      }
    },
    handleSelect(item) {
      console.log(item)
    },
    editUnitBase(id) {
      this.$router.push({
        path: `/provincial/base/${id}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-wrapper {
  margin-bottom: 20px;
  display: flex;
  .filter {
    &:not(:first-child) {
      margin-left: 10px;
    }
  }
}
</style>
