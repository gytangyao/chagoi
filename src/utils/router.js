import { createRouter, createWebHashHistory } from "vue-router"
import Main from '../components/Main.vue'
import store from '../store'

const routes = [
  {
    path: "/",
    name: "splashScreen",
    component: ()=>import('../components/SplashScreen.vue')
  },
  {
    path: "/login",
    name: "login",
    component: ()=>import('../components/Login.vue')
  },
  {
    path: "/main",
    name: "main",
    component: Main,
    children:[
      {
        path: "/setting",
        name: "setting",
        component: ()=>import('../components/Setting.vue')
      },
      {
        path: "/refreshPage",
        name: "refreshPage",
        component:()=>import('../components/RefreshPage.vue')
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