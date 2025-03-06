import { format, subDays, subMonths, addDays } from 'date-fns'

/**
 * Generates a random number between min and max (inclusive)
 */
export const getRandomNumber = (min, max, decimals = 0) => {
  const num = Math.random() * (max - min) + min
  return Number(num.toFixed(decimals))
}

/**
 * Formats currency values
 */
export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(value)
}

/**
 * Generates random transaction data
 */
export const generateTransactions = (count = 20) => {
  const categories = [
    'Groceries', 'Dining', 'Shopping', 'Entertainment', 
    'Transport', 'Utilities', 'Healthcare', 'Travel',
    'Income', 'Subscription', 'Transfer', 'Other'
  ]
  
  const merchants = {
    'Groceries': ['Whole Foods', 'Trader Joe\'s', 'Safeway', 'Kroger', 'Aldi'],
    'Dining': ['Starbucks', 'Chipotle', 'McDonald\'s', 'Local Restaurant', 'Pizza Hut'],
    'Shopping': ['Amazon', 'Target', 'Walmart', 'Best Buy', 'Nike Store'],
    'Entertainment': ['Netflix', 'AMC Theaters', 'Spotify', 'Steam', 'Disney+'],
    'Transport': ['Uber', 'Lyft', 'Gas Station', 'Public Transit', 'Airline'],
    'Utilities': ['Electric Company', 'Water Service', 'Gas Company', 'Internet Provider', 'Phone Company'],
    'Healthcare': ['Pharmacy', 'Doctor\'s Office', 'Dental Care', 'Vision Center', 'Health Insurance'],
    'Travel': ['Hotel', 'Airbnb', 'Car Rental', 'Airline', 'Travel Agency'],
    'Income': ['Employer', 'Side Gig', 'Freelance Work', 'Dividend', 'Interest'],
    'Subscription': ['Netflix', 'Spotify', 'Amazon Prime', 'Gym Membership', 'Magazine'],
    'Transfer': ['Bank Transfer', 'Venmo', 'PayPal', 'Zelle', 'Wire Transfer'],
    'Other': ['Miscellaneous', 'Unknown', 'Cash Withdrawal', 'Service Fee', 'Refund']
  }

  const accountTypes = ['Checking', 'Savings', 'Credit Card']
  
  const transactions = []
  const today = new Date()
  
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const isIncome = category === 'Income'
    const isCredit = isIncome || Math.random() > 0.8 // Some non-income transactions might be refunds
    const merchantList = merchants[category] || merchants['Other']
    const merchant = merchantList[Math.floor(Math.random() * merchantList.length)]
    const accountType = accountTypes[Math.floor(Math.random() * accountTypes.length)]
    
    let amount
    if (category === 'Income') {
      amount = getRandomNumber(500, 5000, 2)
    } else if (category === 'Travel' || category === 'Shopping') {
      amount = getRandomNumber(50, 1000, 2)
    } else {
      amount = getRandomNumber(5, 200, 2)
    }
    
    // If it's a credit, we show it as a positive number
    if (isCredit) {
      amount = Math.abs(amount)
    } else {
      amount = -Math.abs(amount)
    }
    
    const daysAgo = getRandomNumber(0, 30)
    const date = subDays(today, daysAgo)
    
    transactions.push({
      id: `txn-${i}`,
      date: format(date, 'yyyy-MM-dd'),
      formattedDate: format(date, 'MMM d, yyyy'),
      merchant,
      category,
      amount,
      formattedAmount: formatCurrency(amount),
      type: isCredit ? 'credit' : 'debit',
      account: `${accountType} Account`,
      accountId: `acc-${getRandomNumber(1, 4)}`
    })
  }
  
  // Sort by date, newest first
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * Generates random account data
 */
export const generateAccounts = () => {
  return [
    {
      id: 'acc-1',
      name: 'Main Checking',
      type: 'checking',
      balance: getRandomNumber(1000, 10000, 2),
      currency: 'USD',
      lastUpdated: format(new Date(), 'yyyy-MM-dd')
    },
    {
      id: 'acc-2',
      name: 'Savings',
      type: 'savings',
      balance: getRandomNumber(5000, 25000, 2),
      currency: 'USD',
      lastUpdated: format(new Date(), 'yyyy-MM-dd')
    },
    {
      id: 'acc-3',
      name: 'Credit Card',
      type: 'credit',
      balance: -getRandomNumber(100, 2000, 2),
      limit: 5000,
      currency: 'USD',
      lastUpdated: format(new Date(), 'yyyy-MM-dd')
    }
  ]
}

/**
 * Generates random stocks for the investment portfolio
 */
export const generateStocks = () => {
  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc', sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp', sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc', sector: 'Consumer Cyclical' },
    { symbol: 'GOOGL', name: 'Alphabet Inc', sector: 'Communication Services' },
    { symbol: 'META', name: 'Meta Platforms Inc', sector: 'Communication Services' },
    { symbol: 'TSLA', name: 'Tesla Inc', sector: 'Consumer Cyclical' },
    { symbol: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financial Services' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
    { symbol: 'V', name: 'Visa Inc', sector: 'Financial Services' },
    { symbol: 'PG', name: 'Procter & Gamble', sector: 'Consumer Defensive' }
  ]
  
  return stocks.map(stock => {
    const currentPrice = getRandomNumber(50, 500, 2)
    const changePercent = getRandomNumber(-5, 5, 2)
    const changeAmount = (currentPrice * changePercent) / 100
    
    return {
      ...stock,
      price: currentPrice,
      change: changeAmount,
      changePercent,
      shares: getRandomNumber(5, 50),
      value: currentPrice * getRandomNumber(5, 50)
    }
  })
}

/**
 * Generates random budget data
 */
export const generateBudgets = () => {
  const categories = [
    { id: 'cat-1', name: 'Housing', color: '#3498db' },
    { id: 'cat-2', name: 'Food', color: '#2ecc71' },
    { id: 'cat-3', name: 'Transportation', color: '#e74c3c' },
    { id: 'cat-4', name: 'Entertainment', color: '#f39c12' },
    { id: 'cat-5', name: 'Shopping', color: '#9b59b6' },
    { id: 'cat-6', name: 'Utilities', color: '#1abc9c' },
    { id: 'cat-7', name: 'Healthcare', color: '#e67e22' },
    { id: 'cat-8', name: 'Other', color: '#95a5a6' }
  ]
  
  return categories.map(category => {
    const budgetAmount = getRandomNumber(100, 1000, 0)
    const spentAmount = getRandomNumber(0, budgetAmount, 0)
    
    return {
      ...category,
      budget: budgetAmount,
      spent: spentAmount,
      remaining: budgetAmount - spentAmount,
      percentage: Math.round((spentAmount / budgetAmount) * 100)
    }
  })
}

/**
 * Generates random notifications
 */
export const generateNotifications = (count = 10) => {
  const notificationTypes = [
    { type: 'bill_due', title: 'Upcoming Bill', icon: '💰' },
    { type: 'low_balance', title: 'Low Balance Alert', icon: '⚠️' },
    { type: 'large_transaction', title: 'Large Transaction', icon: '💸' },
    { type: 'security', title: 'Security Alert', icon: '🔒' },
    { type: 'investment', title: 'Investment Update', icon: '📈' },
    { type: 'account', title: 'Account Update', icon: '🏦' }
  ]
  
  const messages = {
    bill_due: ['Credit Card payment due in 3 days', 'Rent payment coming up', 'Utility bill due soon'],
    low_balance: ['Your Checking account is below $100', 'Savings account reached minimum balance'],
    large_transaction: ['Large purchase detected at Apple Store', 'Unusual transaction amount at Amazon'],
    security: ['New login detected from unknown device', 'Password changed successfully'],
    investment: ['Your portfolio is up 3.2% today', 'Stock alert: AAPL is up 5%'],
    account: ['Statement is ready to view', 'Direct deposit received']
  }
  
  const notifications = []
  const today = new Date()
  
  for (let i = 0; i < count; i++) {
    const typeInfo = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
    const messageList = messages[typeInfo.type]
    const message = messageList[Math.floor(Math.random() * messageList.length)]
    
    const hoursAgo = getRandomNumber(0, 72)
    const date = new Date(today.getTime() - hoursAgo * 60 * 60 * 1000)
    
    notifications.push({
      id: `notif-${i}`,
      type: typeInfo.type,
      title: typeInfo.title,
      message,
      icon: typeInfo.icon,
      date: format(date, 'yyyy-MM-dd HH:mm'),
      formattedDate: format(date, 'MMM d, h:mm a'),
      isRead: hoursAgo > 24, // Older notifications are read
      isUrgent: typeInfo.type === 'security' || Math.random() > 0.7 // Security alerts and some others are urgent
    })
  }
  
  // Sort by date, newest first
  return notifications.sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * Generates random chart data for trends
 */
export const generateChartData = (months = 6) => {
  const labels = []
  const today = new Date()
  
  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(today, i)
    labels.push(format(date, 'MMM'))
  }
  
  // Income data
  const incomeData = labels.map(() => getRandomNumber(3000, 6000, 0))
  
  // Expense data
  const expenseData = labels.map(() => getRandomNumber(2000, 4500, 0))
  
  // Investment performance data
  const startValue = 10000
  const investmentData = []
  let currentValue = startValue
  
  for (let i = 0; i < months; i++) {
    const changePercent = getRandomNumber(-10, 15, 2)
    currentValue = currentValue * (1 + changePercent / 100)
    investmentData.push(Math.round(currentValue))
  }
  
  // Stock price history data (for a specific stock)
  const stockHistory = []
  const daysToGenerate = 30
  let stockPrice = getRandomNumber(100, 200, 2)
  const stockLabels = []
  
  for (let i = daysToGenerate - 1; i >= 0; i--) {
    const date = subDays(today, i)
    stockLabels.push(format(date, 'MMM d'))
    
    const dailyChange = getRandomNumber(-5, 5, 2)
    stockPrice = Math.max(stockPrice * (1 + dailyChange / 100), 1) // Ensure price doesn't go below 1
    stockHistory.push(stockPrice)
  }
  
  return {
    incomeVsExpense: {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: 'rgba(46, 204, 113, 0.2)',
          borderColor: 'rgba(46, 204, 113, 1)',
          borderWidth: 2
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: 'rgba(231, 76, 60, 0.2)',
          borderColor: 'rgba(231, 76, 60, 1)',
          borderWidth: 2
        }
      ]
    },
    investmentPerformance: {
      labels,
      datasets: [
        {
          label: 'Portfolio Value',
          data: investmentData,
          backgroundColor: 'rgba(52, 152, 219, 0.2)',
          borderColor: 'rgba(52, 152, 219, 1)',
          borderWidth: 2,
          tension: 0.4
        }
      ]
    },
    stockPrice: {
      labels: stockLabels,
      datasets: [
        {
          label: 'Stock Price',
          data: stockHistory,
          backgroundColor: 'rgba(155, 89, 182, 0.2)',
          borderColor: 'rgba(155, 89, 182, 1)',
          borderWidth: 2,
          tension: 0.1
        }
      ]
    },
    assetAllocation: {
      labels: ['Stocks', 'Bonds', 'Cash', 'Real Estate', 'Alternatives'],
      datasets: [
        {
          data: [45, 25, 10, 15, 5], // Percentages
          backgroundColor: [
            'rgba(52, 152, 219, 0.8)',
            'rgba(46, 204, 113, 0.8)',
            'rgba(241, 196, 15, 0.8)',
            'rgba(231, 76, 60, 0.8)',
            'rgba(155, 89, 182, 0.8)'
          ],
          borderWidth: 1
        }
      ]
    }
  }
}

/**
 * Generates financial goals
 */
export const generateGoals = () => {
  return [
    {
      id: 'goal-1',
      name: 'Emergency Fund',
      target: 10000,
      current: getRandomNumber(2000, 8000, 0),
      deadline: format(addDays(new Date(), 180), 'yyyy-MM-dd'),
      category: 'Savings',
      icon: '🛡️',
      color: '#3498db'
    },
    {
      id: 'goal-2',
      name: 'Vacation',
      target: 3000,
      current: getRandomNumber(500, 2500, 0),
      deadline: format(addDays(new Date(), 120), 'yyyy-MM-dd'),
      category: 'Travel',
      icon: '✈️',
      color: '#2ecc71'
    },
    {
      id: 'goal-3',
      name: 'New Car',
      target: 20000,
      current: getRandomNumber(5000, 15000, 0),
      deadline: format(addDays(new Date(), 365), 'yyyy-MM-dd'),
      category: 'Major Purchase',
      icon: '🚗',
      color: '#e74c3c'
    }
  ]
}