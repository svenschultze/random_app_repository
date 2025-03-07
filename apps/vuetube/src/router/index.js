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
        'voix-description': 'Home page displaying recommended videos and content feed'
      }
    },
    {
      path: '/watch/:videoId',
      name: 'watch',
      component: () => import('../views/WatchView.vue'),
      meta: {
        'voix-description': 'Video playback page with comments and interactions'
      }
    },
    {
      path: '/channel/:channelId',
      name: 'channel',
      component: () => import('../views/ChannelView.vue'),
      meta: {
        'voix-description': 'Channel page showing creator information and uploaded videos'
      }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
      meta: {
        'voix-description': 'Search results page for finding videos'
      }
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('../views/UploadView.vue'),
      meta: {
        'voix-description': 'Upload page for creators to share new videos'
      }
    },
  ],
})

export default router
