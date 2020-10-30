<template>
  <div>
    <table class="table table-border table-bordered text-l breed-table">
      <tr>
        <td> 点击下载 <el-link type="danger" href="http://gdmpxt.org/mpApply2017/user/litchi-opinion.docx" download="广东荔枝区域公用品牌标准体系（征求意见稿）"> 《广东荔枝区域公用品牌标准体系（征求意见稿）》</el-link></td>
      </tr>
      <tr>
        <td><el-input v-model="form.litchiOpinion" type="textarea" :autosize="{ minRows: 14 }" placeholder="请您填写对“广东荔枝区域公用品牌标准体系（征求意见稿）”的意见建议" /></td>
      </tr>

    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // form: this.data.info
    }
  },
  computed: {
    form() {
      return this.data.info
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
