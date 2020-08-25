<template>
  <div class="survey-container">
    <p class="title">2020年广东荔枝企业生产调查表</p>
    <Survey :category-and-breed="categoryAndBreed" />
  </div>
</template>

<script>
import Survey from '@/views/Shared/Survey/index'
import { allBreedMap } from '@/utils/submit'

export default {
  components: {
    Survey
  },
  data() {
    return {
      categoryAndBreed: allBreedMap.lichee
    }
  }
}
</script>

<style lang="scss" scoped>
.survey-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title{
    font-size: 20px;
    font-weight: 600;
  }
}

</style>
