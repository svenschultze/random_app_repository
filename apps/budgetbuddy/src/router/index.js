import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OnboardingView from '../views/OnboardingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingView
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/TransactionsView.vue')
    },
    {
      path: '/budgets',
      name: 'budgets',
      component: () => import('../views/BudgetsView.vue')
    },
    {
      path: '/savings',
      name: 'savings',
      component: () => import('../views/SavingsView.vue')
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/AnalyticsView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router