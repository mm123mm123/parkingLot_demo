<template>
  <div class="page">
    <PageListTemplate
      :key="_uid"
      ref="page"
      :className="'row'"
      infoTitle="停车场详情"
      :infoHeader="infoHeader"
      @handleInfoBtn="open"
    >
      <!-- 卡片 -->
      <div slot="card" class="card">
        <div class="box">
          <div class="title">统计</div>
          <div class="content">
            <div class="item">
              <div class="value">{{statistics.totalParkCount}}</div>
              <div class="label">停车场总数</div>
            </div>
            <div class="item">
              <div class="value">{{statistics.totalCarCount}}</div>
              <div class="label">车位总数</div>
            </div>
          </div>
        </div>

        <div class="box" v-for="(item, i) in statistics.typeList" :key="'card_box' + i">
          <div class="title">{{item.title}}</div>
          <div class="content">
            <div class="item">
              <div class="value">{{item.parkCount}}</div>
              <div class="label">停车场数量</div>
            </div>
            <div class="item">
              <div class="value">{{item.carCount}}</div>
              <div class="label">车位数量</div>
            </div>
          </div>
          <div class="prec">
            <el-progress class="left" :stroke-width="4" :percentage="~~(item.prePark * 100 || 0)"></el-progress>
            <el-progress class="right" :stroke-width="4" :percentage="~~(item.preCar * 100 || 0)"></el-progress>
          </div>
        </div>
      </div>

      <!-- 按钮 -->
      <div slot="button" v-if="$store.getters.hasPermission($api.parking.park.add)">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加场库</el-button>
      </div>

      <!-- 搜索条件 -->
      <div slot="search-items">
        <div class="search-item">
          <label>区域:</label>
          <el-cascader
            placeholder="选择区域"
            size="mini"
            v-model="domain_ids.government"
            :props="{ multiple: true, emitPath: false, checkStrictly: true, value: 'path' }"
            @change="fetchListSearch"
            :options="$store.getters.getParkingDomainTreeByLevel('government', 0)"
            clearable
          ></el-cascader>
        </div>
        <div class="search-item">
          <label>运营商:</label>
          <el-cascader
            placeholder="选择运营商"
            size="mini"
            v-model="domain_ids.services"
            :props="{ multiple: true, emitPath: false, checkStrictly: true, value: 'path' }"
            @change="fetchListSearch"
            :options="$store.getters.getParkingDomainTreeByLevel('services', 0)"
            clearable
          ></el-cascader>
        </div>
        <div class="search-item">
          <label>平台:</label>
          <el-cascader
            placeholder="选择平台"
            size="mini"
            v-model="domain_ids.plateform"
            :props="{ multiple: true, emitPath: false, checkStrictly: true, value: 'path' }"
            @change="fetchListSearch"
            :options="$store.getters.getParkingDomainTreeByLevel('plateform', 0)"
            clearable
          ></el-cascader>
        </div>
        <div class="search-item">
          <label>类型:</label>
          <el-select
            size="mini"
            prefix-icon="el-icon-search"
            v-model="keys.type"
            clearable
            @change="fetchListSearch"
            placeholder="选择类型"
          >
            <el-option
              v-for="item in $utils.mapChangeOption($store.state.parkingData.PARKING_TYPE_MAP)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <label>场库名称:</label>
          <el-input
            style="width: 190px"
            placeholder="场库名称"
            size="mini"
            prefix-icon="el-icon-search"
            clearable
            @change="fetchListSearch"
            v-model="keys.name"
          ></el-input>
        </div>
        <div class="search-item">
          <label>状态:</label>
          <el-select
            size="mini"
            prefix-icon="el-icon-search"
            v-model="keys.isvalid"
            clearable
            @change="fetchListSearch"
            placeholder="选择状态"
          >
            <el-option label="有效" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </div>
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
      ></GTable>

      <!-- 详情 -->
      <template #infoBody="{data, infoVisible}">
        <div v-if="infoVisible">
          <BodyCard type="item" :data="{...infoData_info, data}" />
          <BodyCard type="item" :data="{...infoData_realTime, data}" />

          <BodyCard
            v-if="data.boundary.length || (data.longitude && data.latitude)"
            type="slot"
            :data="{title: '地理信息'}"
          >
            <MapInfo
              slot="slot-cont"
              v-if="data.boundary.length || (data.longitude && data.latitude)"
              :path="data.boundary"
              :centerPoint="{lng: data.longitude, lat: data.latitude}"
            />
          </BodyCard>

          <BodyCard type="slot" :data="{title: '场内人员签到二维码'}">
            <template #btn>
              <el-button
                :style="{height: '80%',margin: 'auto 8px'}"
                size="mini"
                @click="handleSaveQrcode(data.name)"
              >保存</el-button>
            </template>
            <div id="qrcode" ref="qrcode" slot="slot-cont"></div>
          </BodyCard>
        </div>
      </template>
    </PageListTemplate>

    <!-- 添加 -->
    <el-dialog
      :before-close="(done) => {
      this.$confirm('表单尚未提交确认关闭？')
        .then(_ => {
          this.handleCancel()
          done()
        })
        .catch(_ => {})
      }"
      title="添加场库"
      v-if="addVisible"
      :visible.sync="addVisible"
      width="500px"
    >
      <div>
        <GForm
          ref="addFrom"
          v-if="addVisible"
          @onSubmit="fetchAdd"
          @onCancel="handleCancel"
          :formList="formList"
          :default-value.sync="defaultValue"
          :options="{...$store.getters.Domain_GFormOptions()}"
          :itemList="[]"
          :default-disabled="{auth_key: true}"
        ></GForm>
      </div>
    </el-dialog>

    <!-- 坐标拾取 -->
    <el-dialog
      :before-close="(done) => {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
      }"
      title="拾取坐标"
      v-if="getPointVisible"
      :visible.sync="getPointVisible"
      width="600px"
    >
      <div>
        <MapGetpoint
          v-if="getPointVisible"
          @onChange="onChangePoint"
          @onSubmit="handleSubmitPoint"
          @onCancel="() => {this.getPointVisible = false}"
          :type="'point'"
          :centerPoint="centerPoint"
        />
      </div>
    </el-dialog>

    <!-- 选择边界 -->
    <el-dialog
      :before-close="(done) => {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
      }"
      title="选择边界"
      v-if="getPolygonVisible"
      :visible.sync="getPolygonVisible"
      width="600px"
    >
      <div>
        <MapPolygon
          v-if="getPolygonVisible"
          @onChange="onChangePolygon"
          @onSubmit="handleSubmitPolygon"
          @onCancel="() => {this.getPolygonVisible = false}"
          :type="'point'"
          :path="polygonPath"
          :centerPoint="centerPoint"
        />
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog
      :before-close="(done) => {
      this.$confirm('表单尚未提交确认关闭？')
        .then(_ => {
          this.handleCancel()
          done()
        })
        .catch(_ => {})
      }"
      title="修改场库"
      v-if="modifyVisible"
      :visible.sync="modifyVisible"
      width="500px"
    >
      <div>
        <GForm
          ref="modifyFrom"
          v-if="modifyVisible"
          @onSubmit="fetchModify"
          @onCancel="handleCancel"
          :formList="formList"
          :default-value.sync="defaultValue"
          :options="{...$store.getters.Domain_GFormOptions()}"
          :itemList="[]"
          :default-disabled="{sn: true, auth_key: true, plateform: true, operator: true, area: true}"
          :default-hidden="{sn: true, plateform: true, operator: true, area: true}"
        ></GForm>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data () {
    return {
      statistics: {
        totalParkCount: 0,
        totalCarCount: 0,
        typeList: Object.keys(this.$utils.mapChangeObj(this.$store.state.parkingData.PARKING_TYPE_MAP)).map(x => ({ parkCount: 0, carCount: 0, prec: 0, title: this.$store.state.parkingData.PARKING_TYPE_MAP.get(+x) }))
      },
      keys: {
        name: null,
        type: null,
        isvalid: 1,
      },
      domain_ids: {
        government: [],
        services: [],
        plateform: [],
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
      tableData: [],
      infoHeader: {
        title: '停车场',
        button: {
          modify: {
            icon: 'icon-bianji',
            name: '修改',
          },
          // remove: {
          //   name: '删除',
          //   icon: 'icon-shanchu;'
          // },
          disable: {
            name: '禁用',
            icon: 'icon-jinyong'
          },
          open: {
            name: '开启',
            icon: 'icon-kaiqi'
          }
        },
        data: {}
      },
      infoData_info: {
        title: '停车场信息',
        span: 8,
        label: [
          {
            prop: 'name',
            label: '名称'
          },
          {
            prop: 'address',
            label: '地址'
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
            prop: 'isvalid_tag',
            label: '是否有效',
            tag: true
          },
          {
            prop: 'operator_text',
            label: '所属运营商'
          },
          {
            prop: 'plateform_text',
            label: '所属平台'
          },
        ],
        data: {}
      },
      infoData_realTime: {
        title: '实时数据',
        span: 6,
        label: [
          {
            prop: 'free_num',
            label: '余位数量'
          },
          {
            prop: 'car_num',
            label: '场内车数量'
          },
          {
            prop: 'staff_num',
            label: '场库内人员数量'
          },
          {
            prop: 'isOnline_tag',
            label: '是否离线',
            tag: true
          },
        ],
        data: {}
      },

      id: null,

      addVisible: false,
      formList: [
        {
          title: '场库信息',
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
              type: 'input',
              label: '编号',
              key: 'sn',
              placeholder: '请输入',
              rule: [{ required: true, message: '该项为必填', trigger: 'blur' }]
            },
            {
              type: 'input',
              label: '位置',
              key: 'address',
              placeholder: '请输入',
              rule: [{ required: true, message: '该项为必填', trigger: 'blur' }]
            },
            {
              type: 'select',
              label: '类型',
              key: 'type',
              placeholder: '请选择',
              options: this.$utils.mapChangeOption(this.$store.state.parkingData.PARKING_TYPE_MAP),
              rule: [{ required: true, message: '该项为必填', trigger: 'blur' }]
            },
            {
              type: 'input-num',
              label: '车位总数',
              key: 'total_number',
              placeholder: '请输入',
              rule: [{ required: true, message: '该项为必填', trigger: 'blur' }]
            },
            {
              type: 'cascader',
              label: '所属区域',
              key: 'area',
              multiple: false, // 是否多选
              checkStrictly: true,
              placeholder: '请选择',
              rule: [{ required: true, message: '该项为必填', trigger: 'blur' }]
            },
            {
              type: 'cascader',
              label: '所属运营商',
              key: 'operator',
              multiple: false, // 是否多选
              checkStrictly: true,
              placeholder: '请选择',
              rule: [{ required: true, message: '该项为必填', trigger: 'blur' }]
            },
            {
              type: 'select',
              label: '所属平台',
              key: 'plateform',
              multiple: false, // 是否多选
              checkStrictly: true,
              placeholder: '请选择',
              rule: []
            },
            {
              span: 16,
              type: 'input',
              label: '授权码',
              key: 'auth_key',
              placeholder: '点击按钮获取',
              rule: [],
            },
            {
              span: 8,
              showIcon: true,
              iconName: '获取授权码',
              iconMethods: () => {
                this.fetchGetAuthKey()
              }
            }
          ]
        },
        {
          title: '地理位置',
          span: 24,
          children: [
            {
              type: 'input',
              label: '经度',
              key: 'longitude',
              placeholder: '请输入',
            },
            {
              type: 'input',
              label: '纬度',
              key: 'latitude',
              placeholder: '请输入',
            },
            {
              span: 12,
              key: '',
              showIcon: true,
              iconName: '拾取坐标',
              icon: 'el-icon-map-location',
              iconMethods: () => {
                this.getPointVisible = true
              }
            },
            {
              span: 12,
              key: '',
              showIcon: true,
              iconName: '选择边界',
              icon: 'el-icon-map-location',
              iconMethods: () => {
                this.getPolygonVisible = true
              }
            }
          ]
        },

      ],
      // defaultValue: { "name": "停车场", "sn": "parking", "address": "西湖区", "type": 1, "total_number": 10, "area": 1985, "operator": 1967, "longitude": 120.13824, "latitude": 30.27325, "boundary": [{ "lng": 120.138483, "lat": 30.273141 }, { "lng": 120.138146, "lat": 30.27327 }, { "lng": 120.138096, "lat": 30.27341 }, { "lng": 120.138141, "lat": 30.273488 }, { "lng": 120.138541, "lat": 30.273843 }, { "lng": 120.138851, "lat": 30.27357 }], "isvalid": 1 },
      defaultValue: {},

      modifyVisible: false,


      getPointVisible: false,
      getPolygonVisible: false,
      centerPoint: {},
      polygonPath: [],

    }
  },
  computed: {
    plateformMap () {
      let map = this.$utils.OptionChangeMap(this.$store.getters.plateformOption())
      return map
    }
  },
  methods: {
    onChangePoint (point) {
      console.log(point)
    },
    handleSubmitPoint (point) {
      console.log(point)
      let { lng: longitude, lat: latitude } = point
      this.centerPoint = point
      this.getPointVisible = false
      if (this.addVisible) {
        this.$refs.addFrom.update({ longitude, latitude })
      }
      if (this.modifyVisible) {
        this.$refs.modifyFrom.update({ longitude, latitude })
      }
    },
    onChangePolygon (polygonPath) {
      console.log(polygonPath)
    },
    handleSubmitPolygon (polygonPath) {
      console.log(polygonPath)
      this.polygonPath = polygonPath
      this.getPolygonVisible = false
    },
    handleAdd () {
      this.$store.dispatch('fetchParkingDomainsByTag', 'government')
      this.$store.dispatch('fetchParkingDomainsByTag', 'services')
      this.$store.dispatch('fetchGetAllPlateFrom')
      this.addVisible = true
    },
    handleModify (id) {
      this.$store.dispatch('fetchParkingDomainsByTag', 'government')
      this.$store.dispatch('fetchParkingDomainsByTag', 'services')
      this.$store.dispatch('fetchGetAllPlateFrom')
      this.modifyVisible = true

    },
    handleCancel () {
      this.addVisible = false
      this.modifyVisible = false
      this.defaultValue = {}
      this.centerPoint = {}
      this.polygonPath = []
    },
    handleRow (data) {
      console.log(data)
      this.id = data.parking_id
      this.$refs.page.setInfoHeaderTitle(data.name)
      this.$refs.page.setCurrentData(data)

      !data.isvalid && this.$refs.page.setBtnState('disable', false)
      data.isvalid && this.$refs.page.setBtnState('open', false)
      this.$refs.page.openInfo()
      this.$nextTick(() => {
        let { urge_mobile: baseUrl } = this.$store.getters.getConfigData('outsideUrl')
        this.qrCode(`${baseUrl}?code=${window.btoa(data.sn)}`)
        console.log(window.btoa(data.sn))
      })
    },
    handleSaveQrcode (name) {
      let canvas = this.$refs.qrcode.querySelector('canvas')
      const strDataURI = canvas.toDataURL()
      let element = document.createElement('a')
      element.setAttribute('href', strDataURI.replace("image/png", 'image/octet-stream'))
      element.setAttribute('download', name + '.png')
      element.click()
    },
    qrCode (value) {
      this.$refs.qrcode.innerHTML = null
      const QRCode = this.$QRCode
      let qrcode = new QRCode('qrcode', {
        width: 300, // 图像宽度
        height: 300, // 图像高度
        colorDark: 'rgba(0, 0, 0, 1)', // 前景色
        colorLight: 'rgba(255, 255, 255, 1)', // 背景色
        correctLevel: QRCode.CorrectLevel.L // 容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
      })
      qrcode.clear() // 清除二维码
      qrcode.makeCode(value) // 生成另一个新的二维码
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
        this.$store.getters.getBaseDomainPath(),
        ...Object.values(this.domain_ids).filter(x => x.length)
      ]
      let params = {
        page_no: this.page.page_no,
        page_size: this.page.page_size,
        domain_id
      }
      this.$utils.copyObj(params, this.keys) // 赋值搜索内容
      this.$store.dispatch('fetchGetParkList', params).then(({ list, total }) => {
        let tableData = list.map(x => {
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
        this.tableData = tableData
        this.page.total = total
        this.tableLoading = false
      })
    },
    fetchStatistics () {
      let domain_id = [
        this.$store.getters.getBaseDomainPath(),
        ...Object.values(this.domain_ids).filter(x => x.length)
      ]
      let params = {
        domain_id
      }
      this.$store.dispatch('fetchGetParkStatistics', params).then(res => {
        if (!res) return
        let { totalParkCount, totalCarCount, types } = res
        let typeList = []
        for (const key in types) {
          let title = this.$store.state.parkingData.PARKING_TYPE_MAP.get(+key)
          let item = {
            ...types[key],
            title
          }
          typeList.push(item)
        }
        let statistics = { totalParkCount, totalCarCount, typeList }
        this.statistics = statistics
      })
    },
    fetchInfo (id) {
      this.$https.post(this.$api.visitor.get_info, { id }).then(res => {

      })
    },
    fetchAdd (data) {
      if (!data.plateform && !data.auth_key) {
        this.$message.warning('请选择所属平台或点击获取授权码')
        return
      }
      let params = this.$utils.copyObj({}, { ...data, boundary: JSON.stringify(this.polygonPath), isvalid: 1 })
      console.log(params)
      this.$https.post(this.$api.parking.park.add, params).then(res => {
        console.log(res)
        if (res.code === 1000) {
          this.addVisible = false
          this.$message.success(`添加成功`)
          this.fetchList()
          this.fetchStatistics()

          this.defaultValue = {}
          this.centerPoint = {}
          this.polygonPath = []
        } else {
          this.$message.info(`添加失败`)
        }
      })
    },
    fetchModify (data) {
      if (!data.plateform && !data.auth_key) {
        this.$message.warning('请选择所属平台或点击获取授权码')
        return
      }
      const parking_id = this.id
      // let params = this.$utils.copyObj({}, { ...data, parking_id, boundary: JSON.stringify(this.polygonPath) })

      let params = { ...data, parking_id, boundary: JSON.stringify(this.polygonPath) }


      console.log(params)
      this.$https.post(this.$api.parking.park.modify, params).then(res => {
        console.log(res)
        if (res.code === 1000) {
          this.modifyVisible = false
          this.$message.success(`修改成功`)
          this.fetchList()
          this.fetchStatistics()

          this.defaultValue = {}
          this.centerPoint = {}
          this.polygonPath = []
        } else {
          this.$message.info(`修改失败`)
        }
      })

    },
    fetchModifyValid (isvalid) {
      this.$confirm(`是否${isvalid ? '开启' : '禁用'}此停车场?`, '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          isvalid,
          parking_id: this.id
        }
        console.log(params)
        this.$https.post(this.$api.parking.park.modify_valid, params).then(res => {
          if (res.code === 1000) {
            this.$message.success(`修改成功`)
            this.fetchList()
            this.fetchStatistics()
            this.$refs.page.closeInfo()
          } else {
            this.$message.info(`修改失败`)
          }
        })
      })
    },
    randomString (len = 32) {
      let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      let maxPos = $chars.length
      let pwd = ''
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd
    },
    fetchGetAuthKey () {
      let loading = this.$loading({
        lock: true,
        text: '正在获取授权码',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let auth_key = this.randomString(6)
      this.$refs.addFrom.update({ auth_key })
      setTimeout(() => {
        loading.close()
      }, 500)
    },
    open (type) {
      const { $store, $api, $utils, $refs } = this
      if (type === 'modify') {
        console.log('modify')
        if ($store.getters.noPermission($api.parking.park.modify)) return $utils.noPMS()
        $refs.page.closeInfo()
        let data = $refs.page.getCurrentData()
        this.defaultValue = { ...data }
        this.centerPoint = {
          lng: data.longitude, lat: data.latitude
        }
        this.polygonPath = data.boundary
        this.handleModify()
      }
      if (type === 'remove') {
        console.log('remove')
      }

      if (type === 'disable') {
        if ($store.getters.noPermission($api.parking.park.modify)) return $utils.noPMS()
        this.fetchModifyValid(0)
      }

      if (type === 'open') {
        if ($store.getters.noPermission($api.parking.park.modify)) return $utils.noPMS()
        this.fetchModifyValid(1)
      }

    }
  },
  beforeCreate () {
    this.$store.dispatch('fetchGetBaseDomain').then(res => {
      this.fetchStatistics()
      this.fetchList()
    })

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
  .card {
    padding: 12px 0;
    .box {
      width: 22%;
    }
    .title {
      color: @blue;
      font-size: 14px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ddd;
    }
    .content {
      display: flex;
      justify-content: space-between;
    }
    .content {
      border-bottom: 1px solid #ddd;
      .item {
        padding: 8px 0;
        width: 50%;
      }
      .value {
        font-size: 24px;
        color: @text-color;
      }
      .label {
        color: @text-color-light;
        font-size: 12px;
      }
    }
    .prec {
      height: 32px;
      padding: 8px 0;
      position: relative;
      .left,
      .right {
        position: absolute;
      }
      .left {
        width: 50%;
        left: 0;
      }
      .right {
        width: 50%;
        right: 0;
      }
    }
  }
}
</style>
