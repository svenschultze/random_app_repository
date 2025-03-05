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
      meta: { 
        requiresAuth: false,
        'voix-description': 'Home page of RentRadar. Shows featured properties and search options.'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { 
        requiresAuth: false,
        'voix-description': 'Login page where users can sign in to their RentRadar account.'
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
      meta: { 
        requiresAuth: false,
        'voix-description': 'Signup page where new users can create a RentRadar account.'
      }
    },
    {
      path: '/listings',
      name: 'listings',
      component: () => import('../views/ListingsView.vue'),
      meta: { 
        requiresAuth: false,
        'voix-description': 'Property listings page where users can browse and filter available rental properties.'
      }
    },
    {
      path: '/listings/:id',
      name: 'listing-detail',
      component: () => import('../views/ListingDetailView.vue'),
      meta: { 
        requiresAuth: false,
        'voix-description': 'Detailed view of a specific property listing with images, amenities, and contact options.'
      }
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/FavoritesView.vue'),
      meta: { 
        requiresAuth: true,
        'voix-description': 'User\'s saved favorite properties that they can revisit or remove from their collection.'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { 
        requiresAuth: true,
        'voix-description': 'User profile page where account details and preferences can be managed.'
      }
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: () => import('../views/AlertsView.vue'),
      meta: { 
        requiresAuth: true,
        'voix-description': 'Page for managing property alerts where users can create and edit notifications for new matching listings.'
      }
    },
    {
      path: '/landlord',
      name: 'landlord',
      component: () => import('../views/LandlordView.vue'),
      meta: { 
        requiresAuth: true, 
        requiresLandlord: true,
        'voix-description': 'Landlord portal for property owners to manage their listings and tenant communications.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { 
        requiresAuth: false,
        'voix-description': 'About page with information about RentRadar, its services, and company details.'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { 
        requiresAuth: false,
        'voix-description': 'Error page displayed when a user navigates to a route that does not exist.'
      }
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