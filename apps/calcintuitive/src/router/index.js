import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        'voix-description': 'Calculator home page with the main input canvas where you can perform calculations'
      }
    },
    {
      path: '/advanced',
      name: 'advanced',
      component: () => import('../views/AdvancedView.vue'),
      meta: {
        'voix-description': 'Advanced calculator features including symbolic math, matrices, and more'
      }
    },
    {
      path: '/graph',
      name: 'graph',
      component: () => import('../views/GraphView.vue'),
      meta: {
        'voix-description': 'Graphing mode for visualizing mathematical functions'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'About page with information about the CalcIntuitive app'
      }
    },
  ],
})

export default router
