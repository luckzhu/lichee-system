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
    ReportsWeekly: () => import('./components/reports-weekly')
  },
  data() {
    return {
      tabs: [
        { label: '基地周报', name: 'reports-weekly' },
        { label: '基地月报', name: '' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
