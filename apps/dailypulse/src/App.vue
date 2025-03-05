<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const notifications = ref([
  { id: 1, message: 'Task "Update quarterly report" due in 1 hour', timestamp: new Date() },
  { id: 2, message: 'New project "Marketing Campaign" assigned to you', timestamp: new Date() },
  { id: 3, message: 'Meeting "Team Sync" starts in 30 minutes', timestamp: new Date() }
])

const showNotifications = ref(false)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}
</script>

<template>
  <div class="app-container">
    <aside class="sidebar">
      <div class="logo-container">
        <img alt="Company logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
        <h1>WorkFlow</h1>
      </div>

      <nav class="main-nav">
        <RouterLink to="/" v-voix="'dashboard-nav'" hint="Navigate to dashboard overview">
          <span class="nav-text">Dashboard</span>
        </RouterLink>
        <RouterLink to="/tasks" v-voix="'tasks-nav'" hint="Navigate to task management">
          <span class="nav-text">Tasks</span>
        </RouterLink>
        <RouterLink to="/schedule" v-voix="'schedule-nav'" hint="Navigate to scheduling calendar">
          <span class="nav-text">Schedule</span>
        </RouterLink>
        <RouterLink to="/time-tracking" v-voix="'time-tracking-nav'" hint="Navigate to time tracking">
          <span class="nav-text">Time Tracking</span>
        </RouterLink>
        <RouterLink to="/projects" v-voix="'projects-nav'" hint="Navigate to project collaboration">
          <span class="nav-text">Projects</span>
        </RouterLink>
        <RouterLink to="/performance" v-voix="'performance-nav'" hint="Navigate to performance tracking">
          <span class="nav-text">Performance</span>
        </RouterLink>
      </nav>

      <div class="user-section">
        <div class="user-info">
          <span class="username">Demo User</span>
          <span class="user-role">Project Manager</span>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <header class="top-bar">
        <div class="search-container">
          <input 
            type="text" 
            placeholder="Search..." 
            v-voix="'search-input'" 
            hint="Search across tasks, projects, and more"
          />
        </div>
        <div class="notification-container">
          <button 
            class="notification-btn" 
            @click="toggleNotifications" 
            v-voix="'notifications-button'"
            hint="View notifications, you have 3 unread notifications"
          >
            Notifications (3)
          </button>
          <div class="notification-panel" v-if="showNotifications">
            <h3>Notifications</h3>
            <ul class="notification-list">
              <li v-for="notification in notifications" :key="notification.id" class="notification-item">
                <p class="notification-message">{{ notification.message }}</p>
                <span class="notification-time">{{ notification.timestamp.toLocaleTimeString() }}</span>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div class="view-container">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style>
:root {
  --primary-color: #3498db;
  --secondary-color: #2c3e50;
  --background-color: #f5f7fa;
  --card-background: #ffffff;
  --text-color: #333;
  --border-color: #ddd;
  --sidebar-width: 240px;
  --topbar-height: 60px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}
</style>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: var(--sidebar-width);
  background-color: var(--secondary-color);
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0.5rem 0;
}

.logo {
  margin-right: 0.75rem;
}

.logo-container h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.main-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.main-nav a {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
}

.main-nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.main-nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 500;
}

.nav-text {
  margin-left: 0.5rem;
}

.user-section {
  margin-top: auto;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 500;
}

.user-role {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
}

.top-bar {
  height: var(--topbar-height);
  background-color: var(--card-background);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: fixed;
  top: 0;
  right: 0;
  left: var(--sidebar-width);
  z-index: 10;
}

.search-container input {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  width: 300px;
}

.notification-container {
  position: relative;
}

.notification-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: var(--text-color);
}

.notification-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.notification-panel h3 {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.notification-list {
  list-style: none;
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-message {
  margin-bottom: 0.25rem;
}

.notification-time {
  font-size: 0.75rem;
  color: #666;
}

.view-container {
  padding: 1.5rem;
  margin-top: var(--topbar-height);
}

@media (max-width: 768px) {
  .sidebar {
    width: 70px;
    padding: 1rem 0.5rem;
  }
  
  .nav-text, .user-role, .logo-container h1 {
    display: none;
  }
  
  .main-content {
    margin-left: 70px;
  }
  
  .top-bar {
    left: 70px;
  }
  
  .search-container input {
    width: 180px;
  }
  
  .logo-container {
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  
  .logo {
    margin-right: 0;
  }
  
  .main-nav a {
    justify-content: center;
    padding: 0.75rem;
  }
  
  .user-info {
    align-items: center;
  }
}
</style>
