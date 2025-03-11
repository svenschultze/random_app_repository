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
        'voix-description': 'Home page showing daily fitness summary and activity dashboard'
      }
    },
    {
      path: '/workouts',
      name: 'workouts',
      component: () => import('../views/WorkoutsView.vue'),
      meta: {
        'voix-description': 'Workout history page showing all recorded workout sessions'
      }
    },
    {
      path: '/add-workout',
      name: 'add-workout',
      component: () => import('../views/AddWorkoutView.vue'),
      meta: {
        'voix-description': 'Form to add a new workout session'
      }
    },
    {
      path: '/edit-workout/:id',
      name: 'edit-workout',
      component: () => import('../views/EditWorkoutView.vue'),
      meta: {
        'voix-description': 'Form to edit an existing workout session'
      }
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('../views/StatsView.vue'),
      meta: {
        'voix-description': 'Statistics and analytics page showing fitness data over time'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        'voix-description': 'User settings page for customizing fitness goals'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'About page with information about the FitTrack Demo application'
      }
    },
  ],
})

export default router
