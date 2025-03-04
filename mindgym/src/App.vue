<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import AppNavigation from './components/AppNavigation.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
const showNavigation = ref(false)

onMounted(() => {
  // Only show navigation if user has completed onboarding
  showNavigation.value = userStore.hasCompletedOnboarding
})
</script>

<template>
  <div class="app-container">
    <AppNavigation v-if="showNavigation" />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #f8f9fa;
}

.content {
  flex: 1;
  padding: 1rem;
}

@media (min-width: 1024px) {
  .app-container {
    flex-direction: row;
  }
  
  .content {
    flex: 1;
    padding: 2rem;
  }
}
</style>
