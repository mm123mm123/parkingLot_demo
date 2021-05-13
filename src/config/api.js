import { dictype, dicinfo } from './Apis/dictionary'
import { self, domain, role, user } from './Apis/account'
import { tag_group, tag, type_group, type, vender } from './Apis/bizbase'
import { template } from './Apis/ui'

import { sensor } from './Apis/sensor'

import * as parking from './Apis/parking'

const api = {
  login: 'login', // 登录

  self, domain, role, user,
  tag_group, tag, type_group, type, vender,

  sensor,

  template,
  dictype,
  dicinfo,
  parking
}

export { api }
