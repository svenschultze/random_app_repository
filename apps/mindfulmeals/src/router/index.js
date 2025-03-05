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
        'voix-description': 'Dashboard and landing page for MindfulMeals. Provides an overview of your meal plan, nutrition summary, and quick access to app features.'
      }
    },
    {
      path: '/meal-plan',
      name: 'mealPlan',
      component: () => import('../views/MealPlanView.vue'),
      meta: {
        'voix-description': 'Daily meal plan section showing recommended meals for breakfast, lunch, dinner, and snacks.'
      }
    },
    {
      path: '/exercises',
      name: 'exercises',
      component: () => import('../views/MindfulExercisesView.vue'),
      meta: {
        'voix-description': 'Mindful eating exercises to help you develop a healthier relationship with food and more awareness during meals.'
      }
    },
    {
      path: '/food-tracker',
      name: 'foodTracker',
      component: () => import('../views/FoodTrackerView.vue'),
      meta: {
        'voix-description': 'Food tracking tools to log your meals and monitor your nutritional intake throughout the day.'
      }
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/AnalyticsView.vue'),
      meta: {
        'voix-description': 'Nutritional analytics dashboard showing your dietary patterns, calorie consumption, and nutrient breakdown.'
      }
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../views/CommunityView.vue'),
      meta: {
        'voix-description': 'Community section with expert tips and success stories from other users of MindfulMeals.'
      }
    }
  ],
})

export default router
