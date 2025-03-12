<script setup>
import { ref, onMounted, computed } from 'vue';
import { getUserSettings, updateUserSettings } from '@/services/dataService';
import { THEMES, ACCENT_COLORS, updateTheme } from '@/services/themeService';
import { updatePrivacySettings, exportUserData, importUserData } from '@/services/privacyService';
import { updateNotificationSettings, requestNotificationPermission, notificationPermission, isNotificationsSupported } from '@/services/notificationService';

// Settings tabs
const activeTab = ref('goals');
const tabs = [
  { id: 'goals', label: 'Fitness Goals', icon: '🎯' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'privacy', label: 'Privacy', icon: '🔒' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'units', label: 'Units', icon: '📏' },
  { id: 'workout', label: 'Workout', icon: '🏋️' },
  { id: 'about', label: 'About', icon: 'ℹ️' },
];

// Settings state
const settings = ref({
  // Default values that will be replaced when loaded
  stepGoal: 8000,
  calorieGoal: 2500,
  activeMinutesGoal: 30,
  theme: 'light',
  accentColor: 'green',
  highContrast: false,
  largeText: false,
  storeDataLocally: true,
  dataRetentionDays: 90,
  anonymousUsage: false,
  enableNotifications: true,
  workoutReminders: true,
  goalAchievements: true,
  distanceUnit: 'km',
  weightUnit: 'kg',
  workoutAutoDetect: true,
  countdownTimer: 5,
});

// UI state
const isSaving = ref(false);
const saveMessage = ref('');
const importFile = ref(null);
const importError = ref('');

// Notification permission state
const canRequestNotificationPermission = computed(() => {
  return isNotificationsSupported() && notificationPermission.value !== 'granted';
});

// Tab switching
const setActiveTab = (tabId) => {
  activeTab.value = tabId;
};

// Load settings
const loadSettings = () => {
  settings.value = getUserSettings();
};

// Save settings based on active tab
const saveSettings = () => {
  isSaving.value = true;
  saveMessage.value = '';
  
  try {
    // Different validation and saving based on tab
    if (activeTab.value === 'goals') {
      if (settings.value.stepGoal <= 0 || 
          settings.value.calorieGoal <= 0 || 
          settings.value.activeMinutesGoal <= 0) {
        throw new Error('All goals must be greater than zero');
      }
      updateUserSettings(settings.value);
    } 
    else if (activeTab.value === 'appearance') {
      updateTheme({
        theme: settings.value.theme,
        accentColor: settings.value.accentColor,
        highContrast: settings.value.highContrast,
        largeText: settings.value.largeText
      });
    }
    else if (activeTab.value === 'privacy') {
      updatePrivacySettings({
        storeDataLocally: settings.value.storeDataLocally,
        dataRetentionDays: settings.value.dataRetentionDays,
        anonymousUsage: settings.value.anonymousUsage
      });
    }
    else if (activeTab.value === 'notifications') {
      updateNotificationSettings({
        enableNotifications: settings.value.enableNotifications,
        workoutReminders: settings.value.workoutReminders,
        goalAchievements: settings.value.goalAchievements
      });
    }
    else if (activeTab.value === 'units') {
      updateUserSettings({
        distanceUnit: settings.value.distanceUnit,
        weightUnit: settings.value.weightUnit
      });
    }
    else if (activeTab.value === 'workout') {
      updateUserSettings({
        workoutAutoDetect: settings.value.workoutAutoDetect,
        countdownTimer: settings.value.countdownTimer
      });
    }
    else {
      // For any other tab, just save all settings
      updateUserSettings(settings.value);
    }
    
    // Show success message
    saveMessage.value = 'Settings saved successfully!';
    setTimeout(() => {
      saveMessage.value = '';
    }, 3000);
  } catch (error) {
    saveMessage.value = error.message || 'Error saving settings';
  }
  
  isSaving.value = false;
};

// Reset defaults
const resetDefaults = () => {
  if (confirm('Are you sure you want to reset all goals to default values?')) {
    settings.value = {
      stepGoal: 8000,
      calorieGoal: 2500,
      activeMinutesGoal: 30,
      theme: 'light',
      accentColor: 'green',
      highContrast: false,
      largeText: false,
      storeDataLocally: true,
      dataRetentionDays: 90,
      anonymousUsage: false,
      enableNotifications: true,
      workoutReminders: true,
      goalAchievements: true,
      distanceUnit: 'km',
      weightUnit: 'kg',
      workoutAutoDetect: true,
      countdownTimer: 5,
    };
    saveSettings();
  }
};

// Export data
const handleExportData = () => {
  const exportData = exportUserData();
  
  // Create a link and trigger download
  const a = document.createElement('a');
  a.href = exportData.dataUri;
  a.download = exportData.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Import data
const handleImportClick = () => {
  document.getElementById('import-file').click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const result = importUserData(e.target.result);
      
      if (result.success) {
        alert('Data imported successfully! The page will now reload.');
        window.location.reload();
      } else {
        importError.value = result.error || 'Unknown error importing data';
      }
    } catch (error) {
      importError.value = error.message || 'Error reading file';
    }
  };
  
  reader.readAsText(file);
};

// Request notification permission
const handleRequestNotificationPermission = async () => {
  const result = await requestNotificationPermission();
  if (result.granted) {
    settings.value.enableNotifications = true;
  }
};

// Initialize
onMounted(() => {
  loadSettings();
});
</script>

<template>
  <div class="settings-view">
    <div class="header-actions">
      <h1 v-voix="'settings-heading'">Settings</h1>
    </div>
    
    <div class="settings-container">
      <!-- Settings tabs -->
      <div class="settings-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-button" 
          :class="{ active: activeTab === tab.id }"
          @click="setActiveTab(tab.id)"
          v-voix="`${tab.id}-tab-button`"
          :hint="`Switch to ${tab.label} settings`"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>
      
      <!-- Fitness goals tab -->
      <div v-if="activeTab === 'goals'" class="settings-panel">
        <h2 class="section-title" v-voix="'fitness-goals-heading'">Fitness Goals</h2>
        
        <form @submit.prevent="saveSettings" class="settings-form">
          <div class="form-group">
            <label for="stepGoal" v-voix="'step-goal-label'">Daily Step Goal</label>
            <input 
              id="stepGoal" 
              type="number" 
              v-model.number="settings.stepGoal" 
              min="1" 
              class="form-control"
              v-voix="'step-goal-input'"
              hint="Enter your daily step goal"
            >
          </div>
          
          <div class="form-group">
            <label for="calorieGoal" v-voix="'calorie-goal-label'">Daily Calorie Goal</label>
            <input 
              id="calorieGoal" 
              type="number" 
              v-model.number="settings.calorieGoal" 
              min="1" 
              class="form-control"
              v-voix="'calorie-goal-input'"
              hint="Enter your daily calorie burn goal"
            >
          </div>
          
          <div class="form-group">
            <label for="activeMinutesGoal" v-voix="'active-minutes-goal-label'">Daily Active Minutes Goal</label>
            <input 
              id="activeMinutesGoal" 
              type="number" 
              v-model.number="settings.activeMinutesGoal" 
              min="1" 
              class="form-control"
              v-voix="'active-minutes-goal-input'"
              hint="Enter your daily active minutes goal"
            >
          </div>
          
          <div class="form-actions">
            <button 
              type="button" 
              class="btn btn-reset" 
              @click="resetDefaults"
              v-voix="'reset-defaults-button'"
              hint="Reset all goals to their default values"
            >
              Reset to Defaults
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="isSaving"
              v-voix="'save-settings-button'"
              hint="Save your goal settings"
            >
              {{ isSaving ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </form>
      </div>
      
      <!-- Appearance tab -->
      <div v-if="activeTab === 'appearance'" class="settings-panel">
        <h2 class="section-title" v-voix="'appearance-heading'">Appearance Settings</h2>
        
        <form @submit.prevent="saveSettings" class="settings-form">
          <div class="form-group">
            <label for="theme" v-voix="'theme-label'">App Theme</label>
            <select 
              id="theme" 
              v-model="settings.theme" 
              class="form-control"
              v-voix="'theme-select'"
              hint="Select app theme"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="accentColor" v-voix="'accent-color-label'">Accent Color</label>
            <div class="color-picker">
              <label 
                v-for="(_, color) in ACCENT_COLORS" 
                :key="color"
                class="color-option"
                :class="{ selected: settings.accentColor === color }"
              >
                <input 
                  type="radio" 
                  name="accentColor" 
                  :value="color" 
                  v-model="settings.accentColor"
                  v-voix="`accent-color-${color}`"
                  :hint="`Select ${color} as accent color`"
                >
                <span 
                  class="color-swatch" 
                  :style="{ 
                    backgroundColor: ACCENT_COLORS[color]['--primary-color'] 
                  }"
                ></span>
                <span class="color-name">{{ color.charAt(0).toUpperCase() + color.slice(1) }}</span>
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="settings.highContrast"
                v-voix="'high-contrast-checkbox'"
                hint="Enable high contrast mode for better visibility"
              >
              <span>High Contrast Mode</span>
            </label>
            <p class="form-help-text">Makes text and controls more visible and improves readability.</p>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="settings.largeText"
                v-voix="'large-text-checkbox'"
                hint="Enable larger text throughout the app"
              >
              <span>Larger Text Size</span>
            </label>
            <p class="form-help-text">Increases text size throughout the app for better readability.</p>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary full-width" 
              :disabled="isSaving"
              v-voix="'save-appearance-button'"
              hint="Save your appearance settings"
            >
              {{ isSaving ? 'Saving...' : 'Save Appearance Settings' }}
            </button>
          </div>
        </form>
      </div>
      
      <!-- Privacy tab -->
      <div v-if="activeTab === 'privacy'" class="settings-panel">
        <h2 class="section-title" v-voix="'privacy-heading'">Privacy Settings</h2>
        
        <form @submit.prevent="saveSettings" class="settings-form">
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="settings.storeDataLocally"
                v-voix="'local-storage-checkbox'"
                hint="Enable storing fitness data locally in your browser"
              >
              <span>Store Data Locally</span>
            </label>
            <p class="form-help-text">FitTrack stores your workout and activity data in your browser's local storage.</p>
          </div>
          
          <div class="form-group">
            <label for="dataRetentionDays" v-voix="'data-retention-label'">Data Retention Period (days)</label>
            <input 
              id="dataRetentionDays" 
              type="number" 
              v-model.number="settings.dataRetentionDays" 
              min="7" 
              max="365" 
              class="form-control"
              v-voix="'data-retention-input'"
              hint="Select how many days to keep your fitness data"
            >
            <p class="form-help-text">Older data will be automatically deleted after this period.</p>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="settings.anonymousUsage"
                v-voix="'anonymous-usage-checkbox'"
                hint="Allow anonymous usage statistics"
              >
              <span>Allow Anonymous Usage Statistics</span>
            </label>
            <p class="form-help-text">
              Help improve FitTrack by sharing anonymous usage data. No personal information is collected.
              <strong>Note: This is just a demo, no data is actually collected.</strong>
            </p>
          </div>
          
          <div class="data-management-actions">
            <h3 v-voix="'data-management-heading'">Data Management</h3>
            
            <div class="button-group">
              <button 
                type="button" 
                class="btn btn-secondary" 
                @click="handleExportData"
                v-voix="'export-data-button'"
                hint="Export your fitness data as a JSON file"
              >
                Export My Data
              </button>
              
              <button 
                type="button" 
                class="btn btn-secondary" 
                @click="handleImportClick"
                v-voix="'import-data-button'"
                hint="Import fitness data from a JSON file"
              >
                Import Data
              </button>
              
              <input 
                type="file" 
                id="import-file" 
                accept=".json" 
                style="display: none" 
                @change="handleFileChange"
              >
            </div>
            
            <div v-if="importError" class="error-message">
              {{ importError }}
            </div>
            
            <button 
              type="button" 
              class="btn btn-danger full-width" 
              @click="resetData"
              v-voix="'clear-data-button'"
              hint="Erase all stored fitness data from your browser"
            >
              Clear All Data
            </button>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary full-width" 
              :disabled="isSaving"
              v-voix="'save-privacy-button'"
              hint="Save your privacy settings"
            >
              {{ isSaving ? 'Saving...' : 'Save Privacy Settings' }}
            </button>
          </div>
        </form>
      </div>
      
      <!-- Notifications tab -->
      <div v-if="activeTab === 'notifications'" class="settings-panel">
        <h2 class="section-title" v-voix="'notifications-heading'">Notification Preferences</h2>
        
        <form @submit.prevent="saveSettings" class="settings-form">
          <div class="form-group">
            <div class="notification-permission-status">
              <strong>Status:</strong> 
              <span :class="`permission-${notificationPermission}`">
                {{ notificationPermission === 'granted' ? 'Notifications Allowed' : 
                   notificationPermission === 'denied' ? 'Notifications Blocked' : 
                   'Permission Not Requested' }}
              </span>
              
              <button 
                v-if="canRequestNotificationPermission"
                type="button" 
                class="btn btn-secondary" 
                @click="handleRequestNotificationPermission"
                v-voix="'request-permission-button'"
                hint="Request permission to show notifications"
              >
                Request Permission
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="settings.enableNotifications"
                :disabled="notificationPermission === 'denied'"
                v-voix="'enable-notifications-checkbox'"
                hint="Enable or disable all notifications"
              >
              <span>Enable Notifications</span>
            </label>
            <p class="form-help-text">Receive notifications from FitTrack about your fitness activity.</p>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="settings.workoutReminders"
                :disabled="!settings.enableNotifications || notificationPermission === 'denied'"
                v-voix="'workout-reminders-checkbox'"
                hint="Enable notifications for workout reminders"
              >
              <span>Workout Reminders</span>
            </label>
            <p class="form-help-text">Get notified when it's time for your scheduled workouts.</p>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="settings.goalAchievements"
                :disabled="!settings.enableNotifications || notificationPermission === 'denied'"
                v-voix="'goal-achievements-checkbox'"
                hint="Enable notifications when you achieve fitness goals"
              >
              <span>Goal Achievements</span>
            </label>
            <p class="form-help-text">Receive notifications when you reach your fitness goals.</p>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary full-width" 
              :disabled="isSaving"
              v-voix="'save-notifications-button'"
              hint="Save your notification settings"
            >
              {{ isSaving ? 'Saving...' : 'Save Notification Settings' }}
            </button>
          </div>
        </form>
      </div>
      
      <!-- Units tab -->
      <div v-if="activeTab === 'units'" class="settings-panel">
        <h2 class="section-title" v-voix="'units-heading'">Unit Preferences</h2>
        
        <form @submit.prevent="saveSettings" class="settings-form">
          <div class="form-group">
            <label for="distanceUnit" v-voix="'distance-unit-label'">Distance Unit</label>
            <select 
              id="distanceUnit" 
              v-model="settings.distanceUnit" 
              class="form-control"
              v-voix="'distance-unit-select'"
              hint="Select your preferred unit for distance measurements"
            >
              <option value="km">Kilometers (km)</option>
              <option value="mi">Miles (mi)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="weightUnit" v-voix="'weight-unit-label'">Weight Unit</label>
            <select 
              id="weightUnit" 
              v-model="settings.weightUnit" 
              class="form-control"
              v-voix="'weight-unit-select'"
              hint="Select your preferred unit for weight measurements"
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="lb">Pounds (lb)</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary full-width" 
              :disabled="isSaving"
              v-voix="'save-units-button'"
              hint="Save your unit preferences"
            >
              {{ isSaving ? 'Saving...' : 'Save Unit Preferences' }}
            </button>
          </div>
        </form>
      </div>
      
      <!-- Workout settings tab -->
      <div v-if="activeTab === 'workout'" class="settings-panel">
        <h2 class="section-title" v-voix="'workout-settings-heading'">Workout Settings</h2>
        
        <form @submit.prevent="saveSettings" class="settings-form">
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="settings.workoutAutoDetect"
                v-voix="'auto-detect-checkbox'"
                hint="Enable automatic workout detection"
              >
              <span>Auto-detect Workouts</span>
            </label>
            <p class="form-help-text">
              Automatically detect and log common workout activities.
              <strong>Note: This is just a demo feature.</strong>
            </p>
          </div>
          
          <div class="form-group">
            <label for="countdownTimer" v-voix="'countdown-label'">Countdown Timer (seconds)</label>
            <input 
              id="countdownTimer" 
              type="number" 
              v-model.number="settings.countdownTimer" 
              min="0" 
              max="10" 
              class="form-control"
              v-voix="'countdown-input'"
              hint="Set the countdown time before starting workouts"
            >
            <p class="form-help-text">Set the countdown time before workout intervals begin.</p>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary full-width" 
              :disabled="isSaving"
              v-voix="'save-workout-settings-button'"
              hint="Save your workout settings"
            >
              {{ isSaving ? 'Saving...' : 'Save Workout Settings' }}
            </button>
          </div>
        </form>
      </div>
      
      <!-- About tab -->
      <div v-if="activeTab === 'about'" class="settings-panel">
        <div class="about-section">
          <h2 class="section-title" v-voix="'about-app-heading'">About FitTrack Demo</h2>
          <p v-voix="'about-app-description'">
            FitTrack Demo is a front-end demonstration application for fitness tracking. All data is stored locally in your browser and is not sent to any server. This app is for demonstration purposes only.
          </p>
          <p v-voix="'app-features'">
            Features include tracking steps, calories, active minutes, and workouts. You can log workouts, view your progress over time, and set personal fitness goals.
          </p>
          <p v-voix="'disclaimer'">
            <strong>Disclaimer:</strong> This app generates random fitness data for demonstration. It is not meant to be used as a real fitness tracker.
          </p>
          
          <div class="app-version">
            <p v-voix="'app-version'">Version: 1.2.0</p>
            <p v-voix="'build-date'">Build Date: March 11, 2025</p>
          </div>
        </div>
      </div>
      
      <!-- Save confirmation message -->
      <div v-if="saveMessage" class="save-message" v-voix="'save-message'">
        {{ saveMessage }}
      </div>
    </div>
  </div>
</template>

<script>
// Outside the setup function to access localStorage directly
function resetData() {
  if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
    localStorage.removeItem('fittrack_dailyLogs');
    localStorage.removeItem('fittrack_workouts');
    localStorage.removeItem('fittrack_userSettings');
    alert('All data has been cleared. Refresh the page to generate new demo data.');
  }
}
</script>

<style scoped>
.settings-view {
  max-width: 100%;
}

.header-actions {
  margin-bottom: 2rem;
}

h1 {
  font-size: 1.8rem;
  color: var(--text-color);
  margin: 0;
}

h2 {
  font-size: 1.3rem;
  margin-bottom: 1.25rem;
  color: var(--text-color);
}

h3 {
  font-size: 1.1rem;
  margin: 1.5rem 0 1rem;
  color: var(--text-color);
}

.settings-container {
  max-width: 800px;
  margin: 0 auto;
}

.settings-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background-color: var(--card-color);
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-color);
  font-weight: 500;
  min-width: 80px;
  transition: all 0.2s;
}

.tab-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.tab-button.active {
  background-color: var(--primary-light);
  color: var(--primary-dark);
}

.tab-icon {
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}

.tab-label {
  font-size: 0.8rem;
  text-align: center;
}

.settings-panel {
  background-color: var(--card-color);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.3rem;
  margin-bottom: 1.25rem;
  color: var(--text-color);
}

.settings-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 0.5rem;
}

.form-help-text {
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: var(--text-light);
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  background-color: var(--card-color);
  color: var(--text-color);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.9rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-reset {
  background-color: var(--background-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-reset:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.btn-secondary {
  background-color: var(--background-color);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.btn-secondary:hover {
  background-color: rgba(76, 175, 80, 0.1);
}

.btn-danger {
  background-color: #f44336;
  color: white;
  margin-top: 1rem;
}

.btn-danger:hover {
  background-color: #d32f2f;
}

.full-width {
  width: 100%;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.color-option input {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
}

.color-swatch {
  height: 36px;
  width: 36px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.color-option.selected .color-swatch {
  border-color: var(--text-color);
  transform: scale(1.1);
}

.color-name {
  font-size: 0.8rem;
  color: var(--text-color);
}

.notification-permission-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background-color: var(--background-color);
}

.permission-granted {
  color: #4CAF50;
  font-weight: 500;
}

.permission-denied {
  color: #f44336;
  font-weight: 500;
}

.permission-default {
  color: #FF9800;
  font-weight: 500;
}

.data-management-actions {
  background-color: var(--background-color);
  padding: 1.25rem;
  border-radius: 6px;
  margin: 1.5rem 0;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.error-message {
  color: #f44336;
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: 4px;
}

.save-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--primary-color);
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
}

.about-section,
.data-section {
  line-height: 1.6;
}

.about-section p,
.data-section p {
  margin-bottom: 1rem;
}

.app-version {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-light);
}

.app-version p {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .settings-tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 0.5rem;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
  }
  
  .tab-button {
    flex: 0 0 auto;
    min-width: 80px;
    scroll-snap-align: start;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .color-picker {
    justify-content: space-between;
  }
  
  .notification-permission-status {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>