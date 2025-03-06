<script setup>
import { ref, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import CardComponent from '@/components/ui/CardComponent.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import ChartComponent from '@/components/ui/ChartComponent.vue'
import { formatCurrency } from '@/utils/mockData'

const financeStore = useFinanceStore()
const isLoading = ref(false)

// Initialize data if needed
onMounted(() => {
  isLoading.value = true
  
  if (!financeStore.isDataLoaded) {
    financeStore.initializeData()
  }
  
  // Give time for the data to initialize
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})

// Refresh data
const refreshData = () => {
  isLoading.value = true
  financeStore.refreshData()
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

// Chart options
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
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return formatCurrency(value).replace('.00', '')
        }
      }
    }
  }
}
</script>

<template>
  <div class="budgeting-view" v-voix="'Budgeting Page'">
    <div class="page-header">
      <h1 class="page-title">Budgeting</h1>
      <button 
        @click="refreshData" 
        class="refresh-button"
        :class="{ 'refreshing': isLoading }"
        v-voix="'Refresh Budgeting Data'"
      >
        <span class="refresh-icon">🔄</span>
        <span class="refresh-text">Refresh</span>
      </button>
    </div>
    
    <!-- Income vs Expenses -->
    <CardComponent
      title="Income vs Expenses"
      subtitle="Past 6 Months"
      :loading="isLoading"
      hasRefresh
      @refresh="refreshData"
      v-voix="'Income vs Expenses Chart'"
    >
      <div class="chart-container">
        <ChartComponent
          v-if="financeStore.chartData && financeStore.chartData.incomeVsExpense"
          type="bar"
          :data="financeStore.chartData.incomeVsExpense"
          :options="chartOptions"
          :loading="isLoading"
          height="300px"
        />
        <div v-else class="loading-state">
          <div class="loader"></div>
          <p>Loading chart data...</p>
        </div>
      </div>
    </CardComponent>
    
    <!-- Budget Categories -->
    <CardComponent
      title="Monthly Budget"
      :loading="isLoading"
      hasRefresh
      @refresh="refreshData"
      v-voix="'Monthly Budget Categories'"
    >
      <div class="budget-categories">
        <div 
          v-for="budget in financeStore.budgets" 
          :key="budget.id" 
          class="budget-item"
          v-voix="budget.name + ' Budget'"
          :hint="'Budget of ' + formatCurrency(budget.budget) + ', spent ' + formatCurrency(budget.spent)"
        >
          <div class="budget-header">
            <div class="budget-name-container">
              <div class="budget-color" :style="{ backgroundColor: budget.color }"></div>
              <div class="budget-name">{{ budget.name }}</div>
            </div>
            <div class="budget-amount">
              <span class="budget-spent">{{ formatCurrency(budget.spent) }}</span>
              <span class="budget-total"> / {{ formatCurrency(budget.budget) }}</span>
            </div>
          </div>
          
          <div class="budget-progress">
            <ProgressBar 
              :value="budget.percentage" 
              :color="budget.color" 
              height="10px" 
              showLabel
              labelPosition="right"
            />
          </div>
          
          <div class="budget-details">
            <div class="budget-remaining" :class="{ 'negative': budget.remaining < 0 }">
              {{ budget.remaining >= 0 ? formatCurrency(budget.remaining) + ' remaining' : formatCurrency(Math.abs(budget.remaining)) + ' over budget' }}
            </div>
          </div>
        </div>
      </div>
    </CardComponent>
    
    <!-- Savings Goals -->
    <CardComponent
      title="Savings Goals"
      :loading="isLoading"
      hasRefresh
      @refresh="refreshData"
      v-voix="'Savings Goals'"
    >
      <div class="goals-list">
        <div 
          v-for="goal in financeStore.goals" 
          :key="goal.id" 
          class="goal-item"
          v-voix="goal.name + ' Goal'"
          :hint="'Goal with target of ' + formatCurrency(goal.target) + ', currently at ' + Math.round((goal.current / goal.target) * 100) + ' percent'"
        >
          <div class="goal-header">
            <div class="goal-icon-name">
              <span class="goal-icon">{{ goal.icon }}</span>
              <h4 class="goal-name">{{ goal.name }}</h4>
            </div>
            <div class="goal-amount">{{ formatCurrency(goal.current) }} / {{ formatCurrency(goal.target) }}</div>
          </div>
          
          <div class="goal-progress">
            <ProgressBar 
              :value="Math.round((goal.current / goal.target) * 100)" 
              :color="goal.color" 
              height="10px" 
              showLabel
              labelPosition="right"
            />
          </div>
          
          <div class="goal-details">
            <div class="goal-remaining">{{ formatCurrency(goal.target - goal.current) }} to go</div>
            <div class="goal-category">{{ goal.category }}</div>
          </div>
        </div>
      </div>
    </CardComponent>
  </div>
</template>

<style scoped>
.budgeting-view {
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

.chart-container {
  width: 100%;
  height: 300px;
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

.budget-categories, .goals-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.budget-item, .goal-item {
  width: 100%;
}

.budget-header, .goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.budget-name-container, .goal-icon-name {
  display: flex;
  align-items: center;
}

.budget-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 0.75rem;
}

.goal-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.budget-name, .goal-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.budget-amount, .goal-amount {
  font-size: 0.875rem;
}

.budget-spent {
  font-weight: 600;
}

.budget-total {
  opacity: 0.7;
}

.budget-progress, .goal-progress {
  margin-bottom: 0.75rem;
}

.budget-details, .goal-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.7;
}

.budget-remaining.negative {
  color: #e74c3c;
  opacity: 1;
}

@media (min-width: 768px) {
  .budget-categories {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1200px) {
  .budget-categories {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>