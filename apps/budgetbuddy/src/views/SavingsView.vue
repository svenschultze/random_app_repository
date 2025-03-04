<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showAddForm = ref(false)
const savingsGoals = ref([])
const userData = ref(null)
const transactions = ref([])

// Form data for new savings goal
const newGoal = ref({
  name: '',
  targetAmount: '',
  currentAmount: 0,
  targetDate: '',
  category: 'Savings',
  notes: '',
  color: '#4caf50'
})

// Color options for goals
const colorOptions = [
  '#4caf50', // Green
  '#2196f3', // Blue
  '#f44336', // Red
  '#ff9800', // Orange
  '#9c27b0', // Purple
  '#00bcd4', // Cyan
  '#795548', // Brown
  '#607d8b'  // Blue Grey
]

onMounted(() => {
  loadUserData()
  loadSavingsGoals()
  loadTransactions()
  
  // Check if new goal form should be shown
  if (route.query.new === 'true') {
    showAddForm.value = true
  }
})

const loadUserData = () => {
  const data = localStorage.getItem('budgetBuddyUserData')
  if (data) {
    userData.value = JSON.parse(data)
  }
}

const loadSavingsGoals = () => {
  // Load from localStorage or use mock data
  const savedGoals = localStorage.getItem('budgetBuddySavingsGoals')
  if (savedGoals) {
    savingsGoals.value = JSON.parse(savedGoals)
  } else {
    // Use mock data for demo
    savingsGoals.value = [
      { 
        id: 1, 
        name: 'Emergency Fund', 
        targetAmount: 10000, 
        currentAmount: 5000,
        targetDate: '2025-12-31',
        category: 'Savings',
        notes: 'Six months of expenses',
        color: '#4caf50',
        createdAt: '2025-01-15'
      },
      { 
        id: 2, 
        name: 'New Car', 
        targetAmount: 15000, 
        currentAmount: 3500,
        targetDate: '2026-06-30',
        category: 'Savings',
        notes: 'Down payment for new hybrid car',
        color: '#2196f3',
        createdAt: '2025-02-01'
      },
      { 
        id: 3, 
        name: 'Summer Vacation', 
        targetAmount: 3000, 
        currentAmount: 1200,
        targetDate: '2025-06-01',
        category: 'Travel',
        notes: 'Beach trip with family',
        color: '#ff9800',
        createdAt: '2025-02-10'
      }
    ]
    saveSavingsGoals()
  }
}

const loadTransactions = () => {
  // Load transactions to track savings deposits
  const savedTransactions = localStorage.getItem('budgetBuddyTransactions')
  if (savedTransactions) {
    transactions.value = JSON.parse(savedTransactions)
  } else {
    // Use mock data if none exists
    transactions.value = []
  }
}

const saveSavingsGoals = () => {
  localStorage.setItem('budgetBuddySavingsGoals', JSON.stringify(savingsGoals.value))
}

const addSavingsGoal = () => {
  // Validate form
  if (!newGoal.value.name || !newGoal.value.targetAmount || !newGoal.value.targetDate) {
    alert('Please fill in all required fields')
    return
  }
  
  // Create new goal object
  const goal = {
    id: Date.now(),
    name: newGoal.value.name,
    targetAmount: parseFloat(newGoal.value.targetAmount),
    currentAmount: parseFloat(newGoal.value.currentAmount) || 0,
    targetDate: newGoal.value.targetDate,
    category: newGoal.value.category,
    notes: newGoal.value.notes,
    color: newGoal.value.color,
    createdAt: new Date().toISOString().split('T')[0]
  }
  
  // Add to goals and save
  savingsGoals.value.push(goal)
  saveSavingsGoals()
  
  // Reset form
  resetForm()
}

const addContribution = (goal) => {
  const amount = prompt('Enter contribution amount:', '100')
  if (amount !== null && !isNaN(amount) && parseFloat(amount) > 0) {
    const contributionAmount = parseFloat(amount)
    
    // Update goal's current amount
    goal.currentAmount += contributionAmount
    saveSavingsGoals()
    
    // Create a transaction record for this contribution
    const transaction = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      description: `Contribution to ${goal.name}`,
      category: 'Savings',
      amount: -contributionAmount, // Negative because it's an expense
      type: 'expense',
      notes: `Savings goal contribution: ${goal.name}`
    }
    
    // Add transaction and save
    transactions.value.unshift(transaction)
    localStorage.setItem('budgetBuddyTransactions', JSON.stringify(transactions.value))
  }
}

const deleteGoal = (id) => {
  if (confirm('Are you sure you want to delete this savings goal?')) {
    savingsGoals.value = savingsGoals.value.filter(goal => goal.id !== id)
    saveSavingsGoals()
  }
}

const resetForm = () => {
  newGoal.value = {
    name: '',
    targetAmount: '',
    currentAmount: 0,
    targetDate: '',
    category: 'Savings',
    notes: '',
    color: '#4caf50'
  }
  showAddForm.value = false
}

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value
}

const formatCurrency = (amount) => {
  const currency = userData.value?.currency || 'USD'
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: currency 
  }).format(amount)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric' 
  }).format(date)
}

// Calculate progress percentage for a goal
const calculateProgress = (current, target) => {
  return (current / target) * 100
}

// Calculate remaining days until target date
const calculateRemainingDays = (targetDate) => {
  const target = new Date(targetDate)
  const today = new Date()
  
  // Set both dates to midnight for accurate day calculation
  target.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  
  const diffTime = target - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

// Calculate estimated completion percentage based on time elapsed
const calculateTimeProgress = (createdAt, targetDate) => {
  const start = new Date(createdAt)
  const target = new Date(targetDate)
  const today = new Date()
  
  // Set all dates to midnight for accurate calculation
  start.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  
  const totalDuration = target - start
  const elapsedDuration = today - start
  
  return (elapsedDuration / totalDuration) * 100
}

// Calculate status of a goal
const calculateStatus = (goal) => {
  const progress = calculateProgress(goal.currentAmount, goal.targetAmount)
  const timeProgress = calculateTimeProgress(goal.createdAt, goal.targetDate)
  
  if (progress >= 100) {
    return 'completed'
  } else if (timeProgress > progress + 10) {
    return 'behind'
  } else if (progress > timeProgress) {
    return 'ahead'
  } else {
    return 'on-track'
  }
}

// Sort goals by different criteria
const sortedGoals = computed(() => {
  return [...savingsGoals.value].sort((a, b) => {
    const aStatus = calculateStatus(a)
    const bStatus = calculateStatus(b)
    
    // Sort by completion: Behind goals first, then on-track, ahead, and completed last
    const statusOrder = {
      'behind': 0,
      'on-track': 1,
      'ahead': 2,
      'completed': 3
    }
    
    return statusOrder[aStatus] - statusOrder[bStatus]
  })
})

// Total savings across all goals
const totalSavings = computed(() => {
  return savingsGoals.value.reduce((total, goal) => total + goal.currentAmount, 0)
})

// Total savings goal amounts
const totalGoalAmount = computed(() => {
  return savingsGoals.value.reduce((total, goal) => total + goal.targetAmount, 0)
})

// Overall progress percentage
const overallProgress = computed(() => {
  return totalGoalAmount.value > 0 
    ? (totalSavings.value / totalGoalAmount.value) * 100 
    : 0
})
</script>

<template>
  <div class="savings-container">
    <header class="section-header">
      <h2>Savings Goals</h2>
      <button @click="toggleAddForm" class="btn btn-primary">
        {{ showAddForm ? 'Cancel' : 'Add New Goal' }}
      </button>
    </header>
    
    <!-- Add Goal Form -->
    <div v-if="showAddForm" class="add-goal-form">
      <h3>Create New Savings Goal</h3>
      <div class="form-grid">
        <div class="form-group">
          <label for="goal-name">Goal Name</label>
          <input 
            id="goal-name" 
            type="text" 
            v-model="newGoal.name"
            placeholder="e.g. Emergency Fund"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="goal-amount">Target Amount</label>
          <input 
            id="goal-amount" 
            type="number" 
            v-model="newGoal.targetAmount"
            placeholder="0.00"
            step="0.01"
            min="0"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="goal-current">Current Amount (optional)</label>
          <input 
            id="goal-current" 
            type="number" 
            v-model="newGoal.currentAmount"
            placeholder="0.00"
            step="0.01"
            min="0"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="goal-date">Target Date</label>
          <input 
            id="goal-date" 
            type="date" 
            v-model="newGoal.targetDate"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="goal-category">Category</label>
          <input 
            id="goal-category" 
            type="text" 
            v-model="newGoal.category"
            placeholder="e.g. Savings, Travel, Education"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label>Color</label>
          <div class="color-options">
            <div 
              v-for="color in colorOptions" 
              :key="color"
              class="color-option"
              :class="{ 'selected': newGoal.color === color }"
              :style="{ backgroundColor: color }"
              @click="newGoal.color = color"
            ></div>
          </div>
        </div>
        
        <div class="form-group form-group-full">
          <label for="goal-notes">Notes (optional)</label>
          <textarea 
            id="goal-notes" 
            v-model="newGoal.notes"
            placeholder="Any details about this savings goal"
            class="form-textarea"
          ></textarea>
        </div>
      </div>
      
      <div class="form-actions">
        <button @click="resetForm" class="btn btn-secondary">Cancel</button>
        <button @click="addSavingsGoal" class="btn btn-primary">Create Goal</button>
      </div>
    </div>
    
    <!-- Total Savings Summary -->
    <div class="savings-summary">
      <div class="summary-card">
        <div class="summary-item">
          <span class="summary-label">Total Saved</span>
          <span class="summary-value">{{ formatCurrency(totalSavings) }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Total Goal Amount</span>
          <span class="summary-value">{{ formatCurrency(totalGoalAmount) }}</span>
        </div>
        <div class="summary-progress">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${overallProgress}%` }"
            ></div>
          </div>
          <div class="progress-text">
            <span>{{ Math.round(overallProgress) }}% of total goals</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Savings Goals -->
    <div class="savings-goals">
      <div 
        v-for="goal in sortedGoals" 
        :key="goal.id"
        class="goal-card"
      >
        <div 
          class="goal-color-indicator" 
          :style="{ backgroundColor: goal.color }"
        ></div>
        
        <div class="goal-header">
          <h3 class="goal-title">{{ goal.name }}</h3>
          <span 
            class="goal-status-badge"
            :class="{
              'completed': calculateStatus(goal) === 'completed',
              'ahead': calculateStatus(goal) === 'ahead',
              'on-track': calculateStatus(goal) === 'on-track',
              'behind': calculateStatus(goal) === 'behind'
            }"
          >
            {{ 
              calculateStatus(goal) === 'completed' ? 'Completed' :
              calculateStatus(goal) === 'ahead' ? 'Ahead' :
              calculateStatus(goal) === 'on-track' ? 'On Track' :
              'Behind'
            }}
          </span>
        </div>
        
        <div class="goal-category">{{ goal.category }}</div>
        
        <div class="goal-amounts">
          <div class="amount-row">
            <span class="amount-value current-amount">{{ formatCurrency(goal.currentAmount) }}</span>
            <span class="amount-divider">of</span>
            <span class="amount-value target-amount">{{ formatCurrency(goal.targetAmount) }}</span>
          </div>
        </div>
        
        <div class="goal-progress">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ 
                width: `${Math.min(calculateProgress(goal.currentAmount, goal.targetAmount), 100)}%`,
                backgroundColor: goal.color
              }"
            ></div>
          </div>
          <div class="progress-text">
            <span>{{ Math.round(calculateProgress(goal.currentAmount, goal.targetAmount)) }}% complete</span>
          </div>
        </div>
        
        <div class="goal-dates">
          <div class="date-row">
            <span class="date-label">Target Date:</span>
            <span class="date-value">{{ formatDate(goal.targetDate) }}</span>
          </div>
          <div class="date-row">
            <span class="date-label">Days Remaining:</span>
            <span 
              class="date-value"
              :class="{ 'date-urgent': calculateRemainingDays(goal.targetDate) < 30 }"
            >
              {{ Math.max(0, calculateRemainingDays(goal.targetDate)) }} days
            </span>
          </div>
        </div>
        
        <div v-if="goal.notes" class="goal-notes">
          <p>{{ goal.notes }}</p>
        </div>
        
        <div class="goal-actions">
          <button 
            @click="addContribution(goal)" 
            class="btn btn-primary"
            :disabled="calculateStatus(goal) === 'completed'"
          >
            Add Contribution
          </button>
          <button @click="deleteGoal(goal.id)" class="btn btn-secondary">
            Delete
          </button>
        </div>
      </div>
      
      <div v-if="savingsGoals.length === 0" class="no-goals-message">
        <p>You don't have any savings goals set up yet.</p>
        <button @click="toggleAddForm" class="btn btn-primary">Create Your First Goal</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.savings-container {
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.75rem;
  margin: 0;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

.btn:hover:not(:disabled) {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-secondary {
  background-color: var(--color-background-mute);
  color: var(--color-text);
}

.add-goal-form {
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-goal-form h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 0.5rem;
}

.form-group-full {
  grid-column: span 2;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.color-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.color-option {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: var(--color-text);
  transform: scale(1.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.savings-summary {
  margin-bottom: 2rem;
}

.summary-card {
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.summary-label {
  font-weight: 500;
}

.summary-value {
  font-weight: 600;
}

.summary-progress {
  margin-top: 1rem;
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

.progress-text {
  text-align: right;
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.savings-goals {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.goal-card {
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.goal-color-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0.25rem;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-top: 0.5rem;
}

.goal-title {
  font-size: 1.25rem;
  margin: 0;
  color: var(--color-heading);
}

.goal-status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-weight: 600;
}

.goal-status-badge.completed {
  background-color: #4caf50;
  color: white;
}

.goal-status-badge.ahead {
  background-color: #2196f3;
  color: white;
}

.goal-status-badge.on-track {
  background-color: #ff9800;
  color: white;
}

.goal-status-badge.behind {
  background-color: #f44336;
  color: white;
}

.goal-category {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 1.25rem;
}

.goal-amounts {
  margin-bottom: 1rem;
}

.amount-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.amount-value {
  font-weight: 600;
}

.amount-divider {
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.current-amount {
  font-size: 1.25rem;
}

.target-amount {
  color: var(--color-text-light);
}

.goal-progress {
  margin-bottom: 1.5rem;
}

.goal-dates {
  margin-bottom: 1.5rem;
}

.date-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.date-label {
  color: var(--color-text-light);
}

.date-value {
  font-weight: 500;
}

.date-urgent {
  color: #f44336;
}

.goal-notes {
  font-size: 0.875rem;
  color: var(--color-text-light);
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
  margin-bottom: 1.5rem;
}

.goal-notes p {
  margin: 0;
}

.goal-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.no-goals-message {
  grid-column: span 3;
  text-align: center;
  padding: 3rem;
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
}

.no-goals-message p {
  margin-bottom: 1.5rem;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group-full {
    grid-column: 1;
  }
  
  .goal-actions {
    flex-direction: column;
  }
}
</style>