<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import store from '@/store'

// Theme settings
const isDarkMode = ref(document.body.classList.contains('dark-theme'))

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-theme', isDarkMode.value)
}

// Data management
function regenerateData() {
  if (confirm('Are you sure you want to regenerate all demo data? This will delete all current projects and tasks.')) {
    store.regenerateData()
  }
}

function clearLocalStorage() {
  if (confirm('Are you sure you want to clear all local storage data? This will delete all projects and tasks.')) {
    localStorage.clear()
    store.regenerateData() // Regenerate after clearing to provide demo data
  }
}
</script>

<template>
  <div class="settings-view">
    <AppHeader />
    
    <main class="main-content">
      <div class="settings-container">
        <h2 class="settings-title">Settings</h2>
        
        <div class="settings-section">
          <h3>Appearance</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">Dark Mode</div>
              <div class="setting-description">Toggle between light and dark theme</div>
            </div>
            
            <div class="setting-control">
              <button 
                @click="toggleDarkMode" 
                class="toggle-button" 
                :class="{ 'active': isDarkMode }"
                v-voix="'toggle-dark-mode-setting'"
                hint="Toggle between light and dark mode"
              >
                <span class="toggle-label">{{ isDarkMode ? 'On' : 'Off' }}</span>
                <span class="toggle-switch"></span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="settings-section">
          <h3>Data Management</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">Regenerate Demo Data</div>
              <div class="setting-description">Create new random projects and tasks, replacing all current data</div>
            </div>
            
            <div class="setting-control">
              <button 
                @click="regenerateData" 
                class="action-button"
                v-voix="'regenerate-demo-data'"
                hint="Replace all data with newly generated demo content"
              >
                Regenerate
              </button>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-name">Clear Local Storage</div>
              <div class="setting-description">Remove all stored data from your browser</div>
            </div>
            
            <div class="setting-control">
              <button 
                @click="clearLocalStorage" 
                class="action-button danger"
                v-voix="'clear-local-storage'"
                hint="Delete all application data from local storage"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
        
        <div class="settings-section">
          <h3>About KanbanMaster</h3>
          
          <div class="setting-info about-info">
            <p>KanbanMaster is a demonstration application for managing projects with Kanban boards.</p>
            <p>Version: 1.0.0</p>
            <p>Features:</p>
            <ul>
              <li>Multiple project management</li>
              <li>Drag-and-drop task organization</li>
              <li>Task filtering and search</li>
              <li>Customizable columns</li>
              <li>Dark mode support</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.settings-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.settings-container {
  max-width: 800px;
  margin: 0 auto;
}

.settings-title {
  margin: 0 0 2rem 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-color);
}

.settings-section {
  margin-bottom: 2.5rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.settings-section h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-info {
  flex: 1;
}

.setting-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--text-color);
}

.setting-description {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.8;
}

.setting-control {
  margin-left: 1rem;
}

/* Toggle Button Styles */
.toggle-button {
  display: flex;
  align-items: center;
  background-color: var(--light-bg-color);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  position: relative;
  min-width: 90px;
  justify-content: space-between;
}

.toggle-label {
  font-size: 0.8rem;
  font-weight: 500;
  margin-right: 2rem;
}

.toggle-switch {
  position: absolute;
  right: 4px;
  top: 4px;
  width: 1.25rem;
  height: 1.25rem;
  background-color: var(--border-color);
  border-radius: 50%;
  transition: all 0.3s;
}

.toggle-button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.toggle-button.active .toggle-switch {
  background-color: white;
  right: calc(100% - 28px);
}

/* Action Button Styles */
.action-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
}

.action-button.danger {
  background-color: var(--error-color);
}

.action-button:hover {
  opacity: 0.9;
}

.about-info {
  font-size: 0.95rem;
  line-height: 1.6;
}

.about-info p {
  margin-bottom: 1rem;
}

.about-info ul {
  padding-left: 1.5rem;
}

.about-info li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .setting-control {
    margin-left: 0;
    margin-top: 1rem;
    align-self: flex-start;
  }
}
</style>