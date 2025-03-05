<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showAddForm = ref(false)
const transactions = ref([])
const filterCategory = ref('all')
const searchQuery = ref('')
const sortBy = ref('date')
const sortDirection = ref('desc')
const userData = ref(null)

// Form data for new transaction
const newTransaction = ref({
  date: new Date().toISOString().split('T')[0],
  description: '',
  amount: '',
  category: '',
  notes: '',
  type: 'expense'
})

// Categories for dropdown
const categories = [
  'Housing', 'Food', 'Transportation', 'Entertainment', 
  'Shopping', 'Utilities', 'Healthcare', 'Education', 
  'Savings', 'Income', 'Other'
]

onMounted(() => {
  loadUserData()
  loadTransactions()
  
  // Check if new transaction form should be shown
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

const loadTransactions = () => {
  // Load from localStorage or use mock data
  const savedTransactions = localStorage.getItem('budgetBuddyTransactions')
  if (savedTransactions) {
    transactions.value = JSON.parse(savedTransactions)
  } else {
    // Use mock data for demo
    transactions.value = [
      { id: 1, date: '2025-03-02', category: 'Food', description: 'Grocery Store', amount: -85.27, type: 'expense', notes: 'Weekly groceries' },
      { id: 2, date: '2025-03-01', category: 'Transportation', description: 'Gas Station', amount: -45.50, type: 'expense', notes: 'Fill up tank' },
      { id: 3, date: '2025-02-28', category: 'Entertainment', description: 'Movie Tickets', amount: -32.00, type: 'expense', notes: 'Weekend movie' },
      { id: 4, date: '2025-02-28', category: 'Income', description: 'Salary', amount: 2750.00, type: 'income', notes: 'Monthly salary' },
      { id: 5, date: '2025-02-27', category: 'Shopping', description: 'Online Store', amount: -65.99, type: 'expense', notes: 'New headphones' },
      { id: 6, date: '2025-02-26', category: 'Utilities', description: 'Electric Bill', amount: -89.75, type: 'expense', notes: 'Monthly bill' },
      { id: 7, date: '2025-02-25', category: 'Food', description: 'Restaurant', amount: -42.30, type: 'expense', notes: 'Dinner with friends' },
      { id: 8, date: '2025-02-24', category: 'Transportation', description: 'Subway Fare', amount: -25.00, type: 'expense', notes: 'Monthly pass' },
      { id: 9, date: '2025-02-20', category: 'Housing', description: 'Rent', amount: -1200.00, type: 'expense', notes: 'Monthly rent' },
      { id: 10, date: '2025-02-15', category: 'Income', description: 'Side Job', amount: 350.00, type: 'income', notes: 'Freelance project' }
    ]
    saveTransactions()
  }
}

const saveTransactions = () => {
  localStorage.setItem('budgetBuddyTransactions', JSON.stringify(transactions.value))
}

const addTransaction = () => {
  // Validate form
  if (!newTransaction.value.description || !newTransaction.value.amount || !newTransaction.value.category) {
    alert('Please fill in all required fields')
    return
  }
  
  // Create new transaction object
  const transaction = {
    id: Date.now(),
    date: newTransaction.value.date,
    description: newTransaction.value.description,
    category: newTransaction.value.category,
    notes: newTransaction.value.notes,
    type: newTransaction.value.type,
    amount: newTransaction.value.type === 'expense' 
      ? -Math.abs(parseFloat(newTransaction.value.amount))
      : Math.abs(parseFloat(newTransaction.value.amount))
  }
  
  // Add to transactions and save
  transactions.value.unshift(transaction)
  saveTransactions()
  
  // Reset form
  resetForm()
}

const resetForm = () => {
  newTransaction.value = {
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: '',
    notes: '',
    type: 'expense'
  }
  showAddForm.value = false
}

const deleteTransaction = (id) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    transactions.value = transactions.value.filter(t => t.id !== id)
    saveTransactions()
  }
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

// Sorting
const toggleSort = (field) => {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortDirection.value = 'desc'
  }
}

// Filtered and sorted transactions
const filteredTransactions = computed(() => {
  let result = [...transactions.value]
  
  // Apply category filter
  if (filterCategory.value !== 'all') {
    result = result.filter(t => t.category === filterCategory.value)
  }
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t => 
      t.description.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      t.notes.toLowerCase().includes(query)
    )
  }
  
  // Apply sorting
  result.sort((a, b) => {
    let comparison = 0
    
    if (sortBy.value === 'date') {
      comparison = new Date(a.date) - new Date(b.date)
    } else if (sortBy.value === 'amount') {
      comparison = a.amount - b.amount
    } else if (sortBy.value === 'description') {
      comparison = a.description.localeCompare(b.description)
    } else if (sortBy.value === 'category') {
      comparison = a.category.localeCompare(b.category)
    }
    
    return sortDirection.value === 'asc' ? comparison : -comparison
  })
  
  return result
})

// Summary statistics
const transactionSummary = computed(() => {
  const total = transactions.value.reduce((sum, t) => sum + t.amount, 0)
  const income = transactions.value
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.value
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0)
    
  return {
    total,
    income,
    expenses
  }
})

// Get unique categories from transactions
const uniqueCategories = computed(() => {
  const cats = new Set(transactions.value.map(t => t.category))
  return ['all', ...Array.from(cats)]
})
</script>

<template>
  <div class="transactions-container">
    <header class="section-header">
      <h2>Transactions</h2>
      <button @click="toggleAddForm" class="btn btn-primary" v-voix="'ToggleTransactionForm'" hint="Toggle form to add a new transaction">
        {{ showAddForm ? 'Cancel' : 'Add New Transaction' }}
      </button>
    </header>
    
    <!-- Add Transaction Form -->
    <div v-if="showAddForm" class="add-transaction-form">
      <h3>Add New Transaction</h3>
      <div class="form-grid">
        <div class="form-group">
          <label for="transaction-date">Date</label>
          <input 
            id="transaction-date" 
            type="date" 
            v-model="newTransaction.date"
            class="form-input"
            v-voix="'TransactionDateInput'"
            hint="Select the date when this transaction occurred"
          >
        </div>
        
        <div class="form-group">
          <label for="transaction-type">Type</label>
          <div class="segmented-control">
            <button 
              @click="newTransaction.type = 'expense'"
              :class="{ active: newTransaction.type === 'expense' }"
              class="segment"
              v-voix="'ExpenseTypeButton'"
              hint="Select expense transaction type for money spent"
            >
              Expense
            </button>
            <button 
              @click="newTransaction.type = 'income'"
              :class="{ active: newTransaction.type === 'income' }"
              class="segment"
              v-voix="'IncomeTypeButton'"
              hint="Select income transaction type for money received"
            >
              Income
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label for="transaction-description">Description</label>
          <input 
            id="transaction-description" 
            type="text" 
            v-model="newTransaction.description"
            placeholder="e.g. Grocery shopping"
            class="form-input"
            v-voix="'TransactionDescriptionInput'"
            hint="Enter a short description of what this transaction was for"
          >
        </div>
        
        <div class="form-group">
          <label for="transaction-amount">Amount</label>
          <input 
            id="transaction-amount" 
            type="number" 
            v-model="newTransaction.amount"
            placeholder="0.00"
            step="0.01"
            min="0"
            class="form-input"
            v-voix="'TransactionAmountInput'"
            hint="Enter the transaction amount in your currency"
          >
        </div>
        
        <div class="form-group">
          <label for="transaction-category">Category</label>
          <select 
            id="transaction-category" 
            v-model="newTransaction.category"
            class="form-select"
            v-voix="'TransactionCategorySelect'"
            hint="Select a category for this transaction"
          >
            <option value="" disabled>Select category</option>
            <option 
              v-for="category in categories" 
              :key="category" 
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="transaction-notes">Notes (optional)</label>
          <textarea 
            id="transaction-notes" 
            v-model="newTransaction.notes"
            placeholder="Any additional details"
            class="form-textarea"
            v-voix="'TransactionNotesInput'" 
            hint="Optional notes about this transaction"
          ></textarea>
        </div>
      </div>
      
      <div class="form-actions">
        <button @click="resetForm" class="btn btn-secondary" v-voix="'CancelTransactionButton'" hint="Cancel creating this transaction">Cancel</button>
        <button @click="addTransaction" class="btn btn-primary" v-voix="'SaveTransactionButton'" hint="Save this transaction to your records">Save Transaction</button>
      </div>
    </div>
    
    <!-- Transaction Summary -->
    <div class="transaction-summary">
      <div class="summary-card">
        <div class="summary-item">
          <span class="summary-label">Total Balance</span>
          <span 
            class="summary-value" 
            :class="{ 'positive': transactionSummary.total > 0, 'negative': transactionSummary.total < 0 }"
          >
            {{ formatCurrency(transactionSummary.total) }}
          </span>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-item">
          <span class="summary-label">Total Income</span>
          <span class="summary-value positive">{{ formatCurrency(transactionSummary.income) }}</span>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-item">
          <span class="summary-label">Total Expenses</span>
          <span class="summary-value negative">{{ formatCurrency(transactionSummary.expenses) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Transaction Filters -->
    <div class="transaction-filters">
      <div class="filter-group">
        <label for="category-filter">Category</label>
        <select 
          id="category-filter" 
          v-model="filterCategory"
          class="filter-select"
          v-voix="'CategoryFilterSelect'"
          hint="Filter transactions by category"
        >
          <option 
            v-for="category in uniqueCategories" 
            :key="category" 
            :value="category"
          >
            {{ category === 'all' ? 'All Categories' : category }}
          </option>
        </select>
      </div>
      
      <div class="filter-group search-group">
        <label for="search-filter">Search</label>
        <input 
          id="search-filter" 
          type="text" 
          v-model="searchQuery"
          placeholder="Search transactions..."
          class="filter-input"
          v-voix="'TransactionSearchInput'"
          hint="Search for transactions by description or other details"
        >
      </div>
    </div>
    
    <!-- Transactions Table -->
    <div class="transactions-table-container">
      <table class="transactions-table">
        <thead>
          <tr>
            <th @click="toggleSort('date')" class="sortable" v-voix="'SortByDate'" hint="Sort transactions by date">
              Date
              <span v-if="sortBy === 'date'" class="sort-indicator">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="toggleSort('description')" class="sortable" v-voix="'SortByDescription'" hint="Sort transactions by description">
              Description
              <span v-if="sortBy === 'description'" class="sort-indicator">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="toggleSort('category')" class="sortable" v-voix="'SortByCategory'" hint="Sort transactions by category">
              Category
              <span v-if="sortBy === 'category'" class="sort-indicator">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="toggleSort('amount')" class="sortable" v-voix="'SortByAmount'" hint="Sort transactions by amount">
              Amount
              <span v-if="sortBy === 'amount'" class="sort-indicator">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredTransactions.length === 0">
            <td colspan="5" class="no-data">No transactions found</td>
          </tr>
          <tr 
            v-for="transaction in filteredTransactions" 
            :key="transaction.id"
            :class="{ 'income-row': transaction.amount > 0 }"
          >
            <td>{{ formatDate(transaction.date) }}</td>
            <td>
              <div class="transaction-desc">
                {{ transaction.description }}
                <span v-if="transaction.notes" class="transaction-notes">{{ transaction.notes }}</span>
              </div>
            </td>
            <td>{{ transaction.category }}</td>
            <td :class="transaction.amount > 0 ? 'positive' : 'negative'">
              {{ formatCurrency(transaction.amount) }}
            </td>
            <td>
              <button @click="deleteTransaction(transaction.id)" class="btn-icon delete-btn" v-voix="'DeleteTransaction'" hint="Delete this transaction">
                ×
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.transactions-container {
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

.add-transaction-form {
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-transaction-form h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 0.5rem;
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

.segmented-control {
  display: flex;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  overflow: hidden;
}

.segment {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background-color: var(--color-background);
  cursor: pointer;
  text-align: center;
  font-weight: 500;
}

.segment.active {
  background-color: #4caf50;
  color: white;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.transaction-summary {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
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

.positive {
  color: #4caf50;
}

.negative {
  color: #f44336;
}

.transaction-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.search-group {
  flex-grow: 1;
}

.filter-select, .filter-input {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background-color: var(--color-background);
  color: var(--color-text);
}

.transactions-table-container {
  overflow-x: auto;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--color-border);
}

.transactions-table th, .transactions-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.transactions-table th {
  background-color: var(--color-background-soft);
  font-weight: 600;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sort-indicator {
  margin-left: 0.5rem;
}

.transaction-desc {
  display: flex;
  flex-direction: column;
}

.transaction-notes {
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-top: 0.25rem;
}

.income-row {
  background-color: rgba(76, 175, 80, 0.05);
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--color-text-light);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.delete-btn:hover {
  color: #f44336;
}

.no-data {
  text-align: center;
  padding: 2rem !important;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .transaction-summary {
    grid-template-columns: 1fr;
  }
}
</style>