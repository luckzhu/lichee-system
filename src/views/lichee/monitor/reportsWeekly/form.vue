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
    <div>
      <lb-table
        v-if="device === 'desktop'"
        :column="tableData.column"
        :data="tableData.data"
        border
        align="center"
      />

      <table-mobile v-else class="table-mobile" :table-data="tableData" />
    </div>

    <footer>
      <el-button :disabled="disabled" type="primary" :loading="btnLoading" @click="save">保存但不提交</el-button>
      <el-button :disabled="disabled" type="success" @click="submit">数据无误并提交</el-button>
    </footer>
  </div>
</template>

<script>
import LbTable from '@/components/LbTable'
import { addOrUpdateBaseData, getBaseDataByIssueId } from '@/api/task'
import { licheeBreedMap } from '@/utils/submit'
import { mapGetters } from 'vuex'
import TableMobile from './table-mobile'

export default {
  name: 'Form',
  components: {
    LbTable,
    TableMobile
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
            width: '140px',
            render: (h, scope) => {
              return (
                <div>
                  <el-radio-group
                    v-model={scope.row.i1}
                    disabled={this.disabled}
                  >
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
                        disabled={!scope.row.i1 || this.disabled}
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
                        disabled={!scope.row.i1 || this.disabled}
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
                        disabled={!scope.row.i1 || this.disabled}
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
                        disabled={!scope.row.i1 || this.disabled}
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
                        disabled={!scope.row.i1 || this.disabled}
                      ></el-input-number>
                    </div>
                  )
                }
              }
            ]
          },
          {
            prop: 'i2',
            label: '行情预判',
            width: '240px',
            render: (h, scope) => {
              return (
                <div>
                  <el-radio-group
                    v-model={scope.row.i2}
                    disabled={!scope.row.i1 || this.disabled}
                  >
                    <el-radio label={1}>上涨 </el-radio>
                    <el-radio label={2}>持平</el-radio>
                    <el-radio label={3}>下跌</el-radio>
                  </el-radio-group>
                </div>
              )
            }
          }
        ],
        data: []
      },
      issue: {
        state: null
      },
      baseinfo: {},
      breed: [],
      btnLoading: false
    }
  },
  computed: {
    ...mapGetters(['device']),
    id() {
      return this.$route.query.id
    },
    disabled() {
      const { state } = this.issue
      console.log(state)
      if (state === -1 || state === 0) {
        return false
      } else {
        return true
      }
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
          this.tableData.data = data
        }
      })
    },
    save() {
      this.postData(0)
    },
    submit() {
      if (!this.validate(this.tableData.data)) return
      this.postData(1)
    },
    validate(data) {
      const message = []
      const requiredArr = [
        { field: 'd1', label: '基地本周上市量' },
        { field: 'd2', label: '基地田头大宗最高价' },
        { field: 'd3', label: '基地田头大宗最低价' },
        { field: 'd4', label: '预计下周价格' },
        { field: 'd5', label: '预计下周基地上市量' },
        { field: 'i2', label: '行情预判' }
      ]

      let valid = true
      data.forEach(item => {
        if (item.i1 !== 0 && !item.i1) {
          message.push(`请选择是否上市: ${licheeBreedMap.get(item.bId)}`)
          valid = false
        } else if (item.i1 === 1) {
          requiredArr.map(ele => {
            if (item[ele.field] !== 0 && !item[ele.field]) {
              message.push(
                `请填写必填项: ${licheeBreedMap.get(item.bId)}-${ele.label}`
              )
              valid = false
            }
          })
        }
      })
      if (message.length > 0) {
        this.$alert(message.join('<br>'), '必填', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          callback: () => {}
        })
      }
      console.log(valid)
      return valid
    },
    postData(state) {
      this.btnLoading = true
      const { id } = this
      const tempData = JSON.parse(JSON.stringify(this.tableData.data))
      const fieldName = ['id', 'scale', 'yield', 'baseId']
      tempData.forEach(item => {
        for (const key in item) {
          if (fieldName.includes(key)) delete item[key]
        }
        if (item.i1 === 0) {
          delete item.d1
          delete item.d2
          delete item.d3
          delete item.d4
          delete item.d5
          delete item.i2
        }
        item.name = licheeBreedMap.get(item.bId)
        item.biId = id
      })
      const data = JSON.stringify(tempData)
      addOrUpdateBaseData({ id, data, state })
        .then(res => {
          this.btnLoading = false
          if (res.code === 200) {
            this.$message({
              message: res.data.info,
              type: 'success'
            })
          } else {
            this.$message({
              message: `保存失败 ${res.data.info}`,
              type: 'danger'
            })
          }
        })
        .catch(() => {
          this.btnLoading = false
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

.table-mobile {
  margin-bottom: 60px;
}
</style>

<style lang="scss" >
.required-error .el-input__inner {
  border-color: red;
}

.el-input-number--small {
  width: 100%;
}

@media screen and (max-width: 778px) {
  .el-message-box {
    width: 80%;
  }
}
</style>
