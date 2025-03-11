<script setup>
import { useRouter } from 'vue-router';
import WorkoutForm from '@/components/WorkoutForm.vue';
import { addWorkout } from '@/services/dataService';

const router = useRouter();

const handleSave = (workout) => {
  addWorkout(workout);
  router.push('/workouts');
};

const handleCancel = () => {
  router.push('/workouts');
};
</script>

<template>
  <div class="add-workout-view">
    <div class="header-actions">
      <h1 v-voix="'add-workout-heading'">Add New Workout</h1>
    </div>
    
    <WorkoutForm @save="handleSave" @cancel="handleCancel" />
  </div>
</template>

<style scoped>
.add-workout-view {
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
</style>