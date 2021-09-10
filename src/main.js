import { createApp } from "vue";
import Login from "./components/Login.vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import { router } from "./router.js"


const app = createApp(Login);
app.use(router);
app.use(ElementPlus);
app.mount("#app");
