<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'updateSettings']);

// Settings state
const settings = ref({
  theme: 'light',
  autoRefresh: false,
  refreshInterval: 30,
  colorMode: 'default',
  showStatusIcons: true,
  compactView: false,
  showAllRoutes: false,
  logRetention: 100
});

// Save settings to localStorage
const saveSettings = () => {
  localStorage.setItem('backdash_settings', JSON.stringify(settings.value));
  emit('updateSettings', settings.value);
};

// Load settings from localStorage
const loadSettings = () => {
  const savedSettings = localStorage.getItem('backdash_settings');
  if (savedSettings) {
    settings.value = JSON.parse(savedSettings);
  }
};

// Reset settings to default
const resetSettings = () => {
  settings.value = {
    theme: 'light',
    autoRefresh: false,
    refreshInterval: 30,
    colorMode: 'default',
    showStatusIcons: true,
    compactView: false,
    showAllRoutes: false,
    logRetention: 100
  };
  saveSettings();
};

// Handle close
const handleClose = () => {
  emit('close');
};

// Initialize
onMounted(() => {
  loadSettings();
});

// Watch for changes and save
watch(settings, () => {
  saveSettings();
}, { deep: true });

// Apply theme
watch(() => settings.value.theme, (newTheme) => {
  const htmlElement = document.documentElement;
  if (newTheme === 'dark') {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }
});
</script>

<template>
  <div v-if="isOpen" class="settings-modal" @click.self="handleClose">
    <div class="settings-panel">
      <!-- Header -->
      <div class="settings-header">
        <h2 v-voix="'settings-panel-title'" class="text-xl font-bold">Dashboard Settings</h2>
        <button v-voix="'close-settings-button'" @click="handleClose" class="close-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Settings content -->
      <div class="settings-content">
        <!-- Theme settings -->
        <div class="settings-section">
          <h3 class="settings-section-title">Appearance</h3>
          
          <div class="setting-item">
            <label for="theme-select" class="setting-label">Theme</label>
            <select 
              v-voix="'theme-select'"
              id="theme-select" 
              v-model="settings.theme" 
              class="setting-input"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          
          <div class="setting-item">
            <label for="color-mode-select" class="setting-label">Color Mode</label>
            <select 
              v-voix="'color-mode-select'"
              id="color-mode-select" 
              v-model="settings.colorMode" 
              class="setting-input"
            >
              <option value="default">Default</option>
              <option value="accessible">High Contrast</option>
              <option value="colorblind">Colorblind Friendly</option>
            </select>
          </div>
          
          <div class="setting-item checkbox">
            <input 
              v-voix="'compact-view-toggle'"
              type="checkbox" 
              id="compact-view" 
              v-model="settings.compactView"
              class="setting-checkbox"
            />
            <label for="compact-view" class="ml-2">Compact View</label>
          </div>
        </div>
        
        <!-- Data settings -->
        <div class="settings-section">
          <h3 class="settings-section-title">Data</h3>
          
          <div class="setting-item checkbox">
            <input 
              v-voix="'auto-refresh-toggle'"
              type="checkbox" 
              id="auto-refresh" 
              v-model="settings.autoRefresh"
              class="setting-checkbox"
            />
            <label for="auto-refresh" class="ml-2">Auto-refresh Data</label>
          </div>
          
          <div class="setting-item" v-if="settings.autoRefresh">
            <label for="refresh-interval" class="setting-label">Refresh Interval (seconds)</label>
            <input 
              v-voix="'refresh-interval-input'"
              type="number" 
              id="refresh-interval" 
              v-model="settings.refreshInterval" 
              min="10" 
              max="300"
              class="setting-input"
            />
          </div>
          
          <div class="setting-item">
            <label for="log-retention" class="setting-label">Log Entries to Show</label>
            <input 
              v-voix="'log-retention-input'"
              type="number" 
              id="log-retention" 
              v-model="settings.logRetention" 
              min="10" 
              max="1000"
              class="setting-input"
            />
          </div>
        </div>
        
        <!-- Display settings -->
        <div class="settings-section">
          <h3 class="settings-section-title">Display</h3>
          
          <div class="setting-item checkbox">
            <input 
              v-voix="'show-status-icons-toggle'"
              type="checkbox" 
              id="show-status-icons" 
              v-model="settings.showStatusIcons"
              class="setting-checkbox"
            />
            <label for="show-status-icons" class="ml-2">Show Status Icons</label>
          </div>
          
          <div class="setting-item checkbox">
            <input 
              v-voix="'show-all-routes-toggle'"
              type="checkbox" 
              id="show-all-routes" 
              v-model="settings.showAllRoutes"
              class="setting-checkbox"
            />
            <label for="show-all-routes" class="ml-2">Show All Routes (including low-traffic)</label>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="settings-footer">
        <button 
          v-voix="'reset-settings-button'"
          @click="resetSettings" 
          class="reset-button"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 40;
}

.settings-panel {
  width: 100%;
  max-width: 24rem;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.settings-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  color: #6b7280;
  transition: color 0.2s;
}

.close-button:hover {
  color: #4b5563;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
}

.settings-section {
  margin-bottom: 2rem;
}

.settings-section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.setting-item {
  margin-bottom: 1rem;
}

.setting-item.checkbox {
  display: flex;
  align-items: center;
}

.setting-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.setting-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}

.setting-checkbox {
  height: 1rem;
  width: 1rem;
  color: #2563eb;
}

.settings-footer {
  padding: 1.25rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.reset-button {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  color: #4b5563;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background-color: #e5e7eb;
}

/* Dark mode styles */
:global(.dark) .settings-panel {
  background-color: #1f2937;
  color: #f9fafb;
}

:global(.dark) .settings-header,
:global(.dark) .settings-footer {
  border-color: #374151;
}

:global(.dark) .settings-section-title {
  border-color: #374151;
}

:global(.dark) .setting-input {
  background-color: #374151;
  color: #f9fafb;
  border-color: #4b5563;
}

:global(.dark) .close-button {
  color: #9ca3af;
}

:global(.dark) .close-button:hover {
  color: #d1d5db;
}

:global(.dark) .reset-button {
  background-color: #374151;
  color: #d1d5db;
}

:global(.dark) .reset-button:hover {
  background-color: #4b5563;
}
</style>