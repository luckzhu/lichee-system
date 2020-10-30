<template>
  <div class="questionnaire">
    <table class="table table-border table-bordered text-l breed-table">
      <tr>
        <template v-for="item in formDesc">
          <td :key="item.prop" colspan="2" />
          <td :key="item.prop+1">2019</td>
          <td :key="item.prop+2">2020（预计）</td>
        </template>
      </tr>

      <tr v-for="(breed,index) in form.breedData" :key="breed.bId">
        <template v-for="item in formDesc">
          <td v-if="index === 1" :key="item.prop" rowspan="6">其中</td>
          <td :key="item.prop+1" :colspan="index === 0 ? 2 : 1">{{ index === 0 ? item.label : breed.breedName }}</td>
          <td :key="item.prop+2">
            <el-input v-if="item.type === 'text'" v-model="breed[item.prop]" />
            <el-input-number v-else v-model="breed[item.prop]" :controls="false" />
          </td>
          <td :key="item.prop+3">
            <el-input v-if="item.type === 'text'" v-model="breed[item.propEstimate]" />
            <el-input-number v-else v-model="breed[item.propEstimate]" :controls="false" />
          </td>
        </template>
      </tr>

      <tr> <td colspan="16"> 销售渠道占比（%）</td> </tr>
      <tr>
        <template v-for="item in salesDesc">
          <td :key="item.prop" colspan="2">{{ item.label }}</td>
          <td :key="item.prop+1"> <el-input-number v-model="form.info[item.prop]" :controls="false"> <template slot="append">%</template> </el-input-number> </td>
          <td :key="item.prop+2"> <el-input-number v-model="form.info[item.propEstimate]" :controls="false"> <template slot="append">%</template> </el-input-number> </td>
        </template>
      </tr>
      <tr>
        <td colspan="2">其他</td>
        <td> <el-input-number v-model="form.info.otherRate" :controls="false"> <template slot="append">%</template></el-input-number> </td>
        <td> <el-input-number v-model="form.info.otherRateEstimate" :controls="false"> <template slot="append">%</template></el-input-number> </td>
        <td colspan="2">请注明其他渠道名称</td>
        <td colspan="2"> <el-input v-model="form.info.otherSourceName" /> </td>
      </tr>

      <tr> <td colspan="16"> 销售区域占比（%）</td> </tr>
      <tr>
        <template v-for="item in salesRegionDesc">
          <td :key="item.prop" colspan="2">{{ item.label }}</td>
          <td :key="item.prop+1"> <el-input-number v-model="form.info[item.prop]" :controls="false"> <template slot="append">%</template></el-input-number> </td>
          <td :key="item.prop+2"> <el-input-number v-model="form.info[item.propEstimate]" :controls="false"> <template slot="append">%</template></el-input-number> </td>
        </template>
      </tr>

    </table>
    <table class="table table-border table-bordered text-l breed-table">
      <tr> <td> 荔枝冷链情况：（包括田头预冷、分级、打包、冷链仓储、快递驻点）</td> </tr>
      <tr> <td><el-input v-model="form.info.s1" type="textarea" :autosize="{ minRows: 8 }" maxlength="1000" show-word-limit /></td> </tr>
      <tr> <td> 品牌活动计划：</td> </tr>
      <tr> <td><el-input v-model="form.info.s2" type="textarea" :autosize="{ minRows: 8 }" maxlength="1000" show-word-limit placeholder="日期-地址-主题-规模,1000字以内" /></td> </tr>
      <tr> <td> 优质荔枝规模基地企业/合作社名录（不少于10个）</td> </tr>
      <tr> <td> <lb-table border :column="column" :data="form.unitData" /> </td> </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return { breedData: [], unitData: [], info: {}}
      }
    }
  },
  data() {
    const inputRender = (h, scope) => <el-input v-model={scope.row[scope.column.property]} />
    return {
      form: this.data,
      column: [
        { label: '企业/合作社名称', prop: 'name', render: inputRender },
        { label: '自有采收面积', prop: 'scale', render: inputRender },
        { label: '联系人', prop: 'contactName', render: inputRender },
        { label: '手机', prop: 'contactPhone', render: inputRender }
      ],
      formDesc: [
        { label: '采收面积（万亩）', prop: 'scale', propEstimate: 'scaleEstimate' },
        { label: '产量（万吨）', prop: 'yield', propEstimate: 'yieldEstimate' },
        { label: '品质特点', prop: 'breedCharacter', propEstimate: 'breedCharacterEstimate', type: 'text' },
        { label: '均价（元/公斤）', prop: 'price', propEstimate: 'priceEstimate' }
      ],
      breedList: [
        { name: '荔枝', bId: 100 },
        { name: '妃子笑', bId: 101 },
        { name: '糯米糍', bId: 102 },
        { name: '黑叶', bId: 103 },
        { name: '桂味', bId: 104 },
        { name: '白糖罂', bId: 105 },
        { name: '怀枝', bId: 106 }
      ],
      salesDesc: [
        { label: '电商销售占比', prop: 'esaleRate', propEstimate: 'esaleRateEstimate' },
        { label: '批发市场占比', prop: 'marketRate', propEstimate: 'marketRateEstimate' },
        { label: '商超销售占比', prop: 'superMarketRate', propEstimate: 'superMarketRateEstimate' },
        { label: '专卖店销售占比', prop: 'specialStoreRate', propEstimate: 'specialStoreRateEstimate' }

      ],
      salesRegionDesc: [
        { label: '省内', prop: 'provinceInRate', propEstimate: 'provinceInRateEstimate' },
        { label: '省外', prop: 'provinceOutRate', propEstimate: 'provinceOutRateEstimate' },
        { label: '出口', prop: 'exportRate', propEstimate: 'exportRateEstimate' }
      ]
    }
  },
  watch: {
    data(newVal) {
      if (!newVal.info) return
      this.form = newVal
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" >
  .questionnaire {
    .el-input {
      width: 100%;
      .el-input-group__append {
        padding: 0 8px;
      }
    }
  }
</style>
