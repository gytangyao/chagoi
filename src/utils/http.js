import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus';
import router from '../router'

let baseUrl = 'https://api-saas.wemew.cn/';
let client_secret = '123456';
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
  console.log('response', response)
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
          router.push('/login')
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

//get
function api(url, data, hidLoading) {
  let config = {
    headers: {
      'Content-Type': 'appliction/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + localStorage.getItem("toToken")
    },
    hidLoading: hidLoading
  };
  config.params = data;
  return axios.get(url, config)
}

function apiByGet(url, data) {
  let config = {
    headers: {
      'Content-Type': 'appliction/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + localStorage.getItem("toToken")
    }
  };
  config.params = data;
  return axios.get(url, config)
}

function apiByGetBlob(url, data) {
  let config = {
    headers: {
      'Content-Type': 'appliction/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + localStorage.getItem("toToken"),
    },
    responseType: 'blob'
  };
  config.params = data;
  return axios.get(url, config)
}
//post JSON
function apiByPostJson(url, data) {

  let config = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': 'Bearer ' + localStorage.getItem("toToken")
    }
  };
  return axios.post(url, data, config)
}
//post JSON
function apiByPostJson_hideLoading(url, data) {
  let config = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': 'Bearer ' + localStorage.getItem("toToken")
    },
    hidLoading: true
  };
  return axios.post(url, data, config)
}
//post Blod
function apiByPostBlod(url) {
  let config = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': 'Bearer ' + localStorage.getItem("toToken")
    }
  };
  return axios.post(url, {}, config)
}
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

// 微喵系统后台接口start
// 获取微喵门店列表
export async function selectChannelList(data) {
  return apiByPostQueryString('/chagoi-authority-service/sys-dept/selectChannelList', data)
}
// 获取门店信息
export async function findBarbase(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/barbase/findBarbase', data)
}
// 订座开关
export async function isBookSeat(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/table/isBookSeat', data)
}
// 订座自动确认开关
export async function autoOpenSeat(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/table/autoOpenSeat', data)
}
// 排位开关
export async function updateQueueModel(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/table/updateQueueModel', data)
}
// 可订座时间
export async function updateBookableTime(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/table/updateBookableTime', data)
}
// 可到店时间
export async function updateToshopTime(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/table/updateToshopTime', data)
}
// 更新订座电话
export async function updateBarTel(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/table/updateBarTel', data)
}
// 轮训查询绑定开台信息
export async function loopFindOpenWaiter(data, hidLoading) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/table/loopFindOpenWaiter', data, hidLoading)
}
// 编辑开台人员信息
export async function toBindOpenWaiter(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/table/toBindOpenWaiter', data)
}
// 删除开台人员
export async function delWaiter(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/table/delWaiter', data)
}
// 开台人员列表查询
export async function bookPersonSet(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/table/bookPersonSet', data)
}
// 编辑特惠商品核销人员信息
export async function bindVerifier(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/sale/bindVerifier', data)
}
// 删除特惠商品核销人员
export async function delVerifier(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/sale/delVerifier', data)
}
// 特惠商品核销人员列表查询
export async function verifierList(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/sale/verifierList', data)
}
//参与特惠活动的商品
export async function getSaleGoods(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/sale/saleGoods', data)
}
// 重置特惠商品海报
export async function resetPoster(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/sale/resetPoster', data)
}
// 开台人员操作记录
export async function waiterRecord(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/table/waiterRecord', data)
}
// 获取客户经理列表
export async function generalizeList(data) {
  return api('/chagoi-bar-order/v1/generalize/list', data)
}
// 轮训查询绑定客户经理信息
export async function generalizeLoop(data, hidLoading) {
  return api('/chagoi-bar-order/v1/generalize/loop', data, hidLoading)
}
// 添加客户经理
export async function generalizeAdd(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/generalize/add', data)
}
// 客户经理分销订单列表
export async function generalizeOrderList(data) {
  return api('/chagoi-bar-order/v1/generalize/distribution/order', data)
}
// 更新客户经理
export async function generalizeUpdate(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/generalize/update', data)
}
// 更新客户经理状态
export async function generalizeUpdateStatus(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/generalize/updateStatus', data)
}
// 是否启用客户经理分销
export async function generalizeDistributionStatus(data) {
  return api('/chagoi-bar-order/v1/generalize/distribution/status', data)
}
// 客户经理分销开启与关闭
export async function generalizeDistributionSwitch(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/generalize/distribution/swtich', data)
}
// 分销开关
export async function distributionSwitch(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/distribution/store/switch', data)
}
// 分销开关数据
export async function storeDetail(data) {
  return api('/chagoi-bar-order/v1/distribution/store/detail', data)
}
// 订座订单
export async function orderTableList(data) {
  return api('/chagoi-bar-order/v1/wemewOrder/table', data)
}
// 营销订单
export async function orderMarketingList(data) {
  return api('/chagoi-bar-order/v1/wemewOrder/market', data)
}
// 一元秒杀
// 秒杀时间段获取
export async function secKillTimes(data) {
  return api('/chagoi-bar-order/v1/secKill/times', data)
}
// 添加秒杀商品
export async function secKillAdd(data) {
  return apiByPostJson('/chagoi-bar-order/v1/secKill/add', data)
}
// 秒杀商品列表
export async function secKillGoods(data) {
  return api('/chagoi-bar-order/v1/secKill/goods', data)
}
// 秒杀商品手动下架
export async function secKillSoldOut(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/secKill/soldOut', data)
}
// 更新秒杀商品
export async function secKillUpdate(data) {
  return apiByPostJson('/chagoi-bar-order/v1/secKill/update', data)
}
// 限时特惠
// 限时特惠商品列表 sale/list
export async function saleGoods(data) {
  return api('/chagoi-bar-order/v1/sale/list', data)
}
// 限时特惠商品详情 sale/detail
export async function saleDetail(data) {
  return api('/chagoi-bar-order/v1/sale/detail', data)
}
// 限时特惠商品下架 sale/soldOut
export async function saleSoldOut(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/sale/soldOut', data)
}
// 限时特惠商品编辑 sale/update
export async function saleUpdate(data) {
  return apiByPostJson('/chagoi-bar-order/v1/sale/update', data)
}
// 限时特惠商品添加 sale/add
export async function saleAdd(data) {
  return apiByPostJson('/chagoi-bar-order/v1/sale/add', data)
}
// 核销订单商品列表
export async function writeList(data) {
  return api('/chagoi-bar-order/v1/sale/statisticalData', data)
}
// 点击确认核销按钮进行二次验证
export async function verification(data) {
  return api('/chagoi-bar-order/v1/wemewOrder/checkSaleCode', data)
}
// 点击核销按钮进行一次验证
export async function second(data) {
  return api('/chagoi-bar-order/v1/wemewOrder/checkAuthCode', data)
}
// 营销订单详情
export async function orderDetails(data) {
  return api('/chagoi-bar-order/v1/wemewOrder/sale/detail', data)
}
// 微喵拼桌开关
export async function aboutWine(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/aboutWine/aboutWine', data)
}
// 酒水赠送开关
export async function sendWineSwitch(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/barbase/sendWineSwitch', data)
}
// 获取酒吧开关
export async function getTypeSwitch(data) { //4酒水赠送
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/barbase/getTypeSwitch', data)
}
// 微喵系统后台接口end

// 门店设置start
// 桌台管理

// 获取桌台类型
export async function getShapeList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/foodTable/getShapeList', data)
}
// 分页获取桌台列表
export async function getFoodTableAdminList(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/getFoodTableAdminList', data)
}

// 获取桌台二维码
export async function generatorSeatQrCode(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/generatorSeatQrCode', data)
}

// 桌台置顶
export async function tableStick(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/tableStick', data)
}

// 获取全景桌台信息
export async function getFloorPanoramaAdmin(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/getFloorPanoramaAdmin', data)
}

// 更新楼层背景图
export async function addOrUpdateStoreFloorImg(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/addOrUpdateStoreFloorImg', data)
}

// 删除楼层图片upLoadUrl
export async function delFloorImg(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/delFloorImg', data)
}

// 桌台信息更新
export async function updateTableData(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/updateTableData', data)
}

// 桌台状态更新
export async function updateTableStatus(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/updateTableStatus', data)
}

// 桌台状态更新1
export async function upStop(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/upStop', data)
}
// 桌台信息批量更新
export async function batchUpdate(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/batchUpdate', data)
}

// 新建桌台分区
export async function addTableZone(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/addTableZone', data)
}

// 获取桌台分区 
export async function getStoreZoneList(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/getStoreZoneList', data)
}

// 获取桌台楼层
export async function getFloorList(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/getFloorList', data)
}

// 添加桌台
export async function addFoodTable(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/addFoodTable', data)
}

// 删除桌台
export async function delByFoodTableId(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/delByFoodTableId', data)
}
// 删除桌台
export async function table_clear(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/clearTableUrl', data)
}

// 添加桌台楼层
export async function addFloor(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/addFloor', data)
}
//导入桌台
let table_importCommoditys = baseUrl + 'chagoi-bar-order/v1/foodTable/addFoodExcel';
export {
  table_importCommoditys
}

// 删除楼层
export async function delFloor(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/foodTable/delFloor', data)
}
// 获取门店开关
export async function getStoreSwitchOne(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/store/getStoreSwitchOne', data)
}

// 更新门店开关
export async function updateStoreSwitch(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/store/updateStoreSwitch', data)
}

// 门店设置end
//登录
export function login(data) {
  return apiByPostQueryString("/chagoi-auth-service/oauth/token", data)
}

//修改密码
export function changePwd(data) {
  return apiByPostQueryString("/chagoi-authority-service/sys-user/editPassword ", data)
}

// 获取微喵router
export function getWmrouters() {
  return apiByPostJson('/chagoi-authority-service/menu/meet/routers', '')
}

// 获取saas router
export function getSaasrouters() {
  return apiByPostJson('/chagoi-authority-service/menu/saas/routers', '')
}

// 获取茶理 router
export function getMoverouters() {
  return apiByGet('/chagoi-authority-service/menu/movesaas/routers', '')
}
//获取router
export function getrouters() {
  let systemStatus = localStorage.getItem('systemStatus') || 'sass';
  if (systemStatus == 'sass') {
    return apiByPostJson('/chagoi-authority-service/menu/saas/routers', '')
  } else {
    return apiByPostJson('/chagoi-authority-service/menu/meet/routers', '')
  }
  // return apiByPostJson('/chagoi-authority-service/menu/saas/routers', '')
  //
  // let config = { headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOjIsImNvZGUiOiIyYzVhOTViMS0xNGJkLTQwNDAtOTAxZi0yY2RkMmJmMjhiMzgiLCJ1c2VyX2lkIjoiNzI0MjgxNjc4MDU0MjkzNTA1IiwidXNlcl9uYW1lIjoiYWRtaW4xMjMiLCJzY29wZSI6WyJ3ZWIiXSwiZXhwIjoxNTkyNzk4MDk3LCJhdXRob3JpdGllcyI6WyJzdXBlckFkbWluIiwiU3lzdGVtIl0sImNsaWVudF9pZCI6ImFkbWluIn0.meHDu8Ax-62trh-3jA2WBMnhsiES0cHK35UOTsC9n9M'}};
  // return axios.post('/menu/saas/routers', '', config)
}

//获取角色列表

export async function getPermissionList(data) {
  return apiByPostQueryString('/chagoi-authority-service/sys-role/list', data)
  //     let config = { headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOjIsImNvZGUiOiIyYzVhOTViMS0xNGJkLTQwNDAtOTAxZi0yY2RkMmJmMjhiMzgiLCJ1c2VyX2lkIjoiNzI0MjgxNjc4MDU0MjkzNTA1IiwidXNlcl9uYW1lIjoiYWRtaW4xMjMiLCJzY29wZSI6WyJ3ZWIiXSwiZXhwIjoxNTkyNzk4MDk3LCJhdXRob3JpdGllcyI6WyJzdXBlckFkbWluIiwiU3lzdGVtIl0sImNsaWVudF9pZCI6ImFkbWluIn0.meHDu8Ax-62trh-3jA2WBMnhsiES0cHK35UOTsC9n9M'}};
  //     return axios.post('/sys-role/list', '', config)
}

//获取用户权限
export async function getPermissionListById(data) {
  return apiByPostQueryString('/chagoi-authority-service/menu/listByRoleId', data)
}

//查询用户信息
export async function getUserInfoById(data) {
  return apiByPostQueryString('/chagoi-authority-service/sys-role/getById', data)
}
//查询用户信息
export async function getUserInfoByUserId(data) {
  return api('/chagoi-authority-service/sys-user/getUserInfo', data)
}

//更新权限
export async function editPermissionStatus(data) {
  // let params = new URLSearchParams()
  // Object.keys(data).forEach(key => {
  //     params.append(key, data[key])
  // })
  // let config = { headers: {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOjIsImNvZGUiOiIyYzVhOTViMS0xNGJkLTQwNDAtOTAxZi0yY2RkMmJmMjhiMzgiLCJ1c2VyX2lkIjoiNzI0MjgxNjc4MDU0MjkzNTA1IiwidXNlcl9uYW1lIjoiYWRtaW4xMjMiLCJzY29wZSI6WyJ3ZWIiXSwiZXhwIjoxNTkyNzk4MDk3LCJhdXRob3JpdGllcyI6WyJzdXBlckFkbWluIiwiU3lzdGVtIl0sImNsaWVudF9pZCI6ImFkbWluIn0.meHDu8Ax-62trh-3jA2WBMnhsiES0cHK35UOTsC9n9M'}};
  // return axios.post('/sys-role/editStatus', params, config)
  return apiByPostQueryString('/chagoi-authority-service/sys-role/editStatus', data)
}

//角色归属
export async function getDeptList() {
  // let config = { headers: {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOjIsImNvZGUiOiIyYzVhOTViMS0xNGJkLTQwNDAtOTAxZi0yY2RkMmJmMjhiMzgiLCJ1c2VyX2lkIjoiNzI0MjgxNjc4MDU0MjkzNTA1IiwidXNlcl9uYW1lIjoiYWRtaW4xMjMiLCJzY29wZSI6WyJ3ZWIiXSwiZXhwIjoxNTkyNzk4MDk3LCJhdXRob3JpdGllcyI6WyJzdXBlckFkbWluIiwiU3lzdGVtIl0sImNsaWVudF9pZCI6ImFkbWluIn0.meHDu8Ax-62trh-3jA2WBMnhsiES0cHK35UOTsC9n9M'}};
  // return axios.post('/sys-dept/selectDeptList ', '', config)
  return apiByPostQueryString('/chagoi-authority-service/sys-dept/selectDeptList', '')
}


//新建角色

export async function addrole(data) {
  return apiByPostJson('/chagoi-authority-service/sys-role/add', data)
}

//修改角色
export async function changerole(data) {
  return apiByPostJson('/chagoi-authority-service/sys-role/update', data)
}
//删除角色

export async function delrole(data) {
  return apiByPostQueryString('/chagoi-authority-service/sys-role/delete', data)
}
//编辑角色特殊权限
export async function Specialrole(data) {
  return apiByPostJson('/chagoi-bar-order/giveDiscount/editGiveDiscount', data)
}
//获取角色特殊权限
export async function getSpecialrole(data) {
  return apiByPostJson('/chagoi-bar-order/giveDiscount/giveDiscountInfo', data)
}



//获取门店列表
export async function getStoreList() {
  return apiByPostJson('/chagoi-authority-service/sys-dept/deptList', '')
}

//新加门店
export async function addStore(data) {
  return apiByPostQueryString('/chagoi-authority-service/sys-dept/addStores', data)
}

//修改门店
export async function changeStore(data) {
  return apiByPostQueryString('/chagoi-authority-service/sys-dept/editStore', data)
}

//添加员工
export async function addStaff(data) {
  return apiByPostQueryString('/chagoi-authority-service/sys-user/addSaaSUser', data)
}

//查询员工列表
export async function Stafflist(data) {
  return apiByPostQueryString('/chagoi-authority-service/sys-user/list', data)
}
//查询员工列表
export async function editStaffTable(data) {
  return apiByPostJson('/chagoi-authority-service/sys-user/editTables', data)
}


//停用启用员工
export async function enableStaff(data) {
  return apiByPostQueryString('/chagoi-authority-service/sys-user/editStatus', data)
}
//修改员工

export async function changeStaff(data) {
  return apiByPostQueryString('/chagoi-authority-service/sys-user/update', data)
}

//删除员工
export async function delStaff(data) {
  return apiByPostQueryString('/chagoi-authority-service/sys-user/delete', data)
}


//获取/查询短信列表
export async function smsList(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/SmsAccount/smsList', data)
}

//按门店查询短信充值记录
export async function rechargeInfo(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/SmsAccount/rechargeInfo', data)
}

//按门店查询发送数据
export async function sendMsgInfo(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/SmsAccount/data', data)
}

//按门店查询发送数据
export async function sendMsgDetail(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/SmsAccount/detail', data)
}

//按门店查询发送数据
export async function sendMsgcost(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/SmsAccount/costDetail', data)
}



export async function recharge1(data) {
  return apiByPostJson('/chagoi-bar-order/v1/SmsAccount/recharge', data)
}

//沦轮询充值结果
export async function queryPayStatus(data) {
  return apiByPostJson('/chagoi-bar-order/v1/SmsAccount/queryPayStatus', data)
}


export async function getWxCode(url) {
  return apiByPostBlod('/chagoi-bar-order/weixin/pay/qrcode?text=' + url)
}




// 无用

//获取用户列表
export function getUserList(data) {
  return api("/chagoi-authority-service/pcUserInfo/getUserList", data)
}
// 个人日常列表
export function getDynamic(data) {
  return apiByPostJson("/chagoi-authority-service/appapi/getDynamic", data)
}
// 传多张文件签名
export function getSigns(data) {
  return apiByPostJson("/chagoi-authority-service/appCommon/getSigns", data)
}
/*上传文件  --------------------------------------------------------------------------*/
//获取签名
export function getUploadSign(data) {
  return api("/chagoi-authority-service/pcUpload/getSign", data)
}
//文件上传
export function upload(url, data) {
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  return axios.post(url, data, config)
}
export function uploadNew(url, data) {
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.getItem("toToken")
    },
    hidLoading: true
  };
  return axios.post(url, data, config)
}


//**********菜品Begin****************
//获取登录门店信息
export async function goods_getStores() {
  return apiByPostJson('/chagoi-authority-service/sys-dept/selectDeptList', '')
}
//查询门店商品分类
export async function goods_getClassify(data) {
  return apiByPostJson('/chagoi-bar-order/v1/CommodityType/tofindAllCommidtyType', data)
}
//新增商品分类
export async function goods_addClassify(data) {
  return apiByPostJson('/chagoi-bar-order/v1/CommodityType/toAddCommidtyType', data)
}
//编辑商品分类
export async function goods_editClassify(data) {
  return apiByPostJson('/chagoi-bar-order/v1/CommodityType/toEditCommidtyType', data)
}
//(批量)下发商品分类
export async function goods_toStoreClassify(data) {
  return apiByPostJson('/chagoi-bar-order/v1/CommodityType/gourpPushTypeToStore', data)
}
//门店导入商品分类
export async function goods_storePullCompanyClassify(data) {
  return apiByPostJson('/chagoi-bar-order/v1/CommodityType/storePullGroupType', data)
}
//删除商品分类
export async function goods_delClassify(data) {
  return apiByPostJson('/chagoi-bar-order/v1/CommodityType/delTypes', data)
}
//商品单位查询
export async function goods_getUnit(data) {
  return apiByPostJson('/chagoi-bar-order/v1/unit/listCompeleUnit', data)
}
//门店商品查询
export async function goods_getGoodsList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/getAllCommoditysInfo', data)
}
//新增商品
export async function goods_addGoods(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/toAddMallCommodity', data)
}
//编辑商品
export async function goods_editGoods(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/toEditMallCommodity', data)
}
//门店下拉集团商品
export async function goods_storePullGoods(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/storePullMall', data)
}
//集团下发商品到门店
export async function goods_companyGoodsTostore(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/groupPushMallToStore', data)
}
//停售、启售商品
export async function goods_stopSell(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/stopMallSale', data)
}
//估清商品
export async function goods_setSellOver(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/makeMallToEmpty', data)
}
//销售设置:获取列表
export async function goods_querySaleManageList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/mallSale/querySaleManageList', data)
}
//销售设置:批量修改
export async function goods_updateSaleManage(data) {
  return apiByPostJson('/chagoi-bar-order/v1/mallSale/updateSaleManage', data)
}
//库存设置:库存设置查询
export async function goods_findMallThreshold(data) {
  return apiByGet('/chagoi-bar-order/v1/mallThreshold/findMallThreshold', data)
}
//库存设置:库存设置修改
export async function goods_updateMallThreshold(data) {
  return apiByPostJson('/chagoi-bar-order/v1/mallThreshold/updateMallThreshold', data)
}
//库存设置:获取父级id
export async function goods_getParenStoreid(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/getParenStoreid', data)
}
//导出商品
export async function goods_exportCommoditys(data) {
  return apiByPostJson_hideLoading('/chagoi-bar-order/v1/MallCommodity/exportCommoditys', data)
}
//导入商品
let goods_importCommoditys = baseUrl + 'chagoi-bar-order/v1/File/importCommoditys';
export {
  goods_importCommoditys
}

//获取导入商品模板
export async function goods_importTemplate(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/importTemplate', data)
}

//删除商品
export async function goods_delMoreCommoditys(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/delMoreCommoditys', data)
}
//删除计量单位分类
export async function goods_delUnitOne(data) {
  return apiByPostJson('/chagoi-bar-order/v1/unit/delUnitOne', data)
}


//**********菜品End******************

//**********套餐 ************
//添加酒水套餐
export async function meals_addMeals(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/add', data)
}
//编辑酒水套餐
export async function meals_editMeals(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/edit', data)
}
//查询所有套餐
export async function meals_showAllMeals(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/showAll', data)
}
//指定删除多个酒水套餐
export async function meals_delMoreMeals(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/delMore', data)
}
//上架指定套餐
export async function meals_offAndUpMeals(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/offAndUp', data)
}
//查询套餐详情
export async function meals_showDetails(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/showDetails', data)
}
//根据名字模糊查询套餐
export async function meals_lookFor(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/lookFor', data);
}
//新增单位
export async function goods_unitAdd(data) {
  return apiByPostJson('/chagoi-bar-order/v1/unit/addUnit', data)
}
//编辑单位
export async function goods_unitEdit(data) {
  return apiByPostJson('/chagoi-bar-order/v1/unit/updateUnit', data)
}
//**********菜品End******************

//**************设备管理Begin*************
//查询收银台设备
export async function device_getCashier(data) {
  return apiByPostJson('/chagoi-bar-order/v1/device/findCashierList', data)
}
//添加收银台设备
export async function device_addCashier(data) {
  return apiByPostJson('/chagoi-bar-order/v1/device/addSaasCashier', data)
}
//编辑收银台设备
export async function device_editCashier(data) {
  return apiByPostJson('/chagoi-bar-order/v1/device/editSaasCashier', data)
}
//删除收银台设备
export async function device_delCashier(data) {
  return apiByPostJson('/chagoi-bar-order/v1/device/delMoreCashier', data)
}
//查询打印机设备
export async function device_getPrinter(data) {
  return apiByPostJson('/chagoi-bar-order/v1/device/findPrinterList', data)
}
//添加打印机设备
export async function device_addPrinter(data) {
  return apiByPostJson('/chagoi-bar-order/v1/device/addSaasPrinter', data)
}
//编辑打印机设备
export async function device_editPrinter(data) {
  return apiByPostJson('/chagoi-bar-order/v1/device/editSaasPrinter', data)
}
//删除打印机设备
export async function device_delPrinter(data) {
  return apiByPostJson('/chagoi-bar-order/v1/device/delMorePrinter', data)
}
//查询打印机参数
export async function device_searchPrinterPa(data) {
  return apiByPostJson('/chagoi-bar-order/v1/device/findPrintParam', data)
}
//打印机绑定菜品分类
export async function device_printerBindCla(data) {
  return apiByPostJson('/chagoi-bar-order/v1/device/printerBindType', data)
}
//打印机绑定菜品分类
export async function device_findGobindInfo(data) {
  return apiByPostJson('/chagoi-bar-order/v1/device/findGobindInfo', data)
}
//接受设备绑定
export async function device_goBindCashierDevice(data) {
  return apiByPostJson('/chagoi-bar-order/v1/device/goBindCashierDevice', data)
}
// 查看设备关联桌台
export async function getDeviceTable(data) {
  return apiByGet('/chagoi-bar-order/v1/device/getShowFoodTable', data)
}
// 更改设备关联桌台
export async function setDeviceTable(data) {
  return apiByPostJson('/chagoi-bar-order/v1/device/buildShowFoodTable', data)
}
//**************设备管理End***************

//************存取酒Begin****************
//回库明细
export async function saveWine_returnStorageDetail(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/retunStorageDetailSaas', data)
}
//作废(过期)报表
export async function saveWine_expireRecord(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/expireRecordSaas', data)
}
// 一键回库操作
export async function expireHandle(data) {
  return apiByGet('/chagoi-bar-order/v1/drinkStorage/wemew/expireHandle', data)
}
// 回库报表
export async function expireHandleRecord(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/expireHandleRecord ', data)
}
//酒卡号报表
export async function saveWine_cardRecord(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/saveListSaas', data)
}
//库存汇总报表
export async function saveWine_summaryRecord(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/groupSummaryReportSaas', data)
  // return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/groupSummaryReportSplitSaas', data)
}
//库存汇总明细报表
export async function saveWine_summaryDetail(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/groupSummaryDetailReportSaas', data)
  // return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/groupSummaryDetailReportSaasSplit', data)
}
//顾客库存报表
export async function saveWine_customerRecord(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/groupCustomerReportSaas', data)
  // return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/groupCustomerReportSaasSplit', data)
}
//跨店取酒报表
export async function saveWine_crossGetWine(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/groupGrossReportSaas', data)
}
//存取酒明细报表
export async function saveWine_wineDetail(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/groupaAcessDetailSaas', data)
}
//导出：存取酒报表导出
export async function saveWine_exportTab(data) {
  return apiByPostJson('/chagoi-bar-order/v1/Export/submitSaas', data)
}
//下载：存取酒报表下载
export async function saveWine_downLoadTab(data) {
  return apiByPostJson_hideLoading('/chagoi-bar-order/v1/Export/downURL', data)
}
//存取酒客户信息
export async function saveWine_findCusInfo(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/findCusInfo', data)
}
//存取酒客户数量
export async function saveWine_findCusNum(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/findCusNum', data)
}
//根据手机号码查询用户存取酒记录
export async function saveWine_findDetailByPhone(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/findDetailByPhone', data)
}
//根据延期
export async function saveWine_delay(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/delay', data)
}
//查询门店
export async function saveWine_findStoreBusinessTime(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/findStoreBusinessTime', data)
}
//************存取酒End******************

//************门店列表Begin****************
//门店设置：点餐设置
export async function setMeal_savePage(data) {
  return apiByPostJson('/chagoi-bar-order/v1/store/confStoredMall', data)
}
export async function setMeal_findMealConfig(data) {
  return apiByPostJson('/chagoi-bar-order/v1/store/findMealConfig', data)
}
//************门店列表End******************
// ***********商品打折设置*****************
//获取打折方案列表
export async function goodsDiscount_getList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/CommoditySetting/findSalePlanList', data)
}
//添加打折方案
export async function goodsDiscount_add(data) {
  return apiByPostJson('/chagoi-bar-order/v1/CommoditySetting/addSalePlan', data)
}
//删除打折方案
export async function goodsDiscount_del(data) {
  return apiByPostJson('/chagoi-bar-order/v1/CommoditySetting/delSalePlan', data)
}
//启停打折方案
export async function goodsDiscount_upAndDown(data) {
  return apiByPostJson('/chagoi-bar-order/v1/CommoditySetting/changeSalePlanStatus', data)
}
//编辑打折方案
export async function goodsDiscount_edit(data) {
  return apiByPostJson('/chagoi-bar-order/v1/CommoditySetting/editSalePlan', data)
}

//************订单Begin****************
//门店设置：点餐设置
export async function order_getList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallPayOrder/mealOrderList', data)
}

export async function order_export(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallPayOrder/exportMealOrder', data)
}
//************订单End******************

//************仓库Begin****************
//仓库列表
export async function storehouse_getList(data) {
  return apiByGet('/chagoi-bar-order/v1/mallStorege/queryStoreList', data)
}
//新增出入库
export async function storehouse_addStock(data) {
  return apiByPostJson('/chagoi-bar-order/v1/mallStorege/addStock', data)
}
//出入库查询
export async function storehouse_queryStockList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/mallStorege/queryStockList', data)
}
// 改变出入库信息的状态
export async function updateCheckState(data) {
  return apiByPostJson('/chagoi-bar-order/v1/mallStorege/updateCheckState', data)
}
// 重新编辑出入库信息
export async function updateCheckStorage(data) {
  return apiByPostJson('/chagoi-bar-order/v1/mallStorege/updateCheckStorage', data)
}

//查询所有类型
export async function storehouse_queryAllType(data) {
  return apiByGet('/chagoi-bar-order/v1/mallStorege/queryAllType', data)
}
//查询库存
export async function storehouse_queryRepositoryList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/mallStorege/queryRepositoryList', data)
}
// 删除库存
export async function deleteRepository(data) {
  return apiByGet('/chagoi-bar-order/v1/mallStorege/deleteRepository', data)
}
//新增仓库
export async function storehouse_addStorage(data) {
  return apiByPostJson('/chagoi-bar-order/v1/mallStorege/addStorage', data)
}
//修改仓库
export async function storehouse_updateStorage(data) {
  return apiByPostJson('/chagoi-bar-order/v1/mallStorege/updateStorage', data)
}
//修改状态
export async function storehouse_updateStatus(data) {
  return apiByGet('/chagoi-bar-order/v1/mallStorege/updateStatus', data)
}
//出入库明细查询
export async function storehouse_queryStorageDetailList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/mallStorege/queryStorageDetailList', data)
}
//新增类型
export async function storehouse_addType(data) {
  return apiByPostJson('/chagoi-bar-order/v1/mallStorege/addType', data)
}

//************仓库End******************

//************会员开始 ******************/
//获取会员列表
export async function merber_getMerList(data) {
  return apiByPostJson('/chagoi-bar-order/member/list', data)
}
//修改会员状态
export async function merber_changeMerStatus(data) {
  return apiByPostJson('/chagoi-bar-order/member/editStatus', data)
}
//获取会员等级列表
export async function merber_getMerLevelList(data) {
  return apiByPostJson('/chagoi-bar-order/member/level/list', data)
}
//添加会员等级
export async function merber_addMerLevel(data) {
  return apiByPostJson('/chagoi-bar-order/member/level/add', data)
}
//删除选择会员等级
export async function merber_adelMerLevel(data) {
  return apiByPostJson('/chagoi-bar-order/member/level/delete', data)
}
//修改会员等级信息
export async function merber_editMerLevel(data) {
  return apiByPostJson('/chagoi-bar-order/member/level/update', data)
}
//获取已设置会员等级列表
export async function merber_getMerLevel(data) {
  return apiByPostJson('/chagoi-bar-order/member/level/selectLevel', data)
}
//修改会员等级启停状态
export async function merber_MerLevelStatus(data) {
  return apiByPostJson('/chagoi-bar-order/member/level/editStatus', data)
}
// 查询菜单路由信息
export async function menu_routers(data) {
  return apiByPostJson('/chagoi-authority-service/menu/cashier/routers', data)
}
//会员升级规则设置
export async function merber_upRules(data) {
  return apiByPostJson('/chagoi-bar-order/member/level/editUpgradeRule', data)
}
//会员等级规则列表
export async function merber_levelAndRules(data) {
  return apiByPostJson('/chagoi-bar-order/member/level/getUpgradeRule', data)
}
//获取会员降级规则
export async function merber_getLevelDoenRules(data) {
  return apiByPostJson('/chagoi-bar-order/member/level/getDowngradeRule', data)
}
//编辑会员降级规则
export async function merber_EditLevelDoenRules(data) {
  return apiByPostJson('/chagoi-bar-order/member/level/editDowngradeRule', data)
}
//获取会员积分规则
export async function merber_getMer_intarge_Rules(data) {
  return apiByPostJson('/chagoi-bar-order/member/integral/getRule', data)
}
//编辑会员积分规则
export async function merber_editMer_intarge_Rules(data) {
  return apiByPostJson('/chagoi-bar-order/member/integral/editRule', data)
}
//获取会员抵现规则
export async function merber_getMer_back_Rules(data) {
  return apiByPostJson('/chagoi-bar-order/member/integral/cashOut/cashOutRule', data)
}
//编辑会员抵现规则
export async function merber_editMer_back_Rules(data) {
  return apiByPostJson('/chagoi-bar-order/member/integral/cashOut/editCashOutRule', data)
}
//获取会员积分清零规则
export async function merber_getMer_clear_Rules(data) {
  return apiByPostJson('/chagoi-bar-order/member/integral/getClearRule', data)
}
//编辑会员积分清零规则
export async function merber_editMer_clear_Rules(data) {
  return apiByPostJson('/chagoi-bar-order/member/integral/editClearRule', data)
}

//编辑会员积分兑换规则
export async function merber_editMer_exchange_Rules(data) {
  return apiByPostJson('/chagoi-bar-order/member/integral/editExchangeRule', data)
}
//获取储值规则
export async function merber_getMer_gift_Rules(data) {
  return apiByPostJson('/chagoi-bar-order/member/recharge/gift/getRule', data)
}

//编辑储值规则
export async function merber_editMer_gift_Rules(data) {
  return apiByPostJson('/chagoi-bar-order/member/recharge/gift/editRule', data)
}
//获取会员日
export async function merber_getMer_day(data) {
  return apiByPostJson('/chagoi-bar-order/member/day/getMemberDay', data)
}

//编辑会员日
export async function merber_editMer_day(data) {
  return apiByPostJson('/chagoi-bar-order/member/day/edit', data)
}
//获取会员价格规则
export async function merber_getMer_price(data) {
  return apiByPostJson('/chagoi-bar-order/member/price/getMemberPrice', data)
}
//编辑会员价格规则
export async function merber_editMer_price(data) {
  return apiByPostJson('/chagoi-bar-order/member/price/editMemberPrice', data)
}
//会员充值消费记录查询
export async function merber_getMer_rechargeRecord(data) {
  return apiByPostJson('/chagoi-bar-order/member/accountRecord', data)
}
//会员列表导出
export async function merber_export_merberList(data) {
  return apiByPostJson('/chagoi-bar-order/member/export', data)
}
//获取会员导入模板
export async function merber_import_merberListM(data) {
  return apiByGet('/chagoi-bar-order/v1/member/importTemplate', data)
}
// 会员充值前的sign
export async function memberRechargeSign(data) {
  return apiByPostJson('/chagoi-bar-order/member/cashRecharge', data)
}
// 会员充值
export async function memberRecharge(data) {
  return apiByPostJson('/chagoi-bar-order/member/backRecharge', data)
}
// 会员退费
export async function memberRefund(data) {
  return apiByPostJson('/chagoi-bar-order/member/subtractBalance', data)
}
//会员列表导入
let merber_import_merberList = baseUrl + 'chagoi-bar-order/v1/File/importMemberList';
export {
  merber_import_merberList
}

//********  工作人员操作  ********* */
//手机号查询门店
export async function user_searchStore(data) {
  return apiByPostJson('/chagoi-bar-order/v1/superAdmin/findBarbaseOpenFunc', data)
}
//修改状态/v1/superAdmin/openListFunc
export async function user_changeStatus(data) {
  return apiByPostJson('/chagoi-bar-order/v1/superAdmin/openListFunc', data)
}

/**********商品id查询酒饭市价格*********** */

export async function goods_getPrice(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/findWinesPriceDis', data)
}



//*******提成管理begin************
//提成管理列表查询
export async function commission_queryCommissionList(data) {
  return apiByGet('/chagoi-bar-order/v1/commission/queryCommissionList', data)
}
//新增提成
export async function commission_addCommission(data) {
  return apiByPostJson('/chagoi-bar-order/v1/commission/addCommission', data)
}
//编辑提成
export async function commission_updateCommission(data) {
  return apiByPostJson('/chagoi-bar-order/v1/commission/updateCommission', data)
}
//删除提成
export async function commission_deleteCommission(data) {
  return apiByGet('/chagoi-bar-order/v1/commission/deleteCommission', data)
}
//查询提成详情
export async function commission_queryCommissionDetail(data) {
  return apiByGet('/chagoi-bar-order/v1/commission/queryCommissionDetail', data)
}
//启用提成
export async function commission_updateState(data) {
  return apiByGet('/chagoi-bar-order/v1/commission/updateState', data)
}
//查询提成报表
export async function commissionReport_queryReport(data) {
  return apiByGet('/chagoi-bar-order/v1/commissionReport/queryReport', data)
}
//查询提成报表详情
export async function commissionReport_queryReportDetail(data) {
  return apiByGet('/chagoi-bar-order/v1/commissionReport/queryReportDetail', data)
}

//*******提成管理end************

/*************绩效管理 ******************** */
//编辑绩效方案
export async function performance_edit(data) {
  return apiByPostJson('/chagoi-bar-order/performance/edit', data)
}
//查询绩效方案
export async function performance_list(data) {
  return apiByPostJson('/chagoi-bar-order/performance/list', data)
}
//绩效状态
export async function performance_editStatus(data) {
  return apiByPostJson('/chagoi-bar-order/performance/editStatus', data)
}
//单个绩效方案信息
export async function performance_info(data) {
  return apiByPostJson('/chagoi-bar-order/performance/info', data)
}
//删除绩效方案
export async function performance_del(data) {
  return apiByPostJson('/chagoi-bar-order/performance/delete', data)
}
//绩效报表
export async function performance_report(data) {
  return apiByPostJson('/chagoi-bar-order/performance/report', data)
}
//导出绩效报表/performance/export
export async function performance_report_export(data) {
  return apiByPostJson('/chagoi-bar-order/performance/export', data)
}
//查看绩效明细/performance/performanceReportDetail

export async function performance_report_Detail(data) {
  return apiByPostJson('/chagoi-bar-order/performance/performanceReportDetail', data)
}


//收款统计报表
export async function report_collectionStatistics(data) {
  return apiByPostJson('/chagoi-bar-order/v1/SettleBill/collectionStatisticsReport', data)
}
//收款统计支付明细
export async function report_findCollectDetais(data) {
  return apiByPostJson('/chagoi-bar-order/v1/SettleBill/findCollectDetais', data)
}
//导出收款统计报表
export async function report_exportCollectDetails(data) {
  return apiByPostJson_hideLoading('/chagoi-bar-order/v1/SettleBill/exportCollectDetails', data)
}
/**微信公众号 */
//获取当前门店是否获取授权
export async function wechat_authLoop(data) {
  return api('/chagoi-bar-order/wx/auth/loop', data, true)
}
//获取当前门店是否获取授权
export async function wechat_wxGetCodeUrl(data) {
  return apiByPostJson('/chagoi-bar-order/wx/component/' + data.storeId + '/qrCode')
}
//获取粉丝列表
export async function wechat_fansList(data) {
  return apiByPostJson('/chagoi-bar-order/wx/fans', data)
}
//查询所有菜单
export async function wechat_queryMenus(data) {
  return apiByGet('/chagoi-bar-order/wx/queryMenus?storeId=' + data.storeId)
}
//保存所有菜单
export async function wechat_addMenu(data) {
  return apiByPostJson('/chagoi-bar-order/wx/addMenu?storeId=' + data.storeId, data)
}
//获取关注回复消息
export async function wechat_getAttention(data) {
  return apiByGet('/chagoi-bar-order/wx/subscribe/msg?storeId=' + data.storeId)
}
//更新关注回复消息
export async function wechat_setAttention(data) {
  return apiByPostJson('/chagoi-bar-order/wx/subscribe/msg?storeId=' + data.storeId, data)
}
//获取自动回复消息
export async function wechat_getInfo(data) {
  return apiByGet('/chagoi-bar-order/wx/info/msg?storeId=' + data.storeId)
}
//更新自动回复消息
export async function wechat_setInfo(data) {
  return apiByPostJson('/chagoi-bar-order/wx/info/msg?storeId=' + data.storeId, data)
}
//获取关键字回复消息
export async function wechat_getKeywords(data) {
  return apiByGet('/chagoi-bar-order/wx/keyword/msg/?storeId=' + data.storeId)
}
//更新关键字回复消息(删除)
export async function wechat_setKeywords(data) {
  return apiByPostJson('/chagoi-bar-order/wx/keyword/msg?storeId=' + data.storeId, data)
}
//获取点餐二维码
export async function wechat_queryCode(data) {
  return apiByPostJson('/chagoi-bar-order/wx/key/qrcode/?storeId=' + data.storeId, data)
}

//商品销售报表--查列表
export async function report_queryMallSaleReport(data) {
  return apiByGet('/chagoi-bar-order/v1/mallSale/queryMallSaleReport', data)
}
//商品销售报表--查特殊数据
export async function report_queryMallSaleTotal(data) {
  return apiByGet('/chagoi-bar-order/v1/mallSale/queryMallSaleTotal', data)
}
//商品销售报表--详情
export async function report_queryMallSaleDetail(data) {
  return apiByGet('/chagoi-bar-order/v1/mallSale/queryMallSaleDetail', data)
}
//商品销售报表--详情
export async function report_exportMallSaleDetail(data) {
  return apiByGet('/chagoi-bar-order/v1/mallSale/exportMallSaleDetail', data)
}
//仓库明细导出
export async function storeHouse_exportInAndOutDetail(data) {
  return apiByPostJson('/chagoi-bar-order/v1/mallStorege/exportStorageDetailList', data)
}
//仓库列表导出
export async function storeHouse_exportStoreList(data) {
  return apiByGet('/chagoi-bar-order/v1/mallStorege/exportStoreList', data)
}

//导出作废报表
export async function report_exportExpireRecord(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/exportExpireRecord', data)
}
// 导出回库报表
export async function report_exportBackStore(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/expireHandleRecordExcel', data)
}
//订单统计报表
export async function report_orderReport(data) {
  return apiByGet('/chagoi-bar-order/v1/reports/orderReport', data)
}
//订单统计报表 统计总数
export async function report_orderReportTotal(data) {
  return apiByGet('/chagoi-bar-order/v1/reports/orderReportTotal', data)
}
//订单统计导出Excel
export async function report_orderReportExportExcel(data) {
  return apiByGet('/chagoi-bar-order/v1/reports/orderReportExportExcel', data)
}

//查询班次信息
export async function SettleBill_queryBillForWeb(data) {
  return apiByGet('/chagoi-bar-order/v1/SettleBill/queryBillForWeb', data)
}
//导出班次信息
export async function SettleBill_exportSettleBill(data) {
  return apiByGet('/chagoi-bar-order/v1/SettleBill/queryBillForWebDownload', data)
}
//查看班次详情
export async function SettleBill_queryBillDetail(data) {
  return apiByGet('/chagoi-bar-order/v1/SettleBill/queryBillDetailForWeb', data)
}
//查询多单位
export async function unit_findMoreUnitList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/unit/findMoreUnitList', data)
}
//导出库存
export async function mallStorege_exportRepositoryList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/mallStorege/exportRepositoryList', data)
}
//获取排队桌台列表/customerWait/tableTypeList
export async function customerWait_tableTypeList(data) {
  return apiByGet('/chagoi-bar-order/customerWait/tableTypeList', data)
}
//创建排队桌台/customerWait/createTableType
export async function customerWait_createTableType(data) {
  return apiByPostJson('/chagoi-bar-order/customerWait/createTableType', data)
}
//删除排队桌台/customerWait/deleteTableType
export async function customerWait_deleteTableType(data) {
  return apiByPostJson('/chagoi-bar-order/customerWait/deleteTableType', data)
}
//获取会员积分兑换规则
export async function merber_getMer_exchange_Rules(data) {
  return apiByPostJson('/chagoi-bar-order/member/integral/getExchangeRule', data)
}

//赠送统计报表
export async function giveDiscount_giveReport(data) {
  return apiByPostJson('/chagoi-bar-order/giveDiscount/giveReport', data)
}

//赠送详情
export async function giveDiscount_giveDetailReport(data) {
  return apiByPostJson('/chagoi-bar-order/giveDiscount/giveDetailReport', data)
}
//导出赠送详情
export async function giveDiscount_exportGiveDetailReport(data) {
  return apiByPostJson('/chagoi-bar-order/giveDiscount/exportGiveDetailReport', data)
}
// 导出赠送报表
export async function giveDiscount_exportGiveReport(data) {
  return apiByPostJson('/chagoi-bar-order/giveDiscount/exportGiveReport', data)
}

// 折扣报表
export async function giveDiscount_discountReport(data) {
  return apiByPostJson('/chagoi-bar-order/giveDiscount/discountReport', data)
}
// 折扣详情报表
export async function giveDiscount_discountDetailReport(data) {
  return apiByPostJson('/chagoi-bar-order/giveDiscount/discountDetailReport', data)
}
// 导出折扣报表
export async function giveDiscount_exportDiscountReport(data) {
  return apiByPostJson('/chagoi-bar-order/giveDiscount/exportDiscountReport', data)
}
// 导出折扣详情
export async function giveDiscount_exportDiscountDetailReport(data) {
  return apiByPostJson('/chagoi-bar-order/giveDiscount/exportDiscountDetailReport', data)
}

// 套餐销售报表
export async function setMeal_setMealReport(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/setMealReport', data)
}
// 套餐内商品报表
export async function setMeal_setMealCommodityReport(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/setMealCommodityReport', data)
}
// 导出套餐销售报表
export async function setMeal_exportSetMealReport(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/exportSetMealReport', data)
}
// 导出套餐内商品报表
export async function setMeal_exportSetMealCommodityReport(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/exportSetMealCommodityReport', data)
}

// 所有套餐内商品报表
export async function setMeal_allSetMealCommodityReport(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/allSetMealCommodityReport', data)
}
// 导出所有套餐内商品报表
export async function setMeal_exportAllSetMealCommodityReport(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/exportAllSetMealCommodityReport', data)
}

//***优惠券begin***
//新增优惠券
export async function couponSaas_create(data) {
  return apiByPostJson('/chagoi-bar-order/v1/couponSaas/create', data)
}
//更新优惠券
export async function couponSaas_update(data) {
  return apiByPostJson('/chagoi-bar-order/v1/couponSaas/update', data)
}
//优惠券列表
export async function couponSaas_list(data) {
  return apiByGet('/chagoi-bar-order/v1/couponSaas/list', data)
}
//停用优惠券
export async function couponSaas_stop(data) {
  return apiByPostJson('/chagoi-bar-order/v1/couponSaas/stop', data)
}
//启用优惠券
export async function couponSaas_start(data) {
  return apiByPostJson('/chagoi-bar-order/v1/couponSaas/start', data)
}
//优惠券详情
export async function couponSaas_detail(data) {
  return apiByGet('/chagoi-bar-order/v1/couponSaas/detail', data)
}
//删除优惠券
export async function couponSaas_delete(data) {
  return apiByPostJson('/chagoi-bar-order/v1/couponSaas/delete', data)
}
//优惠券相关菜品
export async function couponSaas_mapCommodity(data) {
  return apiByPostJson('/chagoi-bar-order/v1/couponSaas/mapCommodity', data)
}
//投放优惠券
export async function couponSaas_distribute(data) {
  return apiByPostJson('/chagoi-bar-order/v1/couponSaas/distribute', data)
}
//获取消费设置
export async function consume_info(data) {
  return apiByPostJson('/chagoi-bar-order/member/consume/info', data)
}
//编辑消费设置
export async function consume_edit(data) {
  return apiByPostJson('/chagoi-bar-order/member/consume/edit', data)
}

//***优惠券end***

//***********会员充值begin**********
//获取会员充值赠送规则配置
export async function member_getRule(data) {
  return apiByPostJson('/chagoi-bar-order/member/recharge/gift/getRule', data)
}
//编辑会员充值赠送规则
export async function member_editRule(data) {
  return apiByPostJson('/chagoi-bar-order/member/recharge/gift/editRule', data)
}
//***********会员充值End************

//************新会员招募begin****************
//新会员招募：查询
export async function couponSaasRegisterGive_queryCouponGiveList(data) {
  return apiByGet('/chagoi-bar-order/v1/couponSaasRegisterGive/queryCouponGiveList', data)
}
//新会员招募：新增
export async function couponSaasRegisterGive_addCouponGive(data) {
  return apiByPostJson('/chagoi-bar-order/v1/couponSaasRegisterGive/addCouponGive', data)
}
//新会员招募：修改
export async function couponSaasRegisterGive_updateCouponGive(data) {
  return apiByPostJson('/chagoi-bar-order/v1/couponSaasRegisterGive/updateCouponGive', data)
}
//新会员招募：修改状态
export async function couponSaasRegisterGive_updateStatus(data) {
  return apiByGet('/chagoi-bar-order/v1/couponSaasRegisterGive/updateStatus', data)
}
//************新会员招募end******************
//商品订单促销分页查询
export async function market_get(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodityPromotion/getList', data)
}
//商品订单促销新增修改
export async function market_AddEdit(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodityPromotion/addPromotion', data)
}
//商品订单促销详情查询
export async function market_getDetail(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodityPromotion/promotionInfo', data)
}
//商品订单促销禁用启用删除
export async function market_status(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodityPromotion/stopPromotion', data)
}
//查询多单位商品
export async function goods_findMoreGoodsList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/getAllCommoditysPublic', data)
}

/**会员例送****************** */
//查询会员例送列表
export async function memberShip_getList(data) {
  return apiByGet('/chagoi-bar-order/v1/couponSaasGive/queryCouponGiveList', data)
}
//添加
export async function memberShip_Add(data) {
  return apiByPostJson('/chagoi-bar-order/v1/couponSaasGive/addCouponGive', data)
}
//编辑
export async function memberShip_update(data) {
  return apiByPostJson('/chagoi-bar-order/v1/couponSaasGive/updateCouponGive', data)
}
//启停
export async function memberShip_status(data) {
  return apiByGet('/chagoi-bar-order/v1/couponSaasGive/updateStatus', data)
}
//获取优惠券列表
export async function memberShip_getCouponSaas(data) {
  return apiByGet('/chagoi-bar-order/v1/couponSaas/list', data)
}

//**提成报表-储值提成begin**
//会员充值提成明细
export async function commissionReport_queryRechargeReportDetail(data) {
  return apiByGet('/chagoi-bar-order/v1/commissionReport/queryRechargeReportDetail', data)
}
//会员充值提成明细 【导出】
export async function commissionReport_exportRechargeReportDetailExcel(data) {
  return apiByGet('/chagoi-bar-order/v1/commissionReport/exportRechargeReportDetailExcel', data)
}
//**提成报表-储值提成end**
//***商品推荐设置begin***
//查询推荐配置
export async function recommendSet_queryList(data) {
  return apiByGet('/chagoi-bar-order/v1/recommendSet/queryList', data)
}
//新增配置
export async function recommendSet_addRecommendSet(data) {
  return apiByPostJson('/chagoi-bar-order/v1/recommendSet/addRecommendSet', data)
}
//编辑配置
export async function recommendSet_updateRecommendSet(data) {
  return apiByPostJson('/chagoi-bar-order/v1/recommendSet/updateRecommendSet', data)
}
//删除配置
export async function recommendSet_deleteSet(data) {
  return apiByGet('/chagoi-bar-order/v1/recommendSet/deleteSet', data)
}
//配置商品
export async function recommendSet_configMall(data) {
  return apiByPostJson('/chagoi-bar-order/v1/recommendSet/configMall', data)
}
//查看配置
export async function recommendSet_queryConfig(data) {
  return apiByGet('/chagoi-bar-order/v1/recommendSet/queryConfig', data)
}
//查询多单位商品
export async function recommendSet_goods_findMoreGoodsList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/getAllCommoditysPublic', data)
}
//***商品推荐设置end***
//**新增几个导出begin**
//订单统计报表弹窗详情导出
export async function reports_orderReportDetailExport(data) {
  return apiByGet('/chagoi-bar-order/v1/reports/orderReportDetailExport', data)
}
//提成报表整体导出
export async function commissionReport_reportExcel(data) {
  return apiByGet('/chagoi-bar-order/v1/commissionReport/reportExcel', data)
}
//提成报表弹窗详情导出
export async function commissionReport_reportDetailExcel(data) {
  return apiByGet('/chagoi-bar-order/v1/commissionReport/reportDetailExcel', data)
}
//提成报表弹窗详情导出
export async function performance_performanceReportDetailExport(data) {
  return apiByPostJson('/chagoi-bar-order/performance/performanceReportDetailExport', data)
}
//**新增几个导出end**
/**首单特惠 */
//查询列表/v1/firstOrderDiscount/queryList
export async function firstOrderDiscount_queryList(data) {
  return apiByGet('/chagoi-bar-order/v1/firstOrderDiscount/queryList', data)
}
//新增首单特惠/v1/firstOrderDiscount/addOrderDiscount
export async function firstOrderDiscount_addOrderDiscount(data) {
  return apiByPostJson('/chagoi-bar-order/v1/firstOrderDiscount/addOrderDiscount', data)
}
//编辑首单特惠/v1/firstOrderDiscount/updateOrderDiscount
export async function firstOrderDiscount_updateOrderDiscount(data) {
  return apiByPostJson('/chagoi-bar-order/v1/firstOrderDiscount/updateOrderDiscount', data)
}
//查看详情/v1/firstOrderDiscount/queryDetail
export async function firstOrderDiscount_queryDetail(data) {
  return apiByGet('/chagoi-bar-order/v1/firstOrderDiscount/queryDetail', data)
}
//修改状态/v1/firstOrderDiscount/updateStatus
export async function firstOrderDiscount_updateStatus(data) {
  return apiByGet('/chagoi-bar-order/v1/firstOrderDiscount/updateStatus', data)
}
//自定义支付
/**获取自定义支付列表 */
export async function payType_getList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallPayOrder/paySaasTypeList', data)
}
/**新增和编辑自定义支付 */
export async function payType_addAndEdit(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallPayOrder/payType', data)
}
/**启停和删除自定义支付 */
export async function payType_stopStartDel(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallPayOrder/delPayType', data)
}
//获取门店SAAS后台自定义的支付方式
export async function MallPayOrder_paySaasTypeList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallPayOrder/paySaasTypeList', data)
}
//商品销售报表导出
export async function mallSale_mallSaleReportExcel(data) {
  return apiByGet('/chagoi-bar-order/v1/mallSale/mallSaleReportExcel', data)
}
//**新增几个导出end**


// **门店管理员begin**
// 获取门店管理员列表
export async function barManagerList(data) {
  return api('/chagoi-bar-order/v1/wemew/barbase/managerList', data)
}
// 轮训查询绑定门店管理员信息
export async function barManagerLoop(data, hidLoading) {
  return api('/chagoi-bar-order/v1/wemew/barbase/loopFindBarManager', data, hidLoading)
}
//删除门店管理员
export async function delBarManager(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/barbase/delManager', data)
}
// 添加门店管理员
export async function toBindBarManager(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/wemew/barbase/toBindBarManager', data)
}
// **门店管理员end**
// 查询万圣节活动配置
export async function sale_activityset(data) {
  return apiByGet('/chagoi-bar-order/v1/sale/activitySet', data)
}
/***酒柜营销 */
//获取酒柜营销列表
export async function wineCabinet_marketList(data) {
  return apiByPostJson('/chagoi-bar-order/wine/cabinet/marketList', data)
}
//编辑酒柜营销
export async function wineCabinet_edit(data) {
  return apiByPostJson('/chagoi-bar-order/wine/cabinet/edit', data)
}
//删除酒柜营销
export async function wineCabinet_delete(data) {
  return apiByPostJson('/chagoi-bar-order/wine/cabinet/delete', data)
}
//酒柜顾客列表
export async function wineCabinet_userList(data) {
  return apiByPostJson('/chagoi-bar-order/wine/cabinet/userList', data)
}
//查看营销方案使用情况
export async function wineCabinet_Look(data) {
  return apiByPostJson('/chagoi-bar-order/wine/cabinet/marketUseDetailList', data)
}
//存酒待审核记录表
export async function drinkStorage_record(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/saas/record', data)
}
//审核存酒
export async function drinkStorage_checkDrinkStorage(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/checkDrinkStorage', data)
}
//酒柜设置里的存取审核开启关闭设置
export async function wine_info(data) {
  return apiByPostJson('/chagoi-bar-order/sys/storage/wine/info', data)
}
//编辑酒柜设置里的存取审核开启关闭设置
export async function wine_edit(data) {
  return apiByPostJson('/chagoi-bar-order/sys/storage/wine/edit', data)
}
//导出存酒审核列表
export async function drinkStorage_exportStorageWineCheckList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/exportStorageWineCheckList', data)
}
//酒卡报表导出
export async function wemew_exportExcelCard(data) {
  return apiByPostJson('/chagoi-bar-order/v1/drinkStorage/wemew/exportExcelCard', data)
}
// 查询会员余额总额
export async function member_getAllMoney(data) {
  return apiByPostJson('/chagoi-bar-order/member/storeMemberTotalBalance', data)
}
/**支付设置 */
//获取支付设置/v1/storePayOrderConfig/query
export async function paySet_get(data) {
  return apiByGet('/chagoi-bar-order/v1/storePayOrderConfig/query', data)
}
//编辑支付设置/v1/storePayOrderConfig/update
export async function paySet_edit(data) {
  return apiByPostJson('/chagoi-bar-order/v1/storePayOrderConfig/update', data)
}

// 导出桌台营收 
export async function report_tableRevenueReport(data) {
  return apiByGet("", data)
}
// 查询桌台营收总信息
export async function getTableRevenueInfo(data) {
  return apiByGet('', data)
}
// 查询桌台营收表格
export async function getTableRevenueList(data) {
  return apiByPostJson('', data)
}

// 查询库存盘点列表
export async function getStockCheckList(data) {
  return apiByGet('chagoi-bar-order/v1/mallStoregeCheck/queryList', data)
}

// 查询库存盘点详情
export async function queryCheckDetail(data) {
  return apiByGet('chagoi-bar-order/v1/mallStoregeCheck/queryCheckDetail', data)
}

//导出商品库存数据
export async function exportRepositoryCheckList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/mallStorege/exportRepositoryCheckList', data)
}


// 上传库存Excel
// export async function uploadStock(data){
//     return apiByGet('chagoi-bar-order/v1/File/mallStorageCheck', data)
// }




// 上传盘存对比数据
export async function addCheckMall(data) {
  return apiByPostJson('chagoi-bar-order/v1/mallStoregeCheck/addCheckMall', data)
}



// ******************营收概况************
// 销售概况和会员卡充值
export async function queryMallAndMemberByTypeList(data) {
  return apiByGet('chagoi-bar-order/v1/mallSale/queryMallAndMemberByTypeList', data)
}
// 获取区域销售概况列表
export async function queryTableZoneSaleList(data) {
  return apiByGet('chagoi-bar-order/v1/BookTable/queryTableZoneSaleList', data)
}
// 商品分类销售概况
export async function queryMallTypeList(data) {
  return apiByGet('chagoi-bar-order/v1/mallSale/queryMallTypeList', data)
}

// 导出回库报表
export async function exportTableZoneSale(data) {
  return apiByGet('/chagoi-bar-order/v1/BookTable/exportTableZoneSale', data)
}

// 根据订单号 查询订单详情
export async function getMemberOrderDetail(data) {
  return apiByPostJson('/chagoi-bar-order/member/getMemberOrderDetailByOrderNum', data)
}
/**会员裂变接口 */
//新增修改会员裂变规则/v1/invitationRebate/strategy
export async function memberFission_addEdit(data) {
  return apiByPostJson('/chagoi-bar-order/v1/invitationRebate/strategy', data)
}
//查询会员裂变列表/v1/invitationRebate/selectByNameAndTime
export async function memberFission_getList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/invitationRebate/selectByNameAndTime', data)
}
// 会员裂变开关
export async function memberFission_switch(data) {
  return apiByGet('/chagoi-bar-order/v1/invitationRebate/updateSwitch', data)
}
// 获取优惠券
export async function getCouponDetail(data) {
  return apiByGet('/chagoi-bar-order/v1/invitationRebate/selectCoupon', data)
}
// 获取商品
export async function getGoodsDetail(data) {
  return apiByGet('/chagoi-bar-order/v1/invitationRebate/selectGoods', data)
}
// 导出所有提成报表明细
export async function commissionReport_allReportDetail(data) {
  return apiByPostJson('/chagoi-bar-order/v1/commissionReport/exportAllReportDetail', data)
}
// 导出所有绩效报表明细
export async function performanceReport_allReportDetail(data) {
  return apiByPostJson('/chagoi-bar-order/performance/exportPerformanceDetail', data)
}

// *********退品统计报表*******************
// 商品退品统计
export async function queryMallRefundList(data) {
  return apiByGet('chagoi-bar-order/v1/mallSale/queryMallRefundList', data)
}
// 商品退品详情
export async function queryMallRefundDetail(data) {
  return apiByGet('chagoi-bar-order/v1/mallSale/queryMallRefundDetail', data)
}

// 改变订单支付类型
export async function changeOrderPayType(data) {
  return apiByPostJson('chagoi-bar-order/v1/MallPayOrder/changePayOrderDetailType', data)
}
//修改自动翻台
export async function auto_overTable(data) {
  return apiByPostJson('chagoi-bar-order/v1/store/updateAutoOverTable', data)
}
//获取自动翻台
export async function auto_getOverTable(data) {
  return apiByPostJson('chagoi-bar-order/v1/store/findAutoOverTableStatus', data)
}






// ************* 非集团酒柜数据***********************
// 库存汇总
export async function saveWine_summaryRecordNoGroup(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/queryStockList', data)
}
// 酒卡报表
export async function saveWine_cardRecordNoGroup(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/queryCardNumList', data)
}
// 顾客库存
export async function saveWine_customerRecordNoGroup(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/queryCustomerStockList', data)
}
// 过期报表
export async function saveWine_expireRecordNoGroup(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/queryExpireRecordList', data)
}
// 过期汇总
export async function saveWine_expireSummaryNoGroup(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/queryExpireRecordSumList', data)
}
// 过期汇总-详情
export async function queryExpireDetailList(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/queryExpireRecordSumDetail', data)
}
// 回库报表
export async function expireHandleRecordNoGroup(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/expireHandleRecord', data)
}
// 库存明细
export async function saveWine_summaryDetailNoGroup(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/queryDrinkDetailList', data)
}
// 存取汇总
export async function queryAccessDrinkList(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/queryAccessDrinkList', data)
}
// 存取汇总明细
export async function queryAccessDrinkDetail(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/queryAccessDrinkDetail', data)
}



// 库存汇总-导出
export async function saveWine_summaryRecordNoGroup_export(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/exportStockList', data)
}
// 酒卡报表-导出
export async function saveWine_cardRecordNoGroup_export(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/exportCardNumList', data)
}
// 顾客库存-导出
export async function saveWine_customerRecordNoGroup_export(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/exportCustomerStockList', data)
}
// 过期报表-导出
export async function saveWine_expireRecordNoGroup_export(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/exportExpireRecordList', data)
}
// 过期汇总-导出
export async function saveWine_expireSummaryNoGroup_export(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/exportExpireRecordSumList', data)
}
// 过期汇总-详情-导出
export async function exportExpireDetail(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/exportExpireRecordSumDetail', data)
}
// 回库报表-导出
export async function expireHandleRecordNoGroup_export(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/exportExpireHandleRecord', data)
}
// 库存明细-导出
export async function saveWine_summaryDetailNoGroup_export(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/exportDrinkDetailList', data)
}
// 存取汇总-导出
export async function exportAccessDrinkList(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/exportAccessDrinkList', data)
}
// 存取汇总明细-导出
export async function exportAccessDrinkDetail(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/exportAccessDrinkDetail', data)
}
//酒卡报表 - 导入模板
export async function saveWine_importTemplate(data) {
  return apiByPostJson('/chagoi-bar-order/v1/newDrinkStorage/importTemplate', data)
}

//酒卡报表 -导入
let saveWine_importCard = baseUrl + 'chagoi-bar-order/v1/File/importCardNumList';
export {
  saveWine_importCard
}




/**会员裂变报表 */
//获取裂变数据列表
export async function memberFissionRrport_list(data) {
  return apiByGet('chagoi-bar-order/v1/invitationRebate/reportDataByTime', data)
}
//获取裂变统计
export async function memberFissionRrport_total(data) {
  return apiByGet('chagoi-bar-order/v1/invitationRebate/selectAllPeopleAndValue', data)
}
//导出
export async function memberFissionRrport_export(data) {
  return apiByGet('chagoi-bar-order/v1/invitationRebate/reportDataByTimeDownload', data)
}
//导出详情
export async function memberFissionRrport_exportDetail(data) {
  return apiByGet('chagoi-bar-order/v1/invitationRebate/reportDataAllLogsByTime', data)
}
//查看会员裂变详情
export async function memberFissionRrport_checkPeoDetail(data) {
  return apiByGet('chagoi-bar-order/v1/invitationRebate/reportDataDetailByTime', data)
}
//导出会员裂变详情
export async function memberFissionRrport_exportPeoDetail(data) {
  return apiByGet('chagoi-bar-order/v1/invitationRebate/reportDataDetailByTimeDownload', data)
}
//查看会员裂变金额积分详情
export async function memberFissionRrport_checkMonDetail(data) {
  return apiByGet('chagoi-bar-order/v1/invitationRebate/reportDataLogsByTime', data)
}
//导出会员裂变金额积分详情
export async function memberFissionRrport_exportMonDetail(data) {
  return apiByGet('chagoi-bar-order/v1/invitationRebate/reportDataLogsByTimeDownload', data)
}
//会员充值报表
export async function member_rechargeList(data) {
  return apiByPostJson('chagoi-bar-order/member/rechargeReport', data)
}
//会员充值报表
export async function member_rechargeList_export(data) {
  return apiByPostJson('chagoi-bar-order/member/exportRechargeReport', data)
}
//打印绘图配置/v1/device/setPrintDrawInfo
export async function device_setPrintDrawInfo(data) {
  return apiByPostJson('chagoi-bar-order/v1/device/setPrintDrawInfo', data)
}
//打印绘图预览/v1/device/setPrintDrawInfo
export async function device_seePrintDrawInfo(data) {
  return apiByPostJson('chagoi-bar-order/v1/device/getDrawInfoMockImg', data)
}
//查询打印绘图/v1/device/queryDeviceDrawInfo
export async function device_getPrintDrawInfo(data) {
  return apiByPostJson('chagoi-bar-order/v1/device/queryDeviceDrawInfo', data)
}

// 预订报表
export async function queryReserveReportList(data) {
  return apiByGet('/chagoi-bar-order/v1/reserve/queryReserveReportList', data)
}
// 预订报表统计
export async function queryReportTotal(data) {
  return apiByGet('/chagoi-bar-order/v1/reserve/queryReportTotal', data)
}
// 预订报表导出
export async function exportReserveReport(data) {
  return apiByGet('/chagoi-bar-order/v1/reserve/exportReserveReport', data)
}
//会员消费报表
export async function member_useList_export(data) {
  return apiByPostJson('chagoi-bar-order/member/exportConsumeReport', data)
}




// ***************** 采购订单
// 新增或编辑
export async function purchaseOrderAdd(data) {
  return apiByPostJson('chagoi-bar-order/purchase/order/edit', data)
}
// 采购订单列表
export async function purchaseOrderList(data) {
  return apiByPostJson('chagoi-bar-order/purchase/order/purchaseOrderList', data)
}
// 采购单明细
export async function purchaseOrderDetail(data) {
  return apiByPostJson('chagoi-bar-order/purchase/order/purchaseOrderDetail', data)
}
// 采购入库记录
export async function purchaseInboundRecord(data) {
  return apiByPostJson('chagoi-bar-order/purchase/order/purchaseInboundRecord', data)
}
// 采购入库
export async function purchaseInbound(data) {
  return apiByPostJson('chagoi-bar-order/purchase/order/purchaseInbound', data)
}
// 采购付款记录
export async function purchasePayRecord(data) {
  return apiByPostJson('chagoi-bar-order/purchase/order/purchasePayRecord', data)
}
// 添加采购支付记录
export async function addPurchasePayRecord(data) {
  return apiByPostJson('chagoi-bar-order/purchase/order/addPurchasePayRecord', data)
}
// 导出采购单
export async function exportPurchaseOrder(data) {
  return apiByPostJson('chagoi-bar-order/purchase/order/exportPurchaseOrder', data)
}
// 导出采购单明细
export async function exportAllPurchaseOrder(data) {
  return apiByPostJson('chagoi-bar-order/purchase/order/exportAllPurchaseOrder', data)
}
// 导出采购单
export async function exportPurchaseOrderList(data) {
  return apiByPostJson('chagoi-bar-order/purchase/order/exportPurchaseOrderList', data)
}

// let exportPurchaseOrder = baseUrl+ 'chagoi-bar-order/purchase/order/exportPurchaseOrder';
// export {
//     exportPurchaseOrder
// }
//赠送报表详情导出明细
export async function exportGiveDetailReportDetail(data) {
  return apiByPostJson('chagoi-bar-order/giveDiscount/exportAllGiveDetailReport', data)
}
/**短信营销 */
//新增短信模板/ali/sms/addTemp
export async function market_messageT_add(data) {
  return apiByPostJson('chagoi-bar-order/ali/sms/addTemp', data)
}
//获取短信模板/ali/sms/addTemp
export async function market_messageT_getList(data) {
  return apiByPostJson('chagoi-bar-order/ali/sms/tempList', data)
}
//修改短信模板/ali/sms/updateTemp
export async function market_messageT_Edit(data) {
  return apiByPostJson('chagoi-bar-order/ali/sms/updateTemp', data)
}
//删除短信模板/ali/sms/deleteTemp
export async function market_messageT_del(data) {
  return apiByPostJson('chagoi-bar-order/ali/sms/deleteTemp', data)
}
//营销短信列表/ali/sms/marketAliSmsList
export async function market_message_list(data) {
  return apiByPostJson('chagoi-bar-order/ali/sms/marketAliSmsList', data)
}
//修改营销短信/ali/sms/updateMarketAliSms
export async function market_message_edit(data) {
  return apiByPostJson('chagoi-bar-order/ali/sms/updateMarketAliSms', data)
}
//新增营销短信/ali/sms/sendTemplateSms
export async function market_message_add(data) {
  return apiByPostJson('chagoi-bar-order/ali/sms/sendTemplateSms', data)
}
//已通过审核模板
export async function market_message_temList(data) {
  return apiByPostJson('chagoi-bar-order/ali/sms/selectSmsTemplateList', data)
}
//查询发送人员详情
export async function market_message_phoneList(data) {
  return apiByPostJson('chagoi-bar-order/ali/sms/marketAliSmsPhone', data)
}

export async function pagConfigInfo(data) {
  return apiByPostJson('chagoi-bar-order/v1/pagConfig/info', data)
}
//提成设置开关
export async function commission_set(data) {
  return apiByPostJson('chagoi-bar-order/sys/commission/edit', data)
}
//获取提成设置开关
export async function commission_get(data) {
  return apiByPostJson('chagoi-bar-order/sys/commission/info', data)
}


// 出品列表
export async function productionList(data) {
  return apiByPostJson('chagoi-bar-order/v1/production/report/list', data)
}

// 出品导出
export async function productionExport(data) {
  return apiByPostJson('chagoi-bar-order/v1/production/report/productionReportExcel', data)
}
// 赊账报表统计
export async function creditReportSum(data) {
  return apiByGet('chagoi-bar-order/v1/credit/reportCount', data)
}
// 赊账报表
export async function creditReport(data) {
  return apiByGet('chagoi-bar-order/v1/credit/report', data)
}
// 赊账报表
export async function creditReportExport(data) {
  return apiByGet('chagoi-bar-order/v1/credit/reportDownload', data)
}
//套餐详情
export async function reportPackage_packageD(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/setMealCommodityDetailReport', data)
}
//导出套餐详情
export async function reportPackage_export_packageD(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/exportSetMealCommodityDetail', data)
}
//员工导入模板
export async function user_import_Temp(data) {
  return apiByPostJson('/chagoi-authority-service/sys-user/importTemplate', data)
}
//员工导入
let user_import = baseUrl + 'chagoi-authority-service/sys-user/importUserList';
export {
  user_import
}

// 添加打印机的桌台
export async function addTablePrint(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallPayOrder/addTablePrint', data)
}

// 存酒详情
export async function queryStockDetailList(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/queryStockDetailList', data)
}

// 导出存酒详情
export async function exportStockDetail(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/exportStockDetail', data)
}



// **************操作日志**************
// 获取端口列
export async function getPortArr(data) {
  return apiByGet('chagoi-bar-order/v1/operation/logsSource', data)
}
// 获取日志list
export async function getLogs(data) {
  return apiByGet('chagoi-bar-order/v1/operation/logs', data)
}
// 导出日志
export async function exportLogs(data) {
  return apiByGet('chagoi-bar-order/v1/operation/logsDownload', data)
}
// 删除桌台分区
export async function del_tableZone(data) {
  return apiByPostJson('chagoi-bar-order/v1/foodTable/delStoreZone', data)
}
// 删除桌台楼层
export async function del_tableFloor(data) {
  return apiByPostJson('chagoi-bar-order/v1/foodTable/delStoreTableFloor', data)
}


// 获取税目下拉
export async function getSubjectArr(data) {
  return apiByPostJson('chagoi-bar-order/v1/invoice/list', data)
}
// 密码重置
export function resetPassWord(data) {
  return apiByPostQueryString('/chagoi-authority-service/sys-user/operation/user/resetPassWord', data)
}
//拉新提成报表
export async function register_commissionReport(data) {
  return apiByPostJson('chagoi-bar-order/v1/commissionReport/registerCommissionReport', data)
}
//导出拉新提成
export async function register_commissionReportExport(data) {
  return apiByPostJson('chagoi-bar-order/v1/commissionReport/exportRegisterCommissionReport', data)
}
//拉新提成报表明细
export async function register_commissionReportDetail(data) {
  return apiByPostJson('chagoi-bar-order/v1/commissionReport/registerCommissionReportDetail', data)
}
//导出拉新提成明细
export async function register_commissionReportExportDetail(data) {
  return apiByPostJson('chagoi-bar-order/v1/commissionReport/exportRegisterCommissionReportDetail', data)
}
// *****************排队报表******************
// 查询排队桌型
export async function queryQueueTableList(data) {
  return apiByGet('/chagoi-bar-order/customerWait/getCustomerWaitTables', data)
}
// 查询排队状态
export async function queryQueueStatusList(data) {
  return apiByGet('/chagoi-bar-order/customerWait/getStatus', data)
}
// 查询报表数据
export async function queryQueueList(data) {
  return apiByGet('/chagoi-bar-order/customerWait/waitReport', data)
}
// 查询报表总数据
export async function queryQueueTotal(data) {
  return apiByGet('/chagoi-bar-order/customerWait/waitReportTotal', data)
}
// 导出排队报表
export async function exportQueueReport(data) {
  return apiByGet('/chagoi-bar-order/customerWait/waitReportDownload', data)
}
// 查询库存调拨
export async function queryStorageDispatchList(data) {
  return apiByGet('chagoi-bar-order/v1/mallStoregeDispatch/queryStorageDispatchList', data)
}

// 新增库存调拨
export async function addStorageDispatch(data) {
  return apiByPostJson('chagoi-bar-order/v1/mallStoregeDispatch/addStorageDispatch', data)
}

// 查询库存详情
export async function queryStorageDispatchDetail(data) {
  return apiByGet('chagoi-bar-order/v1/mallStoregeDispatch/queryStorageDispatchDetail', data)
}

// 获取收银端口
export async function getSourceList(data) {
  return apiByGet('chagoi-bar-order/v1/operation/logsDownload', data)
}


// 营收概况-获取收银台收款概况
export async function queryDeviceSale(data) {
  return apiByGet('chagoi-bar-order/v1/mallSale/queryDeviceSale', data)
}
// 收款端口报表数据
export async function queryDeviceSummary(data) {
  return apiByGet('chagoi-bar-order/v1/mallSale/queryDeviceSummary', data)
}
// 收款端口报表数据详情
export async function queryDeviceSaleDetail(data) {
  return apiByGet('chagoi-bar-order/v1/mallSale/queryDeviceSaleDetail', data)
}
// 收款端口报表数据导出
export async function exportDeviceSummary(data) {
  return apiByGet('chagoi-bar-order/v1/mallSale/exportDeviceSummary', data)
}
// 导出详情
export async function exportDeviceSaleDetail(data) {
  return apiByGet('chagoi-bar-order/v1/mallSale/exportDeviceSaleDetail', data)
}
// 收款端口报表数据导出明细
export async function exportAllDeviceSaleDetail(data) {
  return apiByGet('chagoi-bar-order/v1/mallSale/exportAllDeviceSaleDetail', data)
}


// ********************成本********************
// 新增成本调整
export async function addMallStorageCost(data) {
  return apiByPostJson('chagoi-bar-order/v1/mallStoregeCost/addMallStorageCost', data)
}
// 查询成本调整
export async function queryMallStorageCost(data) {
  return apiByGet('chagoi-bar-order/v1/mallStoregeCost/queryMallStorageCost', data)
}
// 查询成本调整
export async function queryMallStorageCostDetail(data) {
  return apiByGet('chagoi-bar-order/v1/mallStoregeCost/queryMallStorageCostDetail', data)
}
// 查询成本报表
export async function queryCostReport(data) {
  return apiByGet('chagoi-bar-order/v1/mallStoregeCost/queryCostReport', data)
}
// 查询成本报表详情
export async function queryCostReportDetail(data) {
  return apiByGet('chagoi-bar-order/v1/mallStoregeCost/queryCostReportDetail', data)
}
// 查询成本报表汇总
export async function queryCostReportTotal(data) {
  return apiByGet('chagoi-bar-order/v1/mallStoregeCost/queryCostReportTotal', data)
}
// 导出成本报表
export async function exportCostReport(data) {
  return apiByGet('chagoi-bar-order/v1/mallStoregeCost/exportCostReport', data)
}
// 成本报表详情导出
export async function exportCostReportDetail(data) {
  return apiByGet('chagoi-bar-order/v1/mallStoregeCost/exportCostReportDetail', data)
}
//查询通用备注
export async function remark_get(data) {
  return apiByPostJson('chagoi-bar-order/sys/commodity/remark/remarkInfo', data)
}
//修改通用备注
export async function remark_edit(data) {
  return apiByPostJson('chagoi-bar-order/sys/commodity/remark/edit', data)
}
/**限时特价接口 */
//查询
export async function limitedPrice_getList(data) {
  return apiByGet('chagoi-bar-order/v1/specialDiscountSale/queryDiscountList', data)
}
//新增
export async function limitedPrice_add(data) {
  return apiByPostJson('chagoi-bar-order/v1/specialDiscountSale/addSaleDiscount', data)
}
//编辑
export async function limitedPrice_edit(data) {
  return apiByPostJson('chagoi-bar-order/v1/specialDiscountSale/updateSaleDiscount', data)
}
//编辑状态
export async function limitedPrice_editStatus(data) {
  return apiByGet('chagoi-bar-order/v1/specialDiscountSale/updateStatus', data)
}
//查询详情
export async function limitedPrice_getDetail(data) {
  return apiByGet('chagoi-bar-order/v1/specialDiscountSale/querySaleDiscountDetail', data)
}
//删除
export async function limitedPrice_del(data) {
  return apiByGet('chagoi-bar-order/v1/specialDiscountSale/deleteSaleDiscount', data)
}
//到账报表
export async function report_arrival(data) {
  return apiByGet('chagoi-bar-order/v1/reports/getAllAccountMoney', data)
}
// 结算报表
export async function reportSettle(data) {
  return apiByGet('chagoi-bar-order/v1/reports/getSettlementReport', data)
}
/**大屏设置 */
export async function largeScreen_set(data) {
  return apiByPostJson('chagoi-bar-order/sys/wemew/screen/edit', data)
}
export async function largeScreen_get(data) {
  return apiByPostJson('chagoi-bar-order/sys/wemew/screen/setUpInfo', data)
}




/****************************** 获取图片库列表  */
// 上传到图片库
let upLoadToLib = baseUrl + 'chagoi-bar-order/v1/File/uploadImgToLibrary ';
export {
  upLoadToLib
}
// 获取图片列表
export async function getPicList(data) {
  return apiByGet('chagoi-bar-order/uploadImgToLibrary/findPicture', data)
}
/**员工点单报表 */
export async function staffOrder_list(data) {
  return apiByGet('chagoi-bar-order/staff/report', data)
}
export async function staffOrder_export(data) {
  return apiByGet('chagoi-bar-order/staff/reportDownLoad', data)
}
export async function staffOrder_exportDetails(data) {
  return apiByGet('chagoi-bar-order/staff/reportDetail', data)
}
export async function staffOrder_detailsReport(data) {
  return apiByGet('chagoi-bar-order/staff/reportDetailDownLoad', data)
}

/************************免单报表 */
// 免单报表查询
export async function queryFreeOrderList(data) {
  return apiByGet('chagoi-bar-order/v1/freeOrder/queryFreeOrderList', data)
}
// 免单报表详情查询
export async function queryFreeOrderDetail(data) {
  return apiByGet('chagoi-bar-order/v1/freeOrder/queryFreeOrderDetail', data)
}
// 免单详情导出
export async function exportFreeOrderDetail(data) {
  return apiByGet('chagoi-bar-order/v1/freeOrder/exportFreeOrderDetail', data)
}
// 免单导出明细
export async function exportFreeOrderAll(data) {
  return apiByGet('chagoi-bar-order/v1/freeOrder/exportFreeOrderAll', data)
}

/**************************会员群组********************* */
// 预查询
export async function queryMemberByCondition(data) {
  return apiByPostJson('chagoi-bar-order/member/group/queryMemberByCondition', data)
}
// 添加
export async function addMemberGroup(data) {
  return apiByPostJson('chagoi-bar-order/member/group/addMemberGroup', data)
}
// 查询会员详情
export async function queryMemberGroupDetail(data) {
  return apiByPostJson('chagoi-bar-order/member/group/queryMemberGroupDetail', data)
}
// 导出群组
export async function exportMemberGroupDetail(data) {
  return apiByPostJson('chagoi-bar-order/member/group/exportMemberGroupDetail', data)
}
// 查询群组列表
export async function queryMemberGroup(data) {
  return apiByGet('chagoi-bar-order/member/group/queryMemberGroup', data)
}
// 查询群组详情
export async function queryMemberGroupExtend(data) {
  return apiByGet('chagoi-bar-order/member/group/queryMemberGroupExtend', data)
}
//导出会员消费明细
export async function export_memberUseDetail(data) {
  return apiByPostJson('chagoi-bar-order/member/exportConsumeDetailReport', data)
}


// 酒柜数据--盘存数据报表
export async function queryTakeStockList(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/queryTakeStockList', data)
}
// 酒柜数据--库存详情
export async function queryTakeStockDetail(data) {
  return apiByGet('chagoi-bar-order/v1/newDrinkStorage/queryTakeStockDetail', data)
}

// 获取材料配置
export async function queryMallConfig(data) {
  return apiByGet('chagoi-bar-order/v1/mallStorege/queryMallConfig', data)
}

// 设置材料配置
export async function addMallConfig(data) {
  return apiByPostJson('chagoi-bar-order/v1/mallStorege/addMallConfig', data)
}



// 出入库汇总-列表
export async function inAndOutSummaryList(data) {
  return apiByGet('chagoi-bar-order/v1/mallStorege/queryAccessTotalList', data)
}
// 出入库汇总-导出
export async function inAndOutSummaryExport(data) {
  return apiByGet('chagoi-bar-order/v1/mallStorege/exportAccessTotal', data)
}
// 出入库汇总-明细
export async function inAndOutSummaryDetail(data) {
  return apiByGet('chagoi-bar-order/v1/mallStorege/queryAccessTotalDetail', data)
}
// 出入库汇总-明细-导出
export async function inAndOutSummaryDetailExport(data) {
  return apiByGet('chagoi-bar-order/v1/mallStorege/exportAccessTotalDetail', data)
}
/**
 * 会员生日例送
 */
export async function member_bir_get(data) {
  return apiByPostJson('chagoi-bar-order/member/memberBirthdayGiveInfo', data)
}
export async function member_bir_edit(data) {
  return apiByPostJson('chagoi-bar-order/member/editMemberBirthdayGive', data)
}
/*
 * 短信通知接口
 */
//添加短信通知模板
export async function notify_addTemplate(data) {
  return apiByPostJson('chagoi-bar-order/ali/sms/notify/addTemplate', data)
}
//更新短信通知模板
export async function notify_updateTemplate(data) {
  return apiByPostJson('chagoi-bar-order/ali/sms/notify/updateTemplate', data)
}
//删除短信通知模板
export async function notify_delTemplate(data) {
  return apiByPostJson('chagoi-bar-order/ali/sms/notify/deleteTemplate', data)
}
//查询审核通过短信通知模板
export async function notify_templates(data) {
  if (!data.pageSize) data.pageSize = 99999
  if (!data.pageNum) data.pageNum = 1
  return apiByPostJson('chagoi-bar-order/ali/sms/notify/templates', data)
}
//添加门店短信配置
export async function notify_add(data) {
  return apiByPostJson('chagoi-bar-order/store/smsConfig/add', data)
}
//跟新门店短信配置
export async function notify_update(data) {
  return apiByPostJson('chagoi-bar-order/store/smsConfig/update', data)
}
//门店短信配置列表
export async function notify_list(data) {
  return apiByGet('chagoi-bar-order/store/smsConfig/list', data)
}
//点舞提成列表
export async function dancer_reportList(data) {
  return apiByGet('chagoi-bar-order/v1/commissionReport/queryDanceReport', data)
}
//点舞提成明细
export async function dancer_reportList_detail(data) {
  return apiByGet('chagoi-bar-order/v1/commissionReport/queryDanceReportDetail', data)
}
//点舞提成明细导出
export async function dancer_reportList_detail_export(data) {
  return apiByGet('chagoi-bar-order/v1/commissionReport/exportDanceCommissionReportDetail', data)
}
//点舞提成导出列表/
export async function dancer_reportList_export(data) {
  return apiByGet('chagoi-bar-order/v1/commissionReport/exportDanceCommissionReport', data)
}
/**
 * 会员卡种管理 
 * */
//获取列表
export async function memberCardType_list(data) {
  return apiByPostJson('chagoi-bar-order/member/card/memberCardList', data)
}
//新增&修改
export async function memberCardType_addAndEdit(data) {
  return apiByPostJson('chagoi-bar-order/member/card/editMemberCard', data)
}
//删除
export async function memberCardType_del(data) {
  return apiByPostJson('chagoi-bar-order/member/card/deleteMemberCard', data)
}
//编辑状态
export async function memberCardType_statue(data) {
  return apiByPostJson('chagoi-bar-order/member/card/editMemberCardStatus', data)
}
/**
 * 会员卡种开卡报表
 */
//查询
export async function memberCardType_report_getList(data) {
  return apiByPostJson('chagoi-bar-order/member/card/detail/list', data)
}
//导出
export async function memberCardType_report_export(data) {
  return apiByPostJson('chagoi-bar-order/member/card/detail/exportMemberOpenCardDetailList', data)
}

/*************************部门出品****************************/
// 出品部门查询
export async function queryDeptMakeMallList(data) {
  return apiByGet('chagoi-bar-order/v1/deptMakeMall/queryDeptMakeMallList', data)
}
// 新增出品部门
export async function addDeptMakeMall(data) {
  return apiByPostJson('chagoi-bar-order/v1/deptMakeMall/addDeptMakeMall', data)
}
// 配置部门商品
export async function configDeptMakeMall(data) {
  return apiByPostJson('chagoi-bar-order/v1/deptMakeMall/configDeptMakeMall', data)
}
// 修改部门状态
export async function updateDeptState(data) {
  return apiByGet('chagoi-bar-order/v1/deptMakeMall/updateState', data)
}
// 编辑部门
export async function updateDeptMakeMall(data) {
  return apiByGet('chagoi-bar-order/v1/deptMakeMall/updateDeptMakeMall', data)
}
// 删除部门
export async function delDeptMakeMall(data) {
  return apiByGet('chagoi-bar-order/v1/deptMakeMall/delDeptMakeMall', data)
}
// 配置商品查询
export async function queryConfigMakeMall(data) {
  return apiByGet('chagoi-bar-order/v1/deptMakeMall/queryConfigMakeMall', data)
}
// 查询所有启用配置
export async function queryAllConfig(data) {
  return apiByGet('chagoi-bar-order/v1/deptMakeMall/queryAllConfig', data)
}
/*************************部门出品****************************/
// 部门出品报表列表
export async function queryDeptReportList(data) {
  return apiByPostJson('chagoi-bar-order/v1/deptMakeMall/queryDeptReportList', data)
}
// 部门出品明细查询
export async function queryDeptReportDetail(data) {
  return apiByPostJson('chagoi-bar-order/v1/deptMakeMall/queryDeptReportDetail', data)
}
// 导出报表
export async function exportDeptReportList(data) {
  return apiByPostJson('chagoi-bar-order/v1/deptMakeMall/exportDeptReportList', data)
}
// 导出报表详情
export async function exportDeptReportDetail(data) {
  return apiByPostJson('chagoi-bar-order/v1/deptMakeMall/exportDeptReportDetail', data)
}
/**商品和套餐批量修改优化 */
// 商品批量启停
export async function more_goodsEdit(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/batchStoreMallSale', data)
}
// 套餐批量启停
export async function more_setMealEdit(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/batchOffAndUpSetMeal', data)
}

// 套餐批量启停
export async function getInvoiceConfig(data) {
  return apiByGet('/chagoi-bar-order/v1/invoice/invoiceConfig', data)
}
// 套餐批量启停
export async function editInvoiceConfig(data) {
  return apiByPostJson('/chagoi-bar-order/v1/invoice/editInvoiceConfig', data)
}



// 开票报表
// 开票报表数据
export async function taxReportList(data) {
  return apiByGet('/chagoi-bar-order/v1/invoice/report', data)
}
// 开票报表导出
export async function taxListExport(data) {
  return apiByGet('/chagoi-bar-order/v1/invoice/reportDownload', data)
}
// 重新提交
export async function taxReSubmit(data) {
  return apiByPostJson('/chagoi-bar-order/v1/invoice/makeInvoiceMaster', data)
}



//获取赠送折扣模板列表
export async function gift_discount_list(data) {
  return apiByPostJson('/chagoi-bar-order/giveDiscount/getSysGiveDiscountTempList', data)
}
//编辑配置赠送折扣人员
export async function gift_discount_user(data) {
  return apiByPostJson('/chagoi-bar-order/giveDiscount/editGiveDiscountUser', data)
}
//启停配置赠送折扣
export async function gift_discount_statusEdit(data) {
  return apiByPostJson('/chagoi-bar-order/giveDiscount/editSysGiveDiscountTempEnableStatus', data)
}
//获取赠送折扣详情
export async function gift_discount_detail(data) {
  return apiByPostJson('/chagoi-bar-order/giveDiscount/getSysGiveDiscountTempInfo', data)
}
//删除赠送折扣方案
export async function gift_discount_del(data) {
  return apiByPostJson('/chagoi-bar-order/giveDiscount/deleteSysGiveDiscountTemp', data)
}
//会员数量分析报表
export async function member_registerReport(data) {
  return apiByPostJson('/chagoi-bar-order/member/reports/memberRegisterReport', data)
}
//会员跨店报表
export async function member_report_crossStore(data) {
  return apiByPostJson('/chagoi-bar-order/member/reports/memberCrossStoreConsumeReport', data)
}
//获取会员跨店门店
export async function member_report_storeList(data) {
  return apiByGet('/chagoi-bar-order/member/reports/getMemberCrossStoreList', data)
}
//获取跨店报表表头
export async function member_report_crossStoreTitle(data) {
  return apiByPostJson('/chagoi-bar-order/member/reports/getMemberCrossStoreConsumeTitle', data)
}
//获取跨店报表导出
export async function member_report_crossStore_export(data) {
  return apiByPostJson('/chagoi-bar-order/member/reports/exportMemberCrossStoreConsumeReport', data)
}
//会员积分报表
export async function member_report_integral(data) {
  return apiByPostJson('/chagoi-bar-order/member/reports/memberIntegralReport', data)
}
//会员积分报表表头
export async function member_report_title(data) {
  return apiByPostJson('/chagoi-bar-order/member/reports/memberIntegralReportTitle', data)
}
//会员积分报表导出
export async function member_report_export(data) {
  return apiByPostJson('/chagoi-bar-order/member/reports/exportMemberIntegralReport', data)
}
//会员充值分析报表
export async function member_report_save(data) {
  return apiByPostJson('/chagoi-bar-order/member/reports/memberRechargeAnalysisReport', data)
}
//会员充值赠送分析报表
export async function member_report_gift(data) {
  return apiByPostJson('/chagoi-bar-order/member/reports/memberRechargeGiveAnalysisReport', data)
}
//会员消费排行
export async function member_report_rank(data) {
  return apiByPostJson('/chagoi-bar-order/member/reports/memberConsumeRanking', data)
}
//会员消费分析报表
export async function member_report_memberConsumeAnalysisReport(data) {
  return apiByPostJson('/chagoi-bar-order/member/reports/memberConsumeAnalysisReport', data)
}
/** 
 * 优惠券报表接口
 */
export async function coupon_report_list(data) {
  return apiByGet('/chagoi-bar-order/v1/couponSaas/report', data)
}
export async function coupon_report_export(data) {
  return apiByGet('/chagoi-bar-order/v1/couponSaas/reportDownlond', data)
}
/**
 * 消费满赠
 */
// 消费满赠列表
export async function consume_planList(data) {
  return apiByPostJson('/chagoi-bar-order/member/consume/give/manage/planList', data)
}
// 消费满赠编辑
export async function consume_planEdit(data) {
  return apiByPostJson('/chagoi-bar-order/member/consume/give/manage/editPlan', data)
}
// 启停满赠编辑
export async function consume_editPlanStatus(data) {
  return apiByPostJson('/chagoi-bar-order/member/consume/give/manage/editPlanStatus', data)
}
// 删除满赠编辑
export async function consume_deletePlan(data) {
  return apiByPostJson('/chagoi-bar-order/member/consume/give/manage/deletePlan', data)
}

/**
 * 首页数据接口
 */
//商品销售分析
export async function index_report_goods(data) {
  return apiByPostJson('/chagoi-bar-order/index/report/goods', data)
}
//提成报表
export async function index_report_commission(data) {
  return apiByPostJson('/chagoi-bar-order/index/report/commission', data)
}
//折扣报表
export async function index_report_discount(data) {
  return apiByPostJson('/chagoi-bar-order/index/report/discount', data)
}
//赠送报表
export async function index_report_give(data) {
  return apiByPostJson('/chagoi-bar-order/index/report/give', data)
}
//支付方式统计
export async function index_report_payment(data) {
  return apiByPostJson('/chagoi-bar-order/index/report/payment', data)
}
//订单来源
export async function index_report_orderSource(data) {
  return apiByPostJson('/chagoi-bar-order/index/report/orderSource', data)
}
//消费构成
export async function index_report_customConstitute(data) {
  return apiByPostJson('/chagoi-bar-order/index/report/customConstitute', data)
}
//销售概况
export async function index_report_saleProfile(data) {
  return apiByPostJson('/chagoi-bar-order/index/report/saleProfile', data)
}
//消费分析
export async function index_report_consumption(data) {
  return apiByPostJson('/chagoi-bar-order/index/report/consumption', data)
}
//营收分析
export async function index_report_business(data) {
  return apiByPostJson('/chagoi-bar-order/index/report/business', data)
}
//会员分析
export async function index_report_member(data) {
  return apiByPostJson('/chagoi-bar-order/index/report/member', data)
}

/****************************  预定管理  ********************************************* */
// 查询预定配置
export async function queryReserveConfig(data) {
  return apiByGet('/chagoi-bar-order/v1/reserve/queryReserveConfig', data)
}
// 修改预定配置
export async function updateReserveConfig(data) {
  return apiByPostJson('/chagoi-bar-order/v1/reserve/updateReserveConfig', data)
}
/****************************  部门设置  ********************************************* */
// 部门列表
export async function queryDeptList(data) {
  return apiByGet('/chagoi-bar-order/v1/storeDept/list', data)
}
// 创建部门
export async function addDept(data) {
  return apiByPostJson('/chagoi-bar-order/v1/storeDept/addDept', data)
}
// 更新部门信息
export async function updateDept(data) {
  return apiByPostJson('/chagoi-bar-order/v1/storeDept/update', data)
}
// 更改部门状态
export async function updateDeptStatus(data) {
  return apiByPostJson('/chagoi-bar-order/v1/storeDept/updateStatus', data)
}
// 删除部门
export async function deleteDept(data) {
  return apiByPostJson('/chagoi-bar-order/v1/storeDept/delete', data)
}
// 查询人员配置
export async function queryDeptUserList(data) {
  return apiByGet('/chagoi-bar-order/v1/storeDeptUser/userList', data)
}
// 配置人员
export async function addDeptUser(data) {
  return apiByPostJson('/chagoi-bar-order/v1/storeDeptUser/update', data)
}
/**********************桌台统计报表 */
// 桌台统计报表
export async function bookTableReport(data) {
  return apiByGet('/chagoi-bar-order/v1/BookTable/bookTableReport', data)
}
// 桌台统计报表--导出
export async function bookTableReportExcel(data) {
  return apiByGet('/chagoi-bar-order/v1/BookTable/bookTableReportExcel', data)
}

// 商品批量修改排序
export async function goodsQuickSort(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/quickSort', data)
}

// 商品按价格排序
export async function goodsEditSort(data) {
  return apiByPostJson('/chagoi-bar-order/v1/MallCommodity/editSort', data)
}

/****************************  偏好设置  ********************************************* */
// 偏好列表
export async function getPreferList(data) {
  return apiByGet('/chagoi-bar-order/v1/storePreferenceLibrary/list', data)
}
// 删除偏好
export async function deletePrefer(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/storePreferenceLibrary/delete', data)
}
// 更改偏好
export async function editPrefer(data) {
  return apiByPostJson('/chagoi-bar-order/v1/storePreferenceLibrary/update', data)
}
// 添加偏好
export async function addPrefer(data) {
  return apiByPostJson('/chagoi-bar-order/v1/storePreferenceLibrary/save', data)
}
// 更改偏好状态
export async function updatePreferStatus(data) {
  return apiByPostQueryString('/chagoi-bar-order/v1/storePreferenceLibrary/updateStatus', data)
}
// 配置偏好商品
export async function configCommodity(data) {
  return apiByPostJson('/chagoi-bar-order/v1/storePreferenceLibrary/configCommodity', data)
}
// 配置偏好商品
export async function findPreferenceConfig(data) {
  return apiByGet('/chagoi-bar-order/v1/storePreferenceLibrary/findPreferenceConfig', data)
}
/****************************  非集团会员跨店报表  ********************************************* */
//会员跨店报表
export async function getCrossStoreReport(data) {
  return apiByGet('/chagoi-bar-order/member/crossConsumeReport', data)
}
//获取会员跨店门店
export async function getCrossStoreList(data) {
  return apiByGet('/chagoi-bar-order/member/cross/findStoreList', data)
}
//获取跨店报表表头
export async function getCrossStoreReportTotal(data) {
  return apiByGet('/chagoi-bar-order/member/crossConsumeReportTotal', data)
}
//获取跨店报表导出
export async function exportCrossStoreReport(data) {
  return apiByGet('/chagoi-bar-order/member/crossConsumeReportExport', data)
}
/**会员点单例送 */
//查询列表
export async function member_order_list(data) {
  return apiByPostJson('/chagoi-bar-order/member/order/gift/planList', data)
}
//方案启停
export async function member_order_stopAndUse(data) {
  return apiByPostJson('/chagoi-bar-order/member/order/gift/editPlanStatus', data)
}
//删除方案
export async function member_order_del(data) {
  return apiByPostJson('/chagoi-bar-order/member/order/gift/deletePlan', data)
}
//保存方案
export async function member_order_update(data) {
  return apiByPostJson('/chagoi-bar-order/member/order/gift/editPlan', data)
}
//保存方案
export async function member_order_getGoods(data) {
  return apiByPostJson('/chagoi-bar-order/member/order/gift/planCommodityInfo', data)
}
// 保存打印机配置
export async function use_printerSet(data) {
  return apiByPostJson('/chagoi-bar-order/v1/device/usePrinterSnapshotConfig', data)
}
// 应用打印机配置 
export async function save_printerSet(data) {
  return apiByPostJson('/chagoi-bar-order/v1/device/savePrinterTemp', data)
}
/****************************  销卡报表  ********************************************* */
//查询
export async function closeCardList(data) {
  return apiByGet('chagoi-bar-order/member/annulRecord', data)
}
//导出
export async function closeCardListExport(data) {
  return apiByGet('chagoi-bar-order/member/exportAnnulRecord', data)
}
/**会员设置 */
export async function member_set(data) {
  return apiByPostJson('/chagoi-bar-order/', data)
}
// 获取参与储值规则会员
export async function saveMemberGet(data) {
  return apiByGet('/chagoi-bar-order/member/level/getConfMember', data)
}
// 设置参与储值规则会员
export async function saveMemberSet(data) {
  return apiByPostJson('/chagoi-bar-order/member/level/confMember', data)
}
// 设置对外开放会员等级
export async function outMemberSet(data) {
  return apiByPostJson('/chagoi-bar-order/member/level/updateLevIsShow', data)
}
// 通用设置获取
export async function memberUsualSetGet(data) {
  return apiByGet('/chagoi-bar-order/member/setting/get', data)
}
// 通用设置保存
export async function memberUsualSetSave(data) {
  return apiByPostJson('/chagoi-bar-order/member/setting/edit', data)
}
//取消微信授权
export async function del_loopAuth(data) {
  return apiByPostJson('/chagoi-bar-order/wx/cancel', data)
}
//导出会员消费排行报表
export async function export_member_report_useQueue(data) {
  return apiByPostJson('/chagoi-bar-order/member/reports/exportMemberConsumeRanking', data)
}
//查询会员量
export async function export_member_all_register_report(data) {
  return apiByPostJson('/chagoi-bar-order/member/reports/memberAllRegisterReport', data)
}

// 套餐批量修改排序
export async function setMealQuickSort(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/quickSort', data)
}

// 套餐按价格排序
export async function setMealEditSort(data) {
  return apiByPostJson('/chagoi-bar-order/v1/setMeal/editSort', data)
}
/* 拼团秒杀接口 */
//新增修改拼团秒杀teamSeckill
export async function teamSeckill_addEdit(data) {
  return apiByPostJson('/chagoi-bar-order/appGroupPlan/edit', data)
}
//查询秒杀列表
export async function teamSeckill_getList(data) {
  return apiByGet('/chagoi-bar-order/appGroupPlan/selectAll', data)
}
//启停
export async function teamSeckill_isStop(data) {
  return apiByPostJson('/chagoi-bar-order/appGroupPlan/stopOne', data)
}

//删除
export async function teamSeckill_isDel(data) {
  return apiByPostJson('/chagoi-bar-order/appGroupPlan/deleteOne', data)
}


// ******************首单特惠*******************
// 添加首单特惠
export async function addFlashSale(data) {
  return apiByPostJson('/chagoi-bar-order/v1/flashSale/addFlashSale', data)
}
// 修改首单特惠状态
export async function updateFlashSaleStatus(data) {
  return apiByPostJson('/chagoi-bar-order/v1/flashSale/updateStatus', data)
}
// 查询首单特惠列表
export async function queryFlashSaleList(data) {
  return apiByPostJson('/chagoi-bar-order/v1/flashSale/queryFlashSaleList', data)
}
// 查看首单特惠详情
export async function queryFlashSaleDetail(data) {
  return apiByGet('/chagoi-bar-order/v1/flashSale/queryFlashSaleDetail', data)
}
// 删除首单特惠
export async function deleteFlashSale(data) {
  return apiByPostJson('/chagoi-bar-order/v1/flashSale/queryFlashSaleDetail', data)
}
// 删除首单特惠
export async function querySaleDetail(data) {
  return apiByPostJson('/chagoi-bar-order/v1/flashSale/querySaleDetail', data)
}
// 删除首单特惠
export async function exportSaleDetail(data) {
  return apiByPostJson('/chagoi-bar-order/v1/flashSale/exportSaleDetail', data)
}
// **********************延期报表*************************
// 桌台统计报表
export async function getExtensionList(data) {
  return apiByGet('/chagoi-bar-order/v1/drinkStorage/delayReport', data)
}
// 桌台统计报表--导出
export async function exportExtensionList(data) {
  return apiByGet('/chagoi-bar-order/v1/drinkStorage/delayReportDownload', data)
}
// 获取桌台操作日志
export async function getTableLog(data) {
  return apiByPostJson('/chagoi-bar-order/log/table/tableOperationLogList', data)
}
//获取门店下所有的部门和部门下的人员
export async function getListByDeptUser(data) {
  return apiByPostJson('/chagoi-bar-order/v1/storeDept/listByDeptUser', data)
}


/**
 * 合伙人api
 */
//获取合伙人列表
export async function market_partner_getList(params) {
  return apiByGet('/chagoi-bar-order/v1/partner/partnerList', params)
}
//启停合伙人
export async function market_partner_updateState(params) {
  return apiByGet('/chagoi-bar-order/v1/partner/updatePartnerState', params)
}
//删除合伙人
export async function market_partner_delState(params) {
  return apiByGet('/chagoi-bar-order/v1/partner/deletePartner', params)
}
//获取合伙人数据详情
export async function market_partner_getDetail(params) {
  return apiByGet('/chagoi-bar-order/v1/partner/partnerDetail', params)
}
//新增修改合伙人
export async function market_partner_addEdit(params) {
  return apiByPostJson('/chagoi-bar-order/v1/partner/saveOrUpdatePartner', params)
}
//获取分佣数据
export async function market_partner_getDomesticAidData(params) {
  return apiByGet('/chagoi-bar-order/v1/partner/partnerRebateList', params)
}
//获取分佣数据详情
export async function market_partner_getDomesticAidDataDetail(params) {
  return apiByGet('/chagoi-bar-order/v1/partner/consumptionList', params)
}
//导出分佣数据详情
export async function market_partner_exportDomesticAidDataDetail(params) {
  return apiByPostJson('/chagoi-bar-order/', params)
}
//获取推广数据
export async function market_partner_getPromotionData(params) {
  return apiByGet('/chagoi-bar-order/v1/partner/inviteList', params)
}
//获取提现设置
export async function market_partner_getCashWithdrawalSet(params) {
  return apiByGet('/chagoi-bar-order/v1/partner/findWithdrawalConfig', params)
}
//编辑提现设置
export async function market_partner_editCashWithdrawalSet(params) {
  return apiByPostJson('/chagoi-bar-order/v1/partner/editWithdrawalConfig', params)
}
//获取提现记录
export async function market_partner_getCashWithdrawalRecord(params) {
  return apiByGet('/chagoi-bar-order/v1/partner/withdrawalRecord', params)
}
//打款
export async function market_partner_commissionRemit(params) {
  return apiByPostQueryString('/chagoi-bar-order/v1/partner/commissionRemit', params)
}
//合伙人裂变数据 /v1/partner/partnerFission
export async function market_partner_partnerFisssion(params) {
  return apiByGet('/chagoi-bar-order/v1/partner/partnerFission', params)
}
//合伙人返佣佣数据 /v1/partner/partnerConsumptionDetails
export async function market_partner_partnerConsumptionDetails(params) {
  return apiByGet('/chagoi-bar-order/v1/partner/partnerConsumptionDetails', params)
}
//导出合伙人数据
export async function market_partner_partner(params) {
  return apiByPostJson('/chagoi-bar-order/v1/partner/partnerConsumptionDetails', params)
}
//导出合伙人数据
export async function market_partner_partnerPeople(params) {
  return apiByPostJson('/chagoi-bar-order/v1/partner/partnerConsumptionDetails', params)
}
//导出合伙人数据
export async function market_partner_partnerMoney(params) {
  return apiByPostJson('/chagoi-bar-order/v1/partner/partnerConsumptionDetails', params)
}
//导出推广数据
export async function market_partner_promotionData(params) {
  return apiByPostJson('/chagoi-bar-order/v1/partner/partnerConsumptionDetails', params)
}
//导出提现数据
export async function market_partner_withdrawal(params) {
  return apiByPostJson('/chagoi-bar-order/v1/partner/partnerConsumptionDetails', params)
}

//导出分佣数据
export async function market_partner_domesticAidData(params) {
  return apiByPostJson('/chagoi-bar-order/v1/partner/partnerConsumptionDetails', params)
}

//导出分佣详情数据
export async function market_partner_domesticAidDataDetail(params) {
  return apiByPostJson('/chagoi-bar-order/v1/partner/partnerConsumptionDetails', params)
}
//查询订单数据
export async function market_partner_orderNum(params) {
  return apiByGet('/chagoi-bar-order/v1/partner/consumptionDetailByOrderNum', params)
}
// *******************叫号设置*********************************
// 查询叫号内容
export async function queryWaitTableCall(data) {
  return apiByGet('/chagoi-bar-order/customerWait/queryWaitTableCall', data)
}
// 添加叫号内容
export async function addWaitTableCall(data) {
  return apiByPostJson('/chagoi-bar-order/customerWait/addWaitTableCall', data)
}
// 修改叫号内容
export async function updateWaitTableCall(data) {
  return apiByPostJson('/chagoi-bar-order/customerWait/updateWaitTableCall', data)
}

// ***********打印日志********************
// 查询打印日志
export async function printLogList(data) {
  return apiByGet('/chagoi-bar-order/v1/MallPayOrder/printBill', data)
}
// 导出打印日志
export async function printLogExport(data) {
  return apiByGetBlob('/chagoi-bar-order/v1/MallPayOrder/downloadPrintBill', data)
}

// ***************************开台费报表******************************
// 开台提成报表
export async function openTableCommissionReport(data) {
  return apiByPostJson('/chagoi-bar-order/commission/report/openTableCommissionReport', data)
}
// 开台费明细
export async function openTableCommissionReportDetail(data) {
  return apiByPostJson('/chagoi-bar-order/commission/report/openTableCommissionReportDetail', data)
}
// 导出开台提成所有明细
export async function exportOpenTableAllDetail(data) {
  return apiByPostJson('/chagoi-bar-order/commission/report/exportOpenTableAllDetail', data)
}
// 导出单个人员开台提成明细
export async function exportOpenTableDetail(data) {
  return apiByPostJson('/chagoi-bar-order/commission/report/exportOpenTableDetail', data)
}
// 导出门店开台提成
export async function exportOpenTableReport(data) {
  return apiByPostJson('/chagoi-bar-order/commission/report/exportOpenTableReport', data)
}



// ****************************退品原因***********************
// 套餐按价格排序
export async function addRefundCase(data) {
  return apiByPostJson('/chagoi-bar-order/v1/refund/addRefundCause', data)
}
// 套餐按价格排序
export async function getRefundCaseList(data) {
  return apiByGet('/chagoi-bar-order/v1/refund/queryRefundCauseList', data)
}
// 套餐按价格排序
export async function updateRefundStatus(data) {
  return apiByPostJson('/chagoi-bar-order/v1/refund/updateStatus', data)
}
//酒柜营销会员导入模板链接
export const wine_member_importTemplate = 'https://lamic-public.oss-cn-shenzhen.aliyuncs.com/importExcel/%E9%85%92%E6%9F%9C%E8%90%A5%E9%94%80%E5%AF%BC%E5%85%A5%E4%BC%9A%E5%91%98%E6%A8%A1%E6%9D%BF.xlsx';
//获取公众号领券二维码
export async function getWeixinCouponQrcode(data) {
  return apiByPostJson('/chagoi-bar-order/wx/key/getCouponQrcode', data)
}
//新增修改组合投放
export async function market_couponGroups_Edit_Add(params) {
  return apiByPostJson('/chagoi-bar-order/v1/couponSaasPackage/edit', params)
}
//查询组合投放列表
export async function market_couponGroups_getList(params) {
  return apiByGet('/chagoi-bar-order/v1/couponSaasPackage/selectAll', params)
}
//查询组合投放详情
export async function market_couponGroups_getDetail(params) {
  return apiByGet('/chagoi-bar-order/v1/couponSaasPackage/selectOne', params)
}
//启停组合投放详情
export async function market_couponGroups_stop(params) {
  return apiByPostJson('/chagoi-bar-order/v1/couponSaasPackage/stop', params)
}
//查询营销设置
export async function market_getSetting(params) {
  return apiByGet('/chagoi-bar-order/v1/storeMarket/getConfig', params)
}
//营销设置
export async function market_setting(params) {
  return apiByPostJson('/chagoi-bar-order/v1/storeMarket/edit', params)
}
//卡券推送保存
export async function market_cardPushAave(data) {
  return apiByPostJson('/chagoi-bar-order/v1/templateMsg/send', data)
}
//卡券推送列表
export async function market_cardPushList(data) {
  return apiByGet('/chagoi-bar-order/v1/templateMsg/list', data)
}