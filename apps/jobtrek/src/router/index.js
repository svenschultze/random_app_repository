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
        'voix-description': 'Start page of the application. Shows welcome screen and onboarding process for new users.'
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        'voix-description': 'Main dashboard with daily task overview and career progress summary.'
      }
    },
    {
      path: '/goals',
      name: 'goals',
      component: () => import('../views/GoalsView.vue'),
      meta: {
        'voix-description': 'Goal management page where you can set, edit, and track professional goals.'
      }
    },
    {
      path: '/daily-log',
      name: 'daily-log',
      component: () => import('../views/DailyLogView.vue'),
      meta: {
        'voix-description': 'Daily reflection journal for tracking achievements and progress notes.'
      }
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/AnalyticsView.vue'),
      meta: {
        'voix-description': 'Performance analytics and insights based on your goal progress and activities.'
      }
    },
    {
      path: '/network',
      name: 'network',
      component: () => import('../views/NetworkView.vue'),
      meta: {
        'voix-description': 'Community networking page to connect with other professionals.'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        'voix-description': 'User profile and account settings page.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'Information about JobTrek application and its features.'
      }
    },
  ],
})

export default router
