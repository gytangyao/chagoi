<template>
  <div class="root-container"
    v-bind:style="{
      backgroundImage: 'url(' + backgroundImage + ')',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
    }">
    <span style="color:red;fontsize:20px">我日{{isRuning}}</span>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import path from 'path'
import { invokeNative } from '../utils/http'

const exec = require('child_process').exec
export default {
  data() {
    return {
      backgroundImage: require("./../assets/Images/splashscreen.png"),
    };
  },
  mounted() {
    //this.$router.push("/login");
    this.startNativeProcess();
  },
  methods: {
    //初始化缓存状态
    initMemoryCache() {
      let params = { action: "QueryDevice" };
      invokeNative(params).then(res => {
        var data = res.data;
        this.$store.commit('memoryCache/setStoreId', data.StoreId);
        this.$store.commit('memoryCache/setStoreName', data.StoreName);
        this.$store.commit('memoryCache/setDeviceId', data.DeviceId);
        this.$store.commit('memoryCache/setDeviceName', data.DeviceName);
        this.$store.commit('memoryCache/setGatewayHost', data.GatewayHost);
        this.$store.commit('memoryCache/setWebsocketUri', data.WebsocketUri);
      });

      params = { action: "QueryPushSwitch" };
      invokeNative(params).then(res => {
        var data = res.data;
        this.$store.commit('memoryCache/setPushSwitch', data);
        this.$router.push("/login");
      });
    },

    startNativeProcess() {
      let self = this;
      //启动通讯进程
      let nativeDir = path.join(process.cwd(), '/resources/native')
      if (process.env.NODE_ENV === 'development') {
        nativeDir = path.join(process.cwd(), '/native/src/Release')
      }
      let command = process.platform == 'darwin' ? `dotnet ${path.join(nativeDir, "netcoreapp3.1/core.dll")}` : `${path.join(nativeDir, "classic.exe")}`;
      let workerProcess = exec(command)
      // 打印正常的后台可执行程序输出
      workerProcess.stdout.on('data', function (data) {
        console.log("workerProcess.stdout.on data:" + data)
        self.initMemoryCache();
      })
      // 打印错误的后台可执行程序输出
      workerProcess.stderr.on('data', function (data) {
        console.log('stderr: ' + data)
      })
      // 退出之后的输出
      workerProcess.on('close', function (code) {
        if (code != 0) {
          self.$alert('抱歉,启动通讯进程失败', '通讯失败', {
            confirmButtonText: '确定'
          })
        }
      })
    }
  }, computed: {
    ...mapState({
      isRuning: state => state.native_http.isRuning
    }),
  }
}
</script>
<style scoped>
.root-container {
  width: 100%;
  height: 100%;
  position: fixed;
}
</style>