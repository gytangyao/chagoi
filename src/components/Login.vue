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
        <el-form :model="ruleForm2"
          :rules="rules2"
          status-icon
          ref="ruleForm2"
          label-position="left"
          label-width="0px"
          class="loginForm">
          <img class="logo"
            :src="logoImage" />
          <span class="title">系统登录</span>
          <el-form-item prop="username">
            <el-input type="text"
              v-model="ruleForm2.username"
              auto-complete="off"
              placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password"
              v-model="ruleForm2.password"
              auto-complete="off"
              placeholder="密码"></el-input>
          </el-form-item>
          <el-checkbox v-model="checked"
            class="rememberme">记住密码</el-checkbox>
          <el-form-item style="width: 100%">
            <el-button type="primary"
              style="width: 100%"
              class="loginButton"
              @click="handleSubmit"
              :loading="logining">登录</el-button>
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

export default {
  data() {
    return {
      logoImage: require("./../assets/Images/cl.png"),
      backgroundImage: require("./../assets/Images/loginbg.png"),
      leftBackgroundImage: require("./../assets/Images/loginFormLeft.png"),
      logining: false,
      ruleForm2: {
        username: "admin",
        password: "123456",
      },
      rules2: {
        username: [
          {
            required: true,
            message: "please enter your account",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "enter your password", trigger: "blur" },
        ],
      },
      checked: false,
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          this.logining = true;
          if (
            this.ruleForm2.username === "admin" &&
            this.ruleForm2.password === "123456"
          ) {
            this.logining = false;
            sessionStorage.setItem("user", this.ruleForm2.username);
            this.$router.push({ path: "/" });
          } else {
            this.logining = false;
            this.$alert("username or password wrong!", "info", {
              confirmButtonText: "ok",
            });
          }
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
    exitApp() {
      alert(1);
    },
  },
  components: {
    CircleClose,
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
  margin: 24px;
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
