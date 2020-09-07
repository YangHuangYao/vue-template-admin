import axios from 'axios'
import QS from 'qs' // 引入qs模块，用来序列化post类型的数据，
import {
  Loading,
  Message
} from 'element-ui' // element-ui
import {
  getToken
} from '@utils/auth'
import HttpRequest from '@config/http-request'
class Server {
  constructor() {
    this.Loading = null
  }

  checkStatus (response) {
    const status = response.status || -1000 // -1000 自己定义，连接错误的status
    if ((status >= 200 && status < 300) || status === 304) {
      const data = response.data
      const {
        stateName,
        successCode
      } = HttpRequest
      if (data[stateName] !== successCode) {
        Message.error(data.message)
      }
      // 如果http状态码正常，则直接返回数据
      return response.data
    } else {
      return {
        status,
        msg: this.messageText(status, response)
      }
    }
  }

  messageText (status, response) {
    const msg = response.data.message || response.data.Message
    let errorInfo = ''
    switch (status) {
      case -1:
        errorInfo = msg || '远程服务响应失败,请稍后重试'
        break
      case 400:
        errorInfo = msg || '400：错误请求'
        break
      case 401:
        errorInfo = msg || '401：访问令牌无效或已过期'
        break
      case 403:
        errorInfo = msg || '403：拒绝访问'
        break
      case 404:
        errorInfo = msg || '404：资源不存在'
        break
      case 405:
        errorInfo = msg || '405：请求方法未允许'
        break
      case 408:
        errorInfo = msg || '408：请求超时'
        break
      case 500:
        errorInfo = msg || '500：访问服务失败'
        break
      case 501:
        errorInfo = msg || '501：未实现'
        break
      case 502:
        errorInfo = msg || '502：无效网关'
        break
      case 503:
        errorInfo = msg || '503：服务不可用'
        break
      default:
        errorInfo = msg || '连接错误'
    }
    Message.error(errorInfo)
    return errorInfo
  }

  setInterceptors (instance, loading) {
    // request请求拦截器
    instance.interceptors.request.use(
      config => {
        if (loading) {
          this.Loading = Loading.service()
        }
        config.headers.token = getToken()
        config.headers.ContentType = HttpRequest.contentType
        return Promise.resolve(config)
      },
      error => {
        if (loading) {
          this.Loading.close()
        }
        Promise.reject(error)
      }
    )

    // response 响应拦截器
    instance.interceptors.response.use(
      response => {
        if (loading) {
          this.Loading.close()
        }
        this.checkStatus(response)
        return Promise.resolve(response.data)
      },
      error => {
        if (loading) {
          this.Loading.close()
        }
        if (error.response) {
          return Promise.reject(this.checkStatus(error.response))
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
      }
    )
  }

  request (options) {
    // 每次请求都会创建新的axios实例。
    const instance = axios.create()
    const CancelToken = axios.CancelToken
    const config = { // 将用户传过来的参数与公共配置合并。
      ...options,
      baseURL: process.env.VUE_APP_BASE_URL,
      timeout: HttpRequest.timeout,
      crossDomain: HttpRequest.crossDomain, // 设置cross跨域
      withCredentials: HttpRequest.withCredentials, // 设置cross跨域 并设置访问权限 允许跨域携带cookie信息
      transformRequest: [
        function (data) {
          data = QS.stringify(data)
          return data
        }
      ]
    }
    // 配置拦截器
    this.setInterceptors(instance, options.loading)
    return instance(config) // 返回axios实例的执行结果
  }

  get (url, loading, data) {
    return this.request({
      method: 'get',
      url: url,
      loading: loading,
      params: data
    })
  }

  post (url, loading, data) {
    return this.request({
      method: 'post',
      url: url,
      loading: loading,
      params: data
    })
  }

  delete (url, loading, data) {
    return this.request({
      method: 'delete',
      url: url,
      loading: loading,
      params: data
    })
  }

  put (url, loading, data) {
    return this.request({
      method: 'put',
      url: url,
      loading: loading,
      params: data
    })
  }
}


export default new Server()
