<template>
  <div>
    <Base :category-and-breed="categoryAndBreed" />
  </div>
</template>

<script>
import Base from '@/views/Shared/Base/index'
import { allBreedMap } from '@/utils/submit'

export default {
  components: {
    Base
  },
  data() {
    return {
      categoryAndBreed: allBreedMap.longan
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
