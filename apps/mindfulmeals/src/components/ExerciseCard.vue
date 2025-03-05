<script setup>
import { useExerciseStore } from '@/stores/exerciseStore';

const props = defineProps({
  exercise: {
    type: Object,
    required: true
  }
});

const exerciseStore = useExerciseStore();

function startExercise() {
  exerciseStore.startExercise(props.exercise.id);
}
</script>

<template>
  <div class="card exercise-card h-100">
    <div class="card-body">
      <h5 class="card-title" v-voix="exercise.name">{{ exercise.name }}</h5>
      <p class="card-text" v-voix="'Exercise description: ' + exercise.description">
        {{ exercise.description }}
      </p>
      <div class="time-info mb-3">
        <i class="bi bi-clock"></i> 
        <span v-voix="exercise.duration + ' minutes'">{{ exercise.duration }} minutes</span>
      </div>
      <button 
        class="btn btn-success" 
        @click="startExercise" 
        v-voix="'Start ' + exercise.name + ' exercise'"
        hint="Begin this mindful eating exercise and follow guided instructions"
      >
        <i class="bi bi-play-circle me-2"></i> Start Exercise
      </button>
    </div>
  </div>
</template>

<style scoped>
.exercise-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #4a854a;
}

.exercise-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.card-title {
  color: #2c3e50;
  font-weight: 600;
}

.time-info {
  color: #6c757d;
  font-size: 0.9rem;
}
</style>