import axios from 'axios'
import QS from 'qs' // 引入qs模块，用来序列化post类型的数据，
import Vue from 'vue'
import { Loading, Message } from 'element-ui' // element-ui
import Utils from '@utils/index'

class Https {
  constructor() {
    this._axios = null
    this.Loading = null
    this.CancelToken = null
    this.pending = [] // 一个数组用于存储每个ajax请求的取消函数和ajax标识
    this._config = {
      baseURL: process.env.APP_BASE_URL,
      timeout: 30 * 1000,
      crossDomain: true,
      withCredentials: true
    }
  }

  removePending (ever) { // 取消操作请求和移除请求记录
    for (const p in this.pending) {
      if (this.pending[p].u === ever.url + '&' + ever.method) { // 当当前请求在数组中存在时执行函数体
        this.pending[p].f() // 执行取消操作
        this.pending.splice(p, 1) // 把这条记录从数组中移除
      }
    }
  }

  setInterceptors (instance, url) {
    const self = this
    // 这里的url可供你针对需要特殊处理的接口路径设置不同拦截器。
    if (url === '/user') {
      // todo define diffrent interceptors
    }
    // http request 拦截器
    instance.interceptors.request.use(config => {
      config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: Utils.storageGet('location', 'token')
      }
      self.Loading = Loading.service()
      // ------------------------------------------------------------------------------------
      self.removePending(config) // 在一个ajax发送前执行一下取消操作
      config.cancelToken = new self.CancelToken((c)=>{
        // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
        self.pending.push({ u: config.url + '&' + config.method, f: c })
      })
      // -----------------------------------------------------------------------------------------
      return Promise.resolve(self.checkStatus(config))
    }, error => {
      // 对请求错误做处理...
      self.Loading.close()
      return Promise.reject(error)
    })
    // http request 拦截器end

    // http response 拦截器start
    instance.interceptors.response.use((response) => {
      self.Loading.close()
      self.removePending(response)
      return Promise.resolve(self.checkStatus(response))
    }, (error) => {
      // 对响应错误做处理...
      self.Loading.close()
      if (error.response) {
        return Promise.reject(self.checkStatus(error.response))
      } else if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        error.msg = '请求超时'
        return Promise.reject(error)
      } else {
        return Promise.reject(error)
      }
    })
    // http response 拦截器end
  }


  checkStatus (response) {
    const status = response.status || -1000 // -1000 自己定义，连接错误的status
    if ((status >= 200 && status < 300) || status === 304) {
      // 如果http状态码正常，则直接返回数据
      return response.data
    } else {
      let errorInfo = ''
      switch (status) {
      case -1:
        errorInfo = '远程服务响应失败,请稍后重试'
        break
      case 400:
        errorInfo = '400：错误请求'
        break
      case 401:
        errorInfo = '401：访问令牌无效或已过期'
        break
      case 403:
        errorInfo = '403：拒绝访问'
        break
      case 404:
        errorInfo = '404：资源不存在'
        break
      case 405:
        errorInfo = '405：请求方法未允许'
        break
      case 408:
        errorInfo = '408：请求超时'
        break
      case 500:
        errorInfo = '500：访问服务失败'
        break
      case 501:
        errorInfo = '501：未实现'
        break
      case 502:
        errorInfo = '502：无效网关'
        break
      case 503:
        errorInfo = '503：服务不可用'
        break
      default:
        errorInfo = '连接错误'
      }
      Message.error(errorInfo)
      return {
        status,
        msg: errorInfo
      }
    }
  }


  request(options) {
    // 每次请求都会创建新的axios实例。
    const instance = axios.create()
    this._axios = instance
    this.CancelToken = axios.CancelToken
    console.log('cancelToken: ', this.CancelToken)
    const config = { // 将用户传过来的参数与公共配置合并。
      ...options,
      baseURL: this._config.baseURL,
      timeout: this._config.timeout,
      crossDomain: this._config.crossDomain, // 设置cross跨域
      withCredentials: this._config.withCredentials, // 设置cross跨域 并设置访问权限 允许跨域携带cookie信息
      transformRequest: [
        function(data) {
          data = QS.stringify(data)
          return data
        }
      ]
    }
    // 配置拦截器，支持根据不同url配置不同的拦截器。
    this.setInterceptors(instance, options.url)
    return instance(config) // 返回axios实例的执行结果
  }
}
const $http = new Https()
export const get = (url, data) => {
  return $http._axios.get(url, {
    params: data
  })
}

export const post = (url, data) => {
  return $http._axios.post(url, data)
}

export const del = (url, data) => {
  return $http._axios.delete(url, {
    data
  })
}

export const put = (url, data) => {
  return $http._axios.put(url, data)
}
Plugin.install = function(Vue, options) {
  Vue.axios = $http._axios
  window.axios = $http._axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return $http._axios
      }
    },
    $axios: {
      get() {
        return $http._axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
