import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App'
import Home from './pages/Home'
import Edit from './pages/Edit'

Vue.use(VueRouter)
const routes = [
	{ path: '/', name:'home', component: Home },
	{ path: '/note/:id', name:'note', component: Edit }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
}).$mount('#app')
