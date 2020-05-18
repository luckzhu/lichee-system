<template>
  <div>
    <div class="issue-info">
      <p>
        填报期号：
        <span>{{ issue.issue }}</span>
      </p>
      <p>
        生产基地：
        <span>{{ baseinfo.name }}</span>
      </p>
    </div>
    <lb-table :column="tableData.column" :data="tableData.data" border stripe align="center" />

    <footer>
      <el-button type="primary" @click="save">保存但不提交</el-button>
      <el-button type="success" @click="submit">数据无误并提交</el-button>
    </footer>
  </div>
</template>

<script>
import LbTable from '@/components/LbTable'
import { addOrUpdateBaseData, getBaseDataByIssueId } from '@/api/task'
import { licheeBreedMap } from '@/utils/submit'

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
            prop: 'name',
            label: '品种',
            width: '80px',
            formatter: row => licheeBreedMap.get(row.bId)
          },
          {
            prop: 'i1',
            label: '是否上市',
            render: (h, scope) => {
              return (
                <div>
                  <el-radio-group v-model={scope.row.i1}>
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
                prop: 'd1',
                align: 'center',
                render: (h, scope) => {
                  return (
                    <div>
                      <el-input-number
                        v-model={scope.row.d1}
                        controls={false}
                        size='small'
                        disabled={!scope.row.i1}
                      ></el-input-number>
                    </div>
                  )
                }
              },
              {
                label: '基地田头大宗最高价（元/公斤）',
                prop: 'd2',
                align: 'center',
                render: (h, scope) => {
                  return (
                    <div>
                      <el-input-number
                        v-model={scope.row.d2}
                        controls={false}
                        size='small'
                        disabled={!scope.row.i1}
                      ></el-input-number>
                    </div>
                  )
                }
              },
              {
                label: '基地田头大宗最低价（元/公斤）',
                prop: 'd3',
                align: 'center',
                render: (h, scope) => {
                  return (
                    <div>
                      <el-input-number
                        v-model={scope.row.d3}
                        controls={false}
                        size='small'
                        disabled={!scope.row.i1}
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
                prop: 'd4',
                align: 'center',
                render: (h, scope) => {
                  return (
                    <div>
                      <el-input-number
                        v-model={scope.row.d4}
                        controls={false}
                        size='small'
                        disabled={!scope.row.i1}
                      ></el-input-number>
                    </div>
                  )
                }
              },
              {
                label: '预计下周基地上市量（公斤）',
                prop: 'd5',
                align: 'center',
                render: (h, scope) => {
                  return (
                    <div>
                      <el-input-number
                        v-model={scope.row.d5}
                        controls={false}
                        size='small'
                        disabled={!scope.row.i1}
                      ></el-input-number>
                    </div>
                  )
                }
              }
            ]
          }
        ],
        data: []
      },
      issue: {},
      baseinfo: {},
      breed: []
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  mounted() {
    this.getFormData(this.id)
  },
  methods: {
    getFormData(id) {
      getBaseDataByIssueId({ id }).then(res => {
        this.issue = res.issue
        this.baseinfo = res.baseinfo
        this.breed = res.breed
        this.tableData.data = res.breed
        const { data } = res
        if (data.length > 0) {
          this.tableData.data.forEach(item => {
            data.forEach(ele => {
              if (item.bId === ele.bId) {
                Object.assign(item, ele)
              }
            })
          })
        }
      })
    },
    save() {
      this.postData(0)
    },
    submit() {
      this.postData(1)
    },
    postData(state) {
      const { id } = this
      const tempData = JSON.parse(JSON.stringify(this.tableData.data))
      const fieldName = ['id', 'scale', 'yield', 'baseId']
      tempData.forEach(item => {
        for (const key in item) {
          if (fieldName.includes(key)) delete item[key]
        }
        item.name = licheeBreedMap.get(item.bId)
        item.biId = id
      })
      const data = JSON.stringify(tempData)
      addOrUpdateBaseData({ id, data, state }).then(res => {
        console.log(res)
      })
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
