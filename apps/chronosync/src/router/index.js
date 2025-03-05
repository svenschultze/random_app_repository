import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        voixDescription: 'Start page of the application. Shows welcome message and key features.'
      }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/CalendarView.vue'),
      meta: {
        voixDescription: 'Calendar main view showing daily, weekly, or monthly events.'
      }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/TasksView.vue'),
      meta: {
        voixDescription: 'Task management page showing your tasks and project items.'
      }
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/AnalyticsView.vue'),
      meta: {
        voixDescription: 'Analytics dashboard showing metrics and insights about your calendar usage and productivity.'
      }
    },
    {
      path: '/availability',
      name: 'availability',
      component: () => import('../views/AvailabilityView.vue'),
      meta: {
        voixDescription: 'Multi-user availability view for coordinating meeting times across team members.'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        voixDescription: 'Settings page for configuring application preferences, time zones, and user options.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        voixDescription: 'About page with information about the ChronoSync application.'
      }
    }
  ],
})

export default router
