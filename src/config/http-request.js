// axios请求配置
export default {
  contentType: 'application/x-www-form-urlencoded',
  timeout: 30 * 1000,
  crossDomain: true, // 设置cross跨域
  withCredentials: true, // 设置cross跨域 并设置访问权限 允许跨域携带cookie信息
  stateName: 'stateCode', // 接口返回的状态字段名称
  successCode: 200 // 接口请求成功状态码
}
