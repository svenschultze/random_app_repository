<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'

const router = useRouter()

// User profile data
const user = ref({
  name: 'Alex Johnson',
  email: 'alex@example.com',
  age: 29,
  gender: 'Male',
  lookingFor: ['Women', 'Non-binary'],
  minAge: 25,
  maxAge: 35,
  bio: 'Software engineer who loves hiking, photography, and trying new restaurants.',
  interests: ['Hiking', 'Photography', 'Cooking', 'Travel', 'Technology']
})

// Settings
const settings = ref({
  notifications: {
    matches: true,
    messages: true,
    reminders: true,
    marketing: false
  },
  privacy: {
    showActivity: true,
    showAge: true,
    profileVisibility: 'all' // 'all', 'matches_only', 'nobody'
  },
  preferences: {
    autoSchedule: false,
    maxDistance: 25, // miles
    theme: 'light' // 'light', 'dark', 'system'
  }
})

// Active settings tab
const activeTab = ref('account') // 'account', 'privacy', 'notifications', 'preferences'

// Form states
const isEditing = ref(false)
const isSaving = ref(false)
const showConfirmLogout = ref(false)
const showDeleteAccount = ref(false)

function setActiveTab(tab) {
  activeTab.value = tab
}

function toggleEdit() {
  isEditing.value = !isEditing.value
}

function saveProfile() {
  isSaving.value = true
  // Simulate saving to API
  setTimeout(() => {
    isSaving.value = false
    isEditing.value = false
  }, 1000)
}

function cancelEdit() {
  isEditing.value = false
  // In a real app, we would reset the form to original values
}

function showLogoutConfirmation() {
  showConfirmLogout.value = true
}

function hideLogoutConfirmation() {
  showConfirmLogout.value = false
}

function logout() {
  // Simulate logout
  setTimeout(() => {
    router.push('/')
  }, 500)
}

function showDeleteAccountConfirmation() {
  showDeleteAccount.value = true
}

function hideDeleteAccountConfirmation() {
  showDeleteAccount.value = false
}

function deleteAccount() {
  // Simulate account deletion
  setTimeout(() => {
    router.push('/')
  }, 1000)
}
</script>

<template>
  <div class="settings-view">
    <header class="header">
      <h1 v-voix="'Settings page title'">Settings</h1>
    </header>
    
    <main class="settings-content">
      <!-- Settings Tabs -->
      <div class="settings-tabs">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'account' }" 
          @click="setActiveTab('account')"
          v-voix="'Account tab'"
          hint="View and edit your account and profile information">
          Account
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'privacy' }" 
          @click="setActiveTab('privacy')"
          v-voix="'Privacy tab'"
          hint="Manage your privacy settings">
          Privacy
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'notifications' }" 
          @click="setActiveTab('notifications')"
          v-voix="'Notifications tab'"
          hint="Configure notification preferences">
          Notifications
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'preferences' }" 
          @click="setActiveTab('preferences')"
          v-voix="'Preferences tab'"
          hint="Set your dating preferences">
          Preferences
        </button>
      </div>
      
      <!-- Account Tab -->
      <div v-if="activeTab === 'account'" class="tab-content account-tab">
        <div class="section-header">
          <h2 v-voix="'Profile information heading'">Profile Information</h2>
          <button 
            v-if="!isEditing" 
            class="action-button" 
            @click="toggleEdit"
            v-voix="'Edit profile button'"
            hint="Click to edit your profile information">
            Edit
          </button>
        </div>
        
        <div class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name" v-voix="'Name label'">Name</label>
              <input 
                id="name" 
                type="text" 
                v-model="user.name" 
                :disabled="!isEditing"
                v-voix="'Name input'"
                hint="Your full name, visible to others" 
              />
            </div>
            
            <div class="form-group">
              <label for="email" v-voix="'Email label'">Email</label>
              <input 
                id="email" 
                type="email" 
                v-model="user.email" 
                :disabled="!isEditing"
                v-voix="'Email input'"
                hint="Your email address for account access and notifications" 
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="age" v-voix="'Age label'">Age</label>
              <input 
                id="age" 
                type="number" 
                v-model="user.age" 
                min="18" 
                max="100" 
                :disabled="!isEditing"
                v-voix="'Age input'"
                hint="Your age, visible to matches" 
              />
            </div>
            
            <div class="form-group">
              <label v-voix="'Gender label'">Gender</label>
              <select 
                v-model="user.gender" 
                :disabled="!isEditing"
                v-voix="'Gender select'"
                hint="Your gender identity">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label v-voix="'Looking for label'">Looking for (select all that apply)</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  value="Men" 
                  v-model="user.lookingFor" 
                  :disabled="!isEditing"
                  v-voix="'Looking for men checkbox'"
                  hint="Select if you want to match with men" 
                />
                <span>Men</span>
              </label>
              
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  value="Women" 
                  v-model="user.lookingFor" 
                  :disabled="!isEditing"
                  v-voix="'Looking for women checkbox'"
                  hint="Select if you want to match with women" 
                />
                <span>Women</span>
              </label>
              
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  value="Non-binary" 
                  v-model="user.lookingFor" 
                  :disabled="!isEditing"
                  v-voix="'Looking for non-binary checkbox'"
                  hint="Select if you want to match with non-binary people" 
                />
                <span>Non-binary</span>
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label v-voix="'Age range label'">Age Range Preference</label>
            <div class="age-range">
              <input 
                type="number" 
                v-model="user.minAge" 
                min="18" 
                max="100" 
                :disabled="!isEditing"
                v-voix="'Minimum age input'"
                hint="Minimum age you want to match with" 
              />
              <span>to</span>
              <input 
                type="number" 
                v-model="user.maxAge" 
                min="18" 
                max="100" 
                :disabled="!isEditing"
                v-voix="'Maximum age input'"
                hint="Maximum age you want to match with" 
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="bio" v-voix="'Bio label'">About Me</label>
            <textarea 
              id="bio" 
              v-model="user.bio" 
              rows="3" 
              :disabled="!isEditing"
              v-voix="'Bio textarea'"
              hint="Describe yourself for potential matches to read" 
            ></textarea>
          </div>
          
          <div v-if="isEditing" class="form-actions">
            <button 
              class="button secondary" 
              @click="cancelEdit"
              v-voix="'Cancel button'"
              hint="Cancel editing and discard changes">
              Cancel
            </button>
            <button 
              class="button primary" 
              @click="saveProfile" 
              :disabled="isSaving"
              v-voix="'Save profile button'"
              hint="Save your profile changes">
              <span v-if="isSaving">Saving...</span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </div>
        
        <div class="account-actions">
          <button 
            class="danger-button" 
            @click="showLogoutConfirmation"
            v-voix="'Log out button'"
            hint="Log out of your account">
            Log Out
          </button>
          
          <button 
            class="danger-button delete" 
            @click="showDeleteAccountConfirmation"
            v-voix="'Delete account button'"
            hint="Permanently delete your account">
            Delete Account
          </button>
        </div>
      </div>
      
      <!-- Privacy Tab -->
      <div v-else-if="activeTab === 'privacy'" class="tab-content privacy-tab">
        <h2 v-voix="'Privacy settings heading'">Privacy Settings</h2>
        
        <div class="setting-group">
          <div class="setting-item">
            <div class="setting-info">
              <h3 v-voix="'Show activity status heading'">Activity Status</h3>
              <p>Show when you were last active</p>
            </div>
            <label class="toggle">
              <input 
                type="checkbox" 
                v-model="settings.privacy.showActivity"
                v-voix="'Show activity status toggle'"
                hint="Toggle whether others can see when you were last active" 
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 v-voix="'Show age heading'">Show Age</h3>
              <p>Display your age on your profile</p>
            </div>
            <label class="toggle">
              <input 
                type="checkbox" 
                v-model="settings.privacy.showAge"
                v-voix="'Show age toggle'"
                hint="Toggle whether your age is visible to others" 
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 v-voix="'Profile visibility heading'">Profile Visibility</h3>
              <p>Control who can see your profile</p>
            </div>
            <select 
              v-model="settings.privacy.profileVisibility"
              v-voix="'Profile visibility select'"
              hint="Choose who can view your profile">
              <option value="all">Everyone</option>
              <option value="matches_only">Matches Only</option>
              <option value="nobody">Nobody (Incognito)</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Notifications Tab -->
      <div v-else-if="activeTab === 'notifications'" class="tab-content notifications-tab">
        <h2 v-voix="'Notification settings heading'">Notification Settings</h2>
        
        <div class="setting-group">
          <div class="setting-item">
            <div class="setting-info">
              <h3 v-voix="'Match notifications heading'">Match Notifications</h3>
              <p>Get notified when you match with someone</p>
            </div>
            <label class="toggle">
              <input 
                type="checkbox" 
                v-model="settings.notifications.matches"
                v-voix="'Match notifications toggle'"
                hint="Toggle notifications for new matches" 
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 v-voix="'Message notifications heading'">Message Notifications</h3>
              <p>Get notified when you receive new messages</p>
            </div>
            <label class="toggle">
              <input 
                type="checkbox" 
                v-model="settings.notifications.messages"
                v-voix="'Message notifications toggle'"
                hint="Toggle notifications for new messages" 
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 v-voix="'Date reminders heading'">Date Reminders</h3>
              <p>Get reminded before upcoming speed dates</p>
            </div>
            <label class="toggle">
              <input 
                type="checkbox" 
                v-model="settings.notifications.reminders"
                v-voix="'Date reminders toggle'"
                hint="Toggle reminders for upcoming speed dates" 
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 v-voix="'Marketing emails heading'">Marketing Emails</h3>
              <p>Receive news and special offers</p>
            </div>
            <label class="toggle">
              <input 
                type="checkbox" 
                v-model="settings.notifications.marketing"
                v-voix="'Marketing emails toggle'"
                hint="Toggle marketing and promotional emails" 
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Preferences Tab -->
      <div v-else-if="activeTab === 'preferences'" class="tab-content preferences-tab">
        <h2 v-voix="'App preferences heading'">App Preferences</h2>
        
        <div class="setting-group">
          <div class="setting-item">
            <div class="setting-info">
              <h3 v-voix="'Auto scheduling heading'">Auto Scheduling</h3>
              <p>Automatically schedule dates based on your calendar availability</p>
            </div>
            <label class="toggle">
              <input 
                type="checkbox" 
                v-model="settings.preferences.autoSchedule"
                v-voix="'Auto scheduling toggle'"
                hint="Toggle automatic scheduling of dates based on your calendar" 
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 v-voix="'Maximum distance heading'">Maximum Distance</h3>
              <p>Maximum distance for potential matches (miles)</p>
            </div>
            <div class="range-input">
              <input 
                type="range" 
                v-model="settings.preferences.maxDistance" 
                min="5" 
                max="100" 
                step="5"
                v-voix="'Maximum distance slider'"
                hint="Set the maximum distance for potential matches" 
              />
              <span class="range-value">{{ settings.preferences.maxDistance }} miles</span>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 v-voix="'App theme heading'">App Theme</h3>
              <p>Choose your preferred app theme</p>
            </div>
            <select 
              v-model="settings.preferences.theme"
              v-voix="'Theme select'"
              hint="Choose your preferred visual theme for the app">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Logout Confirmation Dialog -->
    <div v-if="showConfirmLogout" class="dialog-overlay">
      <div 
        class="dialog-box"
        v-voix="'Logout confirmation dialog'"
        hint="Confirm if you want to log out of your account">
        <h3>Log Out?</h3>
        <p>Are you sure you want to log out of your account?</p>
        <div class="dialog-buttons">
          <button 
            class="dialog-button secondary" 
            @click="hideLogoutConfirmation"
            v-voix="'Cancel logout'"
            hint="Cancel logging out">
            Cancel
          </button>
          <button 
            class="dialog-button primary" 
            @click="logout"
            v-voix="'Confirm logout'"
            hint="Confirm logging out of your account">
            Log Out
          </button>
        </div>
      </div>
    </div>
    
    <!-- Delete Account Confirmation Dialog -->
    <div v-if="showDeleteAccount" class="dialog-overlay">
      <div 
        class="dialog-box"
        v-voix="'Delete account confirmation dialog'"
        hint="Confirm if you want to permanently delete your account">
        <h3>Delete Account?</h3>
        <p>This action cannot be undone. All your data will be permanently removed.</p>
        <div class="dialog-buttons">
          <button 
            class="dialog-button secondary" 
            @click="hideDeleteAccountConfirmation"
            v-voix="'Cancel account deletion'"
            hint="Cancel deleting your account">
            Cancel
          </button>
          <button 
            class="dialog-button danger" 
            @click="deleteAccount"
            v-voix="'Confirm account deletion'"
            hint="Permanently delete your account">
            Delete
          </button>
        </div>
      </div>
    </div>
    
    <NavBar />
  </div>
</template>

<style scoped>
.settings-view {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 70px;
}

.header {
  background-color: white;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
  text-align: center;
}

.settings-content {
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.settings-tabs {
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.tab-button {
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  font-size: 0.95rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button.active {
  color: #ff4b7d;
  box-shadow: inset 0 -2px 0 #ff4b7d;
  background-color: #fff9fa;
}

.tab-button:hover:not(.active) {
  background-color: #f8f8f8;
}

.tab-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

/* Section headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 1.5rem 0;
}

.section-header h2 {
  margin-bottom: 0;
}

/* Action buttons */
.action-button {
  background-color: #f0f0f0;
  border: none;
  color: #555;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #e5e5e5;
}

/* Form styles */
.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #555;
}

input[type="text"],
input[type="email"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #ff4b7d;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label span {
  margin-left: 0.5rem;
}

.age-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.age-range input {
  width: 70px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.button {
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.button.primary {
  background-color: #ff4b7d;
  color: white;
}

.button.primary:hover {
  background-color: #ff3367;
}

.button.secondary {
  background-color: #f0f0f0;
  color: #555;
}

.button.secondary:hover {
  background-color: #e6e6e6;
}

/* Account actions */
.account-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.danger-button {
  background-color: #f0f0f0;
  color: #888;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.danger-button:hover {
  background-color: #e6e6e6;
  color: #666;
}

.danger-button.delete {
  color: #e74c3c;
}

.danger-button.delete:hover {
  background-color: #ffefef;
}

/* Setting groups */
.setting-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.setting-info {
  flex: 1;
}

.setting-info h3 {
  font-size: 1.05rem;
  color: #333;
  margin: 0 0 0.3rem 0;
}

.setting-info p {
  font-size: 0.9rem;
  color: #777;
  margin: 0;
}

/* Toggle switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.toggle input {
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
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #ff4b7d;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* Range slider */
.range-input {
  display: flex;
  align-items: center;
  width: 180px;
}

input[type="range"] {
  flex: 1;
  height: 5px;
  border-radius: 5px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #ff4b7d;
  cursor: pointer;
}

.range-value {
  margin-left: 1rem;
  font-size: 0.9rem;
  color: #666;
  width: 70px;
}

/* Dialogs */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-box {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  width: 90%;
  max-width: 350px;
  text-align: center;
}

.dialog-box h3 {
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 1rem;
}

.dialog-box p {
  color: #666;
  margin-bottom: 1.5rem;
}

.dialog-buttons {
  display: flex;
  justify-content: space-between;
}

.dialog-button {
  flex: 1;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.dialog-button.primary {
  background-color: #ff4b7d;
  color: white;
  margin-left: 0.5rem;
}

.dialog-button.secondary {
  background-color: #f0f0f0;
  color: #555;
  margin-right: 0.5rem;
}

.dialog-button.danger {
  background-color: #e74c3c;
  color: white;
  margin-left: 0.5rem;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .settings-tabs {
    flex-wrap: wrap;
  }
  
  .tab-button {
    flex-basis: 50%;
  }
}
</style>