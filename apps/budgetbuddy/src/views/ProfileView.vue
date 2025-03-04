<script setup>
import { ref, onMounted } from 'vue'

const userData = ref({
  name: '',
  currency: 'USD',
  monthlyIncome: 0,
  theme: 'system',
  notifications: true,
  exportFormat: 'csv',
  language: 'en'
})

const currencies = [
  { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
  { code: 'EUR', name: 'Euro (€)', symbol: '€' },
  { code: 'GBP', name: 'British Pound (£)', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen (¥)', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar (C$)', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar (A$)', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc (CHF)', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan (¥)', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee (₹)', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real (R$)', symbol: 'R$' }
]

const themes = [
  { id: 'system', name: 'System Default' },
  { id: 'light', name: 'Light Mode' },
  { id: 'dark', name: 'Dark Mode' }
]

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' }
]

const exportFormats = [
  { id: 'csv', name: 'CSV' },
  { id: 'excel', name: 'Excel' },
  { id: 'pdf', name: 'PDF' }
]

const isLoading = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')
const activeSection = ref('personal')

onMounted(() => {
  loadUserData()
})

const loadUserData = () => {
  const data = localStorage.getItem('budgetBuddyUserData')
  if (data) {
    const parsedData = JSON.parse(data)
    userData.value = {
      ...userData.value,
      ...parsedData
    }
  }
}

const saveUserData = () => {
  localStorage.setItem('budgetBuddyUserData', JSON.stringify(userData.value))
  showSuccess('Your profile has been updated successfully')
}

const showSuccess = (message) => {
  successMessage.value = message
  showSuccessMessage.value = true
  
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

const resetUserData = () => {
  if (confirm('Are you sure you want to reset all app data? This cannot be undone.')) {
    localStorage.clear()
    showSuccess('All data has been reset. Refresh the page to start over.')
  }
}

const exportAllData = () => {
  isLoading.value = true
  
  setTimeout(() => {
    // Gather all data from localStorage
    const data = {
      userData: JSON.parse(localStorage.getItem('budgetBuddyUserData') || '{}'),
      transactions: JSON.parse(localStorage.getItem('budgetBuddyTransactions') || '[]'),
      budgets: JSON.parse(localStorage.getItem('budgetBuddyBudgets') || '[]'),
      savingsGoals: JSON.parse(localStorage.getItem('budgetBuddySavingsGoals') || '[]')
    }
    
    // Convert to JSON
    const jsonData = JSON.stringify(data, null, 2)
    
    // Create download link
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', `budgetbuddy-export-${new Date().toISOString().split('T')[0]}.json`)
    a.click()
    
    isLoading.value = false
    showSuccess('Your data has been exported successfully')
  }, 1000)
}

const setActiveSection = (section) => {
  activeSection.value = section
}
</script>

<template>
  <div class="profile-container">
    <header class="section-header">
      <h2>Your Profile</h2>
    </header>
    
    <!-- Success Message -->
    <div 
      v-if="showSuccessMessage" 
      class="success-message"
    >
      {{ successMessage }}
    </div>
    
    <div class="profile-layout">
      <!-- Sidebar Navigation -->
      <div class="profile-sidebar">
        <nav class="profile-nav">
          <button 
            @click="setActiveSection('personal')" 
            class="nav-item" 
            :class="{ 'active': activeSection === 'personal' }"
          >
            Personal Information
          </button>
          <button 
            @click="setActiveSection('preferences')" 
            class="nav-item" 
            :class="{ 'active': activeSection === 'preferences' }"
          >
            Preferences
          </button>
          <button 
            @click="setActiveSection('data')" 
            class="nav-item" 
            :class="{ 'active': activeSection === 'data' }"
          >
            Data & Privacy
          </button>
        </nav>
      </div>
      
      <!-- Main Content -->
      <div class="profile-content">
        <!-- Personal Information Section -->
        <section v-if="activeSection === 'personal'" class="profile-section">
          <h3>Personal Information</h3>
          
          <div class="form-group">
            <label for="user-name">Your Name</label>
            <input 
              id="user-name" 
              type="text" 
              v-model="userData.name"
              placeholder="Enter your name"
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label for="monthly-income">Monthly Income</label>
            <input 
              id="monthly-income" 
              type="number" 
              v-model="userData.monthlyIncome"
              placeholder="0.00"
              step="0.01"
              min="0"
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label for="currency">Currency</label>
            <select 
              id="currency" 
              v-model="userData.currency"
              class="form-select"
            >
              <option 
                v-for="currency in currencies" 
                :key="currency.code" 
                :value="currency.code"
              >
                {{ currency.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="language">Language</label>
            <select 
              id="language" 
              v-model="userData.language"
              class="form-select"
            >
              <option 
                v-for="language in languages" 
                :key="language.code" 
                :value="language.code"
              >
                {{ language.name }}
              </option>
            </select>
          </div>
          
          <div class="form-actions">
            <button @click="saveUserData" class="btn btn-primary">Save Changes</button>
          </div>
        </section>
        
        <!-- Preferences Section -->
        <section v-if="activeSection === 'preferences'" class="profile-section">
          <h3>Preferences</h3>
          
          <div class="form-group">
            <label for="theme">Theme</label>
            <select 
              id="theme" 
              v-model="userData.theme"
              class="form-select"
            >
              <option 
                v-for="theme in themes" 
                :key="theme.id" 
                :value="theme.id"
              >
                {{ theme.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="export-format">Export Format</label>
            <select 
              id="export-format" 
              v-model="userData.exportFormat"
              class="form-select"
            >
              <option 
                v-for="format in exportFormats" 
                :key="format.id" 
                :value="format.id"
              >
                {{ format.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group toggle-group">
            <span class="toggle-label">Enable Notifications</span>
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="userData.notifications"
              >
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="form-actions">
            <button @click="saveUserData" class="btn btn-primary">Save Preferences</button>
          </div>
        </section>
        
        <!-- Data & Privacy Section -->
        <section v-if="activeSection === 'data'" class="profile-section">
          <h3>Data & Privacy</h3>
          
          <div class="card data-card">
            <h4>Export Your Data</h4>
            <p>Download all your BudgetBuddy data as a JSON file, which can be imported later.</p>
            <button 
              @click="exportAllData" 
              class="btn btn-primary"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Exporting...</span>
              <span v-else>Export Data</span>
            </button>
          </div>
          
          <div class="card data-card danger-zone">
            <h4>Reset Application</h4>
            <p>This will clear all your data, including transactions, budgets, and settings. This action cannot be undone.</p>
            <button @click="resetUserData" class="btn btn-danger">Reset All Data</button>
          </div>
          
          <div class="card data-card">
            <h4>Privacy Information</h4>
            <p>BudgetBuddy stores all your data locally on your device. No data is sent to external servers. Your financial information stays private and secure.</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  width: 100%;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.75rem;
  margin: 0;
}

.success-message {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
}

.profile-layout {
  display: flex;
  gap: 2rem;
}

.profile-sidebar {
  width: 250px;
  flex-shrink: 0;
}

.profile-nav {
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.nav-item {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-weight: 500;
  color: var(--color-text);
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background-color: var(--color-background-mute);
}

.nav-item.active {
  background-color: var(--color-background-mute);
  border-left-color: #4caf50;
  color: var(--color-heading);
  font-weight: 600;
}

.profile-content {
  flex: 1;
}

.profile-section {
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-section h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input, .form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
}

.toggle-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-label {
  font-weight: 500;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
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
  background-color: var(--color-background-mute);
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: var(--color-background);
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #4caf50;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.form-actions {
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

.btn:hover:not(:disabled) {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.data-card {
  background-color: var(--color-background);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.data-card h4 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.125rem;
}

.data-card p {
  margin-bottom: 1.5rem;
  color: var(--color-text-light);
}

.danger-zone {
  border: 1px solid #f44336;
}

@media (max-width: 768px) {
  .profile-layout {
    flex-direction: column;
  }
  
  .profile-sidebar {
    width: 100%;
  }
  
  .profile-nav {
    flex-direction: row;
    overflow-x: auto;
  }
  
  .nav-item {
    padding: 0.75rem 1rem;
    border-left: none;
    border-bottom: 3px solid transparent;
    white-space: nowrap;
  }
  
  .nav-item.active {
    border-left-color: transparent;
    border-bottom-color: #4caf50;
  }
}
</style>