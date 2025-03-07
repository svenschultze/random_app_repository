<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = () => {
  isLoading.value = true
  errorMessage.value = ''
  
  // Simulate login (would be an API call in a real app)
  setTimeout(() => {
    isLoading.value = false
    
    // Demo login (in a real app, this would validate against a backend)
    if (email.value && password.value) {
      // Mock successful login
      router.push('/swipe')
    } else {
      errorMessage.value = 'Please enter both email and password'
    }
  }, 1000)
}

const goToSignup = () => {
  router.push('/signup')
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2 v-voix="'login-heading'">Welcome Back</h2>
      <p class="subtitle">Sign in to continue swiping</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" v-voix="'email-label'">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="your@email.com" 
            required
            v-voix="'email-input'"
            hint="Enter your email address"
          />
        </div>
        
        <div class="form-group">
          <label for="password" v-voix="'password-label'">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="••••••••" 
            required
            v-voix="'password-input'"
            hint="Enter your password"
          />
        </div>
        
        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
        
        <button 
          type="submit" 
          class="login-button" 
          :disabled="isLoading"
          v-voix="'login-submit-btn'"
          hint="Submit login form"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      
      <div class="signup-link">
        <p>
          Don't have an account? 
          <a 
            href="#" 
            @click.prevent="goToSignup"
            v-voix="'signup-link'"
            hint="Navigate to signup page"
          >
            Sign up
          </a>
        </p>
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
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
}

h2 {
  margin-bottom: 0.5rem;
  color: #333;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #777;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: #555;
}

input {
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #ff5757;
  outline: none;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: -0.5rem;
}

.login-button {
  background-color: #ff5757;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.login-button:hover:not(:disabled) {
  background-color: #ff4343;
}

.login-button:disabled {
  background-color: #ffadad;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  margin-top: 2rem;
}

.signup-link a {
  color: #ff5757;
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>