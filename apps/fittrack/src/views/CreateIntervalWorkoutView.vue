<script setup>
import { useRouter } from 'vue-router';
import IntervalWorkoutForm from '@/components/interval-workouts/IntervalWorkoutForm.vue';

const router = useRouter();

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
      :isEdit="false"
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