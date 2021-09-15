import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus';
import router from './router'


let nativeBaseUrl = 'http://127.0.0.1:7777/';

let baseUrl = 'https://api-saas.wemew.cn/';
let client_secret = 'windows@2020';
//同时发送多次请求处理
let needLoadingRequestCount = 0
axios.defaults.baseURL = baseUrl;


if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://api-saas.wemew.com/'
  client_secret = 'chagoi@2020';
}
if (process.env.NODE_ENV === 'test') {
  baseUrl = 'https://api-saas.wemew.cn/'
}
if (process.env.NODE_ENV === 'release') {
  baseUrl = 'https://test-api-saas.wemew.cn/'
  client_secret = 'chagoi@2020';
}

export {
  client_secret
}



function tryShowFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}
//loading初始化与关闭
let loading = ''
function startLoading() {
  loading = ElLoading.service({
    lock: true,
    customClass: 'create-isLoading',
    text: '数据加载中,请稍后..',
    background: 'rgba(0, 0, 0, 0)'
  })
}

function endLoading() {
  loading.close()
}


// axios请求拦截器
axios.interceptors.request.use((config) => {
  if (localStorage.getItem("toToken")) {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem("toToken");
  }
  if (!config.hidLoading) {
    tryShowFullScreenLoading()
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// axios响应拦截器
axios.interceptors.response.use(function (response) {
  tryHideFullScreenLoading()
  if (response.data.responseCode == 200 || response.config.responseType == 'blob') {
    return response.data;
  } else {
    ElMessage({
      message: response.data.msg || response.data.message,
      type: 'error',
      center: true
    })
    return Promise.reject(response.data.message || response.data.msg);
  }
}, function (err) {
  console.log(err, '**********************err********************')
  tryHideFullScreenLoading()
  if (err) {
    if (err.response) {
      switch (err.response.responseCode || err.response.status) {
        case 400:
          ElMessage({
            message: '请求错误(400)',
            type: 'error',
            center: true
          });
          break;
        case 401:
          ElMessage({
            message: '登录过期或在其他端口登录，请重新登录',
            type: 'error',
            center: true
          });
          router.push('/')
          break;
        // case 401: ElMessage ({ message: 'token失效，请重新登录(401)', type: 'error', center: true }); 
        //     window.location.href = "/login?redirect=123";
        // break;
        case 403:
          ElMessage({
            message: '拒绝访问(403)',
            type: 'error',
            center: true
          });
          break;
        case 404:
          ElMessage({
            message: '请求出错(404)',
            type: 'error',
            center: true
          });
          break;
        case 408:
          ElMessage({
            message: '请求超时(408)',
            type: 'error',
            center: true
          });
          break;
        case 500:
          ElMessage({
            message: '服务器错误(500)',
            type: 'error',
            center: true
          });
          break;
        case 501:
          ElMessage({
            message: '服务未实现(501)',
            type: 'error',
            center: true
          });
          break;
        case 502:
          ElMessage({
            message: '网络错误(502)',
            type: 'error',
            center: true
          });
          break;
        case 503:
          ElMessage({
            message: '服务不可用(503)',
            type: 'error',
            center: true
          });
          break;
        case 504:
          ElMessage({
            message: '网络超时(504)',
            type: 'error',
            center: true
          });
          break;
        case 505:
          ElMessage({
            message: 'HTTP版本不受支持(505)',
            type: 'error',
            center: true
          });
          break;
        default:
          ElMessage({
            message: `连接出错(${err.response.status})!`,
            type: 'error',
            center: true
          });
      }
    } else {
      console.log(err)
      if (err.message.indexOf('请求被中断') !== -1) {
        ElMessage({
          message: '请勿重复请求',
          type: 'error',
          center: true
        });
      } else {
        ElMessage({
          message: '接口无返回值',
          type: 'error',
          center: true
        });
      }
    }
  } else {
    ElMessage({
      message: '连接服务器失败!',
      type: 'error',
      center: true
    });
  }
  return Promise.reject(err);
});


//post QueryString
function apiByPostQueryString(url, data, hidLoading) {
  let params = new URLSearchParams()
  Object.keys(data).forEach(key => {
    params.append(key, data[key])
  })
  let config = {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem("toToken")
    },
    hidLoading: hidLoading
  };
  return axios.post(url, params, config)
}


//登录
export function login(data) {
  return apiByPostQueryString("/chagoi-auth-service/oauth/token", data)
}


export function findDeviceUserInfo(data) {
  return apiByPostQueryString("/chagoi-bar-order/v1/device/findDeviceUserInfo", data)
}

export function sendBindCashiercyc(data) {
  return apiByPostQueryString("/chagoi-bar-order/v1/device/sendBindCashiercyc", data)
}




export function native_QueryDevice(data) {
  return apiByPostQueryString(`${nativeBaseUrl}?action=QueryDevice`, data)
}