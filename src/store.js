import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logged: false,
    status: null,
    bottomNav: 0,
    baseURL: 'https://cors-anywhere.herokuapp.com/http://35.204.234.73/alfresco/api/-default-/public/'
  },
  mutations: {
  },
  actions: {
  }
})
