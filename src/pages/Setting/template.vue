<template>
  <div class="page">
    <PageListTemplate
      :key="_uid"
      ref="page"
      :className="'row'"
      infoTitle="模板详情"
      :infoHeader="infoHeader"
      @handleInfoBtn="open"
    >
      <!-- 按钮 -->
      <div slot="button">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
      </div>
      <!-- 表格 -->
      <GTable
        slot="table"
        v-loading="tableLoading"
        @row-click="handleRow"
        @current-change="handlePageClick"
        @prev-click="handlePageClick"
        @next-click="handlePageClick"
        :page="page"
        :tableLabel="tableLabel"
        :tableData="tableData"
      >
        <template #button="{data}">
          <span>
            <el-button type="text" @click.stop="handleSet(data)">配置模板</el-button>
          </span>
        </template>
      </GTable>

      <!-- 详情 -->
      <template #infoBody="{data, infoVisible}">
        <div v-if="infoVisible">
          <BodyCard type="item" :data="{...infoData_info, data}" />
          <!-- <BodyCard type="memo" :data="{title: '说明', data: data.memo}" /> -->
          <BodyCard type="slot" :data="{title: 'JSON格式', data}">
            <div slot="slot-cont">
              <pre>{{data.contentData}}</pre>
            </div>
            <template #btn>
              <el-button
                :style="{height: '80%',margin: 'auto 8px'}"
                size="mini"
                @click="handleCopy(data.contentData)"
              >复制</el-button>
            </template>
          </BodyCard>
        </div>
      </template>
    </PageListTemplate>

    <!-- 配置 -->
    <el-dialog
      :before-close="(done) => {
      this.$confirm('表单尚未提交确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
      }"
      title="配置模板"
      v-if="setVisible"
      :visible.sync="setVisible"
      width="1200px"
    >
      <div style="height: 550px;">
        <el-tabs value="1">
          <el-tab-pane label="基本信息" name="1">
            <el-form :model="currentData" label-width="280px" size="mini">
              <el-form-item
                label="网页标题"
                :rules="[{ required: true, message: '该项为必填', trigger: 'blur' }]"
              >
                <el-input v-model="currentData.title" style="width: 300px"></el-input>
              </el-form-item>

              <el-form-item
                label="项目类型"
                :rules="[{ required: true, message: '该项为必填', trigger: 'blur' }]"
              >
                <el-input v-model="currentData.type" style="width: 300px"></el-input>
              </el-form-item>

              <el-form-item label="顶部栏Logo图标（大）">
                <el-upload
                  class="uploader"
                  :action="$store.getters.getBaseUrl('baseUrl') + $api.template.upload_res"
                  :data="{ json: JSON.stringify({ template_id: id, name: 'logoLargeUrl', ...config.requestBody, access_token: $store.getters.getToken }) }"
                  :show-file-list="false"
                  :on-success="(a, b, c) => { handleUploadSuccess(a, b, c, 'logoLargeUrl')}"
                >
                  <img
                    v-if="currentData.logoLargeUrl"
                    :src="currentData.logoLargeUrl"
                    class="image"
                  />
                  <Icons v-else type="el-icon-plus" />
                </el-upload>
              </el-form-item>

              <el-form-item label="顶部栏Logo图标（小）">
                <el-upload
                  class="uploader"
                  :action="$store.getters.getBaseUrl('baseUrl') + $api.template.upload_res"
                  :data="{ json: JSON.stringify({ template_id: id, name: 'logoSmallUrl', ...config.requestBody, access_token: $store.getters.getToken }) }"
                  :show-file-list="false"
                  :on-success="(a, b, c) => { handleUploadSuccess(a, b, c, 'logoSmallUrl')}"
                >
                  <img
                    v-if="currentData.logoSmallUrl"
                    :src="currentData.logoSmallUrl"
                    class="image"
                  />
                  <Icons v-else type="el-icon-plus" />
                </el-upload>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="左侧菜单" name="2">左侧菜单</el-tab-pane>
          <el-tab-pane label="顶部菜单" name="3">顶部菜单</el-tab-pane>
          <el-tab-pane label="业务菜单" name="4">
            <div style="height: 100%; display: flex;">
              <div>
                <div style="text-align: right;padding: 8px;">
                  <el-button size="mini" type="primary" @click="handleAddMenu">添加</el-button>
                </div>
                <el-menu default-active="submenu0" class="menu">
                  <template v-if="currentData.side_menu && currentData.side_menu.length">
                    <div
                      v-for="(menu, i) in currentData.side_menu"
                      :key="`side_menu_${i}`"
                      :id="i"
                      draggable="true"
                      @dragstart.stop="handlerDragstart"
                      @drag.stop="handlerDrag"
                      @dragover.stop
                      @dragend.stop
                    >
                      <el-submenu :index="'submenu' + i">
                        <template slot="title">
                          <Dropdown trigger="contextMenu" style="margin-left: 20px">
                            <div style="height: 100%">
                              <Icons v-if="menu.icon" :type="menu.icon" color="#333" />
                              <span style="padding-left: 4px" @click="handleMenu(i)">{{menu.name}}</span>
                            </div>
                            <DropdownMenu slot="list">
                              <div @click.stop>
                                <DropdownItem>
                                  <div @click="handleAddMenuItem($event, i)">添加</div>
                                </DropdownItem>
                                <DropdownItem>
                                  <div @click="handleDelMenu(i)">删除</div>
                                </DropdownItem>
                              </div>
                            </DropdownMenu>
                          </Dropdown>
                        </template>

                        <div
                          v-for="(item, item_i) in menu.menu"
                          :key="`menu_${i}${item_i}`"
                          :id="item_i"
                          draggable="true"
                          @dragstart.stop="handlerDragstart"
                          @drag.stop="handlerDrag($event, i)"
                          @dragover.stop
                          @dragend.stop
                        >
                          <el-menu-item-group :index="'menu' + i + item_i">
                            <el-menu-item @click="handleMenu(i, item_i)">
                              <Dropdown trigger="contextMenu" style="margin-left: 20px">
                                <Icons v-if="item.icon" :type="item.icon" color="#333" />
                                <span style="padding-left: 4px" @click="handleMenu(i)">{{item.name}}</span>
                                <DropdownMenu slot="list">
                                  <DropdownItem>
                                    <div @click="handleDelMenuItem(i, item_i)">删除</div>
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </el-menu-item>
                          </el-menu-item-group>
                        </div>
                      </el-submenu>
                    </div>
                  </template>
                </el-menu>
              </div>

              <el-form v-if="menuForm" :model="menuForm" label-width="280px" size="mini">
                <el-form-item
                  label="名称"
                  :rules="[{ required: true, message: '该项为必填', trigger: 'blur' }]"
                >
                  <el-input v-model="menuForm.name" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="图标">
                  <el-input v-model="menuForm.icon" style="width: 300px"></el-input>
                  <Icons v-if="menuForm.icon" :type="menuForm.icon" color="#333" />
                </el-form-item>

                <el-form-item label="路由">
                  <el-input v-model="menuForm.route" style="width: 300px"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div style="text-align: right;">
          <el-button @click="setVisible=false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 添加 -->
    <el-dialog
      :before-close="(done) => {
      this.$confirm('表单尚未提交确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
      }"
      title="添加模板"
      v-if="addVisible"
      :visible.sync="addVisible"
      width="600px"
    >
      <div>
        <GForm
          ref="modifyFrom"
          v-if="addVisible"
          @onSubmit="fetchAdd"
          @onCancel="addVisible=false"
          :formList="formList"
          :default-value.sync="defaultValue"
          :options="{}"
          :itemList="[]"
        ></GForm>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog
      :before-close="(done) => {
      this.$confirm('表单尚未提交确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
      }"
      title="修改模板"
      v-if="modifyVisible"
      :visible.sync="modifyVisible"
      width="600px"
    >
      <div>
        <GForm
          ref="modifyFrom"
          v-if="modifyVisible"
          @onSubmit="fetchModify"
          @onCancel="modifyVisible=false"
          :formList="formList"
          :default-value.sync="defaultValue"
          :options="{}"
          :itemList="[]"
        ></GForm>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import config from '@/config'

export default {
  data () {
    return {
      config,
      tableLoading: true,
      page: {
        page_no: 1,
        total: 0,
        page_size: 10
      },
      tableLabel: [
        {
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'name',
          label: '名称'
        },
        {
          prop: 'tag',
          label: '标签'
        },
        {
          prop: 'memo',
          label: '说明'
        },
        {
          prop: 'i',
          label: '操作',
          button: true
        },
      ],
      tableData: [],
      infoHeader: {
        title: '模板',
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
      infoData_info: {
        title: '模板信息',
        span: 8,
        label: [
          {
            prop: 'title',
            label: '标题'
          },
          {
            prop: 'type',
            label: '项目类型'
          },
        ],
        data: {}
      },
      id: null,
      addVisible: false,
      modifyVisible: false,
      formList: [
        {
          title: '模板信息',
          span: 24,
          children: [
            {
              type: 'input',
              label: '名称',
              key: 'name',
              placeholder: '请输入',
              rule: [{ required: true, message: '该项为必填', trigger: 'blur' }]
            },
            {
              type: 'textarea',
              label: '说明',
              key: 'memo',
              placeholder: '请输入',
              rule: [{ required: true, message: '该项为必填', trigger: 'blur' }]
            },
          ]
        },
        {
          title: '模板内容',
          span: 24,
          children: [
            {
              type: 'textarea',
              label: 'JSON格式',
              key: 'content',
              placeholder: '请输入',
              rows: 20,
              rule: [{ required: true, message: '该项为必填', trigger: 'blur' },
              { validator: this.validateJSON, trigger: ['blur'] }]
            },
          ]
        },

      ],
      defaultValue: {},

      setVisible: false,
      currentData: {},
      menuForm: {},
      menuVisible: false,
    }
  },
  computed: {
  },
  methods: {
    handleCopy (data) {
      const { copyToClipboard } = this.$utils
      copyToClipboard(JSON.stringify(data))
    },
    validateJSON (rule, value, callback) {
      if (!this.$utils.isJSON(value)) {
        callback(new Error('请检查是否为JSON格式'))
      } else {
        callback()
      }
    },
    handleRow (data) {
      console.log(data);
      this.id = data.id
      this.$refs.page.setInfoHeaderTitle(data.name)
      this.$refs.page.setCurrentData(data)
      this.$refs.page.openInfo()
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
      let params = {
        page_no: this.page.page_no,
        page_size: this.page.page_size,
      }
      this.$https.post(this.$api.template.get_list, params).then(res => {
        console.log(res);
        let tableData = [], total = 0
        if (res.code === 1000 && res?.list?.length) {
          tableData = res.list.map(x => {
            let contentData = JSON.parse(x.content)
            let { title, type = 'CE' } = contentData
            let content = JSON.stringify(contentData, null, 4)
            return { ...x, title, type, contentData, content }
          })
          total = res.total
        }
        this.tableData = tableData
        this.page.total = total
        this.tableLoading = false
      })
    },

    handleAdd () {
      this.addVisible = true
    },
    handleSet (data) {
      console.log(data);
      this.id = data.id
      this.currentData = this._.cloneDeep(data.contentData)
      this.menuForm = this.currentData?.side_menu?.[0] || null
      this.setVisible = true
    },
    handleUploadSuccess (res, file, fileList, key) {
      console.log(res, file);
      if (res.code === 1000) {
        let { url } = res
        const imgUrl = this.$store.getters.getBaseUrl('domin') + url
        this.currentData[key] = imgUrl
      }
    },
    handleMenu (i, n) {
      if (n === undefined) {
        this.menuForm = this.currentData.side_menu[i]
      } else {
        this.menuForm = this.currentData.side_menu[i].menu[n]
      }
    },
    handleAddMenu () {
      if (!this.currentData?.side_menu) {
        this.currentData.side_menu = []
      }
      this.currentData.side_menu.push({
        name: '新菜单',
        icon: 'el-icon-menu',
        route: ''
      })
      console.log(this.currentData.side_menu)
      this.$forceUpdate()
    },
    handleDelMenu (i) {
      this.currentData.side_menu.splice(i, 1)
    },
    handleAddMenuItem (event, i) {
      if (!this.currentData?.side_menu[i]?.menu) {
        this.currentData.side_menu[i].menu = []
      }
      this.currentData.side_menu[i].menu.push({
        name: '新菜单',
        icon: '',
        route: ''
      })
      this.$forceUpdate()
      // event.stopPropagation()
    },
    handleDelMenuItem (i, n) {
      this.currentData.side_menu[i].menu.splice(n, 1)
    },
    rightClick (MouseEvent) {
      this.menuVisible = false
      this.menuVisible = true
      let menu = document.querySelector('#menu')
      menu.style.left = MouseEvent.clientX + 'px'
      menu.style.top = MouseEvent.clientY + 'px'
    },
    handleSubmit () {
      console.log(this.currentData);
      const data = {
        content: JSON.stringify(this.currentData)
      }
      this.fetchModify(data)

    },
    fetchAdd (data) {
      let params = {
        tag: data.name,
        ...data
      }
      this.$https.post(this.$api.template.add, params).then(res => {
        if (res.code === 1000) {
          this.addVisible = false
          this.$message.success(`添加成功`)
          this.fetchList()
          this.$refs.page.closeInfo()
        } else {
          this.$message.info(`添加失败`)
        }
      })
    },
    fetchModify (data) {
      console.log(data);
      let params = {
        id: this.id,
        ...data
      }
      this.$https.post(this.$api.template.modify, params).then(res => {
        if (res.code === 1000) {
          this.modifyVisible = false
          this.setVisible = false
          this.$message.success(`修改成功`)
          this.fetchList()
          this.$refs.page.closeInfo()
          this.defaultValue = {}
        } else {
          this.$message.info(`修改失败`)
        }
      })
    },
    fetchRemove (id) {
      this.$confirm(`是否删除此模板?`, '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(res => {
        this.$https.post(this.$api.template.remove, { id }).then(res => {
          if (res.code === 1000) {
            this.$message.success(`删除成功`)
            this.fetchList()
            this.$refs.page.closeInfo()
          } else {
            this.$message.info(`删除失败`)
          }
        })
      })
    },
    open (type) {
      let data = this.$refs.page.getCurrentData()
      let { id } = data
      if (type === 'modify') {
        this.$refs.page.closeInfo()
        this.defaultValue = { ...data }
        this.modifyVisible = true
      }
      if (type === 'remove') {
        this.fetchRemove(id)
      }
    },



    handlerDragstart (e) {
      const { y, target } = e
      target.oriY = y
      target.oriIndex = Number(target.id)
    },

    handlerDrag (e, i) {
      let dataList = i === undefined
        ? this.currentData.side_menu
        : this.currentData.side_menu[i].menu

      const { y, target } = e
      if (y === 0) return
      const offset = y - target.oriY
      const length = dataList.length
      if (Math.abs(offset) > target.offsetHeight) {
        const index = target.oriIndex
        const copyList = [...dataList]
        let targetIndex = index + Math.round(offset / target.offsetHeight)

        if (targetIndex > length - 1) {
          targetIndex = length - 1
        } else if (targetIndex < 0) {
          targetIndex = 0
        }
        const readyToAppend = copyList.splice(index, 1)[0]
        copyList.splice(targetIndex, 0, readyToAppend)
        target.oriIndex = targetIndex
        target.oriY = y
        if (i === undefined) {
          this.currentData.side_menu = copyList
        } else {
          this.currentData.side_menu[i].menu = copyList
        }
        this.$forceUpdate()
      }
    },
  },
  created () {
    this.fetchList()
  },
  mounted () {
  }
}
</script>

<style scoped lang="less">
.page {
  height: 100%;
  position: relative;
  /deep/ .el-tabs__content {
    height: 470px;
  }
  .uploader {
    /deep/ .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409eff;
      }

      i {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
    }
    .image {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
  .el-tab-pane {
    height: 100%;
  }
  .menu {
    width: 300px;
    height: calc(100% - 40px);
    overflow: auto;
  }
}
</style>
