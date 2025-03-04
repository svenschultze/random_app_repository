<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showAddForm = ref(false)
const budgets = ref([])
const userData = ref(null)
const transactions = ref([])
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

// Form data for new budget
const newBudget = ref({
  category: '',
  amount: '',
  notes: ''
})

// Predefined categories
const availableCategories = [
  'Housing', 'Food', 'Transportation', 'Entertainment', 
  'Shopping', 'Utilities', 'Healthcare', 'Education', 
  'Savings', 'Other'
]

// Month names for display
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

onMounted(() => {
  loadUserData()
  loadBudgets()
  loadTransactions()
  
  // Check if new budget form should be shown
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

const loadBudgets = () => {
  // Load from localStorage or use mock data
  const savedBudgets = localStorage.getItem('budgetBuddyBudgets')
  if (savedBudgets) {
    budgets.value = JSON.parse(savedBudgets)
  } else {
    // Use mock data for demo
    budgets.value = [
      { id: 1, category: 'Housing', amount: 1200, notes: 'Rent and utilities' },
      { id: 2, category: 'Food', amount: 500, notes: 'Groceries and eating out' },
      { id: 3, category: 'Transportation', amount: 300, notes: 'Gas and public transit' },
      { id: 4, category: 'Entertainment', amount: 150, notes: 'Movies, games, streaming' },
      { id: 5, category: 'Utilities', amount: 200, notes: 'Electricity, water, internet' },
      { id: 6, category: 'Savings', amount: 400, notes: 'Emergency fund' }
    ]
    saveBudgets()
  }
}

const loadTransactions = () => {
  // Load transactions to calculate spending by category
  const savedTransactions = localStorage.getItem('budgetBuddyTransactions')
  if (savedTransactions) {
    transactions.value = JSON.parse(savedTransactions)
  } else {
    // Use mock data if none exists
    transactions.value = []
  }
}

const saveBudgets = () => {
  localStorage.setItem('budgetBuddyBudgets', JSON.stringify(budgets.value))
}

const addBudget = () => {
  // Validate form
  if (!newBudget.value.category || !newBudget.value.amount) {
    alert('Please fill in all required fields')
    return
  }
  
  // Check if category already exists
  if (budgets.value.some(b => b.category === newBudget.value.category)) {
    alert('This category already has a budget. Please edit the existing one instead.')
    return
  }
  
  // Create new budget object
  const budget = {
    id: Date.now(),
    category: newBudget.value.category,
    amount: parseFloat(newBudget.value.amount),
    notes: newBudget.value.notes
  }
  
  // Add to budgets and save
  budgets.value.push(budget)
  saveBudgets()
  
  // Reset form
  resetForm()
}

const updateBudget = (budget) => {
  const amount = prompt('Enter new budget amount:', budget.amount)
  if (amount !== null && !isNaN(amount) && parseFloat(amount) >= 0) {
    budget.amount = parseFloat(amount)
    saveBudgets()
  }
}

const deleteBudget = (id) => {
  if (confirm('Are you sure you want to delete this budget?')) {
    budgets.value = budgets.value.filter(b => b.id !== id)
    saveBudgets()
  }
}

const resetForm = () => {
  newBudget.value = {
    category: '',
    amount: '',
    notes: ''
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

// Calculate total budget amount
const totalBudget = computed(() => {
  return budgets.value.reduce((sum, budget) => sum + budget.amount, 0)
})

// Get unused categories for the dropdown
const unusedCategories = computed(() => {
  const usedCategories = new Set(budgets.value.map(b => b.category))
  return availableCategories.filter(category => !usedCategories.has(category))
})

// Calculate spending for current month by category
const categorySpending = computed(() => {
  const spending = {}
  
  // Initialize all budget categories with zero spending
  budgets.value.forEach(budget => {
    spending[budget.category] = 0
  })
  
  // Sum up all expenses for the current month by category
  transactions.value.forEach(transaction => {
    const transactionDate = new Date(transaction.date)
    const transactionMonth = transactionDate.getMonth()
    const transactionYear = transactionDate.getFullYear()
    
    // Only count transactions from current month and year
    if (
      transactionMonth === currentMonth.value && 
      transactionYear === currentYear.value &&
      transaction.amount < 0 && // Only count expenses
      spending[transaction.category] !== undefined
    ) {
      spending[transaction.category] += Math.abs(transaction.amount)
    }
  })
  
  return spending
})

// Calculate budget progress data for each category
const budgetProgress = computed(() => {
  return budgets.value.map(budget => {
    const spent = categorySpending.value[budget.category] || 0
    const remaining = budget.amount - spent
    const percentUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0
    const status = 
      percentUsed >= 100 ? 'over' :
      percentUsed >= 80 ? 'warning' :
      'good'
      
    return {
      ...budget,
      spent,
      remaining,
      percentUsed,
      status
    }
  })
})

// Increment/decrement month
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// Format the current month and year
const formattedMonthYear = computed(() => {
  return `${monthNames[currentMonth.value]} ${currentYear.value}`
})
</script>

<template>
  <div class="budgets-container">
    <header class="section-header">
      <h2>Budget Planning</h2>
      <button @click="toggleAddForm" class="btn btn-primary">
        {{ showAddForm ? 'Cancel' : 'Add New Budget' }}
      </button>
    </header>
    
    <!-- Add Budget Form -->
    <div v-if="showAddForm" class="add-budget-form">
      <h3>Create New Budget</h3>
      <div class="form-grid">
        <div class="form-group">
          <label for="budget-category">Category</label>
          <select 
            id="budget-category" 
            v-model="newBudget.category"
            class="form-select"
          >
            <option value="" disabled>Select category</option>
            <option 
              v-for="category in unusedCategories" 
              :key="category" 
              :value="category"
            >
              {{ category }}
            </option>
            <option v-if="unusedCategories.length === 0" disabled>
              All categories have budgets
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="budget-amount">Monthly Amount</label>
          <input 
            id="budget-amount" 
            type="number" 
            v-model="newBudget.amount"
            placeholder="0.00"
            step="0.01"
            min="0"
            class="form-input"
          >
        </div>
        
        <div class="form-group form-group-full">
          <label for="budget-notes">Notes (optional)</label>
          <textarea 
            id="budget-notes" 
            v-model="newBudget.notes"
            placeholder="Any details about this budget category"
            class="form-textarea"
          ></textarea>
        </div>
      </div>
      
      <div class="form-actions">
        <button @click="resetForm" class="btn btn-secondary">Cancel</button>
        <button @click="addBudget" class="btn btn-primary">Create Budget</button>
      </div>
    </div>
    
    <!-- Total Budget Summary -->
    <div class="budget-summary">
      <div class="summary-card">
        <div class="summary-item">
          <span class="summary-label">Total Monthly Budget</span>
          <span class="summary-value">{{ formatCurrency(totalBudget) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Month Navigation -->
    <div class="month-navigation">
      <button @click="prevMonth" class="month-nav-btn">
        ◀
      </button>
      <h3 class="current-month">{{ formattedMonthYear }}</h3>
      <button @click="nextMonth" class="month-nav-btn">
        ▶
      </button>
    </div>
    
    <!-- Budget Categories -->
    <div class="budget-categories">
      <div 
        v-for="budget in budgetProgress" 
        :key="budget.id"
        class="budget-card"
      >
        <div class="budget-header">
          <h3 class="budget-title">{{ budget.category }}</h3>
          <div class="budget-actions">
            <button @click="updateBudget(budget)" class="btn-icon edit-btn">✎</button>
            <button @click="deleteBudget(budget.id)" class="btn-icon delete-btn">×</button>
          </div>
        </div>
        
        <div class="budget-amounts">
          <div class="amount-row">
            <span class="amount-label">Budget</span>
            <span class="amount-value">{{ formatCurrency(budget.amount) }}</span>
          </div>
          <div class="amount-row">
            <span class="amount-label">Spent</span>
            <span class="amount-value">{{ formatCurrency(budget.spent) }}</span>
          </div>
          <div class="amount-row">
            <span class="amount-label">Remaining</span>
            <span 
              class="amount-value" 
              :class="{ 
                'negative': budget.remaining < 0,
                'warning': budget.remaining >= 0 && budget.percentUsed >= 80
              }"
            >
              {{ formatCurrency(budget.remaining) }}
            </span>
          </div>
        </div>
        
        <div class="budget-progress">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${Math.min(budget.percentUsed, 100)}%` }"
              :class="{ 
                'warning': budget.status === 'warning', 
                'danger': budget.status === 'over' 
              }"
            ></div>
          </div>
          <div class="progress-text">
            <span>{{ Math.round(budget.percentUsed) }}% used</span>
          </div>
        </div>
        
        <div v-if="budget.notes" class="budget-notes">
          <p>{{ budget.notes }}</p>
        </div>
      </div>
      
      <div v-if="budgets.length === 0" class="no-budgets-message">
        <p>You don't have any budgets set up yet.</p>
        <button @click="toggleAddForm" class="btn btn-primary">Create Your First Budget</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.budgets-container {
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

.btn:hover {
  opacity: 0.9;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-secondary {
  background-color: var(--color-background-mute);
  color: var(--color-text);
}

.add-budget-form {
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-budget-form h3 {
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.budget-summary {
  margin-bottom: 2rem;
}

.summary-card {
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 600;
}

.month-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.month-nav-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--color-text);
}

.current-month {
  margin: 0 1.5rem;
  font-size: 1.25rem;
}

.budget-categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.budget-card {
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.budget-title {
  font-size: 1.25rem;
  margin: 0;
  color: var(--color-heading);
}

.budget-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--color-text-light);
  padding: 0.25rem;
}

.edit-btn:hover {
  color: #2196f3;
}

.delete-btn:hover {
  color: #f44336;
}

.budget-amounts {
  margin-bottom: 1.25rem;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.amount-label {
  color: var(--color-text-light);
}

.amount-value {
  font-weight: 500;
}

.negative {
  color: #f44336;
}

.warning {
  color: #ff9800;
}

.budget-progress {
  margin-bottom: 1rem;
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

.progress-fill.warning {
  background-color: #ff9800;
}

.progress-fill.danger {
  background-color: #f44336;
}

.progress-text {
  text-align: right;
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.budget-notes {
  font-size: 0.875rem;
  color: var(--color-text-light);
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
  margin-top: 1rem;
}

.budget-notes p {
  margin: 0;
}

.no-budgets-message {
  grid-column: span 3;
  text-align: center;
  padding: 3rem;
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
}

.no-budgets-message p {
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
}
</style>