import Vue from 'vue'
import Vuex from 'vuex'
import eurest from './eurest'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    eurest
  }
})

export default store
