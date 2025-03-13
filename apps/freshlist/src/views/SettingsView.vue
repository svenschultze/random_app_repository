<script setup>
import { inject, ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const user = inject('user')
const appSettings = inject('appSettings')

// Active settings tab - defaults to appearance but can be set by the URL query parameter
const activeTab = ref('appearance')

// Function to set active tab and scroll to the corresponding section
const setActiveTab = async (tab) => {
  activeTab.value = tab
  
  // Use nextTick to ensure the DOM is updated
  await nextTick()
  const section = document.getElementById(`${tab}-section`)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}

// Initialize the active tab based on URL query parameter
onMounted(async () => {
  if (route.query.tab) {
    const tab = route.query.tab.toString()
    // Make sure the tab is valid
    if (['appearance', 'display', 'notifications', 'dashboard', 'profile'].includes(tab)) {
      await setActiveTab(tab)
    }
  }
})

// Color picker options
const colorOptions = [
  { name: 'Green', value: '#4caf50' },
  { name: 'Blue', value: '#2196f3' },
  { name: 'Purple', value: '#9c27b0' },
  { name: 'Orange', value: '#ff9800' },
  { name: 'Red', value: '#f44336' }
]

// Font size options
const fontSizeOptions = [
  { name: 'Small', value: 'small' },
  { name: 'Medium', value: 'medium' },
  { name: 'Large', value: 'large' }
]

// Shopping day options
const shoppingDayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Form data for user profile editing
const userProfile = ref({
  name: user.value?.name || '',
  bio: user.value?.bio || ''
})

// For success message
const showSuccessMessage = ref(false)

// Toggle handlers
const toggleDarkMode = () => {
  appSettings.theme.isDarkMode = !appSettings.theme.isDarkMode
}

const toggleShowImages = () => {
  appSettings.display.showImages = !appSettings.display.showImages
}

const toggleCompactView = () => {
  appSettings.display.compactView = !appSettings.display.compactView
}

const toggleNotifications = () => {
  appSettings.notifications.enabled = !appSettings.notifications.enabled
  // If notifications are disabled, also disable reminders
  if (!appSettings.notifications.enabled) {
    appSettings.notifications.reminders = false
  }
}

const toggleReminders = () => {
  if (appSettings.notifications.enabled) {
    appSettings.notifications.reminders = !appSettings.notifications.reminders
  }
}

// Save profile changes
const saveProfileChanges = () => {
  if (user.value) {
    user.value.name = userProfile.value.name
    user.value.bio = userProfile.value.bio
    
    // Show success message
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  }
}
</script>

<template>
  <div class="settings-page">
    <h1 v-voix="'settings-title'">Settings</h1>
    
    <div class="settings-tabs" v-voix="'settings-tabs'" hint="Navigation tabs for different settings categories">
      <button 
        @click="setActiveTab('appearance')" 
        class="tab-button" 
        :class="{ active: activeTab === 'appearance' }"
        v-voix="'appearance-tab'"
        hint="Go to appearance settings"
      >
        Appearance
      </button>
      <button 
        @click="setActiveTab('display')" 
        class="tab-button" 
        :class="{ active: activeTab === 'display' }"
        v-voix="'display-tab'"
        hint="Go to display settings"
      >
        Display
      </button>
      <button 
        @click="setActiveTab('notifications')" 
        class="tab-button" 
        :class="{ active: activeTab === 'notifications' }"
        v-voix="'notifications-tab'"
        hint="Go to notification settings"
      >
        Notifications
      </button>
      <button 
        @click="setActiveTab('dashboard')" 
        class="tab-button" 
        :class="{ active: activeTab === 'dashboard' }"
        v-voix="'dashboard-tab'"
        hint="Go to dashboard settings"
      >
        Dashboard
      </button>
      <button 
        @click="setActiveTab('profile')" 
        class="tab-button" 
        :class="{ active: activeTab === 'profile' }"
        v-voix="'profile-tab'"
        hint="Go to profile settings"
      >
        Profile
      </button>
    </div>
    
    <div class="settings-container">
      <!-- Appearance Settings Section -->
      <section id="appearance-section" class="settings-section" v-voix="'appearance-section'">
        <h2>Appearance Settings</h2>
        
        <!-- Theme Color -->
        <div class="setting-group">
          <h3 v-voix="'theme-color-title'">Theme Color</h3>
          <div class="color-options">
            <div class="color-option-wrapper" v-for="color in colorOptions" :key="color.value">
              <div 
                class="color-option"
                :class="{ active: appSettings.theme.primary === color.value }"
                :style="{ backgroundColor: color.value }"
                @click="appSettings.theme.primary = color.value"
                v-voix="'color-option-' + color.name.toLowerCase()"
                :hint="'Set theme color to ' + color.name"
              ></div>
              <span class="color-name" v-if="appSettings.theme.primary === color.value">
                {{ color.name }}
                <span class="status-dot"></span>
              </span>
            </div>
          </div>
        </div>
        
        <!-- Dark Mode Toggle -->
        <div class="setting-group">
          <div class="setting-row">
            <label 
              for="dark-mode-toggle" 
              v-voix="'dark-mode-label'"
              class="switch-label"
            >
              Dark Mode
            </label>
            <div class="toggle-switch" @click="toggleDarkMode">
              <input 
                type="checkbox" 
                id="dark-mode-toggle" 
                :checked="appSettings.theme.isDarkMode"
                v-voix="'dark-mode-toggle'"
                hint="Toggle dark mode"
              />
              <span class="toggle-slider"></span>
              <span class="toggle-status">{{ appSettings.theme.isDarkMode ? 'On' : 'Off' }}</span>
            </div>
          </div>
        </div>
        
        <!-- Font Size -->
        <div class="setting-group">
          <h3 v-voix="'font-size-title'">Font Size</h3>
          <div class="font-size-options">
            <button 
              v-for="size in fontSizeOptions"
              :key="size.value"
              class="font-size-option"
              :class="{ active: appSettings.theme.fontSize === size.value }"
              :status="appSettings.theme.fontSize === size.value"
              @click="appSettings.theme.fontSize = size.value"
              v-voix="'font-size-' + size.value"
              :hint="'Set font size to ' + size.name"
            >
              {{ size.name }}
              <span class="option-status" v-if="appSettings.theme.fontSize === size.value">
                <span class="status-dot"></span>
                Current
              </span>
            </button>
          </div>
        </div>
      </section>
      
      <!-- Display Settings Section -->
      <section id="display-section" class="settings-section" v-voix="'display-section'">
        <h2>Display Settings</h2>
        
        <!-- Show Images Toggle -->
        <div class="setting-group">
          <div class="setting-row">
            <label 
              for="show-images-toggle" 
              v-voix="'show-images-label'"
              class="switch-label"
            >
              Show Item Images
            </label>
            <div class="toggle-switch" @click="toggleShowImages">
              <input 
                type="checkbox" 
                id="show-images-toggle" 
                :checked="appSettings.display.showImages"
                v-voix="'show-images-toggle'"
                hint="Toggle display of item images"
              />
              <span class="toggle-slider"></span>
              <span class="toggle-status">{{ appSettings.display.showImages ? 'On' : 'Off' }}</span>
            </div>
          </div>
        </div>
        
        <!-- Compact View Toggle -->
        <div class="setting-group">
          <div class="setting-row">
            <label 
              for="compact-view-toggle" 
              v-voix="'compact-view-label'"
              class="switch-label"
            >
              Compact List View
            </label>
            <div class="toggle-switch" @click="toggleCompactView">
              <input 
                type="checkbox" 
                id="compact-view-toggle" 
                :checked="appSettings.display.compactView"
                v-voix="'compact-view-toggle'"
                hint="Toggle compact list view"
              />
              <span class="toggle-slider"></span>
              <span class="toggle-status">{{ appSettings.display.compactView ? 'On' : 'Off' }}</span>
            </div>
          </div>
        </div>
        
        <!-- Default Sort Field -->
        <div class="setting-group">
          <h3 v-voix="'default-sort-title'">Default Sort Order</h3>
          <div class="select-container">
            <select 
              v-model="appSettings.display.sortDefaultField"
              class="select-input"
              v-voix="'default-sort-select'"
              hint="Select the default field to sort by"
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="dateAdded">Date Added</option>
              <option value="isPurchased">Purchase Status</option>
            </select>
            <div class="select-status">
              <span class="status-dot"></span>
              Current sort: {{ appSettings.display.sortDefaultField.charAt(0).toUpperCase() + appSettings.display.sortDefaultField.slice(1) }}
            </div>
          </div>
        </div>
      </section>
      
      <!-- Notification Settings Section -->
      <section id="notifications-section" class="settings-section" v-voix="'notifications-section'">
        <h2>Notification Settings</h2>
        
        <!-- Enable Notifications Toggle -->
        <div class="setting-group">
          <div class="setting-row">
            <label 
              for="enable-notifications-toggle" 
              v-voix="'enable-notifications-label'"
              class="switch-label"
            >
              Enable Notifications
            </label>
            <div class="toggle-switch" @click="toggleNotifications">
              <input 
                type="checkbox" 
                id="enable-notifications-toggle" 
                :checked="appSettings.notifications.enabled"
                v-voix="'enable-notifications-toggle'"
                hint="Toggle notifications"
              />
              <span class="toggle-slider"></span>
              <span class="toggle-status">{{ appSettings.notifications.enabled ? 'On' : 'Off' }}</span>
            </div>
          </div>
        </div>
        
        <!-- Shopping Reminders Toggle -->
        <div class="setting-group" :class="{ disabled: !appSettings.notifications.enabled }">
          <div class="setting-row">
            <label 
              for="shopping-reminders-toggle" 
              v-voix="'shopping-reminders-label'"
              class="switch-label"
            >
              Shopping Reminders
            </label>
            <div 
              class="toggle-switch" 
              @click="toggleReminders"
              :class="{ 'disabled-switch': !appSettings.notifications.enabled }"
            >
              <input 
                type="checkbox" 
                id="shopping-reminders-toggle" 
                :checked="appSettings.notifications.reminders"
                :disabled="!appSettings.notifications.enabled"
                v-voix="'shopping-reminders-toggle'"
                hint="Toggle shopping reminder notifications"
              />
              <span class="toggle-slider"></span>
              <span class="toggle-status">{{ appSettings.notifications.reminders ? 'On' : 'Off' }}</span>
            </div>
          </div>
        </div>
        
        <!-- Shopping Day Selector -->
        <div class="setting-group" :class="{ disabled: !appSettings.notifications.enabled || !appSettings.notifications.reminders }">
          <h3 v-voix="'shopping-day-title'">Preferred Shopping Day</h3>
          <div class="select-container">
            <select 
              v-model="appSettings.notifications.shoppingDay"
              class="select-input"
              :disabled="!appSettings.notifications.enabled || !appSettings.notifications.reminders"
              v-voix="'shopping-day-select'"
              hint="Select your preferred shopping day for reminders"
            >
              <option v-for="day in shoppingDayOptions" :key="day" :value="day">
                {{ day }}
              </option>
            </select>
            <div class="select-status" v-if="appSettings.notifications.enabled && appSettings.notifications.reminders">
              <span class="status-dot"></span>
              Current: {{ appSettings.notifications.shoppingDay }}
            </div>
          </div>
        </div>
      </section>
      
      <!-- Dashboard Settings Section -->
      <section id="dashboard-section" class="settings-section" v-voix="'dashboard-section'">
        <h2>Dashboard Settings</h2>
        
        <!-- Dashboard Layout Options -->
        <div class="setting-group">
          <h3 v-voix="'dashboard-layout-title'">Dashboard Layout</h3>
          <div class="layout-options">
            <button 
              class="layout-option" 
              :class="{ active: appSettings.dashboard.layout === 'compact' }"
              @click="appSettings.dashboard.layout = 'compact'"
              v-voix="'layout-compact'"
              hint="Set compact dashboard layout"
            >
              Compact
              <span class="option-status" v-if="appSettings.dashboard.layout === 'compact'">
                <span class="status-dot"></span>
                Current
              </span>
            </button>
            
            <button 
              class="layout-option" 
              :class="{ active: appSettings.dashboard.layout === 'standard' }"
              @click="appSettings.dashboard.layout = 'standard'"
              v-voix="'layout-standard'"
              hint="Set standard dashboard layout"
            >
              Standard
              <span class="option-status" v-if="appSettings.dashboard.layout === 'standard'">
                <span class="status-dot"></span>
                Current
              </span>
            </button>
            
            <button 
              class="layout-option" 
              :class="{ active: appSettings.dashboard.layout === 'expanded' }"
              @click="appSettings.dashboard.layout = 'expanded'"
              v-voix="'layout-expanded'"
              hint="Set expanded dashboard layout"
            >
              Expanded
              <span class="option-status" v-if="appSettings.dashboard.layout === 'expanded'">
                <span class="status-dot"></span>
                Current
              </span>
            </button>
          </div>
        </div>
        
        <!-- Dashboard Widgets Toggle -->
        <div class="setting-group">
          <h3 v-voix="'dashboard-widgets-title'">Visible Widgets</h3>
          
          <div class="setting-row">
            <label 
              for="widget-user-profile" 
              v-voix="'widget-user-profile-label'"
              class="switch-label"
            >
              User Profile
            </label>
            <div class="toggle-switch" @click="appSettings.dashboard.widgets.userProfile = !appSettings.dashboard.widgets.userProfile">
              <input 
                type="checkbox" 
                id="widget-user-profile" 
                :checked="appSettings.dashboard.widgets.userProfile"
                v-voix="'widget-user-profile-toggle'"
                hint="Toggle user profile widget visibility"
              />
              <span class="toggle-slider"></span>
              <span class="toggle-status">{{ appSettings.dashboard.widgets.userProfile ? 'On' : 'Off' }}</span>
            </div>
          </div>
          
          <div class="setting-row">
            <label 
              for="widget-summary-stats" 
              v-voix="'widget-summary-stats-label'"
              class="switch-label"
            >
              Summary Statistics
            </label>
            <div class="toggle-switch" @click="appSettings.dashboard.widgets.summaryStats = !appSettings.dashboard.widgets.summaryStats">
              <input 
                type="checkbox" 
                id="widget-summary-stats" 
                :checked="appSettings.dashboard.widgets.summaryStats"
                v-voix="'widget-summary-stats-toggle'"
                hint="Toggle summary statistics widget visibility"
              />
              <span class="toggle-slider"></span>
              <span class="toggle-status">{{ appSettings.dashboard.widgets.summaryStats ? 'On' : 'Off' }}</span>
            </div>
          </div>
          
          <div class="setting-row">
            <label 
              for="widget-progress-bar" 
              v-voix="'widget-progress-bar-label'"
              class="switch-label"
            >
              Progress Bar
            </label>
            <div class="toggle-switch" @click="appSettings.dashboard.widgets.progressBar = !appSettings.dashboard.widgets.progressBar">
              <input 
                type="checkbox" 
                id="widget-progress-bar" 
                :checked="appSettings.dashboard.widgets.progressBar"
                v-voix="'widget-progress-bar-toggle'"
                hint="Toggle progress bar widget visibility"
              />
              <span class="toggle-slider"></span>
              <span class="toggle-status">{{ appSettings.dashboard.widgets.progressBar ? 'On' : 'Off' }}</span>
            </div>
          </div>
          
          <div class="setting-row">
            <label 
              for="widget-recent-items" 
              v-voix="'widget-recent-items-label'"
              class="switch-label"
            >
              Recent Items
            </label>
            <div class="toggle-switch" @click="appSettings.dashboard.widgets.recentItems = !appSettings.dashboard.widgets.recentItems">
              <input 
                type="checkbox" 
                id="widget-recent-items" 
                :checked="appSettings.dashboard.widgets.recentItems"
                v-voix="'widget-recent-items-toggle'"
                hint="Toggle recent items widget visibility"
              />
              <span class="toggle-slider"></span>
              <span class="toggle-status">{{ appSettings.dashboard.widgets.recentItems ? 'On' : 'Off' }}</span>
            </div>
          </div>
          
          <div class="setting-row">
            <label 
              for="widget-category-breakdown" 
              v-voix="'widget-category-breakdown-label'"
              class="switch-label"
            >
              Category Breakdown
            </label>
            <div class="toggle-switch" @click="appSettings.dashboard.widgets.categoryBreakdown = !appSettings.dashboard.widgets.categoryBreakdown">
              <input 
                type="checkbox" 
                id="widget-category-breakdown" 
                :checked="appSettings.dashboard.widgets.categoryBreakdown"
                v-voix="'widget-category-breakdown-toggle'"
                hint="Toggle category breakdown widget visibility"
              />
              <span class="toggle-slider"></span>
              <span class="toggle-status">{{ appSettings.dashboard.widgets.categoryBreakdown ? 'On' : 'Off' }}</span>
            </div>
          </div>
        </div>
      </section>
      
      <!-- User Profile Section -->
      <section id="profile-section" class="settings-section" v-voix="'profile-section'">
        <h2>User Profile</h2>
        
        <div class="profile-edit">
          <div class="avatar-container">
            <img :src="user?.avatar" alt="User avatar" class="avatar" v-voix="'user-avatar'" hint="Your profile picture" />
          </div>
          
          <form @submit.prevent="saveProfileChanges" class="profile-form">
            <div class="form-group">
              <label for="user-name" v-voix="'user-name-label'">Name</label>
              <input 
                type="text" 
                id="user-name" 
                v-model="userProfile.name" 
                class="text-input"
                v-voix="'user-name-input'"
                hint="Enter your name"
              />
            </div>
            
            <div class="form-group">
              <label for="user-bio" v-voix="'user-bio-label'">Bio</label>
              <textarea 
                id="user-bio" 
                v-model="userProfile.bio" 
                class="textarea-input"
                v-voix="'user-bio-textarea'"
                hint="Enter a short bio about yourself"
              ></textarea>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn save-btn" v-voix="'save-profile-button'" hint="Save your profile changes">
                Save Profile
              </button>
              <div v-if="showSuccessMessage" class="success-message" v-voix="'profile-save-success'">
                Profile updated successfully!
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-page h1 {
  margin: 0;
  color: var(--color-text);
}

/* Settings navigation tabs */
.settings-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
  overflow-x: auto;
  scrollbar-width: thin;
}

.tab-button {
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-radius: var(--border-radius);
  color: var(--color-text);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-button:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.tab-button.active {
  background-color: var(--color-primary);
  color: white;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
  transition: background-color 0.3s, box-shadow 0.3s;
}

.settings-section h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
  font-size: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
}

.settings-section h3 {
  font-size: 1.1rem;
  margin: 1rem 0 0.75rem 0;
  color: var(--color-text);
}

.setting-group {
  margin-bottom: 1.5rem;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

/* Color options */
.color-options {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.color-option-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 60px;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid var(--color-border);
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border: 3px solid var(--color-text);
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-primary);
}

.color-name {
  font-size: 0.75rem;
  color: var(--color-primary-dark);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Toggle switches */
.switch-label {
  font-weight: 500;
  color: var(--color-text);
}

.toggle-switch {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.toggle-slider {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
  flex-shrink: 0;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.toggle-switch:hover .toggle-slider {
  background-color: #b8b8b8;
}

input:checked + .toggle-slider {
  background-color: var(--color-primary);
}

.toggle-switch:hover input:checked + .toggle-slider {
  background-color: var(--color-primary-dark);
}

.disabled-switch {
  cursor: not-allowed;
}

.disabled-switch .toggle-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.toggle-status {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  width: 30px;
}

/* Font size options */
.font-size-options, .layout-options {
  display: flex;
  gap: 1rem;
}

.font-size-option, .layout-option {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
}

.font-size-option:hover, .layout-option:hover {
  border-color: var(--color-primary);
}

.font-size-option.active, .layout-option.active {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
  border-color: var(--color-primary);
  font-weight: 500;
}

.option-status {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-primary-dark);
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: var(--color-primary);
  border-radius: 50%;
  display: inline-block;
}

/* Select inputs */
.select-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.select-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.select-input:focus {
  border-color: var(--color-primary);
  outline: none;
}

.select-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.select-status {
  font-size: 0.8rem;
  color: var(--color-primary-dark);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
}

/* Profile form */
.profile-edit {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.avatar-container {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  overflow: hidden;
  border: 3px solid var(--color-primary);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-form {
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.text-input,
.textarea-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.text-input:focus,
.textarea-input:focus {
  border-color: var(--color-primary);
  outline: none;
}

.textarea-input {
  min-height: 100px;
  resize: vertical;
}

.save-btn {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.save-btn:hover {
  background-color: var(--color-primary-dark);
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.success-message {
  color: var(--color-primary);
  font-weight: 600;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.disabled {
  opacity: 0.6;
}

@media (max-width: 768px) {
  .settings-section {
    padding: 1.5rem;
  }
  
  .setting-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .toggle-switch {
    align-self: flex-start;
  }
  
  .font-size-options {
    flex-direction: column;
    width: 100%;
  }
  
  .font-size-option {
    width: 100%;
    text-align: center;
  }
}
</style>