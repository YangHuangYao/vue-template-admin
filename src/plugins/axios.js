import axios from 'axios'
import QS from 'qs' // 引入qs模块，用来序列化post类型的数据，
import Vue from 'vue'
import { Loading, Message } from 'element-ui' // element-ui
import Utils from '@utils/index'
import statusType from '@config/http-status-type'


class NewAxios {
  constructor() {
    this.Loading = null
    this.sources = {}
    this.requestList = []// 一个数组用于存储每个ajax请求的取消函数和ajax标识
    this._config = {
      baseURL: process.env.APP_BASE_URL,
      timeout: 30 * 1000,
      crossDomain: true,
      withCredentials: true
    }
  }

  removePending (request) { // 取消操作请求和移除请求记录
    for (let i = 0; i < this.requestList.length; i++) {
      if (request === this.requestList[i]) {
        this.requestList.splice(i, 1) // 把这条记录从数组中移除
      }
    }
  }

  setInterceptors (instance, CancelToken) {
    const self = this
    const { requestContinuousTime, requestContinuousTimeState } = statusType
    // http request 拦截器
    instance.interceptors.request.use(config => {
      self.Loading = Loading.service()
      config.headers.token = Utils.storageGet('location', 'token') ? Utils.storageGet('location', 'token') : ''
      config.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'
      config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
      const request = JSON.stringify(config.url) + JSON.stringify(config.method) + JSON.stringify(config.data || '')

      if (requestContinuousTimeState) {
        // 处理取消请求satrt
        config.cancelToken = new CancelToken((c)=>{
          // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
          self.sources[request] = c
        })
        if (self.requestList.includes(request)) {
          self.sources[request]({ requestType: 'warning', message: '请不要频繁操作！' })
          setTimeout(()=>{
            self.removePending(request)
          }, requestContinuousTime)
        } else {
          if (!self.requestList.includes(request)) {
            self.requestList.push(request)
          }
        }
        // 处理取消请求end
      }


      return Promise.resolve(config)
    }, error => {
      // 对请求错误做处理...
      self.Loading.close()
      return Promise.reject(error)
    })
    // http request 拦截器end

    // http response 拦截器start
    instance.interceptors.response.use((response) => {
      self.Loading.close()
      self.checkStatus(response)
      return Promise.resolve(response.data)
    }, (error) => {
      // 对响应错误做处理...
      self.Loading.close()
      if (error.response) {
        return Promise.reject(self.checkStatus(error.response))
      } else if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        error.msg = '请求超时'
        return Promise.reject(error)
      } else {
        if (typeof error.message.message !== 'undefined') {
          Message({
            message: error.message.message,
            type: 'warning'
          })
        } else {
          Message.error(error.message)
        }

        return Promise.reject(error)
      }
    })
    // http response 拦截器end
  }


  checkStatus (response) {
    const status = response.status || -1000 // -1000 自己定义，连接错误的status
    if ((status >= 200 && status < 300) || status === 304) {
      const data = response.data
      const { stateName, successCode } = statusType
      if (data[stateName] !== successCode) {
        Message.error(data.message)
      }
      // 如果http状态码正常，则直接返回数据
      return response.data
    } else {
      return {
        status,
        msg: this.messageText(status)
      }
    }
  }

  messageText(status) {
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
    return errorInfo
  }

  request(options) {
    // 每次请求都会创建新的axios实例。
    const instance = axios.create()
    const CancelToken = axios.CancelToken

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
    this.setInterceptors(instance, CancelToken)
    return instance(config) // 返回axios实例的执行结果
  }

  get(url, data) {
    return this.request({
      method: 'get',
      url: url,
      params: data
    })
  }

  post(url, data) {
    return this.request({
      method: 'post',
      url: url,
      params: data
    })
  }

  delete(url, data) {
    return this.request({
      method: 'delete',
      url: url,
      params: data
    })
  }

  put(url, data) {
    return this.request({
      method: 'put',
      url: url,
      params: data
    })
  }
}

Vue.prototype.$http = new NewAxios()


export default new NewAxios()
