import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OnboardingView from '../views/OnboardingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        'voix-description': 'Dashboard page showing budget overview, recent transactions, and quick actions'
      }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingView,
      meta: {
        'voix-description': 'Setup wizard to configure your personal finance settings and preferences'
      }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/TransactionsView.vue'),
      meta: {
        'voix-description': 'View and manage all your financial transactions'
      }
    },
    {
      path: '/budgets',
      name: 'budgets',
      component: () => import('../views/BudgetsView.vue'),
      meta: {
        'voix-description': 'Create and manage budget categories and spending limits'
      }
    },
    {
      path: '/savings',
      name: 'savings',
      component: () => import('../views/SavingsView.vue'),
      meta: {
        'voix-description': 'Set and track savings goals and progress'
      }
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/AnalyticsView.vue'),
      meta: {
        'voix-description': 'View financial reports and spending analytics'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        'voix-description': 'Manage your personal profile and account settings'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'Information about BudgetBuddy application and its features'
      }
    }
  ]
})

export default router