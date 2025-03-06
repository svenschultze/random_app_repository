<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import mockDataStore from '@/store/mockDataStore';
import InsightsPanel from '@/components/InsightsPanel.vue';

const router = useRouter();

// Initialize the store on component mount
onMounted(() => {
  if (!mockDataStore.state.data) {
    mockDataStore.generateData();
  }
});

// Get insights
const insights = computed(() => mockDataStore.state.data?.insights || []);

// Filter insights by type
const filterInsightsByType = (type) => {
  if (!insights.value) return [];
  return insights.value.filter(insight => insight.type === type);
};

// Get insights by type
const performanceInsights = computed(() => filterInsightsByType('performance'));
const errorInsights = computed(() => filterInsightsByType('error'));
const trafficInsights = computed(() => filterInsightsByType('traffic'));
const resourceInsights = computed(() => filterInsightsByType('resource'));
const securityInsights = computed(() => filterInsightsByType('security'));

// Navigate back to home
const goBack = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <main class="insights-view">
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
        
        <h1 class="text-2xl font-bold">System Insights</h1>
        <p class="text-gray-600 mt-1">
          Automatically detected patterns and issues across all microservices
        </p>
      </div>
      
      <!-- All Insights -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">All Insights</h2>
        <div class="bg-white p-4 rounded-lg shadow">
          <InsightsPanel :insights="insights" />
        </div>
      </div>
      
      <!-- Insights by category -->
      <div class="mb-8" v-if="performanceInsights.length > 0">
        <h2 class="text-xl font-semibold mb-4">Performance Insights</h2>
        <div class="bg-white p-4 rounded-lg shadow">
          <InsightsPanel :insights="performanceInsights" />
        </div>
      </div>
      
      <div class="mb-8" v-if="errorInsights.length > 0">
        <h2 class="text-xl font-semibold mb-4">Error Insights</h2>
        <div class="bg-white p-4 rounded-lg shadow">
          <InsightsPanel :insights="errorInsights" />
        </div>
      </div>
      
      <div class="mb-8" v-if="trafficInsights.length > 0">
        <h2 class="text-xl font-semibold mb-4">Traffic Insights</h2>
        <div class="bg-white p-4 rounded-lg shadow">
          <InsightsPanel :insights="trafficInsights" />
        </div>
      </div>
      
      <div class="mb-8" v-if="resourceInsights.length > 0">
        <h2 class="text-xl font-semibold mb-4">Resource Insights</h2>
        <div class="bg-white p-4 rounded-lg shadow">
          <InsightsPanel :insights="resourceInsights" />
        </div>
      </div>
      
      <div class="mb-8" v-if="securityInsights.length > 0">
        <h2 class="text-xl font-semibold mb-4">Security Insights</h2>
        <div class="bg-white p-4 rounded-lg shadow">
          <InsightsPanel :insights="securityInsights" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.insights-view {
  min-height: 100vh;
  background-color: #f9fafb;
  padding-bottom: 2rem;
}
</style>