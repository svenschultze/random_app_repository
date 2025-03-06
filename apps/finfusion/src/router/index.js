import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        'voix-description': 'Dashboard page showing financial overview with account summaries, recent transactions and performance metrics'
      }
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: () => import('../views/AccountsView.vue'),
      meta: {
        'voix-description': 'Accounts page displaying all bank accounts and credit cards with transaction history'
      }
    },
    {
      path: '/transactions/:id',
      name: 'transactionDetail',
      component: () => import('../views/TransactionDetailView.vue'),
      meta: {
        'voix-description': 'Transaction detail page showing complete information about a specific transaction'
      }
    },
    {
      path: '/investments',
      name: 'investments',
      component: () => import('../views/InvestmentsView.vue'),
      meta: {
        'voix-description': 'Investments page showing portfolio performance, stock positions, and market trends'
      }
    },
    {
      path: '/investments/:symbol',
      name: 'investmentDetail',
      component: () => import('../views/InvestmentDetailView.vue'),
      meta: {
        'voix-description': 'Investment detail page showing complete information about a specific stock or investment'
      }
    },
    {
      path: '/budgeting',
      name: 'budgeting',
      component: () => import('../views/BudgetingView.vue'),
      meta: {
        'voix-description': 'Budgeting page for tracking expenses, setting budget goals, and monitoring financial progress'
      }
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationsView.vue'),
      meta: {
        'voix-description': 'Notifications page showing alerts, reminders, and important updates about your finances'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        'voix-description': 'Settings page for customizing application preferences and demo data options'
      }
    }
  ],
})

export default router
