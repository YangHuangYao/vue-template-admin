import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@views/layout/index.vue'

Vue.use(Router)
// 不需要权限校验动态添加的路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@views/login/index.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: Layout,
    redirect: '/404/',
    name: 'error',
    // hidden: true,
    meta: {
      title: '404',
      icon: '404'
    },
    children: [
      {
        path: '/',
        name: '404',
        component: () => import('@views/error-page/404.vue')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@views/home/index.vue'),
        meta: {
          title: 'Home',
          icon: 'home'
        }
      }
    ]
  }
]
// 需要权限校验动态添加的路由
export const asyncRoutes = [{
  path: '/table',
  component: Layout,
  redirect: '/table/form',
  name: 'table',
  meta: {
    title: 'Table',
    icon: 'table',
    role: 'table'
  },
  children: [{
    path: 'form',
    name: 'Form',
    // component: () => import('@views/table/form/index.vue'),
    component: {
      render (c) {
        return c('router-view')
      }
    },
    meta: {
      title: 'Form',
      icon: 'form',
      role: 'form'
    },
    redirect: '/table/form/list',
    children: [{
      path: 'form-list',
      name: 'list',
      hidden: true,
      component: () => import('@views/table/form/list.vue'),
      meta: {
        perantRedirect: '/table/form',
        title: 'list',
        icon: 'list',
        activeMenu: '/table/form',
        role: 'list'
      }
    },
    {
      path: 'form-detail',
      name: 'Detail',
      hidden: true,
      component: () => import('@views/table/form/detail.vue'),
      meta: {
        title: 'Detail',
        icon: 'detail',
        activeMenu: '/table/form',
        role: 'detail'
      }
    }
    ]
  },
  {
    path: 'input',
    name: 'Input',
    component: () => import('@views/table/input/index.vue'),
    meta: {
      title: 'Input',
      icon: 'input',
      role: 'input'
    }
  }
  ]
}
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [
    ...constantRoutes, // 404 page must be placed at the end !!!
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
