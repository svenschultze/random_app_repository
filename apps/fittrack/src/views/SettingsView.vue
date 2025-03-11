<script setup>
import { ref, onMounted } from 'vue';
import { getUserSettings, updateUserSettings } from '@/services/dataService';

const settings = ref({
  stepGoal: 8000,
  calorieGoal: 2500,
  activeMinutesGoal: 30
});

const isSaving = ref(false);
const saveMessage = ref('');

const loadSettings = () => {
  settings.value = getUserSettings();
};

const saveSettings = () => {
  isSaving.value = true;
  
  // Validate input
  if (settings.value.stepGoal <= 0 || 
      settings.value.calorieGoal <= 0 || 
      settings.value.activeMinutesGoal <= 0) {
    saveMessage.value = 'All goals must be greater than zero';
    isSaving.value = false;
    return;
  }
  
  // Save settings
  updateUserSettings(settings.value);
  
  // Show success message
  saveMessage.value = 'Settings saved successfully!';
  setTimeout(() => {
    saveMessage.value = '';
  }, 3000);
  
  isSaving.value = false;
};

const resetDefaults = () => {
  if (confirm('Are you sure you want to reset all goals to default values?')) {
    settings.value = {
      stepGoal: 8000,
      calorieGoal: 2500,
      activeMinutesGoal: 30
    };
    saveSettings();
  }
};

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
        
        <div v-if="saveMessage" class="save-message" v-voix="'save-message'">
          {{ saveMessage }}
        </div>
      </form>
      
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
      </div>
      
      <div class="data-section">
        <h2 class="section-title" v-voix="'data-management-heading'">Data Management</h2>
        <p v-voix="'data-storage-info'">
          All data is stored locally in your browser's localStorage. No data is sent to any server.
        </p>
        <button 
          class="btn btn-danger" 
          @click="resetData"
          v-voix="'clear-data-button'"
          hint="Erase all stored fitness data from your browser"
        >
          Clear All Data
        </button>
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

.settings-container {
  max-width: 600px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.3rem;
  margin-bottom: 1.25rem;
  color: var(--text-color);
}

.settings-form {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
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

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
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
  background-color: #f5f5f5;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-reset:hover {
  background-color: #e5e5e5;
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-danger:hover {
  background-color: #d32f2f;
}

.save-message {
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #e8f5e9;
  color: #2e7d32;
  border-radius: 4px;
  text-align: center;
}

.about-section,
.data-section {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.about-section p,
.data-section p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>