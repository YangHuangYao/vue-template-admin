<template>
  <div class="home-container">
    <div class="home-text">首页</div>
    <el-button type="primary" @click="signIn">登陆</el-button>
    <el-button type="primary" @click="getUserInfo">获取用户信息</el-button>
    <el-button type="primary" @click="getToken">获取token</el-button>

    <p style="width:50%">{{token}}</p>
    <p>{{userInfo}}</p>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      token: '',
      userInfo: {}
    }
  },
  computed: {

  },
  created () {

  },
  methods: {
    getUserInfo () {
      // this.$store.dispatch('user/getInfo')
      this.$api.user.getAccount({ data: {} }).then(res => {
        console.log('res: ', res)
        this.userInfo = res
      }).catch(err => {
        console.log('err: ', err)
      })
      // this.$api.user.getAccount({ data: {}, proxyPath: 'print' }).then(res => {
      //   console.log('res: ', res)
      // }).catch(err => {
      //   console.log('err: ', err)
      // })
      // this.$api.user.signIn({
      //   data: {
      //     name: 'username',
      //     password: 'password'
      //   },
      //   method: 'post'
      // }).then(res => {

      // })
    },
    getToken () {
      this.token = this.$store.state.user.token
    },
    signIn () {
      this.$store.dispatch('user/login', { name: '18875948598', password: 'y123456' })
    }

  }
}
</script>

<style lang="scss" scoped>
.home {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    background-color: $menuText;
  }
}
</style>
