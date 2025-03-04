<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'

const authStore = useAuthStore()
const toast = useToast()

// States
const loading = ref(true)
const saving = ref(false)
const activeTab = ref(0)

// Form data
const profileForm = reactive({
  displayName: '',
  email: '',
  phone: '',
  notificationPreferences: {
    email: true,
    push: true,
    sms: false
  }
})

// Password change form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Errors
const profileErrors = reactive({
  displayName: '',
  email: '',
  phone: '',
  form: ''
})

const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  form: ''
})

// Initialize user data
function initializeUserData() {
  if (authStore.user) {
    profileForm.displayName = authStore.user.displayName || ''
    profileForm.email = authStore.user.email || ''
    profileForm.phone = authStore.user.phone || ''
    
    // Mock notification preferences
    profileForm.notificationPreferences = {
      email: true,
      push: true,
      sms: false
    }
  }
}

// Validate profile form
function validateProfileForm() {
  let isValid = true
  profileErrors.displayName = ''
  profileErrors.email = ''
  profileErrors.phone = ''
  profileErrors.form = ''
  
  if (!profileForm.displayName) {
    profileErrors.displayName = 'Name is required'
    isValid = false
  }
  
  if (!profileForm.email) {
    profileErrors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
    profileErrors.email = 'Email is invalid'
    isValid = false
  }
  
  // Phone validation is optional
  if (profileForm.phone && !/^\+?[0-9\s\-\(\)]{10,15}$/.test(profileForm.phone)) {
    profileErrors.phone = 'Phone number is invalid'
    isValid = false
  }
  
  return isValid
}

// Validate password form
function validatePasswordForm() {
  let isValid = true
  passwordErrors.currentPassword = ''
  passwordErrors.newPassword = ''
  passwordErrors.confirmPassword = ''
  passwordErrors.form = ''
  
  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = 'Current password is required'
    isValid = false
  }
  
  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = 'New password is required'
    isValid = false
  } else if (passwordForm.newPassword.length < 6) {
    passwordErrors.newPassword = 'Password must be at least 6 characters'
    isValid = false
  }
  
  if (!passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Please confirm your new password'
    isValid = false
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  
  return isValid
}

// Update profile
async function updateProfile() {
  if (!validateProfileForm()) return
  
  saving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update user in store (mock)
    // In a real app, this would update the user in Firebase
    const userUpdate = {
      ...authStore.user,
      displayName: profileForm.displayName,
      phone: profileForm.phone
    }
    
    // authStore.updateUser(userUpdate)
    
    toast.add({
      severity: 'success',
      summary: 'Profile Updated',
      detail: 'Your profile has been updated successfully',
      life: 3000
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    profileErrors.form = 'Failed to update profile. Please try again.'
    
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: profileErrors.form,
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

// Change password
async function changePassword() {
  if (!validatePasswordForm()) return
  
  saving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real app, this would update the user's password in Firebase
    // authStore.updatePassword(passwordForm.currentPassword, passwordForm.newPassword)
    
    // Reset form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    toast.add({
      severity: 'success',
      summary: 'Password Changed',
      detail: 'Your password has been changed successfully',
      life: 3000
    })
  } catch (error) {
    console.error('Error changing password:', error)
    passwordErrors.form = 'Failed to change password. Please try again.'
    
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: passwordErrors.form,
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

// Clear form errors on input
function clearProfileError(field) {
  profileErrors[field] = ''
  profileErrors.form = ''
}

function clearPasswordError(field) {
  passwordErrors[field] = ''
  passwordErrors.form = ''
}

// Sign out
async function handleSignOut() {
  try {
    await authStore.signOut()
    
    toast.add({
      severity: 'success',
      summary: 'Signed Out',
      detail: 'You have been successfully signed out',
      life: 3000
    })
  } catch (error) {
    console.error('Sign out error:', error)
    
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to sign out. Please try again.',
      life: 3000
    })
  }
}

// Delete account (confirmation required)
const showDeleteConfirmation = ref(false)

function confirmDeleteAccount() {
  showDeleteConfirmation.value = true
}

async function deleteAccount() {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real app, this would delete the user's account
    // authStore.deleteAccount()
    
    toast.add({
      severity: 'success',
      summary: 'Account Deleted',
      detail: 'Your account has been deleted successfully',
      life: 3000
    })
    
    showDeleteConfirmation.value = false
    
    // Sign out after account deletion
    await authStore.signOut()
  } catch (error) {
    console.error('Error deleting account:', error)
    
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete account. Please try again.',
      life: 3000
    })
  }
}

// Initialize component
onMounted(() => {
  initializeUserData()
  loading.value = false
})
</script>

<template>
  <div class="profile-view">
    <div class="profile-header">
      <h1>My Profile</h1>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p>Loading your profile...</p>
    </div>
    
    <div v-else>
      <!-- Profile tabs -->
      <TabView v-model:activeIndex="activeTab">
        <!-- Profile information -->
        <TabPanel header="Profile Information">
          <div class="profile-card">
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="p-field">
                <label for="displayName">Name</label>
                <InputText 
                  id="displayName" 
                  v-model="profileForm.displayName"
                  :class="{ 'p-invalid': profileErrors.displayName }"
                  @input="clearProfileError('displayName')"
                />
                <small class="p-error" v-if="profileErrors.displayName">{{ profileErrors.displayName }}</small>
              </div>
              
              <div class="p-field">
                <label for="email">Email</label>
                <InputText 
                  id="email" 
                  v-model="profileForm.email"
                  :class="{ 'p-invalid': profileErrors.email }"
                  @input="clearProfileError('email')"
                  :disabled="true"
                />
                <small class="p-error" v-if="profileErrors.email">{{ profileErrors.email }}</small>
                <small class="form-hint">Email cannot be changed</small>
              </div>
              
              <div class="p-field">
                <label for="phone">Phone Number</label>
                <InputText 
                  id="phone" 
                  v-model="profileForm.phone"
                  :class="{ 'p-invalid': profileErrors.phone }"
                  @input="clearProfileError('phone')"
                />
                <small class="p-error" v-if="profileErrors.phone">{{ profileErrors.phone }}</small>
              </div>
              
              <div v-if="profileErrors.form" class="form-error">
                <small class="p-error">{{ profileErrors.form }}</small>
              </div>
              
              <div class="form-actions">
                <Button 
                  type="submit" 
                  label="Save Changes" 
                  icon="pi pi-check" 
                  :loading="saving"
                />
              </div>
            </form>
          </div>
        </TabPanel>
        
        <!-- Notification preferences -->
        <TabPanel header="Notification Preferences">
          <div class="profile-card">
            <h2>Notification Preferences</h2>
            <p class="card-description">Choose how you want to receive notifications</p>
            
            <div class="preferences-list">
              <div class="preference-item">
                <div class="preference-info">
                  <h3>Email Notifications</h3>
                  <p>Receive notifications via email</p>
                </div>
                <InputSwitch v-model="profileForm.notificationPreferences.email" />
              </div>
              
              <div class="preference-item">
                <div class="preference-info">
                  <h3>Push Notifications</h3>
                  <p>Receive notifications in your browser</p>
                </div>
                <InputSwitch v-model="profileForm.notificationPreferences.push" />
              </div>
              
              <div class="preference-item">
                <div class="preference-info">
                  <h3>SMS Notifications</h3>
                  <p>Receive notifications via text message</p>
                </div>
                <InputSwitch v-model="profileForm.notificationPreferences.sms" />
              </div>
            </div>
            
            <div class="form-actions">
              <Button 
                label="Save Preferences" 
                icon="pi pi-check" 
                :loading="saving"
                @click="updateProfile"
              />
            </div>
          </div>
        </TabPanel>
        
        <!-- Password and security -->
        <TabPanel header="Password & Security">
          <div class="profile-card">
            <h2>Change Password</h2>
            <p class="card-description">Update your password for better security</p>
            
            <form @submit.prevent="changePassword" class="profile-form">
              <div class="p-field">
                <label for="currentPassword">Current Password</label>
                <Password 
                  id="currentPassword" 
                  v-model="passwordForm.currentPassword"
                  :feedback="false"
                  :toggleMask="true"
                  :class="{ 'p-invalid': passwordErrors.currentPassword }"
                  @input="clearPasswordError('currentPassword')"
                />
                <small class="p-error" v-if="passwordErrors.currentPassword">{{ passwordErrors.currentPassword }}</small>
              </div>
              
              <div class="p-field">
                <label for="newPassword">New Password</label>
                <Password 
                  id="newPassword" 
                  v-model="passwordForm.newPassword"
                  :toggleMask="true"
                  :class="{ 'p-invalid': passwordErrors.newPassword }"
                  @input="clearPasswordError('newPassword')"
                />
                <small class="p-error" v-if="passwordErrors.newPassword">{{ passwordErrors.newPassword }}</small>
              </div>
              
              <div class="p-field">
                <label for="confirmPassword">Confirm New Password</label>
                <Password 
                  id="confirmPassword" 
                  v-model="passwordForm.confirmPassword"
                  :feedback="false"
                  :toggleMask="true"
                  :class="{ 'p-invalid': passwordErrors.confirmPassword }"
                  @input="clearPasswordError('confirmPassword')"
                />
                <small class="p-error" v-if="passwordErrors.confirmPassword">{{ passwordErrors.confirmPassword }}</small>
              </div>
              
              <div v-if="passwordErrors.form" class="form-error">
                <small class="p-error">{{ passwordErrors.form }}</small>
              </div>
              
              <div class="form-actions">
                <Button 
                  type="submit" 
                  label="Change Password" 
                  icon="pi pi-lock" 
                  :loading="saving"
                />
              </div>
            </form>
          </div>
          
          <!-- Security actions -->
          <div class="profile-card mt-4">
            <h2>Account Security</h2>
            
            <div class="security-actions">
              <div class="security-action">
                <div class="action-info">
                  <h3>Sign Out</h3>
                  <p>Sign out from your account</p>
                </div>
                <Button 
                  label="Sign Out" 
                  icon="pi pi-sign-out" 
                  class="p-button-secondary"
                  @click="handleSignOut"
                />
              </div>
              
              <div class="security-action">
                <div class="action-info">
                  <h3>Delete Account</h3>
                  <p>Permanently delete your account and all your data</p>
                </div>
                <Button 
                  label="Delete Account" 
                  icon="pi pi-trash" 
                  class="p-button-danger"
                  @click="confirmDeleteAccount"
                />
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
    
    <!-- Delete account confirmation dialog -->
    <Dialog
      v-model:visible="showDeleteConfirmation"
      header="Delete Account"
      :modal="true"
      :closable="true"
      :style="{ width: '450px' }"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500); margin-right: 1rem;"></i>
        <div>
          <h3>Are you sure you want to delete your account?</h3>
          <p>This action cannot be undone. All your data will be permanently deleted, including your profile, favorites, and alerts.</p>
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="showDeleteConfirmation = false" />
        <Button label="Delete Account" icon="pi pi-trash" class="p-button-danger" @click="deleteAccount" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.profile-view {
  margin-bottom: 2rem;
}

.profile-header {
  margin-bottom: 2rem;
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-container i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

/* Profile card */
.profile-card {
  background-color: var(--surface-card);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.profile-card h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.card-description {
  color: var(--text-color-secondary);
  margin-bottom: 1.5rem;
}

/* Form styles */
.profile-form {
  max-width: 600px;
}

.p-field {
  margin-bottom: 1.5rem;
}

.p-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.p-field input {
  width: 100%;
}

.form-hint {
  display: block;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-error {
  margin-bottom: 1rem;
}

.form-actions {
  margin-top: 1.5rem;
}

/* Notification preferences */
.preferences-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.preference-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
}

.preference-info p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

/* Security actions */
.security-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.security-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.action-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
}

.action-info p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

/* Confirmation dialog */
.confirmation-content {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.confirmation-content h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.confirmation-content p {
  margin: 0;
  color: var(--text-color-secondary);
}

/* Spacing utilities */
.mt-4 {
  margin-top: 1.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .security-action {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .security-action button {
    width: 100%;
  }
}
</style>