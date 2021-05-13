<template>
  <el-card class="list">
    <div slot="header">
      <el-cascader
        placeholder="选择区域"
        size="small"
        v-model="domain_ids.government"
        style="width: 180px; margin-left: 15px"
        :props="{ multiple: true, emitPath: false, checkStrictly: true, value: 'path' }"
        @change="fetchListSearch"
        :options="$store.getters.getParkingDomainTreeByLevel('government', 0)"
        clearable
      ></el-cascader>
      <el-cascader
        placeholder="选择运营商"
        size="small"
        v-model="domain_ids.services"
        style="width: 180px; margin-left: 15px"
        :props="{ multiple: true, emitPath: false, checkStrictly: true, value: 'path' }"
        @change="fetchListSearch"
        :options="$store.getters.getParkingDomainTreeByLevel('services', 0)"
        clearable
      ></el-cascader>
      <el-cascader
        placeholder="选择平台"
        size="small"
        v-model="domain_ids.plateform"
        style="width: 180px; margin-left: 15px"
        :props="{ multiple: true, emitPath: false, checkStrictly: true, value: 'path' }"
        @change="fetchListSearch"
        :options="$store.getters.getParkingDomainTreeByLevel('plateform', 0)"
        clearable
      ></el-cascader>
      <el-input
        placeholder="场库名称"
        size="small"
        style="width: 180px; margin-left: 15px"
        prefix-icon="el-icon-search"
        clearable
        @change="fetchListSearch"
        v-model="keys.name"
      ></el-input>
      <el-button
        style="float: right"
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="handleAdd"
      >添加场库</el-button>
    </div>

    <GTable
      v-loading="tableLoading"
      @row-click="handleRow"
      @current-change="handlePageClick"
      @prev-click="handlePageClick"
      @next-click="handlePageClick"
      :page="page"
      :tableLabel="tableLabel"
      :tableData="tableData"
    ></GTable>

    <!-- 添加 -->
    <el-dialog
      :before-close="(done) => {
      this.$confirm('表单尚未提交确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
      }"
      title="添加场库"
      v-if="addVisible"
      :visible.sync="addVisible"
      width="500px"
    >
      <div>
        <GForm
          v-if="addVisible"
          @onSubmit="fetchAdd"
          @onCancel="handleCancel"
          :formList="formList"
          :default-value="defaultValue"
          :options="{...$store.getters.Domain_GFormOptions()}"
          :itemList="[]"
          :default-disabled="{auth_key: true}"
        ></GForm>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      keys: {
        name: null,
      },
      tableLoading: true,
      page: {
        page_no: 1,
        total: 0,
        page_size: 10
      },
      tableLabel: [
        {
          prop: 'name',
          label: '名称'
        },
      ],
      tableData: [],

    }
  },
  methods: {
    handleRow (data) {
    },
    handlePageClick (num) { // 点击页码时
      this.page.page_no = num
      this.fetchList()
    },
    fetchListSearch () {
      this.page.page_no = 1
      this.fetchList()
    },
    fetchList () {
      this.tableLoading = true
      let domain_id = [
        this.base_domain,
        ...Object.values(this.domain_ids).filter(x => x.length)
      ]
      let params = {
        page_no: this.page.page_no,
        page_size: this.page.page_size,
        domain_id
      }
      this.$utils.copyObj(params, this.keys) // 赋值搜索内容
      this.$store.dispatch('fetchGetParkList', params).then(({ list, total }) => {
        this.tableData = list
        this.page.total = total

        this.tableLoading = false
      })
    },

  },
  created () {

  },
  mounted () {

  }
}
</script>
<style scoped lang="less">
@import '~@assets/style/index.less';
.list {
  width: 100%;
  height: 100%;
  overflow: auto;
  /deep/ .el-card__header,
  /deep/ .el-card__body {
    padding: 12px;
  }
}
</style>
