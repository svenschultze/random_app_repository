import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
      meta: {
        'voix-description': 'Willkommensseite der LebensReise App. Zeigt die Haupteingangspunkte zum Tagebuch, Gewohnheiten und Stimmungstracker.'
      }
    },
    {
      path: '/diary',
      name: 'diary',
      component: () => import('../views/DiaryView.vue'),
      meta: {
        'voix-description': 'Tagebuchbereich der App. Hier können Sie tägliche Einträge schreiben und vergangene Einträge ansehen.'
      }
    },
    {
      path: '/habits',
      name: 'habits',
      component: () => import('../views/HabitsView.vue'),
      meta: {
        'voix-description': 'Gewohnheiten-Tracker der App. Hier können Sie Ihre täglichen Gewohnheiten verfolgen und Fortschritte sehen.'
      }
    },
    {
      path: '/mood',
      name: 'mood',
      component: () => import('../views/MoodView.vue'),
      meta: {
        'voix-description': 'Stimmungstracker der App. Hier können Sie Ihre tägliche Stimmung erfassen und Trends über Zeit verfolgen.'
      }
    },
    {
      path: '/insights',
      name: 'insights',
      component: () => import('../views/InsightsView.vue'),
      meta: {
        'voix-description': 'Einsichten-Seite der App. Zeigt zusammengefasste Daten aus Tagebuch, Gewohnheiten und Stimmung.'
      }
    },
  ],
})

export default router
