import { constantRoutes, asyncRoutes } from '@router/index'
import utils from '@utils/index'
import _ from 'lodash'
/**
 * 设置meta中role属性来判断权限
 * @param roles
 * @param route
 */
function hasPermission (roles, route) {
  if (route.meta && typeof route.meta.role !== 'undefined') {
    return roles.some(item => route.meta.role.includes(item.role))
  } else {
    return true
  }
}
function pathSome (routes, path, roles) {
  let redirect = _.clone(path)
  const flag = false
  const pathArr = redirect.split('/')
  routes.map((item) => {
    let flag = roles.some(role => item.meta.role.includes(role.role))
    if (flag) {
      if (pathArr[pathArr.length - 1].includes(item.path)) {
        flag = true
      }
    }
  })
  if (!flag) {
    pathArr[pathArr.length - 1] = routes.filter((item) => {
      return item.meta && typeof item.meta.role !== 'undefined' & roles.some(role => item.meta.role.includes(role.role))
    })[0].path
    redirect = pathArr.join('/')
  }
  return redirect
}
/**
 * 过滤路由表的权限role是用户roles中的权限
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes (routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        if (tmp.redirect) {
          tmp.redirect = pathSome(route.children, tmp.redirect, roles)
        }
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [], // 权限路由
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  RESET_ROUTES: (state, routes) => {
    state.addRoutes = []
    state.routes = []
  }
}

const actions = {
  generateRoutes ({
    commit
  }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  resetRoutes ({
    commit
  }) {
    commit('RESET_ROUTES')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
