<script setup>
import { ref } from 'vue'

// User profile settings
const userProfile = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '👨‍💻'
})

// Theme settings
const themeSettings = ref({
  theme: 'light', // light, dark, or system
  accentColor: '#4169E1', // Royal Blue
  fontSize: 'medium' // small, medium, or large
})

// Notification settings
const notificationSettings = ref({
  emailNotifications: true,
  collaborationNotifications: true,
  reminderNotifications: true
})

// Editor settings
const editorSettings = ref({
  defaultView: 'edit', // edit or preview
  spellCheck: true,
  autoSave: true,
  saveInterval: 60, // in seconds
})

// Privacy & Security settings
const securitySettings = ref({
  defaultNoteVisibility: 'private', // private or public
  biometricLock: false,
  lockTimeout: 5 // in minutes
})

// Synchronization settings
const syncSettings = ref({
  autoSync: true,
  syncOnWifi: false,
  lastSync: '2025-03-05 14:30:22'
})

// Active section tracker
const activeSection = ref('profile')

// Available accent colors
const accentColors = [
  { name: 'Royal Blue', value: '#4169E1' },
  { name: 'Emerald Green', value: '#2ecc71' },
  { name: 'Purple', value: '#9b59b6' },
  { name: 'Crimson', value: '#e74c3c' },
  { name: 'Orange', value: '#e67e22' },
  { name: 'Teal', value: '#1abc9c' },
  { name: 'Pink', value: '#e84393' },
  { name: 'Yellow', value: '#f1c40f' }
]

// Update settings functions
const updateTheme = (theme) => {
  themeSettings.value.theme = theme
  // In a real app, this would save to local storage or backend
  // and update the app's theme immediately
}

const updateAccentColor = (color) => {
  themeSettings.value.accentColor = color
  // In a real app, this would update CSS variables or theme
}

const updateFontSize = (size) => {
  themeSettings.value.fontSize = size
  // In a real app, this would update font size throughout the app
}

const updateSaveInterval = (event) => {
  const value = parseInt(event.target.value)
  if (!isNaN(value) && value >= 5) {
    editorSettings.value.saveInterval = value
  }
}

const updateLockTimeout = (event) => {
  const value = parseInt(event.target.value)
  if (!isNaN(value) && value >= 1) {
    securitySettings.value.lockTimeout = value
  }
}

const formatSyncTime = (dateTimeString) => {
  const date = new Date(dateTimeString)
  return new Intl.DateTimeFormat('en-US', { 
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

const triggerManualSync = () => {
  // In a real app, this would trigger synchronization with the server
  syncSettings.value.lastSync = new Date().toISOString().replace('T', ' ').substring(0, 19)
  alert('Synchronization complete!')
}

const clearAllData = () => {
  if (confirm('Are you sure you want to clear all your notes and settings? This cannot be undone.')) {
    // In a real app, this would clear user data
    alert('All data has been cleared.')
  }
}

// Export and import functions
const exportData = () => {
  // In a real app, this would generate a JSON file for download
  alert('Your data has been exported successfully.')
}

const importData = () => {
  // In a real app, this would handle file upload and parsing
  alert('Data import feature would be implemented here.')
}
</script>

<template>
  <div class="settings-view-container">
    <h1 class="view-title">Settings</h1>
    
    <div class="settings-layout">
      <!-- Settings Sidebar -->
      <aside class="settings-sidebar">
        <div class="settings-nav">
          <button 
            @click="activeSection = 'profile'" 
            :class="{ active: activeSection === 'profile' }"
            class="nav-button"
            v-voix="'Profile Settings'"
            hint="View and edit your profile information">
            <span class="nav-icon">👤</span>
            <span class="nav-text">Profile</span>
          </button>
          
          <button 
            @click="activeSection = 'appearance'" 
            :class="{ active: activeSection === 'appearance' }"
            class="nav-button"
            v-voix="'Appearance Settings'"
            hint="Customize the look and feel of NimbusNotes">
            <span class="nav-icon">🎨</span>
            <span class="nav-text">Appearance</span>
          </button>
          
          <button 
            @click="activeSection = 'editor'" 
            :class="{ active: activeSection === 'editor' }"
            class="nav-button"
            v-voix="'Editor Settings'"
            hint="Configure your note editing preferences">
            <span class="nav-icon">✏️</span>
            <span class="nav-text">Editor</span>
          </button>
          
          <button 
            @click="activeSection = 'notifications'" 
            :class="{ active: activeSection === 'notifications' }"
            class="nav-button"
            v-voix="'Notification Settings'"
            hint="Manage your notification preferences">
            <span class="nav-icon">🔔</span>
            <span class="nav-text">Notifications</span>
          </button>
          
          <button 
            @click="activeSection = 'security'" 
            :class="{ active: activeSection === 'security' }"
            class="nav-button"
            v-voix="'Security Settings'"
            hint="Configure privacy and security options">
            <span class="nav-icon">🔒</span>
            <span class="nav-text">Privacy & Security</span>
          </button>
          
          <button 
            @click="activeSection = 'sync'" 
            :class="{ active: activeSection === 'sync' }"
            class="nav-button"
            v-voix="'Sync Settings'"
            hint="Manage data synchronization options">
            <span class="nav-icon">🔄</span>
            <span class="nav-text">Sync & Backup</span>
          </button>
          
          <button 
            @click="activeSection = 'data'" 
            :class="{ active: activeSection === 'data' }"
            class="nav-button"
            v-voix="'Data Management'"
            hint="Export, import, or clear your data">
            <span class="nav-icon">💾</span>
            <span class="nav-text">Data Management</span>
          </button>
        </div>
      </aside>
      
      <!-- Settings Content -->
      <main class="settings-content">
        <!-- Profile Settings -->
        <section v-if="activeSection === 'profile'" class="settings-section">
          <h2 class="section-title" v-voix="'Profile Settings'">Profile Settings</h2>
          
          <div class="profile-settings">
            <div class="profile-avatar">
              <div class="avatar-display">{{ userProfile.avatar }}</div>
              <button 
                class="change-avatar-btn"
                v-voix="'Change Avatar'"
                hint="Select a different avatar image">
                Change Avatar
              </button>
            </div>
            
            <div class="profile-form">
              <div class="form-group">
                <label for="profile-name" v-voix="'Name'">Name:</label>
                <input 
                  type="text" 
                  id="profile-name" 
                  v-model="userProfile.name"
                  class="form-input"
                  v-voix="'Name Input'"
                  hint="Enter your display name">
              </div>
              
              <div class="form-group">
                <label for="profile-email" v-voix="'Email'">Email:</label>
                <input 
                  type="email" 
                  id="profile-email" 
                  v-model="userProfile.email"
                  class="form-input"
                  v-voix="'Email Input'"
                  hint="Enter your email address">
              </div>
              
              <button 
                class="save-changes-btn"
                v-voix="'Save Profile Changes'"
                hint="Save your profile information updates">
                Save Changes
              </button>
            </div>
          </div>
        </section>
        
        <!-- Appearance Settings -->
        <section v-if="activeSection === 'appearance'" class="settings-section">
          <h2 class="section-title" v-voix="'Appearance Settings'">Appearance Settings</h2>
          
          <div class="form-group">
            <label v-voix="'Theme'">Theme:</label>
            <div class="theme-options">
              <button 
                @click="updateTheme('light')" 
                :class="{ active: themeSettings.theme === 'light' }"
                class="theme-button light-theme"
                v-voix="'Light Theme'"
                hint="Switch to light color theme">
                Light
              </button>
              <button 
                @click="updateTheme('dark')" 
                :class="{ active: themeSettings.theme === 'dark' }"
                class="theme-button dark-theme"
                v-voix="'Dark Theme'"
                hint="Switch to dark color theme">
                Dark
              </button>
              <button 
                @click="updateTheme('system')" 
                :class="{ active: themeSettings.theme === 'system' }"
                class="theme-button system-theme"
                v-voix="'System Theme'"
                hint="Use your system's color theme preference">
                System
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label v-voix="'Accent Color'">Accent Color:</label>
            <div class="color-options">
              <button 
                v-for="color in accentColors" 
                :key="color.value"
                @click="updateAccentColor(color.value)"
                class="color-button"
                :class="{ active: themeSettings.accentColor === color.value }"
                :style="{ backgroundColor: color.value }"
                v-voix="'Color: ' + color.name"
                :hint="'Select ' + color.name + ' as your accent color'">
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label v-voix="'Font Size'">Font Size:</label>
            <div class="font-size-options">
              <button 
                @click="updateFontSize('small')" 
                :class="{ active: themeSettings.fontSize === 'small' }"
                class="font-size-button small-font"
                v-voix="'Small Font Size'"
                hint="Use smaller text throughout the app">
                Small
              </button>
              <button 
                @click="updateFontSize('medium')" 
                :class="{ active: themeSettings.fontSize === 'medium' }"
                class="font-size-button medium-font"
                v-voix="'Medium Font Size'"
                hint="Use medium text throughout the app">
                Medium
              </button>
              <button 
                @click="updateFontSize('large')" 
                :class="{ active: themeSettings.fontSize === 'large' }"
                class="font-size-button large-font"
                v-voix="'Large Font Size'"
                hint="Use larger text throughout the app">
                Large
              </button>
            </div>
          </div>
        </section>
        
        <!-- Editor Settings -->
        <section v-if="activeSection === 'editor'" class="settings-section">
          <h2 class="section-title" v-voix="'Editor Settings'">Editor Settings</h2>
          
          <div class="form-group">
            <label v-voix="'Default View'">Default Note View:</label>
            <div class="view-options">
              <button 
                @click="editorSettings.defaultView = 'edit'" 
                :class="{ active: editorSettings.defaultView === 'edit' }"
                class="view-button"
                v-voix="'Edit Mode'"
                hint="Start in edit mode when opening notes">
                Edit Mode
              </button>
              <button 
                @click="editorSettings.defaultView = 'preview'" 
                :class="{ active: editorSettings.defaultView === 'preview' }"
                class="view-button"
                v-voix="'Preview Mode'"
                hint="Start in preview mode when opening notes">
                Preview Mode
              </button>
            </div>
          </div>
          
          <div class="form-group switch-group">
            <div class="switch-label" v-voix="'Spell Check'">
              <label for="spellcheck-toggle">Spell Check</label>
              <p class="setting-description">Check spelling as you type</p>
            </div>
            <div class="switch-control">
              <input 
                type="checkbox" 
                id="spellcheck-toggle" 
                v-model="editorSettings.spellCheck"
                v-voix="'Spell Check Toggle'"
                hint="Toggle spell checking while typing">
            </div>
          </div>
          
          <div class="form-group switch-group">
            <div class="switch-label" v-voix="'Auto Save'">
              <label for="autosave-toggle">Auto Save</label>
              <p class="setting-description">Automatically save notes as you edit</p>
            </div>
            <div class="switch-control">
              <input 
                type="checkbox" 
                id="autosave-toggle" 
                v-model="editorSettings.autoSave"
                v-voix="'Auto Save Toggle'"
                hint="Toggle automatic saving of notes while editing">
            </div>
          </div>
          
          <div class="form-group" v-if="editorSettings.autoSave">
            <label for="save-interval" v-voix="'Save Interval'">Auto-save interval (seconds):</label>
            <input 
              type="number" 
              id="save-interval" 
              :value="editorSettings.saveInterval"
              @input="updateSaveInterval"
              min="5"
              class="number-input"
              v-voix="'Save Interval Input'"
              hint="Enter how frequently notes should auto-save in seconds">
          </div>
        </section>
        
        <!-- Notification Settings -->
        <section v-if="activeSection === 'notifications'" class="settings-section">
          <h2 class="section-title" v-voix="'Notification Settings'">Notification Settings</h2>
          
          <div class="form-group switch-group">
            <div class="switch-label" v-voix="'Email Notifications'">
              <label for="email-notifications-toggle">Email Notifications</label>
              <p class="setting-description">Receive important notifications via email</p>
            </div>
            <div class="switch-control">
              <input 
                type="checkbox" 
                id="email-notifications-toggle" 
                v-model="notificationSettings.emailNotifications"
                v-voix="'Email Notifications Toggle'"
                hint="Toggle receiving notifications by email">
            </div>
          </div>
          
          <div class="form-group switch-group">
            <div class="switch-label" v-voix="'Collaboration Notifications'">
              <label for="collab-notifications-toggle">Collaboration Notifications</label>
              <p class="setting-description">Receive alerts when someone shares a note with you</p>
            </div>
            <div class="switch-control">
              <input 
                type="checkbox" 
                id="collab-notifications-toggle" 
                v-model="notificationSettings.collaborationNotifications"
                v-voix="'Collaboration Notifications Toggle'"
                hint="Toggle receiving alerts about shared notes">
            </div>
          </div>
          
          <div class="form-group switch-group">
            <div class="switch-label" v-voix="'Reminder Notifications'">
              <label for="reminder-notifications-toggle">Reminder Notifications</label>
              <p class="setting-description">Receive notifications for note reminders and deadlines</p>
            </div>
            <div class="switch-control">
              <input 
                type="checkbox" 
                id="reminder-notifications-toggle" 
                v-model="notificationSettings.reminderNotifications"
                v-voix="'Reminder Notifications Toggle'"
                hint="Toggle receiving notifications for note reminders">
            </div>
          </div>
        </section>
        
        <!-- Security Settings -->
        <section v-if="activeSection === 'security'" class="settings-section">
          <h2 class="section-title" v-voix="'Privacy and Security Settings'">Privacy & Security Settings</h2>
          
          <div class="form-group">
            <label v-voix="'Default Note Visibility'">Default Note Visibility:</label>
            <div class="visibility-options">
              <button 
                @click="securitySettings.defaultNoteVisibility = 'private'" 
                :class="{ active: securitySettings.defaultNoteVisibility === 'private' }"
                class="visibility-button"
                v-voix="'Private Notes'"
                hint="Make new notes private by default">
                Private
              </button>
              <button 
                @click="securitySettings.defaultNoteVisibility = 'public'" 
                :class="{ active: securitySettings.defaultNoteVisibility === 'public' }"
                class="visibility-button"
                v-voix="'Public Notes'"
                hint="Make new notes public by default">
                Public
              </button>
            </div>
          </div>
          
          <div class="form-group switch-group">
            <div class="switch-label" v-voix="'Biometric Lock'">
              <label for="biometric-toggle">Biometric Lock</label>
              <p class="setting-description">Require biometric authentication to access your notes</p>
            </div>
            <div class="switch-control">
              <input 
                type="checkbox" 
                id="biometric-toggle" 
                v-model="securitySettings.biometricLock"
                v-voix="'Biometric Lock Toggle'"
                hint="Toggle requiring fingerprint or face ID to access notes">
            </div>
          </div>
          
          <div class="form-group" v-if="securitySettings.biometricLock">
            <label for="lock-timeout" v-voix="'Lock Timeout'">Lock timeout (minutes):</label>
            <input 
              type="number" 
              id="lock-timeout" 
              :value="securitySettings.lockTimeout"
              @input="updateLockTimeout"
              min="1"
              class="number-input"
              v-voix="'Lock Timeout Input'"
              hint="Enter how many minutes of inactivity before locking">
          </div>
        </section>
        
        <!-- Sync & Backup Settings -->
        <section v-if="activeSection === 'sync'" class="settings-section">
          <h2 class="section-title" v-voix="'Sync and Backup Settings'">Sync & Backup Settings</h2>
          
          <div class="form-group">
            <div class="sync-status">
              <p v-voix="'Last Sync Time'">
                Last synchronized: <span class="sync-time">{{ formatSyncTime(syncSettings.lastSync) }}</span>
              </p>
              <button 
                @click="triggerManualSync" 
                class="sync-now-button"
                v-voix="'Sync Now'"
                hint="Manually synchronize your notes now">
                Sync Now
              </button>
            </div>
          </div>
          
          <div class="form-group switch-group">
            <div class="switch-label" v-voix="'Automatic Sync'">
              <label for="auto-sync-toggle">Automatic Sync</label>
              <p class="setting-description">Automatically sync notes across your devices</p>
            </div>
            <div class="switch-control">
              <input 
                type="checkbox" 
                id="auto-sync-toggle" 
                v-model="syncSettings.autoSync"
                v-voix="'Automatic Sync Toggle'"
                hint="Toggle automatic synchronization">
            </div>
          </div>
          
          <div class="form-group switch-group" v-if="syncSettings.autoSync">
            <div class="switch-label" v-voix="'Sync On WiFi Only'">
              <label for="wifi-sync-toggle">Sync on WiFi Only</label>
              <p class="setting-description">Only sync when connected to WiFi to save data</p>
            </div>
            <div class="switch-control">
              <input 
                type="checkbox" 
                id="wifi-sync-toggle" 
                v-model="syncSettings.syncOnWifi"
                v-voix="'WiFi Sync Toggle'"
                hint="Toggle syncing only when connected to WiFi">
            </div>
          </div>
        </section>
        
        <!-- Data Management Settings -->
        <section v-if="activeSection === 'data'" class="settings-section">
          <h2 class="section-title" v-voix="'Data Management'">Data Management</h2>
          
          <div class="data-management-options">
            <div class="data-option">
              <h3 v-voix="'Export Data'">Export Data</h3>
              <p>Download a copy of all your notes and settings</p>
              <button 
                @click="exportData" 
                class="data-button export-button"
                v-voix="'Export All Data'"
                hint="Download a backup of all your notes and settings">
                Export All Data
              </button>
            </div>
            
            <div class="data-option">
              <h3 v-voix="'Import Data'">Import Data</h3>
              <p>Restore your notes from a backup file</p>
              <button 
                @click="importData" 
                class="data-button import-button"
                v-voix="'Import Data'"
                hint="Upload a backup file to restore your notes">
                Import Data
              </button>
            </div>
            
            <div class="data-option danger-zone">
              <h3 v-voix="'Clear All Data'">Clear All Data</h3>
              <p>Remove all your notes and reset your settings (cannot be undone)</p>
              <button 
                @click="clearAllData" 
                class="data-button clear-button"
                v-voix="'Clear All Data'"
                hint="Delete all your notes and reset settings - this cannot be undone">
                Clear All Data
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.settings-view-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.view-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

/* Settings Layout */
.settings-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

/* Sidebar Styles */
.settings-sidebar {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1rem;
  height: fit-content;
}

.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  font-size: 1rem;
  color: var(--color-text);
  transition: background-color 0.2s ease;
}

.nav-button:hover {
  background-color: var(--color-background-mute);
}

.nav-button.active {
  background-color: var(--color-background-mute);
  font-weight: 600;
  color: var(--color-heading);
}

.nav-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

/* Settings Content Styles */
.settings-content {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 2rem;
}

.settings-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input, .number-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  font-size: 0.9rem;
  max-width: 400px;
}

.number-input {
  width: 100px;
}

.setting-description {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin: 0.25rem 0 0;
}

/* Profile Settings */
.profile-settings {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-display {
  width: 100px;
  height: 100px;
  background-color: var(--color-background-mute);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.change-avatar-btn {
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.profile-form {
  flex-grow: 1;
  max-width: 400px;
}

.save-changes-btn {
  padding: 0.75rem 1.5rem;
  background-color: #4169E1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 1rem;
}

/* Theme Options */
.theme-options, .view-options, .visibility-options, .font-size-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.theme-button, .view-button, .visibility-button, .font-size-button {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-button.active, .view-button.active, .visibility-button.active, .font-size-button.active {
  background-color: #4169E1;
  color: white;
  border-color: #4169E1;
}

.dark-theme {
  background-color: #2c3e50;
  color: white;
}

.light-theme {
  background-color: #f8f9fa;
  color: #2c3e50;
}

.small-font {
  font-size: 0.85rem;
}

.large-font {
  font-size: 1.1rem;
}

/* Color Options */
.color-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.color-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-button:hover {
  transform: scale(1.1);
}

.color-button.active {
  border-color: var(--color-text);
  transform: scale(1.1);
}

/* Switch Group */
.switch-group {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.switch-label {
  flex-grow: 1;
}

.switch-label label {
  margin-bottom: 0.25rem;
}

.switch-control input[type="checkbox"] {
  width: 3em;
  height: 1.5em;
  appearance: none;
  -webkit-appearance: none;
  background-color: #ddd;
  border-radius: 1.5em;
  position: relative;
  cursor: pointer;
  outline: none;
}

.switch-control input[type="checkbox"]::before {
  content: "";
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.3s;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

.switch-control input[type="checkbox"]:checked {
  background-color: #4169E1;
}

.switch-control input[type="checkbox"]:checked::before {
  left: 1.5em;
}

/* Sync Status */
.sync-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  background-color: var(--color-background);
  padding: 1rem;
  border-radius: 4px;
}

.sync-time {
  font-weight: 500;
}

.sync-now-button {
  padding: 0.5rem 1rem;
  background-color: #4169E1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Data Management */
.data-management-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.data-option {
  background-color: var(--color-background);
  padding: 1.5rem;
  border-radius: 8px;
}

.data-option h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.data-option p {
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.data-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
}

.export-button {
  background-color: #4169E1;
  color: white;
}

.import-button {
  background-color: #3CB371;
  color: white;
}

.clear-button {
  background-color: #E74C3C;
  color: white;
}

.danger-zone {
  border: 1px solid #E74C3C;
}

@media (max-width: 768px) {
  .settings-layout {
    grid-template-columns: 1fr;
  }
  
  .settings-sidebar {
    margin-bottom: 1.5rem;
  }
  
  .settings-nav {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-button {
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem;
    flex: 1;
    min-width: 80px;
    max-width: 100px;
    text-align: center;
  }
  
  .nav-icon {
    margin: 0 auto;
  }
  
  .nav-text {
    font-size: 0.85rem;
  }
  
  .switch-group {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .profile-settings {
    flex-direction: column;
    align-items: center;
  }
  
  .profile-form {
    width: 100%;
  }
}
</style>