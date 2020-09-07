export default {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  routes: state => state.permission.routes,
  userInfo: state => state.user.userInfo
}
