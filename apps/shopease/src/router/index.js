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
        'voix-description': 'Homepage of ShopEase, showcasing featured products, categories, and deals'
      }
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
      meta: {
        'voix-description': 'Browse all products available in our store with filtering options'
      }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoriesView.vue'),
      meta: {
        'voix-description': 'Browse products by categories like Electronics, Clothing, Home & Kitchen, and more'
      }
    },
    {
      path: '/categories/:category',
      name: 'category',
      component: () => import('../views/ProductsView.vue'),
      meta: {
        'voix-description': 'Browse products in a specific category'
      }
    },
    {
      path: '/deals',
      name: 'deals',
      component: () => import('../views/DealsView.vue'),
      meta: {
        'voix-description': 'View current deals, promotions, and discounted products'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'Learn about ShopEase, our mission, and our team'
      }
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
})

export default router
