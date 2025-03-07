<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import FillUpsList from '../components/fillups/FillUpsList.vue';

const router = useRouter();

// Add a new fill-up
const addNewFillUp = () => {
  router.push('/fillups/add');
};
</script>

<template>
  <div class="fillups-view">
    <header class="fillups-header">
      <h1 class="page-title">Your Fill-ups</h1>
      
      <div class="header-actions">
        <button 
          class="btn btn-primary" 
          @click="addNewFillUp"
          v-voix="'Add new fill-up button'"
        >
          Add Fill-up
        </button>
      </div>
    </header>
    
    <FillUpsList @edit="(fillUp) => router.push(`/fillups/edit/${fillUp.entryId}`)" />
  </div>
</template>

<style scoped>
.fillups-view {
  padding: 1.5rem;
}

.fillups-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.btn-primary {
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
}

.btn-primary:hover {
  background-color: #2563eb;
}

@media (max-width: 640px) {
  .fillups-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .header-actions .btn {
    width: 100%;
  }
}
</style>