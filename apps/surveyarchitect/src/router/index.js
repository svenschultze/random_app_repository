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
        'voix-description': 'Start page of the Survey Architect application. Shows a welcome screen with options to create or load surveys.'
      }
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('../views/EditorView.vue'),
      meta: {
        'voix-description': 'Survey editor workspace. Contains tools to design and configure surveys with questions, logic, and translations.'
      }
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import('../views/PreviewView.vue'),
      meta: {
        'voix-description': 'Full preview of the current survey design. Shows how the exported survey will appear to respondents.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'About page with information about the Survey Architect application.'
      }
    },
  ],
})

export default router
