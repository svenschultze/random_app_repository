<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Navigate back to home
const goHome = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <div class="about-view">
    <div class="container mx-auto px-4 py-10">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">About BackDash</h1>
        
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 class="text-xl font-semibold mb-4">Project Overview</h2>
          <p class="mb-4">
            BackDash is a demo visualization dashboard for a hypothetical microservices architecture. 
            It allows developers and operations teams to monitor service health, track performance metrics, 
            view logs, and receive insights about potential issues.
          </p>
          <p class="mb-4">
            <strong>The key feature of this demo is that all data is generated randomly on the client-side.</strong> 
            There's no real backend - each page refresh generates a new set of random data that simulates a real 
            microservices environment.
          </p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 class="text-xl font-semibold mb-4">Features</h2>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>Dashboard Overview:</strong> High-level metrics showing system health</li>
            <li><strong>Service Details:</strong> Detailed performance metrics for each microservice</li>
            <li><strong>Live Logs:</strong> Randomly generated logs simulating a real log stream</li>
            <li><strong>System Insights:</strong> Auto-detected patterns and issues</li>
            <li><strong>Dynamic Visualization:</strong> Interactive charts showing performance trends</li>
            <li><strong>Accessibility:</strong> Built with accessibility in mind using vue-voix</li>
          </ul>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 class="text-xl font-semibold mb-4">Technology Stack</h2>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>Vue 3:</strong> Using Composition API and &lt;script setup&gt; syntax</li>
            <li><strong>Vue Router:</strong> For navigation between dashboard views</li>
            <li><strong>Chart.js & vue-chartjs:</strong> For data visualization</li>
            <li><strong>Random Data Generation:</strong> Custom utilities for simulating real metrics</li>
            <li><strong>Accessibility:</strong> Using vue-voix for enhanced accessibility</li>
          </ul>
        </div>
        
        <div class="text-center">
          <button 
            v-voix="'go-to-dashboard-button'"
            @click="goHome" 
            class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  min-height: 100vh;
  background-color: #f9fafb;
  padding-bottom: 2rem;
}
</style>
