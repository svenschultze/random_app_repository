<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userProfileStore } from '../store'

const router = useRouter()
const username = ref('')
const avatarPreview = ref(null)
const isSubmitting = ref(false)
const error = ref('')

// Handle avatar selection
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

// Create random avatar based on username
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

// Submit the form
const submitProfile = () => {
  if (!username.value) {
    error.value = 'Please enter a username'
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Create profile object
    const profile = {
      name: username.value,
      avatar: avatarPreview.value,
      createdAt: new Date().toISOString()
    }
    
    // Save to store and localStorage
    userProfileStore.getState().setProfile(profile)
    
    // Redirect to dashboard
    router.push('/dashboard')
  } catch (err) {
    error.value = 'Error creating profile: ' + err.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="onboarding-container">
    <div class="onboarding-card">
      <h1 class="title" v-voix="'onboarding-title'">Create Your Profile</h1>
      <p class="subtitle">This information will be shared with your contacts when you connect.</p>
      
      <form @submit.prevent="submitProfile" class="profile-form">
        <div class="avatar-section">
          <div 
            class="avatar-preview"
            :class="{ 'has-avatar': avatarPreview }"
          >
            <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar preview" />
            <span v-else class="material-symbols-outlined">person</span>
          </div>
          
          <div class="avatar-actions">
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
              Upload Image
            </label>
            
            <button 
              type="button" 
              class="btn-secondary generate-btn" 
              @click="generateAvatar"
              v-voix="'generate-avatar-button'"
              hint="Generate a random avatar based on your username"
            >
              Generate
            </button>
          </div>
        </div>
        
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
            hint="Enter your display name that others will see"
          />
        </div>
        
        <div v-if="error" class="error-message" v-voix="'profile-error-message'">
          {{ error }}
        </div>
        
        <button 
          type="submit" 
          class="btn-primary submit-btn" 
          :disabled="isSubmitting"
          v-voix="'create-profile-button'"
          hint="Save your profile and continue"
        >
          <span v-if="isSubmitting">Creating...</span>
          <span v-else>Create Profile</span>
        </button>
      </form>
      
      <div class="privacy-notice">
        <p>
          Your profile is stored locally on your device. 
          It will only be shared with the contacts you explicitly connect with.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%);
}

.onboarding-card {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 2rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--light-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid var(--border-color);
}

.avatar-preview.has-avatar {
  border-color: var(--primary-color);
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
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-primary);
}

.error-message {
  color: var(--error-color);
  font-size: 0.875rem;
  padding: 0.5rem 0;
}

.submit-btn {
  margin-top: 1rem;
  padding: 0.75rem;
}

.privacy-notice {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
}
</style>