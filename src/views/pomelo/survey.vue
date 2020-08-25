<template>
  <div class="survey-container">

    <p class="title">2020年广东柚子企业生产调查表</p>
    <Survey />
  </div>
</template>

<script>
import Survey from '@/views/Shared/Survey/index'
export default {
  components: {
    Survey
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
