<script setup>
import { useFoodLogStore } from '@/stores/foodLogStore';
import { computed } from 'vue';
import NutritionChart from '@/components/NutritionChart.vue';

const foodLogStore = useFoodLogStore();
const totalNutrition = computed(() => foodLogStore.totalNutrition);
const goals = computed(() => foodLogStore.goals);
const macroPercentages = computed(() => foodLogStore.macroPercentages);
const foodLog = computed(() => foodLogStore.foodLog);

function getMealTypeCount(type) {
  return foodLog.value.filter(entry => entry.mealType === type).length;
}

function getTotalCaloriesByMealType(type) {
  return foodLog.value
    .filter(entry => entry.mealType === type)
    .reduce((total, entry) => total + entry.calories, 0);
}
</script>

<template>
  <div class="analytics-view">
    <header class="mb-4">
      <h1 class="page-title" v-voix="'Nutrition Analytics'">Nutrition Analytics</h1>
      <p class="lead" v-voix="'Track your nutrition patterns and monitor your progress'">
        Track your nutrition patterns and monitor your progress
      </p>
    </header>
    
    <div class="row mb-5">
      <div class="col-md-6 mb-4">
        <div class="card h-100" v-voix="'Macro Nutrients Distribution'">
          <div class="card-body">
            <h2 class="card-title h5 mb-3">Macro Nutrients Distribution</h2>
            <NutritionChart chartType="macros" />
          </div>
        </div>
      </div>
      
      <div class="col-md-6 mb-4">
        <div class="card h-100" v-voix="'Daily Nutrition Goals'">
          <div class="card-body">
            <h2 class="card-title h5 mb-3">Daily Nutrition Goals</h2>
            <NutritionChart chartType="goals" />
          </div>
        </div>
      </div>
    </div>
    
    <div class="row mb-5">
      <div class="col-12">
        <div class="card" v-voix="'Detailed Nutrition Breakdown'">
          <div class="card-body">
            <h2 class="card-title h5 mb-4">Detailed Nutrition Breakdown</h2>
            
            <div class="row">
              <div class="col-md-6">
                <table class="table table-borderless" v-voix="'Nutrition summary table'">
                  <tbody>
                    <tr>
                      <th scope="row" v-voix="'Total Calories'">Total Calories</th>
                      <td class="text-end" v-voix="totalNutrition.calories + ' calories'">
                        <span class="value-highlight">{{ totalNutrition.calories }}</span> cal
                      </td>
                      <td class="text-end" v-voix="Math.round((totalNutrition.calories / goals.calories) * 100) + ' percent of daily goal'">
                        <span class="text-muted">{{ Math.round((totalNutrition.calories / goals.calories) * 100) }}% of goal</span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" v-voix="'Total Protein'">Total Protein</th>
                      <td class="text-end" v-voix="totalNutrition.protein + ' grams'">
                        <span class="value-highlight">{{ totalNutrition.protein }}</span> g
                      </td>
                      <td class="text-end" v-voix="Math.round((totalNutrition.protein / goals.protein) * 100) + ' percent of daily goal'">
                        <span class="text-muted">{{ Math.round((totalNutrition.protein / goals.protein) * 100) }}% of goal</span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" v-voix="'Total Carbohydrates'">Total Carbohydrates</th>
                      <td class="text-end" v-voix="totalNutrition.carbs + ' grams'">
                        <span class="value-highlight">{{ totalNutrition.carbs }}</span> g
                      </td>
                      <td class="text-end" v-voix="Math.round((totalNutrition.carbs / goals.carbs) * 100) + ' percent of daily goal'">
                        <span class="text-muted">{{ Math.round((totalNutrition.carbs / goals.carbs) * 100) }}% of goal</span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" v-voix="'Total Fat'">Total Fat</th>
                      <td class="text-end" v-voix="totalNutrition.fat + ' grams'">
                        <span class="value-highlight">{{ totalNutrition.fat }}</span> g
                      </td>
                      <td class="text-end" v-voix="Math.round((totalNutrition.fat / goals.fat) * 100) + ' percent of daily goal'">
                        <span class="text-muted">{{ Math.round((totalNutrition.fat / goals.fat) * 100) }}% of goal</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="col-md-6">
                <table class="table table-borderless" v-voix="'Macro distribution table'">
                  <tbody>
                    <tr>
                      <th scope="row" v-voix="'Protein Calories'">Protein Calories</th>
                      <td class="text-end" v-voix="(totalNutrition.protein * 4) + ' calories'">
                        <span class="value-highlight">{{ totalNutrition.protein * 4 }}</span> cal
                      </td>
                      <td class="text-end" v-voix="macroPercentages.protein + ' percent of total calories'">
                        <span class="text-muted">{{ macroPercentages.protein }}% of total</span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" v-voix="'Carb Calories'">Carb Calories</th>
                      <td class="text-end" v-voix="(totalNutrition.carbs * 4) + ' calories'">
                        <span class="value-highlight">{{ totalNutrition.carbs * 4 }}</span> cal
                      </td>
                      <td class="text-end" v-voix="macroPercentages.carbs + ' percent of total calories'">
                        <span class="text-muted">{{ macroPercentages.carbs }}% of total</span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" v-voix="'Fat Calories'">Fat Calories</th>
                      <td class="text-end" v-voix="(totalNutrition.fat * 9) + ' calories'">
                        <span class="value-highlight">{{ totalNutrition.fat * 9 }}</span> cal
                      </td>
                      <td class="text-end" v-voix="macroPercentages.fat + ' percent of total calories'">
                        <span class="text-muted">{{ macroPercentages.fat }}% of total</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col-12">
        <div class="card" v-voix="'Meal distribution analysis'">
          <div class="card-body">
            <h2 class="card-title h5 mb-4">Meal Distribution Analysis</h2>
            
            <div class="row">
              <div class="col-md-6 mb-4">
                <h3 class="h6 mb-3" v-voix="'Meal Entry Count'">Meal Entry Count</h3>
                <div class="meal-distribution">
                  <div class="meal-bar-container">
                    <div class="d-flex justify-content-between mb-2">
                      <span v-voix="'Breakfast: ' + getMealTypeCount('breakfast') + ' entries'">
                        Breakfast
                      </span>
                      <span>{{ getMealTypeCount('breakfast') }}</span>
                    </div>
                    <div class="progress mb-3">
                      <div 
                        class="progress-bar bg-warning" 
                        role="progressbar" 
                        :style="`width: ${(getMealTypeCount('breakfast') / foodLog.value.length) * 100}%`"
                        :aria-valuenow="getMealTypeCount('breakfast')" 
                        aria-valuemin="0" 
                        :aria-valuemax="foodLog.value.length"
                      ></div>
                    </div>
                  </div>
                  
                  <div class="meal-bar-container">
                    <div class="d-flex justify-content-between mb-2">
                      <span v-voix="'Lunch: ' + getMealTypeCount('lunch') + ' entries'">
                        Lunch
                      </span>
                      <span>{{ getMealTypeCount('lunch') }}</span>
                    </div>
                    <div class="progress mb-3">
                      <div 
                        class="progress-bar bg-primary" 
                        role="progressbar" 
                        :style="`width: ${(getMealTypeCount('lunch') / foodLog.value.length) * 100}%`"
                        :aria-valuenow="getMealTypeCount('lunch')" 
                        aria-valuemin="0" 
                        :aria-valuemax="foodLog.value.length"
                      ></div>
                    </div>
                  </div>
                  
                  <div class="meal-bar-container">
                    <div class="d-flex justify-content-between mb-2">
                      <span v-voix="'Dinner: ' + getMealTypeCount('dinner') + ' entries'">
                        Dinner
                      </span>
                      <span>{{ getMealTypeCount('dinner') }}</span>
                    </div>
                    <div class="progress mb-3">
                      <div 
                        class="progress-bar bg-danger" 
                        role="progressbar" 
                        :style="`width: ${(getMealTypeCount('dinner') / foodLog.value.length) * 100}%`"
                        :aria-valuenow="getMealTypeCount('dinner')" 
                        aria-valuemin="0" 
                        :aria-valuemax="foodLog.value.length"
                      ></div>
                    </div>
                  </div>
                  
                  <div class="meal-bar-container">
                    <div class="d-flex justify-content-between mb-2">
                      <span v-voix="'Snacks: ' + getMealTypeCount('snack') + ' entries'">
                        Snacks
                      </span>
                      <span>{{ getMealTypeCount('snack') }}</span>
                    </div>
                    <div class="progress mb-3">
                      <div 
                        class="progress-bar bg-success" 
                        role="progressbar" 
                        :style="`width: ${(getMealTypeCount('snack') / foodLog.value.length) * 100}%`"
                        :aria-valuenow="getMealTypeCount('snack')" 
                        aria-valuemin="0" 
                        :aria-valuemax="foodLog.value.length"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-6 mb-4">
                <h3 class="h6 mb-3" v-voix="'Calories by Meal Type'">Calories by Meal Type</h3>
                <div class="meal-distribution">
                  <div class="meal-bar-container">
                    <div class="d-flex justify-content-between mb-2">
                      <span v-voix="'Breakfast: ' + getTotalCaloriesByMealType('breakfast') + ' calories'">
                        Breakfast
                      </span>
                      <span>{{ getTotalCaloriesByMealType('breakfast') }} cal</span>
                    </div>
                    <div class="progress mb-3">
                      <div 
                        class="progress-bar bg-warning" 
                        role="progressbar" 
                        :style="`width: ${(getTotalCaloriesByMealType('breakfast') / totalNutrition.calories) * 100}%`"
                        :aria-valuenow="getTotalCaloriesByMealType('breakfast')" 
                        aria-valuemin="0" 
                        :aria-valuemax="totalNutrition.calories"
                      ></div>
                    </div>
                  </div>
                  
                  <div class="meal-bar-container">
                    <div class="d-flex justify-content-between mb-2">
                      <span v-voix="'Lunch: ' + getTotalCaloriesByMealType('lunch') + ' calories'">
                        Lunch
                      </span>
                      <span>{{ getTotalCaloriesByMealType('lunch') }} cal</span>
                    </div>
                    <div class="progress mb-3">
                      <div 
                        class="progress-bar bg-primary" 
                        role="progressbar" 
                        :style="`width: ${(getTotalCaloriesByMealType('lunch') / totalNutrition.calories) * 100}%`"
                        :aria-valuenow="getTotalCaloriesByMealType('lunch')" 
                        aria-valuemin="0" 
                        :aria-valuemax="totalNutrition.calories"
                      ></div>
                    </div>
                  </div>
                  
                  <div class="meal-bar-container">
                    <div class="d-flex justify-content-between mb-2">
                      <span v-voix="'Dinner: ' + getTotalCaloriesByMealType('dinner') + ' calories'">
                        Dinner
                      </span>
                      <span>{{ getTotalCaloriesByMealType('dinner') }} cal</span>
                    </div>
                    <div class="progress mb-3">
                      <div 
                        class="progress-bar bg-danger" 
                        role="progressbar" 
                        :style="`width: ${(getTotalCaloriesByMealType('dinner') / totalNutrition.calories) * 100}%`"
                        :aria-valuenow="getTotalCaloriesByMealType('dinner')" 
                        aria-valuemin="0" 
                        :aria-valuemax="totalNutrition.calories"
                      ></div>
                    </div>
                  </div>
                  
                  <div class="meal-bar-container">
                    <div class="d-flex justify-content-between mb-2">
                      <span v-voix="'Snacks: ' + getTotalCaloriesByMealType('snack') + ' calories'">
                        Snacks
                      </span>
                      <span>{{ getTotalCaloriesByMealType('snack') }} cal</span>
                    </div>
                    <div class="progress mb-3">
                      <div 
                        class="progress-bar bg-success" 
                        role="progressbar" 
                        :style="`width: ${(getTotalCaloriesByMealType('snack') / totalNutrition.calories) * 100}%`"
                        :aria-valuenow="getTotalCaloriesByMealType('snack')" 
                        aria-valuemin="0" 
                        :aria-valuemax="totalNutrition.calories"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="text-center mt-3">
              <router-link 
                to="/food-tracker" 
                class="btn btn-outline-primary"
                v-voix="'Back to food tracker'"
                hint="Return to the food tracker page to log additional meals"
              >
                <i class="bi bi-journal-plus me-1"></i> Back to Food Tracker
              </router-link>
            </div>
          </div>
        </div>
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

.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;
  margin-bottom: 1.5rem;
}

.card-title {
  color: #2c3e50;
  font-weight: 600;
}

.value-highlight {
  font-weight: 600;
  color: #2c3e50;
}

table th {
  font-weight: 500;
  color: #495057;
}

.progress {
  height: 10px;
  border-radius: 5px;
}

.meal-distribution {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>