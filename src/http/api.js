/*
 * 接口统一集成模块
 */
import * as login from './modules/login'
import * as user from './modules/user'
import * as role from './modules/role'
import * as company from './modules/company'
import * as commission from './modules/commission'
import * as client from './modules/client'
import * as product from './modules/product'
import * as channel from './modules/channel'
import * as document from './modules/document'
import * as statistics from './modules/statistics'
import * as config from './modules/config'
import * as template from './modules/template'
// 默认全部导出
export default {
  login,
  user,
  role,
  company,
  commission,
  client,
  product,
  channel,
  document,
  statistics,
  config,
  template
}
