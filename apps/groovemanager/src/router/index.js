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
        'voix-description': 'Home page with library browser. Shows albums, tracks, and artists.'
      }
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: () => import('../views/PlaylistsView.vue'),
      meta: {
        'voix-description': 'Playlists page. Lists all your playlists and allows creating new ones.'
      }
    },
    {
      path: '/playlist/:id',
      name: 'playlist',
      component: () => import('../views/PlaylistView.vue'),
      meta: {
        'voix-description': 'Single playlist view. Shows all tracks in the selected playlist.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'About page. Contains information about the GrooveManager application.'
      }
    },
  ],
})

export default router
