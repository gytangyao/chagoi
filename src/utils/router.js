import { createRouter, createWebHashHistory } from "vue-router"
import Main from '../components/Main.vue'
import Setting from '../components/Setting.vue'
import Login from '../components/Login.vue'
import SplashScreen from '../components/SplashScreen.vue'
import RefreshPage from '../components/RefreshPage.vue'
import store from '../store'

const routes = [
  {
    path: "/",
    name: "splashScreen",
    component: SplashScreen
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/main",
    name: "main",
    component: Main,
    children:[
      {
        path: "/setting",
        name: "setting",
        component: Setting
      },
      {
        path: "/refreshPage",
        name: "refreshPage",
        component: RefreshPage
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})
router.beforeEach((to, from, next) => {
  console.log("to:" + to.path)
  console.log("from:" + from.path)
  let token = store.getters['memoryCache/accessToken'];
  if (token || to.path === "/login" || to.path === "/") {
    next();
  } else {
    next("/login");
  }
})

export { router };