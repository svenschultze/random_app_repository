<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  getAllIntervalWorkouts, 
  getFavoriteWorkouts, 
  toggleFavorite,
  deleteIntervalWorkout
} from '@/services/intervalWorkoutService';

const router = useRouter();
const workouts = ref([]);
const activeTab = ref('all');
const searchQuery = ref('');

// Load data on mount
onMounted(() => {
  loadWorkouts();
});

// Load available workouts
const loadWorkouts = () => {
  workouts.value = getAllIntervalWorkouts();
};

// Toggle favorite status
const toggleWorkoutFavorite = (workoutId) => {
  toggleFavorite(workoutId);
  loadWorkouts(); // Reload workouts to get updated data
};

// Delete workout
const deleteWorkout = (workoutId) => {
  if (confirm('Are you sure you want to delete this workout?')) {
    deleteIntervalWorkout(workoutId);
    loadWorkouts();
  }
};

// Start an interval workout session
const startWorkout = (workoutId) => {
  router.push({ name: 'interval-workout', params: { id: workoutId } });
};

// Edit a workout
const editWorkout = (workoutId) => {
  router.push({ name: 'edit-interval-workout', params: { id: workoutId } });
};

// Create a new interval workout
const createWorkout = () => {
  router.push({ name: 'create-interval-workout' });
};

// Format duration in mm:ss format
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Filter workouts by active tab and search query
const filteredWorkouts = computed(() => {
  let result = [...workouts.value];
  
  // Apply tab filter
  if (activeTab.value === 'favorites') {
    result = result.filter(workout => workout.favorite);
  }
  
  // Apply search filter if query exists
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(workout => 
      workout.name.toLowerCase().includes(query) || 
      workout.description.toLowerCase().includes(query) ||
      workout.type.toLowerCase().includes(query)
    );
  }
  
  return result;
});

// Group workouts by type
const workoutsByType = computed(() => {
  const grouped = {};
  
  filteredWorkouts.value.forEach(workout => {
    if (!grouped[workout.type]) {
      grouped[workout.type] = [];
    }
    grouped[workout.type].push(workout);
  });
  
  return grouped;
});

// Get workout types for display
const workoutTypes = computed(() => {
  return Object.keys(workoutsByType.value).sort();
});

// Check if a workout is predefined
const isPredefined = (workoutId) => {
  return !workoutId.includes('custom') && !workoutId.startsWith('workout-');
};
</script>

<template>
  <div class="interval-list">
    <div class="list-header">
      <h2>Interval Workouts</h2>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search workouts..." 
          class="search-input"
          v-voix="'input-search-workouts'"
          hint="Search for interval workouts by name, type or description">
      </div>
      <button 
        class="btn btn-primary create-btn" 
        @click="createWorkout"
        v-voix="'button-create-new-workout'"
        hint="Create a new custom interval workout">
        + Create Workout
      </button>
    </div>
    
    <div class="tabs">
      <button 
        :class="{ active: activeTab === 'all' }" 
        @click="activeTab = 'all'"
        v-voix="'tab-all-workouts'"
        hint="Show all interval workouts">
        All Workouts
      </button>
      <button 
        :class="{ active: activeTab === 'favorites' }" 
        @click="activeTab = 'favorites'"
        v-voix="'tab-favorite-workouts'"
        hint="Show only your favorite workouts">
        Favorites
      </button>
    </div>
    
    <div class="workouts-container">
      <template v-if="filteredWorkouts.length">
        <div v-for="type in workoutTypes" :key="type" class="workout-type-section">
          <h3 class="type-heading">{{ type }}</h3>
          
          <div class="workouts-grid">
            <div 
              v-for="workout in workoutsByType[type]" 
              :key="workout.id" 
              class="workout-card">
              <div class="card-header">
                <h4 class="workout-title">{{ workout.name }}</h4>
                <button 
                  class="favorite-btn" 
                  @click="toggleWorkoutFavorite(workout.id)"
                  v-voix="'button-toggle-favorite-' + workout.id"
                  :hint="(workout.favorite ? 'Remove ' : 'Add ') + workout.name + (workout.favorite ? ' from' : ' to') + ' favorites'">
                  <span v-if="workout.favorite">★</span>
                  <span v-else>☆</span>
                </button>
              </div>
              
              <p class="workout-description">{{ workout.description }}</p>
              
              <div class="workout-meta">
                <div class="meta-item">
                  <strong>Duration:</strong> {{ formatDuration(workout.totalDuration) }}
                </div>
                <div class="meta-item">
                  <strong>Intervals:</strong> {{ workout.intervals.length }}
                </div>
                <div class="meta-item">
                  <strong>Est. Calories:</strong> {{ workout.estimatedCalories }}
                </div>
              </div>
              
              <div class="card-actions">
                <button 
                  class="btn btn-primary" 
                  @click="startWorkout(workout.id)"
                  v-voix="'button-start-workout-' + workout.id"
                  :hint="'Start the ' + workout.name + ' interval workout'">
                  Start
                </button>
                <button 
                  class="btn btn-secondary" 
                  @click="editWorkout(workout.id)"
                  v-voix="'button-edit-workout-' + workout.id"
                  :hint="'Edit the ' + workout.name + ' workout'">
                  Edit
                </button>
                <button 
                  v-if="!isPredefined(workout.id)"
                  class="btn btn-danger" 
                  @click="deleteWorkout(workout.id)"
                  v-voix="'button-delete-workout-' + workout.id"
                  :hint="'Delete the ' + workout.name + ' workout'">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <div v-else class="empty-state">
        <p v-if="searchQuery">No workouts match your search criteria.</p>
        <p v-else-if="activeTab === 'favorites'">You don't have any favorite workouts yet.</p>
        <p v-else>No workouts available. Create one to get started!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.interval-list {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1rem;
}

.create-btn {
  white-space: nowrap;
}

.tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.tabs button {
  background: none;
  border: none;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
}

.tabs button.active {
  font-weight: bold;
  color: #4a90e2;
}

.tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #4a90e2;
}

.workout-type-section {
  margin-bottom: 2rem;
}

.type-heading {
  margin-bottom: 1rem;
  color: #555;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.workouts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.workout-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s;
}

.workout-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.workout-title {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #ffc107;
}

.workout-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.4;
  font-size: 0.95rem;
}

.workout-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  color: #555;
}

.meta-item:nth-child(3) {
  grid-column: 1 / -1;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.btn {
  padding: 0.6rem 0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  flex: 1;
  text-align: center;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  color: #666;
}
</style>