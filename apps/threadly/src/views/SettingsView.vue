<script setup>
import { useRouter } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import store from '../store';

const router = useRouter();

function goBack() {
  router.go(-1);
}

function toggleTheme() {
  store.toggleTheme();
}
</script>

<template>
  <AppLayout>
    <div class="settings-view">
      <div class="settings-view__header">
        <button 
          class="settings-view__back-btn" 
          @click="goBack"
          v-voix="'Go back'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 v-voix="'Settings'">Settings</h1>
      </div>
      
      <div class="settings-view__content">
        <div class="settings-view__section">
          <h2 class="settings-view__section-title">Display</h2>
          
          <div class="settings-view__setting-item">
            <div class="settings-view__setting-info">
              <h3 class="settings-view__setting-name">Theme</h3>
              <p class="settings-view__setting-description">Toggle between light and dark theme</p>
            </div>
            
            <div class="settings-view__setting-control">
              <button 
                class="settings-view__theme-toggle" 
                @click="toggleTheme"
                v-voix="'Toggle theme. Current theme: ' + (store.state.theme === 'light' ? 'light' : 'dark')"
              >
                <div class="settings-view__theme-toggle-track">
                  <div :class="['settings-view__theme-toggle-thumb', { 'settings-view__theme-toggle-thumb--active': store.state.theme === 'dark' }]"></div>
                </div>
                <span>{{ store.state.theme === 'light' ? 'Light' : 'Dark' }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="settings-view__section">
          <h2 class="settings-view__section-title">Demo Information</h2>
          
          <div class="settings-view__info-box">
            <p>
              <strong>Threadly</strong> is a demo application that simulates a text-based social media platform. 
              All data is randomly generated on each refresh, and no real data is stored or transmitted.
            </p>
            <p>
              This demo showcases the UI and interactions of a social media platform. To generate a new set of
              random data, click the "Refresh Data" button in the sidebar.
            </p>
            <p class="settings-view__demo-credits">
              Created with Vue.js and Faker.js
            </p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.settings-view {
  width: 100%;
}

.settings-view__header {
  position: sticky;
  top: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  z-index: 10;
  display: flex;
  align-items: center;
}

.settings-view__back-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  color: var(--color-text);
  transition: background-color 0.2s;
}

.settings-view__back-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.settings-view__header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.settings-view__content {
  padding: 1rem;
}

.settings-view__section {
  margin-bottom: 2rem;
}

.settings-view__section-title {
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.settings-view__setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border-soft);
}

.settings-view__setting-info {
  flex: 1;
}

.settings-view__setting-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.settings-view__setting-description {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin: 0;
}

.settings-view__theme-toggle {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--color-text);
}

.settings-view__theme-toggle-track {
  width: 48px;
  height: 24px;
  background-color: var(--color-border);
  border-radius: 24px;
  margin-right: 0.75rem;
  position: relative;
  transition: background-color 0.2s;
}

.settings-view__theme-toggle-thumb {
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}

.settings-view__theme-toggle-thumb--active {
  transform: translateX(24px);
}

.settings-view__info-box {
  background-color: var(--color-background-soft);
  border-radius: 0.75rem;
  padding: 1rem;
}

.settings-view__demo-credits {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 0;
}

/* For dark mode */
:root[data-theme="dark"] .settings-view__header {
  background-color: rgba(21, 32, 43, 0.9);
}

:root[data-theme="dark"] .settings-view__back-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

:root[data-theme="dark"] .settings-view__theme-toggle-track {
  background-color: #1da1f2;
}

:root[data-theme="dark"] .settings-view__theme-toggle-thumb {
  background-color: white;
}
</style>