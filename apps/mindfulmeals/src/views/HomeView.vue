<script setup>
import { useMealStore } from '@/stores/mealStore';
import { useFoodLogStore } from '@/stores/foodLogStore';
import { useCommunityStore } from '@/stores/communityStore';
import { useExerciseStore } from '@/stores/exerciseStore';
import { computed } from 'vue';

import MealCard from '@/components/MealCard.vue';
import NutritionChart from '@/components/NutritionChart.vue';
import ExerciseCard from '@/components/ExerciseCard.vue';
import ExerciseModal from '@/components/ExerciseModal.vue';
import CommunityPost from '@/components/CommunityPost.vue';

const mealStore = useMealStore();
const foodLogStore = useFoodLogStore();
const communityStore = useCommunityStore();
const exerciseStore = useExerciseStore();

const breakfastMeals = computed(() => mealStore.breakfastMeals);
const featuredMeal = computed(() => 
  breakfastMeals.value.length > 0 ? breakfastMeals.value[0] : null
);

const totalNutrition = computed(() => foodLogStore.totalNutrition);
const goals = computed(() => foodLogStore.goals);
const calPercentage = computed(() => Math.round((totalNutrition.value.calories / goals.value.calories) * 100));

const featuredExercise = computed(() => 
  exerciseStore.exercises[0]
);

const featuredPost = computed(() => 
  communityStore.posts.find(post => post.id === 1)
);
</script>

<template>
  <div class="home">
    <header class="mb-4">
      <h1 class="welcome-title" v-voix="'Welcome to MindfulMeals'">Welcome to MindfulMeals</h1>
      <p class="lead" v-voix="'Combining nutrition with mindful eating for a healthier you'">
        Combining nutrition with mindful eating for a healthier you
      </p>
    </header>
    
    <div class="dashboard-overview mb-5">
      <div class="row">
        <div class="col-md-6 mb-4 mb-md-0">
          <div class="card h-100 overview-card" v-voix="'Nutrition summary card'">
            <div class="card-body">
              <h2 class="card-title h5 mb-3">Today's Nutrition Summary</h2>
              <div class="progress-container mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <span v-voix="'Calories: ' + totalNutrition.calories + ' of ' + goals.calories">
                    Calories: {{ totalNutrition.calories }} / {{ goals.calories }}
                  </span>
                  <span>{{ calPercentage }}%</span>
                </div>
                <div class="progress">
                  <div 
                    class="progress-bar" 
                    role="progressbar" 
                    :style="`width: ${Math.min(calPercentage, 100)}%`" 
                    :aria-valuenow="calPercentage" 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              
              <div class="macronutrients mt-4">
                <NutritionChart chartType="macros" />
              </div>
              
              <div class="mt-3 text-center">
                <router-link 
                  to="/food-tracker" 
                  class="btn btn-outline-primary btn-sm"
                  v-voix="'Log more food'"
                  hint="Go to the food tracker page to log additional meals"
                >
                  <i class="bi bi-plus-circle me-1"></i> Log More Food
                </router-link>
                <router-link 
                  to="/analytics" 
                  class="btn btn-outline-secondary btn-sm ms-2"
                  v-voix="'View detailed analytics'"
                  hint="Go to the analytics page to see detailed nutrition data"
                >
                  <i class="bi bi-bar-chart me-1"></i> View Analytics
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card h-100 overview-card" v-voix="'Featured meal and exercise card'">
            <div class="card-body">
              <h2 class="card-title h5 mb-3">Featured for Today</h2>
              
              <div class="featured-meal mb-4" v-if="featuredMeal">
                <h3 class="h6 mb-2" v-voix="'Featured meal'">Featured Meal</h3>
                <div class="featured-meal-card p-3 bg-light rounded">
                  <div class="d-flex align-items-center">
                    <img 
                      :src="featuredMeal.image" 
                      :alt="featuredMeal.name" 
                      class="featured-meal-img me-3"
                      v-voix="'Image of ' + featuredMeal.name"
                    />
                    <div>
                      <h4 class="h6 mb-1" v-voix="featuredMeal.name">{{ featuredMeal.name }}</h4>
                      <div class="small text-muted mb-2" v-voix="featuredMeal.calories + ' calories'">
                        {{ featuredMeal.calories }} calories
                      </div>
                      <router-link 
                        to="/meal-plan" 
                        class="btn btn-sm btn-success"
                        v-voix="'View meal plan'"
                        hint="Go to the meal plan page to see all recommended meals"
                      >
                        View Meal Plan
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="featured-exercise" v-if="featuredExercise">
                <h3 class="h6 mb-2" v-voix="'Featured exercise'">Featured Exercise</h3>
                <div class="featured-exercise-card p-3 bg-light rounded">
                  <h4 class="h6 mb-1" v-voix="featuredExercise.name">{{ featuredExercise.name }}</h4>
                  <p class="small mb-2" v-voix="featuredExercise.description">
                    {{ featuredExercise.description }}
                  </p>
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted small" v-voix="featuredExercise.duration + ' minutes'">
                      <i class="bi bi-clock me-1"></i> {{ featuredExercise.duration }} minutes
                    </span>
                    <button 
                      class="btn btn-sm btn-outline-success" 
                      @click="exerciseStore.startExercise(featuredExercise.id)"
                      v-voix="'Start exercise'"
                      hint="Begin this mindful eating exercise"
                    >
                      Start Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="quick-access mb-5">
      <h2 class="h4 mb-3" v-voix="'Quick Access'">Quick Access</h2>
      <div class="row">
        <div class="col-md-3 col-6 mb-4">
          <router-link 
            to="/meal-plan" 
            class="quick-access-card text-decoration-none" 
            v-voix="'Meal Plan'"
            hint="Go to the meal plan page"
          >
            <div class="card text-center h-100">
              <div class="card-body">
                <i class="bi bi-calendar-check quick-icon"></i>
                <h3 class="h6 mt-2">Meal Plan</h3>
              </div>
            </div>
          </router-link>
        </div>
        
        <div class="col-md-3 col-6 mb-4">
          <router-link 
            to="/food-tracker" 
            class="quick-access-card text-decoration-none" 
            v-voix="'Food Tracker'"
            hint="Go to the food tracker page"
          >
            <div class="card text-center h-100">
              <div class="card-body">
                <i class="bi bi-journal-plus quick-icon"></i>
                <h3 class="h6 mt-2">Food Tracker</h3>
              </div>
            </div>
          </router-link>
        </div>
        
        <div class="col-md-3 col-6 mb-4">
          <router-link 
            to="/exercises" 
            class="quick-access-card text-decoration-none" 
            v-voix="'Mindful Exercises'"
            hint="Go to the mindful exercises page"
          >
            <div class="card text-center h-100">
              <div class="card-body">
                <i class="bi bi-peace quick-icon"></i>
                <h3 class="h6 mt-2">Mindful Exercises</h3>
              </div>
            </div>
          </router-link>
        </div>
        
        <div class="col-md-3 col-6 mb-4">
          <router-link 
            to="/analytics" 
            class="quick-access-card text-decoration-none" 
            v-voix="'Analytics'"
            hint="Go to the analytics page"
          >
            <div class="card text-center h-100">
              <div class="card-body">
                <i class="bi bi-bar-chart quick-icon"></i>
                <h3 class="h6 mt-2">Analytics</h3>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    
    <div class="featured-content mb-4">
      <h2 class="h4 mb-3" v-voix="'From the Community'">From the Community</h2>
      <CommunityPost v-if="featuredPost" :post="featuredPost" />
      <div class="text-center mt-3">
        <router-link 
          to="/community" 
          class="btn btn-outline-primary"
          v-voix="'View all posts'"
          hint="Go to the community page to see all posts"
        >
          View All Posts
        </router-link>
      </div>
    </div>
    
    <ExerciseModal />
  </div>
</template>

<style scoped>
.welcome-title {
  color: #2c3e50;
  font-weight: 700;
}

.lead {
  color: #555;
}

.overview-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
}

.overview-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.featured-meal-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
}

.quick-access-card .card {
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.quick-access-card:hover .card {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.quick-access-card .card-body {
  padding: 1.25rem;
}

.quick-icon {
  font-size: 2rem;
  color: #4a854a;
}

.progress {
  height: 8px;
  border-radius: 4px;
}

.progress-bar {
  background-color: #4a854a;
}
</style>
