<script setup>
import { ref, onMounted } from 'vue'

// User profile data
const profile = ref({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  height: '',
  weight: '',
  allergies: '',
  medications: '',
  conditions: ''
})

// Save status
const isSaving = ref(false)
const saveSuccess = ref(false)
const saveError = ref(false)

// Form validation
const errors = ref({})

onMounted(() => {
  // Load profile data from localStorage if available
  const savedProfile = localStorage.getItem('userProfile')
  if (savedProfile) {
    profile.value = JSON.parse(savedProfile)
  }
})

const validateForm = () => {
  const newErrors = {}
  
  if (!profile.value.firstName.trim()) {
    newErrors.firstName = 'First name is required'
  }
  
  if (!profile.value.lastName.trim()) {
    newErrors.lastName = 'Last name is required'
  }
  
  if (!profile.value.dateOfBirth) {
    newErrors.dateOfBirth = 'Date of birth is required'
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const saveProfile = () => {
  if (!validateForm()) {
    return
  }
  
  isSaving.value = true
  saveSuccess.value = false
  saveError.value = false
  
  // Simulate API call with a delay
  setTimeout(() => {
    try {
      // Store in localStorage
      localStorage.setItem('userProfile', JSON.stringify(profile.value))
      saveSuccess.value = true
      isSaving.value = false
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        saveSuccess.value = false
      }, 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
      saveError.value = true
      isSaving.value = false
    }
  }, 1000)
}
</script>

<template>
  <div class="profile-view">
    <div class="page-header">
      <h1 v-voix="'profile-title'">My Health Profile</h1>
      <p class="subtitle">Manage your personal health information</p>
    </div>
    
    <div class="form-container">
      <form @submit.prevent="saveProfile">
        <div class="form-section">
          <h2 v-voix="'personal-info-heading'">Personal Information</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" v-voix="'first-name-label'">First Name</label>
              <input
                id="firstName"
                v-model="profile.firstName"
                type="text"
                :class="{ error: errors.firstName }"
                v-voix="'first-name-input'"
                hint="Enter your first name"
              />
              <div v-if="errors.firstName" class="error-message">{{ errors.firstName }}</div>
            </div>
            
            <div class="form-group">
              <label for="lastName" v-voix="'last-name-label'">Last Name</label>
              <input
                id="lastName"
                v-model="profile.lastName"
                type="text"
                :class="{ error: errors.lastName }"
                v-voix="'last-name-input'"
                hint="Enter your last name"
              />
              <div v-if="errors.lastName" class="error-message">{{ errors.lastName }}</div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="dateOfBirth" v-voix="'dob-label'">Date of Birth</label>
              <input
                id="dateOfBirth"
                v-model="profile.dateOfBirth"
                type="date"
                :class="{ error: errors.dateOfBirth }"
                v-voix="'dob-input'"
                hint="Enter your date of birth"
              />
              <div v-if="errors.dateOfBirth" class="error-message">{{ errors.dateOfBirth }}</div>
            </div>
            
            <div class="form-group">
              <label for="gender" v-voix="'gender-label'">Gender</label>
              <select
                id="gender"
                v-model="profile.gender"
                v-voix="'gender-select'"
                hint="Select your gender"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="height" v-voix="'height-label'">Height (cm)</label>
              <input
                id="height"
                v-model="profile.height"
                type="number"
                min="0"
                v-voix="'height-input'"
                hint="Enter your height in centimeters"
              />
            </div>
            
            <div class="form-group">
              <label for="weight" v-voix="'weight-label'">Weight (kg)</label>
              <input
                id="weight"
                v-model="profile.weight"
                type="number"
                min="0"
                v-voix="'weight-input'"
                hint="Enter your weight in kilograms"
              />
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h2 v-voix="'health-info-heading'">Health Information</h2>
          
          <div class="form-group">
            <label for="allergies" v-voix="'allergies-label'">Allergies</label>
            <textarea
              id="allergies"
              v-model="profile.allergies"
              rows="3"
              placeholder="List any allergies you have..."
              v-voix="'allergies-input'"
              hint="Enter allergies separated by commas"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="medications" v-voix="'medications-label'">Current Medications</label>
            <textarea
              id="medications"
              v-model="profile.medications"
              rows="3"
              placeholder="List any medications you are currently taking..."
              v-voix="'medications-input'"
              hint="Enter current medications with dosages"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="conditions" v-voix="'conditions-label'">Medical Conditions</label>
            <textarea
              id="conditions"
              v-model="profile.conditions"
              rows="3"
              placeholder="List any ongoing medical conditions..."
              v-voix="'conditions-input'"
              hint="Enter existing medical conditions"
            ></textarea>
          </div>
        </div>
        
        <div class="privacy-notice">
          <h3 v-voix="'privacy-heading'">Privacy Notice</h3>
          <p>
            Your health information is stored locally on your device and is not transmitted to any server.
            MediCheck uses this information to provide more accurate symptom assessments.
          </p>
        </div>
        
        <div class="form-actions">
          <div v-if="saveSuccess" class="success-message">
            Profile saved successfully!
          </div>
          <div v-if="saveError" class="error-message">
            Error saving profile. Please try again.
          </div>
          <button
            type="submit"
            class="save-button"
            :disabled="isSaving"
            v-voix="'save-profile-button'"
          >
            {{ isSaving ? 'Saving...' : 'Save Profile' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.profile-view {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #2563eb;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #4b5563;
}

.form-container {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-section h2 {
  color: #1e40af;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.privacy-notice {
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.privacy-notice h3 {
  color: #1e40af;
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.privacy-notice p {
  color: #4b5563;
  margin: 0;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-message {
  color: #047857;
  background-color: #d1fae5;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  width: 100%;
  text-align: center;
}

.save-button {
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 200px;
}

.save-button:hover {
  background-color: #1d4ed8;
}

.save-button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .form-container {
    padding: 1.5rem;
  }
}
</style>