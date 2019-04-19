import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import vSelect from 'vue-select'
import vuescroll from 'vue-scroll'


Vue.use(vuescroll)
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
  }
})

Vue.config.productionTip = false
Vue.component('v-select', vSelect)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
