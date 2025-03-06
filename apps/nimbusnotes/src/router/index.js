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
        'voix-description': 'Dashboard view showing recent notes, pinned items, and quick actions'
      }
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('../views/NotesListView.vue'),
      meta: {
        'voix-description': 'View all your notes, organized by folders and categories'
      }
    },
    {
      path: '/notes/:id',
      name: 'note-detail',
      component: () => import('../views/NoteDetailView.vue'),
      meta: {
        'voix-description': 'Create or edit a note with rich text formatting'
      }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
      meta: {
        'voix-description': 'Search through all your notes with advanced filtering options'
      }
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import('../views/TagManagementView.vue'),
      meta: {
        'voix-description': 'Manage your note tags and categories'
      }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/CalendarView.vue'),
      meta: {
        'voix-description': 'View your notes organized by date on a calendar or timeline'
      }
    },
    {
      path: '/share',
      name: 'share',
      component: () => import('../views/ShareView.vue'),
      meta: {
        'voix-description': 'Share notes and collaborate with others'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        'voix-description': 'Customize your NimbusNotes experience with personalization options'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'Learn about NimbusNotes app and its features'
      }
    },
  ],
})

export default router
