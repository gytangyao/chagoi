<template>
  <div class="root-container"
    v-bind:style="{
      backgroundImage: 'url(' + backgroundImage + ')',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
    }">
    <div class="login-container">
      <div class="left"
        v-bind:style="{
          backgroundImage: 'url(' + leftBackgroundImage + ')',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }"></div>
      <div class="right">
        <el-form :model="loginForm"
          :rules="loginFormRules"
          status-icon
          ref="loginForm"
          label-position="left"
          label-width="0px"
          class="loginForm">
          <img class="logo"
            :src="logoImage" />
          <span class="title">微喵虎斑管理系统</span>
          <el-form-item prop="username">
            <el-input type="text"
              ref="username"
              v-model="loginForm.username"
              auto-complete="off"
              prefix-icon="el-icon-user"
              placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password"
              ref="password"
              prefix-icon="el-icon-lock"
              v-model="loginForm.password"
              auto-complete="off"
              placeholder="密码"></el-input>
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberme"
            class="rememberme">记住登录凭证 </el-checkbox>
          <el-form-item style="width: 100%">
            <el-button type="primary"
              style="width: 100%"
              class="loginButton"
              @click="handleSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="toolbox">
      <el-button round
        class="closeButton"
        size="medium"
        @click="exitApp()">
        <el-icon style="vertical-align: middle">
          <circle-close />
        </el-icon>
        <span style="vertical-align: middle"> 关闭 </span>
      </el-button>
    </div>
  </div>
</template>

<script>
import { CircleClose } from "@element-plus/icons";
import { login, client_secret } from '../utils/http'
import { helloWorld } from '../utils/edge'
import { Encrypt } from '../utils/index'

export default {
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
    window.addEventListener('keydown', (this.keyDown));
  },
  unmounted() {
    window.removeEventListener('keydown', this.keyDown, false);
  },
  data() {
    return {
      logoImage: require("./../assets/Images/cl.png"),
      backgroundImage: require("./../assets/Images/loginbg.png"),
      leftBackgroundImage: require("./../assets/Images/loginFormLeft.png"),
      loginForm: {
        username: "18900000001",
        password: "111111",
        rememberme: true
      },
      loginFormRules: {
        username: [
          {
            required: true,
            message: "请输入登录用户名",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
      },
      checked: false,
    };
  },
  methods: {
    keyDown(e) {
      if (e.keyCode == 13) {
        this.handleSubmit();
      }
    },

    login() {
      return new Promise(resolve => {
        let params = {
          grant_type: "password",
          username: this.loginForm.username,
          password: Encrypt(this.loginForm.password),
          client_id: "windons",
          client_secret: Encrypt(client_secret),
        };
        login(params).then(res => {
          let token = res.data.token;
          sessionStorage.setItem("token", token);
          resolve();
        });
      });
    },
    handleSubmit() {

      helloWorld("Call .net method from DLL", function (err, result) {
        if (err) throw err;
        console.log(result);
      });

      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.login().then(prev => {
          console.log(prev)
        }).catch(err => { alert(err) });
      });
    },
    exitApp() {
      alert(1);
    },
  },
  components: {
    CircleClose
  },
};
</script>

<style scoped>
.root-container {
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
}

.login-container {
  align-self: center;
  display: flex;
  height: 55%;
  width: 55%;
}

.login-container .left {
  width: 50%;
}

.login-container .right {
  width: 50%;
  background-color: #fff;
  border-radius: 0px 6px 6px 0px;
  display: flex;
  align-items: center;
}

.loginForm {
  width: 100%;
  margin-left: 60px;
  margin-right: 60px;
  display: flex;
  flex-direction: column;
}

.loginForm .logo {
  width: 86px;
  height: 85px;
  margin-bottom: 11px;
  align-self: center;
}

.loginForm .title {
  align-self: center;
  font-size: 17px;
  font-weight: "Regular";
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #3e3e3e;
  margin-bottom: 11px;
  line-height: 24px;
}

.loginForm .loginButton {
  background: linear-gradient(90deg, #ffd594 2%, #fbe9c2);
  border-radius: 26px;
  font-size: 19px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: center;
  color: #3d170e;
  line-height: 27px;
  border: transparent;
}

.toolbox {
  position: absolute;
  right: 25px;
  top: 20px;
}

.toolbox .closeButton {
  border: 1px solid #333333;
  border-radius: 21px;
  background-color: transparent;
  color: #999999;
}

label.el-checkbox.rememberme {
  margin: 0px 0px 15px;
  text-align: left;
}
</style>
