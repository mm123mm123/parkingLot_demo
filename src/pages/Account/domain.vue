<template>
  <div class="page">
    <el-card class="left">
      <DomainTree @node-click="handleNodeClick" @node-contextmenu="handleNodeContextmenu" />
    </el-card>
    <el-card class="right">
      <el-form :model="currentData" label-width="100px" size="small">
        <el-form-item label="ID">
          <el-input disabled v-model="currentData.id"></el-input>
        </el-form-item>
        <el-form-item label="代码">
          <el-input v-model="currentData.code"></el-input>
        </el-form-item>
        <el-form-item label="名称" :rules="[{ required: true, message: '该项为必填', trigger: 'blur' }]">
          <el-input v-model="currentData.name"></el-input>
        </el-form-item>
        <el-form-item label="扩展信息" :rules="[{ required: true, message: '该项为必填', trigger: 'blur' }]">
          <el-input type="textarea" :rows="15" v-model="currentData.info" placeholder="JSON格式"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="currentData.memo"></el-input>
        </el-form-item>
        <el-button
          v-if="$store.getters.hasPermission($api.domain.modify)"
          :disabled="currentId === null"
          style="margin-left: 100px"
          type="primary"
          @click="handleModify"
        >保存</el-button>
      </el-form>
    </el-card>
    <el-menu
      v-show="menuVisible"
      id="rightClickMenu"
      @select="handleRightSelect"
      active-text-color="#fff"
      text-color="#fff"
    >
      <el-menu-item
        v-if="$store.getters.hasPermission($api.domain.add)"
        index="add"
        class="menuItem"
      >
        <Icons type="el-icon-plus" />
        <span slot="title">添加</span>
      </el-menu-item>
      <el-menu-item
        v-if="$store.getters.hasPermission($api.domain.set_tags)"
        index="tag"
        class="menuItem"
      >
        <Icons type="el-icon-price-tag" />
        <span slot="title">标签</span>
      </el-menu-item>
      <el-menu-item
        v-if="$store.getters.hasPermission($api.domain.remove)"
        index="remove"
        class="menuItem"
      >
        <Icons type="icon-shanchu" />
        <span slot="title">删除</span>
      </el-menu-item>
    </el-menu>

    <el-dialog
      :before-close="(done) => {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
      }"
      title="域标签"
      v-if="setTagsVisible"
      :visible.sync="setTagsVisible"
      width="500px"
    >
      <div>
        <GForm
          ref="modifyFrom"
          v-if="setTagsVisible"
          @onSubmit="handleSetTags"
          @onCancel="handleCloseSetTags"
          :formList="setTagsFormList"
          :default-value.sync="setTagsDefaultValue"
          :options="setTagsOptions"
        ></GForm>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuVisible: false,
      currentId: null,
      currentData: {
        id: null,
        code: '',
        name: '',
        memo: '',
        info: ''
      },
      setTagsVisible: false,
      setTagsFormList: [
        {
          title: '设置域标签',
          span: 24,
          children: [
            {
              type: 'checkbox',
              label: '标签',
              key: 'tag',
              options: []
            }
          ]
        }
      ],
      setTagsOptions: {},
      setTagsDefaultValue: {},
    }
  },
  methods: {
    handleNodeClick (data) {
      this.menuVisible = false
      console.log(data)
      let { id, code, name, memo, info } = data
      this.currentId = id
      info = JSON.stringify(info, null, 4)
      this.currentData = { id, code, name, memo, info }
    },
    handleNodeContextmenu (event, data, node, element) {
      if (this.currentId !== data.id) {
        this.currentId = data.id
        this.menuVisible = true
      } else {
        this.menuVisible = !this.menuVisible
      }
      document.addEventListener('click', (e) => {
        this.menuVisible = false
      })
      let menu = document.querySelector("#rightClickMenu")
      menu.style.left = event.offsetX + "px"
      menu.style.top = event.clientY - 30 + "px"
    },
    handleRightSelect (key) {
      const { currentId: id, $message, $store } = this
      if (key === 'add') {
        this.handleAdd()
      } else if (key === 'tag') {
        $store.dispatch('fetchAccountDomainTag', id).then(tags => {
          const tagOptions = tags.map(x => {
            const { id: value, name: label, enabled } = x
            return { value, label, enabled }
          })
          this.setTagsOptions = {
            tag: tagOptions
          }
          this.setTagsDefaultValue = {
            tag: tags.filter(x => x.enabled).map(x => x.id)
          }
          console.log(tagOptions, tags.filter(x => x.enabled).map(x => x.id));

          this.setTagsVisible = true
        })
      } else if (key === 'remove') {
        this.handleRemove()
      }
    },
    handleModify () {
      let { currentId: id, currentData, $message, $store } = this
      let info = JSON.parse(currentData.info)
      let params = {
        id,
        ...currentData,
        info
      }
      $store.dispatch('modifyAccountDomainTree', params).then(res => {
        if (res.code === 1000) {
          $message.success('修改成功')
        } else {
          $message.error('修改失败')
        }
        this.currentId = null
      })
    },
    handleAdd () {
      let { currentId: pid, $message, $store } = this
      let params = {
        pid,
        name: '新区域',
        code: '',
        info: {},
        memo: '',
      }
      $store.dispatch('addAccountDomainTree', params).then(res => {
        if (res.code === 1000) {
          $message.success('添加成功')
        } else {
          $message.error('添加失败')
        }
        this.currentId = null
      })
    },
    handleRemove () {
      let { currentId: id, $message, $store } = this
      $store.dispatch('removeAccountDomainTree', id).then(res => {
        if (res.code === 1000) {
          $message.success('删除成功')
        } else {
          $message.error(res.msg)
        }
        this.currentId = null
      })
    },
    handleCloseSetTags () {
      this.setTagsVisible = false
      this.setTagsOptions = {}
      this.setTagsDefaultValue = {}
    },
    handleSetTags (data) {
      let { currentId: id, setTagsOptions, $message, $store } = this
      let tag = data.tag
      const allTags = this.setTagsOptions.tag.map(x => x.value)
      let tags = allTags.map(id => {
        let enabled = tag.includes(id)
        return { id, enabled }
      })
      let params = { id, tags }
      console.log(tags);

      $store.dispatch('setAccountDomainTag', params).then(res => {
        if (res.code === 1000) {
          this.handleCloseSetTags()
          $message.success('设置成功')
        } else {
          $message.error('设置失败')
        }
      })
    }

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
  display: grid;
  grid-template-columns: 350px 1fr;
  column-gap: 12px;

  .left,
  .right {
    height: 100%;
    /deep/ .el-card__body {
      padding: 8px;
      height: 100%;
      overflow: auto;
      position: relative;
    }
  }
  .el-form {
    margin: 0 auto;
    min-width: 300px;
    max-width: 500px;
  }
  #rightClickMenu {
    position: absolute;
    z-index: 1000;
    width: 88px !important;
    background: #1f293d;
    i {
      color: #fff;
      font-size: 16px;
      width: 32px;
      padding: 0 8px;
      margin-right: 0;
    }
    .el-menu-item:focus,
    .el-menu-item:hover {
      background: rgba(25, 33, 49);
      color: @blue !important;
      i {
        color: @blue;
      }
    }
    .menuItem {
      height: 32px;
      line-height: 32px;
      padding: 0 !important;
      text-align: center;
    }
  }
}
</style>
