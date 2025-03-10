<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header>
      <h1 v-voix="'app-title'">ClassMate</h1>
      
      <button 
        class="add-event-btn" 
        v-voix="'add-new-event'" 
        hint="Creates a new class or event"
        @click="$router.push('/event')"
      >
        + Add Event
      </button>
    </header>

    <main>
      <RouterView />
    </main>

    <nav class="main-nav">
      <RouterLink to="/" v-voix="'dashboard-link'" hint="Go to today's schedule">
        <span class="icon">📊</span>
        <span>Dashboard</span>
      </RouterLink>
      
      <RouterLink to="/weekly" v-voix="'weekly-link'" hint="View weekly timetable">
        <span class="icon">📅</span>
        <span>Weekly</span>
      </RouterLink>
      
      <RouterLink to="/daily" v-voix="'daily-link'" hint="View daily schedule">
        <span class="icon">📋</span>
        <span>Daily</span>
      </RouterLink>
      
      <RouterLink to="/calendar" v-voix="'calendar-link'" hint="View monthly calendar">
        <span class="icon">🗓️</span>
        <span>Calendar</span>
      </RouterLink>
      
      <RouterLink to="/notifications" v-voix="'notifications-link'" hint="View all notifications">
        <span class="icon">🔔</span>
        <span>Alerts</span>
      </RouterLink>
      
      <RouterLink to="/profile" v-voix="'profile-link'" hint="View profile and settings">
        <span class="icon">👤</span>
        <span>Profile</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #4a6fa5;
  color: white;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}

.add-event-btn {
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
}

main {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.main-nav {
  display: flex;
  justify-content: space-around;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 0.5rem 0;
}

.main-nav a {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #495057;
  text-decoration: none;
  font-size: 0.8rem;
  padding: 0.5rem;
}

.main-nav a.router-link-active {
  color: #4a6fa5;
  font-weight: bold;
}

.icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

@media (min-width: 768px) {
  header {
    padding: 1rem 2rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  main {
    padding: 2rem;
  }
  
  .main-nav a {
    font-size: 0.9rem;
  }
}
</style>
