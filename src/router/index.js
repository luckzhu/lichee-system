import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout2'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/signup',
    component: () => import('@/views/login/register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '个人信息', icon: 'dashboard', affix: true }
    }]
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/lichee',
    component: Layout,
    redirect: '/lichee/base',
    alwaysShow: true,
    meta: { title: '广东荔枝', icon: 'litchee', roles: ['nongye', 'shiji', 'jidi'] },
    children: [
      {
        path: 'base',
        name: 'Base',
        component: () => import('@/views/lichee/base'),
        meta: { title: '基地信息登记', icon: 'info', roles: ['nongye', 'shiji'] }
      },
      {
        path: 'brand',
        name: 'Brand',
        // hidden: true,
        component: () => import('@/views/lichee/brand'),
        meta: { title: '品牌标识申领', icon: 'brand', roles: ['nongye', 'shiji'] }
      },
      {
        path: 'contract',
        name: 'Contract',
        // hidden: true,
        component: () => import('@/views/lichee/contract'),
        meta: { title: '合同备案登记', icon: 'register', roles: ['nongye', 'shiji'] }
      },
      {
        path: 'monitor',
        name: 'Monitor',
        component: () => import('@/views/lichee/monitor'),
        meta: { title: '生产供应监测', icon: 'monitor', noCache: true, roles: ['nongye', 'shiji', 'jidi'] }
      },
      {
        path: 'weeklyForm',
        name: 'WeeklyForm',
        hidden: true,
        component: () => import('@/views/lichee/monitor/components/reportsWeekly/form'),
        meta: { title: '周报', activeMenu: '/lichee/monitor' }
      },
      {
        path: 'subsidy',
        name: 'Subsidy',
        // hidden: true,
        component: () => import('@/views/lichee/subsidy'),
        meta: { title: '物流补助核准', icon: 'subsidy', roles: ['nongye', 'shiji'] }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    redirect: '/form/weekly/:category',
    hidden: true,
    children: [
      {
        path: 'weekly/:category',
        name: 'FormWeekly',
        component: () => import('@/views/Shared/Form/Weekly'),
        meta: { title: '周报', noCache: true }
      }
    ]
  },
  {
    path: '/pomelo',
    component: Layout,
    redirect: '/pomelo/base',
    alwaysShow: true,
    meta: { title: '广东柚子', icon: 'pomelo' },
    children: [
      {
        path: 'base',
        name: 'Base',
        component: () => import('@/views/pomelo/base'),
        meta: { title: '基地信息登记', icon: 'info' }
      },
      {
        path: 'survey',
        name: 'Survey',
        component: () => import('@/views/pomelo/survey'),
        meta: { title: '基地生产调查', icon: 'survey' }
      },
      {
        path: 'monitor',
        name: 'Monitor',
        component: () => import('@/views/pomelo/monitor'),
        meta: { title: '生产供应监测', icon: 'monitor', category: 'pomelo' }
      }

    ]
  },
  {
    path: '/provincial',
    component: Layout,
    redirect: '/provincial/enterpriseInfo',
    alwaysShow: true,
    meta: { title: '省级查看', icon: 'litchee', roles: ['shengji'] },
    children: [
      {
        path: 'enterpriseInfo',
        name: 'EnterpriseInfo',
        component: () => import('@/views/provincial/enterpriseInfo'),
        meta: { title: '企业信息', icon: 'info' }
      }
    ]
  },
  {
    path: '/logistics',
    component: Layout,
    redirect: '/logistics/license',
    alwaysShow: true,
    meta: { title: '物流补助', icon: 'subsidy', roles: ['wuliu'] },
    children: [
      {
        path: 'license',
        name: 'LogisticsLicense',
        component: () => import('@/views/logistics/license'),
        meta: { title: '物流资质', icon: 'info' }
      },
      {
        path: 'lichee',
        name: 'LogisticsLichee',
        component: () => import('@/views/logistics/lichee'),
        meta: { title: '广东荔枝', icon: 'info' }
      }
    ]
  },
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
