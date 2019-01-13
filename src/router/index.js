import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '/home',
    component: Layout,
    redirect: 'home',
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/index'),
        name: 'home',
        meta: { title: 'home', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: 'product',
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/index'),
        name: 'product',
        meta: { title: 'product', icon: 'product', noCache: true }
      }
    ]
  },
  {
    path: '/commission',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/index'),
        name: 'commission',
        meta: { title: 'commission', icon: 'commission', noCache: true }
      }
    ]
  },
  {
    path: '/client',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/index'),
        name: 'client',
        meta: { title: 'client', icon: 'client', noCache: true }
      }
    ]
  },
  {
    path: '/channel',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/index'),
        name: 'channel',
        meta: { title: 'channel', icon: 'channel', noCache: true }
      }
    ]
  },
  {
    path: '/document',
    component: Layout,
    redirect: 'document',
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/index'),
        name: 'document',
        meta: { title: 'document', icon: 'document', noCache: true }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/index'),
        name: 'report',
        meta: { title: 'report', icon: 'chart', noCache: true }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: 'user',
    name: 'system',
    meta: { title: 'system', icon: 'system', noCache: true },
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user/index'),
        name: 'user',
        meta: { title: 'user', icon: 'user', noCache: true }
      },
      {
        path: 'role',
        component: () => import('@/views/dashboard/index'),
        name: 'role',
        meta: { title: 'role', icon: 'role', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true }
]
