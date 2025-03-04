<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'

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
            <InputText 
              id="email"
              v-model="formData.email"
              type="email"
              :class="{ 'p-invalid': errors.email }"
              @input="clearErrors('email')"
            />
            <small class="p-error" v-if="errors.email">{{ errors.email }}</small>
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
              :feedback="false"
            />
            <small class="p-error" v-if="errors.password">{{ errors.password }}</small>
          </div>
          
          <!-- Error message -->
          <div class="form-error" v-if="errors.form">
            <small class="p-error">{{ errors.form }}</small>
          </div>
          
          <!-- Sign in button -->
          <Button 
            type="submit"
            label="Sign In" 
            icon="pi pi-sign-in"
            :loading="loading"
            class="p-button-primary login-button"
          />
          
          <!-- Demo user login -->
          <Button 
            type="button"
            label="Demo User Login" 
            icon="pi pi-user"
            @click="loginAsDemoUser"
            :loading="loading"
            class="p-button-outlined demo-button"
          />
        </form>
        
        <!-- Sign up link -->
        <div class="sign-up-link">
          <span>Don't have an account?</span>
          <router-link to="/signup">Create an account</router-link>
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

.p-field input,
.p-field .p-password {
  width: 100%;
}

.form-error {
  margin-bottom: 1rem;
}

.login-button {
  width: 100%;
  margin-bottom: 1rem;
}

.demo-button {
  width: 100%;
  margin-bottom: 1.5rem;
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