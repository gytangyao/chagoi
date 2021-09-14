// initial state
const state = () => ({
  hello: "hello",
  isRuning: false
})


// mutations
const mutations = {
  setIsRuning(state, isRuning) {
    state.isRuning = isRuning
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