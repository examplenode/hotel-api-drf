import { createRouter, createWebHistory } from 'vue-router'
import { auth } from './api'
import LoginView from './views/LoginView.vue'
import ListView from './views/ListView.vue'
import DetailView from './views/DetailView.vue'
import FormView from './views/FormView.vue'

const entity = ':entity(rooms|guests|bookings)'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/rooms' },
    { path: '/login', component: LoginView },
    { path: `/${entity}`, component: ListView, meta: { auth: true } },
    { path: `/${entity}/new`, component: FormView, meta: { auth: true } },
    { path: `/${entity}/:id(\\d+)`, component: DetailView, meta: { auth: true } },
    { path: `/${entity}/:id(\\d+)/edit`, component: FormView, meta: { auth: true } },
    { path: '/:any(.*)', redirect: '/rooms' },
  ],
})

router.beforeEach((to) => {
  if (to.meta.auth && !auth.token) {
    return { path: '/login', query: { next: to.fullPath } }
  }
})

export default router
