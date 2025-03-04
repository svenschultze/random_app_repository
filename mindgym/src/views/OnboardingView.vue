<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const currentStep = ref(1)
const totalSteps = 4

const userData = reactive({
  name: '',
  preferences: {
    challengeTypes: [],
    difficulty: 'beginner',
    dailyGoal: 1
  }
})

const challengeTypes = [
  { id: 'memory', name: 'Memory Exercises', icon: '🧠' },
  { id: 'logic', name: 'Logic Puzzles', icon: '🧩' },
  { id: 'verbal', name: 'Verbal Reasoning', icon: '📝' },
  { id: 'spatial', name: 'Spatial Reasoning', icon: '📐' },
  { id: 'math', name: 'Mental Math', icon: '➗' }
]

const difficultyLevels = [
  { id: 'beginner', name: 'Beginner', description: 'Just getting started with brain training' },
  { id: 'intermediate', name: 'Intermediate', description: 'Some experience with mental challenges' },
  { id: 'advanced', name: 'Advanced', description: 'Looking for difficult mental exercises' }
]

function nextStep() {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  } else {
    completeOnboarding()
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function toggleChallengeType(typeId) {
  const index = userData.preferences.challengeTypes.indexOf(typeId)
  if (index === -1) {
    userData.preferences.challengeTypes.push(typeId)
  } else {
    userData.preferences.challengeTypes.splice(index, 1)
  }
}

function selectDifficulty(difficulty) {
  userData.preferences.difficulty = difficulty
}

function completeOnboarding() {
  // Save user data
  userStore.setUserProfile({
    name: userData.name,
    profilePicture: `https://api.dicebear.com/7.x/lorelei/svg?seed=${userData.name}`
  })
  
  // Save preferences
  userStore.updatePreferences(userData.preferences)
  
  // Mark onboarding as complete
  userStore.completeOnboarding()
  
  // Redirect to home
  router.push('/')
}
</script>

<template>
  <div class="onboarding-container">
    <div class="onboarding-card">
      <div class="progress-bar">
        <div class="progress-step" v-for="step in totalSteps" :key="step"
             :class="{ 'active': step === currentStep, 'completed': step < currentStep }">
          {{ step }}
        </div>
      </div>
      
      <!-- Step 1: Welcome -->
      <div v-if="currentStep === 1" class="step-content">
        <h1 class="step-title">Welcome to MindGym!</h1>
        <p class="step-description">
          Your daily workout for a sharper mind. Let's set up your personal training program.
        </p>
        
        <div class="input-group">
          <label for="name">What should we call you?</label>
          <input 
            type="text" 
            id="name" 
            v-model="userData.name" 
            placeholder="Enter your name" 
            required
          />
        </div>
      </div>
      
      <!-- Step 2: Challenge Types -->
      <div v-if="currentStep === 2" class="step-content">
        <h1 class="step-title">What do you want to improve?</h1>
        <p class="step-description">
          Select the types of challenges you're interested in.
        </p>
        
        <div class="challenge-types">
          <div 
            v-for="type in challengeTypes" 
            :key="type.id" 
            class="challenge-type-option"
            :class="{ selected: userData.preferences.challengeTypes.includes(type.id) }"
            @click="toggleChallengeType(type.id)"
          >
            <div class="type-icon">{{ type.icon }}</div>
            <div class="type-name">{{ type.name }}</div>
          </div>
        </div>
      </div>
      
      <!-- Step 3: Difficulty Level -->
      <div v-if="currentStep === 3" class="step-content">
        <h1 class="step-title">Choose your difficulty level</h1>
        <p class="step-description">
          How challenging should your mental workouts be?
        </p>
        
        <div class="difficulty-options">
          <div 
            v-for="level in difficultyLevels" 
            :key="level.id" 
            class="difficulty-option"
            :class="{ selected: userData.preferences.difficulty === level.id }"
            @click="selectDifficulty(level.id)"
          >
            <div class="difficulty-name">{{ level.name }}</div>
            <div class="difficulty-description">{{ level.description }}</div>
          </div>
        </div>
      </div>
      
      <!-- Step 4: Daily Goal -->
      <div v-if="currentStep === 4" class="step-content">
        <h1 class="step-title">Set your daily goal</h1>
        <p class="step-description">
          How many challenges do you want to complete each day?
        </p>
        
        <div class="daily-goal-selector">
          <button 
            type="button" 
            class="goal-decrement" 
            @click="userData.preferences.dailyGoal = Math.max(1, userData.preferences.dailyGoal - 1)"
          >
            -
          </button>
          <div class="goal-value">{{ userData.preferences.dailyGoal }}</div>
          <button 
            type="button" 
            class="goal-increment" 
            @click="userData.preferences.dailyGoal = Math.min(5, userData.preferences.dailyGoal + 1)"
          >
            +
          </button>
        </div>
        
        <p class="daily-goal-description">
          You'll aim to complete <strong>{{ userData.preferences.dailyGoal }}</strong> challenge(s) daily.
          Consistent practice is key to improving your mental fitness!
        </p>
      </div>
      
      <div class="step-navigation">
        <button 
          v-if="currentStep > 1" 
          type="button" 
          class="btn btn-secondary" 
          @click="prevStep"
        >
          Back
        </button>
        <button 
          type="button" 
          class="btn btn-primary" 
          @click="nextStep" 
          :disabled="currentStep === 1 && !userData.name"
        >
          {{ currentStep < totalSteps ? 'Next' : 'Get Started' }}
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
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8f9fa;
}

.onboarding-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  padding: 2rem;
}

.progress-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
}

.progress-bar::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #e0e0e0;
  z-index: 1;
}

.progress-step {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: #999;
  position: relative;
  z-index: 2;
}

.progress-step.active {
  border-color: #3a86ff;
  color: #3a86ff;
}

.progress-step.completed {
  background-color: #3a86ff;
  border-color: #3a86ff;
  color: white;
}

.step-content {
  margin-bottom: 2rem;
}

.step-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.step-description {
  color: #666;
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.challenge-types {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.challenge-type-option {
  border: 2px solid #eee;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.challenge-type-option:hover {
  border-color: #b3d4ff;
}

.challenge-type-option.selected {
  border-color: #3a86ff;
  background-color: #f0f7ff;
}

.type-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.type-name {
  font-weight: 500;
}

.difficulty-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.difficulty-option {
  border: 2px solid #eee;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.difficulty-option:hover {
  border-color: #b3d4ff;
}

.difficulty-option.selected {
  border-color: #3a86ff;
  background-color: #f0f7ff;
}

.difficulty-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.difficulty-description {
  font-size: 0.9rem;
  color: #666;
}

.daily-goal-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
}

.goal-value {
  font-size: 2.5rem;
  font-weight: bold;
  width: 80px;
  text-align: center;
  color: #3a86ff;
}

.goal-decrement, .goal-increment {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #e6efff;
  color: #3a86ff;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.goal-decrement:hover, .goal-increment:hover {
  background-color: #d6e4ff;
}

.daily-goal-description {
  text-align: center;
  color: #666;
}

.step-navigation {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #3a86ff;
  color: white;
}

.btn-primary:hover {
  background-color: #2a75e8;
}

.btn-primary:disabled {
  background-color: #9DC3FF;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

@media (max-width: 600px) {
  .onboarding-card {
    padding: 1.5rem;
  }
  
  .challenge-types {
    grid-template-columns: 1fr;
  }
}
</style>