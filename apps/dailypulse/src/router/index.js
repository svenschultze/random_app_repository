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
        'voix-description': 'Dashboard page showing summary of tasks, schedules, time tracking, and performance metrics'
      }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/TasksView.vue'),
      meta: {
        'voix-description': 'Task management page for viewing and managing tasks'
      }
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: () => import('../views/ScheduleView.vue'),
      meta: {
        'voix-description': 'Schedule page showing calendar with shifts and meetings'
      }
    },
    {
      path: '/time-tracking',
      name: 'time-tracking',
      component: () => import('../views/TimeTrackingView.vue'),
      meta: {
        'voix-description': 'Time tracking page for logging work hours and viewing timesheets'
      }
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
      meta: {
        'voix-description': 'Projects page for viewing and collaborating on projects'
      }
    },
    {
      path: '/performance',
      name: 'performance',
      component: () => import('../views/PerformanceView.vue'),
      meta: {
        'voix-description': 'Performance tracking page showing metrics and goal progress'
      }
    },
  ],
})

export default router
