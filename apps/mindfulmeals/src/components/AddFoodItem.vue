<script setup>
import { useFoodLogStore } from '@/stores/foodLogStore';
import { ref, computed } from 'vue';

const foodLogStore = useFoodLogStore();
const foodItems = computed(() => foodLogStore.availableFoods);
const selectedFoodId = ref(null);
const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('');

function addFoodEntry() {
  if (!selectedFoodId.value) {
    showAlert.value = true;
    alertMessage.value = 'Please select a food item';
    alertType.value = 'danger';
    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
    return;
  }
  
  const success = foodLogStore.addFoodEntry(selectedFoodId.value);
  if (success) {
    showAlert.value = true;
    alertMessage.value = 'Food item added successfully';
    alertType.value = 'success';
    selectedFoodId.value = null;
    
    // Check if we're approaching nutritional goals
    const nutritionAlert = foodLogStore.checkNutritionAlert();
    if (nutritionAlert) {
      setTimeout(() => {
        showAlert.value = true;
        alertMessage.value = nutritionAlert.message;
        alertType.value = nutritionAlert.type;
      }, 3500);
    }
  } else {
    showAlert.value = true;
    alertMessage.value = 'Error adding food item';
    alertType.value = 'danger';
  }
  
  setTimeout(() => {
    showAlert.value = false;
  }, 3000);
}

// Group food items by category
const foodItemsByCategory = computed(() => {
  const groupedItems = {};
  foodItems.value.forEach(item => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  });
  return groupedItems;
});
</script>

<template>
  <div class="add-food-card card mb-4" v-voix="'Add Food Item Form'">
    <div class="card-header bg-light">
      <h4 class="mb-0">Add Food Item</h4>
    </div>
    <div class="card-body">
      <div class="alert" :class="`alert-${alertType}`" v-if="showAlert" role="alert" v-voix="alertMessage">
        {{ alertMessage }}
      </div>
      
      <div class="mb-3">
        <label for="foodSelect" class="form-label" v-voix="'Select Food Item'">Select Food Item</label>
        <select 
          id="foodSelect" 
          class="form-select" 
          v-model="selectedFoodId"
          v-voix="'Food Item Selection'"
          hint="Choose a food item to add to your log"
        >
          <option :value="null" disabled selected>Select a food item</option>
          <optgroup v-for="(items, category) in foodItemsByCategory" :key="category" :label="category.charAt(0).toUpperCase() + category.slice(1)">
            <option 
              v-for="item in items" 
              :key="item.id" 
              :value="item.id"
              v-voix="item.name + ', ' + item.calories + ' calories'"
            >
              {{ item.name }} ({{ item.calories }} cal)
            </option>
          </optgroup>
        </select>
      </div>
      
      <div v-if="selectedFoodId" class="selected-food-info mb-3 p-3 bg-light rounded">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-2" v-voix="'Selected food nutritional information'">
              <strong>{{ foodItems.find(item => item.id === selectedFoodId)?.name }}</strong>
            </div>
            <div class="small text-muted">
              Category: {{ foodItems.find(item => item.id === selectedFoodId)?.category }}
            </div>
          </div>
          <div class="col-md-6">
            <div class="nutrition-details">
              <div class="row">
                <div class="col-6">
                  <div class="small">Calories: <strong>{{ foodItems.find(item => item.id === selectedFoodId)?.calories }}</strong></div>
                </div>
                <div class="col-6">
                  <div class="small">Protein: <strong>{{ foodItems.find(item => item.id === selectedFoodId)?.protein }}g</strong></div>
                </div>
                <div class="col-6">
                  <div class="small">Carbs: <strong>{{ foodItems.find(item => item.id === selectedFoodId)?.carbs }}g</strong></div>
                </div>
                <div class="col-6">
                  <div class="small">Fat: <strong>{{ foodItems.find(item => item.id === selectedFoodId)?.fat }}g</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        class="btn btn-success" 
        @click="addFoodEntry" 
        :disabled="!selectedFoodId"
        v-voix="'Add To Log'"
        hint="Add the selected food item to your daily food log"
      >
        <i class="bi bi-plus-circle me-2"></i> Add To Log
      </button>
    </div>
  </div>
</template>

<style scoped>
.add-food-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.add-food-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.card-header h4 {
  color: #2c3e50;
  font-weight: 600;
}

.selected-food-info {
  border-left: 4px solid #4a854a;
}

.nutrition-details {
  font-size: 0.9rem;
}
</style>