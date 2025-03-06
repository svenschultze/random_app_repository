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
        'voix-description': 'Main page of NewsPulse. Shows current headlines and interactive news experience.'
      }
    },
    {
      path: '/headlines',
      name: 'headlines',
      component: () => import('../views/HeadlinesView.vue'),
      meta: {
        'voix-description': 'Browse all news headlines with filters by category.'
      }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/HeadlinesView.vue'),
      meta: {
        'voix-description': 'Browse news by categories and topics.'
      }
    },
    {
      path: '/trending',
      name: 'trending',
      component: () => import('../views/HeadlinesView.vue'),
      meta: {
        'voix-description': 'See trending and most popular news stories.'
      }
    },
    {
      path: '/saved',
      name: 'saved',
      component: () => import('../views/HeadlinesView.vue'),
      meta: {
        'voix-description': 'View your saved articles and stories.'
      }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/HeadlinesView.vue'),
      meta: {
        'voix-description': 'Search results for news articles.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'Information about the NewsPulse platform and its features.'
      }
    },
    {
      path: '/story/:id',
      name: 'story',
      component: () => import('../views/StoryView.vue'),
      meta: {
        'voix-description': 'Immersive story page with dynamic content and interactive elements.'
      }
    }
  ],
})

export default router
