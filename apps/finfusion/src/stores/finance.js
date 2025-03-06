import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { 
  generateAccounts, 
  generateTransactions, 
  generateBudgets, 
  generateChartData, 
  generateGoals, 
  formatCurrency 
} from '@/utils/mockData'

export const useFinanceStore = defineStore('finance', () => {
  // State
  const accounts = ref([])
  const transactions = ref([])
  const budgets = ref([])
  const goals = ref([])
  const chartData = reactive({})
  const isDataLoaded = ref(false)
  const transactionsFilter = reactive({
    account: 'all',
    category: 'all',
    dateRange: 'all',
    searchTerm: ''
  })
  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ]

  // Computed
  const totalBalance = computed(() => {
    return accounts.value.reduce((total, account) => {
      // For credit cards, the balance is negative but we want to subtract it
      // from the total, so we add it (because it's already negative)
      if (account.type === 'credit') {
        return total + account.balance
      } else {
        return total + account.balance
      }
    }, 0)
  })

  const totalIncomeThisMonth = computed(() => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    
    return transactions.value
      .filter(t => {
        const txDate = new Date(t.date)
        return txDate.getMonth() === thisMonth && 
               txDate.getFullYear() === thisYear && 
               t.amount > 0
      })
      .reduce((total, t) => total + t.amount, 0)
  })

  const totalExpensesThisMonth = computed(() => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    
    return Math.abs(transactions.value
      .filter(t => {
        const txDate = new Date(t.date)
        return txDate.getMonth() === thisMonth && 
               txDate.getFullYear() === thisYear && 
               t.amount < 0
      })
      .reduce((total, t) => total + t.amount, 0))
  })

  const formattedTotalBalance = computed(() => formatCurrency(totalBalance.value))
  const formattedTotalIncome = computed(() => formatCurrency(totalIncomeThisMonth.value))
  const formattedTotalExpenses = computed(() => formatCurrency(totalExpensesThisMonth.value))

  const filteredTransactions = computed(() => {
    return transactions.value.filter(transaction => {
      // Account filter
      if (transactionsFilter.account !== 'all' && transaction.accountId !== transactionsFilter.account) {
        return false
      }
      
      // Category filter
      if (transactionsFilter.category !== 'all' && transaction.category !== transactionsFilter.category) {
        return false
      }
      
      // Date range filter
      if (transactionsFilter.dateRange !== 'all') {
        const txDate = new Date(transaction.date)
        const today = new Date()
        
        let daysDiff = Math.floor((today - txDate) / (1000 * 60 * 60 * 24))
        
        if (transactionsFilter.dateRange === '7d' && daysDiff > 7) {
          return false
        } else if (transactionsFilter.dateRange === '30d' && daysDiff > 30) {
          return false
        } else if (transactionsFilter.dateRange === '90d' && daysDiff > 90) {
          return false
        }
      }
      
      // Search term filter
      if (transactionsFilter.searchTerm) {
        const term = transactionsFilter.searchTerm.toLowerCase()
        return (
          transaction.merchant.toLowerCase().includes(term) ||
          transaction.category.toLowerCase().includes(term) ||
          transaction.formattedAmount.toLowerCase().includes(term)
        )
      }
      
      return true
    })
  })

  // Categories for transactions
  const categories = computed(() => {
    const categorySet = new Set()
    transactions.value.forEach(t => categorySet.add(t.category))
    return Array.from(categorySet).sort()
  })

  // Actions
  const initializeData = () => {
    accounts.value = generateAccounts()
    transactions.value = generateTransactions(50)
    budgets.value = generateBudgets()
    goals.value = generateGoals()
    
    const chartDataValues = generateChartData()
    Object.assign(chartData, chartDataValues)
    
    isDataLoaded.value = true
    
    return chartData
  }

  const updateTransactionsFilter = (filter) => {
    Object.assign(transactionsFilter, filter)
  }

  const resetTransactionsFilter = () => {
    transactionsFilter.account = 'all'
    transactionsFilter.category = 'all'
    transactionsFilter.dateRange = 'all'
    transactionsFilter.searchTerm = ''
  }

  const refreshData = () => {
    initializeData()
  }

  return {
    accounts,
    transactions,
    budgets,
    goals,
    chartData,
    isDataLoaded,
    transactionsFilter,
    dateRanges,
    totalBalance,
    totalIncomeThisMonth,
    totalExpensesThisMonth,
    formattedTotalBalance,
    formattedTotalIncome,
    formattedTotalExpenses,
    filteredTransactions,
    categories,
    initializeData,
    updateTransactionsFilter,
    resetTransactionsFilter,
    refreshData
  }
})