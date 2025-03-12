<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  workouts: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete']);

const sortBy = ref('date');
const sortOrder = ref('desc');

const sortedWorkouts = computed(() => {
  return [...props.workouts].sort((a, b) => {
    let valueA, valueB;
    
    if (sortBy.value === 'date') {
      valueA = new Date(a.date);
      valueB = new Date(b.date);
    } else if (sortBy.value === 'duration') {
      valueA = a.duration;
      valueB = b.duration;
    } else if (sortBy.value === 'type') {
      valueA = a.type;
      valueB = b.type;
    } else if (sortBy.value === 'calories') {
      valueA = a.caloriesBurned;
      valueB = b.caloriesBurned;
    } else {
      valueA = a[sortBy.value];
      valueB = b[sortBy.value];
    }
    
    if (sortOrder.value === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
});

const handleSort = (column) => {
  if (sortBy.value === column) {
    // Toggle sort order
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // New column, default to descending
    sortBy.value = column;
    sortOrder.value = 'desc';
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const handleEdit = (workout) => {
  emit('edit', workout);
};

const handleDelete = (workout) => {
  if (confirm('Are you sure you want to delete this workout?')) {
    emit('delete', workout.id);
  }
};
</script>

<template>
  <div class="workout-list-container">
    <h2 v-voix="'workout-history-heading'">Workout History</h2>
    
    <div class="sort-controls">
      <span v-voix="'sort-by-label'">Sort by:</span>
      <button 
        @click="handleSort('date')" 
        :class="{ active: sortBy === 'date' }"
        v-voix="'sort-by-date-button'"
        hint="Sort workouts by date"
      >
        Date {{ sortBy === 'date' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
      </button>
      <button 
        @click="handleSort('type')" 
        :class="{ active: sortBy === 'type' }"
        v-voix="'sort-by-type-button'"
        hint="Sort workouts by type"
      >
        Type {{ sortBy === 'type' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
      </button>
      <button 
        @click="handleSort('duration')" 
        :class="{ active: sortBy === 'duration' }"
        v-voix="'sort-by-duration-button'"
        hint="Sort workouts by duration"
      >
        Duration {{ sortBy === 'duration' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
      </button>
      <button 
        @click="handleSort('calories')" 
        :class="{ active: sortBy === 'calories' }"
        v-voix="'sort-by-calories-button'"
        hint="Sort workouts by calories burned"
      >
        Calories {{ sortBy === 'calories' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
      </button>
    </div>
    
    <div v-if="sortedWorkouts.length === 0" class="empty-state" v-voix="'no-workouts-message'">
      No workouts recorded yet. Add your first workout to get started!
    </div>
    
    <div v-else class="workout-list">
      <div 
        v-for="(workout, index) in sortedWorkouts" 
        :key="workout.id" 
        class="workout-item"
        :hint="`${workout.type} workout on ${formatDate(workout.date)}`"
      >
        <div class="workout-info">
          <div class="workout-type">{{ workout.type }}</div>
          <div class="workout-date">{{ formatDate(workout.date) }}</div>
          <div class="workout-details">
            <span>{{ workout.duration }} minutes</span>
            <span v-if="workout.distance">• {{ workout.distance }} km</span>
            <span>• {{ workout.caloriesBurned }} calories</span>
          </div>
        </div>
        
        <div class="workout-actions">
          <button 
            class="btn-edit" 
            @click="handleEdit(workout)"
            v-voix="`edit-workout-${index}`"
            :hint="`Use this button to open the edit form for this workout:\nType: ${workout.type}\nDate: ${formatDate(workout.date)}\nDuration: ${workout.duration} minutes\nDistance: ${workout.distance} km\nCalories: ${workout.caloriesBurned}`"
          >
            Edit
          </button>
          <button 
            class="btn-delete" 
            @click="handleDelete(workout)"
            v-voix="`delete-workout-${index}`"
            :hint="`Use this button to delete the workout:\nType: ${workout.type}\nDate: ${formatDate(workout.date)}\nDuration: ${workout.duration} minutes\nDistance: ${workout.distance} km\nCalories: ${workout.caloriesBurned}`"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workout-list-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
}

.sort-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.sort-controls span {
  color: #666;
  font-size: 0.9rem;
}

.sort-controls button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-controls button:hover {
  background-color: #e5e5e5;
}

.sort-controls button.active {
  background-color: #4CAF50;
  border-color: #4CAF50;
  color: white;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #666;
  border: 1px dashed #ddd;
  border-radius: 8px;
  margin-top: 1rem;
}

.workout-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workout-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.2s;
}

.workout-item:hover {
  border-color: #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.workout-info {
  flex: 1;
}

.workout-type {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.workout-date {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.workout-details {
  color: #555;
  font-size: 0.95rem;
}

.workout-details span {
  margin-right: 0.5rem;
}

.workout-actions {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #555;
}

.btn-edit:hover {
  background-color: #e5e5e5;
}

.btn-delete {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #d32f2f;
}

.btn-delete:hover {
  background-color: #ffebee;
  border-color: #ffcdd2;
}

@media (max-width: 640px) {
  .workout-item {
    flex-direction: column;
    gap: 1rem;
  }
  
  .workout-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>