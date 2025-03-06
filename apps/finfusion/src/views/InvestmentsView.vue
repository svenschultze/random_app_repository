<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useInvestmentStore } from '@/stores/investment'
import { useFinanceStore } from '@/stores/finance'
import CardComponent from '@/components/ui/CardComponent.vue'
import StatCard from '@/components/ui/StatCard.vue'
import ChartComponent from '@/components/ui/ChartComponent.vue'
import { formatCurrency } from '@/utils/mockData'

const router = useRouter()

const investmentStore = useInvestmentStore()
const financeStore = useFinanceStore()
const isLoading = ref(false)

// Initialize data if needed
onMounted(() => {
  isLoading.value = true
  
  if (!investmentStore.isDataLoaded) {
    investmentStore.initializeData()
  }
  
  if (!financeStore.isDataLoaded) {
    financeStore.initializeData()
  }
  
  // Give time for the data to initialize
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})

// Chart options for stock price
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
      beginAtZero: false,
      ticks: {
        callback: function(value) {
          return formatCurrency(value, 'USD').replace('.00', '')
        }
      }
    }
  }
}

// Chart options for pie chart
const pieChartOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || ''
          const value = context.raw || 0
          return `${label}: ${value}%`
        }
      }
    }
  }
}

// Refresh data
const refreshData = () => {
  isLoading.value = true
  investmentStore.refreshData()
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

// Navigate to investment detail page
const openInvestmentDetail = (stock) => {
  router.push(`/investments/${stock.symbol}`)
}
</script>

<template>
  <div class="investments-view" v-voix="'Investments Page'">
    <div class="page-header">
      <h1 class="page-title">Investments</h1>
      <button 
        @click="refreshData" 
        class="refresh-button"
        :class="{ 'refreshing': isLoading }"
        v-voix="'Refresh Investment Data'"
      >
        <span class="refresh-icon">🔄</span>
        <span class="refresh-text">Refresh</span>
      </button>
    </div>
    
    <!-- Portfolio Stats -->
    <div class="stats-row">
      <StatCard 
        title="Portfolio Value" 
        :value="investmentStore.formattedTotalValue" 
        :loading="isLoading"
        icon="📊"
      />
      <StatCard 
        title="Daily Change" 
        :value="investmentStore.portfolioDailyChange.formatted" 
        :change="investmentStore.portfolioDailyChange.percentage.toFixed(2) + '%'" 
        :changeType="investmentStore.portfolioDailyChange.isPositive ? 'positive' : 'negative'"
        :trend="investmentStore.portfolioDailyChange.isPositive ? 'up' : 'down'"
        :loading="isLoading"
        icon="📈"
      />
    </div>
    
    <!-- Portfolio Performance & Allocation -->
    <div class="chart-grid">
      <CardComponent
        title="Performance"
        subtitle="Past 6 Months"
        :loading="isLoading"
        hasRefresh
        @refresh="refreshData"
        v-voix="'Portfolio Performance Chart'"
      >
        <div class="chart-container">
          <ChartComponent
            v-if="financeStore.chartData && financeStore.chartData.investmentPerformance"
            type="line"
            :data="financeStore.chartData.investmentPerformance"
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
      
      <CardComponent
        title="Asset Allocation"
        :loading="isLoading"
        hasRefresh
        @refresh="refreshData"
        v-voix="'Asset Allocation Chart'"
      >
        <div class="chart-container">
          <ChartComponent
            v-if="financeStore.chartData && financeStore.chartData.assetAllocation"
            type="doughnut"
            :data="financeStore.chartData.assetAllocation"
            :options="pieChartOptions"
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
    
    <!-- Portfolio Holdings -->
    <CardComponent
      title="Portfolio Holdings"
      :loading="isLoading"
      hasRefresh
      @refresh="refreshData"
      v-voix="'Portfolio Holdings Table'"
    >
      <div class="portfolio-table">
        <table>
          <thead>
            <tr>
              <th v-voix="'Symbol Column Header'">Symbol</th>
              <th v-voix="'Name Column Header'">Name</th>
              <th v-voix="'Sector Column Header'">Sector</th>
              <th v-voix="'Price Column Header'">Price</th>
              <th v-voix="'Change Column Header'">Change</th>
              <th v-voix="'Shares Column Header'">Shares</th>
              <th v-voix="'Value Column Header'">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="stock in investmentStore.stocks" 
              :key="stock.symbol"
              v-voix="stock.name + ' stock'"
              :hint="stock.symbol + ' in ' + stock.sector + ' sector with current price of ' + formatCurrency(stock.price)"
              class="stock-row"
              @click="openInvestmentDetail(stock)"
            >
              <td class="symbol-cell">{{ stock.symbol }}</td>
              <td>{{ stock.name }}</td>
              <td>{{ stock.sector }}</td>
              <td>{{ formatCurrency(stock.price) }}</td>
              <td :class="{ 'positive': stock.changePercent > 0, 'negative': stock.changePercent < 0 }">
                {{ stock.changePercent > 0 ? '+' : '' }}{{ stock.changePercent.toFixed(2) }}%
              </td>
              <td>{{ stock.shares }}</td>
              <td>{{ formatCurrency(stock.value) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardComponent>
    
    <!-- Sector Allocation -->
    <CardComponent
      title="Sector Allocation"
      :loading="isLoading"
      hasRefresh
      @refresh="refreshData"
      v-voix="'Sector Allocation Table'"
    >
      <div class="sector-allocation">
        <div 
          v-for="sector in investmentStore.sectorAllocation" 
          :key="sector.sector"
          class="sector-item clickable"
          v-voix="sector.sector + ' sector, click to view details'"
          :hint="sector.sector + ' represents ' + sector.percentage.toFixed(1) + ' percent of portfolio'"
          @click="openInvestmentDetail(investmentStore.stocks.find(s => s.sector === sector.sector))"
        >
          <div class="sector-info">
            <div class="sector-name">{{ sector.sector }}</div>
            <div class="sector-value">{{ sector.formatted }} ({{ sector.percentage.toFixed(1) }}%)</div>
          </div>
          <div class="sector-bar">
            <div class="sector-bar-fill" :style="{ width: sector.percentage + '%' }"></div>
          </div>
        </div>
      </div>
    </CardComponent>
    
    <!-- Investment detail now shown in a separate view -->
  </div>
</template>

<style scoped>
.investments-view {
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

.chart-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
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

.portfolio-table {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  font-weight: 600;
  color: var(--text-color);
  opacity: 0.7;
}

.symbol-cell {
  font-weight: 600;
}

.stock-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.stock-row:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.positive {
  color: var(--secondary-color, #2ecc71);
}

.negative {
  color: #e74c3c;
}

.sector-allocation {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sector-item {
  width: 100%;
}

.sector-item.clickable {
  cursor: pointer;
  transition: background-color 0.2s;
  padding: 4px;
  border-radius: 6px;
}

.sector-item.clickable:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.sector-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.sector-name {
  font-weight: 600;
}

.sector-bar {
  height: 8px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.sector-bar-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 4px;
}

@media (min-width: 768px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-grid {
    grid-template-columns: 3fr 2fr;
  }
}
</style>