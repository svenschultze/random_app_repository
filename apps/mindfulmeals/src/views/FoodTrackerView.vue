<script setup>
import { useFoodLogStore } from '@/stores/foodLogStore';
import { computed } from 'vue';
import AddFoodItem from '@/components/AddFoodItem.vue';
import FoodLogTable from '@/components/FoodLogTable.vue';

const foodLogStore = useFoodLogStore();
const totalNutrition = computed(() => foodLogStore.totalNutrition);
const goals = computed(() => foodLogStore.goals);
</script>

<template>
  <div class="food-tracker-view">
    <header class="mb-4">
      <h1 class="page-title" v-voix="'Food Tracker'">Food Tracker</h1>
      <p class="lead" v-voix="'Track your meals and monitor your nutritional intake throughout the day'">
        Track your meals and monitor your nutritional intake throughout the day
      </p>
    </header>
    
    <div class="row">
      <div class="col-md-12 mb-4">
        <AddFoodItem />
      </div>
      
      <div class="col-md-12 mb-4">
        <div class="nutrition-summary card mb-4" v-voix="'Nutrition progress summary'">
          <div class="card-body">
            <h2 class="card-title h5 mb-3">Daily Nutrition Progress</h2>
            
            <div class="row">
              <div class="col-md-3 mb-3">
                <div class="nutrient-progress">
                  <div class="d-flex justify-content-between mb-1">
                    <span v-voix="'Calories: ' + totalNutrition.calories + ' of ' + goals.calories">
                      <strong>Calories:</strong> {{ totalNutrition.calories }} / {{ goals.calories }}
                    </span>
                    <span>{{ Math.round((totalNutrition.calories / goals.calories) * 100) }}%</span>
                  </div>
                  <div class="progress mb-3">
                    <div 
                      class="progress-bar bg-primary" 
                      role="progressbar" 
                      :style="`width: ${Math.min(Math.round((totalNutrition.calories / goals.calories) * 100), 100)}%`"
                      :aria-valuenow="Math.round((totalNutrition.calories / goals.calories) * 100)" 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-3 mb-3">
                <div class="nutrient-progress">
                  <div class="d-flex justify-content-between mb-1">
                    <span v-voix="'Protein: ' + totalNutrition.protein + ' of ' + goals.protein + ' grams'">
                      <strong>Protein:</strong> {{ totalNutrition.protein }}g / {{ goals.protein }}g
                    </span>
                    <span>{{ Math.round((totalNutrition.protein / goals.protein) * 100) }}%</span>
                  </div>
                  <div class="progress mb-3">
                    <div 
                      class="progress-bar bg-danger" 
                      role="progressbar" 
                      :style="`width: ${Math.min(Math.round((totalNutrition.protein / goals.protein) * 100), 100)}%`"
                      :aria-valuenow="Math.round((totalNutrition.protein / goals.protein) * 100)" 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-3 mb-3">
                <div class="nutrient-progress">
                  <div class="d-flex justify-content-between mb-1">
                    <span v-voix="'Carbs: ' + totalNutrition.carbs + ' of ' + goals.carbs + ' grams'">
                      <strong>Carbs:</strong> {{ totalNutrition.carbs }}g / {{ goals.carbs }}g
                    </span>
                    <span>{{ Math.round((totalNutrition.carbs / goals.carbs) * 100) }}%</span>
                  </div>
                  <div class="progress mb-3">
                    <div 
                      class="progress-bar bg-warning" 
                      role="progressbar" 
                      :style="`width: ${Math.min(Math.round((totalNutrition.carbs / goals.carbs) * 100), 100)}%`"
                      :aria-valuenow="Math.round((totalNutrition.carbs / goals.carbs) * 100)" 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-3 mb-3">
                <div class="nutrient-progress">
                  <div class="d-flex justify-content-between mb-1">
                    <span v-voix="'Fat: ' + totalNutrition.fat + ' of ' + goals.fat + ' grams'">
                      <strong>Fat:</strong> {{ totalNutrition.fat }}g / {{ goals.fat }}g
                    </span>
                    <span>{{ Math.round((totalNutrition.fat / goals.fat) * 100) }}%</span>
                  </div>
                  <div class="progress mb-3">
                    <div 
                      class="progress-bar bg-info" 
                      role="progressbar" 
                      :style="`width: ${Math.min(Math.round((totalNutrition.fat / goals.fat) * 100), 100)}%`"
                      :aria-valuenow="Math.round((totalNutrition.fat / goals.fat) * 100)" 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="text-center mt-2">
              <router-link 
                to="/analytics" 
                class="btn btn-outline-primary btn-sm"
                v-voix="'View detailed analytics'"
                hint="Go to the analytics page to see detailed nutrition information"
              >
                <i class="bi bi-bar-chart me-1"></i> View Detailed Analytics
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-12">
        <FoodLogTable />
      </div>
    </div>
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

.nutrition-summary {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-title {
  color: #2c3e50;
  font-weight: 600;
}

.progress {
  height: 8px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .nutrient-progress {
    margin-bottom: 1rem;
  }
}
</style>