<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInvestmentStore } from '@/stores/investment'
import { useFinanceStore } from '@/stores/finance'
import CardComponent from '@/components/ui/CardComponent.vue'
import ChartComponent from '@/components/ui/ChartComponent.vue'
import { formatCurrency } from '@/utils/mockData'

const investmentStore = useInvestmentStore()
const financeStore = useFinanceStore()
const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const stock = ref({})
const activeTab = ref('overview')

// Get stock symbol from route params
const stockSymbol = computed(() => route.params.symbol)

// Fetch stock data
onMounted(async () => {
  if (!investmentStore.isDataLoaded) {
    await investmentStore.initializeData()
  }
  
  if (!financeStore.isDataLoaded) {
    await financeStore.initializeData()
  }
  
  // Find stock by symbol
  stock.value = investmentStore.stocks.find(s => s.symbol === stockSymbol.value) || {}
  
  isLoading.value = false
})

const isPositive = computed(() => {
  return stock.value.changePercent > 0
})

const changePercentFormatted = computed(() => {
  const value = stock.value.changePercent || 0
  return (value > 0 ? '+' : '') + value.toFixed(2) + '%'
})

const marketStatus = computed(() => {
  // Simulated market status based on current time
  const hours = new Date().getHours()
  if (hours >= 9 && hours < 16) {
    return 'open'
  } else {
    return 'closed'
  }
})

// Chart options
const chartOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || ''
          const value = context.raw || 0
          return `${label}: ${formatCurrency(value)}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        callback: (value) => {
          return formatCurrency(value).replace('.00', '')
        }
      }
    }
  }
}

// Navigate back to previous page
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="investment-detail-view" v-voix="'Investment Detail Page'">
    <div class="page-header">
      <button @click="goBack" class="back-button" v-voix="'Go Back'">
        ← Back
      </button>
      <h1 class="page-title">Investment Details</h1>
    </div>
    
    <div v-if="isLoading" class="loading-container">
      <div class="loader"></div>
      <p>Loading investment details...</p>
    </div>
    
    <div v-else-if="!stock.symbol" class="no-data">
      Investment not found
    </div>
    
    <div v-else class="investment-content">
      <!-- Investment Header -->
      <CardComponent>
        <div class="investment-header">
          <div class="stock-info">
            <div class="stock-symbol">{{ stock.symbol }}</div>
            <h2 class="stock-name">{{ stock.name }}</h2>
            <div class="stock-sector">{{ stock.sector }}</div>
          </div>
          
          <div class="stock-price-container">
            <div class="current-price">{{ formatCurrency(stock.price) }}</div>
            <div class="price-change" :class="{ 'positive': isPositive, 'negative': !isPositive }">
              {{ changePercentFormatted }}
              <span class="change-arrow">{{ isPositive ? '↑' : '↓' }}</span>
            </div>
            <div class="market-status" :class="marketStatus">
              Market {{ marketStatus === 'open' ? 'Open' : 'Closed' }}
            </div>
          </div>
        </div>
      </CardComponent>
      
      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button 
          :class="{ 'active': activeTab === 'overview' }"
          @click="activeTab = 'overview'"
          v-voix="'Overview Tab'"
        >
          Overview
        </button>
        <button 
          :class="{ 'active': activeTab === 'performance' }"
          @click="activeTab = 'performance'"
          v-voix="'Performance Tab'"
        >
          Performance
        </button>
        <button 
          :class="{ 'active': activeTab === 'details' }"
          @click="activeTab = 'details'"
          v-voix="'Details Tab'"
        >
          Details
        </button>
      </div>
      
      <div class="tab-content">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="tab-pane">
          <div class="overview-grid">
            <CardComponent title="Your Position">
              <div class="summary-details">
                <div class="summary-row">
                  <div class="summary-label">Shares</div>
                  <div class="summary-value">{{ stock.shares }}</div>
                </div>
                <div class="summary-row">
                  <div class="summary-label">Market Value</div>
                  <div class="summary-value">{{ formatCurrency(stock.value) }}</div>
                </div>
                <div class="summary-row">
                  <div class="summary-label">Average Cost</div>
                  <div class="summary-value">{{ formatCurrency(stock.price * 0.95) }}</div>
                </div>
                <div class="summary-row">
                  <div class="summary-label">Total Return</div>
                  <div class="summary-value" :class="{ 'positive': isPositive, 'negative': !isPositive }">
                    {{ formatCurrency(stock.change * stock.shares) }} ({{ stock.changePercent.toFixed(2) }}%)
                  </div>
                </div>
              </div>
            </CardComponent>
            
            <CardComponent title="Price History (30 Days)">
              <div class="stock-chart">
                <ChartComponent
                  v-if="financeStore.chartData && financeStore.chartData.stockPrice"
                  type="line"
                  :data="financeStore.chartData.stockPrice"
                  :options="chartOptions"
                  height="250px"
                />
                <div v-else class="loading-chart">
                  <div class="chart-loader"></div>
                  <p>Loading chart data...</p>
                </div>
              </div>
            </CardComponent>
          </div>
          
          <CardComponent title="Key Statistics">
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">Market Cap</div>
                <div class="stat-value">{{ formatCurrency(stock.price * 1000000000).replace('.00', '') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">P/E Ratio</div>
                <div class="stat-value">{{ (Math.random() * 30 + 5).toFixed(2) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Dividend Yield</div>
                <div class="stat-value">{{ (Math.random() * 3).toFixed(2) }}%</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">52-Week High</div>
                <div class="stat-value">{{ formatCurrency(stock.price * 1.2) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">52-Week Low</div>
                <div class="stat-value">{{ formatCurrency(stock.price * 0.8) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Volume</div>
                <div class="stat-value">{{ Math.floor(Math.random() * 10000000).toLocaleString() }}</div>
              </div>
            </div>
          </CardComponent>
        </div>
        
        <!-- Performance Tab -->
        <div v-if="activeTab === 'performance'" class="tab-pane">
          <CardComponent title="Historical Performance">
            <div class="performance-chart">
              <div class="time-period-selector">
                <button class="period-button active">1M</button>
                <button class="period-button">3M</button>
                <button class="period-button">6M</button>
                <button class="period-button">1Y</button>
                <button class="period-button">5Y</button>
              </div>
              <ChartComponent
                v-if="financeStore.chartData && financeStore.chartData.stockPrice"
                type="line"
                :data="financeStore.chartData.stockPrice"
                :options="chartOptions"
                height="300px"
              />
              <div v-else class="loading-chart">
                <div class="chart-loader"></div>
                <p>Loading chart data...</p>
              </div>
            </div>
          </CardComponent>
          
          <CardComponent title="Performance Metrics">
            <div class="metrics-list">
              <div class="metric-item">
                <div class="metric-title">1 Month</div>
                <div class="metric-value" :class="isPositive ? 'positive' : 'negative'">
                  {{ changePercentFormatted }}
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-title">3 Months</div>
                <div class="metric-value" :class="Math.random() > 0.5 ? 'positive' : 'negative'">
                  {{ (Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1)).toFixed(2) }}%
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-title">Year to Date</div>
                <div class="metric-value" :class="Math.random() > 0.3 ? 'positive' : 'negative'">
                  {{ (Math.random() * 20 * (Math.random() > 0.3 ? 1 : -1)).toFixed(2) }}%
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-title">1 Year</div>
                <div class="metric-value" :class="Math.random() > 0.3 ? 'positive' : 'negative'">
                  {{ (Math.random() * 30 * (Math.random() > 0.3 ? 1 : -1)).toFixed(2) }}%
                </div>
              </div>
            </div>
          </CardComponent>
        </div>
        
        <!-- Details Tab -->
        <div v-if="activeTab === 'details'" class="tab-pane">
          <CardComponent title="About Company">
            <div class="company-info">
              <p class="company-description">
                {{ stock.name }} is a leading company in the {{ stock.sector }} sector, focused on innovation and sustainable growth. 
                The company has a strong market position and continues to expand its operations globally.
              </p>
              
              <div class="details-grid">
                <div class="details-section">
                  <h5>Company Data</h5>
                  <div class="detail-item">
                    <div class="detail-label">CEO</div>
                    <div class="detail-value">John Smith</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Employees</div>
                    <div class="detail-value">{{ Math.floor(Math.random() * 100000 + 1000).toLocaleString() }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Founded</div>
                    <div class="detail-value">{{ Math.floor(Math.random() * 70 + 1950) }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Headquarters</div>
                    <div class="detail-value">San Francisco, CA</div>
                  </div>
                </div>
                
                <div class="details-section">
                  <h5>Financial Data</h5>
                  <div class="detail-item">
                    <div class="detail-label">Revenue (TTM)</div>
                    <div class="detail-value">{{ formatCurrency(Math.random() * 50 + 10).replace('.00', '') }}B</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Net Income</div>
                    <div class="detail-value">{{ formatCurrency(Math.random() * 10 + 1).replace('.00', '') }}B</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Profit Margin</div>
                    <div class="detail-value">{{ (Math.random() * 30 + 5).toFixed(2) }}%</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Debt-to-Equity</div>
                    <div class="detail-value">{{ (Math.random() * 2).toFixed(2) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardComponent>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="secondary-button" v-voix="'Add to Watchlist'">
          Add to Watchlist
        </button>
        <button class="primary-button" v-voix="'Trade Stock'">
          Trade
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.investment-detail-view {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.back-button {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-right: 1rem;
}

.page-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--text-color);
  opacity: 0.6;
}

.loader, .chart-loader {
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: var(--text-color);
  opacity: 0.7;
  font-size: 1.25rem;
}

.investment-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.investment-header {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
}

.stock-info {
  flex-grow: 1;
}

.stock-symbol {
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stock-name {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.stock-sector {
  font-size: 0.875rem;
  opacity: 0.7;
}

.stock-price-container {
  text-align: right;
}

.current-price {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.price-change {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.change-arrow {
  margin-left: 0.25rem;
}

.market-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  display: inline-block;
}

.market-status.open {
  background-color: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.market-status.closed {
  background-color: rgba(230, 126, 34, 0.2);
  color: #e67e22;
}

.positive {
  color: var(--secondary-color, #2ecc71);
}

.negative {
  color: #e74c3c;
}

.tab-navigation {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
}

.tab-navigation button {
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--text-color);
  cursor: pointer;
  opacity: 0.7;
  position: relative;
}

.tab-navigation button.active {
  opacity: 1;
  font-weight: 600;
}

.tab-navigation button.active:after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: var(--primary-color);
}

.tab-pane {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.overview-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.summary-details {
  padding: 0.5rem 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-row:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.summary-label {
  opacity: 0.7;
}

.summary-value {
  font-weight: 600;
}

.stock-chart {
  width: 100%;
  height: 250px;
}

.loading-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
  color: var(--text-color);
  opacity: 0.6;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 0.5rem 0;
}

.stat-item {
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
}

.performance-chart {
  padding: 0.5rem 0;
}

.time-period-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.period-button {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--border-color);
  background: none;
  border-radius: 16px;
  font-size: 0.75rem;
  cursor: pointer;
  color: var(--text-color);
}

.period-button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.metrics-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 0.5rem 0;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
}

.metric-title {
  font-weight: 500;
}

.metric-value {
  font-weight: 600;
}

.company-description {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.details-section h5 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  opacity: 0.7;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.primary-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.secondary-button {
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
  cursor: pointer;
}

@media (max-width: 768px) {
  .investment-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stock-price-container {
    text-align: left;
    margin-top: 1rem;
  }
  
  .price-change {
    justify-content: flex-start;
  }
  
  .overview-grid, .stats-grid, .metrics-list, .details-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .tab-navigation {
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .primary-button, .secondary-button {
    width: 100%;
  }
}
</style>