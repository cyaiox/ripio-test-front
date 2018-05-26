import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import NProgress from 'vue-nprogress'
import { sync } from 'vuex-router-sync'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters'
import { TOGGLE_SIDEBAR } from 'vuex-store/mutation-types'

Vue.router = router
Vue.use(VueAxios, axios)
Vue.use(VueAuth, {
  auth: {
    request: function (req, token) {
      req.headers['Authorization'] = 'Token ' + token
    },
    response: function (res) {
      return (res.data || {}).token
    }
  },
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  loginData: { url: 'http://localhost:8000/api-token-auth/', fetchUser: false },
  refreshData: { enabled: false }
})

fontawesome.library.add(solid)

Vue.use(Buefy, {
  defaultIconPack: 'fas'
})

Vue.use(NProgress)

Vue.use(Vuelidate)

// Enable devtools
Vue.config.devtools = true

sync(store, router)

const nprogress = new NProgress({ parent: '.nprogress-container' })

const { state } = store

router.beforeEach((route, redirect, next) => {
  if (state.app.device.isMobile && state.app.sidebar.opened) {
    store.commit(TOGGLE_SIDEBAR, false)
  }
  next()
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const app = new Vue({
  router,
  store,
  nprogress,
  ...App
})

export { app, router, store }
