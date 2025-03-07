import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        'voix-description': 'Dashboard with overview of your fuel usage, recent fill-ups, and cheapest stations'
      }
    },
    {
      path: '/stations',
      name: 'stations',
      component: () => import('../views/StationsView.vue'),
      meta: {
        'voix-description': 'Browse all gas stations, search, and filter by price'
      }
    },
    {
      path: '/fillups',
      name: 'fillups',
      component: () => import('../views/FillUpsView.vue'),
      meta: {
        'voix-description': 'View your complete fill-up history and consumption details'
      }
    },
    {
      path: '/fillups/add',
      name: 'add-fillup',
      component: () => import('../views/AddFillUpView.vue'),
      meta: {
        'voix-description': 'Add a new fuel fill-up record to your history'
      }
    },
    {
      path: '/fillups/edit/:id',
      name: 'edit-fillup',
      component: () => import('../views/EditFillUpView.vue'),
      meta: {
        'voix-description': 'Edit an existing fill-up record'
      }
    }
  ],
})

export default router
