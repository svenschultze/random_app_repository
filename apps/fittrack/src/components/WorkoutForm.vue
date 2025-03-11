<script setup>
import { ref, computed } from 'vue';
import { WORKOUT_TYPES } from '@/services/dataService';

const props = defineProps({
  workout: {
    type: Object,
    default: () => ({
      type: 'Running',
      date: new Date().toISOString(),
      duration: 30,
      distance: null,
      caloriesBurned: 300
    })
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['save', 'cancel']);

const formData = ref({
  type: props.workout.type,
  date: props.workout.date ? new Date(props.workout.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
  duration: props.workout.duration,
  distance: props.workout.distance,
  caloriesBurned: props.workout.caloriesBurned
});

const workoutTypes = WORKOUT_TYPES;

const isDistanceApplicable = computed(() => {
  return ['Running', 'Cycling', 'Swimming', 'Walking', 'Hiking'].includes(formData.value.type);
});

const estimateCalories = () => {
  // Base calculation on duration and workout type
  let caloriesPerMinute = 6; // Default
  
  if (formData.value.type === 'Running') {
    caloriesPerMinute = 10;
  } else if (formData.value.type === 'Cycling') {
    caloriesPerMinute = 8;
  } else if (formData.value.type === 'Swimming') {
    caloriesPerMinute = 9;
  } else if (formData.value.type === 'Walking') {
    caloriesPerMinute = 5;
  } else if (formData.value.type === 'Weight Training' || formData.value.type === 'HIIT') {
    caloriesPerMinute = 7;
  }
  
  formData.value.caloriesBurned = Math.round(formData.value.duration * caloriesPerMinute);
};

const handleSubmit = () => {
  const workout = {
    ...formData.value,
    date: new Date(formData.value.date).toISOString()
  };
  
  // Set distance to null if not applicable for this workout type
  if (!isDistanceApplicable.value) {
    workout.distance = null;
  }
  
  emit('save', workout);
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="workout-form">
    <h2 v-if="isEditing" v-voix="'edit-workout-heading'">Edit Workout</h2>
    <h2 v-else v-voix="'add-workout-heading'">Add New Workout</h2>
    
    <div class="form-group">
      <label for="workoutType" v-voix="'workout-type-label'">Workout Type</label>
      <select 
        id="workoutType" 
        v-model="formData.type" 
        class="form-control" 
        @change="estimateCalories"
        v-voix="'workout-type-select'"
        hint="Choose the type of workout activity"
      >
        <option v-for="type in workoutTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="workoutDate" v-voix="'workout-date-label'">Date & Time</label>
      <input 
        id="workoutDate" 
        type="datetime-local" 
        v-model="formData.date" 
        class="form-control"
        v-voix="'workout-datetime-input'"
        hint="Select the date and time when the workout occurred"
      >
    </div>
    
    <div class="form-group">
      <label for="workoutDuration" v-voix="'workout-duration-label'">Duration (minutes)</label>
      <input 
        id="workoutDuration" 
        type="number" 
        v-model.number="formData.duration" 
        class="form-control" 
        min="1" 
        @change="estimateCalories"
        v-voix="'workout-duration-input'"
        hint="Enter the duration of the workout in minutes"
      >
    </div>
    
    <div class="form-group" v-if="isDistanceApplicable">
      <label for="workoutDistance" v-voix="'workout-distance-label'">Distance (km)</label>
      <input 
        id="workoutDistance" 
        type="number" 
        v-model.number="formData.distance" 
        class="form-control" 
        min="0" 
        step="0.1"
        v-voix="'workout-distance-input'"
        hint="Enter the distance covered during the workout in kilometers"
      >
    </div>
    
    <div class="form-group">
      <label for="workoutCalories" v-voix="'workout-calories-label'">Calories Burned</label>
      <div class="input-with-button">
        <input 
          id="workoutCalories" 
          type="number" 
          v-model.number="formData.caloriesBurned" 
          class="form-control" 
          min="0"
          v-voix="'workout-calories-input'"
          hint="Enter the calories burned during the workout"
        >
        <button 
          type="button" 
          class="btn-estimate" 
          @click="estimateCalories"
          v-voix="'estimate-calories-button'"
          hint="Click to automatically estimate calories based on duration and workout type"
        >
          Estimate
        </button>
      </div>
    </div>
    
    <div class="form-actions">
      <button 
        type="button" 
        class="btn-cancel" 
        @click="handleCancel"
        v-voix="'cancel-workout-button'"
        hint="Cancel and return to previous screen"
      >
        Cancel
      </button>
      <button 
        type="submit" 
        class="btn-save"
        v-voix="'save-workout-button'"
        hint="Save the workout information"
      >
        {{ isEditing ? 'Update' : 'Save' }} Workout
      </button>
    </div>
  </form>
</template>

<style scoped>
.workout-form {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.input-with-button .form-control {
  flex: 1;
}

.btn-estimate {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-estimate:hover {
  background-color: #e5e5e5;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-save {
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: transparent;
  border: 1px solid #ddd;
  color: #666;
}

.btn-cancel:hover {
  background-color: #f5f5f5;
}

.btn-save {
  background-color: #4CAF50;
  border: none;
  color: white;
}

.btn-save:hover {
  background-color: #43a047;
}
</style>