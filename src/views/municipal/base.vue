<template>
  <div>
    <BaseAudit :category-and-breed="categoryAndBreed" :is-auditor="true">
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

export default {
  components: {
    BaseAudit
  },
  data() {
    return {
      allBreedMap,
      category: 'lichee'
    }
  },
  computed: {
    categoryAndBreed() {
      return allBreedMap[this.category]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
