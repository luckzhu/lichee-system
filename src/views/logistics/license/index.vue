<template>
  <div class="brand-mark">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="onAddLicense">登记物流资质</el-button>
      <p class="standard">
        <span class="book">合同备案模板（点击下载）</span>。
      </p>
    </div>
    <!-- 表格 -->
    <license-table :data="tableData" />
    <!-- <lb-table
      ref="brandTable"
      :column="tableDesc"
      :data="tableData"
      border
      stripe
      align="center"
    />-->

    <!-- 表单 -->
    <ele-form-dialog
      v-model="formData"
      :form-desc="formDesc"
      :request-fn="handleSubmit"
      :rules="rules"
      :visible.sync="dialogFormVisible"
      title="登记物流资质"
      label-position="left"
      :is-responsive="false"
      width="700px"
      @request-success="handleSuccess"
    >
      <template v-slot:endTime="{ desc, data, field, formData }">
        <el-date-picker v-model="formData.endTime" type="date" value-format="yyyy-MM-dd" />
      </template>
      <template v-slot:businessFile="{ desc, data, field, formData }">
        <UploadFile
          url="https://file.gdnjtg.cn/upload?projectName=gdlz"
          file-types="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :file-size="10"
          :file-limit="1"
          @getFileList="handleFile"
        >上传许可证</UploadFile>
        <div>
          <a :href="uploadedBusinessFile.url" target="blank">{{ uploadedBusinessFile.name }}</a>
        </div>
      </template>
      <!-- 由于插件自带的type:number 默认值有bug,所有改用slot的写法 -->
      <template v-for="item in numFields" v-slot:[item]="{ desc, data, field, formData }">
        <el-input-number
          :key="item"
          v-model="formData[item]"
          style="width:200px"
          :controls="false"
        />
      </template>
    </ele-form-dialog>
  </div>
</template>

<script>
import { getLogisticsCred, addLogisticsCred } from '@/api/base'
import UploadFile from '@/components/UploadFile'
import LicenseTable from './licenseTable'

export default {
  name: 'Contract',
  components: {
    // eslint-disable-next-line
    UploadFile,
    LicenseTable
  },
  data() {
    return {
      // 控制是否显示
      dialogFormVisible: false,
      btnLoading: false,
      tableData: {},
      formData: {},
      fileList: [],
      numFields: ['coldCar', 'coldTransportWeight'],
      formDesc: {
        code: {
          type: 'input',
          label: '道路运输经营许可证编号',
          required: true
        },
        endTime: {
          label: '道路运输经营许可证有效期截止日',
          required: true
        },
        haveTransport: {
          type: 'radio',
          label: '经营范围是否具有冷藏保鲜货物专用运输',
          options: [
            { text: '是', value: 1 },
            { text: '否', value: 0 }
          ],
          required: true
        },
        coldCar: {
          label: '冷链运输车数量（台）',
          required: true
        },
        coldTransportWeight: {
          label: '冷链运输年货运量（吨）',
          required: true
        },
        businessFile: {
          label: '上传道路运输经营许可证',
          required: true
        }
      },
      // 校检规则
      rules: {},
      uploadedBusinessFile: {}
    }
  },

  mounted() {
    this.getLicense()
  },
  methods: {
    async getLicense() {
      const res = await getLogisticsCred()
      this.tableData = res.data.info
    },
    onAddLicense() {
      this.formData = {}
      this.dialogFormVisible = true
    },
    handleSubmit(data) {
      const { id } = this.tableData
      if (id) {
        data.id = id
      }
      return new Promise(async(resolve, reject) => {
        try {
          const res = await addLogisticsCred(data)
          resolve(res)
        } catch (error) {
          reject(new Error())
        }
      })
    },
    handleSuccess(res) {
      this.getLicense()
      // 关闭弹窗
      this.dialogFormVisible = false
      // 重置formData
      this.formData = {}
      this.$message.success('创建成功')
    },
    handleFile(file) {
      const [businessFile] = file
      this.uploadedBusinessFile = businessFile
      this.formData.businessFile = JSON.stringify(businessFile)
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
