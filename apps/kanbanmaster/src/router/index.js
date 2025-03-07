import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
      meta: {
        'voix-description': 'Project dashboard - Shows all projects with options to create, edit, and delete projects'
      }
    },
    {
      path: '/project/:id',
      name: 'board',
      component: () => import('../views/BoardView.vue'),
      meta: {
        'voix-description': 'Kanban board - Displays all tasks for a specific project with columns and drag-and-drop functionality'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'About page - Information about KanbanMaster application'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        'voix-description': 'Settings page - Customize application settings and preferences'
      }
    }
  ]
})

export default router
