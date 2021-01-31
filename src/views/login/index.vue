<template>
  <div class="login-container">
    <div class="form-content">
      <img class="bg-login" src="../../assets/images/background.png" alt="">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">欢迎登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <div class="autoLogin">
        <el-checkbox v-model="checked" class="autoCheck">记住用户名</el-checkbox>
        <!-- <span @click="clearCookie" class="forgetPwd">忘记密码</span> -->
      </div>

      <el-form-item prop="code" v-if="count >= 3">
        <el-row>
          <el-col :span="18">
            <el-input type="text" v-model="loginForm.code" placeholder="请输入验证码"></el-input>
          </el-col>
          <el-col :span="6">
            <div class="login-code" @click="refreshCode">
            <Identify :identifyCode="identifyCode" ></Identify>
            </div>
          </el-col>
        </el-row>
        
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;font-size: 16px;" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import Identify from '@/components/Code/Identify'

export default {
  name: 'Login',
  components: { Identify },
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!validUsername(value)) {
      if (value.toLowerCase() === '') {
        callback(new Error('请填写用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请填写密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '',
        code: ''
      },
      identifyCodes: '1234567890abcdefjhijklinopqrsduvwxyz',
      identifyCode: '',
      count: 1,
      loginRules: {
        username: [{ required: true, trigger: 'change', validator: validateUsername }],
        password: [{ required: true, trigger: 'change', validator: validatePassword }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      checked: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    },
    checked: {
      handler (val) {
        if (val) {
          this.getCookie()
        }
      }
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    // 初始化验证码
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    // 重置验证码
    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
      },
      randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      if (this.count >= 3) {
        if (this.loginForm.code.toLowerCase() !== this.identifyCode.toLowerCase()) {
          this.$message.error('请填写正确验证码')
          this.refreshCode()
          return
        }
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
              // 点击登录按钮的时候，判断是否勾选了自动登录（记住密码），对cookie做相应操作
              if (this.checked) {
                // 传入账号名，密码，和保存天数3个参数
                this.setCookie(this.loginForm.username, this.loginForm.password, 7)
              } else {
                // 如果没有选中自动登录，那就清除cookie
                this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
              }
            })
            .catch(() => {
              this.count++
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    Login() {
      if (this.count >= 3) {
        if (this.formLogin.code.toLowerCase() !== this.identifyCode.toLowerCase()) {
          this.$message.error('请填写正确验证码')
          this.refreshCode()
          return
        }
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
              // 点击登录按钮的时候，判断是否勾选了自动登录（记住密码），对cookie做相应操作
              if (this.checked) {
                // 传入账号名，密码，和保存天数3个参数
                this.setCookie(this.loginForm.username, this.loginForm.password, 7)
              } else {
                // 如果没有选中自动登录，那就清除cookie
                this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    // 设置cookie
    setCookie (name, pwd, exdays) {
      var exdate = new Date()// 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays)// 保存的天数
      // 字符串拼接cookie
      window.document.cookie = 'userName' + '=' + name + ';path=/;expires=' + exdate.toGMTString()
      window.document.cookie = 'userPwd' + '=' + pwd + ';path=/;expires=' + exdate.toGMTString()
    },
    // 读取cookie 将用户名和密码回显到input框中
    getCookie () {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ')// 这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=')// 再次切割
          // 判断查找相对应的值
          if (arr2[0] === 'userName') {
            this.loginForm.username = arr2[1]// 保存到保存数据的地方
          } else if (arr2[0] === 'userPwd') {
            this.loginForm.password = arr2[1]
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

// $bg:#283443;
$bg:#fff;
$light_gray:rgba(0, 0,0,.9);
$cursor: rgba(0, 0,0,.7);

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      // background: transparent;
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    // border: 1px solid rgba(255, 255, 255, 0.1);
    border: 1px solid #ccc;
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
$border-color: rgba(0, 0,0,.2);

.login-container {
  background: url('../../assets/images/bg.png') no-repeat;
  background-size:100% 100%;
  min-height: 100%;
  width: 100vw;
  height: 100vh;
  background-color: $bg;
  overflow: hidden;
  position: relative;

  .login-form {
    position: absolute;
    top: 65px;
    right: 30px;
    width: 520px;
    max-width: 100%;
    padding: 70px 35px;
    margin: 0 auto;
    overflow: hidden;
    background-color: #fff;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      // color: $light_gray;
      color: #161868;
      margin: 0px auto 40px auto;
      text-align: left;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
  .autoLogin {
    margin-bottom: 30px;
    .autoCheck {
      margin-left: 10px;
      color: #161868;
    }
  }
  .form-content {
    width: 1267px;
    height: 638px;
    // background: url('../../assets/images/bg2.png') no-repeat;
    // background: url('../../assets/images/background.png') no-repeat;
    // background-position: 100% 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 10px;

    .bg-login {
      position: absolute;
      left: 0;
      top: 40px;
      width: 760px;
      height: auto;
    }
  }
  .login-code {
    width: 100%;
    height: 100%;
    border-right: 1px solid $border-color;
  }
}
</style>
