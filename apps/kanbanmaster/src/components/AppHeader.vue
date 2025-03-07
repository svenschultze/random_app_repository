<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import store from '@/store'

const router = useRouter()
const isDarkMode = ref(false)

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-theme', isDarkMode.value)
}

const currentRoute = computed(() => router.currentRoute.value)

function goToProjects() {
  router.push({ name: 'projects' })
}

function regenerateData() {
  store.regenerateData()
  if (currentRoute.value.name !== 'projects') {
    router.push({ name: 'projects' })
  } else {
    // Just refresh the current page
    router.go(0)
  }
}
</script>

<template>
  <header class="app-header">
    <div class="logo" v-voix="'app-logo'">
      <h1>KanbanMaster</h1>
    </div>
    <nav class="navigation">
      <button 
        @click="goToProjects" 
        class="nav-button" 
        v-voix="'navigate-to-projects'"
        hint="Navigate to projects list"
      >
        Projects
      </button>
      <button 
        @click="regenerateData" 
        class="nav-button" 
        v-voix="'regenerate-data'"
        hint="Generate new demo data"
      >
        Regenerate Demo Data
      </button>
      <button 
        @click="toggleDarkMode" 
        class="theme-toggle" 
        v-voix="'toggle-dark-mode'"
        hint="Switch between light and dark mode"
      >
        {{ isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode' }}
      </button>
      <router-link 
        to="/settings" 
        class="nav-button"
        v-voix="'navigate-to-settings'"
        hint="Navigate to settings page"
      >
        Settings
      </router-link>
      <router-link 
        to="/about" 
        class="nav-button"
        v-voix="'navigate-to-about'"
        hint="Navigate to about page"
      >
        About
      </router-link>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--header-bg-color);
  color: var(--header-text-color);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.navigation {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-button, .theme-toggle {
  background: transparent;
  color: var(--header-text-color);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background-color 0.2s, border-color 0.2s;
  text-decoration: none;
  display: inline-block;
}

.nav-button:hover, .theme-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0.5rem;
  }
  
  .navigation {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>