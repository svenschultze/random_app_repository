<script setup>
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'

// Mock data for insights
const activityData = ref({
  totalDates: 12,
  matches: 4,
  averageRating: 4.2,
  totalMinutes: 60,  // 12 dates × 5 minutes
  matchRate: 33,     // 4 out of 12 = 33%
})

const dateHistory = ref([
  { 
    id: 1, 
    date: 'Mar 2, 2025', 
    name: 'Sarah', 
    age: 28, 
    matched: true,
    feedback: 'Great conversation about travel'
  },
  { 
    id: 2, 
    date: 'Mar 1, 2025', 
    name: 'Mike', 
    age: 31, 
    matched: true,
    feedback: 'Shared interest in hiking'
  },
  { 
    id: 3, 
    date: 'Feb 28, 2025', 
    name: 'Emma', 
    age: 26, 
    matched: true,
    feedback: 'Fun discussing favorite books'
  },
  { 
    id: 4, 
    date: 'Feb 28, 2025', 
    name: 'Alex', 
    age: 30, 
    matched: false,
    feedback: 'Different interests'
  },
  { 
    id: 5, 
    date: 'Feb 25, 2025', 
    name: 'Jessica', 
    age: 27, 
    matched: false,
    feedback: 'Not much chemistry'
  }
])

const topInterestsMatched = ref([
  { name: 'Travel', count: 3 },
  { name: 'Reading', count: 2 },
  { name: 'Hiking', count: 2 },
  { name: 'Photography', count: 1 }
])

const activeTimeOfDay = ref([
  { time: 'Morning (6AM-12PM)', percentage: 10 },
  { time: 'Afternoon (12PM-5PM)', percentage: 25 },
  { time: 'Evening (5PM-10PM)', percentage: 60 },
  { time: 'Night (10PM-6AM)', percentage: 5 }
])

// Filter state
const historyFilter = ref('all') // 'all', 'matched', 'not_matched'

function filteredHistory() {
  if (historyFilter.value === 'all') return dateHistory.value
  if (historyFilter.value === 'matched') return dateHistory.value.filter(date => date.matched)
  if (historyFilter.value === 'not_matched') return dateHistory.value.filter(date => !date.matched)
  return dateHistory.value
}

function setHistoryFilter(filter) {
  historyFilter.value = filter
}
</script>

<template>
  <div class="insights-view">
    <header class="header">
      <h1 v-voix="'Insights page title'">Insights</h1>
    </header>
    
    <main class="insights-content">
      <!-- Stats Overview Section -->
      <section class="insights-section">
        <h2 v-voix="'Activity overview section'">Activity Overview</h2>
        
        <div class="stats-grid">
          <div 
            class="stat-card"
            v-voix="'Total dates stat'"
            hint="Total number of speed dates you've had">
            <div class="stat-value">{{ activityData.totalDates }}</div>
            <div class="stat-label">Speed Dates</div>
          </div>
          
          <div 
            class="stat-card"
            v-voix="'Dating time stat'"
            hint="Total time spent on speed dates">
            <div class="stat-value">{{ activityData.totalMinutes }}</div>
            <div class="stat-label">Minutes Dating</div>
          </div>
          
          <div 
            class="stat-card"
            v-voix="'Matches stat'"
            hint="Number of matches you've made">
            <div class="stat-value">{{ activityData.matches }}</div>
            <div class="stat-label">Matches</div>
          </div>
          
          <div 
            class="stat-card"
            v-voix="'Match rate stat'"
            hint="Percentage of dates that resulted in matches">
            <div class="stat-value">{{ activityData.matchRate }}<span class="stat-unit">%</span></div>
            <div class="stat-label">Match Rate</div>
          </div>
          
          <div 
            class="stat-card"
            v-voix="'Rating stat'"
            hint="Average rating received from your dates">
            <div class="stat-value">{{ activityData.averageRating }}<span class="stat-unit">/5</span></div>
            <div class="stat-label">Avg. Rating</div>
          </div>
        </div>
      </section>
      
      <!-- Top Interests Section -->
      <section class="insights-section">
        <h2 v-voix="'Top interests section'">Top Matched Interests</h2>
        
        <div class="interests-list">
          <div 
            v-for="(interest, index) in topInterestsMatched" 
            :key="index" 
            class="interest-item"
            v-voix="interest.name + ' interest, matched ' + interest.count + ' times'">
            <div class="interest-name">{{ interest.name }}</div>
            <div class="interest-bar">
              <div class="interest-progress" :style="{ width: `${interest.count * 25}%` }"></div>
            </div>
            <div class="interest-count">{{ interest.count }}</div>
          </div>
        </div>
      </section>
      
      <!-- Active Times Section -->
      <section class="insights-section">
        <h2 v-voix="'Active times section'">Most Active Times</h2>
        
        <div class="times-list">
          <div 
            v-for="(timeSlot, index) in activeTimeOfDay" 
            :key="index" 
            class="time-item"
            v-voix="timeSlot.time + ', ' + timeSlot.percentage + ' percent of activity'">
            <div class="time-name">{{ timeSlot.time }}</div>
            <div class="time-bar">
              <div class="time-progress" :style="{ width: `${timeSlot.percentage}%` }"></div>
            </div>
            <div class="time-percentage">{{ timeSlot.percentage }}%</div>
          </div>
        </div>
      </section>
      
      <!-- Date History Section -->
      <section class="insights-section date-history">
        <div class="section-header">
          <h2 v-voix="'Date history section'">Date History</h2>
          
          <div class="history-filters">
            <button 
              class="filter-button" 
              :class="{ active: historyFilter === 'all' }" 
              @click="setHistoryFilter('all')"
              v-voix="'All dates filter'"
              hint="Show all your past dates">
              All
            </button>
            <button 
              class="filter-button" 
              :class="{ active: historyFilter === 'matched' }" 
              @click="setHistoryFilter('matched')"
              v-voix="'Matched dates filter'"
              hint="Show only dates that resulted in matches">
              Matched
            </button>
            <button 
              class="filter-button" 
              :class="{ active: historyFilter === 'not_matched' }" 
              @click="setHistoryFilter('not_matched')"
              v-voix="'Non-matched dates filter'"
              hint="Show only dates that didn't result in matches">
              Not Matched
            </button>
          </div>
        </div>
        
        <div class="history-list">
          <div 
            v-for="date in filteredHistory()" 
            :key="date.id" 
            class="history-item"
            v-voix="'Date with ' + date.name + ' on ' + date.date + ', ' + (date.matched ? 'matched' : 'not matched')">
            <div class="history-profile">
              <div class="history-avatar">{{ date.name.charAt(0) }}</div>
              <div class="history-details">
                <div class="history-name">{{ date.name }}, {{ date.age }}</div>
                <div class="history-date">{{ date.date }}</div>
              </div>
            </div>
            
            <div class="history-feedback">
              <div class="history-result" :class="{ matched: date.matched, unmatched: !date.matched }">
                {{ date.matched ? 'Matched' : 'Not Matched' }}
              </div>
              <div class="history-notes">{{ date.feedback }}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <NavBar />
  </div>
</template>

<style scoped>
.insights-view {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 70px;
}

.header {
  background-color: white;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
  text-align: center;
}

.insights-content {
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.insights-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.2rem;
  color: #444;
  margin: 0 0 1.5rem 0;
}

.section-header h2 {
  margin-bottom: 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.stat-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 600;
  color: #ff4b7d;
  margin-bottom: 0.5rem;
}

.stat-unit {
  font-size: 1rem;
  color: #999;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

/* Interests Section */
.interests-list, .times-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.interest-item, .time-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.interest-name, .time-name {
  width: 120px;
  font-size: 0.9rem;
  color: #555;
}

.interest-bar, .time-bar {
  flex: 1;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.interest-progress, .time-progress {
  height: 100%;
  background-color: #ff4b7d;
  border-radius: 4px;
}

.interest-count, .time-percentage {
  width: 30px;
  font-size: 0.9rem;
  color: #666;
  text-align: right;
}

/* History Filters */
.history-filters {
  display: flex;
  gap: 0.5rem;
}

.filter-button {
  background: none;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-button.active {
  background-color: #ff4b7d;
  color: white;
  border-color: #ff4b7d;
}

/* History List */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.history-profile {
  display: flex;
  align-items: center;
}

.history-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff4b7d, #ff7eb3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  margin-right: 0.8rem;
}

.history-name {
  font-weight: 500;
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 0.2rem;
}

.history-date {
  font-size: 0.8rem;
  color: #888;
}

.history-feedback {
  text-align: right;
}

.history-result {
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  display: inline-block;
}

.history-result.matched {
  background-color: rgba(76, 217, 100, 0.15);
  color: #36a853;
}

.history-result.unmatched {
  background-color: rgba(240, 240, 240, 0.7);
  color: #888;
}

.history-notes {
  font-size: 0.85rem;
  color: #666;
}

@media (max-width: 600px) {
  .history-item {
    flex-direction: column;
    gap: 1rem;
  }
  
  .history-feedback {
    text-align: left;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>