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
        'voix-description': 'Start page of StadtMobil app. Shows welcome message and main navigation options.'
      }
    },
    {
      path: '/route',
      name: 'route',
      component: () => import('../views/RouteView.vue'),
      meta: {
        'voix-description': 'Plan a route page. Shows interactive route prediction with public transport options.'
      }
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: () => import('../views/TicketsView.vue'),
      meta: {
        'voix-description': 'Buy a ticket page. Shows available ticket options and pricing.'
      }
    },
    {
      path: '/planner',
      name: 'planner',
      component: () => import('../views/PlannerView.vue'),
      meta: {
        'voix-description': 'Custom route planner page. Allows searching for connections between any two cities.'
      }
    }
  ],
})

export default router
