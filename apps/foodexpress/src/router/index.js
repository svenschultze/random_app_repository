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
        'voix-description': 'Home page showing a list of available restaurants'
      }
    },
    {
      path: '/restaurant/:id',
      name: 'restaurant',
      component: () => import('../views/RestaurantView.vue'),
      meta: {
        'voix-description': 'Restaurant details page showing menu items by category'
      }
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      meta: {
        'voix-description': 'Cart page showing all items added to your order'
      }
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: {
        'voix-description': 'Checkout page for completing your order'
      }
    },
    {
      path: '/confirmation',
      name: 'confirmation',
      component: () => import('../views/ConfirmationView.vue'),
      meta: {
        'voix-description': 'Order confirmation page showing order details and status'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'About page with information about FoodExpress'
      }
    },
  ],
})

export default router
