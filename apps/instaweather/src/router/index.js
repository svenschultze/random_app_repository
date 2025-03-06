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
        'voix-description': 'Home page showing current weather and forecast for your location'
      }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
      meta: {
        'voix-description': 'Search for weather in a specific city or location'
      }
    },
    {
      path: '/details/:location',
      name: 'details',
      component: () => import('../views/DetailsView.vue'),
      meta: {
        'voix-description': 'Detailed weather information including hourly and 7-day forecast'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: {
        'voix-description': 'Configure app preferences like temperature units and notifications'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'Information about the InstaWeather app'
      }
    },
  ],
})

export default router
