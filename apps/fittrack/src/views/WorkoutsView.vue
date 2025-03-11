<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import WorkoutList from '@/components/WorkoutList.vue';
import { getWorkouts, deleteWorkout } from '@/services/dataService';

const router = useRouter();
const workouts = ref([]);
const isLoading = ref(true);

const loadWorkouts = () => {
  isLoading.value = true;
  workouts.value = getWorkouts();
  isLoading.value = false;
};

const handleAddWorkout = () => {
  router.push('/add-workout');
};

const handleEditWorkout = (workout) => {
  router.push(`/edit-workout/${workout.id}`);
};

const handleDeleteWorkout = (id) => {
  deleteWorkout(id);
  loadWorkouts();
};

onMounted(() => {
  loadWorkouts();
});
</script>

<template>
  <div class="workouts-view">
    <div class="header-actions">
      <h1 v-voix="'workouts-heading'">Workout History</h1>
      <button 
        class="btn btn-primary" 
        @click="handleAddWorkout"
        v-voix="'add-workout-button'"
        hint="Navigate to the add workout form"
      >
        Add Workout
      </button>
    </div>

    <div v-if="isLoading" class="loading-section">
      <p v-voix="'loading-message'">Loading your workouts...</p>
    </div>
    
    <div v-else>
      <WorkoutList 
        :workouts="workouts" 
        @edit="handleEditWorkout" 
        @delete="handleDeleteWorkout" 
      />
    </div>
  </div>
</template>

<style scoped>
.workouts-view {
  max-width: 100%;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

h1 {
  font-size: 1.8rem;
  color: var(--text-color);
  margin: 0;
}

.btn {
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.9rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .btn {
    width: 100%;
  }
}
</style>