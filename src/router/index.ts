import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../pages/index.vue') },
  { path: '/about-josh', component: () => import('../pages/about-josh.vue') },
  { path: '/art-gallery', component: () => import('../pages/art-gallery.vue') },
  { path: '/juke-box', component: () => import('../pages/juke-box.vue') },
  { path: '/mystery', component: () => import('../pages/mystery.vue') },
  { path: '/personal-projects', component: () => import('../pages/personal-projects.vue') },
  { path: '/stage-select', component: () => import('../pages/stage-select.vue') },
  { path: '/work-history', component: () => import('../pages/work-history.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
