<script setup>
import { ref } from 'vue'

// Mock settings - in a real app, these would be saved to localStorage
const temperatureUnit = ref('fahrenheit')
const notificationsEnabled = ref(false)
const saveRecentSearches = ref(true)
const theme = ref('light')

// Save settings to mock localStorage 
const saveSettings = () => {
  const savedSettings = {
    temperatureUnit: temperatureUnit.value,
    notificationsEnabled: notificationsEnabled.value,
    saveRecentSearches: saveRecentSearches.value,
    theme: theme.value
  }
  
  // In a real app, we would save to localStorage
  // localStorage.setItem('instaweather_settings', JSON.stringify(savedSettings))
  
  // Show success message (mock)
  alert('Settings saved successfully!')
}

// Toggle notifications
const toggleNotifications = () => {
  if (!notificationsEnabled.value) {
    // Request permission for notifications
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          notificationsEnabled.value = true
        }
      })
    }
  } else {
    notificationsEnabled.value = false
  }
}

// Reset location data
const clearRecentSearches = () => {
  // In a real app, we would clear from localStorage
  // localStorage.removeItem('instaweather_recent_searches')
  
  alert('Recent searches cleared!')
}
</script>

<template>
  <div class="settings-container">
    <h1 class="settings-title" v-voix="'settings page'">Settings</h1>
    
    <!-- Temperature Units -->
    <div class="settings-section" v-voix="'temperature units'">
      <h2 class="section-title">Temperature Units</h2>
      
      <div class="option-group">
        <label class="radio-option">
          <input 
            type="radio" 
            value="fahrenheit" 
            v-model="temperatureUnit"
            v-voix="'fahrenheit option'"
          />
          <span class="option-label">Fahrenheit (°F)</span>
        </label>
        
        <label class="radio-option">
          <input 
            type="radio" 
            value="celsius" 
            v-model="temperatureUnit"
            v-voix="'celsius option'"
          />
          <span class="option-label">Celsius (°C)</span>
        </label>
      </div>
    </div>
    
    <!-- Theme -->
    <div class="settings-section" v-voix="'theme settings'">
      <h2 class="section-title">Theme</h2>
      
      <div class="option-group">
        <label class="radio-option">
          <input 
            type="radio" 
            value="light" 
            v-model="theme"
            v-voix="'light theme option'"
          />
          <span class="option-label">Light</span>
        </label>
        
        <label class="radio-option">
          <input 
            type="radio" 
            value="dark" 
            v-model="theme"
            v-voix="'dark theme option'"
          />
          <span class="option-label">Dark</span>
        </label>
        
        <label class="radio-option">
          <input 
            type="radio" 
            value="system" 
            v-model="theme"
            v-voix="'system theme option'"
          />
          <span class="option-label">System Default</span>
        </label>
      </div>
    </div>
    
    <!-- Notifications -->
    <div class="settings-section" v-voix="'notification settings'">
      <h2 class="section-title">Notifications</h2>
      
      <div class="toggle-option">
        <span class="toggle-label">Weather Alerts</span>
        <label class="toggle-switch">
          <input 
            type="checkbox" 
            v-model="notificationsEnabled"
            @change="toggleNotifications"
            v-voix="'toggle weather alerts'"
          />
          <span class="toggle-slider"></span>
        </label>
      </div>
      
      <p class="setting-description">
        Receive notifications for severe weather alerts in your area.
      </p>
    </div>
    
    <!-- Privacy & Data -->
    <div class="settings-section" v-voix="'privacy settings'">
      <h2 class="section-title">Privacy & Data</h2>
      
      <div class="toggle-option">
        <span class="toggle-label">Save Recent Searches</span>
        <label class="toggle-switch">
          <input 
            type="checkbox" 
            v-model="saveRecentSearches"
            v-voix="'toggle save recent searches'"
          />
          <span class="toggle-slider"></span>
        </label>
      </div>
      
      <p class="setting-description">
        Store recent location searches on this device.
      </p>
      
      <button 
        class="clear-data-button" 
        @click="clearRecentSearches"
        v-voix="'clear recent searches button'"
      >
        Clear Recent Searches
      </button>
    </div>
    
    <!-- Save Button -->
    <div class="save-button-container">
      <button 
        class="save-button" 
        @click="saveSettings"
        v-voix="'save settings button'"
      >
        Save Settings
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.settings-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.settings-section {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.radio-option, .toggle-option {
  display: flex;
  align-items: center;
}

.option-label, .toggle-label {
  margin-left: 0.5rem;
  font-size: 1rem;
}

.toggle-option {
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.setting-description {
  font-size: 0.9rem;
  color: var(--light-text);
  margin-bottom: 1rem;
}

.clear-data-button {
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clear-data-button:hover {
  background-color: #c43f32;
}

.save-button-container {
  text-align: center;
  margin-top: 2rem;
}

.save-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-button:hover {
  background-color: #3a7ecc;
}

@media (min-width: 768px) {
  .settings-container {
    padding: 2rem;
  }
  
  .settings-title {
    font-size: 1.8rem;
  }
  
  .option-group {
    margin-left: 1rem;
  }
}
</style>