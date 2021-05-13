<template>
  <div class="tree">
    <el-tree
      ref="tree"
      :data="_tree"
      :props="defaultProps"
      node-key="id"
      :accordion="accordion"
      :default-expanded-keys="currentExpanded"
      :highlight-current="highlightCurrent"
      :show-checkbox="showCheckbox"
      :check-strictly="true"
      :default-checked-keys="_checked"
      :indent="indent"
      @node-click="handleNodeClick"
      @node-contextmenu="handleNodeContextmenu"
      @check-change="handleCheckChange"
      @check="handleCheck"
      @current-change="handleCurrentChange"
      @node-expand="handleNodeExpand"
      @node-collapse="handleNodeCollapse"
    ></el-tree>
  </div>
</template>

<script>
export default {
  props: {
    tree: {
      type: Array
    },
    accordion: { // 是否每次只打开一个同级树节点展开
      type: Boolean,
      default: false
    },
    expanded: { // 默认展开
      type: Array
    },
    showCheckbox: { // 节点是否可被选择
      type: Boolean,
      default: false
    },
    checked: { // 默认选中
      type: Array,
      default: () => []
    },
    indent: { // 相邻级节点间的水平缩进，单位为像素
      type: Number,
      default: 16
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      currentExpanded: []
    }
  },
  watch: {
    tree () {
      this.initExpanded()
    }
  },
  computed: {
    _tree ({ tree }) { // 显示的树，props为传值时为用户域树
      if (tree) return tree
      return this.$store.getters.getAccountDomainTree()
    },
    _checked () { // 显示选中的节点
      return this.checked
    },
    // currentExpanded ({ _tree, expanded }) { // 显示默认展开的节点，props为传值时为所有一级节点
    //   if (expanded) return expanded
    //   return _tree.map(x => x.id)
    // },
    highlightCurrent ({ showCheckbox }) { // 是否高亮显示选中节点
      return !showCheckbox
    }
  },
  methods: {
    initExpanded () { // 初始化默认展开节点，props为传值时为所有一级节点
      const { _tree, expanded } = this
      const currentExpanded = expanded ? expanded : _tree.map(x => x.id)
      this.currentExpanded = currentExpanded
    },
    handleNodeClick (data, Node, VueComponent) { // 节点被点击时的回调
      this.$emit('node-click', data, Node, VueComponent)
    },
    handleNodeContextmenu (event, data, Node, VueComponent) { // 当某一节点被鼠标右键点击时会触发该事件
      this.$emit('node-contextmenu', event, data, Node, VueComponent)
    },
    handleCheckChange (data, checked) { // 节点选中状态发生变化时的回调
      this.$emit('check-change', data, checked)
    },
    handleCheck (data, checkedData) { // 当复选框被点击的时候触发
      this.$emit('check', data, checkedData)
    },
    handleCurrentChange (data, Node) { // 当前选中节点变化时触发的事件
      this.$emit('current-change', data, Node)
    },
    handleNodeExpand (data, Node, VueComponent) { // 节点被展开时触发的事件
      this.$emit('node-expand', data, Node, VueComponent)
      const { id } = data
      this.currentExpanded.push(id)
    },
    handleNodeCollapse (data, Node, VueComponent) { // 节点被关闭时触发的事件
      this.$emit('node-collapse', data, Node, VueComponent)
      const { id } = data
      this.$utils.removeArrayItem(this.currentExpanded, x => x === id)
    },
    setCurrentKey (key) {
      this.$refs.tree.setCurrentKey(key)
    }
  },
  created () {
    !this.tree && this.$store.dispatch('fetchAccountDomainTree').then(res => {
      this.initExpanded()
    })
    this.tree && this.initExpanded()
  },
  mounted () {
  },
}
</script>
<style scoped lang="less">
.tree {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .el-tree {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
</style>
