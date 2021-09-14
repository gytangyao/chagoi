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
const exec = require('child_process').exec
export default {
  data() {
    return {
      backgroundImage: require("./../assets/Images/splashscreen.png"),
    };
  },
  mounted() {
    this.initSystem();
  },
  methods: {
    initSystem() {
      let self = this;
      //启动通讯进程
      //let filePath = 'D:\\chagoi_native-master\\chagoi.native.core\\bin\\Debug\netcoreapp3.1\\chagoi.native.core.exe';
      let cmdStr = "dotnet D:\\chagoi_native-master\\chagoi.native.core\\bin\\Debug\\netcoreapp3.1\\chagoi.native.core.dll";
      let workerProcess = exec(cmdStr)
      // 打印正常的后台可执行程序输出
      workerProcess.stdout.on('data', function (data) {
        console.log('stdout: ' + data)
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
          return
        }
        this.$store.commit('native_ws/setIsRuning', true)
      })
    }
  }, computed: {
    ...mapState({
      isRuning: state => state.native_ws.isRuning
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