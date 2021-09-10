import { createRouter, createWebHashHistory } from "vue-router"
import Main from './components/Main.vue'
import Setting from './components/Setting.vue'
import Login from './components/Login.vue'
const routes = [
  {
    path: "/",
    name: "login",
    component: Login
  },
  {
    path: "/main",
    name: "main",
    component: Main
  },
  {
    path: "/setting",
    name: "setting",
    component: Setting
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})