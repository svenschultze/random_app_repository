<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userData = ref(null)
const isOnboarded = ref(false)
const recentTransactions = ref([])
const budgetSummary = ref([])

onMounted(() => {
  checkOnboarding()
  loadUserData()
  loadMockData()
})

const checkOnboarding = () => {
  const completed = localStorage.getItem('budgetBuddyOnboardingComplete')
  isOnboarded.value = completed === 'true'
  
  if (!isOnboarded.value) {
    router.push('/onboarding')
  }
}

const loadUserData = () => {
  const data = localStorage.getItem('budgetBuddyUserData')
  if (data) {
    userData.value = JSON.parse(data)
  }
}

const loadMockData = () => {
  // Mock data for demo purposes
  recentTransactions.value = [
    { id: 1, date: '2025-03-02', category: 'Food', description: 'Grocery Store', amount: -85.27 },
    { id: 2, date: '2025-03-01', category: 'Transportation', description: 'Gas Station', amount: -45.50 },
    { id: 3, date: '2025-02-28', category: 'Entertainment', description: 'Movie Tickets', amount: -32.00 },
    { id: 4, date: '2025-02-28', category: 'Income', description: 'Salary', amount: 2750.00 },
    { id: 5, date: '2025-02-27', category: 'Shopping', description: 'Online Store', amount: -65.99 }
  ]
  
  budgetSummary.value = [
    { category: 'Housing', budgeted: 1200, spent: 1100, remaining: 100 },
    { category: 'Food', budgeted: 500, spent: 320, remaining: 180 },
    { category: 'Transportation', budgeted: 300, spent: 275, remaining: 25 },
    { category: 'Utilities', budgeted: 200, spent: 180, remaining: 20 },
    { category: 'Savings', budgeted: 400, spent: 400, remaining: 0 }
  ]
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
    month: 'short', 
    day: 'numeric' 
  }).format(date)
}

const totalBudget = computed(() => {
  return budgetSummary.value.reduce((sum, item) => sum + item.budgeted, 0)
})

const totalSpent = computed(() => {
  return budgetSummary.value.reduce((sum, item) => sum + item.spent, 0)
})

const totalRemaining = computed(() => {
  return totalBudget.value - totalSpent.value
})

const percentSpent = computed(() => {
  return totalBudget.value > 0 ? (totalSpent.value / totalBudget.value) * 100 : 0
})
</script>

<template>
  <div class="home-container">
    <header class="section-header">
      <h2>Dashboard</h2>
      <p v-if="userData">Welcome back, {{ userData.name }}!</p>
    </header>
    
    <div class="dashboard-grid">
      <!-- Budget Overview Card -->
      <div class="dashboard-card budget-overview">
        <h3 class="card-title">Monthly Budget Overview</h3>
        <div class="budget-progress">
          <div class="progress-container">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: `${percentSpent}%` }"
                :class="{ 
                  'warning': percentSpent > 70 && percentSpent < 90, 
                  'danger': percentSpent >= 90 
                }"
              ></div>
            </div>
            <div class="progress-labels">
              <span>{{ formatCurrency(totalSpent) }}</span>
              <span>{{ formatCurrency(totalBudget) }}</span>
            </div>
          </div>
          <div class="budget-summary">
            <div class="budget-metric">
              <span class="metric-label">Total Budget</span>
              <span class="metric-value">{{ formatCurrency(totalBudget) }}</span>
            </div>
            <div class="budget-metric">
              <span class="metric-label">Spent</span>
              <span class="metric-value">{{ formatCurrency(totalSpent) }}</span>
            </div>
            <div class="budget-metric">
              <span class="metric-label">Remaining</span>
              <span class="metric-value">{{ formatCurrency(totalRemaining) }}</span>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <RouterLink to="/budgets" class="card-link">View all budgets</RouterLink>
        </div>
      </div>
      
      <!-- Recent Transactions Card -->
      <div class="dashboard-card recent-transactions">
        <h3 class="card-title">Recent Transactions</h3>
        <div class="transactions-list">
          <div 
            v-for="transaction in recentTransactions" 
            :key="transaction.id"
            class="transaction-item"
          >
            <div class="transaction-details">
              <div class="transaction-main">
                <span class="transaction-description">{{ transaction.description }}</span>
                <span 
                  class="transaction-amount" 
                  :class="{ 'positive': transaction.amount > 0 }"
                >
                  {{ formatCurrency(transaction.amount) }}
                </span>
              </div>
              <div class="transaction-meta">
                <span class="transaction-date">{{ formatDate(transaction.date) }}</span>
                <span class="transaction-category">{{ transaction.category }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <RouterLink to="/transactions" class="card-link">View all transactions</RouterLink>
        </div>
      </div>
      
      <!-- Budget Categories Card -->
      <div class="dashboard-card budget-categories">
        <h3 class="card-title">Budget Categories</h3>
        <div class="categories-list">
          <div 
            v-for="(budget, index) in budgetSummary" 
            :key="index"
            class="category-item"
          >
            <div class="category-header">
              <span class="category-name">{{ budget.category }}</span>
              <span class="category-amount">
                {{ formatCurrency(budget.spent) }} / {{ formatCurrency(budget.budgeted) }}
              </span>
            </div>
            <div class="category-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${(budget.spent / budget.budgeted) * 100}%` }"
                  :class="{ 
                    'warning': (budget.spent / budget.budgeted) > 0.7 && (budget.spent / budget.budgeted) < 0.9, 
                    'danger': (budget.spent / budget.budgeted) >= 0.9 
                  }"
                ></div>
              </div>
            </div>
            <div class="category-remaining">
              <span>Remaining: {{ formatCurrency(budget.remaining) }}</span>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <RouterLink to="/budgets" class="card-link">Manage budgets</RouterLink>
        </div>
      </div>
      
      <!-- Quick Actions Card -->
      <div class="dashboard-card quick-actions">
        <h3 class="card-title">Quick Actions</h3>
        <div class="actions-grid">
          <RouterLink to="/transactions?new=true" class="action-button">
            <span class="action-icon">+</span>
            <span class="action-label">Add Transaction</span>
          </RouterLink>
          <RouterLink to="/budgets?new=true" class="action-button">
            <span class="action-icon">📊</span>
            <span class="action-label">New Budget</span>
          </RouterLink>
          <RouterLink to="/savings?new=true" class="action-button">
            <span class="action-icon">💰</span>
            <span class="action-label">Set Savings Goal</span>
          </RouterLink>
          <RouterLink to="/analytics" class="action-button">
            <span class="action-icon">📈</span>
            <span class="action-label">View Reports</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.dashboard-card {
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
  color: var(--color-heading);
}

.budget-overview, .recent-transactions, .budget-categories {
  grid-column: span 2;
}

.quick-actions {
  grid-column: span 2;
}

.progress-container {
  margin-bottom: 1.5rem;
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

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.budget-summary {
  display: flex;
  justify-content: space-between;
}

.budget-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0.25rem;
}

.metric-value {
  font-weight: 600;
}

.transactions-list {
  margin-bottom: 1rem;
}

.transaction-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-main {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.transaction-description {
  font-weight: 500;
}

.transaction-amount {
  font-weight: 600;
}

.transaction-amount.positive {
  color: #4caf50;
}

.transaction-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.categories-list {
  margin-bottom: 1rem;
}

.category-item {
  margin-bottom: 1rem;
}

.category-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.category-name {
  font-weight: 500;
}

.category-amount {
  font-size: 0.875rem;
}

.category-remaining {
  text-align: right;
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-top: 0.25rem;
}

.card-footer {
  margin-top: auto;
  padding-top: 1rem;
  text-align: right;
}

.card-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
}

.card-link:hover {
  text-decoration: underline;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background-color: var(--color-background);
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--color-text);
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: var(--color-background-mute);
}

.action-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.action-label {
  font-size: 0.875rem;
  text-align: center;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .budget-overview, .recent-transactions, .budget-categories, .quick-actions {
    grid-column: span 1;
  }
  
  .budget-summary {
    flex-direction: column;
    gap: 1rem;
  }
  
  .budget-metric {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>