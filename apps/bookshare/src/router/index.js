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
        'voix-description': 'Home page showing the library of available books'
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'About page with information about the BookShare application'
      }
    },
    {
      path: '/reader/:id',
      name: 'reader',
      component: () => import('../views/ReaderView.vue'),
      meta: {
        'voix-description': 'Book reader page where you can read and annotate books'
      }
    },
    {
      path: '/annotations/:id',
      name: 'annotations',
      component: () => import('../views/AnnotationsView.vue'),
      meta: {
        'voix-description': 'View all annotations for a specific book'
      }
    }
  ],
})

export default router
