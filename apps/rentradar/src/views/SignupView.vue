<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Form state
const formData = reactive({
  email: '',
  displayName: '',
  password: '',
  confirmPassword: '',
  role: 'tenant' // Default role
})

const loading = ref(false)
const errors = reactive({
  email: '',
  displayName: '',
  password: '',
  confirmPassword: '',
  form: ''
})

// Role options
const roleOptions = [
  { label: 'Tenant', value: 'tenant' },
  { label: 'Landlord', value: 'landlord' }
]

// Validation
function validateForm() {
  let isValid = true
  errors.email = ''
  errors.displayName = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.form = ''
  
  if (!formData.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email is invalid'
    isValid = false
  }
  
  if (!formData.displayName) {
    errors.displayName = 'Name is required'
    isValid = false
  }
  
  if (!formData.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }
  
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  
  return isValid
}

// Form submission
async function handleSubmit() {
  if (!validateForm()) return
  
  loading.value = true
  try {
    await authStore.signUp(
      formData.email, 
      formData.password, 
      formData.displayName, 
      formData.role
    )
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Your account has been created successfully',
      life: 3000
    })
    
    // Navigate to home page
    router.push('/')
  } catch (error) {
    console.error('Signup error:', error)
    errors.form = error.message || 'Failed to create account. Please try again.'
    
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errors.form,
      life: 5000
    })
  } finally {
    loading.value = false
  }
}

// Clear errors when form inputs change
function clearErrors(field) {
  errors[field] = ''
  errors.form = ''
}
</script>

<template>
  <div class="signup-container">
    <div class="signup-card">
      <div class="card-header">
        <h2>Create an Account</h2>
        <p>Join RentRadar and find your perfect home</p>
      </div>
      
      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <!-- Email field -->
          <div class="p-field">
            <label for="email">Email</label>
            <InputText 
              id="email"
              v-model="formData.email"
              type="email"
              :class="{ 'p-invalid': errors.email }"
              @input="clearErrors('email')"
            />
            <small class="p-error" v-if="errors.email">{{ errors.email }}</small>
          </div>
          
          <!-- Display name field -->
          <div class="p-field">
            <label for="displayName">Full Name</label>
            <InputText 
              id="displayName"
              v-model="formData.displayName"
              :class="{ 'p-invalid': errors.displayName }"
              @input="clearErrors('displayName')"
            />
            <small class="p-error" v-if="errors.displayName">{{ errors.displayName }}</small>
          </div>
          
          <!-- Password field -->
          <div class="p-field">
            <label for="password">Password</label>
            <Password 
              id="password"
              v-model="formData.password"
              :toggleMask="true"
              :class="{ 'p-invalid': errors.password }"
              @input="clearErrors('password')"
            />
            <small class="p-error" v-if="errors.password">{{ errors.password }}</small>
          </div>
          
          <!-- Confirm password field -->
          <div class="p-field">
            <label for="confirmPassword">Confirm Password</label>
            <Password 
              id="confirmPassword"
              v-model="formData.confirmPassword"
              :toggleMask="true"
              :feedback="false"
              :class="{ 'p-invalid': errors.confirmPassword }"
              @input="clearErrors('confirmPassword')"
            />
            <small class="p-error" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</small>
          </div>
          
          <!-- User role selection -->
          <div class="p-field">
            <label>I am a</label>
            <div class="role-options">
              <div v-for="option in roleOptions" :key="option.value" class="role-option">
                <RadioButton 
                  :id="option.value" 
                  name="role" 
                  :value="option.value" 
                  v-model="formData.role" 
                />
                <label :for="option.value">{{ option.label }}</label>
              </div>
            </div>
          </div>
          
          <!-- Error message -->
          <div class="form-error" v-if="errors.form">
            <small class="p-error">{{ errors.form }}</small>
          </div>
          
          <!-- Sign up button -->
          <Button 
            type="submit"
            label="Create Account" 
            icon="pi pi-user-plus"
            :loading="loading"
            class="p-button-primary signup-button"
          />
        </form>
        
        <!-- Sign in link -->
        <div class="sign-in-link">
          <span>Already have an account?</span>
          <router-link to="/login">Sign in</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem 1rem;
}

.signup-card {
  background-color: var(--surface-card);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  padding: 2rem;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h2 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.card-header p {
  color: var(--text-color-secondary);
}

.form-container {
  display: flex;
  flex-direction: column;
}

.p-field {
  margin-bottom: 1.5rem;
}

.p-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.p-field input,
.p-field .p-password {
  width: 100%;
}

.role-options {
  display: flex;
  gap: 2rem;
}

.role-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-error {
  margin-bottom: 1rem;
}

.signup-button {
  width: 100%;
  margin-bottom: 1.5rem;
}

.sign-in-link {
  text-align: center;
  margin-top: 1rem;
}

.sign-in-link a {
  color: var(--primary-color);
  margin-left: 0.5rem;
  font-weight: 500;
  text-decoration: none;
}

.sign-in-link a:hover {
  text-decoration: underline;
}
</style>