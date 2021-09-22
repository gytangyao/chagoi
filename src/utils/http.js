"use strict";
import axios from "axios";
import { ElMessage, ElLoading } from "element-plus";
import router from "./router";
import store from "../store";

var qs = require("qs");
let baseUrl = "https://api-saas.wemew.cn/";
let client_secret = "windows@2020";

let needLoadingRequestCount = 0;
axios.defaults.baseURL = baseUrl;

export { client_secret };

function tryShowFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
}

function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) {
    return;
  }
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    loading.close();
  }
}

//loading初始化与关闭
let loading = "";
function startLoading() {
  loading = ElLoading.service({
    lock: true,
    customClass: "create-isLoading",
    text: "数据加载中,请稍后..",
    background: "rgba(0, 0, 0, 0)"
  });
}

// axios请求拦截器
axios.interceptors.request.use(
  config => {
    let token = store.getters["memoryCache/accessToken"];
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    if (!config.hidLoading) {
      tryShowFullScreenLoading();
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// axios响应拦截器
axios.interceptors.response.use(
  function(response) {
    tryHideFullScreenLoading();
    if (response.data.responseCode == 200) {
      return response.data;
    } else {
      ElMessage({
        message: response.data.msg || response.data.message,
        type: "error",
        center: true
      });
      return Promise.reject(response.data.message || response.data.msg);
    }
  },
  function(err) {
    tryHideFullScreenLoading();
    if (err) {
      if (err.response) {
        switch (err.response.responseCode || err.response.status) {
          case 400:
            ElMessage({
              message: "请求错误(400)",
              type: "error",
              center: true
            });
            break;
          case 401:
            ElMessage({
              message: "登录过期或在其他端口登录，请重新登录",
              type: "error",
              center: true
            });
            router.push("/");
            break;
          // case 401: ElMessage ({ message: 'token失效，请重新登录(401)', type: 'error', center: true });
          //     window.location.href = "/login?redirect=123";
          // break;
          case 403:
            ElMessage({
              message: "拒绝访问(403)",
              type: "error",
              center: true
            });
            break;
          case 404:
            ElMessage({
              message: "请求出错(404)",
              type: "error",
              center: true
            });
            break;
          case 408:
            ElMessage({
              message: "请求超时(408)",
              type: "error",
              center: true
            });
            break;
          case 500:
            ElMessage({
              message: "服务器错误(500)",
              type: "error",
              center: true
            });
            break;
          case 501:
            ElMessage({
              message: "服务未实现(501)",
              type: "error",
              center: true
            });
            break;
          case 502:
            ElMessage({
              message: "网络错误(502)",
              type: "error",
              center: true
            });
            break;
          case 503:
            ElMessage({
              message: "服务不可用(503)",
              type: "error",
              center: true
            });
            break;
          case 504:
            ElMessage({
              message: "网络超时(504)",
              type: "error",
              center: true
            });
            break;
          case 505:
            ElMessage({
              message: "HTTP版本不受支持(505)",
              type: "error",
              center: true
            });
            break;
          default:
            ElMessage({
              message: `连接出错(${err.response.status})!`,
              type: "error",
              center: true
            });
        }
      } else {
        console.log(err);
        if (err.message.indexOf("请求被中断") !== -1) {
          ElMessage({
            message: "请勿重复请求",
            type: "error",
            center: true
          });
        } else {
          ElMessage({
            message: "接口无返回值",
            type: "error",
            center: true
          });
        }
      }
    } else {
      ElMessage({
        message: "连接服务器失败!",
        type: "error",
        center: true
      });
    }
    return Promise.reject(err);
  }
);

function addPublicData(data) {
  if (data) {
    let userId = store.getters["memoryCache/userId"];
    let sureName = store.getters["memoryCache/sureName"];
    let storeId = store.getters["memoryCache/storeId"];
    let deviceId = store.getters["memoryCache/deviceId"];

    data.apiVersion = "v1";
    data.userid = userId;
    data.sureName = sureName;
    data.storeid = storeId;
    data.storeId = storeId;
    data.deviceId = deviceId;
    data.socketId = deviceId;
  }
  return data;
}

//postUrlEncoded
function postUrlEncoded(url, data, hidLoading) {
  var config = {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    hidLoading: hidLoading
  };
  data = addPublicData(data);
  return axios.post(url, qs.stringify(data), config);
}

//get
function get(url, data, hidLoading) {
  var config = {
    method: "get",
    hidLoading: hidLoading
  };
  data = addPublicData(data);
  return axios.get(url, { params: data }, config);
}

//postRaw
function postRaw(url, data, hidLoading) {
  var config = {
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    hidLoading: hidLoading
  };
  data = addPublicData(data);
  return axios.post(url, data, config);
}

//登录
export function login(data, hidLoading = false) {
  let url = "/chagoi-auth-service/oauth/token";
  return postUrlEncoded(url, data, hidLoading);
}

export function findDeviceUserInfo(data, hidLoading = false) {
  let url = "/chagoi-bar-order/v1/device/findDeviceUserInfo";
  return postUrlEncoded(url, data, hidLoading);
}

export function findOverTablePrinterConfig(data, hidLoading = false) {
  let url = "/chagoi-bar-order/v1/MallPayOrder/findOverTablePrinterConfig";
  return postUrlEncoded(url, data, hidLoading);
}

export function getTableZone(data, hidLoading = false) {
  let url = "/chagoi-bar-order/v1/foodTable/getTableZone";
  return postUrlEncoded(url, data, hidLoading);
}

export function queryWaitTableCall(data, hidLoading = false) {
  let url = "/chagoi-bar-order/customerWait/queryWaitTableCall";
  return get(url, data, hidLoading);
}

export function getAllCommodityType(data, hidLoading = false) {
  let url = "/chagoi-bar-order/v1/CommodityType/getAllCommodityType";
  return postRaw(url, data, hidLoading);
}

export function sendBindCashiercyc(data, hidLoading = false) {
  let url = "/chagoi-bar-order/v1/device/sendBindCashiercyc";
  return postRaw(url, data, hidLoading);
}

export function findMealConfig(data, hidLoading = false) {
  let url = "/chagoi-bar-order/v1/store/findMealConfig";
  return postRaw(url, data, hidLoading);
}

export function findUnComplete(data, hidLoading = false) {
  return postRaw("/chagoi-bar-order/v1/unit/findUnComplete", data, hidLoading);
}

export function queryUserRoles(data, hidLoading = false) {
  return postRaw("/chagoi-bar-order/v1/user/queryUserRoles", data, hidLoading);
}
export function queryBookTable(data, hidLoading = false) {
  return postRaw(
    "/chagoi-bar-order/v1/BookTable/queryBookTable",
    data,
    hidLoading
  );
}

export function routers(data, hidLoading = false) {
  return postUrlEncoded(
    "/chagoi-authority-service/menu/cashier/routers",
    data,
    hidLoading
  );
}

/**
 *  调用navtive库函数
 * @param {*} data
 * @returns
 */
export function invokeNative(data, hidLoading = false) {
  let url = "http://127.0.0.1:7777";
  return postRaw(url, data, hidLoading);
}
