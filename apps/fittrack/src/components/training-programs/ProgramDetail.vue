<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProgramById, updateWorkoutCompletion } from '@/services/trainingProgramService';

const route = useRoute();
const router = useRouter();
const program = ref(null);
const activePhaseIndex = ref(0);
const completionData = ref({
  duration: 0,
  distance: 0,
  notes: ''
});
const showCompletionModal = ref(false);
const selectedWorkout = ref(null);

// Load program on mount
onMounted(() => {
  loadProgram();
});

// Load program data
const loadProgram = () => {
  const programId = route.params.id;
  if (!programId) {
    router.push({ name: 'programs' });
    return;
  }
  
  const programData = getProgramById(programId);
  if (!programData) {
    router.push({ name: 'programs' });
    return;
  }
  
  program.value = programData;
  activePhaseIndex.value = programData.currentPhase;
};

// Active phase data
const activePhase = computed(() => {
  if (!program.value) return null;
  return program.value.phases[activePhaseIndex.value];
});

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Check if a workout is scheduled for today
const isScheduledForToday = (workout) => {
  const today = new Date().getDay() || 7; // 0 is Sunday, convert to 1-7 format
  return workout.scheduledDay === today;
};

// Format duration in minutes
const formatDuration = (minutes) => {
  return `${minutes} min`;
};

// Open workout completion modal
const completeWorkout = (workout) => {
  selectedWorkout.value = workout;
  completionData.value = {
    duration: workout.targetDuration,
    distance: workout.targetDistance || 0,
    notes: ''
  };
  showCompletionModal.value = true;
};

// Submit workout completion
const submitCompletion = () => {
  if (!selectedWorkout.value || !program.value) return;
  
  updateWorkoutCompletion(
    program.value.id,
    activePhase.value.id,
    selectedWorkout.value.id,
    completionData.value
  );
  
  // Reload program data
  loadProgram();
  
  // Close modal
  showCompletionModal.value = false;
  selectedWorkout.value = null;
};

// Cancel workout completion
const cancelCompletion = () => {
  showCompletionModal.value = false;
  selectedWorkout.value = null;
};

// Go back to program list
const goBack = () => {
  router.push({ name: 'programs' });
};

// Navigate to different phase
const viewPhase = (index) => {
  if (index >= 0 && index < program.value.phases.length) {
    activePhaseIndex.value = index;
  }
};

// Check if phase is accessible
const isPhaseAccessible = (index) => {
  if (!program.value) return false;
  return index <= program.value.currentPhase;
};
</script>

<template>
  <div class="program-detail" v-if="program">
    <div class="program-header">
      <button 
        class="back-button" 
        @click="goBack"
        v-voix="'button-back-to-programs'"
        hint="Return to the training programs list">
        &larr; Back
      </button>
      <h2>{{ program.name }}</h2>
      <div class="program-progress" v-if="program.active">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: program.progress + '%' }"></div>
        </div>
        <span class="progress-text">
          {{ program.progress }}% Complete
        </span>
      </div>
      <p class="program-description">{{ program.description }}</p>
      <div class="program-meta">
        <div class="meta-item" v-if="program.startDate">
          <span class="meta-label">Start Date:</span>
          <span class="meta-value">{{ formatDate(program.startDate) }}</span>
        </div>
        <div class="meta-item" v-if="program.endDate">
          <span class="meta-label">End Date:</span>
          <span class="meta-value">{{ formatDate(program.endDate) }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Status:</span>
          <span class="meta-value status">
            {{ program.completed ? 'Completed' : program.active ? 'Active' : 'Not Started' }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="phase-navigation">
      <button 
        v-for="(phase, index) in program.phases" 
        :key="phase.id"
        :class="{ 
          'phase-button': true,
          'active': index === activePhaseIndex,
          'locked': !isPhaseAccessible(index)
        }"
        @click="isPhaseAccessible(index) && viewPhase(index)"
        :disabled="!isPhaseAccessible(index)"
        v-voix="'button-view-phase-' + phase.id"
        :hint="'View workouts for the ' + phase.name + ' phase'">
        {{ phase.name }}
        <span v-if="!isPhaseAccessible(index)" class="lock-icon">🔒</span>
      </button>
    </div>
    
    <div class="phase-detail" v-if="activePhase">
      <h3>{{ activePhase.name }}</h3>
      <p class="phase-description">{{ activePhase.description }}</p>
      <p class="phase-duration">
        Duration: {{ activePhase.duration }} days
      </p>
      
      <div class="workouts-list">
        <div 
          v-for="workout in activePhase.workouts" 
          :key="workout.id"
          :class="{
            'workout-card': true,
            'completed': workout.completed,
            'today': isScheduledForToday(workout)
          }">
          <div class="workout-header">
            <h4>{{ workout.name }}</h4>
            <span 
              class="workout-badge today-badge" 
              v-if="isScheduledForToday(workout) && !workout.completed">
              Today
            </span>
            <span 
              class="workout-badge completed-badge" 
              v-if="workout.completed">
              Completed
            </span>
          </div>
          
          <p class="workout-description">{{ workout.description }}</p>
          
          <div class="workout-details">
            <div class="detail-item">
              <strong>Type:</strong> {{ workout.type }}
            </div>
            <div class="detail-item">
              <strong>Duration:</strong> {{ formatDuration(workout.targetDuration) }}
            </div>
            <div class="detail-item" v-if="workout.targetDistance">
              <strong>Distance:</strong> {{ workout.targetDistance }} km
            </div>
            
            <div class="detail-item schedule">
              <strong>Scheduled:</strong> Day {{ workout.scheduledDay }}
            </div>
          </div>
          
          <div class="workout-actions">
            <button 
              v-if="!workout.completed && program.active"
              class="btn btn-primary" 
              @click="completeWorkout(workout)"
              v-voix="'button-complete-workout-' + workout.id"
              :hint="'Mark the ' + workout.name + ' workout as completed'">
              Complete Workout
            </button>
            
            <div class="completion-details" v-if="workout.completed">
              <div class="completion-item">
                <strong>Actual Duration:</strong> {{ workout.actualDuration }} min
              </div>
              <div class="completion-item" v-if="workout.actualDistance">
                <strong>Actual Distance:</strong> {{ workout.actualDistance }} km
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Completion Modal -->
    <div class="modal-overlay" v-if="showCompletionModal">
      <div class="modal">
        <h3>
          Complete {{ selectedWorkout ? selectedWorkout.name : 'Workout' }}
        </h3>
        
        <div class="form-group">
          <label for="duration">Duration (minutes)</label>
          <input 
            type="number" 
            id="duration" 
            v-model="completionData.duration"
            v-voix="'input-workout-duration'"
            hint="Enter the actual workout duration in minutes">
        </div>
        
        <div class="form-group" v-if="selectedWorkout && selectedWorkout.targetDistance">
          <label for="distance">Distance (km)</label>
          <input 
            type="number" 
            id="distance" 
            v-model="completionData.distance"
            step="0.1"
            v-voix="'input-workout-distance'"
            hint="Enter the actual distance covered in kilometers">
        </div>
        
        <div class="form-group">
          <label for="notes">Notes</label>
          <textarea 
            id="notes" 
            v-model="completionData.notes"
            placeholder="How did it go? Any difficulties?"
            v-voix="'input-workout-notes'"
            hint="Add notes about your workout experience">
          </textarea>
        </div>
        
        <div class="modal-actions">
          <button 
            class="btn btn-secondary" 
            @click="cancelCompletion"
            v-voix="'button-cancel-workout-completion'"
            hint="Cancel without saving workout data">
            Cancel
          </button>
          <button 
            class="btn btn-primary" 
            @click="submitCompletion"
            v-voix="'button-save-workout-completion'"
            hint="Save your completed workout data">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <div class="loading" v-else>
    Loading program data...
  </div>
</template>

<style scoped>
.program-detail {
  padding: 1rem;
  max-width: 900px;
  margin: 0 auto;
}

.program-header {
  margin-bottom: 2rem;
}

.back-button {
  background: none;
  border: none;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  cursor: pointer;
  color: #4a90e2;
}

.program-progress {
  margin: 1rem 0;
}

.progress-bar {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 4px;
}

.progress-text {
  font-size: 0.9rem;
  color: #666;
}

.program-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.program-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 0.25rem;
}

.meta-value {
  font-size: 1rem;
  font-weight: 500;
}

.meta-value.status {
  color: #4a90e2;
}

.phase-navigation {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.phase-button {
  padding: 0.6rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.phase-button.active {
  background-color: #4a90e2;
  color: #fff;
  border-color: #4a90e2;
}

.phase-button.locked {
  color: #999;
  background-color: #f0f0f0;
  cursor: not-allowed;
}

.lock-icon {
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

.phase-detail {
  margin-bottom: 2rem;
}

.phase-description {
  color: #666;
  margin-bottom: 1rem;
}

.phase-duration {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 1.5rem;
}

.workouts-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.workout-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 1.25rem;
  transition: transform 0.2s;
}

.workout-card:hover {
  transform: translateY(-3px);
}

.workout-card.completed {
  border-left: 4px solid #4CAF50;
}

.workout-card.today {
  border-left: 4px solid #4a90e2;
}

.workout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.workout-header h4 {
  margin: 0;
  font-size: 1.1rem;
}

.workout-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

.today-badge {
  background-color: #e3f2fd;
  color: #1976d2;
}

.completed-badge {
  background-color: #e8f5e9;
  color: #388e3c;
}

.workout-description {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.4;
}

.workout-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.detail-item {
  font-size: 0.9rem;
}

.detail-item.schedule {
  grid-column: 1 / -1;
}

.workout-actions {
  display: flex;
  justify-content: flex-start;
}

.btn {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  text-align: center;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
  margin-right: 0.75rem;
}

.completion-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  border-top: 1px solid #f0f0f0;
  padding-top: 1rem;
  width: 100%;
}

.completion-item {
  font-size: 0.9rem;
  color: #4CAF50;
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
  border-radius: 10px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1rem;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
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