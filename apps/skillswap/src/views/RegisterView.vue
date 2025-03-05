<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const errors = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: ''
})

const isRegistering = ref(false)

const validateForm = () => {
  let isValid = true
  errors.value = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: ''
  }
  
  // Full name validation
  if (!formData.value.fullName.trim()) {
    errors.value.fullName = 'Full name is required'
    isValid = false
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email'
    isValid = false
  }
  
  // Password validation
  if (!formData.value.password) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (formData.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
    isValid = false
  }
  
  // Confirm password validation
  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  
  // Terms agreement validation
  if (!formData.value.agreeTerms) {
    errors.value.agreeTerms = 'You must agree to the terms and conditions'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    isRegistering.value = true
    
    // Simulate API call
    setTimeout(() => {
      isRegistering.value = false
      router.push('/onboarding')
    }, 1500)
  }
}

const navigateToLogin = () => {
  // In a real app, this would navigate to login page
  console.log('Navigate to login')
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1 v-voix="'register-title'">Create your account</h1>
        <p v-voix="'register-subtitle'">Join SkillSwap to start exchanging skills with people from around the world.</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-group">
          <label for="fullName" v-voix="'fullname-label'">Full Name</label>
          <input 
            type="text" 
            id="fullName" 
            v-model="formData.fullName" 
            placeholder="Enter your full name"
            v-voix="'fullname-input'"
            hint="Enter your first and last name"
          >
          <span v-if="errors.fullName" class="error-message">{{ errors.fullName }}</span>
        </div>
        
        <div class="form-group">
          <label for="email" v-voix="'email-label'">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            placeholder="Enter your email"
            v-voix="'email-input'"
            hint="Enter your email address"
          >
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>
        
        <div class="form-group">
          <label for="password" v-voix="'password-label'">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="formData.password" 
            placeholder="Create a password"
            v-voix="'password-input'"
            hint="Enter a password with at least 8 characters"
          >
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword" v-voix="'confirm-password-label'">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="formData.confirmPassword" 
            placeholder="Confirm your password"
            v-voix="'confirm-password-input'"
            hint="Re-enter your password to confirm"
          >
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
        </div>
        
        <div class="form-group checkbox-group">
          <input 
            type="checkbox" 
            id="agreeTerms" 
            v-model="formData.agreeTerms"
            v-voix="'terms-checkbox'"
            hint="Check this box to agree to the terms and conditions"
          >
          <label for="agreeTerms" v-voix="'terms-label'">
            I agree to the <a href="#" v-voix="'terms-link'">Terms and Conditions</a> and <a href="#" v-voix="'privacy-link'">Privacy Policy</a>
          </label>
          <span v-if="errors.agreeTerms" class="error-message block-error">{{ errors.agreeTerms }}</span>
        </div>
        
        <button 
          type="submit" 
          class="register-button" 
          :disabled="isRegistering"
          v-voix="'register-button'"
          hint="Click to create your account"
        >
          <span v-if="isRegistering">Creating Account...</span>
          <span v-else>Create Account</span>
        </button>
      </form>
      
      <div class="login-prompt">
        <p v-voix="'login-prompt'">
          Already have an account? 
          <a 
            href="#" 
            @click.prevent="navigateToLogin"
            v-voix="'login-link'"
            hint="Click to go to the login page"
          >Log in</a>
        </p>
      </div>
      
      <div class="or-divider">
        <span v-voix="'or-divider'">or</span>
      </div>
      
      <div class="social-login">
        <button 
          class="social-button google"
          v-voix="'google-login-button'"
          hint="Click to sign up with Google"
        >
          <span class="social-icon">G</span>
          Continue with Google
        </button>
        <button 
          class="social-button facebook"
          v-voix="'facebook-login-button'"
          hint="Click to sign up with Facebook"
        >
          <span class="social-icon">f</span>
          Continue with Facebook
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--header-height));
  padding: 2rem;
  background-color: var(--background-color);
}

.register-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--box-shadow);
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.register-header p {
  color: var(--light-text);
  font-size: 1rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-group {
  flex-direction: row;
  align-items: flex-start;
  gap: 0.75rem;
}

.checkbox-group input {
  margin-top: 4px;
}

label {
  font-weight: 500;
  color: var(--text-color);
}

input[type="text"],
input[type="email"],
input[type="password"] {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 140, 255, 0.2);
}

.error-message {
  color: var(--error-color);
  font-size: 0.85rem;
}

.block-error {
  display: block;
  margin-top: 0.5rem;
  margin-left: -1.75rem;
}

.register-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.875rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 0.5rem;
}

.register-button:hover:not(:disabled) {
  background-color: var(--secondary-color);
}

.register-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-prompt {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--light-text);
}

.login-prompt a {
  color: var(--primary-color);
  font-weight: 500;
  text-decoration: none;
}

.login-prompt a:hover {
  text-decoration: underline;
}

.or-divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.or-divider::before,
.or-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--border-color);
}

.or-divider span {
  padding: 0 1rem;
  color: var(--light-text);
  font-size: 0.9rem;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  background-color: white;
}

.social-button:hover {
  background-color: var(--background-color);
}

.social-button.google {
  color: #4285F4;
}

.social-button.facebook {
  color: #3b5998;
}

.social-icon {
  font-weight: bold;
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .register-card {
    padding: 1.5rem;
  }
}
</style>