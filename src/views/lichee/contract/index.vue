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
        { label: '登记备案合同', name: 'Approved', roles: ['nongye'] },
        { label: '查看备案合同', name: 'Audit', roles: ['shiji'] }
      ]
    }
  },
  methods: {
    checkPermission
  }
}
</script>

<style lang="scss">
.contract a {
  cursor: pointer;
  color: #409eff;
  text-decoration: underline;
}
</style>
