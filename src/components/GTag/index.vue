<template>
  <el-tag
    v-if="data && data.danger"
    :size="size || 'mini'"
    type="danger"
  >{{data.value === null || data.value === undefined ? '-' : data.value}}</el-tag>
  <el-tag
    v-else-if="data && data.warning"
    :size="size || 'mini'"
    type="warning"
  >{{data.value === null || data.value === undefined ? '-' : data.value}}</el-tag>
  <el-tag
    v-else-if="data && data.info"
    :size="size || 'mini'"
    type="info"
  >{{data.value === null || data.value === undefined ? '-' : data.value}}</el-tag>
  <el-tag
    v-else-if="data && data.success"
    :size="size || 'mini'"
    type="success"
  >{{data.value === null || data.value === undefined ? '-' : data.value}}</el-tag>
  <el-tag v-else :size="size || 'mini'">{{data === null || data === undefined ? '-' : data}}</el-tag>
</template>

<script>
export default {
  name: 'GTag',
  props: ['data', 'size']
}
</script>

<style scoped>
</style>
