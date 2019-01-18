/*
 * 接口统一集成模块
 */
import * as login from './modules/login'
import * as user from './modules/user'
import * as role from './modules/role'

// 默认全部导出
export default {
  login,
  user,
  role
}
