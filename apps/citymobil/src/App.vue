<script setup>
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import { generateMockData } from './utils/mockData'

// Generate mock data on app load
const appData = ref({
  routes: [],
  tickets: { shortTerm: [], longTerm: [] }
})

// Regenerate data on load
onMounted(() => {
  appData.value = generateMockData()
})

// Provide appData to all components
import { provide } from 'vue'
provide('appData', appData)
</script>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style>
.app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Transition animations for route changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(50px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-50px);
  opacity: 0;
}

/* German typography */
body {
  font-family: 'Inter', 'Roboto', sans-serif;
  color: #333;
  background-color: #f8f9fa;
  line-height: 1.6;
}

h1, h2, h3 {
  font-weight: 600;
}

/* Card styles for various components */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

/* Button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0069d9;
}

.btn-secondary {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.btn-secondary:hover {
  background-color: #e9ecef;
}

/* Form controls */
.form-group {
  margin-bottom: 1.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  transition: border-color 0.2s ease;
  font-size: 1rem;
}

.form-control:focus {
  border-color: #007bff;
  outline: none;
}

/* Container for page content */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .card {
    padding: 1rem;
  }
  
  .btn {
    padding: 0.6rem 1.2rem;
  }
}
</style>
