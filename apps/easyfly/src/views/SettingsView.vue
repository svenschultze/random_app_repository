<script setup>
import { ref } from 'vue'

// Settings state
const settings = ref({
  preferences: {
    language: 'en',
    currency: 'USD',
    units: 'imperial'
  },
  notifications: {
    priceAlerts: true,
    flightStatus: true,
    promotions: false
  },
  storage: {
    savePassengerInfo: true,
    savePaymentInfo: false
  }
})

// Available options
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' }
]

const currencyOptions = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' }
]

const unitOptions = [
  { value: 'imperial', label: 'Imperial (mi, °F)' },
  { value: 'metric', label: 'Metric (km, °C)' }
]

// Mock passenger data
const passengerInfo = {
  firstName: 'John',
  lastName: 'Doe',
  dob: '1985-06-15',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567'
}

// Save settings
const saveSettings = () => {
  // In a real app, we would save to localStorage
  alert('Settings saved successfully!')
}

// Clear all local data
const clearLocalData = () => {
  const confirmed = confirm('Are you sure you want to clear all locally stored data? This will remove all your saved preferences, passenger information, and payment methods.')
  
  if (confirmed) {
    // In a real app, we would clear localStorage
    settings.value.storage.savePassengerInfo = false
    settings.value.storage.savePaymentInfo = false
    alert('All locally stored data has been cleared.')
  }
}
</script>

<template>
  <div class="settings-view">
    <h1 v-voix="'Settings Heading'">Settings</h1>
    
    <div class="settings-section">
      <h2 v-voix="'Preferences Heading'">Preferences</h2>
      
      <div class="settings-card">
        <div class="setting-group">
          <label for="language" v-voix="'Language Label'">Language</label>
          <select 
            id="language" 
            v-model="settings.preferences.language"
            v-voix="'Language Dropdown'"
            hint="Select your preferred language"
          >
            <option 
              v-for="option in languageOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        
        <div class="setting-group">
          <label for="currency" v-voix="'Currency Label'">Currency</label>
          <select 
            id="currency" 
            v-model="settings.preferences.currency"
            v-voix="'Currency Dropdown'"
            hint="Select your preferred currency"
          >
            <option 
              v-for="option in currencyOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        
        <div class="setting-group">
          <label for="units" v-voix="'Measurement Units Label'">Measurement Units</label>
          <select 
            id="units" 
            v-model="settings.preferences.units"
            v-voix="'Measurement Units Dropdown'"
            hint="Select your preferred measurement units"
          >
            <option 
              v-for="option in unitOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h2 v-voix="'Notifications Heading'">Notifications</h2>
      
      <div class="settings-card">
        <div class="toggle-setting">
          <div class="toggle-label" v-voix="'Price Alerts Toggle Label'">
            Price Alerts
            <div class="toggle-description">Receive notifications when prices drop for your saved routes</div>
          </div>
          
          <label class="toggle-container">
            <input 
              type="checkbox" 
              v-model="settings.notifications.priceAlerts"
              v-voix="'Price Alerts Toggle'"
              hint="Toggle price alerts notifications"
            >
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div class="toggle-setting">
          <div class="toggle-label" v-voix="'Flight Status Toggle Label'">
            Flight Status Updates
            <div class="toggle-description">Receive updates about delays, gate changes, and cancellations</div>
          </div>
          
          <label class="toggle-container">
            <input 
              type="checkbox" 
              v-model="settings.notifications.flightStatus"
              v-voix="'Flight Status Toggle'"
              hint="Toggle flight status notifications"
            >
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div class="toggle-setting">
          <div class="toggle-label" v-voix="'Promotions Toggle Label'">
            Promotions & Deals
            <div class="toggle-description">Receive notifications about special offers and flight deals</div>
          </div>
          
          <label class="toggle-container">
            <input 
              type="checkbox" 
              v-model="settings.notifications.promotions"
              v-voix="'Promotions Toggle'"
              hint="Toggle promotions and deals notifications"
            >
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h2 v-voix="'Local Storage Heading'">Local Data Storage</h2>
      
      <div class="settings-card">
        <div class="toggle-setting">
          <div class="toggle-label" v-voix="'Save Passenger Info Toggle Label'">
            Save Passenger Information
            <div class="toggle-description">Store passenger details locally for faster booking</div>
          </div>
          
          <label class="toggle-container">
            <input 
              type="checkbox" 
              v-model="settings.storage.savePassengerInfo"
              v-voix="'Save Passenger Info Toggle'"
              hint="Toggle saving passenger information"
            >
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div class="toggle-setting">
          <div class="toggle-label" v-voix="'Save Payment Info Toggle Label'">
            Save Payment Information
            <div class="toggle-description">Store payment methods locally for faster checkout</div>
          </div>
          
          <label class="toggle-container">
            <input 
              type="checkbox" 
              v-model="settings.storage.savePaymentInfo"
              v-voix="'Save Payment Info Toggle'"
              hint="Toggle saving payment information"
            >
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div v-if="settings.storage.savePassengerInfo" class="saved-info-section">
          <h3 v-voix="'Saved Passenger Info Heading'">Saved Passenger Information</h3>
          
          <div class="info-summary">
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">{{ passengerInfo.firstName }} {{ passengerInfo.lastName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date of Birth:</span>
              <span class="info-value">{{ passengerInfo.dob }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">{{ passengerInfo.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">{{ passengerInfo.phone }}</span>
            </div>
          </div>
        </div>
        
        <div class="danger-zone">
          <h3 v-voix="'Clear All Data Heading'">Clear All Data</h3>
          <div class="danger-description">
            This will remove all your locally stored preferences, passenger information, and payment methods.
          </div>
          <button 
            class="danger-button" 
            @click="clearLocalData"
            v-voix="'Clear All Data Button'"
            hint="Delete all locally stored information"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h2 v-voix="'Support Heading'">Support & Help</h2>
      
      <div class="settings-card">
        <div class="support-links">
          <a href="#" class="support-link" v-voix="'FAQ Link'">Frequently Asked Questions</a>
          <a href="#" class="support-link" v-voix="'Contact Support Link'">Contact Support</a>
          <a href="#" class="support-link" v-voix="'Privacy Policy Link'">Privacy Policy</a>
          <a href="#" class="support-link" v-voix="'Terms of Service Link'">Terms of Service</a>
        </div>
        
        <div class="app-info">
          <div class="app-version">EasyFly v1.0.0</div>
        </div>
      </div>
    </div>
    
    <div class="save-settings">
      <button 
        class="save-button" 
        @click="saveSettings"
        v-voix="'Save Settings Button'"
        hint="Save all your preference changes"
      >
        Save Settings
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  padding-bottom: 5rem;
}

h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

.settings-section {
  margin-bottom: 2rem;
}

h2 {
  margin-bottom: 1rem;
  color: #333;
}

.settings-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.setting-group {
  margin-bottom: 1.25rem;
}

.setting-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.setting-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
}

.toggle-setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.toggle-setting:last-child {
  border-bottom: none;
}

.toggle-label {
  font-weight: 500;
}

.toggle-description {
  font-weight: normal;
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.toggle-container {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle-container input {
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
  background-color: #4a90e2;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.saved-info-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.saved-info-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.info-row {
  margin-bottom: 0.5rem;
}

.info-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.info-value {
  color: #666;
}

.danger-zone {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.danger-zone h3 {
  color: #dc3545;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.danger-description {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.danger-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.support-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.support-link {
  color: #4a90e2;
  text-decoration: none;
}

.support-link:hover {
  text-decoration: underline;
}

.app-info {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  color: #666;
  font-size: 0.9rem;
}

.save-settings {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.save-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .toggle-setting {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .toggle-container {
    margin-top: 1rem;
  }
}
</style>