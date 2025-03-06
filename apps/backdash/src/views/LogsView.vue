<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import mockDataStore from '@/store/mockDataStore';
import LogsViewer from '@/components/LogsViewer.vue';

const router = useRouter();

// Initialize the store on component mount
onMounted(() => {
  if (!mockDataStore.state.data) {
    mockDataStore.generateData();
  }
});

// Navigate back to home
const goBack = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <main class="logs-view">
    <div class="container mx-auto px-4 py-6">
      <!-- Header with back button -->
      <div class="mb-6">
        <button 
          v-voix="'back-to-dashboard-button'"
          @click="goBack" 
          class="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          ← Back to Dashboard
        </button>
        
        <h1 class="text-2xl font-bold">System Logs</h1>
        <p class="text-gray-600 mt-1">
          View and filter logs from all microservices in the system
        </p>
      </div>
      
      <!-- Logs viewer component -->
      <div class="bg-white p-4 rounded-lg shadow">
        <LogsViewer maxHeight="70vh" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.logs-view {
  min-height: 100vh;
  background-color: #f9fafb;
  padding-bottom: 2rem;
}
</style>