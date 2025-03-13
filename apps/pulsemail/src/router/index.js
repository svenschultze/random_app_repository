import { createRouter, createWebHistory } from 'vue-router'
import InboxView from '../views/InboxView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inbox',
      component: InboxView,
      meta: {
        'voix-description': 'Inbox view displaying all emails grouped by date'
      }
    },
    {
      path: '/sent',
      name: 'sent',
      component: () => import('../views/SentView.vue'),
      meta: {
        'voix-description': 'Sent emails view displaying all emails you have sent'
      }
    },
    {
      path: '/email/:id',
      name: 'email-detail',
      component: () => import('../views/EmailDetailView.vue'),
      props: true,
      meta: {
        'voix-description': 'Email detail view showing the full content of a single email'
      }
    },
    {
      path: '/compose',
      name: 'email-compose',
      component: () => import('../views/ComposeView.vue'),
      meta: {
        'voix-description': 'Compose new email or reply to an existing email'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        'voix-description': 'Settings page for configuring application preferences'
      }
    }
  ]
})

export default router