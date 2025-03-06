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
        'voix-description': 'Start page of the application. Shows available government services and provides an overview of the platform.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'About page with information about the digital government service platform.'
      }
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/ServicesView.vue'),
      meta: {
        'voix-description': 'Overview of all available government services.'
      }
    },
    {
      path: '/service/:id',
      name: 'service-detail',
      component: () => import('../views/ServiceDetailView.vue'),
      meta: {
        'voix-description': 'Details about a specific government service including requirements and process steps.'
      }
    },
    {
      path: '/apply/:id',
      name: 'application-form',
      component: () => import('../views/ApplicationFormView.vue'),
      meta: {
        'voix-description': 'Application form for a specific government service with step-by-step guided process.'
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        'voix-description': 'Personal dashboard showing status of submitted applications and user profile.'
      }
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/HelpView.vue'),
      meta: {
        'voix-description': 'Help center with guides, FAQs and support options.'
      }
    },
  ],
})

export default router
