import NewAxios from '@/plugins/axios'
import path from './path'
const { typeList } = require('@config/proxy.js')
class Http {
  constructor() {
    this.type = typeList[0]
    this.path = path
  }

  setProxyType(data) { // 设置代理接口类型 按照typeList记录是值来设置
    this.type = data
  }

  getProxyPath() {
    const path = process.env.NODE_ENV === 'development' ? this.type : ''
    return path
  }

  get(url, data) {
    return NewAxios.get(this.getProxyPath() + url, data)
  }

  post(url, data) {
    return NewAxios.post(this.getProxyPath() + url, data)
  }

  delete(url, data) {
    return NewAxios.delete(this.getProxyPath() + url, data)
  }

  put(url, data) {
    return NewAxios.put(this.getProxyPath() + url, data)
  }
}

export default Http
