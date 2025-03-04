<script setup>
import { ref, computed, onMounted } from 'vue'

// Time period for analytics
const timePeriod = ref('month')

// Analytics data (would typically be fetched from an API)
const analyticsData = ref({
  productivity: {
    daily: [3, 4, 3, 5, 4, 2, 3],
    weekly: [3.5, 4.2, 3.1, 3.8],
    monthly: [3.7, 3.9, 3.5, 3.2, 4.0, 3.8]
  },
  taskCompletion: {
    daily: [4, 6, 5, 7, 3, 2, 5],
    weekly: [25, 32, 28, 30],
    monthly: [120, 115, 135, 125, 140, 130]
  },
  goalProgress: {
    shortTerm: [10, 25, 45, 65, 70, 75],
    midTerm: [5, 15, 20, 30, 35, 42],
    longTerm: [2, 5, 8, 12, 15, 20]
  },
  achievements: {
    categories: ['Design', 'Development', 'Research', 'Presentation', 'Learning', 'Networking'],
    counts: [8, 3, 7, 4, 12, 3]
  },
  weeklyMood: ['neutral', 'happy', 'happy', 'frustrated', 'tired', 'inspired', 'happy']
})

// User insights (these would normally be generated based on analytics)
const insights = ref([
  {
    id: 1,
    title: 'Productivity Trend',
    description: 'Your productivity has been consistently high over the past month, with an average rating of 3.8/5.',
    recommendation: 'Continue your current work routines as they appear to be effective for your productivity.'
  },
  {
    id: 2,
    title: 'Achievement Focus',
    description: 'Most of your achievements are in Learning (12) and Design (8) categories.',
    recommendation: 'Consider setting more goals in other areas like Networking to ensure balanced professional growth.'
  },
  {
    id: 3,
    title: 'Goal Progress',
    description: 'Your short-term goals are progressing well (75%), while mid-term goals are moving more slowly (42%).',
    recommendation: 'Review your mid-term goals and break them down into more actionable tasks.'
  },
  {
    id: 4,
    title: 'Mood Patterns',
    description: 'You tend to feel more frustrated mid-week and more inspired at the end of the week.',
    recommendation: 'Consider scheduling challenging tasks for days when you typically feel most energized.'
  }
])

// Mood emojis mapping
const moodEmojis = {
  happy: '😀',
  neutral: '😐',
  tired: '😴',
  frustrated: '😣',
  inspired: '🤩'
}

// Selected time period data for current view
const currentData = computed(() => {
  return {
    productivity: analyticsData.value.productivity[timePeriod.value] || [],
    taskCompletion: analyticsData.value.taskCompletion[timePeriod.value] || []
  }
})

// Calculate average productivity
const averageProductivity = computed(() => {
  const data = currentData.value.productivity
  return data && Array.isArray(data) && data.length > 0 
    ? (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1)
    : '0.0'
})

// Calculate total completed tasks
const totalCompletedTasks = computed(() => {
  const data = currentData.value.taskCompletion
  return data && Array.isArray(data) ? data.reduce((a, b) => a + b, 0) : 0
})

// Calculate mood distribution
const moodDistribution = computed(() => {
  const moods = analyticsData.value.weeklyMood
  const distribution = {}
  
  moods.forEach(mood => {
    if (distribution[mood]) {
      distribution[mood]++
    } else {
      distribution[mood] = 1
    }
  })
  
  return distribution
})

// Labels for chart axes based on time period
const timeLabels = computed(() => {
  if (timePeriod.value === 'daily') {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  } else if (timePeriod.value === 'weekly') {
    return ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  } else {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  }
})

// Change time period
const changeTimePeriod = (period) => {
  timePeriod.value = period
}

onMounted(() => {
  // In a real app, would fetch data from API here
  console.log('Analytics mounted')
})
</script>

<template>
  <div class="analytics-container">
    <div class="analytics-header">
      <h1 v-voix="'Analytics Title'">Performance Analytics</h1>
      <p class="subheading">Track your professional growth metrics and insights</p>
    </div>

    <!-- Time Period Filter -->
    <div class="time-filter">
      <button 
        class="time-btn" 
        :class="{ active: timePeriod === 'daily' }"
        @click="changeTimePeriod('daily')"
        v-voix="'Daily View Button'"
        hint="View your daily performance analytics"
      >
        Daily
      </button>
      <button 
        class="time-btn" 
        :class="{ active: timePeriod === 'weekly' }"
        @click="changeTimePeriod('weekly')"
        v-voix="'Weekly View Button'"
        hint="View your weekly performance analytics"
      >
        Weekly
      </button>
      <button 
        class="time-btn" 
        :class="{ active: timePeriod === 'monthly' }"
        @click="changeTimePeriod('monthly')"
        v-voix="'Monthly View Button'"
        hint="View your monthly performance analytics"
      >
        Monthly
      </button>
    </div>

    <!-- Key Metrics Summary -->
    <div class="metrics-summary">
      <div class="metric-card" v-voix="'Average Productivity Metric'">
        <div class="metric-title">Average Productivity</div>
        <div class="metric-value">{{ averageProductivity }}/5</div>
      </div>
      
      <div class="metric-card" v-voix="'Completed Tasks Metric'">
        <div class="metric-title">Tasks Completed</div>
        <div class="metric-value">{{ totalCompletedTasks }}</div>
      </div>
      
      <div class="metric-card" v-voix="'Goal Progress Metrics'">
        <div class="metric-title">Goal Progress</div>
        <div class="goal-progress-bars">
          <div class="progress-item">
            <div class="progress-label">
              <span>Short-term</span>
              <span>{{ analyticsData.goalProgress.shortTerm[analyticsData.goalProgress.shortTerm.length - 1] }}%</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-indicator" 
                :style="{ width: `${analyticsData.goalProgress.shortTerm[analyticsData.goalProgress.shortTerm.length - 1]}%` }"
              ></div>
            </div>
          </div>
          
          <div class="progress-item">
            <div class="progress-label">
              <span>Mid-term</span>
              <span>{{ analyticsData.goalProgress.midTerm[analyticsData.goalProgress.midTerm.length - 1] }}%</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-indicator" 
                :style="{ width: `${analyticsData.goalProgress.midTerm[analyticsData.goalProgress.midTerm.length - 1]}%` }"
              ></div>
            </div>
          </div>
          
          <div class="progress-item">
            <div class="progress-label">
              <span>Long-term</span>
              <span>{{ analyticsData.goalProgress.longTerm[analyticsData.goalProgress.longTerm.length - 1] }}%</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-indicator" 
                :style="{ width: `${analyticsData.goalProgress.longTerm[analyticsData.goalProgress.longTerm.length - 1]}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="metric-card" v-voix="'Mood Distribution Metric'">
        <div class="metric-title">Weekly Mood</div>
        <div class="mood-distribution">
          <div 
            v-for="(count, mood) in moodDistribution" 
            :key="mood" 
            class="mood-item"
          >
            <div class="mood-emoji">{{ moodEmojis[mood] }}</div>
            <div class="mood-count">{{ count }}</div>
            <div class="mood-label">{{ mood }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-card" v-voix="'Productivity Chart'">
        <h3>Productivity Over Time</h3>
        
        <!-- Simple bar chart visualization (would use a chart library in real app) -->
        <div class="chart-container">
          <div class="chart-y-axis">
            <div class="y-label">5</div>
            <div class="y-label">4</div>
            <div class="y-label">3</div>
            <div class="y-label">2</div>
            <div class="y-label">1</div>
            <div class="y-label">0</div>
          </div>
          <div class="chart-content">
            <div 
              v-for="(value, index) in currentData.productivity" 
              :key="index" 
              class="chart-bar"
              :style="{ height: `${value * 20}%` }"
              :title="`${timeLabels[index]}: ${value}`"
            ></div>
          </div>
          <div class="chart-x-axis">
            <div 
              v-for="(label, index) in timeLabels.slice(0, currentData.productivity.length)" 
              :key="index" 
              class="x-label"
            >
              {{ label }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="chart-card" v-voix="'Task Completion Chart'">
        <h3>Tasks Completed</h3>
        
        <!-- Simple bar chart visualization (would use a chart library in real app) -->
        <div class="chart-container">
          <div class="chart-y-axis">
            <div class="y-label">{{ currentData.taskCompletion.length ? Math.max(...currentData.taskCompletion) : 0 }}</div>
            <div class="y-label">{{ currentData.taskCompletion.length ? Math.round(Math.max(...currentData.taskCompletion) * 0.8) : 0 }}</div>
            <div class="y-label">{{ currentData.taskCompletion.length ? Math.round(Math.max(...currentData.taskCompletion) * 0.6) : 0 }}</div>
            <div class="y-label">{{ currentData.taskCompletion.length ? Math.round(Math.max(...currentData.taskCompletion) * 0.4) : 0 }}</div>
            <div class="y-label">{{ currentData.taskCompletion.length ? Math.round(Math.max(...currentData.taskCompletion) * 0.2) : 0 }}</div>
            <div class="y-label">0</div>
          </div>
          <div class="chart-content">
            <div 
              v-for="(value, index) in currentData.taskCompletion" 
              :key="index" 
              class="chart-bar task-bar"
              :style="{ height: `${currentData.taskCompletion.length ? (value / Math.max(...currentData.taskCompletion)) * 100 : 0}%` }"
              :title="`${timeLabels[index]}: ${value} tasks`"
            ></div>
          </div>
          <div class="chart-x-axis">
            <div 
              v-for="(label, index) in timeLabels.slice(0, currentData.taskCompletion.length)" 
              :key="index" 
              class="x-label"
            >
              {{ label }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="chart-card achievements-chart" v-voix="'Achievements Chart'">
        <h3>Achievements by Category</h3>
        
        <!-- Horizontal bar chart for achievement categories -->
        <div class="horizontal-chart">
          <div 
            v-for="(count, index) in analyticsData.achievements.counts" 
            :key="index"
            class="horizontal-bar-container"
          >
            <div class="horizontal-label">{{ analyticsData.achievements.categories[index] }}</div>
            <div class="horizontal-bar-wrapper">
              <div 
                class="horizontal-bar"
                :style="{ width: `${(count / Math.max(...analyticsData.achievements.counts)) * 100}%` }"
              ></div>
              <span class="horizontal-value">{{ count }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="chart-card goal-chart" v-voix="'Goal Progress Chart'">
        <h3>Goal Progress Trends</h3>
        
        <!-- Line chart visualization for goal progress (would use a chart library in real app) -->
        <div class="line-chart-container">
          <div class="line-chart">
            <svg viewBox="0 0 500 200" class="goal-svg">
              <!-- Short-term goal line (simplified representation) -->
              <polyline
                points="0,200 100,150 200,110 300,70 400,60 500,50"
                class="goal-line short-term"
                fill="none"
              />
              <!-- Mid-term goal line -->
              <polyline
                points="0,190 100,170 200,160 300,140 400,130 500,116"
                class="goal-line mid-term"
                fill="none"
              />
              <!-- Long-term goal line -->
              <polyline
                points="0,196 100,190 200,184 300,176 400,170 500,160"
                class="goal-line long-term"
                fill="none"
              />
            </svg>
            <div class="line-chart-legend">
              <div class="legend-item">
                <div class="legend-color short-term"></div>
                <div class="legend-label">Short-term</div>
              </div>
              <div class="legend-item">
                <div class="legend-color mid-term"></div>
                <div class="legend-label">Mid-term</div>
              </div>
              <div class="legend-item">
                <div class="legend-color long-term"></div>
                <div class="legend-label">Long-term</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Insights Section -->
    <div class="insights-section" v-voix="'Performance Insights Section'">
      <h2>Performance Insights & Recommendations</h2>
      
      <div class="insights-list">
        <div 
          v-for="insight in insights" 
          :key="insight.id"
          class="insight-card"
          v-voix="`Insight ${insight.id}`"
        >
          <h3>{{ insight.title }}</h3>
          <p class="insight-description">{{ insight.description }}</p>
          <div class="recommendation">
            <strong>Recommendation:</strong> {{ insight.recommendation }}
          </div>
        </div>
      </div>
    </div>

    <!-- Export Options -->
    <div class="export-section">
      <button 
        class="btn-secondary"
        v-voix="'Export Data Button'"
        hint="Download your performance data as a CSV file"
      >
        Export Data (CSV)
      </button>
      <button 
        class="btn-secondary"
        v-voix="'Generate Report Button'"
        hint="Generate a detailed performance report"
      >
        Generate Full Report
      </button>
    </div>
  </div>
</template>

<style scoped>
.analytics-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.analytics-header {
  margin-bottom: 2rem;
  text-align: center;
}

.analytics-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.subheading {
  color: #666;
  margin: 0;
}

.time-filter {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
}

.time-btn {
  background-color: #f5f5f5;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 30px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.time-btn:hover {
  background-color: #e0e0e0;
}

.time-btn.active {
  background-color: #42b983;
  color: white;
}

.metrics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.metric-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #42b983;
}

.goal-progress-bars {
  margin-top: 0.5rem;
}

.progress-item {
  margin-bottom: 1rem;
}

.progress-item:last-child {
  margin-bottom: 0;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-indicator {
  height: 100%;
  background-color: #42b983;
  transition: width 0.3s ease;
}

.mood-distribution {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
}

.mood-item {
  text-align: center;
}

.mood-emoji {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.mood-count {
  font-weight: 700;
  font-size: 1.2rem;
}

.mood-label {
  font-size: 0.8rem;
  color: #666;
  text-transform: capitalize;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.chart-card h3 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
}

.chart-container {
  display: flex;
  height: 250px;
  position: relative;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 10px;
  width: 40px;
}

.y-label {
  font-size: 0.8rem;
  color: #666;
  height: 20px;
  display: flex;
  align-items: center;
}

.chart-content {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  padding-top: 10px;
  height: calc(100% - 30px);
}

.chart-bar {
  width: 30px;
  background-color: #42b983;
  border-radius: 4px 4px 0 0;
  margin: 0 2px;
  transition: height 0.5s ease;
}

.task-bar {
  background-color: #3498db;
}

.chart-x-axis {
  position: absolute;
  bottom: 0;
  left: 40px;
  right: 0;
  display: flex;
  justify-content: space-around;
}

.x-label {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  width: 40px;
}

.achievements-chart, .goal-chart {
  grid-column: span 2;
}

.horizontal-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.horizontal-bar-container {
  display: flex;
  align-items: center;
}

.horizontal-label {
  width: 120px;
  font-size: 0.9rem;
}

.horizontal-bar-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
}

.horizontal-bar {
  height: 20px;
  background-color: #9b59b6;
  border-radius: 4px;
}

.horizontal-value {
  margin-left: 10px;
  font-weight: 600;
  color: #666;
}

.line-chart-container {
  height: 250px;
  position: relative;
}

.line-chart {
  height: 100%;
  width: 100%;
}

.goal-svg {
  width: 100%;
  height: 100%;
}

.goal-line {
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.goal-line.short-term {
  stroke: #42b983;
}

.goal-line.mid-term {
  stroke: #3498db;
}

.goal-line.long-term {
  stroke: #9b59b6;
}

.line-chart-legend {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 4px;
  display: flex;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color {
  width: 15px;
  height: 3px;
  border-radius: 3px;
}

.legend-color.short-term {
  background-color: #42b983;
}

.legend-color.mid-term {
  background-color: #3498db;
}

.legend-color.long-term {
  background-color: #9b59b6;
}

.legend-label {
  font-size: 0.8rem;
  color: #666;
}

.insights-section {
  margin-bottom: 2rem;
}

.insights-section h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.insights-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.insight-card h3 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.insight-description {
  margin: 0 0 1rem 0;
  color: #333;
  line-height: 1.5;
}

.recommendation {
  background-color: #f5f8fa;
  padding: 1rem;
  border-radius: 4px;
  color: #2c3e50;
  font-size: 0.95rem;
  line-height: 1.5;
}

.export-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

@media (max-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .achievements-chart, .goal-chart {
    grid-column: span 1;
  }
  
  .horizontal-bar-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .horizontal-label {
    width: 100%;
  }
  
  .export-section {
    flex-direction: column;
  }
  
  .btn-secondary {
    width: 100%;
  }
}
</style>