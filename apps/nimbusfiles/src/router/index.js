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
        'voix-description': 'File explorer home page displaying your cloud files and folders'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'About page with information about the Nimbus Files application'
      }
    },
    {
      path: '/file/:id',
      name: 'fileDetail',
      component: () => import('../views/FileDetailView.vue'),
      meta: {
        'voix-description': 'File details page showing information and preview for the selected file'
      }
    },
    {
      path: '/shared',
      name: 'shared',
      component: () => import('../views/SharedView.vue'),
      meta: {
        'voix-description': 'Shared files page displaying files that have been shared with you'
      }
    },
    {
      path: '/trash',
      name: 'trash',
      component: () => import('../views/TrashView.vue'),
      meta: {
        'voix-description': 'Trash page showing recently deleted files that can be restored'
      }
    },
  ],
})

export default router
