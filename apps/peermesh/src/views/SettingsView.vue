<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userProfileStore, chatStore } from '../store'
import p2pService from '../services/p2pService'

const router = useRouter()
const profile = ref(null)
const avatarPreview = ref(null)
const username = ref('')
const isEditing = ref(false)
const isSaving = ref(false)
const success = ref('')
const error = ref('')
const showClearDataConfirm = ref(false)

onMounted(() => {
  // Get profile from store
  profile.value = userProfileStore.getState().profile || {}
  username.value = profile.value.name || ''
  avatarPreview.value = profile.value.avatar || null
})

// Start editing profile
const editProfile = () => {
  isEditing.value = true
  error.value = ''
  success.value = ''
}

// Handle avatar upload
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  
  if (file) {
    if (file.size > 1024 * 1024) {
      error.value = 'Avatar image must be less than 1MB'
      return
    }
    
    const reader = new FileReader()
    
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
    }
    
    reader.readAsDataURL(file)
  }
}

// Generate avatar from username
const generateAvatar = () => {
  const colors = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  
  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 200
  
  const ctx = canvas.getContext('2d')
  
  // Background
  ctx.fillStyle = randomColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Text
  ctx.fillStyle = 'white'
  ctx.font = 'bold 100px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  const name = username.value || 'User'
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
  
  ctx.fillText(initials, canvas.width / 2, canvas.height / 2)
  
  // Set avatar preview
  avatarPreview.value = canvas.toDataURL('image/png')
}

// Save profile changes
const saveProfile = () => {
  if (!username.value) {
    error.value = 'Username is required'
    return
  }
  
  isSaving.value = true
  error.value = ''
  
  try {
    // Update profile in store
    userProfileStore.getState().updateProfile({
      name: username.value,
      avatar: avatarPreview.value,
      updatedAt: new Date().toISOString()
    })
    
    // Show success message
    success.value = 'Profile updated successfully'
    isEditing.value = false
    
    // Update profile reference
    profile.value = userProfileStore.getState().profile
  } catch (err) {
    error.value = 'Error updating profile: ' + err.message
  } finally {
    isSaving.value = false
  }
}

// Cancel editing
const cancelEdit = () => {
  username.value = profile.value.name || ''
  avatarPreview.value = profile.value.avatar || null
  isEditing.value = false
  error.value = ''
}

// Disconnect from all peers
const disconnectAll = () => {
  try {
    p2pService.disconnectAll()
    success.value = 'Disconnected from all peers'
  } catch (err) {
    error.value = 'Error disconnecting: ' + err.message
  }
}

// Confirm clear data action
const confirmClearData = () => {
  showClearDataConfirm.value = true
}

// Cancel clear data action
const cancelClearData = () => {
  showClearDataConfirm.value = false
}

// Clear all app data
const clearAllData = () => {
  try {
    // Clear chats
    chatStore.setState({ chats: [], activeChat: null })
    localStorage.removeItem('chats')
    
    // Disconnect from all peers
    p2pService.disconnectAll()
    
    // Clear profile
    userProfileStore.getState().clearProfile()
    
    // Redirect to welcome page
    router.push('/')
  } catch (err) {
    error.value = 'Error clearing data: ' + err.message
    showClearDataConfirm.value = false
  }
}

// Go back to dashboard
const goBack = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="settings-view">
    <header class="settings-header">
      <button 
        class="back-button" 
        @click="goBack"
        v-voix="'back-to-dashboard-button'"
        hint="Return to the dashboard"
      >
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      
      <h1 class="title" v-voix="'settings-title'">Settings</h1>
    </header>
    
    <div class="settings-container">
      <div v-if="error" class="alert error" v-voix="'settings-error-message'">
        {{ error }}
      </div>
      
      <div v-if="success" class="alert success" v-voix="'settings-success-message'">
        {{ success }}
      </div>
      
      <section class="profile-section card">
        <div class="section-header">
          <h2 class="section-title" v-voix="'profile-section-heading'">Profile</h2>
          
          <button 
            v-if="!isEditing" 
            class="btn-secondary" 
            @click="editProfile"
            v-voix="'edit-profile-button'"
            hint="Edit your profile information"
          >
            Edit
          </button>
        </div>
        
        <div class="profile-content">
          <div class="avatar-section">
            <div 
              class="avatar-preview"
              :class="{ 'has-avatar': avatarPreview }"
            >
              <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar preview" />
              <span v-else class="material-symbols-outlined">person</span>
            </div>
            
            <div v-if="isEditing" class="avatar-actions">
              <label 
                class="btn-secondary upload-btn"
                v-voix="'upload-avatar-button'"
                hint="Upload a profile picture"
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="handleAvatarChange" 
                  hidden 
                />
                Upload
              </label>
              
              <button 
                class="btn-secondary generate-btn" 
                @click="generateAvatar"
                v-voix="'generate-avatar-button'"
                hint="Generate a random avatar based on your username"
              >
                Generate
              </button>
            </div>
          </div>
          
          <div class="profile-details">
            <div v-if="!isEditing" class="profile-info">
              <h3 class="username">{{ profile?.name || 'User' }}</h3>
              <p class="profile-id">ID: {{ p2pService?.localId || 'Not available' }}</p>
            </div>
            
            <form v-else @submit.prevent="saveProfile" class="edit-form">
              <div class="form-group">
                <label 
                  for="username"
                  v-voix="'username-label'"
                >
                  Username
                </label>
                <input 
                  id="username" 
                  v-model="username" 
                  type="text" 
                  placeholder="Enter your username" 
                  required
                  v-voix="'username-input'"
                  hint="Enter your display name"
                />
              </div>
              
              <div class="form-actions">
                <button 
                  type="button" 
                  class="btn-secondary" 
                  @click="cancelEdit"
                  v-voix="'cancel-edit-button'"
                  hint="Cancel editing and discard changes"
                >
                  Cancel
                </button>
                
                <button 
                  type="submit" 
                  class="btn-primary"
                  :disabled="isSaving"
                  v-voix="'save-profile-button'"
                  hint="Save your profile changes"
                >
                  {{ isSaving ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      <section class="connections-section card">
        <h2 class="section-title" v-voix="'connections-section-heading'">Connections</h2>
        
        <div class="connection-actions">
          <button 
            class="btn-secondary" 
            @click="disconnectAll"
            v-voix="'disconnect-all-button'"
            hint="Disconnect from all current peers"
          >
            <span class="material-symbols-outlined">close</span>
            <span>Disconnect All</span>
          </button>
          
          <button 
            class="btn-secondary" 
            @click="router.push('/pairing')"
            v-voix="'new-connection-button'"
            hint="Create a new connection"
          >
            <span class="material-symbols-outlined">add</span>
            <span>New Connection</span>
          </button>
        </div>
      </section>
      
      <section class="danger-section card">
        <h2 class="section-title" v-voix="'danger-zone-heading'">Danger Zone</h2>
        
        <p class="warning-text">
          These actions are irreversible and will delete your data.
        </p>
        
        <button 
          class="btn-danger" 
          @click="confirmClearData"
          v-voix="'clear-data-button'"
          hint="Delete all your data and start fresh"
        >
          <span class="material-symbols-outlined">delete_forever</span>
          <span>Clear All Data</span>
        </button>
        
        <div v-if="showClearDataConfirm" class="confirm-dialog">
          <div class="confirm-content">
            <h3 class="confirm-title" v-voix="'confirm-deletion-heading'">Are you sure?</h3>
            
            <p class="confirm-text">
              This will delete all your profile data, chat history, and connections.
              This action cannot be undone.
            </p>
            
            <div class="confirm-actions">
              <button 
                class="btn-secondary" 
                @click="cancelClearData"
                v-voix="'cancel-deletion-button'"
                hint="Cancel deletion"
              >
                Cancel
              </button>
              
              <button 
                class="btn-danger" 
                @click="clearAllData"
                v-voix="'confirm-deletion-button'"
                hint="Permanently delete all data"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <section class="about-section card">
        <h2 class="section-title" v-voix="'about-section-heading'">About PeerMesh Chat</h2>
        
        <p>PeerMesh Chat is a demonstration of peer-to-peer web technologies.</p>
        <p>Version: 1.0.0</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  padding: 1rem;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  background-color: var(--light-bg);
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.settings-container {
  max-width: 800px;
  margin: 0 auto;
}

.alert {
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
}

.error {
  background-color: #fee2e2;
  color: #b91c1c;
}

.success {
  background-color: #d1fae5;
  color: #047857;
}

.card {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--light-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-preview .material-symbols-outlined {
  font-size: 3rem;
  color: var(--text-secondary);
}

.avatar-actions {
  display: flex;
  gap: 0.5rem;
}

.profile-details {
  width: 100%;
  text-align: center;
}

.username {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.profile-id {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  font-family: monospace;
}

.edit-form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.connection-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.warning-text {
  color: #b91c1c;
  margin-bottom: 1rem;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.confirm-content {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
}

.confirm-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

.confirm-text {
  margin-bottom: 1.5rem;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.about-section p {
  margin: 0.5rem 0;
  color: var(--text-secondary);
}

@media (min-width: 768px) {
  .settings-view {
    padding: 2rem;
  }
  
  .profile-content {
    flex-direction: row;
    align-items: flex-start;
  }
  
  .avatar-section {
    margin-right: 2rem;
    margin-bottom: 0;
  }
  
  .profile-details {
    text-align: left;
    flex: 1;
  }
}
</style>