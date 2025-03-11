<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import ActivityChart from '@/components/ActivityChart.vue';
import StatCard from '@/components/StatCard.vue';
import { getDailyLogs, calculateStats } from '@/services/dataService';

const isLoading = ref(true);
const dateRange = ref('week');

const chartData = reactive({
  days: [],
  steps: [],
  calories: [],
  activeMinutes: []
});

const stats = ref(null);

const dateRangeOptions = [
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
  { value: '3months', label: 'Last 90 Days' }
];

const daysInRange = computed(() => {
  switch (dateRange.value) {
    case 'week':
      return 7;
    case 'month':
      return 30;
    case '3months':
      return 90;
    default:
      return 7;
  }
});

const loadStats = () => {
  isLoading.value = true;
  
  // Calculate stats for the selected period
  stats.value = calculateStats(daysInRange.value);
  
  // Get daily logs for the chart
  const dailyLogs = getDailyLogs();
  
  // Sort by date (oldest to newest)
  dailyLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Take only the last X days based on the selected range
  const logsForRange = dailyLogs.slice(-daysInRange.value);
  
  // Prepare chart data
  chartData.days = logsForRange.map(log => {
    const date = new Date(log.date);
    // For week, show day names; for longer periods show short dates
    return dateRange.value === 'week' 
      ? date.toLocaleDateString('en-US', { weekday: 'short' })
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  
  chartData.steps = logsForRange.map(log => log.steps);
  chartData.calories = logsForRange.map(log => log.calories);
  chartData.activeMinutes = logsForRange.map(log => log.activeMinutes);
  
  isLoading.value = false;
};

const handleRangeChange = (event) => {
  dateRange.value = event.target.value;
  loadStats();
};

onMounted(() => {
  loadStats();
});
</script>

<template>
  <div class="stats-view">
    <div class="header-actions">
      <h1 v-voix="'stats-heading'">Activity Stats</h1>
      <div class="range-selector">
        <label 
          for="dateRangeSelect" 
          v-voix="'date-range-label'"
          hint="Select a time period to view statistics for"
        >
          Time Period:
        </label>
        <select 
          id="dateRangeSelect" 
          v-model="dateRange" 
          @change="handleRangeChange"
          v-voix="'date-range-select'"
          hint="Choose between weekly, monthly, or quarterly view"
        >
          <option 
            v-for="option in dateRangeOptions" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="loading-section">
      <p v-voix="'loading-message'">Loading your stats...</p>
    </div>
    
    <template v-else>
      <!-- Summary Section -->
      <section class="summary-section">
        <h2 class="section-title" v-voix="'summary-heading'">{{ dateRangeOptions.find(o => o.value === dateRange).label }} Summary</h2>
        
        <div class="stats-grid">
          <StatCard 
            title="Total Steps" 
            :value="stats.totalSteps.toLocaleString()" 
            icon="directions_walk" 
            color="#4CAF50"
            statId="total-steps"
          />
          
          <StatCard 
            title="Total Calories Burned" 
            :value="stats.totalCalories.toLocaleString()" 
            icon="local_fire_department" 
            color="#FF9800"
            statId="total-calories"
          />
          
          <StatCard 
            title="Total Active Minutes" 
            :value="stats.totalActiveMinutes.toLocaleString()" 
            icon="timer" 
            color="#2196F3"
            statId="total-active-minutes"
          />
          
          <StatCard 
            title="Total Workouts" 
            :value="stats.totalWorkouts.toString()" 
            icon="fitness_center" 
            color="#9C27B0"
            statId="total-workouts"
          />
          
          <StatCard 
            title="Daily Step Average" 
            :value="stats.avgSteps.toLocaleString()" 
            icon="trending_up" 
            color="#00BCD4"
            statId="avg-steps"
          />
          
          <StatCard 
            title="Step Goal Progress" 
            :value="`${stats.stepGoalProgress}%`" 
            icon="stars" 
            color="#FFC107"
            statId="step-goal-progress"
          />
        </div>
      </section>

      <!-- Charts Section -->
      <section class="charts-section">
        <h2 class="section-title" v-voix="'charts-heading'">Activity Charts</h2>
        
        <div class="chart-tabs">
          <div class="tab active" v-voix="'steps-chart-tab'">Steps</div>
        </div>
        
        <div class="chart-container">
          <ActivityChart
            type="bar"
            :data="chartData.steps"
            :labels="chartData.days"
            label="Daily Steps"
            backgroundColor="rgba(76, 175, 80, 0.2)"
            borderColor="rgba(76, 175, 80, 1)"
            height="300px"
          />
        </div>
        
        <div class="chart-tabs">
          <div class="tab active" v-voix="'calories-chart-tab'">Calories</div>
        </div>
        
        <div class="chart-container">
          <ActivityChart
            type="bar"
            :data="chartData.calories"
            :labels="chartData.days"
            label="Daily Calories"
            backgroundColor="rgba(255, 152, 0, 0.2)"
            borderColor="rgba(255, 152, 0, 1)"
            height="300px"
          />
        </div>
        
        <div class="chart-tabs">
          <div class="tab active" v-voix="'active-minutes-chart-tab'">Active Minutes</div>
        </div>
        
        <div class="chart-container">
          <ActivityChart
            type="bar"
            :data="chartData.activeMinutes"
            :labels="chartData.days"
            label="Daily Active Minutes"
            backgroundColor="rgba(33, 150, 243, 0.2)"
            borderColor="rgba(33, 150, 243, 1)"
            height="300px"
          />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.stats-view {
  max-width: 100%;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

h1 {
  font-size: 1.8rem;
  color: var(--text-color);
  margin: 0;
}

.range-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-selector label {
  font-weight: 500;
  color: var(--text-color);
}

.range-selector select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: white;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
}

.section-title {
  font-size: 1.3rem;
  margin-bottom: 1.25rem;
  color: var(--text-color);
}

section {
  margin-bottom: 2.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.chart-tabs {
  display: flex;
  margin-bottom: 1rem;
}

.tab {
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
}

.tab.active {
  background-color: var(--primary-color);
  color: white;
}

.chart-container {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .range-selector {
    width: 100%;
  }
  
  .range-selector select {
    flex: 1;
  }
}
</style>