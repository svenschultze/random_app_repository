<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useLessonsStore } from '../stores/lessons'

const router = useRouter()
const userStore = useUserStore()
const lessonsStore = useLessonsStore()

// Onboarding state
const step = ref(1)
const totalSteps = 4

// User selections
const userName = ref('')
const selectedLanguage = ref('')
const selectedGoal = ref('')
const nativeLanguage = ref('English') // Default

// Validation states
const isNameValid = computed(() => userName.value.trim().length >= 2)
const isLanguageValid = computed(() => selectedLanguage.value !== '')
const isGoalValid = computed(() => selectedGoal.value !== '')
const canProceed = computed(() => {
  if (step.value === 1) return isNameValid.value
  if (step.value === 2) return isLanguageValid.value
  if (step.value === 3) return isGoalValid.value
  return true
})

// Get languages and goals from the store
const languages = computed(() => lessonsStore.languages)
const learningGoals = computed(() => lessonsStore.learningGoals)

// Navigation functions
const nextStep = () => {
  if (step.value < totalSteps && canProceed.value) {
    step.value++
  } else if (step.value === totalSteps) {
    completeOnboarding()
  }
}

const prevStep = () => {
  if (step.value > 1) {
    step.value--
  }
}

// Complete onboarding and set user data
const completeOnboarding = () => {
  // Create user profile
  userStore.login({
    id: 'user-' + Date.now(),
    name: userName.value,
    email: `${userName.value.toLowerCase().replace(/\s/g, '.')}@example.com`,
    language: selectedLanguage.value,
    nativeLanguage: nativeLanguage.value,
    goalType: selectedGoal.value,
    level: 1,
    xp: 0,
    streak: 0,
    badges: []
  })
  
  // Navigate to dashboard
  router.push('/dashboard')
}

// Shortcut for development/testing
const skipOnboarding = () => {
  userName.value = 'Test User'
  selectedLanguage.value = 'es'
  selectedGoal.value = 'travel'
  completeOnboarding()
}
</script>

<template>
  <div class="onboarding-container">
    <div class="onboarding-card">
      <div class="onboarding-header">
        <h1 class="onboarding-title">Welcome to LangLearn</h1>
        <div class="step-indicator">
          <span 
            v-for="i in totalSteps" 
            :key="i" 
            class="step-dot" 
            :class="{ active: i === step, completed: i < step }"
          ></span>
        </div>
      </div>
      
      <!-- Step 1: User Name -->
      <div v-if="step === 1" class="onboarding-step">
        <h2>What's your name?</h2>
        <p>We'll use this to personalize your experience.</p>
        
        <div class="form-group">
          <label for="user-name">Your Name</label>
          <input 
            id="user-name" 
            v-model="userName" 
            type="text" 
            placeholder="Enter your name"
            v-voix="'user-name-input'"
            hint="Enter your name to get started"
          />
        </div>
      </div>
      
      <!-- Step 2: Language Selection -->
      <div v-if="step === 2" class="onboarding-step">
        <h2>Which language do you want to learn?</h2>
        <p>Choose the language you're interested in mastering.</p>
        
        <div class="language-grid">
          <button 
            v-for="language in languages" 
            :key="language.id"
            class="language-card" 
            :class="{ selected: selectedLanguage === language.id }"
            @click="selectedLanguage = language.id"
            v-voix="`language-${language.id}`"
            :hint="`Select ${language.name} as your learning language`"
          >
            <span class="language-name">{{ language.name }}</span>
          </button>
        </div>
      </div>
      
      <!-- Step 3: Learning Goal -->
      <div v-if="step === 3" class="onboarding-step">
        <h2>What's your learning goal?</h2>
        <p>This helps us customize your learning path.</p>
        
        <div class="goals-list">
          <div 
            v-for="goal in learningGoals" 
            :key="goal.id"
            class="goal-card" 
            :class="{ selected: selectedGoal === goal.id }"
            @click="selectedGoal = goal.id"
            v-voix="`goal-${goal.id}`"
            :hint="`Select ${goal.name} as your learning goal`"
          >
            <h3>{{ goal.name }}</h3>
            <p>{{ goal.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Step 4: Ready to Start -->
      <div v-if="step === 4" class="onboarding-step">
        <h2>You're all set!</h2>
        <p>We've prepared your personalized learning path.</p>
        
        <div class="summary-card">
          <div class="summary-item">
            <strong>Name:</strong> {{ userName }}
          </div>
          <div class="summary-item">
            <strong>Learning:</strong> {{ languages.find(lang => lang.id === selectedLanguage)?.name }}
          </div>
          <div class="summary-item">
            <strong>Goal:</strong> {{ learningGoals.find(goal => goal.id === selectedGoal)?.name }}
          </div>
        </div>
        
        <p>Ready to start your language learning journey?</p>
      </div>
      
      <div class="onboarding-actions">
        <button 
          v-if="step > 1" 
          class="btn btn-secondary" 
          @click="prevStep"
          v-voix="'prev-step-button'"
          hint="Go back to previous step"
        >
          Back
        </button>
        
        <button 
          class="btn btn-primary" 
          :disabled="!canProceed"
          @click="nextStep"
          v-voix="'next-step-button'"
          :hint="step === totalSteps ? 'Complete setup and start learning' : 'Continue to next step'"
        >
          {{ step === totalSteps ? 'Get Started' : 'Continue' }}
        </button>
      </div>
      
      <!-- Dev shortcut -->
      <div class="dev-shortcuts">
        <button 
          class="btn btn-text" 
          @click="skipOnboarding"
          v-voix="'skip-onboarding'"
          hint="Skip the onboarding process for testing"
        >
          Skip for Testing
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem 1rem;
}

.onboarding-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
}

.onboarding-header {
  text-align: center;
  margin-bottom: 2rem;
}

.onboarding-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 1rem;
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.step-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: var(--border-color);
}

.step-dot.active {
  background-color: var(--primary-color);
  transform: scale(1.2);
}

.step-dot.completed {
  background-color: var(--success-color);
}

.onboarding-step {
  margin-bottom: 2rem;
}

.onboarding-step h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.onboarding-step p {
  color: var(--text-light);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
}

.language-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.language-card {
  padding: 1.25rem;
  background-color: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
}

.language-card:hover {
  border-color: var(--primary-light);
}

.language-card.selected {
  border-color: var(--primary-color);
  background-color: var(--primary-light);
  color: white;
}

.language-name {
  font-weight: 500;
  font-size: 1.1rem;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goal-card {
  padding: 1rem;
  background-color: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.goal-card:hover {
  border-color: var(--primary-light);
}

.goal-card.selected {
  border-color: var(--primary-color);
  background-color: rgba(79, 70, 229, 0.1);
}

.goal-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.goal-card p {
  font-size: 0.9rem;
  margin-bottom: 0;
}

.summary-card {
  background-color: var(--bg-color);
  padding: 1.25rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.summary-item {
  margin-bottom: 0.75rem;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.onboarding-actions {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-primary:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
}

.btn-secondary {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

.btn-text {
  background: none;
  color: var(--text-light);
  padding: 0.5rem;
}

.btn-text:hover {
  color: var(--primary-color);
}

.dev-shortcuts {
  margin-top: 2rem;
  text-align: center;
  opacity: 0.5;
}

@media (max-width: 640px) {
  .language-grid {
    grid-template-columns: 1fr;
  }
  
  .onboarding-card {
    padding: 1.5rem;
  }
}
</style>