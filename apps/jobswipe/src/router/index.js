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
        'voix-description': 'Home page of JobSwipe. Shows introduction and login/signup options.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'Information about JobSwipe app and its functionality.'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        'voix-description': 'Login page for existing users to access their account.'
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
      meta: {
        'voix-description': 'Signup page for new users to create an account as a candidate or company.'
      }
    },
    {
      path: '/swipe',
      name: 'swipe',
      component: () => import('../views/SwipeView.vue'),
      meta: {
        'voix-description': 'Main swiping interface to like or pass jobs/candidates.'
      }
    },
    {
      path: '/matches',
      name: 'matches',
      component: () => import('../views/MatchesView.vue'),
      meta: {
        'voix-description': 'List of all successful matches between candidates and companies.'
      }
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      meta: {
        'voix-description': 'Chat interface to communicate with matches.'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        'voix-description': 'User profile page to view and edit personal information.'
      }
    },
  ],
})

export default router
