<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import NavBar from '../components/NavBar.vue'

// Mock data for matches
const matches = ref([
  {
    id: 1,
    name: 'Sarah',
    age: 28,
    lastActive: '10 minutes ago',
    photo: null, // We're using placeholders
    bio: 'Love hiking, cooking, and photography',
    matchDate: '2 days ago',
    hasUnreadMessages: true
  },
  {
    id: 2,
    name: 'Mike',
    age: 31,
    lastActive: '2 hours ago',
    photo: null,
    bio: 'Software engineer, coffee enthusiast, runner',
    matchDate: '1 week ago',
    hasUnreadMessages: false
  },
  {
    id: 3,
    name: 'Emma',
    age: 26,
    lastActive: 'Just now',
    photo: null,
    bio: 'Art curator with a passion for travel',
    matchDate: '3 days ago',
    hasUnreadMessages: false
  }
])

const currentFilter = ref('all') // 'all', 'new', 'unread'

function filteredMatches() {
  if (currentFilter.value === 'all') return matches.value
  
  if (currentFilter.value === 'new') {
    // Filter matches from last 3 days
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    return matches.value.filter(match => match.matchDate.includes('day'))
  }
  
  if (currentFilter.value === 'unread') {
    return matches.value.filter(match => match.hasUnreadMessages)
  }
  
  return matches.value
}

function setFilter(filter) {
  currentFilter.value = filter
}
</script>

<template>
  <div class="matches-view">
    <header class="header">
      <h1 v-voix="'Matches page title'">Your Matches</h1>
    </header>
    
    <main class="matches-content">
      <!-- Filter Tabs -->
      <div class="filters">
        <button 
          class="filter-tab" 
          :class="{ active: currentFilter === 'all' }" 
          @click="setFilter('all')"
          v-voix="'All matches filter'"
          hint="Show all your matches">
          All
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: currentFilter === 'new' }" 
          @click="setFilter('new')"
          v-voix="'New matches filter'"
          hint="Show only your recent matches">
          New
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: currentFilter === 'unread' }" 
          @click="setFilter('unread')"
          v-voix="'Unread messages filter'"
          hint="Show matches with unread messages">
          Unread
        </button>
      </div>
      
      <!-- Matches List -->
      <div v-if="filteredMatches().length > 0" class="matches-list">
        <RouterLink 
          v-for="match in filteredMatches()" 
          :key="match.id" 
          :to="`/chat/${match.id}`" 
          class="match-card"
          v-voix="'Match with ' + match.name"
          :hint="`Go to chat with ${match.name}, ${match.age}`">
          <div class="match-photo">
            <!-- Placeholder for match photo -->
            <div class="photo-placeholder">
              {{ match.name.charAt(0) }}
            </div>
            <div v-if="match.hasUnreadMessages" class="unread-indicator"></div>
          </div>
          
          <div class="match-info">
            <div class="match-header">
              <h3>{{ match.name }}, {{ match.age }}</h3>
              <span class="match-date">{{ match.matchDate }}</span>
            </div>
            <p class="match-bio">{{ match.bio }}</p>
            <div class="last-active">{{ match.lastActive }}</div>
          </div>
        </RouterLink>
      </div>
      
      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3 v-voix="'No matches message'">No matches found</h3>
        <p>
          {{ 
            currentFilter === 'all' ? 'You don\'t have any matches yet. Start speed dating to meet new people!' : 
            currentFilter === 'new' ? 'No new matches in the last few days.' : 
            'No matches with unread messages.'
          }}
        </p>
        
        <RouterLink 
          to="/dashboard" 
          class="start-dating-link"
          v-voix="'Start speed dating button'"
          hint="Go to dashboard to start speed dating">
          Start Speed Dating
        </RouterLink>
      </div>
    </main>
    
    <NavBar />
  </div>
</template>

<style scoped>
.matches-view {
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

.matches-content {
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.filters {
  display: flex;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.filter-tab {
  flex: 1;
  background: none;
  border: none;
  padding: 0.8rem;
  font-weight: 500;
  color: #777;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab.active {
  color: #ff4b7d;
  box-shadow: inset 0 -2px 0 #ff4b7d;
}

.filter-tab:hover:not(.active) {
  background-color: #f9f9f9;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.match-card {
  display: flex;
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.match-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.match-photo {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
  position: relative;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #ff4b7d, #ff7eb3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 600;
}

.unread-indicator {
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: #ff4b7d;
  border-radius: 50%;
  border: 2px solid white;
}

.match-info {
  flex: 1;
  min-width: 0;
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.3rem;
}

h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.match-date {
  font-size: 0.8rem;
  color: #999;
}

.match-bio {
  color: #666;
  font-size: 0.9rem;
  margin: 0.3rem 0 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.last-active {
  font-size: 0.8rem;
  color: #777;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  opacity: 0.3;
}

.empty-state h3 {
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
}

.empty-state p {
  color: #777;
  margin-bottom: 2rem;
}

.start-dating-link {
  display: inline-block;
  background-color: #ff4b7d;
  color: white;
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.start-dating-link:hover {
  background-color: #ff3367;
}
</style>