import native_http from './modules/native_http'
import memoryCache from './modules/memoryCache'
import { createStore } from 'vuex'
const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    native_http,
    memoryCache
  },
  strict: debug
})

