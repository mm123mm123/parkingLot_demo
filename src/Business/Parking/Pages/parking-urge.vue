<template>
  <div class="page">
    <PageListTemplate
      :key="_uid"
      ref="page"
      :className="'row'"
      infoTitle="催缴详情"
      :infoHeader="infoHeader"
      @handleInfoBtn="open"
    >
      <!-- 卡片 -->
      <!-- <div slot="card" class="card">
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
      </div>-->

      <!-- 搜索条件 -->
      <div slot="search-items">
        <div class="search-item">
          <label>车牌</label>
          <el-input
            style="width: 190px"
            placeholder="车牌号"
            size="mini"
            prefix-icon="el-icon-search"
            clearable
            @change="fetchListSearch"
            v-model="keys.car_no"
          ></el-input>
        </div>
        <div class="search-item">
          <label>停车场</label>
          <el-select
            size="mini"
            prefix-icon="el-icon-search"
            v-model="keys.parking_code"
            clearable
            @change="fetchListSearch"
            placeholder="选择停车场"
          >
            <el-option
              v-for="({label, value}, i) in $store.getters.getParkingOptions()"
              :key="'parking_option_' + i"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <label>催缴状态</label>
          <el-select
            size="mini"
            prefix-icon="el-icon-search"
            v-model="keys.status"
            clearable
            @change="fetchListSearch"
            placeholder="选择状态"
          >
            <el-option
              v-for="item in $utils.mapChangeOption($store.state.parkingData.URGE_STATUS_MAP)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <label>付款通道</label>
          <el-select
            size="mini"
            prefix-icon="el-icon-search"
            v-model="keys.payment_channel"
            clearable
            @change="fetchListSearch"
            placeholder="选择通道"
          >
            <el-option
              v-for="item in $utils.mapChangeOption($store.state.parkingData.PAY_CHANNEL_MAP)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="search-item">
          <label>开始日期:</label>
          <el-date-picker
            type="date"
            placeholder="选择日期"
            size="mini"
            clearable
            value-format="yyyy-MM-dd"
            @change="fetchListSearch"
            v-model="keys.enter_ts"
          ></el-date-picker>
        </div>
        <div class="search-item">
          <label>结束日期:</label>
          <el-date-picker
            type="date"
            placeholder="选择日期"
            size="mini"
            clearable
            value-format="yyyy-MM-dd"
            @change="fetchListSearch"
            v-model="keys.exit_ts"
          ></el-date-picker>
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
          <BodyCard type="item" :data="{...infoData_parking, data}" />
          <BodyCard type="item" :data="{...infoData_urge, data}" />
        </div>
      </template>
    </PageListTemplate>
  </div>
</template>

<script>

export default {
  data () {
    return {
      keys: {
        car_no: null,
        payment_channel: null,
        status: null,
        parking_code: null,
        enter_ts: null,
        exit_ts: null,
      },
      domain_ids: {
        government: [],
      },
      tableLoading: true,
      page: {
        page_no: 1,
        total: 0,
        page_size: 10
      },
      tableLabel: [
        {
          prop: 'car_no',
          label: '车牌号'
        },
        {
          prop: 'car_type_text',
          label: '车牌类型'
        },
        {
          prop: 'duration_text',
          label: '停车时长(h)'
        },
        {
          prop: 'enter_ts',
          label: '进车时间'
        },
        {
          prop: 'exit_ts',
          label: '出车时间'
        },
        {
          prop: 'parking_code_text',
          label: '停车场'
        },
        {
          prop: 'last_call_ts',
          label: '最近催缴时间'
        },
        {
          prop: 'need_paid',
          label: '需要支付（元）'
        },
        {
          prop: 'payment_channel_text',
          label: '付款通道'
        },
        {
          prop: 'status_tag',
          label: '状态',
          tag: true
        }
      ],
      tableData: [],
      infoHeader: {
        title: '车牌号',
        button: {
        },
        data: {}
      },
      infoData_parking: {
        title: '停车信息',
        span: 6,
        label: [
          {
            prop: 'parking_code_text',
            label: '停车场'
          },
          {
            prop: 'enter_ts',
            label: '进车时间'
          },
          {
            prop: 'exit_ts',
            label: '出车时间'
          },
          {
            prop: 'duration_text',
            label: '停车时长(h)'
          },
        ],
        data: {}
      },
      infoData_urge: {
        title: '催缴信息',
        span: 6,
        label: [
          {
            prop: 'order_sno',
            label: '流水号'
          },
          {
            prop: 'need_paid',
            label: '需要支付(元)'
          },
          {
            prop: 'last_call_ts',
            label: '最后催缴时间'
          },
          {
            prop: 'status_tag',
            label: '催缴状态',
            tag: true
          },
          {
            prop: 'reminder_count',
            label: '催缴次数'
          },
          {
            prop: 'reminder_cost',
            label: '催缴成本'
          },
        ],
        data: {}
      },
      id: null,
    }
  },
  methods: {
    handleRow (data) {
      console.log(data)
      this.id = data.parking_id
      this.$refs.page.setInfoHeaderTitle(data.car_no)
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
      this.$store.dispatch('fetchGetUrgeList', params).then(({ list, total }) => {
        let tableData = list.map(x => {

          const car_type_text = this.$store.state.parkingData.PLATE_COLOR_MAP.get(x.car_type)
          const payment_channel_text = this.$store.state.parkingData.PAY_CHANNEL_MAP.get(x.payment_channel)
          const parking_code_text = this.$store.getters.getParkingMap().get(x.parking_code)
          const duration_text = Math.round(x.duration * 10 / 6) / 100
          const status_tag = {
            value: this.$store.state.parkingData.URGE_STATUS_MAP.get(x.status),
            danger: !x.status,
            success: x.status === 1,
            warning: x.status === 2,
          }

          let item = {
            ...x,
            car_type_text,
            payment_channel_text,
            parking_code_text,
            duration_text,
            status_tag,
            need_paid: x.need_paid / 100
          }
          return item
        })
        this.tableData = tableData
        this.page.total = total
        this.tableLoading = false
      })
    },
    fetchStatistics () { },
    open (type) {

    }
  },
  beforeCreate () {
    this.$store.dispatch('fetchGetAllParking').then(res => {
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
}
</style>
