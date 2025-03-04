import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { 
        requiresAuth: true,
        'voix-description': 'Home page displaying daily challenges and recommended exercises for mental fitness'
      }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/OnboardingView.vue'),
      meta: {
        'voix-description': 'User onboarding flow to set up preferences and goals for mental fitness training'
      }
    },
    {
      path: '/challenges',
      name: 'challenges',
      component: () => import('../views/ChallengesView.vue'),
      meta: { 
        requiresAuth: true,
        'voix-description': 'Browse all available mental fitness challenges and exercises' 
      }
    },
    {
      path: '/challenge/:id',
      name: 'challenge-detail',
      component: () => import('../views/ChallengeDetailView.vue'),
      meta: { 
        requiresAuth: true,
        'voix-description': 'Detailed view for a specific mental fitness challenge with instructions and interactive exercise'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { 
        requiresAuth: true,
        'voix-description': 'User profile page showing progress, achievements, and personal settings'
      }
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('../views/LeaderboardView.vue'),
      meta: { 
        requiresAuth: true,
        'voix-description': 'Leaderboard showing top performers and rankings in mental fitness challenges'
      }
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../views/CommunityView.vue'),
      meta: { 
        requiresAuth: true,
        'voix-description': 'Community forum to connect with other users, share experiences and tips for mental fitness'
      }
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // If route requires auth and user hasn't completed onboarding, redirect to onboarding
  if (to.meta.requiresAuth && !userStore.hasCompletedOnboarding) {
    next({ name: 'onboarding' })
  } else {
    next()
  }
})

export default router
