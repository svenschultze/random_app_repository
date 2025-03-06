<script setup>
import { ref, computed } from 'vue'
import { useLessonsStore } from '../stores/lessons'
import { useUserStore } from '../stores/user'

const lessonsStore = useLessonsStore()
const userStore = useUserStore()

// Get leaderboard and user data
const leaderboard = computed(() => lessonsStore.sortedLeaderboard)
const currentUser = computed(() => userStore.profile)

// Time period filter
const timePeriod = ref('week') // 'week', 'month', 'allTime'

// Leaderboard scope filter
const scope = ref('global') // 'global', 'friends', 'class'

// Mock friends data
const friends = [
  { id: 'friend1', name: 'Emma', xp: 425, level: 4 },
  { id: 'friend2', name: 'Alex', xp: 380, level: 4 },
  { id: 'friend3', name: 'Sam', xp: 310, level: 3 },
]

// Mock class data
const classmates = [
  { id: 'class1', name: 'David', xp: 390, level: 4 },
  { id: 'class2', name: 'Lisa', xp: 355, level: 4 },
  { id: 'class3', name: 'Mike', xp: 320, level: 3 },
  { id: 'class4', name: 'Sarah', xp: 275, level: 3 },
]

// Get filtered leaderboard based on scope
const filteredLeaderboard = computed(() => {
  if (scope.value === 'friends') {
    return friends
  } else if (scope.value === 'class') {
    return classmates
  } else {
    return leaderboard.value
  }
})

// Find current user's rank
const userRank = computed(() => {
  if (scope.value === 'global') {
    const index = leaderboard.value.findIndex(user => user.id === currentUser.value.id)
    return index !== -1 ? index + 1 : leaderboard.value.length + 1
  }
  return '-'
})

// Mock weekly and monthly challenges
const weeklyChallenge = {
  title: 'Spring into Learning',
  description: 'Earn 300 XP this week',
  targetXP: 300,
  currentXP: 180,
  daysLeft: 3,
  participants: 245
}

const monthlyChallenge = {
  title: 'March Mastery',
  description: 'Complete 20 lessons this month',
  target: 20,
  current: 12,
  daysLeft: 12,
  participants: 478
}

// Calculate challenge progress
const challengeProgress = computed(() => {
  return Math.min(100, Math.round((weeklyChallenge.currentXP / weeklyChallenge.targetXP) * 100))
})

// Mock activities for activity feed
const recentActivities = [
  { userId: 'user3', name: 'Sofia', action: 'completed the lesson', target: 'Basic Greetings', time: '2 hours ago' },
  { userId: 'friend1', name: 'Emma', action: 'earned the badge', target: '7-Day Streak', time: '5 hours ago' },
  { userId: 'user2', name: 'John', action: 'reached level', target: '4', time: '1 day ago' },
  { userId: 'class2', name: 'Lisa', action: 'completed the lesson', target: 'At the Airport', time: '1 day ago' },
  { userId: 'user5', name: 'Yuki', action: 'earned the badge', target: 'Perfect Score', time: '2 days ago' },
]
</script>

<template>
  <div class="leaderboard-container">
    <div class="leaderboard-header">
      <h1 class="page-title">Leaderboard</h1>
      
      <div class="filter-controls">
        <div class="scope-filter">
          <button 
            class="scope-button" 
            :class="{ active: scope === 'global' }"
            @click="scope = 'global'"
            v-voix="'global-scope'"
            hint="View global leaderboard with all users"
          >
            Global
          </button>
          <button 
            class="scope-button" 
            :class="{ active: scope === 'friends' }"
            @click="scope = 'friends'"
            v-voix="'friends-scope'"
            hint="View leaderboard with only your friends"
          >
            Friends
          </button>
          <button 
            class="scope-button" 
            :class="{ active: scope === 'class' }"
            @click="scope = 'class'"
            v-voix="'class-scope'"
            hint="View leaderboard with only your class"
          >
            Class
          </button>
        </div>
        
        <div class="time-filter">
          <button 
            class="time-button" 
            :class="{ active: timePeriod === 'week' }"
            @click="timePeriod = 'week'"
            v-voix="'weekly-time'"
            hint="View this week's leaderboard"
          >
            This Week
          </button>
          <button 
            class="time-button" 
            :class="{ active: timePeriod === 'month' }"
            @click="timePeriod = 'month'"
            v-voix="'monthly-time'"
            hint="View this month's leaderboard"
          >
            This Month
          </button>
          <button 
            class="time-button" 
            :class="{ active: timePeriod === 'allTime' }"
            @click="timePeriod = 'allTime'"
            v-voix="'all-time'"
            hint="View all-time leaderboard"
          >
            All Time
          </button>
        </div>
      </div>
    </div>
    
    <div class="leaderboard-content">
      <div class="leaderboard-main">
        <div class="leaderboard-card">
          <h2 class="section-title">{{ timePeriod === 'week' ? 'Weekly' : timePeriod === 'month' ? 'Monthly' : 'All-Time' }} Leaderboard</h2>
          
          <div class="user-rank-summary" v-if="scope === 'global'">
            <div class="rank-label">Your Rank:</div>
            <div class="rank-value" v-voix="'user-rank'" :hint="`Your rank is ${userRank} out of ${leaderboard.length} users`">
              {{ userRank }} / {{ leaderboard.length }}
            </div>
          </div>
          
          <div class="leaderboard-table">
            <div class="leaderboard-header-row">
              <div class="rank-column">Rank</div>
              <div class="user-column">User</div>
              <div class="xp-column">XP</div>
              <div class="level-column">Level</div>
            </div>
            
            <div 
              v-for="(user, index) in filteredLeaderboard" 
              :key="user.id"
              class="leaderboard-row"
              :class="{ 
                'current-user': user.id === currentUser.id,
                'top-three': index < 3 
              }"
              v-voix="`rank-${index+1}`"
              :hint="`Rank ${index+1}: ${user.name} with ${user.xp} XP at level ${user.level}`"
            >
              <div class="rank-column">
                <div v-if="index === 0" class="rank-medal gold">1</div>
                <div v-else-if="index === 1" class="rank-medal silver">2</div>
                <div v-else-if="index === 2" class="rank-medal bronze">3</div>
                <div v-else class="rank-number">{{ index + 1 }}</div>
              </div>
              
              <div class="user-column">
                <div class="user-avatar">{{ user.name.charAt(0) }}</div>
                <div class="user-name">{{ user.name }}</div>
              </div>
              
              <div class="xp-column">{{ user.xp }} XP</div>
              
              <div class="level-column">
                <div class="level-badge">{{ user.level }}</div>
              </div>
            </div>
            
            <div v-if="filteredLeaderboard.length === 0" class="empty-state">
              No users found for the selected filters.
            </div>
          </div>
        </div>
      </div>
      
      <div class="leaderboard-sidebar">
        <div class="challenge-card">
          <h2 class="section-title">Weekly Challenge</h2>
          
          <div class="challenge-content">
            <div class="challenge-header">
              <h3 class="challenge-title" v-voix="'weekly-challenge-title'" :hint="weeklyChallenge.title">{{ weeklyChallenge.title }}</h3>
              <div class="challenge-days-left" v-voix="'challenge-time-left'" :hint="`${weeklyChallenge.daysLeft} days left`">{{ weeklyChallenge.daysLeft }} days left</div>
            </div>
            
            <p class="challenge-description">{{ weeklyChallenge.description }}</p>
            
            <div class="challenge-progress-info">
              <span v-voix="'challenge-progress'" :hint="`${weeklyChallenge.currentXP} of ${weeklyChallenge.targetXP} XP earned`">{{ weeklyChallenge.currentXP }} / {{ weeklyChallenge.targetXP }} XP</span>
              <span>{{ challengeProgress }}%</span>
            </div>
            
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: `${challengeProgress}%` }"></div>
            </div>
            
            <div class="challenge-participants">
              <span v-voix="'challenge-participants'" :hint="`${weeklyChallenge.participants} users participating`">
                {{ weeklyChallenge.participants }} users participating
              </span>
            </div>
          </div>
        </div>
        
        <div class="activity-card">
          <h2 class="section-title">Activity Feed</h2>
          
          <div class="activity-list">
            <div 
              v-for="(activity, index) in recentActivities" 
              :key="index"
              class="activity-item"
              v-voix="`activity-${index}`"
              :hint="`${activity.name} ${activity.action} ${activity.target} ${activity.time}`"
            >
              <div class="activity-avatar">{{ activity.name.charAt(0) }}</div>
              <div class="activity-content">
                <p class="activity-text">
                  <span class="activity-user">{{ activity.name }}</span> 
                  <span class="activity-action">{{ activity.action }}</span> 
                  <span class="activity-target">{{ activity.target }}</span>
                </p>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leaderboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.leaderboard-header {
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 1.5rem;
}

.filter-controls {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.scope-filter, .time-filter {
  display: flex;
  gap: 0.5rem;
}

.scope-button, .time-button {
  padding: 0.5rem 1rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.scope-button:hover, .time-button:hover {
  background-color: var(--border-color);
}

.scope-button.active, .time-button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.leaderboard-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 1.5rem;
}

.leaderboard-card, .challenge-card, .activity-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-dark);
  padding: 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

/* User rank summary */
.user-rank-summary {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 1.25rem 0.75rem;
  font-size: 0.875rem;
}

.rank-label {
  color: var(--text-light);
  margin-right: 0.5rem;
}

.rank-value {
  font-weight: 600;
  color: var(--primary-color);
}

/* Leaderboard table */
.leaderboard-table {
  padding: 0 1.25rem 1.25rem;
}

.leaderboard-header-row {
  display: grid;
  grid-template-columns: 60px 1fr 100px 80px;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-light);
}

.leaderboard-row {
  display: grid;
  grid-template-columns: 60px 1fr 100px 80px;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  transition: background-color 0.2s;
}

.leaderboard-row:last-child {
  border-bottom: none;
}

.leaderboard-row:hover {
  background-color: var(--bg-color);
}

.leaderboard-row.current-user {
  background-color: rgba(79, 70, 229, 0.1);
}

.leaderboard-row.top-three {
  font-weight: 500;
}

.rank-column, .xp-column, .level-column {
  display: flex;
  align-items: center;
}

.user-column {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.rank-medal {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.rank-medal.gold {
  background-color: #fbbf24;
}

.rank-medal.silver {
  background-color: #94a3b8;
}

.rank-medal.bronze {
  background-color: #d97706;
}

.rank-number {
  width: 2rem;
  display: flex;
  justify-content: center;
  font-weight: 500;
  color: var(--text-light);
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.user-name {
  font-weight: 500;
}

.level-badge {
  padding: 0.25rem 0.5rem;
  background-color: var(--primary-light);
  color: white;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Challenge card */
.challenge-content {
  padding: 0 1.25rem 1.25rem;
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.challenge-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-dark);
}

.challenge-days-left {
  font-size: 0.875rem;
  color: var(--warning-color);
  font-weight: 500;
}

.challenge-description {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 1.25rem;
}

.challenge-progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.progress-bar-container {
  height: 0.5rem;
  background-color: var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-bar {
  height: 100%;
  background-color: var(--accent-color);
  border-radius: 1rem;
}

.challenge-participants {
  font-size: 0.75rem;
  color: var(--text-light);
  text-align: center;
}

/* Activity feed */
.activity-list {
  padding: 0 1.25rem 1.25rem;
}

.activity-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.activity-user {
  font-weight: 600;
}

.activity-target {
  font-weight: 500;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-light);
}

.empty-state {
  text-align: center;
  padding: 2rem 0;
  color: var(--text-light);
  font-size: 0.875rem;
}

@media (max-width: 900px) {
  .leaderboard-content {
    grid-template-columns: 1fr;
  }
  
  .filter-controls {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .scope-filter, .time-filter {
    flex-direction: column;
    width: 100%;
  }
  
  .leaderboard-header-row, .leaderboard-row {
    grid-template-columns: 40px 1fr 80px 60px;
    font-size: 0.8125rem;
  }
  
  .user-avatar {
    width: 2rem;
    height: 2rem;
  }
}
</style>