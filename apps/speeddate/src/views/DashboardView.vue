<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import NavBar from '../components/NavBar.vue'

// Mock data for upcoming dates
const upcomingDates = ref([
  { id: 1, time: '2025-03-05T19:00:00', status: 'scheduled' }
])

// Mock data for notifications
const notifications = ref([
  { id: 1, type: 'match', message: 'You have a new match with Sarah!', time: '2 hours ago', read: false },
  { id: 2, type: 'date', message: 'Your speed date is starting in 5 minutes', time: '5 hours ago', read: true },
  { id: 3, type: 'message', message: 'Mike sent you a new message', time: '1 day ago', read: true }
])

// Stats data
const stats = ref({
  totalDates: 12,
  matches: 4,
  avgRating: 4.2
})

function formatDateTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

function markAllAsRead() {
  notifications.value = notifications.value.map(notification => {
    return { ...notification, read: true }
  })
}
</script>

<template>
  <div class="dashboard">
    <header class="header">
      <h1 v-voix="'Dashboard title'">Dashboard</h1>
      <div class="user-menu">
        <RouterLink 
          to="/settings" 
          class="settings-link"
          v-voix="'User settings'"
          hint="Access your account settings">
          ⚙️
        </RouterLink>
      </div>
    </header>

    <main class="dashboard-content">
      <!-- Start Dating Button -->
      <div class="start-dating-container">
        <RouterLink 
          to="/queue" 
          class="start-dating-button"
          v-voix="'Start Speed Dating button'"
          hint="Click to begin the matchmaking process">
          Start Speed Dating
        </RouterLink>
      </div>
      
      <!-- Upcoming Dates Section -->
      <section class="section upcoming-dates">
        <h2 v-voix="'Upcoming dates section'">Upcoming Dates</h2>
        
        <div v-if="upcomingDates.length > 0" class="dates-list">
          <div 
            v-for="date in upcomingDates" 
            :key="date.id" 
            class="date-card"
            v-voix="'Upcoming date on ' + formatDateTime(date.time)"
            hint="Information about your next scheduled speed date">
            <div class="date-info">
              <div class="date-time">{{ formatDateTime(date.time) }}</div>
              <div class="date-status">{{ date.status }}</div>
            </div>
            <RouterLink 
              :to="'/queue'" 
              class="join-button"
              v-voix="'Join date button'"
              hint="Join this scheduled speed date">
              Join
            </RouterLink>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <p>No upcoming dates scheduled.</p>
          <RouterLink 
            to="/queue" 
            class="schedule-link"
            v-voix="'Schedule a date'"
            hint="Click to schedule a new speed date">
            Schedule a date
          </RouterLink>
        </div>
      </section>
      
      <!-- Notifications -->
      <section class="section notifications">
        <div class="section-header">
          <h2 v-voix="'Notifications section'">Notifications</h2>
          <button 
            class="mark-read-button" 
            @click="markAllAsRead"
            v-voix="'Mark all as read'"
            hint="Click to mark all notifications as read">
            Mark all as read
          </button>
        </div>
        
        <div class="notifications-list">
          <div 
            v-for="notification in notifications" 
            :key="notification.id" 
            :class="['notification-item', { unread: !notification.read }]"
            v-voix="'Notification: ' + notification.message"
            hint="Notification from the app">
            <div class="notification-icon" :class="notification.type">
              <span v-if="notification.type === 'match'">❤️</span>
              <span v-else-if="notification.type === 'date'">⏰</span>
              <span v-else-if="notification.type === 'message'">💬</span>
            </div>
            <div class="notification-content">
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ notification.time }}</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Activity Stats -->
      <section class="section stats">
        <h2 v-voix="'Activity stats section'">Your Activity</h2>
        
        <div class="stats-grid">
          <div 
            class="stat-card"
            v-voix="'Total dates stat'"
            hint="Number of speed dates you've had">
            <div class="stat-value">{{ stats.totalDates }}</div>
            <div class="stat-label">Total Dates</div>
          </div>
          
          <div 
            class="stat-card"
            v-voix="'Matches stat'"
            hint="Number of successful matches you've made">
            <div class="stat-value">{{ stats.matches }}</div>
            <div class="stat-label">Matches</div>
          </div>
          
          <div 
            class="stat-card"
            v-voix="'Average rating stat'"
            hint="Your average rating from speed dates">
            <div class="stat-value">{{ stats.avgRating }}<span class="stat-unit">/5</span></div>
            <div class="stat-label">Avg. Rating</div>
          </div>
        </div>
        
        <RouterLink 
          to="/insights" 
          class="view-all-link"
          v-voix="'View detailed insights'"
          hint="See more detailed statistics and insights">
          View detailed insights →
        </RouterLink>
      </section>
    </main>
    
    <NavBar />
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 70px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.user-menu {
  font-size: 1.5rem;
}

.settings-link {
  color: #555;
  text-decoration: none;
}

.dashboard-content {
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.section {
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
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.2rem;
  color: #444;
  margin: 0 0 1rem 0;
}

.start-dating-container {
  margin-bottom: 1.5rem;
}

.start-dating-button {
  display: block;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #ff4b7d, #ff7eb3);
  color: white;
  text-align: center;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(255, 75, 125, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;
}

.start-dating-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 75, 125, 0.4);
}

.date-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.date-time {
  font-weight: 500;
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 0.3rem;
}

.date-status {
  font-size: 0.8rem;
  color: #666;
  text-transform: capitalize;
}

.join-button {
  background-color: #ff4b7d;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  text-decoration: none;
}

.empty-state {
  text-align: center;
  padding: 1.5rem 0;
  color: #777;
}

.schedule-link {
  color: #ff4b7d;
  text-decoration: none;
  font-weight: 500;
}

.mark-read-button {
  background: none;
  border: none;
  color: #ff4b7d;
  font-size: 0.85rem;
  cursor: pointer;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.notification-item.unread {
  background-color: #fff9fa;
}

.notification-icon {
  margin-right: 1rem;
  font-size: 1.2rem;
}

.notification-content {
  flex: 1;
}

.notification-message {
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 0.3rem;
}

.notification-time {
  font-size: 0.8rem;
  color: #999;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  margin-bottom: 0.3rem;
}

.stat-unit {
  font-size: 1rem;
  color: #999;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
}

.view-all-link {
  display: block;
  text-align: right;
  margin-top: 1rem;
  color: #ff4b7d;
  text-decoration: none;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
}
</style>