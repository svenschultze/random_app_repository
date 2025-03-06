<script setup>
import { RouterView } from 'vue-router'
import { provide, ref } from 'vue'

// App-wide state management
const diaryEntries = ref([])
const habits = ref([])
const moodEntries = ref([])

// Provide app-wide state to child components
provide('diaryEntries', diaryEntries)
provide('habits', habits)
provide('moodEntries', moodEntries)
</script>

<template>
  <div class="app-container">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #42b883;
  --secondary-color: #35495e;
  --accent-color: #ff7e67;
  --light-bg: #f8f9fa;
  --dark-text: #2c3e50;
  --light-text: #ffffff;
  --border-radius: 8px;
  --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition-speed: 0.3s;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', sans-serif;
  color: var(--dark-text);
  background-color: var(--light-bg);
  min-height: 100vh;
}

.app-container {
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Button styles */
.btn {
  padding: 12px 24px;
  border-radius: var(--border-radius);
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--light-text);
}

.btn-primary:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--light-text);
}

.btn-secondary:hover {
  background-color: #2a3b4d;
  transform: translateY(-2px);
}

/* Card styles */
.card {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  margin-bottom: 1rem;
}

/* Form styles */
input, textarea, select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  font-size: 1rem;
}

textarea {
  min-height: 150px;
  resize: vertical;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
</style>
