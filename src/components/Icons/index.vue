<template>
  <i :class="className" :style="styles" @click="$emit('click')"></i>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    type: {
      type: String,
      required: true
    },
    color: {
      type: String,
    },
    size: {
      type: Number,
    }
  },
  computed: {
    className () {
      const type = this.type
      if (type.indexOf('el') === 0) return type
      if (type.indexOf('icon') === 0) return `iconfont ${type}`
      return type
    },
    styles () {
      return {
        fontSize: `${this.size}px`,
        color: this.color
      }
    }
  }
}
</script>
