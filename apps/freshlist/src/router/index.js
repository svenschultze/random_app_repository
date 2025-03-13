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
        'voix-description': 'Dashboard page showing user profile and grocery list summary'
      }
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('../views/ListView.vue'),
      meta: {
        'voix-description': 'Full grocery list view with all items and categories'
      }
    },
    {
      path: '/item/:id',
      name: 'item-detail',
      component: () => import('../views/ItemDetailView.vue'),
      meta: {
        'voix-description': 'Detailed view of a specific grocery item'
      }
    },
    {
      path: '/item/edit/:id',
      name: 'item-edit',
      component: () => import('../views/ItemEditView.vue'),
      meta: {
        'voix-description': 'Edit or add a grocery item'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        'voix-description': 'Application settings and user profile customization'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'Information about this demo application'
      }
    }
  ]
})

export default router