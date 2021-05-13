<template>
  <div class="GCheckbox" :key="componentId">
    <div :style="{'padding-left': padding+'px', 'padding-top': padding+'px'}">
      <el-checkbox
        :disabled="checkAll"
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="a => {handleCheckAllChange(a, true)}"
      >{{selectAllText}}</el-checkbox>
      <el-checkbox
        :disabled="notCheckAll"
        :indeterminate="isIndeterminate"
        v-model="notCheckAll"
        @change="a => {handleCheckAllChange(a, false)}"
      >{{cancelAllText}}</el-checkbox>
      <el-button
        v-if="showBtn"
        style="margin-left: 30px;padding: 4px 8px"
        @click="handleCommit"
      >{{btnText}}</el-button>
    </div>
    <el-checkbox-group v-model="myChecked" :style="boxGroupStyle" @change="handleChange">
      <div v-for="(item, i) in list" :key="componentId+'checkbox'+i">
        <el-checkbox :label="item.value">{{item.label}}</el-checkbox>
      </div>
    </el-checkbox-group>
    <div v-if="showFooter" style="text-align: right">
      <el-button
        size="small"
        type="primary"
        @click="handleCommit"
      >{{btnText}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    checked: {
      type: Array,
      default: () => []
    },
    padding: {
      type: Number,
      default: 12
    },
    span: {
      type: Number,
      default: 1
    },
    selectAllText: {
      type: String,
      default: '全部选中'
    },
    cancelAllText: {
      type: String,
      default: '全部取消'
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: '确认'
    }
  },
  data () {
    return {
      myChecked: this.checked,
      checkAll: false,
      notCheckAll: false
    }
  },
  watch: {
    checked (val) {
      this.myChecked = val
      this.checkAll = this.myChecked.length === this.list.length
      this.notCheckAll = this.myChecked.length === 0
    }
  },
  computed: {
    componentId () {
      return `checkboxGroup_${this._uid}`
    },
    optionCount () { // 选项数量
      return this.list.length
    },
    checkedCount () { // 已选数量
      return this.myChecked.length
    },
    isIndeterminate ({ checkedCount, optionCount }) {
      return checkedCount > 0 && checkedCount < optionCount
    },
    boxGroupStyle () {
      return {
        'display': 'grid',
        'padding': `${this.padding}px`,
        'grid-template-columns': `repeat(${this.span}, 1fr)`,
        'grid-row-gap': `${this.padding}px`
      }
    }
  },
  methods: {
    commitChange () {
      const { checkedCount, optionCount, myChecked, list } = this
      this.checkAll = checkedCount === optionCount
      this.notCheckAll = checkedCount === 0
      this.$emit('onChange', myChecked, list)
    },
    handleCheckAllChange (val, boolean) {
      this.myChecked = val && boolean ? this.list.map(x => x.value) : []
      this.commitChange()
    },
    handleCommit () {
      this.$emit('onCommit', this.myChecked, this.list)
    },
    handleChange (val) {
      this.commitChange()
    }
  },
  created () {
    this.checkAll = this.myChecked.length === this.list.length
    this.notCheckAll = this.myChecked.length === 0
  }
}
</script>
