// initial state
const state = () => ({
  loadingText: "",
  isRuning: false
})


// mutations
const mutations = {
  setIsRuning(state, isRuning) {
    state.isRuning = isRuning
  }
}

export default {
  namespaced: true,
  state,
  mutations
}