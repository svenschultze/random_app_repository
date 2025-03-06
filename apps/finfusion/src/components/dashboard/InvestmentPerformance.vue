<script setup>
import { computed } from 'vue'
import CardComponent from '@/components/ui/CardComponent.vue'
import ChartComponent from '@/components/ui/ChartComponent.vue'
import StatCard from '@/components/ui/StatCard.vue'
import { formatCurrency } from '@/utils/mockData'

const props = defineProps({
  stocks: {
    type: Array,
    required: true
  },
  chartData: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const portfolioValue = computed(() => {
  return props.stocks.reduce((total, stock) => total + stock.value, 0)
})

const formattedPortfolioValue = computed(() => formatCurrency(portfolioValue.value))

const dailyChange = computed(() => {
  const totalChange = props.stocks.reduce((sum, stock) => {
    return sum + (stock.change * stock.shares)
  }, 0)
  
  const percentChange = (totalChange / portfolioValue.value) * 100
  
  return {
    amount: totalChange,
    percentage: percentChange.toFixed(2),
    formatted: formatCurrency(totalChange),
    isPositive: totalChange >= 0
  }
})

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

const emit = defineEmits(['refresh', 'more'])

const handleRefresh = () => {
  emit('refresh')
}

const handleMore = () => {
  emit('more')
}
</script>

<template>
  <CardComponent
    title="Investment Performance"
    :loading="loading"
    hasRefresh
    hasMore
    @refresh="handleRefresh"
    @more="handleMore"
    v-voix="'Investment Performance Card'"
  >
    <div class="investment-performance">
      <div class="stats-row">
        <StatCard 
          title="Portfolio Value" 
          :value="formattedPortfolioValue" 
          :loading="loading"
          icon="📊"
        />
        <StatCard 
          title="Daily Change" 
          :value="dailyChange.formatted" 
          :change="dailyChange.percentage + '%'" 
          :changeType="dailyChange.isPositive ? 'positive' : 'negative'"
          :trend="dailyChange.isPositive ? 'up' : 'down'"
          :loading="loading"
          icon="📈"
        />
      </div>
      
      <h4 class="chart-title" v-voix="'Performance Over Time Chart'">Performance Over Time</h4>
      <div class="chart-container">
        <ChartComponent
          v-if="chartData && chartData.investmentPerformance"
          type="line"
          :data="chartData.investmentPerformance"
          :options="chartOptions"
          :loading="loading"
          height="220px"
        />
        <div v-else class="loading-chart">
          <div class="chart-loader"></div>
          <p>Loading chart data...</p>
        </div>
      </div>
    </div>
  </CardComponent>
</template>

<style scoped>
.investment-performance {
  width: 100%;
}

.stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.chart-title {
  margin: 0 0 1rem;
  font-size: 1rem;
  color: var(--text-color);
}

.chart-container {
  width: 100%;
  position: relative;
  min-height: 220px;
}

.loading-chart {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--card-background);
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
</style>