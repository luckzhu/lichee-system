<template>
  <div>
    <table
      v-for="breed in tableData"
      :key="breed.bId"
      class="table table-border table-bordered text-c breed-table"
    >
      <tr>
        <td>品种</td>
        <td colspan="2">项目</td>
        <td>数值</td>
      </tr>
      <tr>
        <td rowspan="7">{{ breed.name }}</td>
        <td colspan="2">是否上市</td>
        <td>
          <div>
            <el-radio-group v-model="breed.i1">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </div>
        </td>
      </tr>
      <tr>
        <td rowspan="3" style="width:20px">本周上市情况</td>
        <td>基地本周上市量（公斤）</td>
        <td>
          <el-input-number
            v-model="breed.d1"
            :disabled="breed.i1 === 0"
            :controls="false"
            size="small"
          />
        </td>
      </tr>
      <tr>
        <td>基地田头大宗最高价（元/公斤）</td>
        <td>
          <el-input-number
            v-model="breed.d2"
            :disabled="breed.i1 === 0"
            :controls="false"
            size="small"
          />
        </td>
      </tr>
      <tr>
        <td>基地田头大宗最低价（元/公斤）</td>
        <td>
          <el-input-number
            v-model="breed.d3"
            :disabled="breed.i1 === 0"
            :controls="false"
            size="small"
          />
        </td>
      </tr>
      <tr>
        <td rowspan="3">下周预计上市情况</td>
        <td>预计下周价格（元/公斤）</td>
        <td>
          <el-input-number
            v-model="breed.d4"
            :disabled="breed.i1 === 0"
            :controls="false"
            size="small"
          />
        </td>
      </tr>
      <tr>
        <td>预计下周基地上市量（公斤）</td>
        <td>
          <el-input-number
            v-model="breed.d5"
            :disabled="breed.i1 === 0"
            :controls="false"
            size="small"
          />
        </td>
      </tr>
      <tr>
        <td>行情预判</td>
        <td>
          <el-select v-model="breed.i2" :disabled="breed.i1 === 0">
            <el-option :value="1" label="上涨" />
            <el-option :value="2" label="持平" />
            <el-option :value="3" label="下跌" />
          </el-select>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  props: {
    // eslint-disable-next-line
    tableData: { type: Array }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.breed-table {
  margin-bottom: 20px;
  border: 2px solid #333;
}
</style>
