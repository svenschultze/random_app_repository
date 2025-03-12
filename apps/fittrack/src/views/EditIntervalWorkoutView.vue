<script setup>
import { useRouter, useRoute } from 'vue-router';
import IntervalWorkoutForm from '@/components/interval-workouts/IntervalWorkoutForm.vue';

const router = useRouter();
const route = useRoute();
const workoutId = route.params.id;

const handleSaved = () => {
  router.push('/interval-workouts');
};

const handleCancelled = () => {
  router.push('/interval-workouts');
};
</script>

<template>
  <main>
    <IntervalWorkoutForm 
      :workoutId="workoutId" 
      :isEdit="true"
      @saved="handleSaved"
      @cancelled="handleCancelled"
    />
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
}
</style>