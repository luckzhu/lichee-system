<template>
  <div>
    <el-upload
      ref="upload"
      class="upload-demo"
      :action="url"
      :accept="fileTypes"
      :multiple="isMultiple"
      :limit="fileLimit"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-remove="beforeRemove"
      :on-exceed="handleExceed"
      :before-upload="beforeAvatarUpload"
      :file-list="fileList"
      :disabled="disabled"
      :class="{hide:cantDelete}"
      :show-file-list="showFileList"
      :auto-upload="autoUpload"
      :data="params"
    >
      <el-button slot="trigger" size="mini" type="primary">
        <slot>{{ autoUpload?'上传文件':'选取文件' }}</slot>
      </el-button>
      <el-button
        v-if="!autoUpload"
        style="margin-left: 10px;"
        size="small"
        type="success"
        @click="submitUpload"
      >确定上传</el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: 'https://file.gdnjtg.cn/upload?projectName=data_center'
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    formData: {
      // 往组件里传递的参数，假如有，父组件getData获取
      type: Object,
      default: null
    },
    // eslint-disable-next-line
    fileTypes: {
      type: String
    },
    fileLimit: {
      type: Number,
      default: 2
    },

    fileSize: {
      type: Number,
      default: 2
    },
    cantDelete: {
      type: Boolean,
      default: false
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    // 上传时附带的额外参数
    // eslint-disable-next-line
    params: {
      type: Object
    }
  },

  data() {
    return {
      fileList: [],
      disabled: false
    }
  },
  methods: {
    // 验证文件格式
    validFileType(file) {
      console.log(file.type)
      const fileMainType = file.type.split('/')[1]
      const fileTypesArr = this.fileTypes.split(',')
      for (let i = 0; i < fileTypesArr.length; i++) {
        if (fileTypesArr[i].indexOf(fileMainType) !== -1) {
          return true
        }
      }
      return false
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file) {
      const { uid } = file
      const index = this.fileList.findIndex(element => element.uid === uid)
      this.fileList.splice(index, 1)
      // this.$emit("getFileList", this.fileList);
    },
    handlePreview(file) {
      window.open(file.url)
    },
    handleExceed() {
      this.$message.error(`上传文件不能超过${this.fileLimit}个!`)
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleSuccess(res, file) {
      const name = file.name
      const url = res.data.info
      this.fileList.push({ name, url })
      this.$emit('getFileList', this.fileList)
      this.fileList = []
      if (this.formData) {
        this.$emit('getData', {
          file: { name, url },
          data: this.formData
        })
      }
    },
    beforeAvatarUpload(file) {
      // 文件上传之前调用做一些拦截限制
      const isFileValid = this.validFileType(file)
      if (!isFileValid) {
        this.$message.error(`格式错误，上传的文件格式应为 ${this.fileTypes}`)
      }
      const isSizeLt = file.size / 1024 / 1024 < this.fileSize
      if (!isSizeLt) {
        this.$message.error(`上传文件大小不能超过 ${this.fileSize}MB!`)
      }
      return isFileValid && isSizeLt
    }
  }
}
</script>

<style lang="scss" >
.hide {
  .el-icon-close,
  .el-icon-close-tip {
    display: none;
    opacity: 0;
    pointer-events: none;
  }
  .el-icon-close-tip,
  .el-icon-close:hover {
    display: none;
    opacity: 0;
    cursor: not-allowed;
    pointer-events: none;
  }
}
</style>
