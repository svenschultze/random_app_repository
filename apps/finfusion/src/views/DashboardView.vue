<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '@/stores/finance'
import { useInvestmentStore } from '@/stores/investment'
import { useSettingsStore } from '@/stores/settings'

const router = useRouter()

import AccountSummary from '@/components/dashboard/AccountSummary.vue'
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue'
import SpendingOverview from '@/components/dashboard/SpendingOverview.vue'
import InvestmentPerformance from '@/components/dashboard/InvestmentPerformance.vue'
import SavingsGoals from '@/components/dashboard/SavingsGoals.vue'

const financeStore = useFinanceStore()
const investmentStore = useInvestmentStore()
const settingsStore = useSettingsStore()

const refreshing = ref(false)
const refreshTimer = ref(null)

// Computed properties for dashboard widgets
const activeWidgets = computed(() => {
  return settingsStore.dashboardLayout
})

const handleWidgetRefresh = (widgetName) => {
  if (widgetName === 'accountSummary' || widgetName === 'recentTransactions' || widgetName === 'spendingOverview' || widgetName === 'savingsGoals') {
    financeStore.refreshData()
  } else if (widgetName === 'investmentPerformance') {
    investmentStore.refreshData()
  }
}

const refreshAll = () => {
  refreshing.value = true
  
  // Refresh all stores
  financeStore.refreshData()
  investmentStore.refreshData()
  
  // Simulate some loading time
  setTimeout(() => {
    refreshing.value = false
  }, 1000)
}

const navigateToSection = (section) => {
  if (section === 'accountSummary' || section === 'recentTransactions') {
    router.push('/accounts')
  } else if (section === 'investmentPerformance') {
    router.push('/investments')
  } else if (section === 'spendingOverview') {
    router.push('/budgeting')
  } else if (section === 'savingsGoals') {
    router.push('/budgeting')
  }
}

// Set up auto-refresh if enabled
const setupAutoRefresh = () => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
    refreshTimer.value = null
  }
  
  if (settingsStore.dataRefreshInterval > 0) {
    refreshTimer.value = setInterval(() => {
      refreshAll()
    }, settingsStore.dataRefreshInterval * 1000)
  }
}

onMounted(() => {
  // Set loading state
  refreshing.value = true
  
  // Initialize data if not already loaded
  if (!financeStore.isDataLoaded) {
    financeStore.initializeData()
  }
  
  if (!investmentStore.isDataLoaded) {
    investmentStore.initializeData()
  }
  
  // After data loading, turn off loading state
  setTimeout(() => {
    refreshing.value = false
  }, 500)
  
  setupAutoRefresh()
})
</script>

<template>
  <div class="dashboard" v-voix="'Dashboard Page'">
    <div class="dashboard-header">
      <h1 class="page-title">Dashboard</h1>
      <button 
        @click="refreshAll" 
        class="refresh-button"
        :class="{ 'refreshing': refreshing }"
        v-voix="'Refresh All Dashboard Data'"
      >
        <span class="refresh-icon">🔄</span>
        <span class="refresh-text">Refresh</span>
      </button>
    </div>
    
    <div class="dashboard-grid">
      <!-- Account Summary -->
      <div v-if="activeWidgets.includes('accountSummary')" class="widget widget-account-summary">
        <AccountSummary 
          :accounts="financeStore.accounts" 
          :loading="refreshing"
          @refresh="handleWidgetRefresh('accountSummary')"
          @more="navigateToSection('accountSummary')"
        />
      </div>
      
      <!-- Recent Transactions -->
      <div v-if="activeWidgets.includes('recentTransactions')" class="widget widget-recent-transactions">
        <RecentTransactions 
          :transactions="financeStore.transactions"
          :loading="refreshing"
          @refresh="handleWidgetRefresh('recentTransactions')"
          @more="navigateToSection('recentTransactions')"
        />
      </div>
      
      <!-- Spending Overview -->
      <div v-if="activeWidgets.includes('spendingOverview')" class="widget widget-spending-overview">
        <SpendingOverview 
          :transactions="financeStore.transactions"
          :loading="refreshing"
          @refresh="handleWidgetRefresh('spendingOverview')"
          @more="navigateToSection('spendingOverview')"
        />
      </div>
      
      <!-- Investment Performance -->
      <div v-if="activeWidgets.includes('investmentPerformance')" class="widget widget-investment-performance">
        <InvestmentPerformance 
          :stocks="investmentStore.stocks"
          :chartData="financeStore.chartData"
          :loading="refreshing"
          @refresh="handleWidgetRefresh('investmentPerformance')"
          @more="navigateToSection('investmentPerformance')"
        />
      </div>
      
      <!-- Savings Goals -->
      <div v-if="activeWidgets.includes('savingsGoals')" class="widget widget-savings-goals">
        <SavingsGoals 
          :goals="financeStore.goals"
          :loading="refreshing"
          @refresh="handleWidgetRefresh('savingsGoals')"
          @more="navigateToSection('savingsGoals')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
}

.dashboard-header {
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

.refresh-button:hover {
  background-color: darken(var(--primary-color), 10%);
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

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "account-summary recent-transactions"
      "spending-overview investment-performance"
      "savings-goals savings-goals";
  }
  
  .widget-account-summary {
    grid-area: account-summary;
  }
  
  .widget-recent-transactions {
    grid-area: recent-transactions;
  }
  
  .widget-spending-overview {
    grid-area: spending-overview;
  }
  
  .widget-investment-performance {
    grid-area: investment-performance;
  }
  
  .widget-savings-goals {
    grid-area: savings-goals;
  }
}

@media (min-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      "account-summary recent-transactions investment-performance"
      "spending-overview savings-goals investment-performance";
  }
}
</style>