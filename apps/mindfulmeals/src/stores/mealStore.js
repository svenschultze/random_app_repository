import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { meals, dietaryPreferences } from '@/data/meals';

export const useMealStore = defineStore('meal', () => {
  const mealPlan = ref(meals);
  const selectedDietary = ref('all');
  
  const filteredMeals = computed(() => {
    if (selectedDietary.value === 'all') {
      return mealPlan.value;
    }
    return mealPlan.value.filter(meal => 
      meal.dietary.includes(selectedDietary.value)
    );
  });
  
  const breakfastMeals = computed(() => 
    filteredMeals.value.filter(meal => meal.type === 'breakfast')
  );
  
  const lunchMeals = computed(() => 
    filteredMeals.value.filter(meal => meal.type === 'lunch')
  );
  
  const dinnerMeals = computed(() => 
    filteredMeals.value.filter(meal => meal.type === 'dinner')
  );
  
  const snackMeals = computed(() => 
    filteredMeals.value.filter(meal => meal.type === 'snack')
  );
  
  function setDietaryFilter(filter) {
    selectedDietary.value = filter;
  }
  
  return {
    mealPlan,
    selectedDietary,
    filteredMeals,
    breakfastMeals,
    lunchMeals,
    dinnerMeals,
    snackMeals,
    dietaryPreferences,
    setDietaryFilter
  };
});