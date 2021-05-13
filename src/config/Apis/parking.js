// 停车场模块

// 域
const domain = {
  get_tree: `parking.domain.get_tree`, // 通过标签获取用户域树
}

// 场库
const park = {
  get_all: `parking.park.get_all`, // 通过标签获取场库列表
  get_list: `parking.park.get_list`, // 获取列表
  add: `parking.park.add`, // 添加
  modify: `parking.park.modify`, // 修改
  modify_valid: `parking.park.modify_valid`, // 修改禁用
  statistics: `parking.park.statistics`, // 统计
  get_free: `parking.park.get_free`, // 获取余位
}

// 平台
const plateform = {
  get_list: `parking.plateform.get_list`, // 获取场库列表
  add: `parking.plateform.add`, // 添加
}

// 过车
const pass = {
  statistics: `parking.go_through.statistics`, // 统计
  statistics_day: `parking.go_through.statistics_day`, // 当月每天统计
  get_list: `parking.go_through.get_list`,
  get_parking_car: `parking.go_through.get_parking_car`, // 获取场内车辆
  parking_data: `parking.go_through.parking_data`, // 场内车辆统计
  get_minio_url: `parking.go_through.get_minio_url`, // 获取图片
}

// 催缴
const reminder = {
  get_list: `parking.reminder.get_list`,
  get_consume_list: `parking.reminder.get_consume_list`, // 欠费记录
}

// 报表
const report = {
  get_pay_list: `parking.report.get_pay_list`, // 缴费情况表
  get_receipts_list: `parking.report.get_receipts_list`, // 收款汇总报表
  get_daily_list: `parking.report.get_daily_list`, // 日报表
  get_daily_sum_list: `parking.report.get_daily_sum_list`, // 日报汇总表
  get_reminder_pay_list: `parking.report.get_reminder_pay_list`, // 催缴支付明细查询
  get_reminder_pay_sum_list: `parking.report.get_reminder_pay_sum_list`, // 催缴支付情况统计表
  get_temporary_list: `parking.report.get_temporary_list`, // 临停缴费明细查询

}

export { domain, park, plateform, pass, reminder, report }
