import Http from './http'

class Home extends Http {
  signIn(data) {
    const self = this
    // 默认代理是admin，如果该接口代理是另一个服务那就先设置代理类型（是proxy.js里面typeList中设置的类型）再请求
    // this.setProxyType('print')
    return self.post(this.path.signIn, data)
  }
}
export default new Home()
