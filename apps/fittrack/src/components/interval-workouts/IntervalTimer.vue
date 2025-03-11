<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getIntervalWorkoutById, saveIntervalWorkoutHistory } from '@/services/intervalWorkoutService';

const route = useRoute();
const router = useRouter();
const workout = ref(null);
const currentIntervalIndex = ref(0);
const remainingTime = ref(0);
const isRunning = ref(false);
const isPaused = ref(false);
const isCompleted = ref(false);
const showCompletionModal = ref(false);
const timerInterval = ref(null);
const elapsedSeconds = ref(0);
const completionNotes = ref('');
const completionRating = ref(3);

// Sound effects
const startSound = new Audio();
const endSound = new Audio();
const intervalSound = new Audio();

// Load workout data
onMounted(() => {
  loadWorkout();
  
  // Initialize sound effects
  try {
    startSound.src = '/sounds/start.mp3';
    endSound.src = '/sounds/complete.mp3';
    intervalSound.src = '/sounds/next.mp3';
  } catch (error) {
    console.error('Failed to load sound effects:', error);
  }
});

// Clean up on unmount
onBeforeUnmount(() => {
  stopTimer();
});

// Load workout by ID
const loadWorkout = () => {
  const workoutId = route.params.id;
  if (!workoutId) {
    router.push({ name: 'interval-workouts' });
    return;
  }
  
  const workoutData = getIntervalWorkoutById(workoutId);
  if (!workoutData) {
    router.push({ name: 'interval-workouts' });
    return;
  }
  
  workout.value = workoutData;
  
  // Initialize timer with first interval
  if (workout.value.intervals && workout.value.intervals.length > 0) {
    remainingTime.value = workout.value.intervals[0].duration;
  }
};

// Start the workout timer
const startWorkout = () => {
  if (isRunning.value || isCompleted.value) return;
  
  isRunning.value = true;
  isPaused.value = false;
  
  try {
    startSound.play();
  } catch (error) {
    console.error('Failed to play start sound:', error);
  }
  
  // Start the interval timer
  timerInterval.value = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
      elapsedSeconds.value++;
    } else {
      moveToNextInterval();
    }
  }, 1000);
};

// Pause the workout timer
const pauseWorkout = () => {
  if (!isRunning.value || isCompleted.value) return;
  
  clearInterval(timerInterval.value);
  isRunning.value = false;
  isPaused.value = true;
};

// Resume the workout timer
const resumeWorkout = () => {
  if (isRunning.value || isCompleted.value) return;
  
  startWorkout();
};

// Move to the next interval
const moveToNextInterval = () => {
  if (currentIntervalIndex.value >= workout.value.intervals.length - 1) {
    // Workout completed
    completeWorkout();
    return;
  }
  
  try {
    intervalSound.play();
  } catch (error) {
    console.error('Failed to play interval sound:', error);
  }
  
  // Move to next interval
  currentIntervalIndex.value++;
  remainingTime.value = workout.value.intervals[currentIntervalIndex.value].duration;
};

// Complete the workout
const completeWorkout = () => {
  clearInterval(timerInterval.value);
  isRunning.value = false;
  isCompleted.value = true;
  
  try {
    endSound.play();
  } catch (error) {
    console.error('Failed to play end sound:', error);
  }
  
  // Show completion modal
  showCompletionModal.value = true;
};

// Stop the timer
const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
};

// Skip to the next interval
const skipInterval = () => {
  if (isCompleted.value) return;
  
  moveToNextInterval();
};

// Restart the current interval
const restartInterval = () => {
  if (isCompleted.value) return;
  
  remainingTime.value = workout.value.intervals[currentIntervalIndex.value].duration;
};

// Save workout completion
const saveCompletion = () => {
  // Calculate actual duration
  const actualDuration = elapsedSeconds.value;
  
  // Save to history
  saveIntervalWorkoutHistory(workout.value.id, {
    duration: actualDuration,
    calories: workout.value.estimatedCalories,
    notes: completionNotes.value,
    rating: completionRating.value
  });
  
  // Return to workout list
  router.push({ name: 'workout-history' });
};

// Skip saving and return to list
const skipSaving = () => {
  router.push({ name: 'interval-workouts' });
};

// Format remaining time as MM:SS
const formattedRemainingTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60);
  const seconds = remainingTime.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Format elapsed time as MM:SS
const formattedElapsedTime = computed(() => {
  const minutes = Math.floor(elapsedSeconds.value / 60);
  const seconds = elapsedSeconds.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Get current interval
const currentInterval = computed(() => {
  if (!workout.value || !workout.value.intervals) return null;
  return workout.value.intervals[currentIntervalIndex.value];
});

// Get next interval
const nextInterval = computed(() => {
  if (!workout.value || !workout.value.intervals) return null;
  
  const nextIndex = currentIntervalIndex.value + 1;
  if (nextIndex >= workout.value.intervals.length) return null;
  
  return workout.value.intervals[nextIndex];
});

// Calculate progress percentage
const progressPercentage = computed(() => {
  if (!workout.value || !currentInterval.value) return 0;
  
  const currentDuration = currentInterval.value.duration;
  const elapsed = currentDuration - remainingTime.value;
  
  return (elapsed / currentDuration) * 100;
});

// Calculate overall progress percentage
const overallProgressPercentage = computed(() => {
  if (!workout.value || !workout.value.intervals) return 0;
  
  const totalDuration = workout.value.totalDuration;
  const completedDuration = workout.value.intervals
    .slice(0, currentIntervalIndex.value)
    .reduce((sum, interval) => sum + interval.duration, 0);
  
  const currentDuration = currentInterval.value ? currentInterval.value.duration : 0;
  const currentElapsed = currentDuration - remainingTime.value;
  
  return ((completedDuration + currentElapsed) / totalDuration) * 100;
});

// Get color based on intensity
const intensityColor = computed(() => {
  if (!currentInterval.value) return '#4a90e2';
  
  switch (currentInterval.value.intensity) {
    case 'high':
      return '#f44336'; // Red for high intensity
    case 'medium':
      return '#ff9800'; // Orange for medium intensity
    case 'low':
      return '#4CAF50'; // Green for low intensity
    default:
      return '#4a90e2'; // Blue default
  }
});

// Watch for interval changes to provide notification
watch(currentIntervalIndex, (newIndex, oldIndex) => {
  if (newIndex > oldIndex && workout.value && workout.value.intervals) {
    // Notify of the new interval
    // This could be enhanced with sound effects or voice announcements
  }
});
</script>

<template>
  <div class="interval-timer" v-if="workout">
    <div class="timer-header">
      <button 
        class="back-button" 
        @click="router.push({ name: 'interval-workouts' })"
        v-voix="'button-exit-workout'"
        hint="Exit this workout and return to interval workouts list">
        &larr; Exit
      </button>
      <h2 class="workout-title">{{ workout.name }}</h2>
    </div>
    
    <div class="workout-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: overallProgressPercentage + '%' }"></div>
      </div>
      <div class="progress-info">
        <span>
          {{ currentIntervalIndex + 1 }} / {{ workout.intervals.length }}
        </span>
        <span>{{ formattedElapsedTime }}</span>
      </div>
    </div>
    
    <div 
      class="current-interval" 
      v-if="currentInterval" 
      :style="{ borderColor: intensityColor }">
      <div class="interval-name">
        {{ currentInterval.name }}
      </div>
      
      <div class="timer-display">
        {{ formattedRemainingTime }}
      </div>
      
      <div class="interval-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ 
              width: progressPercentage + '%',
              backgroundColor: intensityColor
            }">
          </div>
        </div>
      </div>
      
      <div class="interval-description">
        {{ currentInterval.description }}
      </div>
      
      <div class="interval-intensity">
        Intensity: <span :class="'intensity-' + currentInterval.intensity">{{ currentInterval.intensity }}</span>
      </div>
    </div>
    
    <div class="next-interval" v-if="nextInterval">
      <div class="next-label">NEXT UP</div>
      <div class="next-interval-name">
        {{ nextInterval.name }}
      </div>
      <div class="next-interval-duration">
        {{ nextInterval.duration }} seconds
      </div>
    </div>
    
    <div class="timer-controls">
      <button 
        v-if="!isRunning && !isPaused && !isCompleted"
        class="btn btn-primary start-btn" 
        @click="startWorkout"
        v-voix="'button-start-workout'"
        hint="Start the workout timer">
        Start Workout
      </button>
      
      <template v-if="isRunning && !isCompleted">
        <button 
          class="btn btn-secondary" 
          @click="pauseWorkout"
          v-voix="'button-pause-timer'"
          hint="Pause the workout timer">
          Pause
        </button>
        <button 
          class="btn btn-secondary" 
          @click="skipInterval"
          v-voix="'button-skip-interval'"
          hint="Skip to the next interval">
          Skip
        </button>
      </template>
      
      <template v-if="isPaused && !isCompleted">
        <button 
          class="btn btn-primary" 
          @click="resumeWorkout"
          v-voix="'button-resume-timer'"
          hint="Resume the workout timer">
          Resume
        </button>
        <button 
          class="btn btn-secondary" 
          @click="restartInterval"
          v-voix="'button-restart-interval'"
          hint="Restart the current interval">
          Restart Interval
        </button>
      </template>
    </div>
    
    <!-- Completion Modal -->
    <div class="modal-overlay" v-if="showCompletionModal">
      <div class="modal">
        <h3>Workout Completed!</h3>
        
        <div class="completion-stats">
          <div class="stat-item">
            <span class="stat-label">Total Time:</span>
            <span class="stat-value">{{ formattedElapsedTime }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Est. Calories:</span>
            <span class="stat-value">{{ workout.estimatedCalories }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Intervals:</span>
            <span class="stat-value">{{ workout.intervals.length }}</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="completion-rating">How was this workout?</label>
          <div class="rating-control">
            <button 
              v-for="i in 5" 
              :key="i"
              :class="['rating-btn', { active: completionRating >= i }]"
              @click="completionRating = i"
              v-voix="'button-rate-workout-' + i"
              hint="Rate this workout {{ i }} out of 5 stars">
              ★
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label for="completion-notes">Notes</label>
          <textarea 
            id="completion-notes" 
            v-model="completionNotes"
            placeholder="How did you feel? What could be improved?"
            v-voix="'input-workout-notes'"
            hint="Enter notes about your workout experience">
          </textarea>
        </div>
        
        <div class="modal-actions">
          <button 
            class="btn btn-secondary" 
            @click="skipSaving"
            v-voix="'button-skip-saving-workout'"
            hint="Exit without saving workout data">
            Skip
          </button>
          <button 
            class="btn btn-primary" 
            @click="saveCompletion"
            v-voix="'button-save-workout-completion'"
            hint="Save this workout to your history">
            Save Workout
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <div class="loading" v-else>
    Loading workout...
  </div>
</template>

<style scoped>
.interval-timer {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.timer-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.back-button {
  background: none;
  border: none;
  padding: 0.5rem 1rem 0.5rem 0;
  font-size: 1rem;
  cursor: pointer;
  color: #4a90e2;
}

.workout-title {
  margin: 0;
  font-size: 1.5rem;
}

.workout-progress {
  margin-bottom: 2rem;
}

.progress-bar {
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background-color: #4a90e2;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
}

.current-interval {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  border-left: 6px solid #4a90e2;
}

.interval-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.timer-display {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.interval-progress {
  margin-bottom: 1.5rem;
}

.interval-description {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1rem;
}

.interval-intensity {
  font-size: 0.9rem;
  color: #777;
}

.intensity-high {
  color: #f44336;
  font-weight: bold;
}

.intensity-medium {
  color: #ff9800;
  font-weight: bold;
}

.intensity-low {
  color: #4CAF50;
  font-weight: bold;
}

.next-interval {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 2rem;
}

.next-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #777;
  margin-bottom: 0.5rem;
}

.next-interval-name {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.next-interval-duration {
  font-size: 0.9rem;
  color: #666;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  min-width: 120px;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.start-btn {
  font-size: 1.2rem;
  padding: 1rem 2rem;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal {
  background-color: #fff;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
}

.completion-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
}

.stat-item:last-child {
  grid-column: 1 / -1;
}

.stat-label {
  font-size: 0.9rem;
  color: #777;
  display: block;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 500;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.rating-control {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.rating-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #ddd;
  transition: color 0.2s;
}

.rating-btn.active {
  color: #ffc107;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 1.1rem;
  color: #666;
}
</style>