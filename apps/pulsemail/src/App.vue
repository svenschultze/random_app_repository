<script setup>
import { RouterView } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { computed, watch } from 'vue';
import TheNavigation from './components/TheNavigation.vue'

const route = useRoute();
const router = useRouter();

// Determine if navigation should be shown
const showNavigation = computed(() => {
  // Hide navigation on email detail and compose views
  return !['email-detail', 'email-compose'].includes(route.name);
});

// Watch for route changes to ensure proper navigation
watch(() => route.path, (newPath) => {
  console.log('Route changed:', newPath);
});
</script>

<template>
  <div class="app-container" v-voix:role="'application'" v-voix:label="'PulseMail Application'">
    <div class="main-content">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>
    
    <TheNavigation v-if="showNavigation" />
  </div>
</template>

<style>
/* Global styles */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html, body {
  height: 100%;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

/* App container */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 100%;
  margin: 0 auto;
  position: relative;
}

/* Main content area */
.main-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* Transition effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Dark theme */
body.dark-theme {
  background-color: #121212;
  color: #f5f5f5;
}

body.dark-theme .app-container {
  background-color: #121212;
}

body.dark-theme .main-content {
  background-color: #121212;
}

/* Responsive container for larger screens */
@media (min-width: 1200px) {
  .app-container {
    max-width: 1024px;
    margin: 0 auto;
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
    height: 100vh;
  }
}
</style>