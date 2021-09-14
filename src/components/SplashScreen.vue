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