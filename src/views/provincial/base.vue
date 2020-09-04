<template>
  <div>
    <p>当前企业：{{ unitInfo.unitName }}</p>
    <BaseAudit :category-and-breed="categoryAndBreed" :unit-id="unitId" :send-msg-visible="true">
      <template v-slot:action>
        <el-select v-model="category">
          <el-option v-for="(value,key) in allBreedMap" :key="key" :value="key" :label="value.name" />
        </el-select>
      </template>
    </BaseAudit>
  </div>
</template>

<script>
import BaseAudit from '@/views/Shared/Base/index'
import { allBreedMap } from '@/utils/submit'
import { queryUnit } from '@/api/user'
export default {
  components: {
    BaseAudit
  },
  data() {
    return {
      allBreedMap,
      category: 'pomelo',
      unitInfo: {}
    }
  },
  computed: {
    unitId() {
      return parseInt(this.$route.params.id)
    },
    categoryAndBreed() {
      return allBreedMap[this.category]
    }
  },
  mounted() {
    this.getUnitInfo()
  },
  methods: {
    async getUnitInfo() {
      const { rows } = await queryUnit({ id: this.unitId })
      const [info] = rows
      this.unitInfo = info
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
