// 标签分组管理
const tag_group = {
  get_list: `bizbase.tag_group.get_list`, // 获取标签分组列表
  add: `bizbase.tag_group.add`, // 添加标签分组
  modify: `bizbase.tag_group.modify`, // 修改标签分组
  remove: `bizbase.tag_group.remove`, // 删除标签分组
}

// 标签管理
const tag = {
  get_list: `bizbase.tag.get_list`, // 获取标签列表
  add: `bizbase.tag.add`, // 添加
  modify: `bizbase.tag.modify`, // 修改
  remove: `bizbase.tag.remove`, // 删除
  get_domains: `bizbase.tag.get_domains`, // 获取标签的域
  set_domains: `bizbase.tag.set_domains`, // 设置标签的域
}

// 类型分组管理
const type_group = {
  get_list: `bizbase.type_group.get_list`, //获取类型分组列表
  add: `bizbase.type_group.add`, //添加类型分组
  modify: `bizbase.type_group.modify`, //修改类型分组
  remove: `bizbase.type_group.remove`, //删除类型分组
}

// 类型管理
const type = {
  get_list: `bizbase.type.get_list`, // 获取类型列表
  add: `bizbase.type.add`, // 添加类型
  modify: `bizbase.type.modify`, // 修改类型
  remove: `bizbase.type.remove`, // 删除类型
}

// 厂商
const vender = {
  get_list: `bizbase.vender.get_list`, // 获取列表
  add: `bizbase.vender.add`, // 添加厂商
  modify: `bizbase.vender.modify`, // 修改厂商
  remove: `bizbase.vender.remove`, // 删除厂商
  get_types: `bizbase.vender.get_types`, // 获取指定厂商的类型
  set_types: `bizbase.vender.set_types`, // 设置指定厂商的类型
  get_vender_types: `bizbase.vender.get_vender_types`, // 获取所有厂商类型
}

export { tag_group, tag, type_group, type, vender }
