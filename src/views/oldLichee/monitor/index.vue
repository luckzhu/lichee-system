<template>
  <div>
    <el-tabs type="border-card">
      <template v-for="tab in tabs">
        <el-tab-pane v-if="checkPermission(tab.roles)" :key="tab.name" :label="tab.label" lazy>
          <component :is="tab.name" />
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'Monitor',
  components: {
    ReportsWeekly: () => import('./components/reportsWeekly'),
    Audit: () => import('./components/audit')
  },
  data() {
    return {
      tabs: [
        {
          label: '基地周报',
          name: 'reports-weekly',
          roles: ['nongye', 'jidi']
        },
        { label: '分析报告', name: 'Audit', roles: ['shiji'] }
      ]
    }
  },
  methods: {
    checkPermission
  }
}
</script>

<style lang="scss" scoped>
</style>
