<script setup>
import { computed } from 'vue'
import CardComponent from '@/components/ui/CardComponent.vue'
import ChartComponent from '@/components/ui/ChartComponent.vue'
import { formatCurrency } from '@/utils/mockData'

const props = defineProps({
  transactions: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const categoryTotals = computed(() => {
  const totals = {}
  
  // Only include expense transactions (negative amounts)
  const expenses = props.transactions.filter(tx => tx.amount < 0)
  
  // Group by category and sum amounts
  expenses.forEach(tx => {
    if (!totals[tx.category]) {
      totals[tx.category] = 0
    }
    // Use absolute value since these are expenses
    totals[tx.category] += Math.abs(tx.amount)
  })
  
  // Convert to array and sort by amount
  const result = Object.entries(totals).map(([category, amount]) => ({
    category,
    amount,
    formatted: formatCurrency(amount)
  }))
  
  return result.sort((a, b) => b.amount - a.amount)
})

const chartData = computed(() => {
  // Take the top 5 categories
  const topCategories = categoryTotals.value.slice(0, 5)
  
  // If there are more categories, create an "Other" entry
  let otherAmount = 0
  if (categoryTotals.value.length > 5) {
    categoryTotals.value.slice(5).forEach(cat => {
      otherAmount += cat.amount
    })
  }
  
  const labels = topCategories.map(cat => cat.category)
  const data = topCategories.map(cat => cat.amount)
  const backgroundColor = [
    'rgba(52, 152, 219, 0.8)', // Blue
    'rgba(46, 204, 113, 0.8)', // Green
    'rgba(155, 89, 182, 0.8)', // Purple
    'rgba(241, 196, 15, 0.8)', // Yellow
    'rgba(231, 76, 60, 0.8)'   // Red
  ]
  
  // Add "Other" if necessary
  if (otherAmount > 0) {
    labels.push('Other')
    data.push(otherAmount)
    backgroundColor.push('rgba(149, 165, 166, 0.8)') // Gray
  }
  
  return {
    labels,
    datasets: [{
      label: 'Spending by Category',
      data,
      backgroundColor,
      borderWidth: 0
    }]
  }
})

const chartOptions = {
  plugins: {
    legend: {
      position: 'right'
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || ''
          const value = context.raw || 0
          return `${label}: ${formatCurrency(value)}`
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
    title="Spending Overview"
    subtitle="By Category"
    :loading="loading"
    hasRefresh
    hasMore
    @refresh="handleRefresh"
    @more="handleMore"
    v-voix="'Spending Overview Card'"
  >
    <div class="spending-overview">
      <div class="chart-container">
        <ChartComponent
          v-if="chartData && chartData.datasets"
          type="doughnut"
          :data="chartData"
          :options="chartOptions"
          :loading="loading"
          height="220px"
        />
        <div v-else class="loading-chart">
          <div class="chart-loader"></div>
          <p>Loading chart data...</p>
        </div>
      </div>
      
      <div class="category-list">
        <div 
          v-for="(category, index) in categoryTotals.slice(0, 5)" 
          :key="category.category"
          class="category-item"
          v-voix="category.category + ' spending'"
          :hint="'Category with ' + category.formatted + ' in expenses'"
        >
          <div class="category-color" :style="{ backgroundColor: chartOptions.plugins.tooltip.callbacks.colors?.[index] || `rgba(${index * 50}, ${index * 20}, ${index * 100}, 0.8)` }"></div>
          <div class="category-name">{{ category.category }}</div>
          <div class="category-amount">{{ category.formatted }}</div>
        </div>
      </div>
    </div>
  </CardComponent>
</template>

<style scoped>
.spending-overview {
  display: flex;
  flex-direction: column;
}

.chart-container {
  width: 100%;
  margin-bottom: 1rem;
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

.category-list {
  width: 100%;
}

.category-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.category-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 0.75rem;
}

.category-name {
  flex-grow: 1;
  font-size: 0.875rem;
}

.category-amount {
  font-weight: 600;
  font-size: 0.875rem;
}

@media (min-width: 768px) {
  .spending-overview {
    flex-direction: row;
  }
  
  .chart-container {
    width: 55%;
    margin-bottom: 0;
  }
  
  .category-list {
    width: 45%;
    padding-left: 1.5rem;
  }
}
</style>