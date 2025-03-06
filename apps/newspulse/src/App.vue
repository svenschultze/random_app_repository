<script setup>
import { RouterView } from 'vue-router'
import NavigationOverlay from './components/NavigationOverlay.vue'
import NotificationCenter from './components/NotificationCenter.vue'
</script>

<template>
  <div class="app-container">
    <NavigationOverlay />
    <NotificationCenter />
    <RouterView />
  </div>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --accent-color: #e74c3c;
  --text-color: #333;
  --text-color-light: #666;
  --background-color: #f8f9fa;
  --background-color-alt: #fff;
  --border-color: #e1e8ed;
  --border-radius: 8px;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  --transition-speed: 0.3s;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color var(--transition-speed);
}

a:hover {
  color: #2980b9;
}

.app-container {
  min-height: 100vh;
  width: 100%;
}
</style>