<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import WorkoutForm from '@/components/WorkoutForm.vue';
import { getWorkouts, updateWorkout } from '@/services/dataService';

const router = useRouter();
const route = useRoute();
const workout = ref(null);
const isLoading = ref(true);

const loadWorkout = () => {
  isLoading.value = true;
  const workoutId = route.params.id;
  const workouts = getWorkouts();
  workout.value = workouts.find(w => w.id === workoutId);
  
  if (!workout.value) {
    // If workout not found, redirect to workouts page
    router.push('/workouts');
    return;
  }
  
  isLoading.value = false;
};

const handleSave = (updatedWorkout) => {
  updateWorkout(workout.value.id, updatedWorkout);
  router.push('/workouts');
};

const handleCancel = () => {
  router.push('/workouts');
};

watch(() => route.params.id, loadWorkout);

onMounted(() => {
  loadWorkout();
});
</script>

<template>
  <div class="edit-workout-view">
    <div class="header-actions">
      <h1 v-voix="'edit-workout-heading'">Edit Workout</h1>
    </div>
    
    <div v-if="isLoading" class="loading-section">
      <p v-voix="'loading-message'">Loading workout details...</p>
    </div>
    
    <WorkoutForm 
      v-else 
      :workout="workout" 
      :isEditing="true" 
      @save="handleSave" 
      @cancel="handleCancel" 
    />
  </div>
</template>

<style scoped>
.edit-workout-view {
  max-width: 100%;
}

.header-actions {
  margin-bottom: 2rem;
}

h1 {
  font-size: 1.8rem;
  color: var(--text-color);
  margin: 0;
}

.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
</style>