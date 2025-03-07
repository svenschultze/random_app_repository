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
        'voix-description': 'Start page of the application. Shows onboarding or map view if already onboarded.'
      }
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('../views/ExploreView.vue'),
      meta: {
        'voix-description': 'Main map view showing nearby points of interest based on user preferences.'
      }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/OnboardingView.vue'),
      meta: {
        'voix-description': 'Onboarding process to collect user preferences for personalized recommendations.'
      }
    },
    {
      path: '/poi/:id',
      name: 'poiDetail',
      component: () => import('../views/PoiDetailView.vue'),
      meta: {
        'voix-description': 'Detailed view of a selected point of interest with navigation options.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'Information about the NearExplorer application and its features.'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        'voix-description': 'User profile page showing preferences and favorite locations.'
      }
    },
  ],
})

export default router
