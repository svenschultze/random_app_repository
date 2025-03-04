<script setup>
import { ref, onMounted, computed } from 'vue'

const userData = ref(null)
const transactions = ref([])
const budgets = ref([])
const reportType = ref('spending') // 'spending', 'income', 'trends'
const timeRange = ref('month') // 'month', 'quarter', 'year'
const startDate = ref('')
const endDate = ref('')

onMounted(() => {
  loadUserData()
  loadTransactions()
  loadBudgets()
  setDefaultDateRange()
})

const loadUserData = () => {
  const data = localStorage.getItem('budgetBuddyUserData')
  if (data) {
    userData.value = JSON.parse(data)
  }
}

const loadTransactions = () => {
  const savedTransactions = localStorage.getItem('budgetBuddyTransactions')
  if (savedTransactions) {
    transactions.value = JSON.parse(savedTransactions)
  } else {
    transactions.value = []
  }
}

const loadBudgets = () => {
  const savedBudgets = localStorage.getItem('budgetBuddyBudgets')
  if (savedBudgets) {
    budgets.value = JSON.parse(savedBudgets)
  } else {
    budgets.value = []
  }
}

const setDefaultDateRange = () => {
  const today = new Date()
  
  if (timeRange.value === 'month') {
    // Start from first day of current month
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    startDate.value = firstDay.toISOString().split('T')[0]
    endDate.value = today.toISOString().split('T')[0]
  } else if (timeRange.value === 'quarter') {
    // Start from 3 months ago
    const threeMonthsAgo = new Date(today)
    threeMonthsAgo.setMonth(today.getMonth() - 3)
    startDate.value = threeMonthsAgo.toISOString().split('T')[0]
    endDate.value = today.toISOString().split('T')[0]
  } else if (timeRange.value === 'year') {
    // Start from 1 year ago
    const oneYearAgo = new Date(today)
    oneYearAgo.setFullYear(today.getFullYear() - 1)
    startDate.value = oneYearAgo.toISOString().split('T')[0]
    endDate.value = today.toISOString().split('T')[0]
  }
}

const updateDateRange = () => {
  setDefaultDateRange()
}

const formatCurrency = (amount) => {
  const currency = userData.value?.currency || 'USD'
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: currency 
  }).format(amount)
}

// Filter transactions by date range
const filteredTransactions = computed(() => {
  if (!startDate.value || !endDate.value) return transactions.value
  
  const start = new Date(startDate.value)
  start.setHours(0, 0, 0, 0)
  
  const end = new Date(endDate.value)
  end.setHours(23, 59, 59, 999)
  
  return transactions.value.filter(transaction => {
    const txDate = new Date(transaction.date)
    return txDate >= start && txDate <= end
  })
})

// Calculate spending by category
const spendingByCategory = computed(() => {
  const spending = {}
  
  filteredTransactions.value
    .filter(tx => tx.amount < 0) // Only expenses
    .forEach(tx => {
      const category = tx.category
      if (!spending[category]) {
        spending[category] = 0
      }
      spending[category] += Math.abs(tx.amount)
    })
    
  // Convert to array and sort by amount
  return Object.entries(spending)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
})

// Calculate income by category
const incomeByCategory = computed(() => {
  const income = {}
  
  filteredTransactions.value
    .filter(tx => tx.amount > 0) // Only income
    .forEach(tx => {
      const category = tx.category
      if (!income[category]) {
        income[category] = 0
      }
      income[category] += tx.amount
    })
    
  // Convert to array and sort by amount
  return Object.entries(income)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
})

// Calculate spending by month
const spendingByMonth = computed(() => {
  const months = {}
  
  filteredTransactions.value
    .filter(tx => tx.amount < 0) // Only expenses
    .forEach(tx => {
      const date = new Date(tx.date)
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`
      
      if (!months[monthYear]) {
        months[monthYear] = {
          label: new Date(date.getFullYear(), date.getMonth(), 1)
            .toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          amount: 0
        }
      }
      
      months[monthYear].amount += Math.abs(tx.amount)
    })
    
  // Convert to array and sort by date
  return Object.values(months)
    .sort((a, b) => {
      const dateA = new Date(a.label)
      const dateB = new Date(b.label)
      return dateA - dateB
    })
})

// Calculate income by month
const incomeByMonth = computed(() => {
  const months = {}
  
  filteredTransactions.value
    .filter(tx => tx.amount > 0) // Only income
    .forEach(tx => {
      const date = new Date(tx.date)
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`
      
      if (!months[monthYear]) {
        months[monthYear] = {
          label: new Date(date.getFullYear(), date.getMonth(), 1)
            .toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          amount: 0
        }
      }
      
      months[monthYear].amount += tx.amount
    })
    
  // Convert to array and sort by date
  return Object.values(months)
    .sort((a, b) => {
      const dateA = new Date(a.label)
      const dateB = new Date(b.label)
      return dateA - dateB
    })
})

// Calculate budget vs spending
const budgetVsSpending = computed(() => {
  const comparison = []
  
  budgets.value.forEach(budget => {
    const spent = spendingByCategory.value
      .find(cat => cat.category === budget.category)?.amount || 0
      
    comparison.push({
      category: budget.category,
      budgeted: budget.amount,
      spent: spent,
      difference: budget.amount - spent,
      percentUsed: budget.amount > 0 ? (spent / budget.amount) * 100 : 0
    })
  })
  
  return comparison.sort((a, b) => b.spent - a.spent)
})

// Top spending categories
const topSpendingCategories = computed(() => {
  return spendingByCategory.value.slice(0, 5)
})

// Total income and expense amounts
const financialSummary = computed(() => {
  const totalExpenses = filteredTransactions.value
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
    
  const totalIncome = filteredTransactions.value
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0)
    
  const balance = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
  
  return {
    totalExpenses,
    totalIncome,
    balance,
    savingsRate
  }
})

// Export data to CSV
const exportToCSV = () => {
  // Decide what data to export based on current report type
  let csvData = []
  let filename = ''
  
  if (reportType.value === 'spending') {
    csvData = spendingByCategory.value.map(item => ({
      Category: item.category,
      Amount: item.amount.toFixed(2)
    }))
    filename = 'spending-by-category.csv'
  } else if (reportType.value === 'income') {
    csvData = incomeByCategory.value.map(item => ({
      Category: item.category,
      Amount: item.amount.toFixed(2)
    }))
    filename = 'income-by-category.csv'
  } else if (reportType.value === 'trends') {
    // Combine spending and income by month
    const months = {}
    
    spendingByMonth.value.forEach(item => {
      if (!months[item.label]) {
        months[item.label] = { Month: item.label, Expenses: 0, Income: 0 }
      }
      months[item.label].Expenses = item.amount.toFixed(2)
    })
    
    incomeByMonth.value.forEach(item => {
      if (!months[item.label]) {
        months[item.label] = { Month: item.label, Expenses: 0, Income: 0 }
      }
      months[item.label].Income = item.amount.toFixed(2)
    })
    
    csvData = Object.values(months)
    filename = 'monthly-trends.csv'
  }
  
  // Convert to CSV
  if (csvData.length > 0) {
    const headers = Object.keys(csvData[0])
    const csv = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => row[header]).join(',')
      )
    ].join('\n')
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', filename)
    a.click()
  }
}
</script>

<template>
  <div class="analytics-container">
    <header class="section-header">
      <h2>Financial Analytics</h2>
      <button @click="exportToCSV" class="btn btn-primary">
        Export to CSV
      </button>
    </header>
    
    <!-- Report Type Selector -->
    <div class="report-controls">
      <div class="report-type-selector">
        <button 
          @click="reportType = 'spending'" 
          class="report-tab"
          :class="{ 'active': reportType === 'spending' }"
        >
          Spending Analysis
        </button>
        <button 
          @click="reportType = 'income'" 
          class="report-tab"
          :class="{ 'active': reportType === 'income' }"
        >
          Income Analysis
        </button>
        <button 
          @click="reportType = 'trends'" 
          class="report-tab"
          :class="{ 'active': reportType === 'trends' }"
        >
          Monthly Trends
        </button>
      </div>
      
      <div class="date-range-selector">
        <div class="time-range-buttons">
          <button 
            @click="timeRange = 'month'; updateDateRange()" 
            class="time-range-btn"
            :class="{ 'active': timeRange === 'month' }"
          >
            Month
          </button>
          <button 
            @click="timeRange = 'quarter'; updateDateRange()" 
            class="time-range-btn"
            :class="{ 'active': timeRange === 'quarter' }"
          >
            Quarter
          </button>
          <button 
            @click="timeRange = 'year'; updateDateRange()" 
            class="time-range-btn"
            :class="{ 'active': timeRange === 'year' }"
          >
            Year
          </button>
        </div>
        
        <div class="date-inputs">
          <div class="form-group">
            <label for="start-date">From</label>
            <input 
              id="start-date" 
              type="date" 
              v-model="startDate"
              class="form-input"
            >
          </div>
          <div class="form-group">
            <label for="end-date">To</label>
            <input 
              id="end-date" 
              type="date" 
              v-model="endDate"
              class="form-input"
            >
          </div>
        </div>
      </div>
    </div>
    
    <!-- Financial Summary -->
    <div class="financial-summary">
      <div class="summary-card">
        <div class="summary-title">Income</div>
        <div class="summary-amount positive">{{ formatCurrency(financialSummary.totalIncome) }}</div>
      </div>
      
      <div class="summary-card">
        <div class="summary-title">Expenses</div>
        <div class="summary-amount negative">{{ formatCurrency(financialSummary.totalExpenses) }}</div>
      </div>
      
      <div class="summary-card">
        <div class="summary-title">Balance</div>
        <div 
          class="summary-amount"
          :class="{ 
            'positive': financialSummary.balance > 0,
            'negative': financialSummary.balance < 0
          }"
        >
          {{ formatCurrency(financialSummary.balance) }}
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-title">Savings Rate</div>
        <div 
          class="summary-amount"
          :class="{ 
            'positive': financialSummary.savingsRate > 0,
            'warning': financialSummary.savingsRate <= 0
          }"
        >
          {{ Math.round(financialSummary.savingsRate) }}%
        </div>
      </div>
    </div>
    
    <!-- Spending Analysis -->
    <div v-if="reportType === 'spending'" class="report-section">
      <h3>Spending by Category</h3>
      
      <div v-if="spendingByCategory.length > 0" class="chart-container">
        <!-- Bar Chart Visual Representation -->
        <div class="bar-chart">
          <div 
            v-for="(item, index) in spendingByCategory" 
            :key="index"
            class="chart-item"
          >
            <div class="bar-label">{{ item.category }}</div>
            <div class="bar-container">
              <div 
                class="bar" 
                :style="{ 
                  width: `${(item.amount / spendingByCategory[0].amount) * 100}%`,
                  backgroundColor: `hsl(${120 - (index * 12)}, 70%, 45%)`
                }"
              ></div>
              <div class="bar-value">{{ formatCurrency(item.amount) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="no-data-message">
        No spending data available for the selected period.
      </div>
      
      <h3>Budget vs. Actual Spending</h3>
      
      <div v-if="budgetVsSpending.length > 0" class="comparison-table-container">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Budgeted</th>
              <th>Spent</th>
              <th>Difference</th>
              <th>% Used</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, index) in budgetVsSpending" 
              :key="index"
              :class="{
                'over-budget': item.difference < 0,
                'under-budget': item.difference > 0
              }"
            >
              <td>{{ item.category }}</td>
              <td>{{ formatCurrency(item.budgeted) }}</td>
              <td>{{ formatCurrency(item.spent) }}</td>
              <td>{{ formatCurrency(item.difference) }}</td>
              <td>
                <div class="usage-cell">
                  <div class="mini-progress">
                    <div 
                      class="mini-progress-fill" 
                      :style="{ width: `${Math.min(item.percentUsed, 100)}%` }"
                      :class="{
                        'warning': item.percentUsed >= 80 && item.percentUsed < 100,
                        'danger': item.percentUsed >= 100
                      }"
                    ></div>
                  </div>
                  <span>{{ Math.round(item.percentUsed) }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-else class="no-data-message">
        No budget comparison data available.
      </div>
    </div>
    
    <!-- Income Analysis -->
    <div v-if="reportType === 'income'" class="report-section">
      <h3>Income by Category</h3>
      
      <div v-if="incomeByCategory.length > 0" class="chart-container">
        <!-- Bar Chart Visual Representation -->
        <div class="bar-chart">
          <div 
            v-for="(item, index) in incomeByCategory" 
            :key="index"
            class="chart-item"
          >
            <div class="bar-label">{{ item.category }}</div>
            <div class="bar-container">
              <div 
                class="bar" 
                :style="{ 
                  width: `${(item.amount / incomeByCategory[0].amount) * 100}%`,
                  backgroundColor: `hsl(200, 70%, ${45 + (index * 5)}%)`
                }"
              ></div>
              <div class="bar-value">{{ formatCurrency(item.amount) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="no-data-message">
        No income data available for the selected period.
      </div>
    </div>
    
    <!-- Trends Analysis -->
    <div v-if="reportType === 'trends'" class="report-section">
      <h3>Monthly Trends</h3>
      
      <div v-if="spendingByMonth.length > 0 || incomeByMonth.length > 0" class="chart-container">
        <!-- Line Chart Visual Representation -->
        <div class="line-chart">
          <div class="line-chart-header">
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color income-color"></div>
                <div class="legend-label">Income</div>
              </div>
              <div class="legend-item">
                <div class="legend-color expense-color"></div>
                <div class="legend-label">Expenses</div>
              </div>
            </div>
          </div>
          
          <div class="line-chart-body">
            <div 
              v-for="(monthIncome, index) in incomeByMonth" 
              :key="`income-${index}`"
              class="monthly-comparison"
            >
              <div class="month-label">{{ monthIncome.label }}</div>
              <div class="comparison-bars">
                <!-- Income Bar -->
                <div class="monthly-bar-container income">
                  <div 
                    class="monthly-bar income-bar" 
                    :style="{ 
                      height: `${(monthIncome.amount / Math.max(...incomeByMonth.map(m => m.amount))) * 150}px`
                    }"
                  ></div>
                  <div class="monthly-bar-label">{{ formatCurrency(monthIncome.amount) }}</div>
                </div>
                
                <!-- Expense Bar (if exists for this month) -->
                <div class="monthly-bar-container expense">
                  <div 
                    v-if="spendingByMonth.find(m => m.label === monthIncome.label)"
                    class="monthly-bar expense-bar" 
                    :style="{ 
                      height: `${(spendingByMonth.find(m => m.label === monthIncome.label).amount / Math.max(...spendingByMonth.map(m => m.amount))) * 150}px`
                    }"
                  ></div>
                  <div class="monthly-bar-label">
                    {{ formatCurrency(spendingByMonth.find(m => m.label === monthIncome.label)?.amount || 0) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="no-data-message">
        No trend data available for the selected period.
      </div>
    </div>
  </div>
</template>

<style scoped>
.analytics-container {
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

.report-controls {
  margin-bottom: 2rem;
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.report-type-selector {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
}

.report-tab {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: var(--color-text-light);
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.report-tab.active {
  color: var(--color-heading);
  border-bottom-color: #4caf50;
}

.date-range-selector {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
}

.time-range-buttons {
  display: flex;
  gap: 0.5rem;
}

.time-range-btn {
  padding: 0.5rem 1rem;
  background-color: var(--color-background-mute);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.time-range-btn.active {
  background-color: #4caf50;
  color: white;
}

.date-inputs {
  display: flex;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: var(--color-text-light);
}

.form-input {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background-color: var(--color-background);
  color: var(--color-text);
}

.financial-summary {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-title {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
}

.summary-amount {
  font-size: 1.5rem;
  font-weight: 600;
}

.positive {
  color: #4caf50;
}

.negative {
  color: #f44336;
}

.warning {
  color: #ff9800;
}

.report-section {
  margin-bottom: 3rem;
}

.report-section h3 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.chart-container {
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-item {
  display: flex;
  align-items: center;
}

.bar-label {
  width: 150px;
  font-weight: 500;
}

.bar-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.bar {
  height: 24px;
  border-radius: 4px;
  min-width: 2px;
  transition: width 0.5s ease;
}

.bar-value {
  font-weight: 500;
  min-width: 100px;
}

.comparison-table-container {
  overflow-x: auto;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comparison-table th,
.comparison-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.comparison-table th {
  background-color: var(--color-background-soft);
  font-weight: 600;
}

.comparison-table tr:last-child td {
  border-bottom: none;
}

.comparison-table tbody tr:nth-child(even) {
  background-color: var(--color-background-soft);
}

.comparison-table tbody tr:hover {
  background-color: var(--color-background-mute);
}

.over-budget {
  background-color: rgba(244, 67, 54, 0.1) !important;
}

.under-budget {
  background-color: rgba(76, 175, 80, 0.1) !important;
}

.usage-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mini-progress {
  width: 80px;
  height: 6px;
  background-color: var(--color-background-mute);
  border-radius: 3px;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  background-color: #4caf50;
}

.mini-progress-fill.warning {
  background-color: #ff9800;
}

.mini-progress-fill.danger {
  background-color: #f44336;
}

.line-chart {
  padding: 1rem 0;
}

.line-chart-header {
  margin-bottom: 1.5rem;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.income-color {
  background-color: #2196f3;
}

.expense-color {
  background-color: #f44336;
}

.line-chart-body {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.monthly-comparison {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.month-label {
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  white-space: nowrap;
}

.comparison-bars {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  height: 180px;
}

.monthly-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
}

.monthly-bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
}

.income-bar {
  background-color: #2196f3;
}

.expense-bar {
  background-color: #f44336;
}

.monthly-bar-label {
  font-size: 0.75rem;
  margin-top: 0.5rem;
  text-align: center;
  white-space: nowrap;
  transform: rotate(-45deg);
  transform-origin: top left;
  margin-left: 8px;
}

.no-data-message {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-light);
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
}

@media (max-width: 768px) {
  .date-range-selector {
    flex-direction: column;
    align-items: stretch;
  }
  
  .bar-label {
    width: 100px;
  }
  
  .financial-summary {
    grid-template-columns: 1fr;
  }
}
</style>