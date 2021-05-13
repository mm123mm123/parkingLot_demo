// 用户
const self = {
  get_info: `account.self.get_info`, // 获取用户信息
  get_roles: `account.self.get_roles`, // 获取用户角色
  get_ui_template: `account.self.get_ui_template`, // 获取ui模板
  logout: `account.self.logout` // 退出登录
}

// 域管理
const domain = {
  get_all: `account.branch_domain.get_all`,
  get_list: `account.domain.get_list`,
  tree: `account.domain.get_tree`, // 获取域树
  add: `account.domain.add`, // 添加域
  modify: `account.domain.modify`, // 修改域
  remove: `account.domain.remove`, // 删除域
  get_tags: `account.domain.get_tags`, // 获取域标签列表
  set_tags: `account.domain.set_tags`, // 设置域标签列表
  get_tree: `account.branch_domain.get_tree`
}

// 角色管理
const role = {
  get_list: `account.role.get_list`, // 获取角色列表
  add: `account.role.add`, // 添加角色
  modify: `account.role.modify`, // 修改角色
  remove: `account.role.remove`, // 删除角色
  get_funcs: `account.role.get_funcs`, // 获取角色权限
  set_funcs: `account.role.set_funcs`, // 设置角色权限
  get_function_group_tree: `account.role.get_function_group_tree`, // 获取功能项分组列表
  get_template_list: `account.role.get_template_list`, // 获取界面模板列表
  get_vender_types: `account.role.get_vender_types`, // 获取厂商类型
  get_venders: `account.role.get_venders`, // 获取厂商
  set_venders: `account.role.set_venders`, // 设置厂商
}

const user = {
  getUserPermissionTree: 'account.user.get_funcs', // 获取用户权限树
  get_all: `account.user.get_all`, // 或者自己权限范围内的所有用户
  add: `account.user.add`, // 添加用户
  modify: `account.user.modify`, // 修改用户
  remove: `account.user.remove`, // 删除角色
  reset_pass: `account.user.reset_pass`, // 重置密码
  get_roles: `account.user.get_roles`, // 获取用户对应角色
  set_roles: `account.user.set_roles`, // 分配用户对应角色
  get_domains: `account.user.get_domains`, // 获取用户权限域
  set_domains: `account.user.set_domains`, // 设置用户域权限域
  get_template_list: `account.role.get_template_list`, // 获取界面模板
  check: `account.user.check` // 检查是否存在该账号
}

export { self, domain, role, user }
