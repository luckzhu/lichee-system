<!--需要注意，引入此地市下拉，传regionCode 进来，需等待渲染完毕-->
<!--地市下拉插件请注意，一定要用v-if，数据获取出来再去渲染子组件-->
<template>
  <div>
    <el-select v-model="cityValue" :placeholder="cityEmpty" size="small" :disabled="cityDisabled" @change="changeCity">
      <el-option
        v-for="item in options"
        :key="item.code"
        :label="item.name"
        :value="item.code"
      />
    </el-select>
    <el-select v-if="countyShow" v-show="specialCityShow" v-model="countyValue" size="small" :placeholder="countyEmpty" :disabled="countyDisabled">
      <el-option
        v-for="item in countyOption"
        :key="item.code"
        :label="item.name"
        :value="item.code"
      />
    </el-select>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  props: {
    regionCode: {
      type: String,
      default: null
    },
    countyShow: {
      type: Boolean,
      default: false
    },
    valueInCity: {// 县级下拉默认值是否显示地市的value和text
      type: Boolean,
      default: false
    },
    cityEmpty: {
      type: String,
      default: '请选择'
    },
    countyEmpty: {
      type: String,
      default: '请选择'
    },

    cityDisabled: {
      type: Boolean,
      default: false
    },
    countyDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [],
      countyOption: [],
      specialCityShow: true,
      cityValue: '',
      countyValue: ''
    }
  },
  watch: {
    cityValue(v) {
      this.$emit('cityChange', v)
    },
    countyValue(v) {
      this.$emit('getValue', v)
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      const that = this
      request({
        url: '/normal/queryRegion?type=1',
        method: 'GET'
      }).then(res => {
        const rows = res.rows === undefined ? res : res.rows
        that.options = rows
        if (this.cityEmpty) {
          that.options.unshift({
            name: this.cityEmpty,
            code: ''
          })
        } else {
          that.cityValue = rows[0]
        }
      }).then(function() {
        const regionCode = that.regionCode
        if (regionCode) {
          that.cityValue = regionCode.substring(0, 4)
          that.changeCity(that.cityValue, function() {
            if (regionCode.length > 4) {
              that.countyValue = regionCode
            }
          })
        }
      })
    },
    changeCity(v, suc) {
      if (!this.countyShow) {
        return
      }

      const c = v.substring(0, 4)
      if (c === '4419' || c === '4420') {
        this.countyValue = c + '00'
        this.specialCityShow = false
        return
      }
      this.specialCityShow = true
      this.countyValue = ''
      request({
        url: '/normal/queryRegion?type=2&code=' + c,
        method: 'GET'
      }).then(res => {
        const rows = res.rows === undefined ? res : res.rows
        this.countyOption = rows
        if (this.valueInCity) { // 县级下拉是否显示默认的地市value 和text
          let obj = {}
          obj = this.options.find((item) => {
            return item.code === v
          })
          this.countyOption.unshift({
            name: '全市',
            code: obj.code
          })
        }
        /* else{
            this.countyValue = rows[0].code;
          } */

        suc && suc()// 有回调则执行回调函数
      })
    }
  }
}
</script>
