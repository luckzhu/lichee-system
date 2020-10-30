<template>
  <div>
    <el-tabs type="border-card">
      <template v-for="tab in tabs">
        <el-tab-pane :key="tab.name" :label="tab.label" lazy>
          <component :is="tab.name" :data="formData" />
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Marketing',
  components: {
    Questionnaire: () => import('./questionnaire'),
    Opinion: () => import('./opinion')
  },
  props: {
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tabs: [
        { label: '2020年广东荔枝12221市场营销情况表', name: 'Questionnaire' }
        // { label: '标准意见征集', name: 'Opinion' }
      ]
    }
  }
}
</script>
