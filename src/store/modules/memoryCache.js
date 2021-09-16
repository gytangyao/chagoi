const state = () => ({
  UserId: null,
  StoreId: null,
  StoreName: null,
  DeviceId: null,
  DeviceName: null,
  UserName: null,
  SureName: null,
  AccessToken: null,
  UnitFindUnCompleteResDto: {},
  AccountManagers: [],
  Routers: [],
  TableZones: [],
  CommodityTypes: [],
  MealConfig: {},
  PushSwitch: {},
  GatewayHost: null,
  WebsocketUri: null,
  OverTablePrintDetail: false,
  OverTablePrintPre: false,
  IsTouchMode: false,
  HasNewVersion: false,
  PinyinItemCaches: [],
  PayRemarks: []
})


// getters
const getters = {
  accessToken: state => {
    return state.AccessToken
  }
}



// mutations
const mutations = {
  setAccessToken(state, accessToken) {
    state.AccessToken = accessToken
  },
  setSureName(state, sureName) {
    state.SureName = sureName
  },
  setStoreId(state, storeId) {
    state.StoreId = storeId
  },
  setStoreName(state, storeName) {
    state.StoreName = storeName
  },
  setUserId(state, userId) {
    state.UserId = userId
  },
  setUserName(state, userName) {
    state.UserName = userName
  },
  setDeviceId(state, deviceId) {
    state.DeviceId = deviceId
  },
  setDeviceName(state, deviceName) {
    state.DeviceName = deviceName
  },
  setGatewayHost(state, gatewayHost) {
    state.GatewayHost = gatewayHost
  },
  setWebsocketUri(state, websocketUri) {
    state.WebsocketUri = websocketUri
  },
  setPushSwitch(state, pushSwitch) {
    state.PushSwitch = pushSwitch
  },
  setRouters(state, routers) {
    state.Routers = routers
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}