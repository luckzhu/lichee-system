<template>
  <div>
    <div class="top-action">
      <div class="section">
        <el-select v-model="year">
          <el-option v-for="item in yearList" :key="item" :value="item" :label="item" />
        </el-select>
        <el-cascader v-if="isProvincial" v-model="regionCode" :props="cascaderProps" clearable @change="getAreaDataList" />
      </div>
    </div>

    <lb-table border stripe align="center" :column="column" :data="tableData" />
    <div class="fixed-dialog">
      <el-dialog :visible.sync="marketingVisible" :close-on-click-modal="false" fullscreen top="10vh" destroy-on-close>
        <Markering v-if="marketingVisible" :form-data="formData" />
        <span slot="footer" class="dialog-footer">
          <!-- 填报已经结束，这些暂不处理 -->
          <template v-if="false">
            <el-button type="primary" :loading="postLoading" @click="save">保存但不提交</el-button>
            <el-button type="success" :loading="postLoading" @click="submit">确认提交</el-button>
            <el-button type="success" :loading="postLoading" @click="approve">市级审核通过</el-button>
          </template>

          <!-- 现在只有省级可以修改 -->
          <el-button v-if="isProvincial" type="success" :loading="postLoading" @click="modify">修改数据</el-button>

        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { queryAreaDataByRegionCode, getAreaDataDetail, addOrUpdateAreaData } from '@/api/areaData'
import { queryRegion } from '@/api/normal'
import { parseTime } from '@/utils'
import { marketingState } from '@/utils/submit'
import Markering from '@/views/Shared/Marketing'
import { mapGetters } from 'vuex'

export default {
  components: {
    Markering
  },
  data() {
    return {
      column: [
        { label: '序号', type: 'index' },
        { label: '填写单位', prop: 'unitName', minWidth: '200px' },
        { label: '更新时间', prop: 'time', formatter: row => parseTime(row.time), minWidth: '160px' },
        { label: '审核状态', prop: 'state', minWidth: '120px', formatter: row => marketingState[row.state] },
        { label: '操作', minWidth: '80px', render: (h, scope) => {
          const { myself, id } = scope.row
          return <el-button onClick={() => this.editQuestionnaire(id)} type={myself === 1 ? 'success' : 'primary'}>{ myself === 1 ? '查看' : '审核'} </el-button>
        } }
      ],
      tableData: [],
      yearList: [2020],
      year: 2020,
      regionCode: null,
      cascaderProps: {
        lazy: true,
        checkStrictly: true,
        emitPath: false,
        value: 'code',
        label: 'name',
        lazyLoad(node, resolve) {
          const { level } = node
          if (level === 0) {
            queryRegion().then(res => {
              const nodes = res.filter(item => item.type === 1)
              resolve(nodes)
            })
          } else {
            const { code } = node.data
            queryRegion({ code }).then(res => {
              const nodes = res
                .filter(item => item.type === 2)
                .map(item => ({
                  code: item.code,
                  name: item.name,
                  leaf: true
                }))
              resolve(nodes)
            })
          }
        }
      },
      formData: [],
      marketingVisible: false,
      postLoading: false
    }
  },
  computed: {
    ...mapGetters(['roles']),
    isProvincial() {
      return this.roles.includes('shengji')
    }
  },
  mounted() {
    this.getAreaDataList()
  },
  methods: {
    async getAreaDataList() {
      const { year, regionCode } = this
      const { rows } = await queryAreaDataByRegionCode({ year, regionCode, pageSize: 10000 })
      this.tableData = rows
    },
    async editQuestionnaire(id) {
      const { data: { info }} = await getAreaDataDetail({ id })
      this.formData = info
      this.marketingVisible = true
    },
    save() { },
    submit() { },
    approve() { },
    modify() {
      this.postData()
    },
    async postData() {
      this.postLoading = true
      const { breedData, info, unitData } = this.formData
      const data = {
        breedData: JSON.stringify(breedData),
        info: JSON.stringify(info),
        unitData: JSON.stringify(unitData)
      }
      try {
        const res = await addOrUpdateAreaData(data)
        if (res.code === 200) {
          this.getAreaDataList()
          this.$message('操作成功')
          this.marketingVisible = false
        }
      } finally {
        this.postLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
