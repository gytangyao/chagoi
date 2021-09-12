<template>
  <div class="root-container"
    v-bind:style="{
      backgroundImage: 'url(' + backgroundImage + ')',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
    }"></div>
</template>
<script>
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