import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/views/layout/Layout';

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
];

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

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
        meta: { title: 'home', icon: 'icon_home_nor', noCache: true, id: 100001 }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    meta: { title: 'product', icon: 'icon_home_fenlei_nor' },
    children: [
      {
        path: 'company',
        component: () => import('@/views/product/company'),
        name: 'company',
        meta: { title: 'company', icon: 'icon_mechanism_nor', noCache: true, id: 100006 }
      },
      {
        path: 'productCommission',
        component: () => import('@/views/product/commission/index'),
        name: 'productCommission',
        meta: { title: 'productCommission', icon: 'icon_commission_nor', noCache: true, id: 100016 }
      },
      {
        path: 'channelCommission',
        component: () => import('@/views/product/channel/index'),
        name: 'channelCommission',
        meta: { title: 'channelCommission', icon: 'icon_qudaoyj_nor', noCache: true, id: 100082 }
      }
    ]
  },
  {
    path: '/client',
    component: Layout,
    redirect: 'noredirect',
    meta: { title: 'client', icon: 'icon_home_kehu_nor', noCache: true },
    children: [
      {
        path: '/insurancePolicy',
        component: () => import('@/views/client/policy'),
        name: 'insurancePolicy',
        meta: { title: 'insurancePolicy', icon: 'icon_kehu_baodan_nor', noCache: true, id: 100045 }
      },
      {
        path: '/clientInfo',
        component: () => import('@/views/client/info'),
        name: 'clientInfo',
        meta: { title: 'clientInfo', icon: 'icon_kehu_data_nor', noCache: true, id: 100040 }
      }
    ]
  },
  {
    path: '/commission',
    component: Layout,
    redirect: 'noredirect',
    meta: { title: 'commission', icon: 'icon_home_yongjin_nor', noCache: true },
    children: [
      {
        path: 'commissionCredit',
        component: () => import('@/views/commission/commissionCredit/index'),
        name: 'commissionCredit',
        meta: { title: 'commissionCredit', icon: 'icon_arrive_nor', noCache: true, id: 100055 }
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
        name: 'paymentAudit',
        meta: { title: 'paymentAudit', icon: 'icon_issue_nor', noCache: true, id: 100067 }
      },
      {
        path: 'cleared',
        component: () => import('@/views/commission/cleared/index'),
        name: 'cleared',
        meta: { title: 'cleared', icon: 'icon_settle_nor', noCache: true, id: 130003 }
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
        name: 'audit',
        component: () => import('@/views/audit/index'),
        meta: { title: 'audit', icon: 'icon_home_baodan_nor', noCache: true, id: 100049 }
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
  {
    path: '/document',
    component: Layout,
    redirect: 'noredirect',
    meta: { title: 'document', icon: 'icon_home_wendang_nor', noCache: true },
    children: [
      {
        path: 'internalDocument',
        component: () => import('@/views/document/internalDocument'),
        name: 'internalDocument',
        meta: { title: 'internalDocument', icon: 'icon_file_interior_nor', noCache: true, id: 100078 }
      },
      {
        path: 'companyDocument',
        component: () => import('@/views/document/companyDocument'),
        name: 'companyDocument',
        meta: { title: 'companyDocument', icon: 'icon_commission-43_nor', noCache: true, id: 100074 }
      }
    ]
  },
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
    meta: { title: 'system', icon: 'icon_home_setting_nor', noCache: true },
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user/index'),
        name: 'user',
        meta: { title: 'user', icon: 'icon_yonghu_nor', noCache: true, id: 100082 }
      },
      {
        path: 'role',
        component: () => import('@/views/system/role'),
        name: 'role',
        meta: { title: 'role', icon: 'icon_juese_nor', noCache: true, id: 100088 }
      },
      {
        path: 'template',
        component: () => import('@/views/system/template'),
        name: 'template',
        meta: { title: 'template', icon: 'template', noCache: true, id: 100128 }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];
