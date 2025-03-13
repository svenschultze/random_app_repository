<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NotificationBanner from '@/components/NotificationBanner.vue';
import { useEmailStore } from '@/stores/emailStore';
import { 
  clearStorage, 
  STORAGE_KEYS, 
  markAppAsInitialized 
} from '@/utils/storageUtils';

const router = useRouter();
const emailStore = useEmailStore();

// Settings state
const darkMode = ref(false);
const notificationsEnabled = ref(true);
const emailSignature = ref('Sent from PulseMail');
const syncFrequency = ref('15');
const autoRefresh = ref(true);
const showResetConfirm = ref(false);

// Notification state
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref('success');

// Check if dark mode is enabled
onMounted(() => {
  // Check if dark mode preference is stored
  try {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) {
      darkMode.value = storedDarkMode === 'true';
      // Ensure the class is applied
      if (darkMode.value) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    } else {
      // Check if dark mode is already enabled on the body element
      darkMode.value = document.body.classList.contains('dark-theme');
    }
  } catch (e) {
    console.error('Could not retrieve dark mode preference:', e);
    // Fallback to checking the body class
    darkMode.value = document.body.classList.contains('dark-theme');
  }
});

// Toggle dark mode
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  
  // Apply theme changes
  if (darkMode.value) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  
  // Save to localStorage
  try {
    localStorage.setItem('darkMode', darkMode.value ? 'true' : 'false');
  } catch (e) {
    console.error('Could not save dark mode preference:', e);
  }
};

// Show notification
const showNotificationMessage = (message, type = 'success') => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
};

// Close notification
const closeNotification = () => {
  showNotification.value = false;
};

// Save settings
const saveSettings = () => {
  // In a real app, this would save to localStorage or an API
  try {
    // Simulate saving
    setTimeout(() => {
      showNotificationMessage('Settings saved successfully!');
    }, 500);
  } catch (error) {
    showNotificationMessage('Failed to save settings. Please try again.', 'error');
  }
};

// Reset application data
const confirmReset = () => {
  showResetConfirm.value = true;
};

const cancelReset = () => {
  showResetConfirm.value = false;
};

const resetData = () => {
  try {
    // Reset data in the store
    emailStore.resetData();
    
    // Reset app initialized status
    markAppAsInitialized();
    
    // Close confirmation dialog
    showResetConfirm.value = false;
    
    // Show notification
    showNotificationMessage('All data has been reset successfully!');
    
    // Navigate to inbox
    setTimeout(() => {
      router.push({ name: 'inbox' });
    }, 1500);
  } catch (error) {
    showNotificationMessage('Failed to reset data. Please try again.', 'error');
    showResetConfirm.value = false;
  }
};
</script>

<template>
  <div 
    class="settings-view"
    v-voix:role="'region'"
    v-voix:label="'Settings'"
  >
    <!-- Notification Banner -->
    <NotificationBanner
      :message="notificationMessage"
      :type="notificationType"
      :show="showNotification"
      @close="closeNotification"
    />
    <div class="settings-header">
      <h1 class="settings-title" v-voix:role="'heading'" v-voix:level="1">Settings</h1>
    </div>
    
    <div class="settings-content">
      <div class="settings-section">
        <h2 class="section-title" v-voix:role="'heading'" v-voix:level="2">Appearance</h2>
        
        <div class="setting-item">
          <div class="setting-label">
            <span v-voix:role="'text'">Dark Mode</span>
          </div>
          <div class="setting-control">
            <label class="toggle-switch" v-voix:role="'switch'" v-voix:checked="darkMode">
              <input 
                type="checkbox" 
                v-model="darkMode" 
                @change="toggleDarkMode"
                v-voix:role="'checkbox'"
                v-voix:label="'Enable dark mode'"
              >
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <h2 class="section-title" v-voix:role="'heading'" v-voix:level="2">Notifications</h2>
        
        <div class="setting-item">
          <div class="setting-label">
            <span v-voix:role="'text'">Enable Notifications</span>
          </div>
          <div class="setting-control">
            <label class="toggle-switch" v-voix:role="'switch'" v-voix:checked="notificationsEnabled">
              <input 
                type="checkbox" 
                v-model="notificationsEnabled"
                v-voix:role="'checkbox'"
                v-voix:label="'Enable notifications'"
              >
              <span class="slider"></span>
            </label>
          </div>
        </div>
        
        <div class="setting-item">
          <div class="setting-label">
            <span v-voix:role="'text'">Auto Refresh</span>
          </div>
          <div class="setting-control">
            <label class="toggle-switch" v-voix:role="'switch'" v-voix:checked="autoRefresh">
              <input 
                type="checkbox" 
                v-model="autoRefresh"
                v-voix:role="'checkbox'"
                v-voix:label="'Enable auto refresh'"
              >
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <h2 class="section-title" v-voix:role="'heading'" v-voix:level="2">Account</h2>
        
        <div class="setting-item">
          <div class="setting-label">
            <span v-voix:role="'text'">Email Signature</span>
          </div>
          <div class="setting-control signature-control">
            <textarea 
              v-model="emailSignature" 
              class="signature-input"
              v-voix:role="'textbox'"
              v-voix:label="'Email signature'"
              v-voix:multiline="true"
            ></textarea>
          </div>
        </div>
        
        <div class="setting-item">
          <div class="setting-label">
            <span v-voix:role="'text'">Sync Frequency (minutes)</span>
          </div>
          <div class="setting-control">
            <select 
              v-model="syncFrequency" 
              class="select-input"
              v-voix:role="'combobox'"
              v-voix:label="'Sync frequency'"
            >
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="settings-section danger-section">
        <h2 class="section-title" v-voix:role="'heading'" v-voix:level="2">Data Management</h2>
        
        <div class="setting-item">
          <div class="setting-label">
            <span v-voix:role="'text'">Reset Application Data</span>
            <div class="setting-description">
              This will reset all emails and return to initial state. Cannot be undone.
            </div>
          </div>
          <div class="setting-control">
            <button 
              @click="confirmReset" 
              class="danger-button"
              v-voix:role="'button'"
              v-voix:label="'Reset application data'"
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>
      
      <!-- Reset confirmation modal -->
      <div class="modal-overlay" v-if="showResetConfirm">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Confirm Reset</h3>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to reset all application data? This will:</p>
            <ul>
              <li>Delete all emails you've sent</li>
              <li>Reset the inbox to default emails</li>
              <li>Remove all customizations</li>
            </ul>
            <p>This action cannot be undone!</p>
          </div>
          <div class="modal-footer">
            <button 
              @click="cancelReset" 
              class="cancel-button"
            >
              Cancel
            </button>
            <button 
              @click="resetData" 
              class="confirm-button"
            >
              Yes, Reset Everything
            </button>
          </div>
        </div>
      </div>
      
      <div class="save-section">
        <button 
          @click="saveSettings" 
          class="save-button"
          v-voix:role="'button'"
          v-voix:label="'Save settings'"
        >
          Save Settings
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
  padding-bottom: 72px; /* Space for bottom navigation */
}

.settings-header {
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.settings-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}

.settings-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.settings-section {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.danger-section {
  border: 1px solid rgba(220, 53, 69, 0.1);
}

.danger-section .section-title {
  color: #dc3545;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  padding: 16px;
  margin: 0;
  border-bottom: 1px solid #eee;
}

.setting-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  flex: 1;
  font-size: 16px;
}

.setting-description {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.setting-control {
  display: flex;
  align-items: center;
}

/* Toggle switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 34px;
  transition: 0.3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .slider {
  background-color: #1a73e8;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

/* Signature input */
.signature-control {
  width: 100%;
  margin-top: 8px;
}

.signature-input {
  width: 100%;
  min-height: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
}

/* Select input */
.select-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* Buttons */
.save-section {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 24px;
}

.save-button {
  padding: 12px 24px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #1765cc;
}

.danger-button {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.danger-button:hover {
  background-color: #c82333;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #dc3545;
}

.modal-body {
  padding: 16px;
}

.modal-body p {
  margin: 12px 0;
}

.modal-body ul {
  margin: 12px 0;
  padding-left: 24px;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-button {
  padding: 8px 16px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.confirm-button {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

@media (min-width: 768px) {
  .settings-header {
    padding: 24px;
  }
  
  .settings-content {
    padding: 24px;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .modal-container {
    width: 500px;
  }
}
</style>