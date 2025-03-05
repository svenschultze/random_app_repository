<script setup>
import { useExerciseStore } from '@/stores/exerciseStore';
import { computed } from 'vue';

const exerciseStore = useExerciseStore();

const activeExercise = computed(() => exerciseStore.activeExercise);
const currentStep = computed(() => exerciseStore.currentStep);
const isActive = computed(() => exerciseStore.isExerciseActive);
const remainingTime = computed(() => exerciseStore.remainingTime);
const formattedTime = computed(() => exerciseStore.formatTime(remainingTime.value));

function closeExercise() {
  exerciseStore.stopExercise();
}

function nextStep() {
  exerciseStore.nextStep();
}

function prevStep() {
  exerciseStore.previousStep();
}

const progressPercent = computed(() => {
  if (!activeExercise.value) return 0;
  return Math.round((currentStep.value / (activeExercise.value.steps.length - 1)) * 100);
});

const timeProgressPercent = computed(() => {
  if (!activeExercise.value) return 0;
  const totalSeconds = activeExercise.value.duration * 60;
  return Math.round(((totalSeconds - remainingTime.value) / totalSeconds) * 100);
});
</script>

<template>
  <div class="exercise-modal-overlay" v-if="isActive">
    <div class="exercise-modal" v-voix="'Mindful exercise in progress'">
      <div class="exercise-modal-header">
        <h3 v-voix="activeExercise?.name">{{ activeExercise?.name }}</h3>
        <button 
          class="btn-close" 
          @click="closeExercise" 
          aria-label="Close exercise" 
          v-voix="'Close exercise'"
          hint="Exit the current exercise session"
        ></button>
      </div>
      
      <div class="exercise-modal-body">
        <div class="timer-section mb-4" v-voix="'Time remaining: ' + formattedTime">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="timer-label">Time Remaining</span>
            <span class="timer-display">{{ formattedTime }}</span>
          </div>
          <div class="progress">
            <div 
              class="progress-bar bg-success" 
              role="progressbar" 
              :style="`width: ${timeProgressPercent}%`" 
              :aria-valuenow="timeProgressPercent" 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
        </div>
        
        <div class="steps-progress mb-4">
          <div class="d-flex justify-content-between mb-2">
            <span v-voix="'Step ' + (currentStep + 1) + ' of ' + activeExercise?.steps.length">
              Step {{ currentStep + 1 }} of {{ activeExercise?.steps.length }}
            </span>
            <span>{{ progressPercent }}% Complete</span>
          </div>
          <div class="progress">
            <div 
              class="progress-bar" 
              role="progressbar" 
              :style="`width: ${progressPercent}%`" 
              :aria-valuenow="progressPercent" 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
        </div>
        
        <div class="step-content mb-4">
          <div 
            class="current-step p-4 bg-light rounded" 
            v-voix="'Current Step: ' + activeExercise?.steps[currentStep]"
          >
            {{ activeExercise?.steps[currentStep] }}
          </div>
        </div>
        
        <div class="navigation-buttons d-flex justify-content-between">
          <button 
            class="btn btn-outline-secondary" 
            @click="prevStep" 
            :disabled="currentStep === 0"
            v-voix="'Previous Step'"
            hint="Go back to the previous instruction step"
          >
            <i class="bi bi-arrow-left me-2"></i> Previous
          </button>
          
          <button 
            class="btn btn-success" 
            @click="nextStep" 
            :disabled="!activeExercise || currentStep === activeExercise.steps.length - 1"
            v-voix="'Next Step'"
            hint="Continue to the next instruction step"
          >
            Next <i class="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exercise-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.exercise-modal {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in;
}

.exercise-modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.exercise-modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

.exercise-modal-body {
  padding: 1.5rem;
}

.timer-display {
  font-size: 1.2rem;
  font-weight: 600;
  color: #4a854a;
}

.current-step {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #2c3e50;
  transition: all 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>