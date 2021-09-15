// initial state
const state = () => ({
  hello: "hello",
  isRuning: false,
  baseUrl: null
})


// mutations
const mutations = {
  setIsRuning(state, isRuning) {
    state.isRuning = isRuning
  },
  setBaseUrl(state, baseUrl) {
    state.baseUrl = baseUrl
  },
  decrementProductInventory(state, { id }) {
    const product = state.all.find(product => product.id === id)
    product.inventory--
  }
}

export default {
  namespaced: true,
  state,
  mutations
}