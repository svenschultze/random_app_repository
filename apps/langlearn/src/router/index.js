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
        'voix-description': 'Home page. Shows welcome screen and dashboard for logged-in users.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'About page. Information about the language learning app.'
      }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/OnboardingView.vue'),
      meta: {
        'voix-description': 'Onboarding page. Initial setup for new users including language selection and goal setting.'
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        'voix-description': 'Dashboard page. Shows progress, streak, and daily lessons.'
      }
    },
    {
      path: '/lessons',
      name: 'lessons',
      component: () => import('../views/LessonsView.vue'),
      meta: {
        'voix-description': 'Lessons page. Browse all available lessons by category and level.'
      }
    },
    {
      path: '/lesson/:id',
      name: 'lesson-detail',
      component: () => import('../views/LessonDetailView.vue'),
      props: true,
      meta: {
        'voix-description': 'Lesson detail page. Shows overview and exercises for a specific lesson.'
      }
    },
    {
      path: '/exercise/:lessonId/:exerciseId',
      name: 'exercise',
      component: () => import('../views/ExerciseView.vue'),
      props: true,
      meta: {
        'voix-description': 'Exercise page. Complete a specific language learning exercise.'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        'voix-description': 'Profile page. View and edit user profile information.'
      }
    },
    {
      path: '/badges',
      name: 'badges',
      component: () => import('../views/BadgesView.vue'),
      meta: {
        'voix-description': 'Badges page. View all earned and available achievement badges.'
      }
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('../views/LeaderboardView.vue'),
      meta: {
        'voix-description': 'Leaderboard page. Compare progress with other learners.'
      }
    },
    {
      path: '/challenges',
      name: 'challenges',
      component: () => import('../views/ChallengesView.vue'),
      meta: {
        'voix-description': 'Challenges page. Participate in daily and weekly challenges.'
      }
    },
    {
      path: '/vocabulary',
      name: 'vocabulary',
      component: () => import('../views/VocabularyView.vue'),
      meta: {
        'voix-description': 'Vocabulary page. Review and practice learned words and phrases.'
      }
    }
  ],
})

export default router
