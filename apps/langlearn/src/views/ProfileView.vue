<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useLessonsStore } from '../stores/lessons'

const userStore = useUserStore()
const lessonsStore = useLessonsStore()

// User profile data
const profile = computed(() => userStore.profile)
const levelProgress = computed(() => userStore.levelProgress)
const xpForNextLevel = computed(() => userStore.xpForNextLevel)

// Get completed lessons count
const completedLessonsCount = computed(() => lessonsStore.completedLessons.length)

// Get the language name
const language = computed(() => {
  const lang = lessonsStore.languages.find(l => l.id === profile.value.language)
  return lang ? lang.name : 'Unknown'
})

// Get the goal name
const goal = computed(() => {
  const g = lessonsStore.learningGoals.find(g => g.id === profile.value.goalType)
  return g ? g.name : 'General Learning'
})

// Form data for profile editing
const isEditing = ref(false)
const editData = ref({
  name: '',
  email: '',
})

// Start editing profile
const startEditing = () => {
  editData.value.name = profile.value.name
  editData.value.email = profile.value.email
  isEditing.value = true
}

// Save profile changes
const saveChanges = () => {
  userStore.login({
    ...profile.value,
    name: editData.value.name,
    email: editData.value.email
  })
  isEditing.value = false
}

// Cancel editing
const cancelEditing = () => {
  isEditing.value = false
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
</script>

<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1 class="page-title">Profile</h1>
      <button 
        v-if="!isEditing" 
        class="btn btn-primary" 
        @click="startEditing"
        v-voix="'edit-profile-button'"
        hint="Edit your profile information"
      >
        Edit Profile
      </button>
      
      <div v-else class="action-buttons">
        <button 
          class="btn btn-primary" 
          @click="saveChanges"
          v-voix="'save-profile-button'"
          hint="Save your profile changes"
        >
          Save
        </button>
        <button 
          class="btn btn-secondary" 
          @click="cancelEditing"
          v-voix="'cancel-edit-button'"
          hint="Cancel editing your profile"
        >
          Cancel
        </button>
      </div>
    </div>
    
    <div class="profile-content">
      <div class="profile-card personal-info">
        <h2 class="card-title">Personal Information</h2>
        
        <div v-if="!isEditing" class="info-grid">
          <div class="info-item">
            <span class="info-label">Name</span>
            <span class="info-value" v-voix="'profile-name'" :hint="`Your name: ${profile.name}`">{{ profile.name }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Email</span>
            <span class="info-value" v-voix="'profile-email'" :hint="`Your email: ${profile.email}`">{{ profile.email }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Joined</span>
            <span class="info-value" v-voix="'profile-joined-date'" :hint="`You joined on: ${formatDate(profile.createdAt)}`">{{ formatDate(profile.createdAt) }}</span>
          </div>
        </div>
        
        <div v-else class="edit-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input 
              id="name" 
              v-model="editData.name" 
              type="text" 
              class="form-control"
              v-voix="'edit-name-input'"
              hint="Edit your name"
            />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              v-model="editData.email" 
              type="email" 
              class="form-control"
              v-voix="'edit-email-input'"
              hint="Edit your email address"
            />
          </div>
        </div>
      </div>
      
      <div class="profile-card learning-stats">
        <h2 class="card-title">Learning Statistics</h2>
        
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value" v-voix="'profile-level'" hint="Your current level">{{ profile.level }}</span>
            <span class="stat-label">Level</span>
          </div>
          
          <div class="stat-card">
            <span class="stat-value" v-voix="'profile-xp'" hint="Your total experience points">{{ profile.xp }}</span>
            <span class="stat-label">Total XP</span>
          </div>
          
          <div class="stat-card">
            <span class="stat-value" v-voix="'profile-streak'" hint="Your current streak days">{{ profile.streak }}</span>
            <span class="stat-label">Day Streak</span>
          </div>
          
          <div class="stat-card">
            <span class="stat-value" v-voix="'profile-lessons-completed'" hint="Number of lessons you've completed">{{ completedLessonsCount }}</span>
            <span class="stat-label">Lessons Completed</span>
          </div>
        </div>
        
        <div class="level-progress">
          <div class="progress-info">
            <span>Level {{ profile.level }}</span>
            <span>Level {{ profile.level + 1 }}</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: `${levelProgress}%` }"></div>
          </div>
          <div class="progress-text" v-voix="'profile-level-progress'" :hint="`You need ${xpForNextLevel - profile.xp} more XP to reach level ${profile.level + 1}`">
            {{ xpForNextLevel - profile.xp }} XP needed for next level
          </div>
        </div>
      </div>
      
      <div class="profile-card learning-preferences">
        <h2 class="card-title">Learning Preferences</h2>
        
        <div class="preferences-grid">
          <div class="preference-item">
            <span class="preference-label">Learning</span>
            <span class="preference-value" v-voix="'profile-language'" :hint="`You are learning ${language}`">{{ language }}</span>
          </div>
          
          <div class="preference-item">
            <span class="preference-label">Native Language</span>
            <span class="preference-value" v-voix="'profile-native-language'" :hint="`Your native language is ${profile.nativeLanguage}`">{{ profile.nativeLanguage }}</span>
          </div>
          
          <div class="preference-item">
            <span class="preference-label">Learning Goal</span>
            <span class="preference-value" v-voix="'profile-goal'" :hint="`Your learning goal is ${goal}`">{{ goal }}</span>
          </div>
        </div>
      </div>
      
      <div class="profile-card account-settings">
        <h2 class="card-title">Account Settings</h2>
        
        <div class="settings-list">
          <button 
            class="settings-button"
            v-voix="'change-password-button'"
            hint="Change your password"
          >
            Change Password
          </button>
          
          <button 
            class="settings-button"
            v-voix="'notification-settings-button'"
            hint="Manage notification settings"
          >
            Notification Settings
          </button>
          
          <button 
            class="settings-button logout"
            v-voix="'logout-button'"
            hint="Log out of your account"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-dark);
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.profile-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
}

.profile-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

/* Personal information */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.875rem;
  color: var(--text-light);
}

.info-value {
  font-size: 1rem;
  font-weight: 500;
}

/* Edit form */
.edit-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  color: var(--text-light);
}

.form-control {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
}

/* Learning statistics */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  text-align: center;
  padding: 1rem;
  background-color: var(--bg-color);
  border-radius: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-light);
}

.level-progress {
  margin-top: 1.5rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.progress-bar-container {
  height: 0.5rem;
  background-color: var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-bar {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 1rem;
}

.progress-text {
  font-size: 0.875rem;
  color: var(--text-light);
  text-align: center;
}

/* Learning preferences */
.preferences-grid {
  display: grid;
  gap: 1.25rem;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.preference-item:last-child {
  border-bottom: none;
}

.preference-label {
  font-size: 0.875rem;
  color: var(--text-light);
}

.preference-value {
  font-weight: 500;
  color: var(--primary-color);
}

/* Account settings */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-button {
  text-align: left;
  padding: 0.75rem 1rem;
  background-color: var(--bg-color);
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.settings-button:hover {
  background-color: var(--border-color);
}

.settings-button.logout {
  color: #ef4444;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-secondary {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
  
  .info-grid, .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .info-grid, .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
}
</style>