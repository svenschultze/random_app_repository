<script setup>
import { useRouter } from 'vue-router';
import FillUpForm from '../components/fillups/FillUpForm.vue';

const router = useRouter();

// Handle successful form submission
const handleSaved = () => {
  router.push('/fillups');
};

// Handle form cancellation
const handleCancel = () => {
  router.push('/fillups');
};
</script>

<template>
  <div class="add-fillup-view">
    <header class="page-header">
      <h1 class="page-title">Add Fill-up</h1>
    </header>
    
    <FillUpForm 
      @saved="handleSaved" 
      @cancel="handleCancel" 
    />
  </div>
</template>

<style scoped>
.add-fillup-view {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}
</style>