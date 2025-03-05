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
        'voix-description': 'Home page of PollPal. Shows featured poll and recent polls.'
      }
    },
    {
      path: '/poll/:id',
      name: 'poll-detail',
      component: () => import('../views/PollDetailView.vue'),
      meta: {
        'voix-description': 'Detail page for a specific poll. Shows poll options, results, and comments.'
      }
    },
    {
      path: '/create',
      name: 'create-poll',
      component: () => import('../views/CreatePollView.vue'),
      meta: {
        'voix-description': 'Create a new poll with custom question and options.'
      }
    }
  ],
})

export default router
