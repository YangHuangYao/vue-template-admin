const proxy = {
  '/admin': {
    target: 'http://120.238.131.30:8166',
    changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
    pathRewrite: {
      '^/admin': ''
    }
  },
  '/print': {
    target: 'http://app.yinmei.me/',
    changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
    pathRewrite: {
      '^/print': ''
    }
  }
}
// 代理的path按顺序记录到数组内用于http请求用
const typeList = [
  'admin', 'print'
]
module.exports = { proxy: proxy, typeList: typeList }
