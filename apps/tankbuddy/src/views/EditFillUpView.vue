<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FillUpForm from '../components/fillups/FillUpForm.vue';
import { getFillUps } from '../services/storageService';

const router = useRouter();
const route = useRoute();
const fillUp = ref(null);
const loading = ref(true);

// Handle successful form submission
const handleSaved = () => {
  router.push('/fillups');
};

// Handle form cancellation
const handleCancel = () => {
  router.push('/fillups');
};

// Load the fill-up data based on the route parameter
onMounted(() => {
  const entryId = route.params.id;
  const fillUps = getFillUps();
  fillUp.value = fillUps.find(f => f.entryId === entryId);
  
  if (!fillUp.value) {
    // If no fill-up is found, redirect back to the list
    router.push('/fillups');
  }
  
  loading.value = false;
});
</script>

<template>
  <div class="edit-fillup-view">
    <header class="page-header">
      <h1 class="page-title">Edit Fill-up</h1>
    </header>
    
    <div v-if="loading" class="loading">
      Loading fill-up data...
    </div>
    
    <FillUpForm 
      v-else-if="fillUp" 
      :edit-mode="true" 
      :fill-up-data="fillUp" 
      @saved="handleSaved" 
      @cancel="handleCancel" 
    />
    
    <div v-else class="not-found">
      Fill-up record not found.
    </div>
  </div>
</template>

<style scoped>
.edit-fillup-view {
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

.loading, .not-found {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>