<template>
  <div class="page">
    <PageListTemplate
      :key="_uid"
      ref="page"
      :className="'row'"
      infoTitle="缴费明细"
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
          label: '停车场'
        },
        {
          prop: 'owe_count',
          label: '欠费车辆数'
        },
        {
          prop: 'need_paid',
          label: '欠费金额(元)'
        },
        {
          prop: 'exit_num',
          label: '出场车辆数'
        },
        {
          prop: 'should_pay',
          label: '应收金额(元)'
        },
        {
          prop: 'bill_actual_pay',
          label: '实收金额(元)'
        },
        {
          prop: 'escape_rate',
          label: '逃车率'
        },
        {
          prop: 'pay_rate',
          label: '缴费率'
        },
        {
          prop: 'pay_car_rate',
          label: '缴费车辆比'
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
        { name: '出车数量', key: 'exit_num', value: 0, unit: '辆' },
        { name: '实收金额', key: 'bill_actual_pay', value: 0, unit: '元' },
        { name: '欠费金额', key: 'need_paid', value: 0, unit: '元' },
        { name: '欠费车辆数', key: 'owe_count', value: 0, unit: '辆' },
        { name: '应收金额', key: 'should_pay', value: 0, unit: '元' },
      ],
    }
  },
  methods: {
    handleExport () {
      this.fetchListData(1, 9999).then(res => {
        let { total, tableData } = res
        this.$refs.table.exportXlsx('缴费情况表')
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
        ...Object.values(this.domain_ids).filter(x => x.length)
      ]
      let params = {
        page_no,
        page_size,
        domain_id,
      }

      if (!this.keys.startTime) {
        this.keys.startTime = this.$utils.getDateStr(-1)
      }
      if (!this.keys.endTime) {
        this.keys.endTime = this.$utils.getDateStr(1)
      }

      this.$utils.copyObj(params, this.keys) // 赋值搜索内容
      return this.$https.post(this.$api.parking.report.get_pay_list, params).then(res => {
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
          const escape_rate = !x.exit_num ? null : Math.round(((x.owe_count / x.exit_num) || 0) * 1000) / 10 + '%'
          const pay_rate = !x.should_pay ? null : (100 - Math.round(((x.need_paid / x.should_pay) || 0) * 1000) / 10) + '%'
          const pay_car_rate = !x.exit_num ? null : (100 - Math.round(((x.owe_count / x.exit_num) || 0) * 1000) / 10) + '%'
          const {

            need_paid = 0,
            bill_actual_pay = 0,
            should_pay = 0,
          } = x
          let item = {
            ...x,
            escape_rate,
            pay_rate,
            pay_car_rate,
            need_paid: need_paid / 100,
            bill_actual_pay: bill_actual_pay / 100,
            should_pay: should_pay / 100,
          }
          return item
        })
        const sum = res.sum
        const {
          bill_actual_pay = 0,
          exit_num = 0,
          need_paid = 0,
          owe_count = 0,
          should_pay = 0,
        } = sum
        const data = {
          exit_num,
          owe_count,
          need_paid: need_paid / 100,
          bill_actual_pay: bill_actual_pay / 100,
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
