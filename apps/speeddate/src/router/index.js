import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
      meta: {
        'voix-description': 'Landing page that showcases the SpeedDate app with clear value proposition and visuals'
      }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/OnboardingView.vue'),
      meta: {
        'voix-description': 'Introductory tour explaining the speed dating process'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: {
        'voix-description': 'Sign up page with email or social login options'
      }
    },
    {
      path: '/profile-setup',
      name: 'profile-setup',
      component: () => import('../views/ProfileSetupView.vue'),
      meta: {
        'voix-description': 'Profile creation with photo uploads, bio, interests, and dating preferences'
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        'voix-description': 'Central hub for the user displaying upcoming dates, notifications, and quick access to key functions'
      }
    },
    {
      path: '/queue',
      name: 'queue',
      component: () => import('../views/QueueView.vue'),
      meta: {
        'voix-description': 'Waiting room with countdown and icebreaker tips before a speed date'
      }
    },
    {
      path: '/video-call',
      name: 'video-call',
      component: () => import('../views/VideoCallView.vue'),
      meta: {
        'voix-description': 'Full-screen video interface with a visible countdown timer for the speed date'
      }
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('../views/FeedbackView.vue'),
      meta: {
        'voix-description': 'Post-call feedback screen with yes/no options and optional text feedback'
      }
    },
    {
      path: '/matches',
      name: 'matches',
      component: () => import('../views/MatchesView.vue'),
      meta: {
        'voix-description': 'List of mutual matches from speed dates'
      }
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      meta: {
        'voix-description': 'Chat interface for communication with matches'
      }
    },
    {
      path: '/insights',
      name: 'insights',
      component: () => import('../views/InsightsView.vue'),
      meta: {
        'voix-description': 'History and analytics about past dates and matches'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        'voix-description': 'Customizable settings for account management, dating preferences, and privacy'
      }
    }
  ]
})

export default router