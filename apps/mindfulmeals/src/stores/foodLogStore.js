import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { foodItems, initialFoodLog, nutritionGoals } from '@/data/foodLog';

export const useFoodLogStore = defineStore('foodLog', () => {
  const availableFoods = ref(foodItems);
  const foodLog = ref([...initialFoodLog]);
  const goals = ref(nutritionGoals);
  
  const totalNutrition = computed(() => {
    return foodLog.value.reduce((totals, entry) => {
      totals.calories += entry.calories;
      totals.protein += entry.protein;
      totals.carbs += entry.carbs;
      totals.fat += entry.fat;
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  });
  
  const macroPercentages = computed(() => {
    const total = totalNutrition.value;
    const caloriesFromProtein = total.protein * 4;
    const caloriesFromCarbs = total.carbs * 4;
    const caloriesFromFat = total.fat * 9;
    const totalCalories = caloriesFromProtein + caloriesFromCarbs + caloriesFromFat;
    
    if (totalCalories === 0) {
      return { protein: 0, carbs: 0, fat: 0 };
    }
    
    return {
      protein: Math.round((caloriesFromProtein / totalCalories) * 100),
      carbs: Math.round((caloriesFromCarbs / totalCalories) * 100),
      fat: Math.round((caloriesFromFat / totalCalories) * 100)
    };
  });
  
  const goalPercentages = computed(() => {
    const total = totalNutrition.value;
    return {
      calories: Math.min(Math.round((total.calories / goals.value.calories) * 100), 100),
      protein: Math.min(Math.round((total.protein / goals.value.protein) * 100), 100),
      carbs: Math.min(Math.round((total.carbs / goals.value.carbs) * 100), 100),
      fat: Math.min(Math.round((total.fat / goals.value.fat) * 100), 100)
    };
  });
  
  function addFoodEntry(foodId) {
    const food = availableFoods.value.find(item => item.id === foodId);
    if (food) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
      
      let mealType = 'snack';
      if (hours >= 5 && hours < 11) {
        mealType = 'breakfast';
      } else if (hours >= 11 && hours < 15) {
        mealType = 'lunch';
      } else if (hours >= 17 && hours < 21) {
        mealType = 'dinner';
      }
      
      const newEntry = {
        id: foodLog.value.length + 1,
        foodId: food.id,
        name: food.name,
        mealType,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        time: timeString
      };
      
      foodLog.value.push(newEntry);
      
      return true;
    }
    return false;
  }
  
  function removeFoodEntry(entryId) {
    const index = foodLog.value.findIndex(entry => entry.id === entryId);
    if (index !== -1) {
      foodLog.value.splice(index, 1);
      return true;
    }
    return false;
  }
  
  function checkNutritionAlert() {
    const total = totalNutrition.value;
    if (total.calories >= goals.value.calories) {
      return {
        type: 'warning',
        message: 'You\'ve reached your daily calorie goal!'
      };
    } else if (total.calories >= goals.value.calories * 0.9) {
      return {
        type: 'info',
        message: 'You\'re approaching your daily calorie goal.'
      };
    }
    return null;
  }
  
  return {
    availableFoods,
    foodLog,
    goals,
    totalNutrition,
    macroPercentages,
    goalPercentages,
    addFoodEntry,
    removeFoodEntry,
    checkNutritionAlert
  };
});