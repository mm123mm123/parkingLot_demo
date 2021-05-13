<template>
  <div class="page">
    <PageListTemplate
      :key="_uid"
      ref="page"
      :className="'row'"
      infoTitle="日报表情况"
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
          <label>开始日期:</label>
          <el-date-picker
            type="date"
            placeholder="选择日期"
            size="mini"
            clearable
            value-format="yyyy-MM-dd"
            @change="fetchListSearch"
            v-model="keys.startTime"
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
            v-model="keys.endTime"
          ></el-date-picker>
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
        startTime: this.$utils.getDateStr(-1),
        endTime: this.$utils.getDateStr(1),
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
          prop: 'ts',
          label: '日期'
        },
        {
          prop: 'count_money',
          label: '合计(元)'
        },
        {
          prop: 'should_pay',
          label: '应收(元)'
        },
        {
          prop: 'prompt_fee',
          label: '减免(元)'
        },
        {
          prop: 'bill_actual_pay',
          label: '实收(元)'
        },
        {
          prop: 'bill_paid_type1',
          label: '现金(元)'
        },
        {
          label: '线上金额',
          children: [
            {
              prop: 'little_money',
              label: '小计(元)'
            },
            {
              prop: 'bill_paid_type4',
              label: '微信(元)'
            },
            {
              prop: 'bill_paid_type3',
              label: '支付宝(元)'
            },
          ]
        },
        {
          prop: 'key',
          label: '城市大脑金额(元)'
        },
        {
          prop: 'bill_paid_type10',
          label: 'ETC支付金额(元)'
        },
        {
          prop: 'need_paid',
          label: '催缴支付金额(元)'
        },
      ],
      tableData: [],
      infoHeader: {
        title: '明细',
        button: {
        },
        data: {}
      },
      statisticsData: [
        { name: '合计', key: 'count_money', value: 0, unit: '元' },
        { name: '实收', key: 'bill_actual_pay', value: 0, unit: '元' },
        { name: '现金', key: 'bill_paid_type1', value: 0, unit: '元' },
        { name: '支付宝', key: 'bill_paid_type3', value: 0, unit: '元' },
        { name: '微信', key: 'bill_paid_type4', value: 0, unit: '元' },
        { name: '线上小计', key: 'little_money', value: 0, unit: '元' },
        { name: 'ETC', key: 'bill_paid_type10', value: 0, unit: '元' },
        { name: '催缴支付', key: 'need_paid', value: 0, unit: '元' },
        { name: '减免', key: 'prompt_fee', value: 0, unit: '元' },
        { name: '应收', key: 'should_pay', value: 0, unit: '元' },
      ],
    }
  },
  methods: {

    handleExport () {
      this.fetchListData(1, 9999).then(res => {
        let { total, tableData } = res
        this.$refs.table.exportXlsx('日报表', tableData)
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
      let params = {
        page_no,
        page_size,
      }
      if (!this.keys.parking_code) {
        this.keys.parking_code = this.$store.getters.getParkingOptions()[0].value
      }
      if (!this.keys.startTime) {
        this.keys.startTime = this.$utils.getDateStr(-1)
      }
      if (!this.keys.endTime) {
        this.keys.endTime = this.$utils.getDateStr(1)
      }

      this.$utils.copyObj(params, this.keys) // 赋值搜索内容
      return this.$https.post(this.$api.parking.report.get_daily_list, params).then(res => {
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
        total = res.total
        tableData = res.list.map(x => {
          const {
            bill_actual_pay = 0,
            bill_paid_type1 = 0,
            bill_paid_type3 = 0,
            bill_paid_type4 = 0,
            bill_paid_type10 = 0,
            count_money = 0,
            little_money = 0,
            need_paid = 0,
            prompt_fee = 0,
            should_pay = 0,
          } = x
          let item = {
            ...x,
            bill_actual_pay: bill_actual_pay / 100,
            bill_paid_type1: bill_paid_type1 / 100,
            bill_paid_type3: bill_paid_type3 / 100,
            bill_paid_type4: bill_paid_type4 / 100,
            bill_paid_type10: bill_paid_type10 / 100,
            count_money: count_money / 100,
            little_money: little_money / 100,
            need_paid: need_paid / 100,
            prompt_fee: prompt_fee / 100,
            should_pay: should_pay / 100,
          }
          return item
        })

        const sum = res.sum
        const {
          bill_actual_pay = 0,
          bill_paid_type1 = 0,
          bill_paid_type3 = 0,
          bill_paid_type4 = 0,
          bill_paid_type10 = 0,
          count_money = 0,
          little_money = 0,
          need_paid = 0,
          prompt_fee = 0,
          should_pay = 0,
        } = sum
        const data = {
          bill_actual_pay: bill_actual_pay / 100,
          bill_paid_type1: bill_paid_type1 / 100,
          bill_paid_type3: bill_paid_type3 / 100,
          bill_paid_type4: bill_paid_type4 / 100,
          bill_paid_type10: bill_paid_type10 / 100,
          count_money: count_money / 100,
          little_money: little_money / 100,
          need_paid: need_paid / 100,
          prompt_fee: prompt_fee / 100,
          should_pay: should_pay / 100,
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
