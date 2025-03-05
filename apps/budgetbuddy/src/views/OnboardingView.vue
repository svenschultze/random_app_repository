<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref(1)
const totalSteps = 3

const formData = ref({
  name: '',
  currency: 'USD',
  monthlyIncome: '',
  existingBudgets: []
})

const budgetCategories = [
  { id: 1, name: 'Housing', default: true },
  { id: 2, name: 'Food', default: true },
  { id: 3, name: 'Transportation', default: true },
  { id: 4, name: 'Entertainment', default: false },
  { id: 5, name: 'Shopping', default: false },
  { id: 6, name: 'Utilities', default: true },
  { id: 7, name: 'Healthcare', default: false },
  { id: 8, name: 'Education', default: false },
  { id: 9, name: 'Savings', default: true },
  { id: 10, name: 'Other', default: false }
]

// Init selected categories
formData.value.existingBudgets = budgetCategories
  .filter(cat => cat.default)
  .map(cat => ({...cat, amount: 0}))

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  } else {
    completeOnboarding()
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const toggleCategory = (category) => {
  const index = formData.value.existingBudgets.findIndex(cat => cat.id === category.id)
  if (index > -1) {
    formData.value.existingBudgets.splice(index, 1)
  } else {
    formData.value.existingBudgets.push({...category, amount: 0})
  }
}

const isCategorySelected = (id) => {
  return formData.value.existingBudgets.some(cat => cat.id === id)
}

const completeOnboarding = () => {
  // Here we would typically save the data to a store or localStorage
  localStorage.setItem('budgetBuddyUserData', JSON.stringify(formData.value))
  localStorage.setItem('budgetBuddyOnboardingComplete', 'true')
  router.push('/')
}

const skipOnboarding = () => {
  localStorage.setItem('budgetBuddyOnboardingComplete', 'true')
  router.push('/')
}
</script>

<template>
  <div class="onboarding-container">
    <div class="onboarding-card">
      <div class="onboarding-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
        </div>
        <div class="step-indicators">
          <span 
            v-for="step in totalSteps" 
            :key="step" 
            class="step-dot"
            :class="{ 'active': step <= currentStep }"
          ></span>
        </div>
      </div>
      
      <!-- Step 1: Welcome and Personal Info -->
      <div v-if="currentStep === 1" class="step-content">
        <h2>Welcome to BudgetBuddy!</h2>
        <p>Let's set up your personal finance assistant in just a few steps.</p>
        
        <div class="form-group">
          <label for="name">What's your name?</label>
          <input 
            id="name" 
            type="text" 
            v-model="formData.name" 
            placeholder="Enter your name"
            class="form-input"
            v-voix="'NameInput'" 
            hint="Enter your name for personalized experience"
          >
        </div>
        
        <div class="form-group">
          <label for="currency">Select your currency</label>
          <select id="currency" v-model="formData.currency" class="form-select" v-voix="'CurrencySelector'" hint="Choose your preferred currency for financial tracking">
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">British Pound (£)</option>
            <option value="JPY">Japanese Yen (¥)</option>
            <option value="CAD">Canadian Dollar (C$)</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="income">What's your monthly income?</label>
          <input 
            id="income" 
            type="number" 
            v-model="formData.monthlyIncome" 
            placeholder="Enter amount"
            class="form-input"
            v-voix="'MonthlyIncomeInput'" 
            hint="Enter your monthly income amount for budget calculations"
          >
        </div>
      </div>
      
      <!-- Step 2: Budget Categories -->
      <div v-if="currentStep === 2" class="step-content">
        <h2>Select Budget Categories</h2>
        <p>Choose the categories you want to track in your budget.</p>
        
        <div class="categories-grid">
          <div 
            v-for="category in budgetCategories" 
            :key="category.id"
            class="category-item"
            :class="{ 'selected': isCategorySelected(category.id) }"
            @click="toggleCategory(category)"
            v-voix="'CategoryToggle_' + category.name"
            hint="Select or deselect this budget category"
          >
            <span class="category-name">{{ category.name }}</span>
            <span v-if="isCategorySelected(category.id)" class="check-icon">✓</span>
          </div>
        </div>
      </div>
      
      <!-- Step 3: Summary -->
      <div v-if="currentStep === 3" class="step-content">
        <h2>Almost Done!</h2>
        <p>Here's a summary of your information:</p>
        
        <div class="summary-info">
          <div class="summary-item">
            <span class="summary-label">Name:</span>
            <span class="summary-value">{{ formData.name }}</span>
          </div>
          
          <div class="summary-item">
            <span class="summary-label">Currency:</span>
            <span class="summary-value">{{ formData.currency }}</span>
          </div>
          
          <div class="summary-item">
            <span class="summary-label">Monthly Income:</span>
            <span class="summary-value">{{ formData.monthlyIncome }}</span>
          </div>
          
          <div class="summary-item">
            <span class="summary-label">Selected Categories:</span>
            <div class="summary-categories">
              <span 
                v-for="(category, index) in formData.existingBudgets" 
                :key="category.id"
                class="category-tag"
              >
                {{ category.name }}{{ index < formData.existingBudgets.length - 1 ? ',' : '' }}
              </span>
            </div>
          </div>
        </div>
        
        <p>You can always update these settings later in your profile.</p>
      </div>
      
      <div class="button-group">
        <button 
          v-if="currentStep > 1" 
          @click="prevStep" 
          class="btn btn-secondary"
          v-voix="'PreviousStep'"
          hint="Go back to the previous step"
        >
          Back
        </button>
        
        <button 
          @click="nextStep" 
          class="btn btn-primary"
          v-voix="'NextStep'"
          hint="Continue to the next step or complete setup"
        >
          {{ currentStep < totalSteps ? 'Next' : 'Complete' }}
        </button>
      </div>
      
      <div v-if="currentStep === 1" class="skip-link">
        <a href="#" @click.prevent="skipOnboarding" v-voix="'SkipSetup'" hint="Skip the setup process and go to dashboard">Skip setup</a>
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
}

.onboarding-card {
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
}

.onboarding-progress {
  margin-bottom: 2rem;
}

.progress-bar {
  height: 8px;
  background-color: var(--color-background-mute);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.step-indicators {
  display: flex;
  justify-content: space-between;
}

.step-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--color-background-mute);
  transition: background-color 0.3s ease;
}

.step-dot.active {
  background-color: #4caf50;
}

.step-content {
  min-height: 300px;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input, .form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.category-item {
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.category-item:hover {
  background-color: var(--color-background-mute);
}

.category-item.selected {
  background-color: rgba(76, 175, 80, 0.1);
  border-color: #4caf50;
}

.check-icon {
  color: #4caf50;
  font-weight: bold;
}

.summary-info {
  background-color: var(--color-background);
  border-radius: 0.25rem;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.summary-item {
  margin-bottom: 1rem;
}

.summary-label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.25rem;
}

.category-tag {
  display: inline-block;
  margin-right: 0.5rem;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-secondary {
  background-color: var(--color-background-mute);
  color: var(--color-text);
}

.skip-link {
  margin-top: 1rem;
  text-align: center;
}

.skip-link a {
  color: var(--color-text-light);
  text-decoration: underline;
  font-size: 0.875rem;
}
</style>