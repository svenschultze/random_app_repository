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
    // Training Programs Routes
    {
      path: '/programs',
      name: 'programs',
      component: () => import('../views/ProgramsView.vue'),
      meta: {
        'voix-description': 'View and manage training programs and workout plans'
      }
    },
    {
      path: '/programs/:id',
      name: 'program-detail',
      component: () => import('../views/ProgramDetailView.vue'),
      meta: {
        'voix-description': 'View details and progress for a specific training program'
      }
    },
    // Interval Workouts Routes
    {
      path: '/interval-workouts',
      name: 'interval-workouts',
      component: () => import('../views/IntervalWorkoutsView.vue'),
      meta: {
        'voix-description': 'Browse and manage interval workouts'
      }
    },
    {
      path: '/interval-workouts/:id',
      name: 'interval-workout',
      component: () => import('../views/IntervalWorkoutView.vue'),
      meta: {
        'voix-description': 'Interval workout timer and guidance'
      }
    },
    {
      path: '/interval-workouts/:id/edit',
      name: 'edit-interval-workout',
      component: () => import('../views/EditIntervalWorkoutView.vue'),
      meta: {
        'voix-description': 'Edit an existing interval workout'
      }
    },
    {
      path: '/interval-workouts/create',
      name: 'create-interval-workout',
      component: () => import('../views/CreateIntervalWorkoutView.vue'),
      meta: {
        'voix-description': 'Create a new custom interval workout'
      }
    },
    {
      path: '/workout-history',
      name: 'workout-history',
      component: () => import('../views/WorkoutHistoryView.vue'),
      meta: {
        'voix-description': 'View detailed history of all workouts including interval workouts'
      }
    }
  ],
})

export default router
