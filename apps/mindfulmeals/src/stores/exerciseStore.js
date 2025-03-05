import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { mindfulExercises } from '@/data/exercises';

export const useExerciseStore = defineStore('exercise', () => {
  const exercises = ref(mindfulExercises);
  const activeExercise = ref(null);
  const currentStep = ref(0);
  const isExerciseActive = ref(false);
  const exerciseTimer = ref(null);
  const remainingTime = ref(0);
  
  const exerciseList = computed(() => exercises.value);
  
  function startExercise(exerciseId) {
    const exercise = exercises.value.find(ex => ex.id === exerciseId);
    if (exercise) {
      activeExercise.value = exercise;
      currentStep.value = 0;
      isExerciseActive.value = true;
      remainingTime.value = exercise.duration * 60;
      startTimer();
    }
  }
  
  function stopExercise() {
    activeExercise.value = null;
    currentStep.value = 0;
    isExerciseActive.value = false;
    if (exerciseTimer.value) {
      clearInterval(exerciseTimer.value);
      exerciseTimer.value = null;
    }
  }
  
  function nextStep() {
    if (activeExercise.value && currentStep.value < activeExercise.value.steps.length - 1) {
      currentStep.value++;
      return true;
    }
    return false;
  }
  
  function previousStep() {
    if (currentStep.value > 0) {
      currentStep.value--;
      return true;
    }
    return false;
  }
  
  function startTimer() {
    if (exerciseTimer.value) {
      clearInterval(exerciseTimer.value);
    }
    exerciseTimer.value = setInterval(() => {
      if (remainingTime.value > 0) {
        remainingTime.value--;
      } else {
        stopExercise();
      }
    }, 1000);
  }
  
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
  
  return {
    exercises,
    activeExercise,
    currentStep,
    isExerciseActive,
    remainingTime,
    exerciseList,
    formatTime,
    startExercise,
    stopExercise,
    nextStep,
    previousStep
  };
});