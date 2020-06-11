<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
// 边框改为红色，方便debuger
// .el-table--border:after,
// .el-table--group:after,
// .el-table:before {
//   background-color: red;
// }

// .el-table--border,
// .el-table--group {
//   border-color: red;
// }

// .el-table td,
// .el-table th.is-leaf {
//   border-bottom: 1px solid red;
// }

// .el-table--border th,
// .el-table--border th.gutter:last-of-type {
//   border-bottom: 1px solid red;
// }

// .el-table--border td,
// .el-table--border th {
//   border-right: 1px solid red;
// }
</style>
