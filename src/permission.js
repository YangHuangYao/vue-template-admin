import router from './router'
import store from './store'
import Utils from '@utils/index'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@utils/auth'
import getPageTitle from '@utils/get-page-title'
import whiteList from '@config/page-white-list' // 不需要登录可访问的页面

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') { // 已登录跳转到默认页面
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      const hasRoles = store.getters.routes && store.getters.routes.length > 0

      if (hasRoles) {
        next()
      } else {
        try {
          const {
            roles
          } = await store.dispatch('user/getInfo') // 获取用户的权限路由信息
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          router.addRoutes(accessRoutes)
          const currentPage = Utils.storage.get({ type: 'local', key: 'currentPage' })
          if (currentPage) { // 刷新浏览器后回到刷新前的页面
            router.push({ path: currentPage, replace: true })
          } else {
            next({
              replace: true
            })
          }
        } catch (error) {
          // await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next()
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 不需要登录可访问
      next()
    } else { // 登录成功后重定向回刚刚访问的页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
