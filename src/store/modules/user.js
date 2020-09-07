import store from '../index'
import {
  getToken,
  setToken,
  removeToken
} from '@utils/auth'
import {
  resetRouter
} from '@router'
import MyServer from '@request/index'
import Utils from '@utils/index'
const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {},
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login ({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      MyServer.user.signIn({
        data: {
          name: username,
          password: password
        },
        method: 'post'
      }).then(res => {
        const {
          value
        } = res
        commit('SET_TOKEN', value)
        setToken(value)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo ({
    commit,
    state
  }) { //
    return new Promise((resolve, reject) => {
      MyServer.user.getAccount({
        data: {}
      }).then(res => {
        const {
          value
        } = res
        if (!value) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject('Verification failed, please Login again.')
        }
        value.roles = [
          { name: 'Table', role: 'table' },
          { name: 'Form', role: 'form' },
          { name: 'list', role: 'list' },
          // { name: 'detail', role: 'detail' },
          { name: 'input', role: 'input' }

        ]
        commit('SET_USERINFO', value)

        resolve(value)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      commit('RESET_STATE')
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      store.dispatch('permission/resetRoutes') // 清空权限路由
      Utils.storage.clear({ type: 'local' })
      Utils.storage.clear({ type: 'session' })
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken ({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
