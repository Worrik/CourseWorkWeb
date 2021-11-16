import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'
import axios from "axios";
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";

Vue.use(VueRouter)

Vue.config.productionTip = false
Vue.prototype.$http = axios;
// Vue.prototype.$hostname = "http://127.0.0.1:8000";
Vue.prototype.$hostname = "https://course-work-rp.herokuapp.com";

const routes = [
  {
    path: '/login',
    component: {
      render: (h) => h(Login)
    }
  },
  {
    path: '/dashboard',
    component: {
      render: (h) => h(Dashboard)
    }
  }
]
const router = new VueRouter({
  routes: routes,
  mode: "history"
})

const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
  router.push('dashboard')
}
else {
  router.push('login')
}

new Vue({
  router,
  vuetify,
  iconfont: 'fa',
  render: h => h(App),
}).$mount('#app')
