import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getLoginStatus } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permission judge function
/** id: 1表示管理员, 2表示签单人员 ....... **/
// function hasPermission(roles, permissionRoles) {
//   if (roles.some(role => role.id === 1)) {
//     return true
//   }
//   // if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => {
//     return permissionRoles.includes(role.id)
//   })
// }
function hasPermission(actions, id) {
  if (!id) {
    return true
  }
  if (actions.some(action => action.id === id)) {
    return true
  }
  return false
}

const whiteList = ['/login', '/auth-redirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getLoginStatus()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') { // 如果跳转的路由是login，且已经已经有token，则直接跳转到登录页面
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // store.dispatch('GenerateRoutes', { roles: 'admin' }).then(() => { // 根据roles权限生成可访问的路由表
      //   router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
      // })
      // next()
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          const actions = res.data.actions // note: roles must be a array! such as: ['editor','develop']
          store.dispatch('GenerateRoutes', { actions }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            // next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.actions, to.meta.id)) {
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
      NProgress.done()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
