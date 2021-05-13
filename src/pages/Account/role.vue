<template>
  <div class="page">
    <PageListTemplate
      :key="_uid"
      ref="page"
      :className="'row'"
      infoTitle="角色详情"
      :infoHeader="infoHeader"
      @handleInfoBtn="open"
    >
      <!-- 搜索条件 -->
      <div slot="search-items">
        <div class="search-item">
          <label>角色ID</label>
          <el-input
            style="width: 190px"
            placeholder="输入ID"
            size="mini"
            prefix-icon="el-icon-search"
            clearable
            @change="fetchListSearch"
            v-model="keys.role_id"
          ></el-input>
        </div>
      </div>
      <!-- 按钮 -->
      <div slot="button" v-if="$store.getters.hasPermission($api.role.add)">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="addVisible = true">添加</el-button>
      </div>
      <GTable
        slot="table"
        v-loading="$store.getters.getRoleTableLoading()"
        @row-click="handleRow"
        :tableLabel="tableLabel"
        :tableData="$store.getters.getRoleList()"
      >
        <template #button="{data}">
          <span>
            <el-tooltip effect="dark" :open-delay="300" content="编辑角色" placement="top">
              <el-button
                size="mini"
                circle
                @click.stop="openModify(data)"
                :disabled="$store.getters.noPermission($api.role.modify)"
              >
                <Icons type="el-icon-edit" :size="14" />
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :open-delay="300" content="删除角色" placement="top">
              <el-button
                size="mini"
                circle
                @click.stop="handleRemove(data.id)"
                :disabled="$store.getters.noPermission($api.role.remove)"
              >
                <Icons type="el-icon-delete" :size="14" />
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :open-delay="300" content="设置权限" placement="top">
              <el-button
                size="mini"
                circle
                @click.stop="openSetFuncs(data.id)"
                :disabled="$store.getters.noPermission($api.role.set_funcs)"
              >
                <Icons type="icon-quanxian" :size="14" />
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :open-delay="300" content="分配厂商" placement="top">
              <el-button
                size="mini"
                circle
                @click.stop="openSetVenders(data.id)"
                :disabled="$store.getters.noPermission($api.role.set_venders)"
              >
                <Icons type="icon-changshangguanli" :size="14" />
              </el-button>
            </el-tooltip>
          </span>
        </template>
      </GTable>
    </PageListTemplate>

    <!-- 添加 -->
    <el-dialog
      :before-close="(done) => {
      this.$confirm('表单尚未提交确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
      }"
      title="添加角色"
      v-if="addVisible"
      :visible.sync="addVisible"
      width="500px"
    >
      <div>
        <GForm
          ref="addFrom"
          v-if="addVisible"
          @onSubmit="handleAdd"
          @onCancel="addVisible = false"
          :formList="formList"
          :options="{template_id: templateOptions}"
        ></GForm>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog
      :before-close="(done) => {
      this.$confirm('表单尚未提交确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
      }"
      title="修改角色"
      v-if="modifyVisible"
      :visible.sync="modifyVisible"
      width="500px"
    >
      <div>
        <GForm
          ref="modifyFrom"
          v-if="modifyVisible"
          @onSubmit="handleModify"
          @onCancel="modifyVisible = false"
          :formList="formList"
          :options="{template_id: templateOptions}"
          :default-value.sync="modifyDefaultValue"
        ></GForm>
      </div>
    </el-dialog>

    <!-- 设置厂商 -->
    <el-drawer
      v-if="setVendersVisible"
      :title="'厂商设置——' + id"
      :visible.sync="setVendersVisible"
      direction="rtl"
      :size="300"
      custom-class="setting-vender"
    >
      <div style="padding: 12px;">
        <label>厂商类型：</label>
        <el-select
          size="mini"
          prefix-icon="el-icon-search"
          v-model="venderType"
          clearable
          @change="fetchVenderList"
          placeholder="选择厂商类型"
        >
          <el-option
            v-for="item in $store.getters.getRoleVenderTypes()"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <GCheckbox
        :showBtn="false"
        :list="vendersOption"
        :checked="vendersChecked"
        @onChange="handleSetRoleVenders"
      />
    </el-drawer>

    <!-- 设置权限 -->
    <el-drawer
      v-if="setFunsVisible"
      :title="'设置权限——' + id"
      :visible.sync="setFunsVisible"
      direction="rtl"
      :size="600"
      custom-class="setting-function"
    >
      <div class="setFuns">
        <div class="fun-group">
          <div class="title">功能分组</div>
          <div class="content">
            <el-tree
              ref="tree"
              :data="funcsGroupData"
              :props="{
              children: 'children',
              label: 'name'
            }"
              node-key="id"
              :check-strictly="true"
              :highlight-current="true"
              @node-click="handleFuncsGroupClick"
            ></el-tree>
          </div>
        </div>
        <div class="fun">
          <div class="title">功能权限</div>
          <div class="content">
            <div style="padding: 0 12px;">
              显示API
              <el-switch v-model="showApi"></el-switch>
            </div>

            <GCheckbox
              :showBtn="false"
              :list="funcsOption"
              :checked="funcsChecked"
              @onChange="handleSetFuncs"
            />
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: null,
      keys: {
        role_id: null
      },
      tableLabel: [
        {
          prop: 'id',
          label: '角色ID'
        },
        {
          prop: 'name',
          label: '角色名称'
        },
        {
          prop: 'i',
          label: '操作',
          button: true
        },
      ],
      infoHeader: {
        title: '角色',
        button: {
          modify: {
            icon: '&#xe62a;',
            name: '修改',
          },
          remove: {
            name: '删除',
            icon: '&#xe64a;'
          }
        },
        data: {}
      },

      addVisible: false,
      modifyVisible: false,
      formList: [
        {
          title: '角色信息',
          children: [
            {
              type: 'input',
              label: '角色ID',
              key: 'role_id',
              placeholder: '请输入',
              rule: [{ required: true, message: '该项为必填', trigger: 'blur' }]
            },
            {
              type: 'input',
              label: '角色名称',
              key: 'role_name',
              placeholder: '请输入',
              rule: [{ required: true, message: '该项为必填', trigger: 'blur' }]
            },
            {
              type: 'select',
              label: '界面模板',
              key: 'template_id',
              placeholder: '请选择',
              rule: [{ required: true, message: '该项为必选', trigger: 'blur' }]
            },
          ]
        }
      ],
      modifyDefaultValue: {},
      setVendersVisible: false,
      venderType: null,
      setFunsVisible: false,
      showApi: false
    }
  },
  watch: {
    setFunsVisible (val) {
      !val && this.$store.commit('commitSetRoleFuncsList', [])
    }
  },
  computed: {
    templateOptions ({ $store }) {
      let list = $store.getters.getRoleTemplateList().map(x => {
        let item = {
          value: x.id,
          label: x.name
        }
        return item
      })
      return list
    },
    funcsGroupData ({ $store }) {
      let tree = $store.getters.getFunGroupTree()
      return tree
    },
    vendersOption ({ $store }) {
      let list = $store.getters.getRoleVenderList().map(x => ({ value: x.id, label: x.name }))
      return list
    },
    vendersChecked ({ $store }) {
      let list = $store.getters.getRoleVenderList().filter(x => x.enabled).map(x => x.id)
      return list
    },
    funcsOption ({ $store, showApi }) {
      let list = $store.getters.getFuncsList().map(x => {
        let item = {
          value: x.id,
          label: x.name + (showApi ? (' - ' + x.api) : '')
        }
        return item
      })
      return list
    },
    funcsChecked ({ $store }) {
      let list = $store.getters.getFuncsList().filter(x => x.enabled).map(x => x.id)
      return list
    }

  },
  methods: {
    handleRow (data) {
      console.log(data)
      this.id = data.id
      this.$refs.page.setInfoHeaderTitle(data.name)
      this.$refs.page.setCurrentData(data)
      this.$refs.page.openInfo()
    },
    handleAdd (data) {
      this.$store.dispatch('addRole', data).then(res => {
        if (res.code === 1000) {
          this.addVisible = false
        }
      })
    },
    openModify (data) {
      this.modifyDefaultValue = {
        role_id: data.id,
        role_name: data.name,
        template_id: data.template_id
      }
      this.modifyVisible = true
    },
    handleModify (data) {
      this.$store.dispatch('modifyRole', data).then(res => {
        if (res.code === 1000) {
          this.modifyVisible = false
        }
      })
    },
    handleRemove (id) {
      this.$confirm('确定删除吗?').then(_ => {
        this.$store.dispatch('removeRole', id)
      })
    },
    openSetFuncs (id) {
      this.id = id
      this.setFunsVisible = true
    },
    handleFuncsGroupClick (data) {
      console.log(data)
      const { id: group_id } = data
      const params = {
        group_id,
        role_id: this.id
      }
      this.$store.dispatch('fetchRoleFuncs', params)
    },
    handleSetFuncs (val, options) {
      let funcs = options.map(x => {
        const { value: id } = x
        const enabled = val.includes(id)
        return { id, enabled }
      })
      const params = {
        funcs,
        role_id: this.id
      }
      this.$store.dispatch('setRoleFuncs', params).then(res => {
        if (res.code !== 1000) {
          this.$message.error(`设置失败`)
        }
      })
    },
    openSetVenders (id) {
      this.id = id
      this.venderType = null
      this.fetchVenderList()
      this.setVendersVisible = true
    },
    handleSetRoleVenders (val, options) {
      let venders = options.map(x => {
        const { value: id } = x
        const enabled = val.includes(id)
        return { id, enabled }
      })
      const params = {
        venders,
        role_id: this.id
      }
      this.$store.dispatch('setRoleVender', params).then(res => {
        if (res.code !== 1000) {
          this.$message.error(`设置失败`)
        }
      })

    },
    fetchVenderList () {
      let params = {
        role_id: this.id,
        type_id: this.venderType,
      }
      this.$store.dispatch('fetchRoleVender', params)
    },
    fetchListSearch () {
      this.$store.dispatch('fetchRoleList', this.keys)
    },

    open (type) {
      let data = this.$refs.page.getCurrentData()
      let { id } = data
    },

  },
  beforeCreate () {
    let promises = [
      this.$store.dispatch('fetchRoleList', this.keys),
      this.$store.dispatch('fetchRoleFunGroupTree'),
      this.$store.dispatch('fetchRoleVenderTypes'),
      this.$store.dispatch('fetchRoleTemplateList'),
    ]
    Promise.all(promises)

  },
  created () {
  },
  mounted () {
  }
}
</script>
<style scoped lang="less">
@import '~@assets/style/index.less';
.page {
  height: 100%;
  padding: 12px;
  /deep/ .setting-vender,
  /deep/ .setting-function {
    .el-drawer__header {
      padding: 0;
      text-align: center;
      height: 44px;
      line-height: 44px;
      font-size: 18px;
      color: #666;
      border-bottom: 1px solid #c0c4d3;
      margin-bottom: 0px;
    }
    .el-drawer__body {
      height: ~'calc(100% - 44px)';
    }
  }
  .setFuns {
    display: flex;
    height: 100%;
    overflow: hidden;
    .fun-group,
    .fun {
      height: 100%;
      display: grid;
      padding: 12px;
      grid-template-rows: 45px 1fr;
    }
    .fun-group {
      width: 200px;
    }
    .fun {
      flex: 1;
    }
    .title {
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      padding: 8px 0;
    }
    .content {
      overflow: auto;
    }
  }
}
</style>
