<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { 
  getIntervalWorkoutById, 
  createIntervalWorkout, 
  updateIntervalWorkout,
  deleteIntervalWorkout
} from '@/services/intervalWorkoutService';
import { WORKOUT_TYPES } from '@/services/dataService';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps({
  workoutId: {
    type: String,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['saved', 'cancelled']);

// Workout data
const workout = ref({
  id: null,
  name: '',
  description: '',
  type: 'HIIT',
  intervals: [],
  estimatedCalories: 0,
  totalDuration: 0,
  favorite: false
});

// Intensity options
const intensityOptions = [
  { value: 'low', label: 'Low', color: '#4CAF50' },
  { value: 'medium', label: 'Medium', color: '#FFC107' },
  { value: 'high', label: 'High', color: '#F44336' }
];

// UI controls
const isLoading = ref(false);
const errors = ref({});
const showIntervalForm = ref(false);
const currentInterval = ref({
  id: null,
  name: '',
  duration: 30,
  intensity: 'medium',
  description: ''
});
const editingIntervalIndex = ref(-1);

// Load workout data if in edit mode
onMounted(() => {
  if (props.isEdit && props.workoutId) {
    loadWorkout();
  }
});

// Load workout data for editing
const loadWorkout = () => {
  isLoading.value = true;
  try {
    const workoutData = getIntervalWorkoutById(props.workoutId);
    if (workoutData) {
      workout.value = JSON.parse(JSON.stringify(workoutData)); // Deep copy
    } else {
      errors.value.general = 'Workout not found';
    }
  } catch (error) {
    errors.value.general = 'Error loading workout';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// Format duration in mm:ss format
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Total workout duration
const totalDuration = computed(() => {
  return workout.value.intervals.reduce((total, interval) => total + interval.duration, 0);
});

// Add or update an interval
const saveInterval = () => {
  // Validate interval form
  if (!currentInterval.value.name.trim()) {
    errors.value.intervalName = 'Name is required';
    return;
  }
  if (currentInterval.value.duration <= 0) {
    errors.value.intervalDuration = 'Duration must be greater than 0';
    return;
  }
  
  errors.value = {};
  
  const intervalToSave = {
    id: currentInterval.value.id || `interval-${uuidv4()}`,
    name: currentInterval.value.name,
    duration: parseInt(currentInterval.value.duration),
    intensity: currentInterval.value.intensity,
    description: currentInterval.value.description
  };
  
  if (editingIntervalIndex.value >= 0) {
    // Update existing interval
    workout.value.intervals[editingIntervalIndex.value] = intervalToSave;
  } else {
    // Add new interval
    workout.value.intervals.push(intervalToSave);
  }
  
  // Reset form and close it
  resetIntervalForm();
  showIntervalForm.value = false;
};

// Reset interval form
const resetIntervalForm = () => {
  currentInterval.value = {
    id: null,
    name: '',
    duration: 30,
    intensity: 'medium',
    description: ''
  };
  editingIntervalIndex.value = -1;
  errors.value = {};
};

// Open interval form for editing
const editInterval = (index) => {
  const interval = workout.value.intervals[index];
  currentInterval.value = JSON.parse(JSON.stringify(interval)); // Deep copy
  editingIntervalIndex.value = index;
  showIntervalForm.value = true;
};

// Remove an interval
const removeInterval = (index) => {
  if (confirm(`Are you sure you want to remove the "${workout.value.intervals[index].name}" interval?`)) {
    workout.value.intervals.splice(index, 1);
  }
};

// Move interval up in the sequence
const moveIntervalUp = (index) => {
  if (index > 0) {
    const temp = workout.value.intervals[index];
    workout.value.intervals[index] = workout.value.intervals[index - 1];
    workout.value.intervals[index - 1] = temp;
  }
};

// Move interval down in the sequence
const moveIntervalDown = (index) => {
  if (index < workout.value.intervals.length - 1) {
    const temp = workout.value.intervals[index];
    workout.value.intervals[index] = workout.value.intervals[index + 1];
    workout.value.intervals[index + 1] = temp;
  }
};

// Duplicate an interval
const duplicateInterval = (index) => {
  const original = workout.value.intervals[index];
  const copy = {
    ...JSON.parse(JSON.stringify(original)),
    id: `interval-${uuidv4()}`,
    name: `${original.name} (Copy)`
  };
  
  workout.value.intervals.splice(index + 1, 0, copy);
};

// Add preset intervals
const addPresetIntervals = (preset) => {
  if (preset === 'tabata') {
    // Add Tabata intervals (20s work, 10s rest) x 8
    for (let i = 0; i < 8; i++) {
      workout.value.intervals.push({
        id: `tabata-work-${i+1}-${uuidv4()}`,
        name: 'Work',
        duration: 20,
        intensity: 'high',
        description: 'High intensity work interval'
      });
      
      workout.value.intervals.push({
        id: `tabata-rest-${i+1}-${uuidv4()}`,
        name: 'Rest',
        duration: 10,
        intensity: 'low',
        description: 'Brief rest interval'
      });
    }
  } else if (preset === 'pyramid') {
    // Add pyramid intervals (increasing then decreasing)
    const workDurations = [20, 30, 40, 50, 60, 50, 40, 30, 20];
    
    workDurations.forEach((duration, i) => {
      workout.value.intervals.push({
        id: `pyramid-work-${i+1}-${uuidv4()}`,
        name: 'Work',
        duration: duration,
        intensity: 'high',
        description: 'High intensity interval'
      });
      
      if (i < workDurations.length - 1) {
        workout.value.intervals.push({
          id: `pyramid-rest-${i+1}-${uuidv4()}`,
          name: 'Rest',
          duration: 20,
          intensity: 'low',
          description: 'Recovery'
        });
      }
    });
  } else if (preset === 'emom') {
    // Every Minute On the Minute
    for (let i = 0; i < 10; i++) {
      workout.value.intervals.push({
        id: `emom-work-${i+1}-${uuidv4()}`,
        name: 'Work',
        duration: 45,
        intensity: 'high',
        description: 'Complete the work within 45 seconds'
      });
      
      workout.value.intervals.push({
        id: `emom-rest-${i+1}-${uuidv4()}`,
        name: 'Rest',
        duration: 15,
        intensity: 'low',
        description: 'Rest until the next minute starts'
      });
    }
  } else if (preset === 'amrap') {
    // As Many Rounds As Possible setup
    workout.value.intervals.push({
      id: `amrap-warmup-${uuidv4()}`,
      name: 'Warm Up',
      duration: 180,
      intensity: 'low',
      description: 'Warm up with dynamic movements'
    });
    
    for (let i = 0; i < 3; i++) {
      workout.value.intervals.push({
        id: `amrap-work-${i+1}-${uuidv4()}`,
        name: 'AMRAP',
        duration: 300,
        intensity: 'high',
        description: 'Complete as many rounds as possible in 5 minutes'
      });
      
      if (i < 2) {
        workout.value.intervals.push({
          id: `amrap-rest-${i+1}-${uuidv4()}`,
          name: 'Rest',
          duration: 120,
          intensity: 'low',
          description: 'Recover between AMRAP rounds'
        });
      }
    }
    
    workout.value.intervals.push({
      id: `amrap-cooldown-${uuidv4()}`,
      name: 'Cool Down',
      duration: 180,
      intensity: 'low',
      description: 'Gentle cool down'
    });
  }
};

// Submit the entire workout form
const submitForm = () => {
  // Validate form
  errors.value = {};
  
  if (!workout.value.name.trim()) {
    errors.value.name = 'Workout name is required';
  }
  
  if (!workout.value.type) {
    errors.value.type = 'Workout type is required';
  }
  
  if (workout.value.intervals.length === 0) {
    errors.value.intervals = 'At least one interval is required';
  }
  
  // Check for errors
  if (Object.keys(errors.value).length > 0) {
    return;
  }
  
  // Prepare data
  const workoutData = {
    ...workout.value,
    totalDuration: totalDuration.value,
    estimatedCalories: workout.value.estimatedCalories || calculateEstimatedCalories()
  };
  
  try {
    isLoading.value = true;
    
    if (props.isEdit) {
      // Update existing workout
      updateIntervalWorkout(props.workoutId, workoutData);
    } else {
      // Create new workout
      createIntervalWorkout(workoutData);
    }
    
    emit('saved');
  } catch (error) {
    errors.value.general = 'Error saving workout';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// Calculate estimated calories based on workout duration and intensity
const calculateEstimatedCalories = () => {
  // Simple estimate based on intensity and duration
  let caloriesPerMinute = 0;
  let highIntensityIntervals = 0;
  let mediumIntensityIntervals = 0;
  let lowIntensityIntervals = 0;
  
  // Count intervals by intensity
  workout.value.intervals.forEach(interval => {
    if (interval.intensity === 'high') {
      highIntensityIntervals += interval.duration;
    } else if (interval.intensity === 'medium') {
      mediumIntensityIntervals += interval.duration;
    } else {
      lowIntensityIntervals += interval.duration;
    }
  });
  
  // Calculate calories (very rough estimate)
  const highCalories = highIntensityIntervals * 0.17; // ~10 calories per minute
  const mediumCalories = mediumIntensityIntervals * 0.12; // ~7 calories per minute
  const lowCalories = lowIntensityIntervals * 0.07; // ~4 calories per minute
  
  return Math.round(highCalories + mediumCalories + lowCalories);
};

// Cancel form
const cancelForm = () => {
  if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
    emit('cancelled');
  }
};

// Delete workout (in edit mode only)
const deleteWorkout = () => {
  if (props.isEdit && confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
    try {
      isLoading.value = true;
      deleteIntervalWorkout(props.workoutId);
      emit('saved');
    } catch (error) {
      errors.value.general = 'Error deleting workout';
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  }
};

// Check if a workout is predefined
const isPredefined = computed(() => {
  if (!props.workoutId) return false;
  return !props.workoutId.includes('custom') && !props.workoutId.startsWith('workout-');
});

// Get interval background color based on intensity
const getIntervalColor = (intensity) => {
  const option = intensityOptions.find(opt => opt.value === intensity);
  return option ? option.color : '#ccc';
};
</script>

<template>
  <div class="interval-workout-form">
    <h2>{{ isEdit ? 'Edit Interval Workout' : 'Create Interval Workout' }}</h2>
    
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
    
    <form @submit.prevent="submitForm" class="workout-form">
      <!-- Main form errors -->
      <div v-if="errors.general" class="error-message general-error">
        {{ errors.general }}
      </div>
      
      <!-- Workout Name -->
      <div class="form-group">
        <label for="workout-name" v-voix="'label-workout-name'" hint="Enter the name of your interval workout">
          Workout Name*
        </label>
        <input 
          id="workout-name" 
          v-model="workout.name" 
          type="text" 
          class="form-control"
          placeholder="e.g., HIIT Cardio Blast"
          v-voix="'input-workout-name'"
          hint="Enter a descriptive name for your workout"
        >
        <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
      </div>
      
      <!-- Workout Type -->
      <div class="form-group">
        <label for="workout-type" v-voix="'label-workout-type'" hint="Select the type of workout">
          Workout Type*
        </label>
        <select 
          id="workout-type" 
          v-model="workout.type"
          class="form-control"
          v-voix="'select-workout-type'"
          hint="Choose what kind of workout this is"
        >
          <option v-for="type in WORKOUT_TYPES" :key="type" :value="type">{{ type }}</option>
        </select>
        <div v-if="errors.type" class="error-message">{{ errors.type }}</div>
      </div>
      
      <!-- Workout Description -->
      <div class="form-group">
        <label for="workout-description" v-voix="'label-workout-description'" hint="Describe your interval workout">
          Description
        </label>
        <textarea 
          id="workout-description" 
          v-model="workout.description" 
          class="form-control" 
          rows="3"
          placeholder="Describe what this workout is about and what it targets"
          v-voix="'textarea-workout-description'"
          hint="Add details about what this workout targets and how it works"
        ></textarea>
      </div>
      
      <!-- Interval List Section -->
      <div class="intervals-section">
        <div class="section-header">
          <h3 v-voix="'heading-intervals'" hint="Manage your workout intervals">Intervals</h3>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="showIntervalForm = true; resetIntervalForm()"
            v-voix="'button-add-interval'"
            hint="Add a new interval to your workout"
          >
            + Add Interval
          </button>
        </div>
        
        <div v-if="errors.intervals" class="error-message">{{ errors.intervals }}</div>
        
        <!-- Interval presets -->
        <div class="presets-section">
          <span class="presets-label">Quick add:</span>
          <button 
            type="button" 
            class="btn btn-sm btn-preset" 
            @click="addPresetIntervals('tabata')"
            v-voix="'button-add-tabata'"
            hint="Add Tabata intervals: 20 seconds work, 10 seconds rest, repeated 8 times"
          >
            Tabata
          </button>
          <button 
            type="button" 
            class="btn btn-sm btn-preset" 
            @click="addPresetIntervals('pyramid')"
            v-voix="'button-add-pyramid'"
            hint="Add pyramid intervals with increasing then decreasing work periods"
          >
            Pyramid
          </button>
          <button 
            type="button" 
            class="btn btn-sm btn-preset" 
            @click="addPresetIntervals('emom')"
            v-voix="'button-add-emom'"
            hint="Add Every Minute On the Minute intervals"
          >
            EMOM
          </button>
          <button 
            type="button" 
            class="btn btn-sm btn-preset" 
            @click="addPresetIntervals('amrap')"
            v-voix="'button-add-amrap'"
            hint="Add As Many Rounds As Possible format"
          >
            AMRAP
          </button>
        </div>
        
        <!-- Intervals list -->
        <div v-if="workout.intervals.length > 0" class="intervals-list">
          <div v-for="(interval, index) in workout.intervals" :key="interval.id" class="interval-item">
            <div 
              class="interval-color-bar" 
              :style="{ backgroundColor: getIntervalColor(interval.intensity) }"
            ></div>
            <div class="interval-content">
              <div class="interval-details">
                <h4 class="interval-name">{{ interval.name }}</h4>
                <div class="interval-duration">{{ formatDuration(interval.duration) }}</div>
                <div class="interval-intensity">{{ interval.intensity }}</div>
              </div>
              <div v-if="interval.description" class="interval-description">
                {{ interval.description }}
              </div>
            </div>
            <div class="interval-actions">
              <button 
                type="button" 
                class="btn btn-icon" 
                @click="moveIntervalUp(index)"
                :disabled="index === 0"
                v-voix="'button-move-up-' + index"
                :hint="'Move ' + interval.name + ' interval up'"
              >
                ↑
              </button>
              <button 
                type="button" 
                class="btn btn-icon" 
                @click="moveIntervalDown(index)"
                :disabled="index === workout.intervals.length - 1"
                v-voix="'button-move-down-' + index"
                :hint="'Move ' + interval.name + ' interval down'"
              >
                ↓
              </button>
              <button 
                type="button" 
                class="btn btn-icon" 
                @click="duplicateInterval(index)"
                v-voix="'button-duplicate-' + index"
                :hint="'Duplicate ' + interval.name + ' interval'"
              >
                ⧉
              </button>
              <button 
                type="button" 
                class="btn btn-icon" 
                @click="editInterval(index)"
                v-voix="'button-edit-' + index"
                :hint="'Edit ' + interval.name + ' interval'"
              >
                ✎
              </button>
              <button 
                type="button" 
                class="btn btn-icon btn-danger" 
                @click="removeInterval(index)"
                v-voix="'button-remove-' + index"
                :hint="'Remove ' + interval.name + ' interval'"
              >
                ×
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-intervals">
          <p>No intervals yet. Add some intervals to create your workout.</p>
        </div>
        
        <div v-if="workout.intervals.length > 0" class="workout-summary">
          <div class="summary-item">
            <strong>Total Duration:</strong> {{ formatDuration(totalDuration) }}
          </div>
          <div class="summary-item">
            <strong>Intervals:</strong> {{ workout.intervals.length }}
          </div>
          <div class="summary-item">
            <strong>Est. Calories:</strong> {{ workout.estimatedCalories || calculateEstimatedCalories() }}
          </div>
        </div>
      </div>
      
      <!-- Form actions -->
      <div class="form-actions">
        <button 
          type="button" 
          class="btn btn-secondary" 
          @click="cancelForm"
          v-voix="'button-cancel'"
          hint="Cancel without saving changes"
        >
          Cancel
        </button>
        <button 
          v-if="isEdit && !isPredefined" 
          type="button" 
          class="btn btn-danger" 
          @click="deleteWorkout"
          v-voix="'button-delete-workout'"
          hint="Permanently delete this workout"
        >
          Delete Workout
        </button>
        <button 
          type="submit" 
          class="btn btn-primary" 
          :disabled="isLoading"
          v-voix="'button-save'"
          hint="Save your interval workout"
        >
          {{ isLoading ? 'Saving...' : 'Save Workout' }}
        </button>
      </div>
    </form>
    
    <!-- Interval form modal -->
    <div v-if="showIntervalForm" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ editingIntervalIndex >= 0 ? 'Edit Interval' : 'Add Interval' }}</h3>
        
        <div class="form-group">
          <label for="interval-name" v-voix="'label-interval-name'" hint="Enter interval name">
            Name*
          </label>
          <input 
            id="interval-name" 
            v-model="currentInterval.name" 
            type="text" 
            class="form-control"
            placeholder="e.g., Work, Rest, Sprint, etc."
            v-voix="'input-interval-name'"
            hint="Name this interval"
          >
          <div v-if="errors.intervalName" class="error-message">{{ errors.intervalName }}</div>
        </div>
        
        <div class="form-group">
          <label for="interval-duration" v-voix="'label-interval-duration'" hint="Set interval duration in seconds">
            Duration (seconds)*
          </label>
          <input 
            id="interval-duration" 
            v-model.number="currentInterval.duration" 
            type="number" 
            min="1" 
            class="form-control"
            v-voix="'input-interval-duration'"
            hint="Enter how long this interval should last, in seconds"
          >
          <div v-if="errors.intervalDuration" class="error-message">{{ errors.intervalDuration }}</div>
        </div>
        
        <div class="form-group">
          <label v-voix="'label-interval-intensity'" hint="Select intensity level for this interval">
            Intensity
          </label>
          <div class="intensity-options">
            <label 
              v-for="option in intensityOptions" 
              :key="option.value" 
              class="intensity-option"
              :class="{ active: currentInterval.intensity === option.value }"
              v-voix="'radio-intensity-' + option.value"
              :hint="'Set interval intensity to ' + option.label"
            >
              <input 
                type="radio" 
                :value="option.value" 
                v-model="currentInterval.intensity"
              >
              <span 
                class="intensity-color" 
                :style="{ backgroundColor: option.color }"
              ></span>
              <span class="intensity-label">{{ option.label }}</span>
            </label>
          </div>
        </div>
        
        <div class="form-group">
          <label for="interval-description" v-voix="'label-interval-description'" hint="Optional description">
            Description
          </label>
          <textarea 
            id="interval-description" 
            v-model="currentInterval.description" 
            class="form-control" 
            rows="2"
            placeholder="Optional details about this interval"
            v-voix="'textarea-interval-description'"
            hint="Add additional information about this interval"
          ></textarea>
        </div>
        
        <div class="modal-actions">
          <button 
            type="button" 
            class="btn btn-secondary" 
            @click="showIntervalForm = false"
            v-voix="'button-cancel-interval'"
            hint="Cancel without saving this interval"
          >
            Cancel
          </button>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="saveInterval"
            v-voix="'button-save-interval'"
            hint="Save this interval"
          >
            Save Interval
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.interval-workout-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  position: relative;
}

h2 {
  margin-bottom: 1.5rem;
  color: var(--text-color, #333);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #4a90e2;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.workout-form {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #333);
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1rem;
  color: var(--text-color, #333);
}

.form-control:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

textarea.form-control {
  resize: vertical;
}

.error-message {
  color: #f44336;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.general-error {
  padding: 0.75rem;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: 5px;
  margin-bottom: 1rem;
}

.intervals-section {
  margin-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
  padding-top: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  margin: 0;
  color: var(--text-color, #333);
}

.presets-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  padding: 0.75rem;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.presets-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.btn-preset {
  background-color: #e0e0e0;
  color: #333;
}

.intervals-list {
  margin-bottom: 1.5rem;
}

.interval-item {
  position: relative;
  display: flex;
  margin-bottom: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.interval-color-bar {
  width: 8px;
  background-color: #ccc;
}

.interval-content {
  flex: 1;
  padding: 0.75rem;
}

.interval-details {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.interval-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.interval-duration {
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
}

.interval-intensity {
  text-transform: capitalize;
  font-size: 0.9rem;
  font-weight: 500;
}

.interval-description {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.interval-actions {
  display: flex;
  padding: 0.5rem;
  background-color: #f5f5f5;
}

.btn-icon {
  background: none;
  border: none;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  cursor: pointer;
  font-size: 1rem;
  margin: 0 0.1rem;
}

.btn-icon:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.btn-icon:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-icon.btn-danger:hover {
  background-color: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.empty-intervals {
  padding: 2rem;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 5px;
  color: #666;
}

.workout-summary {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 5px;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
}

.btn-sm {
  padding: 0.4rem 0.75rem;
  font-size: 0.9rem;
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

/* Modal styling */
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
  z-index: 20;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1.25rem;
}

.intensity-options {
  display: flex;
  gap: 1rem;
}

.intensity-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  flex: 1;
  padding: 0.75rem;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.intensity-option:hover {
  background-color: #f5f5f5;
}

.intensity-option.active {
  background-color: #f0f7ff;
}

.intensity-option input {
  position: absolute;
  opacity: 0;
}

.intensity-color {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

.intensity-label {
  font-size: 0.9rem;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .interval-workout-form {
    padding: 1rem;
  }
  
  .workout-form {
    padding: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .intensity-options {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .intensity-option {
    flex-direction: row;
    gap: 0.5rem;
  }
  
  .intensity-color {
    margin-bottom: 0;
  }
  
  .interval-item {
    flex-direction: column;
  }
  
  .interval-color-bar {
    width: 100%;
    height: 5px;
  }
  
  .interval-actions {
    justify-content: center;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .workout-summary {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>