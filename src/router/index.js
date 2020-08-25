import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@views/home.vue')
  },
  {
    path: '/example',
    name: 'Example',
    component: () => import('@examples/example.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () =>
      import('@views/about.vue')
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.APP_BASE_URL,
  routes
})

export default router
