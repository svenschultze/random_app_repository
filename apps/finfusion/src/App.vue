<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-mode', isDarkMode.value)
}
</script>

<template>
  <div class="app-container" :class="{ 'dark-mode': isDarkMode }">
    <aside class="sidebar">
      <div class="logo-container">
        <img alt="FinFusion logo" class="logo" src="@/assets/logo.svg" width="40" height="40" />
        <h1 class="app-title">FinFusion</h1>
      </div>
      
      <nav class="main-nav">
        <RouterLink to="/" v-voix="'Navigate to Dashboard'" class="nav-item">
          <span class="icon">📊</span>
          <span class="label">Dashboard</span>
        </RouterLink>
        <RouterLink to="/accounts" v-voix="'Navigate to Accounts'" class="nav-item">
          <span class="icon">💳</span>
          <span class="label">Accounts</span>
        </RouterLink>
        <RouterLink to="/investments" v-voix="'Navigate to Investments'" class="nav-item">
          <span class="icon">📈</span>
          <span class="label">Investments</span>
        </RouterLink>
        <RouterLink to="/budgeting" v-voix="'Navigate to Budgeting'" class="nav-item">
          <span class="icon">💰</span>
          <span class="label">Budgeting</span>
        </RouterLink>
        <RouterLink to="/notifications" v-voix="'Navigate to Notifications'" class="nav-item">
          <span class="icon">🔔</span>
          <span class="label">Notifications</span>
        </RouterLink>
        <RouterLink to="/settings" v-voix="'Navigate to Settings'" class="nav-item">
          <span class="icon">⚙️</span>
          <span class="label">Settings</span>
        </RouterLink>
      </nav>

      <div class="theme-toggle">
        <button 
          @click="toggleDarkMode" 
          class="theme-button"
          v-voix="'Toggle Light and Dark Theme'"
          :hint="isDarkMode ? 'Currently in dark mode' : 'Currently in light mode'"
        >
          <span v-if="isDarkMode" class="icon">☀️</span>
          <span v-else class="icon">🌙</span>
          <span class="label">{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
        </button>
      </div>
    </aside>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
:root {
  --primary-color: #3498db;
  --primary-color-rgb: 52, 152, 219;
  --secondary-color: #2ecc71;
  --secondary-color-rgb: 46, 204, 113;
  --background-color: #f9f9f9;
  --card-background: #ffffff;
  --text-color: #333333;
  --border-color: #e0e0e0;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --sidebar-width: 220px;
}

.dark-mode {
  --primary-color: #3498db;
  --primary-color-rgb: 52, 152, 219;
  --secondary-color: #2ecc71;
  --secondary-color-rgb: 46, 204, 113;
  --background-color: #1a1a1a;
  --card-background: #2c2c2c;
  --text-color: #f0f0f0;
  --border-color: #444444;
  --shadow-color: rgba(0, 0, 0, 0.3);
}

body {
  margin: 0;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}
</style>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  position: fixed;
  width: var(--sidebar-width);
  height: 100vh;
  background-color: var(--card-background);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-shadow: 2px 0 5px var(--shadow-color);
  z-index: 100;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.app-title {
  margin-left: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.main-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-color);
  transition: background-color 0.2s;
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark-mode .nav-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.nav-item.router-link-active {
  background-color: var(--primary-color);
  color: white;
}

.icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
}

.main-content {
  flex-grow: 1;
  margin-left: var(--sidebar-width);
  padding: 2rem;
  overflow-y: auto;
}

.theme-toggle {
  margin-top: auto;
  padding-top: 1rem;
}

.theme-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  color: var(--text-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.theme-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark-mode .theme-button:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }
  
  .label {
    display: none;
  }
  
  .logo-container {
    justify-content: center;
  }
  
  .app-title {
    display: none;
  }
  
  .main-content {
    margin-left: 60px;
  }
}
</style>
