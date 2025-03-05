<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from './components/layout/NavigationBar.vue'
import ConnectionStatus from './components/common/ConnectionStatus.vue'
import NotificationToast from './components/common/NotificationToast.vue'

const route = useRoute()
const notification = ref({
  show: false,
  message: '',
  type: 'info'
})
const isOnline = ref(true)
const isWelcomeOrOnboarding = computed(() => 
  ['welcome', 'onboarding'].includes(route.name)
)

// Show notification with optional timeout
const showNotification = (message, type = 'info', timeout = 3000) => {
  notification.value = { show: true, message, type }
  if (timeout) {
    setTimeout(() => {
      hideNotification()
    }, timeout)
  }
}

const hideNotification = () => {
  notification.value.show = false
}

// Check if offline
onMounted(() => {
  // Listen for online/offline events
  window.addEventListener('online', () => {
    isOnline.value = true
    showNotification('Back online', 'success')
  })
  
  window.addEventListener('offline', () => {
    isOnline.value = false
    showNotification('You are offline', 'warning', 0)
  })
  
  // Initial check
  isOnline.value = navigator.onLine
})

// Expose these methods for other components
defineExpose({ showNotification })
</script>

<template>
  <div class="app-container">
    <!-- Only show navigation bar if not on welcome/onboarding pages -->
    <NavigationBar v-if="!isWelcomeOrOnboarding" />
    
    <!-- Main content area -->
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <component :is="Component" @show-notification="showNotification" />
      </RouterView>
    </main>
    
    <!-- Connection status indicator -->
    <ConnectionStatus :is-online="isOnline" />
    
    <!-- Global notification toast -->
    <NotificationToast 
      v-if="notification.show" 
      :message="notification.message" 
      :type="notification.type"
      @close="hideNotification"
      v-voix="'notification-alert'"
      hint="Displays important notifications about the application status"
    />
  </div>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #4f46e5;
  --primary-hover: #4338ca;
  --secondary-color: #0ea5e9;
  --light-bg: #f9fafb;
  --dark-bg: #1f2937;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --text-primary: #111827;
  --text-secondary: #4b5563;
  --text-light: #f3f4f6;
  --border-color: #e5e7eb;
  --border-radius: 8px;
  --transition-speed: 0.3s;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--light-bg);
  color: var(--text-primary);
  line-height: 1.6;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color var(--transition-speed);
}

a:hover {
  color: var(--primary-hover);
}

button {
  cursor: pointer;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  transition: background-color var(--transition-speed), 
              color var(--transition-speed);
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-secondary:hover {
  background-color: rgba(79, 70, 229, 0.1);
}

input, textarea, select {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 0.75rem;
  width: 100%;
  transition: border-color var(--transition-speed);
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.card {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

/* Utilities */
.text-center {
  text-align: center;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-4 {
  gap: 1rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mt-8 {
  margin-top: 2rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

/* Responsive layout */
@media (min-width: 768px) {
  .main-content {
    padding: 2rem;
  }
}
</style>
