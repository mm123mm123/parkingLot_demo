
/* --------------- 字典模块管理 --------------- */

// 字典类型模块
const dictype = {
  get_tree_list: `model.dictype.get_tree_list`, // 获取字典类型树
  add: `model.dictype.add`, // 添加字典类型
  modify: `model.dictype.modify`, // 修改字典类型
  remove: `model.dictype.remove`, // 删除字典类型
  get_list: `model.dictype.get_list`, // 获取字典类型列表
  get_info: `model.dictype.get_info` // 获取字典类型信息
}

// 字典模块
const dicinfo = {
  add: `model.dicinfo.add`, // 添加字典
  modify: `model.dicinfo.modify`, // 修改字典
  remove: `model.dicinfo.remove`, // 删除字典
  get_list: `model.dicinfo.get_list`, // 获取字典列表
  get_info: `model.dicinfo.get_info` // 获取字典信息
}

export { dictype, dicinfo }
