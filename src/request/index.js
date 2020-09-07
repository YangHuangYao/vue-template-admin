import server from './server'
import proxy from '@config/proxy'
class MyServer {
  constructor() {
    this.nowHandle = null
  }

  setProxyType (moduleName, name, data) { // 设置代理接口类型 按照typeList记录是值来设置
    this[moduleName][name].type = data
  }

  getProxyPath (moduleName, name) {
    const api = process.env.NODE_ENV === 'development' ? this[moduleName][name].type : ''
    return api
  }

  // 设置api接口调用方法和可调用状态
  parseRouter (name, urlOb) {
    const ob = this[name] = {}
    Object.keys(urlOb).forEach((item) => {
      ob[item] = this.sendMes.bind(this, name, item, urlOb[item])
      this[name][item].state = 'ready'
      this[name][item].type = proxy.typeList[0]
    })
  }

  // 自定义请求拓展
  sendMes (moduleName, name, url, config) {
    const _config = config || {}
    const loading = typeof _config.loading !== 'undefined' ? _config.loading : true
    if (typeof _config.proxyPath !== 'undefined') {
      this.setProxyType(moduleName, name, _config.proxyPath)
    }
    const method = _config.method || 'get'
    const data = _config.data || {}
    const self = this


    // 请求处理前
    const before = (mes) => {
      self[moduleName][name].state = 'ready'
      return mes
    }

    const path = self.getProxyPath(moduleName, name)
    const pathUrl = path + url

    const state = {
      get () {
        return new Promise((resolve, reject) => {
          server.get(pathUrl, loading, data).then(before).then(res => {
            resolve(res)
          }).catch(err => {
            before(err)
            reject(err)
          })
        })
      },
      post () {
        return new Promise((resolve, reject) => {
          server.post(pathUrl, loading, data).then(before).then(res => {
            resolve(res)
          }).catch(err => {
            before(err)
            reject(err)
          })
        })
      },
      delete () {
        return new Promise((resolve, reject) => {
          server.post(pathUrl, loading, data).then(before).then(res => {
            resolve(res)
          }).catch(err => {
            before(err)
            reject(err)
          })
        })
      },
      put () {
        return new Promise((resolve, reject) => {
          server.post(pathUrl, loading, data).then(before).then(res => {
            resolve(res)
          }).catch(err => {
            before(err)
            reject(err)
          })
        })
      }
    }
    return new Promise((resolve, reject) => {
      if (self[moduleName][name].state === 'ready') {
        self[moduleName][name].state = 'pending' // 请求没回来之前不能继续发请求
        state[method]().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      }
    })
  }
}

export default new MyServer()
