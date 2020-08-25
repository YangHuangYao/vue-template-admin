<template>
  <div class="home">
 <el-form
        :model="loginFormData"
        ref="loginFormData"
        label-width="0"
        :rules="rules"
        class="demo-dynamic"
      >
        <div >
          <div class="admin-name">映美e开单管理平台</div>
          <div class="admin-www">www.ekaidan.com</div>
        </div>
        <el-form-item
          prop="name"
          class="margin-top-40"
        >
          <el-input
            placeholder="请输入手机号"
            prefix-icon="el-icon-user"
            v-model="loginFormData.name"
            maxlength="11"
            autocomplete="new-name"
            name="name"
          ></el-input>
        </el-form-item>
        <el-form-item

          class="send-code"
          prop="verifyCode"
        >
          <el-input
            placeholder="请输入验证码"
            prefix-icon="el-icon-circle-check"
            v-model="loginFormData.verifyCode"
            autocomplete="new-verifyCode"
            name="verifyCode"
          ></el-input>
          <div
            class="send-code-btn"
            @click="sendCode"
          >丨 {{ codeText }}</div>
        </el-form-item>
        <el-form-item prop="password" >
          <el-input
            placeholder="请输入密码"
            type="password"
            prefix-icon="el-icon-lock"
            v-model="loginFormData.password"
            name="password"
            autocomplete="new-password"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="type!=='login'"
          class="margin-bttom-40"
          prop="password1"
        >
          <el-input
            placeholder="请再次输入密码"
            type="password"
            prefix-icon="el-icon-lock"
            v-model="loginFormData.password1"
            autocomplete="new-password1"
            name="password1"
          ></el-input>
        </el-form-item>
        <el-form-item class="login-btn-ground">
          <el-button
            size="medium"
            type="primary"
            class="login-btn"
            @click="submitForm('loginFormData')"
          >提交</el-button>

        </el-form-item>
      </el-form>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeModule from '@api/home'
export default {
  name: 'Home',
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空！'))
      }
      callback()
    }
    const checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入验证码！'))
      }
      callback()
    }
    const checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码！'))
      }
      callback()
    }
    const checkPassword1 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码！'))
      } else if (this.loginFormData.password !== value) {
        return callback(new Error('请确认密码一致!'))
      }
      callback()
    }
    return {
      type: 'login',
      rules: {
        name: [{ validator: checkPhone, trigger: 'blur' }],
        verifyCode: [{ validator: checkCode, trigger: 'blur' }],
        password: [{ validator: checkPassword, trigger: 'blur' }],
        password1: [{ validator: checkPassword1, trigger: 'blur' }]
      },
      codeText: '',
      loginFormData: {
        name: '18875948598',
        password: '123456',
        password1: '',
        verifyCode: '5555'
      }
    }
  },
  computed: {

  },
  watch: {
    // data(newValue, oldValue) {

    // }
  },
  filters: {
    // fnName: function(value) {
    //   return value;
    // }
  },
  created() {

  },
  methods: {
    submitForm(loginForm) {
      const self = this
      self.$refs[loginForm].validate(valid => {
        if (valid) {
          const obj = {}
          obj.name = self.loginFormData.name
          obj.password = self.loginFormData.password
          HomeModule.signIn(obj).then(res=>{
            console.log('res: ', res)
          }).catch(err=>{
            console.log('err: ', err)
          })
        } else {
          return false
        }
      })
    },
    sendCode() {

    }
  }
}
</script>
<style lang="scss" scoped>
.home{
  padding:0 150px 0
}
</style>
