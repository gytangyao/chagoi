<template>
  <router-view></router-view>
</template>

<script>


export default {
  mounted() {
    this.init();
  },
  data() {
    return {
      path: "ws://localhost:8999/websocket/",
      ws: {}
    }
  },
  methods: {
    heartCheck() {

    },
    //init函数可在页面加载的时候就进行初始化或者根据自己的业务需求在需要打开通讯的时候在进行初始化
    init() {
      // 实例化socket，这里的实例化直接赋值给this.ws是为了后面可以在其它的函数中也能调用websocket方法，例如：this.ws.close(); 完成通信后关闭WebSocket连接
      this.ws = new WebSocket(this.path)

      //监听是否连接成功
      this.ws.onopen = () => {
        console.log('ws连接状态onopen：' + this.ws.readyState);
        //连接成功则发送一个数据
        this.ws.send('连接成功');
      }

      //接听服务器发回的信息并处理展示
      this.ws.onmessage = (data) => {
        console.log('接收到来自服务器的消息onmessage：');
        console.log(data)
      }

      //监听连接关闭事件
      this.ws.onclose = () => {
        //监听整个过程中websocket的状态
        console.log('ws连接状态onclose：' + this.ws.readyState);
        console.log(this.$store);
        this.$store.commit('native_ws/setIsRuning', true)
      }

      //监听并处理error事件
      this.ws.onerror = function (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style>
</style>