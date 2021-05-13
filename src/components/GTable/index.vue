<template>
  <div>
    <el-table
      ref="table"
      style="width:100%"
      :data="tableData"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="tableOption.select" type="selection" width="55"></el-table-column>
      <el-table-column
        v-for="(item,index) in tableLabel"
        :width="item.width ? item.width : ''"
        :key="'column' + index"
        :label="item.label"
        :prop="item.prop"
        :sortable="item.sortable"
      >
        <template v-if="item.children && item.children.length">
          <el-table-column
            v-for="(child, child_index) in item.children"
            :width="child.width ? child.width : ''"
            :key="'column' + index + child_index"
            :label="child.label"
            :prop="child.prop"
            :sortable="child.sortable"
          ></el-table-column>
        </template>

        <template slot-scope="scope">
          <span v-if="item.tag">
            <GTag :data="scope.row[item.prop]"></GTag>
          </span>
          <span v-else-if="item.tags">
            <div v-for="(v,i) in scope.row[item.prop]" :key="`tag_${index}_${i}`">
              <GTag :data="v"></GTag>
            </div>
          </span>
          <span v-else-if="item.inlineTags">
            <span
              v-for="(v,i) in scope.row[item.prop]"
              :key="`tag_${index}_${i}`"
              :style="item.style"
            >
              <GTag :data="v"></GTag>
            </span>
          </span>
          <div v-else-if="item.button" style="display: flex; justify-content: space-between;">
            <slot name="button" :data="scope.row"></slot>
          </div>
          <div v-else-if="item.img" style="height: 100%; width: 100%">
            <img
              v-if="scope.row[item.prop]"
              :src="scope.row[item.prop]"
              style="display: flex; justify-content: space-between; max-height: 100%; max-width: 100%"
            />
            <None v-else type="pic" />
          </div>
          <span
            v-else
          >{{scope.row[item.prop] === null || scope.row[item.prop] === undefined ? '-' : scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="page.total" style="width: 100%; text-align: right; padding-top: 20px">
      <el-pagination
        @current-change="handleCurrentChange"
        @prev-click="handlePrevClick"
        @next-click="handleNextClick"
        layout="total, prev, pager, next"
        :total="page.total"
        :current-page="page.page_no"
        :page-size="page.page_size"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { exportData } from './export'
export default {
  name: 'index',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableLabel: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableOption: {
      type: Object,
      default: () => {
        return {}
      }
    },
    page: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      selectionData: [] // 选中数据
    }
  },
  methods: {
    handleSortChange (val) { // 排序
      this.$emit('handleSortChange', val)
    },
    handleSelectionChange (val) {
      this.$emit('selection-change', val)
      this.selectionData = val
    },
    handleRowClick (row, column, event) { // 表格
      this.$emit('row-click', row, column, event)
    },
    handleCurrentChange (page) { // 分页器
      this.$emit('current-change', page)
    },
    handlePrevClick (page) { // 分页器 上一页
      this.$emit('prev-click', page)
    },
    handleNextClick (page) { // 分页器 下一页
      this.$emit('next-click', page)
    },

    /**
     * 导出表格
     * 调用方法：
     * this.$refs[TABLE].exportXlsx(sheetName)
     * 注意：GTable组件需声明ref值[TABLE]
     */
    exportXlsx (sheetName, _data) {
      const { tableLabel, selectionData, tableData, tableOption, _, $utils } = this
      const { cloneDeep } = _
      const { select } = tableOption
      const { isType } = $utils

      // 处理表头数据
      const handleHeaderData = (list, noShow) => {
        let data = []
        for (const { prop, label: name, children } of list) {
          if (noShow.includes(prop)) continue
          let item = { prop, name }
          if (children?.length) {
            item.child = handleHeaderData(children, noShow)
          }
          data.push(item)
        }
        return data
      }

      // 筛选出type类型项的prop
      const getProps = (list, type) => {
        let props = []
        list.forEach(x => {
          const { prop, children } = x
          if (x[type]) {
            props.push(prop)
          }
          if (children?.length) {
            getProps(children, type)
          }
        })
        return props
      }

      // 获取tag项
      const getTagKeys = () => {
        return [...getProps(tableLabel, 'tag')]
      }
      // 获取tags项
      const getTagsKeys = () => {
        return [...getProps(tableLabel, 'tags'), ...getProps(tableLabel, 'inlineTags')]
      }
      // 获取不展示项 button、img
      const getNoShowKeys = () => {
        return [...getProps(tableLabel, 'button'), ...getProps(tableLabel, 'img')]
      }

      let revealList = handleHeaderData(cloneDeep(tableLabel), getNoShowKeys())

      if (_data && !isType(_data, 'Array')) {
        this.$message.error('要导出的数据不是一个数组！')
        return
      }

      let data = _data ? _data : select
        ? cloneDeep(selectionData) : cloneDeep(tableData)

      const tagKeys = getTagKeys()
      const tagsKeys = getTagsKeys()

      data.forEach(item => {
        tagKeys.forEach(key => {
          item[key] = this.$utils.isType(item[key], 'Object') ? item[key].value : item[key]
        })
        tagsKeys.forEach(key => {
          item[key] = item[key].map(x => {
            this.$utils.isType(x, 'Object') ? x.value : x
          }).join('、')
        })
      })

      if (!Array.isArray(data) || data.length < 1) {
        const ERROR_TEXT = select ? '请选择需要导出的数据！' : '暂无可导出的数据！'
        this.$message.warning(ERROR_TEXT)
        return
      }
      exportData(revealList, data, sheetName)
    },
  },
  mounted () {
  }
}
</script>

<style scoped>
</style>
