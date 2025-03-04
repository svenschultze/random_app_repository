import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/listings',
      name: 'listings',
      component: () => import('../views/ListingsView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/listings/:id',
      name: 'listing-detail',
      component: () => import('../views/ListingDetailView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/FavoritesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: () => import('../views/AlertsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/landlord',
      name: 'landlord',
      component: () => import('../views/LandlordView.vue'),
      meta: { requiresAuth: true, requiresLandlord: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { requiresAuth: false }
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const auth = getAuth()
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresLandlord = to.matched.some(record => record.meta.requiresLandlord)
  
  onAuthStateChanged(auth, (user) => {
    // Check if route requires authentication but user is not logged in
    if (requiresAuth && !user) {
      next({ name: 'login', query: { redirect: to.fullPath } })
    } 
    // Check if route requires landlord role but user doesn't have it
    else if (requiresLandlord) {
      // In a real app, we'd check the user's role from Firestore here
      // For now, we'll just check a hardcoded role
      const isLandlord = user && user.email === 'landlord@example.com'
      if (!isLandlord) {
        next({ name: 'home' })
      } else {
        next()
      }
    } 
    // For other routes, just proceed
    else {
      next()
    }
  })
})

export default router
