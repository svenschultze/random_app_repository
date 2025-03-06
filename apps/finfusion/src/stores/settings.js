import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const darkMode = ref(false)
  const dashboardLayout = ref([
    'accountSummary',
    'recentTransactions',
    'spendingOverview',
    'investmentPerformance',
    'upcomingBills',
    'savingsGoals'
  ])
  const dataRefreshInterval = ref(0) // 0 means manual refresh only
  const refreshIntervalOptions = [
    { value: 0, label: 'Manual Refresh Only' },
    { value: 15, label: 'Every 15 seconds' },
    { value: 30, label: 'Every 30 seconds' },
    { value: 60, label: 'Every minute' },
    { value: 300, label: 'Every 5 minutes' }
  ]
  
  // Users can select which widgets they want to display
  const availableWidgets = [
    { id: 'accountSummary', name: 'Account Summary', description: 'Overview of all your accounts', icon: '💰' },
    { id: 'recentTransactions', name: 'Recent Transactions', description: 'Latest transactions across all accounts', icon: '📊' },
    { id: 'spendingOverview', name: 'Spending Overview', description: 'Breakdown of spending by category', icon: '🛒' },
    { id: 'investmentPerformance', name: 'Investment Performance', description: 'Portfolio performance over time', icon: '📈' },
    { id: 'upcomingBills', name: 'Upcoming Bills', description: 'Bills and payments due soon', icon: '📅' },
    { id: 'savingsGoals', name: 'Savings Goals', description: 'Progress towards your financial goals', icon: '🎯' },
    { id: 'stockWatchlist', name: 'Stock Watchlist', description: 'Quick view of stocks you\'re watching', icon: '👀' },
    { id: 'incomeVsExpenses', name: 'Income vs Expenses', description: 'Monthly income compared to expenses', icon: '⚖️' }
  ]
  
  // Actions
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    document.body.classList.toggle('dark-mode', darkMode.value)
  }
  
  const setDarkMode = (value) => {
    darkMode.value = value
    document.body.classList.toggle('dark-mode', value)
  }
  
  const updateDashboardLayout = (newLayout) => {
    dashboardLayout.value = newLayout
  }
  
  const addWidget = (widgetId) => {
    if (!dashboardLayout.value.includes(widgetId)) {
      dashboardLayout.value.push(widgetId)
    }
  }
  
  const removeWidget = (widgetId) => {
    const index = dashboardLayout.value.indexOf(widgetId)
    if (index !== -1) {
      dashboardLayout.value.splice(index, 1)
    }
  }
  
  const setDataRefreshInterval = (seconds) => {
    dataRefreshInterval.value = seconds
  }
  
  return {
    darkMode,
    dashboardLayout,
    dataRefreshInterval,
    refreshIntervalOptions,
    availableWidgets,
    toggleDarkMode,
    setDarkMode,
    updateDashboardLayout,
    addWidget,
    removeWidget,
    setDataRefreshInterval
  }
})