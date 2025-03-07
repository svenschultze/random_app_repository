<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import store from './store'

// Initialize the store on app start
onMounted(() => {
  store.init()
})
</script>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --error-color: #e74c3c;
  --warning-color: #f39c12;
  --info-color: #3498db;
  --bg-color: #fff;
  --text-color: #333;
  --border-color: #ddd;
  --light-bg-color: #f5f5f5;
  --hover-bg-color: #f0f0f0;
  --header-bg-color: #3498db;
  --header-text-color: #fff;
}

/* Dark mode colors */
.dark-theme {
  --primary-color: #2980b9;
  --secondary-color: #27ae60;
  --error-color: #c0392b;
  --warning-color: #d35400;
  --info-color: #2980b9;
  --bg-color: #121212;
  --text-color: #f5f5f5;
  --border-color: #333;
  --light-bg-color: #1e1e1e;
  --hover-bg-color: #2a2a2a;
  --header-bg-color: #1e3a8a;
  --header-text-color: #f5f5f5;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

button {
  cursor: pointer;
  border: none;
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

button:hover {
  background-color: color-mix(in srgb, var(--primary-color) 90%, black);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

input, select, textarea {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
