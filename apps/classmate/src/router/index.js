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
        'voix-description': 'Dashboard showing today\'s schedule and upcoming events'
      }
    },
    {
      path: '/weekly',
      name: 'weekly',
      component: () => import('../views/WeeklyView.vue'),
      meta: {
        'voix-description': 'Weekly timetable showing all classes in a grid format'
      }
    },
    {
      path: '/daily/:date?',
      name: 'daily',
      component: () => import('../views/DailyView.vue'),
      meta: {
        'voix-description': 'Daily view showing detailed timeline of classes and events'
      }
    },
    {
      path: '/event/:id?',
      name: 'event',
      component: () => import('../views/EventDetailView.vue'),
      meta: {
        'voix-description': 'View or edit details of a class or academic event'
      }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/CalendarView.vue'),
      meta: {
        'voix-description': 'Month calendar view showing all events and deadlines'
      }
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationsView.vue'),
      meta: {
        'voix-description': 'List of notifications and upcoming event reminders'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        'voix-description': 'User profile and application settings'
      }
    }
  ]
})

export default router
