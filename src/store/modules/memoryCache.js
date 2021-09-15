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
}

export default {
  namespaced: true,
  state,
  mutations
}