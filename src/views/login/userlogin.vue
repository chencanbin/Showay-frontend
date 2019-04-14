<template>
  <el-form
    ref="loginForm"
    :rules="loginRules"
    :model="loginForm"
    class="login-form"
    label-width="0">
    <el-form-item prop="id">
      <el-input
        ref="username"
        v-model="loginForm.id"
        auto-complete="off"
        placeholder="请输入用户名"
        @keyup.enter.native="handleLogin">
        <svg-icon slot="prefix" icon-class="user"/>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        :type="passwordType"
        auto-complete="off"
        placeholder="请输入密码"
        @keyup.enter.native="handleLogin">
        <i slot="suffix" class="el-icon-view el-input__icon" @click="showPassword" />
        <svg-icon slot="prefix" icon-class="password"/>
      </el-input>
    </el-form-item>
    <el-form-item ref="code" prop="code">
      <el-row :span="24">
        <el-col :span="16">
          <el-input
            :maxlength="code.len"
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="请输入验证码"
            @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="code"/>
          </el-input>
        </el-col>
        <el-col :span="8">
          <div v-loading="codeLoading" class="login-code">
            <img :src="code.src" class="login-code-img" @click="refreshCode">
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <!--<el-checkbox v-model="checked">记住账号</el-checkbox>-->
    <el-form-item>
      <el-button
        :loading="loginLoading"
        type="primary"
        size="small"
        class="login-submit"
        @click.native.prevent="handleLogin">登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import sha256 from 'sha256'
const username = process.env.LOGIN_USER_NAME
const password = process.env.LOGIN_PASSWORD
const code = process.env.LOGIN_CODE
export default {
  name: 'UserLogin',
  data() {
    const validateCode = (rule, value, callback) => {
      if (this.loginForm.code !== value) {
        this.loginForm.code = ''
        this.refreshCode()
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        id: username,
        password: password,
        code: code
      },
      checked: false,
      code: {
        src: '',
        len: 4,
        value: ''
      },
      loginRules: {
        id: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: validateCode }
        ]
      },
      passwordType: 'password',
      codeLoading: false,
      loginLoading: false
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  created() {
    this.$nextTick(function() {
      this.$refs.username.focus()
    })
    this.refreshCode()
  },
  methods: {
    refreshCode() {
      this.codeLoading = true
      this.$api.login.generateCode().then(res => {
        this.codeLoading = false
        this.code.src = 'data:image/png;base64,' + res.data
      }).catch(_ => {
        this.codeLoading = false
      })
    },
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const userInfo = Object.assign({}, this.loginForm)
          userInfo.password = sha256(userInfo.password)
          this.loginLoading = true
          this.$store.dispatch('LoginByUsername', userInfo).then(_ => {
            this.$router.push({ path: this.redirect || '/home' })
          }).catch(_ => {
            this.loginLoading = false
            this.loginForm.code = ''
            this.refreshCode()
          })
          // this.$api.login.loginByUsername(this.loginForm).then(() => {
          //   this.$store.commit('HIDE_LOADING')
          //   setLoginStatus(true)
          //   this.$router.push({ path: this.redirect || '/' })
          // }).catch(() => {
          //   this.$store.commit('HIDE_LOADING')
          // })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>
  .el-loading-mask {
    right: -8px;
  }
</style>
