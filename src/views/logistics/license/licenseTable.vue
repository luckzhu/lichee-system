<template>
  <div>
    <table class="table table-border table-bordered text-c breed-table">
      <tr>
        <td colspan="4">物流资质登记表</td>
      </tr>

      <tr>
        <td colspan="2">道路运输经营许可证编号</td>
        <td colspan="2">{{ data.code }}</td>
      </tr>
      <tr>
        <td colspan="2">道路运输经营许可证有效期截止日</td>
        <td colspan="2">{{ data.endTime | parseTime }}</td>
      </tr>
      <tr>
        <td colspan="2">经营范围是否具有冷藏保鲜货物专用运输</td>
        <td colspan="2">{{ data.haveTransport === 1 ? '是' : '否' }}</td>
      </tr>
      <tr>
        <td>冷链运输车数量</td>
        <td style="width:20%">{{ data.coldCar }}（台）</td>
        <td>冷链运输年货运量</td>
        <td style="width:20%">{{ data.coldTransportWeight }}（吨）</td>
      </tr>
      <tr>
        <td colspan="2">上传道路运输经营许可证</td>
        <td colspan="2">
          <a :href="businessFile.url" target="blank">{{ businessFile.name }}</a>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
export default {
  filters: {
    parseTime(time) {
      return parseTime(time, '{y}-{m}-{d}')
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    businessFile() {
      if (!this.data.businessFile) return {}
      return JSON.parse(this.data.businessFile)
    }
  }
}
</script>

<style lang="scss" scoped>
.table a {
  cursor: pointer;
  color: #409eff;
  text-decoration: underline;
}
</style>
