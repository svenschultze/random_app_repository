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
        'voix-description': 'Home page of MyRecipeBook. Shows featured recipes and introduction to the app.'
      }
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: () => import('../views/RecipesView.vue'),
      meta: {
        'voix-description': 'Browse all recipes with search and filter functionality.'
      }
    },
    {
      path: '/recipes/:id',
      name: 'recipe-detail',
      component: () => import('../views/RecipeDetailView.vue'),
      props: true,
      meta: {
        'voix-description': 'Detailed view of a specific recipe with ingredients, instructions, and comments.'
      }
    },
    {
      path: '/add',
      name: 'add-recipe',
      component: () => import('../views/AddRecipeView.vue'),
      meta: {
        'voix-description': 'Form to add a new recipe with fields for title, ingredients, and instructions with markdown support.'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        'voix-description': 'About page with information about MyRecipeBook and its mission.'
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      meta: {
        'voix-description': 'Contact form to send feedback or inquiries to the MyRecipeBook team.'
      }
    },
  ],
})

export default router
