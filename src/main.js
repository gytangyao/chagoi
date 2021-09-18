import { createApp } from "vue";
import App from './App'

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import { router } from "./utils/router"
import store from './store'
import mitt from "mitt"

const app = createApp(App);
app.config.globalProperties.$eventBus = new mitt()
app.use(router);
app.use(store);
app.use(ElementPlus);
app.mount("#app");
