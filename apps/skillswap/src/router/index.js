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
        'voix-description': 'Landing page showcasing SkillSwap benefits, features, and allowing users to sign up or explore more'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: {
        'voix-description': 'Registration page where new users can create an account'
      }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/OnboardingView.vue'),
      meta: {
        'voix-description': 'Step-by-step guide to set up user profile, skills, and preferences'
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        'voix-description': 'Central hub showing matches, sessions, and personalized content'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        'voix-description': 'User profile showing personal details, skills, and reviews'
      }
    },
    {
      path: '/matches',
      name: 'matches',
      component: () => import('../views/MatchesView.vue'),
      meta: {
        'voix-description': 'Discovery page to find potential skill swap partners'
      }
    },
    {
      path: '/messages',
      name: 'messages',
      component: () => import('../views/MessagesView.vue'),
      meta: {
        'voix-description': 'Messaging interface to communicate with matches'
      }
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: () => import('../views/ScheduleView.vue'),
      meta: {
        'voix-description': 'Calendar interface to schedule and manage sessions'
      }
    },
    {
      path: '/session/:id',
      name: 'session',
      component: () => import('../views/SessionView.vue'),
      meta: {
        'voix-description': 'Video chat interface for live skill exchange sessions'
      }
    },
    {
      path: '/review/:id',
      name: 'review',
      component: () => import('../views/ReviewView.vue'),
      meta: {
        'voix-description': 'Form to provide feedback after a session'
      }
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/HelpView.vue'),
      meta: {
        'voix-description': 'Support center with FAQs and contact options'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        'voix-description': 'User settings to manage account, privacy, and preferences'
      }
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationsView.vue'),
      meta: {
        'voix-description': 'List of all notifications and updates'
      }
    }
  ]
})

export default router
