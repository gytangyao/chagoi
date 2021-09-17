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
              :loading="loading"
              class="loginButton"
              @click="handleSubmit">{{sureButtonText}}</el-button>
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
import { login, findDeviceUserInfo, sendBindCashiercyc, routers, invokeNative, client_secret } from '../utils/http'
import { Encrypt, Decrypt } from '../utils/index'
import { mapState } from 'vuex'
import { ElMessage } from 'element-plus';
var UUID = require('uuid');
const desKey = "3rycbnju";
const sureButtonDefaultText = "登录";


export default {
  created() {
    this.sureButtonText = sureButtonDefaultText;
    this.afterViewLoadedInit();
  },
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
      sureButtonText: '',
      loading: false,
      loginForm: {
        username: "",
        password: "",
        rememberme: true
      },
      deviceEntity: {
        RememberAccount: false,
        Uid: null,
        Pwd: null,
        DeviceId: null,
        DeviceName: null,
        StoreId: null,
        StoreName: null
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
    afterViewLoadedInit() {
      let params = { action: "QueryDevice" };
      //从本地数据库中读取用户名和密码
      invokeNative(params).then(res => {
        var data = res.data;
        if (data && data.Uid) {
          this.loginForm.username = Decrypt(data.Uid, desKey);
        }
        if (data && data.Pwd) {
          this.loginForm.password = Decrypt(data.Pwd, desKey);
        }
        if (data && data.RememberAccount) {
          this.loginForm.resolve = data.RememberAccount;
        }

        this.deviceEntity.RememberAccount = data.RememberAccount;
        this.deviceEntity.DeviceId = data.DeviceId;
        this.deviceEntity.DeviceName = data.DeviceName;
        this.deviceEntity.StoreId = data.StoreId;
        this.deviceEntity.StoreName = data.StoreName;
      });
    },
    //登录
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
          this.deviceEntity.RememberAccount = this.loginForm.rememberme;
          if (this.loginForm.rememberme) {
            this.deviceEntity.Uid = Encrypt(this.loginForm.username, desKey);
            this.deviceEntity.Pwd = Encrypt(this.loginForm.password, desKey);
          } else {
            this.deviceEntity.Uid = null;
            this.deviceEntity.Pwd = null;
          }

          let token = res.data.token;
          let sureName = res.data.nickName;
          this.$store.commit('memoryCache/setAccessToken', token)
          this.$store.commit('memoryCache/setSureName', sureName)
          resolve();
        });
      });
    },
    //查找设备,门店信息
    findDeviceUserInfo() {
      return new Promise(resolve => {
        let params = {};
        findDeviceUserInfo(params).then(res => {
          let data = res.data;
          this.$store.commit('memoryCache/setStoreId', data.storeBean.id)
          this.$store.commit('memoryCache/setStoreName', data.storeBean.storeName)
          this.$store.commit('memoryCache/setUserId', data.user.userId)
          this.$store.commit('memoryCache/setUserName', data.user.userName)
          resolve();
        });
      });
    },
    //激活任务
    sendBindCashiercyc() {
      let self = this;
      return new Promise(resolve => {
        if (!this.deviceId) {
          this.sureButtonText = "请前往后台激活...";
          let params = {
            storeid: this.storeId,
            randomOnlyNum: UUID.v1()
          };
          var loopActive = setInterval(function () {
            sendBindCashiercyc(params).then(res => {
              if (res && res.data && res.data.info) {
                clearInterval(loopActive);

                var device = res.data.info;
                self.$store.commit('memoryCache/setDeviceId', device.id);
                self.deviceEntity.DeviceId = device.id;

                self.$store.commit('memoryCache/setDeviceName', device.deviceName);
                self.deviceEntity.DeviceName = device.deviceName;

                self.deviceEntity.StoreId = self.storeId;
                self.deviceEntity.StoreName = self.storeName;

                resolve();
              }
            });
          }, 5000);
        } else {
          resolve();
        }
      });
    },
    //获取收银台路由
    routers() {
      let self = this;
      return new Promise(() => {
        let params = {};
        routers(params).then(res => {
          this.$store.commit('memoryCache/setRouters', res.data)

          //存储数据到本地
          params = {
            "action": "UpdateActiveInfo",
            "data": JSON.stringify(this.deviceEntity)
          }
          invokeNative(params);

          this.loading = false;
          self.$router.push("/main");
        });
      });
    },
    //登录按钮点击
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        this.login().then(() => {
          return this.findDeviceUserInfo();
        }).then(() => {
          return this.sendBindCashiercyc();
        }).then(() => {
          return this.routers();
        }).catch(err => {
          this.loading = false;
          ElMessage({
            message: err,
            type: 'error',
            center: true
          })
        });
      });
    },
    exitApp() {
      this.$confirm('要退出软件吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        customClass: "MyMsgBox"
      })
        .then(() => {
          const ipc = require('electron').ipcRenderer;
          ipc.send('open-save-chart-dialog');
        }).catch(err => {
          console.log(err + "用户取消退出")
        });
    },
  },
  components: {
    CircleClose
  },
  computed: {
    ...mapState({
      deviceId: state => state.memoryCache.DeviceId,
      storeId: state => state.memoryCache.StoreId,
      storeName: state => state.memoryCache.StoreName,
    }),
  }
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
  font-size: 16px;
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
