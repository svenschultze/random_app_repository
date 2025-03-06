<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user'
import { useNotificationsStore } from './stores/notifications'
import NotificationToast from './components/NotificationToast.vue'

const router = useRouter()
const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const activeNotifications = computed(() => notificationsStore.activeNotifications)
const unreadCount = computed(() => notificationsStore.unreadCount)

const handleNotificationDismiss = (id) => {
  notificationsStore.dismissNotification(id)
}

// Check if user is logged in and redirect to appropriate page
onMounted(() => {
  // For demo purposes, auto-login a test user
  if (!userStore.isLoggedIn) {
    // Go to onboarding if not logged in
    router.push('/onboarding')
  }
})

// Watch for login state change
watch(() => userStore.isLoggedIn, (newIsLoggedIn) => {
  if (newIsLoggedIn) {
    router.push('/dashboard')
  } else {
    router.push('/onboarding')
  }
})
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="logo-container">
        <img alt="LangLearn logo" class="logo" src="@/assets/logo.svg" width="40" height="40" />
        <h1 class="app-title">LangLearn</h1>
      </div>
      
      <!-- Navigation menu -->
      <nav class="main-nav">
        <RouterLink to="/" v-voix="'home'" hint="Navigate to home page">Home</RouterLink>
        <RouterLink to="/dashboard" v-if="isLoggedIn" v-voix="'dashboard'" hint="Navigate to your learning dashboard">Dashboard</RouterLink>
        <RouterLink to="/lessons" v-if="isLoggedIn" v-voix="'lessons'" hint="Browse available lessons">Lessons</RouterLink>
        <RouterLink to="/challenges" v-if="isLoggedIn" v-voix="'challenges'" hint="Complete daily and weekly challenges">Challenges</RouterLink>
        <RouterLink to="/vocabulary" v-if="isLoggedIn" v-voix="'vocabulary'" hint="Review your learned vocabulary">Vocabulary</RouterLink>
        <RouterLink to="/leaderboard" v-if="isLoggedIn" v-voix="'leaderboard'" hint="View leaderboard and compare with other learners">Leaderboard</RouterLink>
        <RouterLink to="/profile" v-if="isLoggedIn" v-voix="'profile'" hint="View and edit your profile">Profile</RouterLink>
        <RouterLink to="/about" v-voix="'about'" hint="Learn about this application">About</RouterLink>
      </nav>
      
      <!-- User status section -->
      <div class="user-status" v-if="isLoggedIn">
        <div class="level-badge" v-voix="'user-level'" hint="Your current level">
          {{ userStore.profile.level }}
        </div>
        <div class="streak-counter" v-voix="'user-streak'" hint="Your current learning streak">
          <span class="streak-icon">🔥</span> {{ userStore.profile.streak }}
        </div>
        <button 
          class="notifications-button" 
          v-voix="'notifications-button'" 
          hint="View your notifications"
        >
          <span class="notification-icon">🔔</span>
          <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
        </button>
      </div>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
    
    <!-- Notifications container -->
    <div class="notifications-container">
      <NotificationToast 
        v-for="notification in activeNotifications" 
        :key="notification.id"
        :notification="notification"
        @dismiss="handleNotificationDismiss"
      />
    </div>
  </div>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #4f46e5;
  --primary-light: #818cf8;
  --primary-dark: #3730a3;
  --secondary-color: #10b981;
  --accent-color: #f59e0b;
  --bg-color: #f9fafb;
  --text-color: #111827;
  --text-light: #6b7280;
  --border-color: #e5e7eb;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  --info-color: #3b82f6;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.5;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header styles */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-title {
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--primary-dark);
}

.main-nav {
  display: flex;
  gap: 1.5rem;
}

.main-nav a {
  text-decoration: none;
  color: var(--text-light);
  font-weight: 500;
  transition: color 0.2s;
}

.main-nav a:hover {
  color: var(--primary-color);
}

.main-nav a.router-link-active {
  color: var(--primary-color);
  font-weight: 600;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.level-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  font-weight: 700;
}

.streak-counter {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--accent-color);
  font-weight: 600;
}

.streak-icon {
  font-size: 1.25rem;
}

.notifications-button {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--text-light);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--error-color);
  color: white;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Main content area */
.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* Notifications container */
.notifications-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 1000;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .main-nav {
    display: none;
  }
  
  .app-header {
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .app-header {
    padding: 0.75rem;
  }
  
  .app-title {
    font-size: 1.25rem;
  }
  
  .user-status {
    gap: 0.5rem;
  }
}
</style>
