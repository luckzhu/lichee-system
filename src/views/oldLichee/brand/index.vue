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
  name: 'Brand',
  components: {
    Audit: () => import('./components/audit'),
    Approved: () => import('./components/approved')
  },
  data() {
    return {
      tabs: [
        { label: '品牌标识申领', name: 'Approved', roles: ['nongye'] },
        { label: '查看申领信息', name: 'Audit', roles: ['shiji'] }
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
