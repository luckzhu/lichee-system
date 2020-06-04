<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" lazy>
        <component :is="tab.name" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Monitor',
  components: {
    Approved: () => import('./components/approved')
  },
  data() {
    return {
      tabs: [
        { label: '审核物流补助', name: 'Approved' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
