<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'

// For password visibility toggle
const showPassword = ref(false)

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

// Redirect URL from route query
const redirect = route.query.redirect || '/'

// Form state
const formData = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const errors = reactive({
  email: '',
  password: '',
  form: ''
})

// Validation
function validateForm() {
  let isValid = true
  errors.email = ''
  errors.password = ''
  errors.form = ''
  
  if (!formData.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email is invalid'
    isValid = false
  }
  
  if (!formData.password) {
    errors.password = 'Password is required'
    isValid = false
  }
  
  return isValid
}

// Form submission
async function handleSubmit() {
  if (!validateForm()) return
  
  loading.value = true
  try {
    await authStore.signIn(formData.email, formData.password)
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'You have successfully signed in',
      life: 3000
    })
    
    // Navigate to redirect URL or home
    router.push(redirect)
  } catch (error) {
    console.error('Login error:', error)
    errors.form = error.message || 'Failed to sign in. Please check your credentials.'
    
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

// Demo user login
async function loginAsDemoUser() {
  loading.value = true
  try {
    await authStore.signIn('demo@example.com', 'password123')
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'You have successfully signed in as demo user',
      life: 3000
    })
    
    router.push(redirect)
  } catch (error) {
    console.error('Demo login error:', error)
    errors.form = 'Failed to sign in as demo user. Please try again.'
    
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
  <div class="login-container">
    <div class="login-card">
      <div class="card-header">
        <h2>Sign In</h2>
        <p>Welcome back! Please enter your details below</p>
      </div>
      
      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <!-- Email field -->
          <div class="p-field">
            <label for="email">Email</label>
            <input 
              id="email"
              v-model="formData.email"
              type="email"
              :class="{ 'input-invalid': errors.email }"
              @input="clearErrors('email')"
              v-voix="'Login Email Input'"
              placeholder="Enter your email address"
              aria-label="Email Address"
              aria-required="true"
              aria-invalid="errors.email ? true : false"
            />
            <small class="p-error" v-if="errors.email">{{ errors.email }}</small>
          </div>
          
          <!-- Password field -->
          <div class="p-field">
            <label for="password">Password</label>
            <div class="password-container">
              <input 
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                :class="{ 'input-invalid': errors.password }"
                @input="clearErrors('password')"
                v-voix="'Login Password Input'"
                placeholder="Enter your password"
                aria-label="Password"
                aria-required="true"
                aria-invalid="errors.password ? true : false"
              />
              <button 
                type="button" 
                class="password-toggle" 
                @click="showPassword = !showPassword"
                aria-label="Toggle password visibility"
              >
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
            <small class="p-error" v-if="errors.password">{{ errors.password }}</small>
          </div>
          
          <!-- Error message -->
          <div class="form-error" v-if="errors.form">
            <small class="p-error">{{ errors.form }}</small>
          </div>
          
          <!-- Sign in button -->
          <button 
            type="submit"
            class="btn btn-primary login-button"
            v-voix="'Submit Login Form'"
            aria-label="Sign in to your account"
            :disabled="loading"
          >
            <i class="pi pi-sign-in"></i>
            <span>Sign In</span>
            <span v-if="loading" class="spinner" role="status" aria-hidden="true"></span>
          </button>
          
          <!-- Demo user login -->
          <button 
            type="button"
            @click="loginAsDemoUser"
            class="btn btn-outlined demo-button"
            v-voix="'Demo User Login'"
            aria-label="Log in with demo account"
            :disabled="loading"
          >
            <i class="pi pi-user"></i>
            <span>Demo User Login</span>
            <span v-if="loading" class="spinner" role="status" aria-hidden="true"></span>
          </button>
        </form>
        
        <!-- Sign up link -->
        <div class="sign-up-link">
          <span>Don't have an account?</span>
          <router-link to="/signup" v-voix="'Create Account Link'" hint="Navigate to the signup page to create a new account">Create an account</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem 1rem;
}

.login-card {
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

.p-field input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.p-field input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
}

.input-invalid {
  border-color: #f44336 !important;
}

.password-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-container input {
  width: 100%;
  padding-right: 2.5rem;
}

.password-toggle {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  padding: 0.5rem;
}

.password-toggle:hover {
  color: var(--primary-color);
}

.form-error {
  margin-bottom: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
  font-weight: 600;
  border: 1px solid transparent;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-600);
}

.btn-outlined {
  background-color: transparent;
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.btn-outlined:hover:not(:disabled) {
  background-color: var(--primary-50);
}

.login-button {
  width: 100%;
  margin-bottom: 1rem;
}

.demo-button {
  width: 100%;
  margin-bottom: 1.5rem;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.sign-up-link {
  text-align: center;
  margin-top: 1rem;
}

.sign-up-link a {
  color: var(--primary-color);
  margin-left: 0.5rem;
  font-weight: 500;
  text-decoration: none;
}

.sign-up-link a:hover {
  text-decoration: underline;
}
</style>