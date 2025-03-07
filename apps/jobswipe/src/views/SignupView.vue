<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const fullName = ref('')
const userType = ref('candidate')
const errorMessage = ref('')
const isLoading = ref(false)

const handleSignup = () => {
  isLoading.value = true
  errorMessage.value = ''
  
  // Validate form
  if (!email.value || !password.value || !confirmPassword.value || !fullName.value) {
    errorMessage.value = 'All fields are required'
    isLoading.value = false
    return
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    isLoading.value = false
    return
  }
  
  // Simulate signup (would be an API call in a real app)
  setTimeout(() => {
    isLoading.value = false
    
    // Mock successful signup
    router.push('/profile')
  }, 1500)
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="signup-container">
    <div class="signup-card">
      <h2 v-voix="'signup-heading'">Create Account</h2>
      <p class="subtitle">Join JobSwipe to find your perfect match</p>
      
      <form @submit.prevent="handleSignup" class="signup-form">
        <div class="account-type">
          <p v-voix="'account-type-label'">I am a:</p>
          <div class="account-type-options">
            <label 
              class="radio-container"
              v-voix="'candidate-option'"
              hint="Select if you are looking for a job"
            >
              <input 
                type="radio" 
                v-model="userType" 
                value="candidate" 
                name="userType"
              />
              <span class="radio-label">Job Seeker</span>
            </label>
            
            <label 
              class="radio-container"
              v-voix="'company-option'"
              hint="Select if you are hiring"
            >
              <input 
                type="radio" 
                v-model="userType" 
                value="company" 
                name="userType"
              />
              <span class="radio-label">Company</span>
            </label>
          </div>
        </div>
        
        <div class="form-group">
          <label for="fullName" v-voix="'name-label'">{{ userType === 'candidate' ? 'Full Name' : 'Company Name' }}</label>
          <input 
            type="text" 
            id="fullName" 
            v-model="fullName" 
            :placeholder="userType === 'candidate' ? 'John Doe' : 'Acme Inc.'" 
            required
            v-voix="'name-input'"
            :hint="userType === 'candidate' ? 'Enter your full name' : 'Enter your company name'"
          />
        </div>
        
        <div class="form-group">
          <label for="signup-email" v-voix="'signup-email-label'">Email</label>
          <input 
            type="email" 
            id="signup-email" 
            v-model="email" 
            placeholder="your@email.com" 
            required
            v-voix="'signup-email-input'"
            hint="Enter your email address"
          />
        </div>
        
        <div class="form-group">
          <label for="signup-password" v-voix="'signup-password-label'">Password</label>
          <input 
            type="password" 
            id="signup-password" 
            v-model="password" 
            placeholder="••••••••" 
            required
            v-voix="'signup-password-input'"
            hint="Enter your password"
          />
        </div>
        
        <div class="form-group">
          <label for="confirm-password" v-voix="'confirm-password-label'">Confirm Password</label>
          <input 
            type="password" 
            id="confirm-password" 
            v-model="confirmPassword" 
            placeholder="••••••••" 
            required
            v-voix="'confirm-password-input'"
            hint="Confirm your password"
          />
        </div>
        
        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
        
        <button 
          type="submit" 
          class="signup-button" 
          :disabled="isLoading"
          v-voix="'signup-submit-btn'"
          hint="Submit signup form"
        >
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>
      
      <div class="login-link">
        <p>
          Already have an account? 
          <a 
            href="#" 
            @click.prevent="goToLogin"
            v-voix="'login-link'"
            hint="Navigate to login page"
          >
            Log in
          </a>
        </p>
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
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
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

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.account-type {
  margin-bottom: 1rem;
}

.account-type p {
  font-weight: 600;
  color: #555;
  margin-bottom: 0.5rem;
}

.account-type-options {
  display: flex;
  gap: 1.5rem;
}

.radio-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-label {
  margin-left: 0.5rem;
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

.signup-button {
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

.signup-button:hover:not(:disabled) {
  background-color: #ff4343;
}

.signup-button:disabled {
  background-color: #ffadad;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 2rem;
}

.login-link a {
  color: #ff5757;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>