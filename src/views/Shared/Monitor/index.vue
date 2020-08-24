<template>
  <div>
    <el-tabs type="border-card">
      <template v-for="tab in tabs">
        <el-tab-pane :key="tab.name" :label="tab.label" lazy>
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
    Weekly: () => import('./components/weekly')
  },
  data() {
    return {
      tabs: [
        {
          label: '基地周报',
          name: 'Weekly'
        }
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
