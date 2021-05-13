/**
 * router Parking
 */

const routers = [
  {
    path: 'parking',
    name: 'parking',
    component: () => import(/* webpackChunkName:'parking' */ './Pages/parking.vue'),
    meta: {
      title: '场库管理'
    },
  },
  {
    path: 'group',
    name: 'group',
    component: () => import(/* webpackChunkName:'group' */ './Pages/parking-group.vue'),
    meta: {
      title: '分组管理'
    },
  },

  {
    path: 'realdTime',
    name: 'realdTime',
    component: () => import(/* webpackChunkName:'parkingRealTime' */ './Pages/parking-realTime.vue'),
    meta: {
      title: '实时数据'
    },
  },
  {
    path: 'map',
    name: 'map',
    component: () => import(/* webpackChunkName:'parkingMap' */ './Pages/parking-map.vue'),
    meta: {
      title: '场库地图'
    },
  },
  {
    path: 'urge',
    name: 'urge',
    component: () => import(/* webpackChunkName:'urge' */ './Pages/parking-urge.vue'),
    meta: {
      title: '催缴记录'
    },
  },
  {
    path: 'pass',
    name: 'pass',
    component: () => import(/* webpackChunkName:'pass' */ './Pages/parking-pass.vue'),
    meta: {
      title: '过车记录'
    },
  },
  {
    path: 'insite',
    name: 'insite',
    component: () => import(/* webpackChunkName:'inSite' */ './Pages/parking-inSite.vue'),
    meta: {
      title: '场内车辆'
    },
  },
  {
    path: 'arrears',
    name: 'arrears',
    component: () => import(/* webpackChunkName:'arrears' */ './Pages/parking-arrears.vue'),
    meta: {
      title: '欠费记录'
    },
  },

  {
    path: 'report/payDetails',
    name: 'Report',
    component: () => import(/* webpackChunkName:'payDetails' */ './Pages/Report/payDetails.vue'),
    meta: {
      title: '催缴支付明细'
    },
  },
  {
    path: 'report/receivablesSummary',
    name: 'receivablesSummary',
    component: () => import(/* webpackChunkName:'receivablesSummary' */ './Pages/Report/receivablesSummary.vue'),
    meta: {
      title: '收款汇总'
    },
  },
  {
    path: 'report/callPayment',
    name: 'callPayment',
    component: () => import(/* webpackChunkName:'callPayment' */ './Pages/Report/callPayment.vue'),
    meta: {
      title: '催缴支付情况'
    },
  },
  {
    path: 'report/dailyReport',
    name: 'dailyReport',
    component: () => import(/* webpackChunkName:'dailyReport' */ './Pages/Report/dailyReport.vue'),
    meta: {
      title: '日报表'
    },
  },
  {
    path: 'report/dailyReportSummary',
    name: 'dailyReportSummary',
    component: () => import(/* webpackChunkName:'dailyReportSummary' */ './Pages/Report/dailyReportSummary.vue'),
    meta: {
      title: '日报表汇总'
    },
  },
  {
    path: 'report/temporaryPay',
    name: 'temporaryPay',
    component: () => import(/* webpackChunkName:'temporaryPay' */ './Pages/Report/temporaryPay.vue'),
    meta: {
      title: '临停缴费明细'
    },
  },
  {
    path: 'report/payment',
    name: 'payment',
    component: () => import(/* webpackChunkName:'payment' */ './Pages/Report/payment.vue'),
    meta: {
      title: '缴费情况'
    },
  },
]

const ParkingRouter = {
  path: '/parking',
  name: 'parking',
  component: () => import(/* webpackChunkName:'BasicLayout' */ '@/layouts/BasicLayout/index.vue'),
  meta: {
    title: '停车缴费平台',
    tokenAuth: true
  },
  children: [
    ...routers
  ]
}

export default ParkingRouter