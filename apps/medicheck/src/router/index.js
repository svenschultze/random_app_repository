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
        'voix-description': 'Start page of the application. Shows welcome message and overview of MediCheck services.'
      }
    },
    {
      path: '/symptom-checker',
      name: 'symptom-checker',
      component: () => import('../views/SymptomCheckerView.vue'),
      meta: {
        'voix-description': 'Symptom Checker page allows users to input symptoms and receive potential diagnoses.'
      }
    },
    {
      path: '/symptom-result',
      name: 'symptom-result',
      component: () => import('../views/SymptomResultView.vue'),
      meta: {
        'voix-description': 'Shows potential diagnoses and recommendations based on user symptoms.'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        'voix-description': 'User profile page showing personal information and health data.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'About page with information about MediCheck, disclaimers, and regulatory information.'
      }
    },
  ],
})

export default router
