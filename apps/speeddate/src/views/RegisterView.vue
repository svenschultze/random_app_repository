<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

function register() {
  // Clear previous error
  errorMessage.value = ''
  
  // Basic validation
  if (!email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'All fields are required'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }
  
  // Simulate API call
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    // Redirect to profile setup
    router.push('/profile-setup')
  }, 1000)
}

function loginWithGoogle() {
  // Simulate authentication
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    router.push('/profile-setup')
  }, 1000)
}
</script>

<template>
  <div class="register">
    <div class="logo">SpeedDate</div>
    <h1 v-voix="'Register page title'">Create Account</h1>
    
    <form @submit.prevent="register" class="register-form">
      <div class="input-group">
        <label for="email" v-voix="'Email label'">Email</label>
        <input 
          id="email" 
          type="email" 
          v-model="email" 
          placeholder="Enter your email" 
          v-voix="'Email input'"
          hint="Type your email address here"
        />
      </div>
      
      <div class="input-group">
        <label for="password" v-voix="'Password label'">Password</label>
        <input 
          id="password" 
          type="password" 
          v-model="password" 
          placeholder="Create password" 
          v-voix="'Password input'"
          hint="Type your password here"
        />
      </div>
      
      <div class="input-group">
        <label for="confirm-password" v-voix="'Confirm password label'">Confirm Password</label>
        <input 
          id="confirm-password" 
          type="password" 
          v-model="confirmPassword" 
          placeholder="Confirm password" 
          v-voix="'Confirm password input'"
          hint="Type your password again to confirm"
        />
      </div>
      
      <div v-if="errorMessage" class="error-message" v-voix="'Error message'">
        {{ errorMessage }}
      </div>
      
      <button 
        type="submit" 
        class="primary-button" 
        :disabled="isLoading"
        v-voix="'Register button'" 
        hint="Click to create your account">
        <span v-if="isLoading">Creating Account...</span>
        <span v-else>Create Account</span>
      </button>
    </form>
    
    <div class="divider">
      <span>or</span>
    </div>
    
    <button 
      class="social-button google" 
      @click="loginWithGoogle" 
      :disabled="isLoading"
      v-voix="'Sign up with Google button'"
      hint="Register using your Google account">
      <span v-if="isLoading">Connecting...</span>
      <span v-else>Sign up with Google</span>
    </button>
    
    <div class="login-link">
      <span>Already have an account?</span>
      <RouterLink 
        to="/login" 
        v-voix="'Login link'"
        hint="Go to login page if you already have an account">
        Log in
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.register {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 420px;
  margin: 0 auto;
  padding: 2rem 1rem;
  height: 100%;
  min-height: 100vh;
  justify-content: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ff4b7d;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.register-form {
  width: 100%;
}

.input-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
  font-size: 0.95rem;
}

input {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

input:focus {
  border-color: #ff4b7d;
  outline: none;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.primary-button {
  width: 100%;
  padding: 0.875rem;
  background-color: #ff4b7d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-button:hover {
  background-color: #ff3367;
}

.primary-button:disabled {
  background-color: #ffb1c6;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #ddd;
}

.divider span {
  padding: 0 1rem;
  color: #777;
  font-size: 0.875rem;
}

.social-button {
  width: 100%;
  padding: 0.875rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 1.5rem;
}

.social-button:hover {
  background-color: #f8f8f8;
}

.social-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-link {
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #555;
}

.login-link a {
  color: #ff4b7d;
  margin-left: 0.5rem;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>