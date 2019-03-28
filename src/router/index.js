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
    roles: ['admin','editor']     will control the page roles (you can set multiple roles) id === 1 表示管理员 id === 2 表示签单员
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
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/',
    redirect: '/home'
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
    meta: { title: 'product', icon: 'product' },
    children: [
      {
        path: 'company',
        component: () => import('@/views/product/company'),
        name: 'company',
        meta: { title: '合作机构', icon: 'company', noCache: true, roles: [3] }
      },
      {
        path: 'commission',
        component: () => import('@/views/product/commission/index'),
        name: '产品佣金',
        meta: { title: '产品佣金', icon: 'commission', noCache: true }
      },
      {
        path: 'channel_strategy',
        component: () => import('@/views/product/channel/index'),
        name: '渠道策略',
        meta: { title: '渠道策略', icon: 'client', noCache: true }
      }
    ]
  },
  {
    path: '/client',
    component: Layout,
    redirect: 'noredirect',
    meta: { title: 'client', icon: 'client', noCache: true },
    children: [
      {
        path: '/policy',
        component: () => import('@/views/client/policy'),
        name: '保单',
        meta: { title: '保单', icon: 'policy', noCache: true }
      },
      {
        path: '/info',
        component: () => import('@/views/client/info'),
        name: '客户资料',
        meta: { title: '客户资料', icon: 'info', noCache: true }
      }
    ]
  },
  {
    path: '/commission',
    component: Layout,
    redirect: 'noredirect',
    meta: { title: '佣金', icon: 'channel', noCache: true },
    children: [
      {
        path: 'commissionCredit',
        component: () => import('@/views/commission/commissionCredit/index'),
        name: '到账记录',
        meta: { title: '到账记录', icon: 'credit', noCache: true }
      },
      // {
      //   path: 'channelCommissionPayment',
      //   component: () => import('@/views/commission/channelCommissionPayment/index'),
      //   name: '发放记录',
      //   meta: { title: '发放记录', icon: 'payment', noCache: true }
      // },
      {
        path: 'paymentAudit',
        component: () => import('@/views/commission/paymentAudit/index'),
        name: '发放审核',
        meta: { title: '发放审核', icon: 'payment', noCache: true }
      }
    ]
  },
  {
    path: '/audit',
    component: Layout,
    redirect: 'audit',
    children: [
      {
        path: '',
        name: '保单审计',
        component: () => import('@/views/audit/index'),
        meta: { title: '保单审计', icon: 'audit', noCache: true }
      }
    ]
  },
  // {
  //   path: '/channel',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   meta: { title: 'channel', icon: 'channel', noCache: true },
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('@/views/dashboard/index'),
  //       name: '资料',
  //       meta: { title: 'channel', icon: 'channel', noCache: true }
  //     },
  //     {
  //       path: '',
  //       component: () => import('@/views/dashboard/index'),
  //       name: '佣金率检索',
  //       meta: { title: '佣金率检索', icon: 'channel', noCache: true }
  //     },
  //     {
  //       path: '',
  //       component: () => import('@/views/dashboard/index'),
  //       name: '支票发放记录',
  //       meta: { title: '支票发放记录', icon: 'channel', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/document',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   meta: { title: '文档', icon: 'document', noCache: true },
  //   children: [
  //     {
  //       path: 'internalDocument',
  //       component: () => import('@/views/document/internalDocument'),
  //       name: '内部',
  //       meta: { title: '内部文档', icon: 'int_document', noCache: true }
  //     },
  //     {
  //       path: 'companyDocument',
  //       component: () => import('@/views/document/companyDocument'),
  //       name: '保险公司',
  //       meta: { title: '保险公司', icon: 'company_document', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/report',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'report',
  //       meta: { title: 'report', icon: 'chart', noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/system',
    component: Layout,
    redirect: 'user',
    meta: { title: 'system', icon: 'system', noCache: true, roles: [1] },
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user/index'),
        name: 'user',
        meta: { title: 'user', icon: 'user', noCache: true }
      },
      {
        path: 'role',
        component: () => import('@/views/system/role'),
        name: 'role',
        meta: { title: 'role', icon: 'role', noCache: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
