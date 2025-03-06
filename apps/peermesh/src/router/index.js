import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('../views/WelcomeView.vue'),
      meta: {
        'voix-description': 'Welcome page with introduction to PeerMesh Chat and options to get started'
      }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/OnboardingView.vue'),
      meta: {
        'voix-description': 'Create your profile and get started with PeerMesh Chat'
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        'voix-description': 'Dashboard showing your chats and conversations'
      }
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      props: true,
      meta: {
        'voix-description': 'Chat with individual contacts in real-time'
      }
    },
    {
      path: '/group/:id',
      name: 'group',
      component: () => import('../views/GroupChatView.vue'),
      props: true,
      meta: {
        'voix-description': 'Group chat with multiple contacts'
      }
    },
    {
      path: '/pairing',
      name: 'pairing',
      component: () => import('../views/PairingView.vue'),
      meta: {
        'voix-description': 'Connect with peers via QR codes or manual tokens'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        'voix-description': 'Manage your profile and application settings'
      }
    }
  ]
})

// Add navigation guard to check user profile before accessing non-onboarding pages
router.beforeEach((to, from, next) => {
  // Get user profile from local storage
  const userProfile = localStorage.getItem('userProfile')
  
  // If no profile and not heading to welcome or onboarding, redirect to welcome
  if (!userProfile && 
      to.name !== 'welcome' && 
      to.name !== 'onboarding') {
    next({ name: 'welcome' })
  } else {
    next()
  }
})

export default router
