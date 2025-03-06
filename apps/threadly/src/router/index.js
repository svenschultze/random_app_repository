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
        'voix-description': 'Home feed displaying recent threads and posts'
      }
    },
    {
      path: '/thread/:id',
      name: 'thread',
      component: () => import('../views/ThreadView.vue'),
      meta: {
        'voix-description': 'Thread detail view showing a conversation with its replies'
      }
    },
    {
      path: '/profile/:id?',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        'voix-description': 'User profile page showing user information and their activity'
      }
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationsView.vue'),
      meta: {
        'voix-description': 'Notifications page showing recent interactions and mentions'
      }
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('../views/ExploreView.vue'),
      meta: {
        'voix-description': 'Explore page for discovering trending topics and content'
      }
    },
    {
      path: '/compose',
      name: 'compose',
      component: () => import('../views/ComposeView.vue'),
      meta: {
        'voix-description': 'Compose page for creating a new thread or post'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        'voix-description': 'Settings page for customizing user preferences'
      }
    }
  ]
})

export default router
