<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { useRouter } from 'vue-router'
import CardComponent from '@/components/ui/CardComponent.vue'
import StatCard from '@/components/ui/StatCard.vue'
import TransactionList from '@/components/TransactionList.vue'
import ChartComponent from '@/components/ui/ChartComponent.vue'
import { formatCurrency } from '@/utils/mockData'

const router = useRouter()

const financeStore = useFinanceStore()
const isLoading = ref(false)
const activeAccount = ref('all')

// Initialize data if needed
onMounted(() => {
  isLoading.value = true
  
  if (!financeStore.isDataLoaded) {
    financeStore.initializeData()
  }
  
  // Give time for the data to initialize
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})

// Filter transactions
const setAccountFilter = (accountId) => {
  activeAccount.value = accountId
  financeStore.updateTransactionsFilter({ account: accountId })
}

// Reset filters
const resetFilters = () => {
  activeAccount.value = 'all'
  financeStore.resetTransactionsFilter()
}

// Filtered transactions
const filteredTransactions = computed(() => {
  return financeStore.filteredTransactions
})

// Navigate to transaction detail page
const openTransactionDetail = (transaction) => {
  router.push(`/transactions/${transaction.id}`)
}

// Chart data
const chartOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.dataset.label || ''
          const value = context.raw || 0
          return `${label}: ${formatCurrency(value)}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return formatCurrency(value).replace('.00', '')
        }
      }
    }
  }
}

// Refresh data
const refreshData = () => {
  isLoading.value = true
  financeStore.refreshData()
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}
</script>

<template>
  <div class="accounts-view" v-voix="'Accounts Page'">
    <div class="page-header">
      <h1 class="page-title">Accounts</h1>
      <button 
        @click="refreshData" 
        class="refresh-button"
        :class="{ 'refreshing': isLoading }"
        v-voix="'Refresh Account Data'"
      >
        <span class="refresh-icon">🔄</span>
        <span class="refresh-text">Refresh</span>
      </button>
    </div>
    
    <!-- Account Stats -->
    <div class="stats-row">
      <StatCard 
        title="Total Balance" 
        :value="financeStore.formattedTotalBalance" 
        :loading="isLoading"
        icon="💰"
      />
      <StatCard 
        title="Monthly Income" 
        :value="financeStore.formattedTotalIncome" 
        :loading="isLoading"
        icon="💸"
      />
      <StatCard 
        title="Monthly Expenses" 
        :value="financeStore.formattedTotalExpenses" 
        :loading="isLoading"
        icon="📉"
      />
    </div>
    
    <!-- Account List & Income vs Expenses Chart -->
    <div class="account-grid">
      <CardComponent 
        title="My Accounts"
        :loading="isLoading"
        hasRefresh
        @refresh="refreshData"
        v-voix="'My Accounts Card'"
      >
        <div class="accounts-list">
          <div 
            class="account-filter-item"
            :class="{ 'active': activeAccount === 'all' }"
            @click="resetFilters"
            v-voix="'Show All Accounts'"
          >
            All Accounts
          </div>
          
          <div 
            v-for="account in financeStore.accounts" 
            :key="account.id" 
            class="account-filter-item"
            :class="{ 'active': activeAccount === account.id }"
            @click="setAccountFilter(account.id)"
            v-voix="account.name + ' filter'"
            :hint="'Show only transactions from ' + account.name"
          >
            {{ account.name }}
            <span class="account-balance">{{ formatCurrency(account.balance) }}</span>
          </div>
        </div>
      </CardComponent>
      
      <CardComponent
        title="Income vs Expenses"
        subtitle="Past 6 Months"
        :loading="isLoading"
        hasRefresh
        @refresh="refreshData"
        v-voix="'Income vs Expenses Chart'"
      >
        <div class="chart-container">
          <ChartComponent
            v-if="financeStore.chartData && financeStore.chartData.incomeVsExpense"
            type="bar"
            :data="financeStore.chartData.incomeVsExpense"
            :options="chartOptions"
            :loading="isLoading"
            height="250px"
          />
          <div v-else class="loading-state">
            <div class="loader"></div>
            <p>Loading chart data...</p>
          </div>
        </div>
      </CardComponent>
    </div>
    
    <!-- Transactions -->
    <CardComponent
      title="Transactions"
      :loading="isLoading"
      hasRefresh
      @refresh="refreshData"
      v-voix="'Transactions Card'"
    >
      <div class="transactions-filters">
        <div class="filter-group">
          <label for="category-filter" v-voix="'Category Filter'">Category:</label>
          <select 
            id="category-filter" 
            v-model="financeStore.transactionsFilter.category"
            v-voix="'Select Transaction Category'"
          >
            <option value="all">All Categories</option>
            <option v-for="category in financeStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="date-filter" v-voix="'Date Range Filter'">Date Range:</label>
          <select 
            id="date-filter" 
            v-model="financeStore.transactionsFilter.dateRange"
            v-voix="'Select Date Range'"
          >
            <option v-for="range in financeStore.dateRanges" :key="range.value" :value="range.value">
              {{ range.label }}
            </option>
          </select>
        </div>
        
        <div class="filter-group search-group">
          <input 
            type="text" 
            v-model="financeStore.transactionsFilter.searchTerm" 
            placeholder="Search transactions..." 
            v-voix="'Search Transactions'"
          />
        </div>
        
        <button 
          class="reset-filters-btn" 
          @click="resetFilters"
          v-voix="'Reset All Filters'"
        >
          Reset Filters
        </button>
      </div>
      
      <div class="clickable-transactions">
        <TransactionList 
          :transactions="filteredTransactions" 
          :loading="isLoading" 
          v-voix="'Transactions List, click on a transaction to view details'"
        />
        <!-- Invisible overlay for click handling -->
        <div 
          v-if="!isLoading" 
          class="transaction-click-overlay"
        >
          <div 
            v-for="transaction in filteredTransactions" 
            :key="transaction.id"
            class="transaction-click-area"
            @click="openTransactionDetail(transaction)"
            v-voix="'Click to view details for transaction from ' + transaction.merchant"
          ></div>
        </div>
      </div>
    </CardComponent>
    
    <!-- Transaction detail now shown in a separate view -->
  </div>
</template>

<style scoped>
.accounts-view {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
}

.refresh-button {
  display: flex;
  align-items: center;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.refresh-icon {
  margin-right: 0.5rem;
}

.refresh-button.refreshing .refresh-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.account-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.accounts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.account-filter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.2s;
}

.account-filter-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.account-filter-item.active {
  background-color: var(--primary-color);
  color: white;
}

.transactions-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.filter-group select, .filter-group input {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background-color: var(--card-background);
  color: var(--text-color);
  min-width: 150px;
}

.search-group {
  flex-grow: 1;
}

.search-group input {
  width: 100%;
}

.reset-filters-btn {
  align-self: flex-end;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.1);
  color: var(--text-color);
  cursor: pointer;
}

.reset-filters-btn:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.chart-container {
  width: 100%;
  height: 250px;
  position: relative;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-color);
  opacity: 0.6;
}

.loader {
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

.clickable-transactions {
  position: relative;
}

.clickable-transactions :deep(.transaction-item) {
  cursor: pointer;
  transition: background-color 0.2s;
}

.clickable-transactions :deep(.transaction-item:hover) {
  background-color: rgba(0, 0, 0, 0.02);
}

.transaction-click-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.transaction-click-area {
  height: calc(1.5rem + 32px); /* Matches transaction item height */
  margin-bottom: 1px;
  padding: 1rem 0;
  cursor: pointer;
  pointer-events: auto;
}

@media (min-width: 768px) {
  .stats-row {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .account-grid {
    grid-template-columns: 1fr 2fr;
  }
}
</style>