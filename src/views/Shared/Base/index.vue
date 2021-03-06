<template>
  <div>
    <div class="action-bar">
      <el-button v-if="!isAuditor" type="primary" class="add" @click="openDialogForm">新增生产基地</el-button>
      <slot name="action" />
    </div>

    <lb-table
      v-loading="loading"
      :column="columns"
      :data="tableData"
      border
      stripe
      align="center"
      pagination
      :current-page.sync="currentPage"
      :total="total"
      :page-size="pageSize"
      @p-current-change="handleCurrentChange"
    />

    <el-dialog
      title="编辑基地信息"
      center
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      top="10vh"
      :width="isMobile ? '90%' : '1300px'"
    >
      <ele-form
        v-model="formData"
        :disabled="formDisabled"
        :form-desc="formDesc"
        :request-fn="handleSubmit"
        :rules="rules"
        label-position="left"
        :is-show-back-btn="false"
        :is-show-submit-btn="isShowFormBtn"
        :is-show-cancel-btn="isShowFormBtn"
        :is-responsive="false"
        is-dialog
        :visible.sync="dialogFormVisible"
        @request-success="handleSuccess"
        @request-error="handleRequestError"
      >
        <!-- 由于插件自带的type:number 默认值有bug,所有改用slot的写法 -->
        <template v-for="item in numFields" v-slot:[item]="{ formData }">
          <el-input-number
            :key="item"
            v-model="formData[item]"
            :controls="false"
            :step-strictly="item === 'coldCar' ? true:false"
          />
        </template>
      </ele-form>

      <div v-if="isAuditor" slot="footer" class="dialog-footer">
        <el-button :disabled="approved" :loading="btnLoading" type="primary" @click="approve">审核通过</el-button>
        <el-button :disabled="approved" :loading="btnLoading" type="danger" @click="sendBack">退回</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="备注"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
    >
      <span>
        <el-input
          :key="unitId"
          v-model="remark"
          type="textarea"
          :autosize="{ minRows: 5}"
          placeholder="请输入内容"
        /></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateRemark">更新备注</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import LbTable from '@/components/LbTable'
import { stateMap } from '@/utils/submit'
import { queryRegion } from '@/api/normal'
import { addOrUpdateRemark } from '@/api/user'
import {
  queryBase,
  addBase,
  queryBaseByRegionCode,
  validBase,
  generateBaseAccount,
  sendBaseMsg
} from '@/api/base'
import { mapGetters } from 'vuex'

export default {
  components: {
    LbTable
  },
  props: {
    categoryAndBreed: {
      type: Object,
      default: () => {
        return {
          categoryId: 200,
          bIds: {
            201: '红肉蜜柚',
            302: '白肉蜜柚',
            303: '沙田柚'
          }
        }
      }
    },
    isAuditor: {
      type: Boolean,
      default: false
    },
    unitId: {
      type: Number,
      default: null
    },
    sendMsgVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogFormVisible: false,
      formData: {},
      formDisabled: false,
      approved: false,
      btnLoading: false,
      loading: false,
      dialogVisible: false,
      remark: null,
      baseId: -1
    }
  },
  computed: {
    ...mapGetters(['roles', 'isMobile']),

    columns() {
      const sendMsg = []
      if (this.sendMsgVisible) {
        sendMsg.push({
          label: '省级操作',
          width: '220px',
          render: (h, scope) => {
            const { id, remark } = scope.row
            return (
              <div>
                <el-button type='warning' onClick={() => this.sendMsgToBase(id)}>发送短信</el-button>
                <el-button type='info' onClick={() => this.openRemark(id, remark)} >添加备注</el-button>
              </div>
            )
          }
        })
      }
      return [
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
          prop: 'name',
          label: '基地名称',
          minWidth: '220px'
        },
        {
          prop: 'cityName',
          label: '市/县（区）',
          minWidth: '100px',
          formatter: (row) => row.cityName + row.countyName
        },
        {
          prop: 'address',
          label: '基地详细地址',
          minWidth: '160px'
        },
        {
          prop: 'contactName',
          label: '联系人'
        },
        {
          prop: 'contactPhone',
          label: '手机号',
          minWidth: '110px'
        },
        {
          prop: 'scale',
          label: '基地面积（亩）',
          minWidth: '120px'
        },
        {
          prop: 'yield',
          label: '预计产量（公斤）',
          minWidth: '120px'
        },
        {
          prop: 'state',
          label: '状态',
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
          label: '备注',
          prop: 'remark',
          minWidth: '200px'
        },
        {
          prop: 'haveAccount',
          label: '基地账号',
          renderHeader: (h, scope) => {
            return (
              <el-tooltip
                class='item'
                effect='dark'
                content='生成基地账号后，基地可用手机短信登录系统'
                placement='top-start'
              >
                <div class='title-icon'>
                  {scope.column.label}
                  <i class='el-icon-warning'></i>
                </div>
              </el-tooltip>
            )
          },
          render: (h, scope) => {
            const { haveAccount } = scope.row
            return (
              <div>
                <el-tag type={haveAccount ? 'success' : 'info'}>
                  {haveAccount ? '已生成' : '等待审核'}
                </el-tag>
              </div>
            )
          }
        },
        ...sendMsg,
        {
          label: '操作',
          render: (h, scope) => {
            return (
              <div className='button-group'>
                <el-button
                  type={
                    (this.isAuditor && scope.row.state !== 2) || !this.isAuditor
                      ? 'primary'
                      : 'warning'
                  }
                  onClick={() => { this.toBaseForm(scope.row) }}
                >
                  {this.isAuditor && scope.row.state !== 2 ? '审核' : '查看'}
                </el-button>

              </div>
            )
          }
        }
      ]
    },
    formDesc() {
      const { bIds } = this.categoryAndBreed
      const generalInfo = {
        name: {
          type: 'input',
          label: '基地名称',
          required: true
        },
        regionCode: {
          type: 'cascader',
          label: '地级市/县（区）',
          required: true,
          layout: 12,
          attrs: {
            props: {
              lazy: true,
              value: 'code',
              label: 'name',
              lazyLoad(node, resolve) {
                const { level } = node
                if (level === 0) {
                  // eslint-disable-next-line vue/no-async-in-computed-properties
                  queryRegion().then((res) => {
                    const nodes = res.filter((item) => item.type === 1)
                    resolve(nodes)
                  })
                } else {
                  const { code } = node.data
                  // eslint-disable-next-line vue/no-async-in-computed-properties
                  queryRegion({ code }).then((res) => {
                    const nodes = res
                      .filter((item) => item.type === 2)
                      .map((item) => ({
                        code: item.code,
                        name: item.name,
                        leaf: true
                      }))
                    resolve(nodes)
                  })
                }
              }
            }
          }
        },
        address: {
          type: 'input',
          label: '基地详细地址',
          layout: 12,
          required: true
        },
        contactName: {
          type: 'input',
          label: '联系人',
          required: true,
          layout: 12
        },
        contactPhone: {
          type: 'input',
          label: '手机号',
          required: true,
          attrs: {
            controls: false
          },
          layout: 12
        },
        scale: {
          label: '基地面积（亩）',
          layout: 12,
          required: true
        },
        yield: {
          label: '预计产量（公斤）',
          layout: 12,
          required: true
        },
        coldScale: {
          label: '冷库容积（m³）',
          layout: 12
        },
        coldCar: {
          label: '冷链车（台）',
          layout: 12
        },
        levelDevice: {
          type: 'radio',
          label: '分级设备',
          required: true,
          layout: 12,
          options: [
            { text: '有', value: 1 },
            { text: '无', value: 0 }
          ]
        },
        packDevice: {
          type: 'radio',
          label: '打包设备',
          required: true,
          layout: 12,
          options: [
            { text: '有', value: 1 },
            { text: '无', value: 0 }
          ]
        },
        arrestPoint: {
          type: 'radio',
          label: '快递驻点',
          required: true,
          layout: 12,
          options: [
            { text: '有', value: 1 },
            { text: '无', value: 0 }
          ]
        },
        exportFile: {
          type: 'radio',
          label: '出口备案',
          required: true,
          layout: 12,
          options: [
            { text: '有', value: 1 },
            { text: '无', value: 0 }
          ]
        }
      }
      const breedInfo = {}
      Object.keys(bIds).forEach((item) => {
        Object.assign(breedInfo, {
          [`breed_${item}`]: {
            type: 'radio',
            label: bIds[item],
            required: true,
            layout: 8,
            options: [
              { text: '有生产', value: 1 },
              { text: '未生产', value: 0 }
            ]
          },
          [`scale_${item}`]: {
            label: '采收面积（亩）',
            layout: 8
          },
          [`yield_${item}`]: {
            label: '预计产量（公斤）',
            layout: 8
          }
        })
      })
      return { ...generalInfo, ...breedInfo }
    },
    numFields() {
      const { bIds } = this.categoryAndBreed
      const generalField = ['scale', 'yield', 'coldScale', 'coldCar']
      const breedField = []
      Object.keys(bIds).forEach((item) => {
        breedField.push(`scale_${item}`, `yield_${item}`)
      })
      return [...generalField, ...breedField]
    },
    rules() {
      const { bIds } = this.categoryAndBreed
      const phone = (rule, value, callback) => {
        const mobileReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
        if (value !== '' && !mobileReg.test(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }
      const ifRequired = (rule, value, callback) => {
        const breedCode = rule.field.split('_')[1]
        const isOn = this.formData[`breed_${breedCode}`]
        if (isOn === 1 && value !== 0 && !value) {
          callback(new Error('请填写该指标'))
        } else {
          callback()
        }
      }
      const generalRules = {
        contactPhone: [{ validator: phone, trigger: 'blur' }]
      }
      const breedRules = {}
      Object.keys(bIds).forEach((item) => {
        Object.assign(breedRules, {
          [`scale_${item}`]: [{ validator: ifRequired, trigger: 'blur' }],
          [`yield_${item}`]: [{ validator: ifRequired, trigger: 'blur' }]
        })
      })
      return { ...generalRules, ...breedRules }
    },
    isShowFormBtn() {
      return !this.isAuditor
    },
    bId() {
      return this.categoryAndBreed.categoryId
    }
  },
  watch: {
    bId() {
      this.getBaseList()
    }
  },
  mounted() {
    this.getBaseList()
  },
  methods: {
    async getBaseList() {
      this.loading = true
      const { isAuditor, currentPage, pageSize, bId, unitId } = this
      const { rows, records } = isAuditor
        ? await queryBaseByRegionCode({ page: currentPage, pageSize, bId })
        : await queryBase({ page: currentPage, pageSize, bId, unitId })
      this.tableData = rows
      this.total = records
      this.loading = false
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getBaseList()
    },
    openDialogForm() {
      this.formData = {}
      this.formDisabled = false
      this.dialogFormVisible = true
    },
    handleSubmit(data) {
      const postData = this.converData(data)
      return new Promise((resolve, reject) => {
        addBase(postData).then((res) => {
          if (res.code === 200) {
            resolve(data)
          } else {
            reject(res.data.info)
          }
        })
      })
    },
    // convert breed data structor for post
    converData(obj) {
      const { regionCode } = obj
      obj.regionCode = regionCode[regionCode.length - 1]
      const data = []
      const { categoryId, bIds } = this.categoryAndBreed
      obj.bId = categoryId
      Object.keys(bIds).forEach((item) => {
        if (obj[`breed_${item}`] === 1) {
          data.push({
            bId: item,
            scale: obj[`scale_${item}`],
            yield: obj[`yield_${item}`]
          })
        }
        delete obj[`breed_${item}`]
        delete obj[`scale_${item}`]
        delete obj[`yield_${item}`]
      })

      obj.data = JSON.stringify(data)

      if (this.baseId !== -1) {
        obj.id = this.baseId
        delete obj.detail
      }
      obj.state = 1

      // 如果是省级直接新增，需要加上unitId
      if (this.unitId) {
        obj.unitId = this.unitId
      }

      return obj
    },
    handleSuccess(data) {
      this.dialogFormVisible = false
      this.formData = {}
      this.getBaseList()
      this.$message.success('基地提交成功，进入待审核状态')
    },
    handleRequestError(err) {
      this.$message.error(err)
    },
    toBaseForm(row) {
      // 除了退回再修改，提交后不让编辑
      if (row.state !== 3) {
        this.formDisabled = true
      }
      // 审核通过后，禁用审核按钮
      if (row.state === 2) {
        this.approved = true
      } else {
        this.approved = false
      }
      this.dialogFormVisible = true
      this.baseId = row.id
      this.formData = JSON.parse(JSON.stringify(this.revertData(row)))
    },
    revertData(row) {
      const temp = JSON.parse(JSON.stringify(row))
      temp.regionCode = [temp.regionCode.substring(0, 4), temp.regionCode]
      const { bIds } = this.categoryAndBreed
      Object.keys(bIds).forEach((item) => {
        temp[`breed_${item}`] = 0
      })
      temp.detail.forEach((item) => {
        temp[`breed_${item.bId}`] = 1
        temp[`scale_${item.bId}`] = item.scale
        temp[`yield_${item.bId}`] = item.yield
      })
      return temp
    },
    approve() {
      this.auditBase(2, '审核通过')
    },
    sendBack() {
      this.auditBase(3, '退回成功')
    },
    auditBase(state, message) {
      this.btnLoading = true
      validBase({ id: this.baseId, state })
        .then((res) => {
          if (res.code === 200) {
            this.$message({ message, type: 'success' })
            this.dialogFormVisible = false
          }
        })
        .finally(() => {
          this.btnLoading = false
          this.getBaseList()
        })
    },
    // 审核通过后创建基地账号
    createBaseAccount(id) {
      generateBaseAccount({ id }).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '基地账号创建成功！',
            type: 'success'
          })
          this.getBaseList()
        }
      })
    },
    async sendMsgToBase(id) {
      try {
        const res = await sendBaseMsg({ id })
        this.$message(res.data.info)
      } catch (err) {
        console.log(err)
      }
    },
    openRemark(id, remark) {
      this.baseId = id
      this.dialogVisible = true
      remark
        ? this.remark = remark
        : ''
    },
    async updateRemark() {
      const { baseId, remark } = this
      const res = await addOrUpdateRemark({ id: baseId, remark, type: 2 })
      if (res.code === 200) {
        this.$message.success('更新成功')
        this.getBaseList()
        this.dialogVisible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.action-bar {
  margin-bottom: 20px;
}
</style>
