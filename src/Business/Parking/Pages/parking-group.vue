<template>
  <div class="page">
    <el-card class="left">
      <div class="title">分组管理</div>
      <DomainTree
        ref="tree"
        :tree="$store.getters.getParkingDomainTree('services')"
        @node-click="handleNodeClick"
        @node-contextmenu="handleNodeContextmenu"
      />
    </el-card>
    <el-card class="right">
      <div class="title">场库列表</div>
      <!-- 表格 -->
      <GTable v-loading="tableLoading" :tableLabel="tableLabel" :tableData="tableData"></GTable>
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
        <span slot="title">添加分组</span>
      </el-menu-item>
      <el-menu-item
        v-if="$store.getters.hasPermission($api.domain.modify) && !modifyDisabled"
        index="modify"
        class="menuItem"
      >
        <Icons type="icon-bianji" />
        <span slot="title">修改组名</span>
      </el-menu-item>
      <el-menu-item
        v-if="$store.getters.hasPermission($api.sensor.set_domains) && !setParkingDisabled"
        index="set_parking"
        class="menuItem"
      >
        <Icons type="icon-tingchechang" />
        <span slot="title">分配场库</span>
      </el-menu-item>
      <el-menu-item
        v-if="$store.getters.hasPermission($api.domain.remove) && !removeDisabled"
        index="remove"
        class="menuItem"
      >
        <Icons type="icon-shanchu" />
        <span slot="title">删除分组</span>
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
      title="分配场库"
      v-if="setParkingVisible"
      :visible.sync="setParkingVisible"
      width="300px"
    >
      <div>
        <GCheckbox
          :showBtn="false"
          :showFooter="true"
          :list="allparkingOption"
          :checked="currentParking"
          @onCommit="handleSetparking"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableLoading: false,
      menuVisible: false,
      currentId: null,
      currentData: {
        id: null,
        path: null,
        name: '',
      },
      removeDisabled: false,
      modifyDisabled: false,
      setParkingDisabled: false,
      currentParking: [],
      tableLabel: [
        {
          prop: 'name',
          label: '名称'
        },
        {
          prop: 'sn',
          label: '编号'
        },
        {
          prop: 'type_text',
          label: '类型'
        },
        {
          prop: 'total_number',
          label: '车位总数'
        },
        {
          prop: 'operator_text',
          label: '所属运营商'
        },
        {
          prop: 'plateform_text',
          label: '所属平台'
        },
        {
          prop: 'isvalid_tag',
          label: '是否有效',
          tag: true
        }
      ],
      setParkingVisible: false
    }
  },
  computed: {
    plateformMap () {
      let map = this.$utils.OptionChangeMap(this.$store.getters.plateformOption())
      return map
    },
    allParkingList () {
      let list = this.$store.getters.getParkingList().map(x => {
        const type_text = this.$store.state.parkingData.PARKING_TYPE_MAP.get(x.type)
        const operator_text = this.$store.getters.getDomainDataById(x.operator, 'name', 'services')
        const plateform_text = this.plateformMap.get(x.plateform) || '独立上报'
        const isvalid_tag = {
          value: x.isvalid ? '有效' : '禁用',
          danger: !x.isvalid,
          success: x.isvalid
        }
        const isOnline_tag = {
          value: x.is_online ? '在线' : '离线',
          danger: !x.is_online,
          success: x.is_online
        }

        let item = {
          ...x,
          type_text,
          operator_text,
          plateform_text,
          isvalid_tag,
          isOnline_tag
        }
        return item
      })
      return list
    },
    allparkingOption ({ allParkingList }) {
      let list = allParkingList.map(x => {
        return {
          label: x.name,
          value: x.parking_id
        }
      })
      return list
    },
    tableData ({ allParkingList, currentParking, currentId }) {
      let list = []
      if (currentId === null) {
        list = allParkingList
      } else if (currentId) {
        list = allParkingList.filter(x => currentParking.includes(x.parking_id))
      }
      return list
    }
  },
  methods: {
    handleNodeClick (data, node) {
      this.menuVisible = false
      console.log(data, node)

      let { id, path, name } = data

      if (this.currentId === id) {
        this.$refs.tree.setCurrentKey(null)
        this.currentId = null
        this.currentData = {}
        return
      }

      this.currentId = id
      this.currentData = { id, name, path }
      this.fetchParkingListByDomainPath(path)
    },
    handleNodeContextmenu (event, data, node, element) {
      const { level } = node
      if (level === 1) {
        this.removeDisabled = true
        this.modifyDisabled = true
        this.setParkingDisabled = true
      } else {
        this.removeDisabled = false
        this.modifyDisabled = false
        this.setParkingDisabled = false
      }
      if (this.currentId !== data.id) {
        this.currentId = data.id
        this.$refs.tree.setCurrentKey(this.currentId)
        this.currentData = data
        this.fetchParkingListByDomainPath(data.path)
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
      const { currentId: id, currentData, $message, $store } = this
      if (key === 'add') {
        this.handleAdd()
      } else if (key === 'modify') {
        this.$prompt('请输入新的组名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: currentData.name,
          inputValidator: val => {
            if (val === null || val === '' || /^[ ]+$/.test(val)) {
              return false
            } else return true
          },
          inputErrorMessage: '组名不可为空'
        }).then(({ value }) => {
          let params = {
            id,
            name: value
          }
          $store.dispatch('modifyServiceGroup', params).then(res => {
            if (res.code === 1000) {
              $message.success('修改成功')
            } else {
              $message.error('修改失败')
            }
            this.currentId = null
          })
        }).catch(_ => { })
      } else if (key === 'set_parking') {
        this.setParkingVisible = true
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
        name: '新分组',
        code: '',
        info: {},
        memo: '',
      }
      $store.dispatch('addServiceGroup', params).then(res => {
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
      $store.dispatch('removeServiceGroup', id).then(res => {
        if (res.code === 1000) {
          $message.success('删除成功')
        } else {
          $message.error(res.msg)
        }
        this.currentId = null
      })
    },
    fetchParkingListByDomainPath (path) {
      this.tableLoading = true
      return this.$store.dispatch('fetchGetParkList', {
        page_no: 1,
        page_size: 9999,
        domain_id: [
          this.$store.getters.getBaseDomainPath(),
          [path]
        ]
      }).then(res => {
        let list = res.list.map(x => x.parking_id)
        this.currentParking = list
        this.tableLoading = false
        return list
      })
    },
    handleSetparking (value, options) {
      const { $store, $message, currentId: domainId } = this
      let promises = options.map(x => {
        let params = {
          id: x.value,
          newDomains: [{ id: domainId, enabled: value.includes(x.value) }]
        }
        return $store.dispatch('setSensorDomains', params)
      })
      Promise.all(promises).then(res => {
        if (res.every(x => x.code === 1000)) {
          $message.success('分配成功')
          this.setParkingVisible = false
          this.fetchParkingListByDomainPath(this.currentData.path)
        } else {
          $message.error('分配失败')
        }
      })
    }

  },
  beforeCreate () {
    this.$store.dispatch('fetchGetAllParking')

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
      .title {
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        padding: 8px 0;
      }
    }
  }
  .left /deep/ .el-card__body {
    display: grid;
    grid-template-rows: 45px 1fr;
  }
  .el-form {
    margin: 0 auto;
    min-width: 300px;
    max-width: 500px;
  }
  #rightClickMenu {
    position: absolute;
    z-index: 1000;
    width: 100px !important;
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
