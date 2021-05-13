<template>
  <div class="page">
    <PageListTemplate
      :key="_uid"
      ref="page"
      :className="'row'"
      infoTitle="支付明细详情"
      :infoHeader="infoHeader"
    >
      <!-- 卡片 -->
      <div slot="card" class="card">
        <div class="box" v-for="(item, i) in statisticsData" :key="'card_box' + i">
          <div class="title">{{item.name}}</div>
          <div class="value">
            <span class="num">
              <Number :value="item.value" :decimals="2" />
            </span>
            <span class="unit">{{item.unit}}</span>
          </div>
        </div>
      </div>

      <!-- 按钮 -->
      <div slot="button">
        <el-button type="primary" icon="el-icon-folder-opened" size="mini" @click="handleExport">导出</el-button>
      </div>

      <!-- 搜索条件 -->
      <div slot="search-items">
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
          <label>支付时间:</label>
          <el-date-picker
            type="date"
            placeholder="选择日期"
            size="mini"
            clearable
            value-format="yyyy-MM-dd"
            @change="fetchListSearch"
            v-model="keys.deal_time"
          ></el-date-picker>
        </div>
        <div class="search-item">
          <label>订单时间:</label>
          <el-date-picker
            type="date"
            placeholder="选择日期"
            size="mini"
            clearable
            value-format="yyyy-MM-dd"
            @change="fetchListSearch"
            v-model="keys.bill_time"
          ></el-date-picker>
        </div>
        <div class="search-item">
          <label>车牌号:</label>
          <el-input
            style="width: 190px"
            prefix-icon="el-icon-search"
            size="mini"
            clearable
            placeholder="车牌号"
            @change="fetchListSearch"
            v-model="keys.car_no"
          ></el-input>
        </div>
        <div class="search-item">
          <label>支付流水号:</label>
          <el-input
            style="width: 190px"
            prefix-icon="el-icon-search"
            size="mini"
            clearable
            placeholder="支付流水号"
            @change="fetchListSearch"
            v-model="keys.platform_order_no"
          ></el-input>
        </div>
        <div class="search-item">
          <label>订单号:</label>
          <el-input
            style="width: 190px"
            prefix-icon="el-icon-search"
            size="mini"
            clearable
            placeholder="订单号"
            @change="fetchListSearch"
            v-model="keys.inner_order"
          ></el-input>
        </div>
      </div>

      <!-- 表格 -->
      <GTable
        slot="table"
        ref="table"
        v-loading="tableLoading"
        @row-click="handleRow"
        @current-change="handlePageClick"
        @prev-click="handlePageClick"
        @next-click="handlePageClick"
        :page="page"
        :tableLabel="tableLabel"
        :tableData="tableData"
      ></GTable>
    </PageListTemplate>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keys: {
        parking_code: null,
        deal_time: null,
        bill_time: null,
        car_no: null,
        inner_order: null,
        platform_order_no: null,
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
          label: '停车场'
        },
        {
          prop: 'car_no',
          label: '车牌号'
        },
        {
          prop: 'should_pay',
          label: '金额(元)'
        },
        {
          prop: 'status_text',
          label: '支付状态'
        },
        {
          prop: 'payment_channel_text',
          label: '支付方式'
        },
        {
          prop: 'deal_time',
          label: '支付时间'
        },
        {
          prop: 'enter_ts',
          label: '进场时间'
        },
        {
          prop: 'exit_ts',
          label: '出场时间'
        },
        {
          prop: 'duration_text',
          label: '停放时长(分钟)'
        },
        {
          prop: 'platform_order_no',
          label: '支付流水号'
        },
        {
          prop: 'inner_order',
          label: '停车订单号'
        },
        {
          prop: 'payment_text',
          label: '催缴支付来源'
        },
        {
          prop: 'need_paid',
          label: '催缴支付金额(元)'
        }
      ],
      tableData: [],
      infoHeader: {
        title: '明细',
        button: {
        },
        data: {}
      },
      statisticsData: [
        { name: '总金额', key: 'sum', value: 0, unit: '元' },
      ],
    }
  },
  methods: {

    handleExport () {
      this.fetchListData(1, 9999).then(res => {
        let { total, tableData } = res
        this.$refs.table.exportXlsx('催缴支付明细表', tableData)
      })
    },
    handleRow (data) {
      console.log(data)
    },
    handlePageClick (num) { // 点击页码时
      this.page.page_no = num
      this.fetchList()
    },
    fetchListSearch () {
      this.page.page_no = 1
      this.fetchList()
    },
    fetchListData (page_no, page_size) {
      let domain_id = [
        this.$store.getters.getBaseDomainPath(),
      ]
      let params = {
        page_no,
        page_size,
        domain_id,
      }

      this.$utils.copyObj(params, this.keys) // 赋值搜索内容
      return this.$https.post(this.$api.parking.report.get_reminder_pay_list, params).then(res => {
        let { total, tableData, statisticsData } = this.handleData(res)
        return Promise.resolve({ total, tableData, statisticsData })
      })
    },
    fetchList () {
      this.tableLoading = true
      this.fetchListData(this.page.page_no, this.page.page_size).then(res => {
        let { total, tableData, statisticsData } = res
        this.statisticsData = statisticsData
        this.tableData = tableData
        this.page.total = total
        this.tableLoading = false
      })
    },
    handleData (res) {
      let total = 0
      let tableData = []
      let statisticsData = this.statisticsData
      if (res.code === 1000 && res?.list) {
        const STATUS_MAP = new Map([
          [0, '未支付'],
          [1, '已支付'],
          [2, '未支付'],
        ])
        total = res.total
        tableData = res.list.map(x => {
          const paid_type_text = this.$store.state.parkingData.PAY_TYPE_MAP.get(x.paid_type)
          const payment_channel_text = this.$store.state.parkingData.PAY_CHANNEL_MAP.get(x.payment_channel)
          const duration_text = Math.round(x.duration * 10 / 6) / 100
          const payment_text = this.$store.state.parkingData.REMINDER_CHANNEL_MAP.get(x.payment)
          const status_text = STATUS_MAP.get(x.status)

          const {
            need_paid = 0,
            should_pay = 0,
          } = x
          let item = {
            ...x,
            paid_type_text,
            duration_text,
            payment_channel_text,
            payment_text,
            need_paid: need_paid / 100,
            should_pay: should_pay / 100,
            status_text,
          }
          return item
        })

        const sum = res.sum
        const data = {
          sum: sum / 100
        }
        statisticsData = statisticsData.map(x => {
          const { name, key, unit } = x
          let item = {
            name, unit, key,
            value: +data[key]
          }
          return item
        })
      }
      return { total, tableData, statisticsData }
    }
  },
  beforeCreate () {
    this.$store.dispatch('fetchGetAllParking').then(res => {
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
      text-align: center;
      &:not(:first-child) {
        border-left: 1px dashed @light-gray2;
      }
    }
    .title {
      font-size: 16px;
    }
    .value {
      .num {
        color: @blue;
        font-size: 24px;
      }
      .unit {
        padding-left: 4px;
        font-size: 14px;
      }
    }
  }
}
</style>
