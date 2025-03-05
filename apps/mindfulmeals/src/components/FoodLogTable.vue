<script setup>
import { useFoodLogStore } from '@/stores/foodLogStore';
import { computed } from 'vue';

const foodLogStore = useFoodLogStore();
const foodLog = computed(() => foodLogStore.foodLog);
const totalNutrition = computed(() => foodLogStore.totalNutrition);

function removeEntry(entryId) {
  foodLogStore.removeFoodEntry(entryId);
}
</script>

<template>
  <div class="food-log-table" v-voix="'Food Log Table'">
    <h4 class="mb-3">Today's Food Log</h4>
    
    <div class="table-responsive">
      <table class="table align-middle" v-if="foodLog.length > 0">
        <thead class="table-light">
          <tr>
            <th scope="col" v-voix="'Time column'">Time</th>
            <th scope="col" v-voix="'Food Name column'">Food Item</th>
            <th scope="col" v-voix="'Meal Type column'">Meal Type</th>
            <th scope="col" v-voix="'Calories column'">Calories</th>
            <th scope="col" v-voix="'Protein column'">Protein</th>
            <th scope="col" v-voix="'Carbs column'">Carbs</th>
            <th scope="col" v-voix="'Fat column'">Fat</th>
            <th scope="col" v-voix="'Actions column'">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in foodLog" :key="entry.id">
            <td v-voix="'Time: ' + entry.time">{{ entry.time }}</td>
            <td v-voix="'Food Item: ' + entry.name">{{ entry.name }}</td>
            <td v-voix="'Meal Type: ' + entry.mealType">
              <span class="badge" :class="getMealTypeBadgeClass(entry.mealType)">
                {{ capitalizeFirst(entry.mealType) }}
              </span>
            </td>
            <td v-voix="'Calories: ' + entry.calories">{{ entry.calories }}</td>
            <td v-voix="'Protein: ' + entry.protein + ' grams'">{{ entry.protein }}g</td>
            <td v-voix="'Carbs: ' + entry.carbs + ' grams'">{{ entry.carbs }}g</td>
            <td v-voix="'Fat: ' + entry.fat + ' grams'">{{ entry.fat }}g</td>
            <td>
              <button 
                class="btn btn-sm btn-outline-danger" 
                @click="removeEntry(entry.id)"
                v-voix="'Remove entry'"
                hint="Remove this food item from your log"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot class="table-light">
          <tr class="fw-bold">
            <td colspan="3" class="text-end" v-voix="'Daily Totals'">Daily Totals:</td>
            <td v-voix="'Total Calories: ' + totalNutrition.calories">{{ totalNutrition.calories }}</td>
            <td v-voix="'Total Protein: ' + totalNutrition.protein + ' grams'">{{ totalNutrition.protein }}g</td>
            <td v-voix="'Total Carbs: ' + totalNutrition.carbs + ' grams'">{{ totalNutrition.carbs }}g</td>
            <td v-voix="'Total Fat: ' + totalNutrition.fat + ' grams'">{{ totalNutrition.fat }}g</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      
      <div class="text-center p-4 bg-light rounded" v-else v-voix="'No food entries logged yet'">
        <p class="mb-0">No food entries logged yet. Add your first meal using the form above.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getMealTypeBadgeClass(mealType) {
      switch (mealType) {
        case 'breakfast':
          return 'bg-warning';
        case 'lunch':
          return 'bg-primary';
        case 'dinner':
          return 'bg-danger';
        case 'snack':
          return 'bg-success';
        default:
          return 'bg-secondary';
      }
    },
    capitalizeFirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
};
</script>

<style scoped>
.food-log-table {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
}

.table th {
  font-weight: 600;
  font-size: 0.9rem;
  color: #495057;
}

.table td {
  vertical-align: middle;
}

h4 {
  color: #2c3e50;
  font-weight: 600;
  padding: 1rem;
  margin-bottom: 0;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}
</style>