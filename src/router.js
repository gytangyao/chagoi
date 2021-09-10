import { createRouter, createWebHashHistory } from "vue-router"


import Main from './components/Main.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: Main
    }
  ]
});

export default router;