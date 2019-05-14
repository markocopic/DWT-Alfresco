import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/contacts',
      name: 'about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/1',
      name: 'contacts',
      component: () => import('./views/Contacts.vue')
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('./views/Info.vue')
    },
    {
      path: '/barcode',
      name: 'barcode',
      component: () => import('./views/Barcode.vue')
    },
    {
      path: '/scanner',
      name: 'scanner',
      component: () => import('./views/Scanner.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('./views/Auth.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('./views/Search.vue')
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: () => import('./views/Chat.vue')
    },
    {
      path: '*',
      name: 'redirect',
      redirect: '/barcode'
    }
  ]
})
