<script setup>
import { computed, ref } from 'vue';
import BaseModal from './BaseModal.vue';
import ChartComponent from '@/components/ui/ChartComponent.vue';
import { formatCurrency } from '@/utils/mockData';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Object,
    default: () => ({})
  },
  chartData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const activeTab = ref('overview');

const isPositive = computed(() => {
  return props.stock.changePercent > 0;
});

const changePercentFormatted = computed(() => {
  const value = props.stock.changePercent || 0;
  return (value > 0 ? '+' : '') + value.toFixed(2) + '%';
});

const marketStatus = computed(() => {
  // Simulated market status based on current time
  const hours = new Date().getHours();
  if (hours >= 9 && hours < 16) {
    return 'open';
  } else {
    return 'closed';
  }
});

// Chart options
const chartOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || '';
          const value = context.raw || 0;
          return `${label}: ${formatCurrency(value)}`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        callback: (value) => {
          return formatCurrency(value).replace('.00', '');
        }
      }
    }
  }
};
</script>

<template>
  <BaseModal :show="show" :title="stock.name || 'Stock Details'" @close="$emit('close')" maxWidth="800px">
    <div class="investment-detail" v-voix="'Investment Details'">
      <div v-if="!stock.symbol" class="no-data">
        No investment data available
      </div>
      
      <div v-else>
        <div class="investment-header">
          <div class="stock-info">
            <div class="stock-symbol">{{ stock.symbol }}</div>
            <h3 class="stock-name">{{ stock.name }}</h3>
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
              <div class="portfolio-summary">
                <h4>Your Position</h4>
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
              </div>
              
              <div class="stock-chart">
                <h4>Price History (30 Days)</h4>
                <ChartComponent
                  v-if="chartData && chartData.stockPrice"
                  type="line"
                  :data="chartData.stockPrice"
                  :options="chartOptions"
                  height="220px"
                />
                <div v-else class="loading-chart">
                  <div class="chart-loader"></div>
                  <p>Loading chart data...</p>
                </div>
              </div>
            </div>
            
            <div class="key-stats">
              <h4>Key Statistics</h4>
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
            </div>
          </div>
          
          <!-- Performance Tab -->
          <div v-if="activeTab === 'performance'" class="tab-pane">
            <div class="performance-grid">
              <div class="performance-chart">
                <h4>Historical Performance</h4>
                <div class="time-period-selector">
                  <button class="period-button active">1M</button>
                  <button class="period-button">3M</button>
                  <button class="period-button">6M</button>
                  <button class="period-button">1Y</button>
                  <button class="period-button">5Y</button>
                </div>
                <ChartComponent
                  v-if="chartData && chartData.stockPrice"
                  type="line"
                  :data="chartData.stockPrice"
                  :options="chartOptions"
                  height="300px"
                />
                <div v-else class="loading-chart">
                  <div class="chart-loader"></div>
                  <p>Loading chart data...</p>
                </div>
              </div>
              
              <div class="performance-metrics">
                <h4>Performance Metrics</h4>
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
              </div>
            </div>
          </div>
          
          <!-- Details Tab -->
          <div v-if="activeTab === 'details'" class="tab-pane">
            <div class="company-info">
              <h4>About {{ stock.name }}</h4>
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
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <button 
        class="secondary-button" 
        @click="$emit('close')"
        v-voix="'Close'"
      >
        Close
      </button>
      <button 
        class="primary-button"
        v-voix="'Trade Stock'"
      >
        Trade
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
.investment-detail {
  color: var(--text-color);
}

.no-data {
  text-align: center;
  padding: 30px;
  color: var(--text-color);
  opacity: 0.7;
}

.investment-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.stock-info {
  flex-grow: 1;
}

.stock-symbol {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.stock-name {
  margin: 0 0 4px;
  font-size: 1.5rem;
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
}

.price-change {
  font-size: 1rem;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.change-arrow {
  margin-left: 4px;
}

.market-status {
  font-size: 0.75rem;
  padding: 2px 8px;
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
  margin-bottom: 24px;
}

.tab-navigation button {
  padding: 12px 20px;
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
  gap: 24px;
  margin-bottom: 24px;
}

.portfolio-summary, .stock-chart, .key-stats, 
.performance-chart, .performance-metrics, .company-info {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 20px;
}

.portfolio-summary h4, .stock-chart h4, .key-stats h4,
.performance-chart h4, .performance-metrics h4, .company-info h4 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.125rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.summary-row:last-child {
  margin-bottom: 0;
}

.summary-label {
  opacity: 0.7;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
}

.performance-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.time-period-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.period-button {
  padding: 4px 12px;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
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
  margin-bottom: 24px;
  line-height: 1.6;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.details-section h5 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  opacity: 0.7;
}

.primary-button {
  padding: 8px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.secondary-button {
  padding: 8px 20px;
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
  cursor: pointer;
}

.loading-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 220px;
  color: var(--text-color);
  opacity: 0.6;
}

.chart-loader {
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .investment-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .stock-price-container {
    text-align: left;
  }
  
  .price-change {
    justify-content: flex-start;
  }
  
  .overview-grid, .performance-grid, .details-grid, .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>