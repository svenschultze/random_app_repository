<script setup>
import { RouterLink } from 'vue-router'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const navLinks = [
  { name: 'Home', path: '/', icon: '🏠' },
  { name: 'Challenges', path: '/challenges', icon: '🧩' },
  { name: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
  { name: 'Community', path: '/community', icon: '👥' },
  { name: 'Profile', path: '/profile', icon: '👤' },
]
</script>

<template>
  <nav class="app-navigation">
    <div class="app-logo">
      <h1>MindGym</h1>
      <div class="user-level">Level {{ userStore.userLevel }}</div>
    </div>
    
    <div class="nav-links">
      <RouterLink 
        v-for="link in navLinks" 
        :key="link.path" 
        :to="link.path"
        class="nav-link"
      >
        <span class="nav-icon">{{ link.icon }}</span>
        <span class="nav-text">{{ link.name }}</span>
      </RouterLink>
    </div>
    
    <div class="stats-summary">
      <div class="stat-item">
        <span class="stat-icon">🔥</span>
        <span class="stat-value">{{ userStore.userStreakDays }} day streak</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">⭐</span>
        <span class="stat-value">{{ userStore.userPoints }} points</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.app-navigation {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  min-width: 220px;
}

.app-logo {
  margin-bottom: 2rem;
  text-align: center;
}

.app-logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #3a86ff;
}

.user-level {
  font-size: 0.8rem;
  color: #777;
  margin-top: 0.25rem;
}

.nav-links {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  color: #333;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 0.25rem;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #f0f4ff;
}

.nav-link.router-link-active {
  background-color: #e6efff;
  color: #3a86ff;
  font-weight: 500;
}

.nav-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
  display: inline-block;
  width: 24px;
  text-align: center;
}

.stats-summary {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.stat-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.stat-icon {
  margin-right: 0.5rem;
}

@media (max-width: 1023px) {
  .app-navigation {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
  }
  
  .app-logo {
    margin-bottom: 0;
  }
  
  .nav-links {
    display: flex;
    flex-direction: row;
    margin-bottom: 0;
  }
  
  .nav-link {
    padding: 0.5rem;
    margin: 0 0.25rem;
  }
  
  .nav-text {
    display: none;
  }
  
  .stats-summary {
    border-top: none;
    padding-top: 0;
    display: flex;
  }
  
  .stat-item {
    margin-left: 1rem;
    margin-bottom: 0;
  }
}
</style>