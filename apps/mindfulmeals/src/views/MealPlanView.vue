<script setup>
import { useMealStore } from '@/stores/mealStore';
import { computed, ref } from 'vue';
import MealCard from '@/components/MealCard.vue';

const mealStore = useMealStore();
const selectedDietary = ref('all');
const dietaryPreferences = computed(() => mealStore.dietaryPreferences);
const breakfastMeals = computed(() => mealStore.breakfastMeals);
const lunchMeals = computed(() => mealStore.lunchMeals);
const dinnerMeals = computed(() => mealStore.dinnerMeals);
const snackMeals = computed(() => mealStore.snackMeals);

function filterMeals(preference) {
  selectedDietary.value = preference;
  mealStore.setDietaryFilter(preference);
}
</script>

<template>
  <div class="meal-plan-view">
    <header class="mb-4">
      <h1 class="page-title" v-voix="'Daily Meal Plan'">Daily Meal Plan</h1>
      <p class="lead" v-voix="'Personalized nutrition recommendations based on your profile and preferences'">
        Personalized nutrition recommendations based on your profile and preferences
      </p>
      
      <div class="dietary-filter mb-4" v-voix="'Dietary preference filter'">
        <div class="d-flex align-items-center justify-content-between flex-wrap">
          <label class="me-3 mb-2 mb-md-0">Filter by dietary preference:</label>
          <div class="btn-group dietary-buttons">
            <button 
              v-for="preference in dietaryPreferences" 
              :key="preference.value"
              class="btn" 
              :class="selectedDietary === preference.value ? 'btn-success' : 'btn-outline-secondary'"
              @click="filterMeals(preference.value)"
              v-voix="preference.label + ' filter button'"
              hint="Filter meals to show only those matching this dietary preference"
            >
              {{ preference.label }}
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <section class="meal-section mb-5" v-voix="'Breakfast section'">
      <h2 class="meal-section-title">
        <i class="bi bi-sunrise me-2"></i> Breakfast
      </h2>
      <div class="row">
        <div class="col-md-6 col-lg-4 mb-4" v-for="meal in breakfastMeals" :key="meal.id">
          <MealCard :meal="meal" />
        </div>
        <div class="col-12" v-if="breakfastMeals.length === 0">
          <div class="no-meals alert alert-light" v-voix="'No breakfast meals match your filter'">
            No breakfast meals match your current dietary filter. Try adjusting your preferences.
          </div>
        </div>
      </div>
    </section>
    
    <section class="meal-section mb-5" v-voix="'Lunch section'">
      <h2 class="meal-section-title">
        <i class="bi bi-sun me-2"></i> Lunch
      </h2>
      <div class="row">
        <div class="col-md-6 col-lg-4 mb-4" v-for="meal in lunchMeals" :key="meal.id">
          <MealCard :meal="meal" />
        </div>
        <div class="col-12" v-if="lunchMeals.length === 0">
          <div class="no-meals alert alert-light" v-voix="'No lunch meals match your filter'">
            No lunch meals match your current dietary filter. Try adjusting your preferences.
          </div>
        </div>
      </div>
    </section>
    
    <section class="meal-section mb-5" v-voix="'Dinner section'">
      <h2 class="meal-section-title">
        <i class="bi bi-moon me-2"></i> Dinner
      </h2>
      <div class="row">
        <div class="col-md-6 col-lg-4 mb-4" v-for="meal in dinnerMeals" :key="meal.id">
          <MealCard :meal="meal" />
        </div>
        <div class="col-12" v-if="dinnerMeals.length === 0">
          <div class="no-meals alert alert-light" v-voix="'No dinner meals match your filter'">
            No dinner meals match your current dietary filter. Try adjusting your preferences.
          </div>
        </div>
      </div>
    </section>
    
    <section class="meal-section mb-5" v-voix="'Snacks section'">
      <h2 class="meal-section-title">
        <i class="bi bi-apple me-2"></i> Snacks
      </h2>
      <div class="row">
        <div class="col-md-6 col-lg-4 mb-4" v-for="meal in snackMeals" :key="meal.id">
          <MealCard :meal="meal" />
        </div>
        <div class="col-12" v-if="snackMeals.length === 0">
          <div class="no-meals alert alert-light" v-voix="'No snack meals match your filter'">
            No snack meals match your current dietary filter. Try adjusting your preferences.
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-title {
  color: #2c3e50;
  font-weight: 700;
}

.lead {
  color: #555;
}

.meal-section-title {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e9ecef;
}

.dietary-filter {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.dietary-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.dietary-buttons .btn {
  font-size: 0.85rem;
  padding: 0.375rem 0.75rem;
}

.no-meals {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  color: #6c757d;
}

@media (max-width: 768px) {
  .dietary-filter label {
    margin-bottom: 0.5rem;
  }
  
  .dietary-buttons {
    width: 100%;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 10px;
  }
  
  .dietary-buttons .btn {
    white-space: nowrap;
  }
}
</style>