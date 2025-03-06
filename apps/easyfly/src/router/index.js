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
        'voix-description': 'Home page with flight search. Search for flights, view recent searches and deals.'
      }
    },
    {
      path: '/search-results',
      name: 'searchResults',
      component: () => import('../views/SearchResultsView.vue'),
      meta: {
        'voix-description': 'Flight search results showing available flights based on your search criteria.'
      }
    },
    {
      path: '/flight-details/:id',
      name: 'flightDetails',
      component: () => import('../views/FlightDetailsView.vue'),
      meta: {
        'voix-description': 'Flight details page showing specific information about a selected flight.'
      }
    },
    {
      path: '/booking/:id',
      name: 'booking',
      component: () => import('../views/BookingView.vue'),
      meta: {
        'voix-description': 'Booking page where you can enter passenger details and payment information.'
      }
    },
    {
      path: '/confirmation/:id',
      name: 'confirmation',
      component: () => import('../views/ConfirmationView.vue'),
      meta: {
        'voix-description': 'Booking confirmation page showing your confirmed flight details.'
      }
    },
    {
      path: '/my-bookings',
      name: 'myBookings',
      component: () => import('../views/MyBookingsView.vue'),
      meta: {
        'voix-description': 'My bookings page showing all your booked flights.'
      }
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: () => import('../views/AlertsView.vue'),
      meta: {
        'voix-description': 'Alerts page for managing price alerts and flight status notifications.'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        'voix-description': 'Settings page for managing app preferences, local data storage, and notifications.'
      }
    },
    {
      path: '/splash',
      name: 'splash',
      component: () => import('../views/SplashView.vue'),
      meta: {
        'voix-description': 'Splash screen with app logo that automatically redirects to home page.'
      }
    }
  ],
})

export default router
