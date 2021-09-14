import native_ws from './modules/native_ws'
import { createStore } from 'vuex'
const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    native_ws
  },
  strict: debug
})

