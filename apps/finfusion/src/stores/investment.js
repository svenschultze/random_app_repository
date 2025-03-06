import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateStocks, formatCurrency } from '@/utils/mockData'

export const useInvestmentStore = defineStore('investment', () => {
  // State
  const stocks = ref([])
  const watchlist = ref([])
  const isDataLoaded = ref(false)
  
  // Computed
  const totalPortfolioValue = computed(() => {
    return stocks.value.reduce((total, stock) => total + stock.value, 0)
  })
  
  const formattedTotalValue = computed(() => formatCurrency(totalPortfolioValue.value))
  
  const portfolioDailyChange = computed(() => {
    const totalChange = stocks.value.reduce((sum, stock) => {
      return sum + (stock.change * stock.shares)
    }, 0)
    
    return {
      amount: totalChange,
      percentage: totalChange / totalPortfolioValue.value * 100,
      formatted: formatCurrency(totalChange),
      isPositive: totalChange >= 0
    }
  })
  
  const sectorAllocation = computed(() => {
    const sectors = {}
    
    stocks.value.forEach(stock => {
      if (!sectors[stock.sector]) {
        sectors[stock.sector] = 0
      }
      sectors[stock.sector] += stock.value
    })
    
    const total = totalPortfolioValue.value
    const result = Object.entries(sectors).map(([sector, value]) => ({
      sector,
      value,
      percentage: (value / total) * 100,
      formatted: formatCurrency(value)
    }))
    
    return result.sort((a, b) => b.value - a.value)
  })
  
  // Actions
  const initializeData = () => {
    stocks.value = generateStocks()
    watchlist.value = ['NFLX', 'NVDA', 'DIS', 'PYPL', 'INTC']
    isDataLoaded.value = true
  }
  
  const refreshData = () => {
    stocks.value = generateStocks()
  }
  
  const addToWatchlist = (symbol) => {
    if (!watchlist.value.includes(symbol)) {
      watchlist.value.push(symbol)
    }
  }
  
  const removeFromWatchlist = (symbol) => {
    const index = watchlist.value.indexOf(symbol)
    if (index !== -1) {
      watchlist.value.splice(index, 1)
    }
  }
  
  return {
    stocks,
    watchlist,
    isDataLoaded,
    totalPortfolioValue,
    formattedTotalValue,
    portfolioDailyChange,
    sectorAllocation,
    initializeData,
    refreshData,
    addToWatchlist,
    removeFromWatchlist
  }
})