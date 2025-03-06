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
        'voix-description': 'Main dashboard with service overview, metrics, and insights'
      }
    },
    {
      path: '/service/:id',
      name: 'service-detail',
      component: () => import('../views/ServiceDetailView.vue'),
      meta: {
        'voix-description': 'Detailed metrics and logs for a specific microservice'
      }
    },
    {
      path: '/logs',
      name: 'logs',
      component: () => import('../views/LogsView.vue'),
      meta: {
        'voix-description': 'System-wide log viewer for all microservices'
      }
    },
    {
      path: '/insights',
      name: 'insights',
      component: () => import('../views/InsightsView.vue'),
      meta: {
        'voix-description': 'System insights and detected patterns across all services'
      }
    },
    {
      path: '/comparison',
      name: 'comparison',
      component: () => import('../views/ComparisonView.vue'),
      meta: {
        'voix-description': 'Compare metrics across all microservices'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'About this application'
      }
    },
    // Catch-all route for 404 (Page not found)
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'Page not found'
      }
    }
  ],
})

export default router
