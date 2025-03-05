<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'

const route = useRoute()
const router = useRouter()

const isLoggedIn = ref(false)
const showNavigation = computed(() => {
  return isLoggedIn.value && 
    !['/', '/register', '/onboarding'].includes(route.path)
})

// Check login status from localStorage
const checkLoginStatus = () => {
  const status = localStorage.getItem('isLoggedIn')
  isLoggedIn.value = status === 'true'
}

// Handle logout
const logout = () => {
  localStorage.removeItem('isLoggedIn')
  isLoggedIn.value = false
  router.push('/')
}

// Protect routes that require authentication
const protectRoutes = () => {
  const publicRoutes = ['/', '/register', '/onboarding']
  if (!isLoggedIn.value && !publicRoutes.includes(route.path)) {
    router.push('/')
  }
}

// Watch for route changes to check authentication
watch(() => route.path, () => {
  protectRoutes()
})

onMounted(() => {
  checkLoginStatus()
  protectRoutes()
})
</script>

<template>
  <div class="app-container">
    <header v-if="!showNavigation" class="landing-header">
      <div class="logo-container">
        <img alt="SkillSwap logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
        <h1 class="site-name" v-voix="'site-title'">SkillSwap</h1>
      </div>
      
      <nav v-if="!isLoggedIn" class="auth-nav">
        <RouterLink to="/register" v-voix="'register-link'" hint="Click to create a new account">Sign Up</RouterLink>
        <button class="login-btn" v-voix="'login-button'" hint="Click to log in to your account">Log In</button>
      </nav>
    </header>

    <aside v-if="showNavigation" class="main-nav">
      <div class="logo-container">
        <img alt="SkillSwap logo" class="logo" src="@/assets/logo.svg" width="40" height="40" />
        <h2 class="site-name-small">SkillSwap</h2>
      </div>
      
      <nav class="navigation-menu">
        <RouterLink to="/dashboard" v-voix="'dashboard-link'">
          <span class="nav-icon">📊</span> Dashboard
        </RouterLink>
        <RouterLink to="/profile" v-voix="'profile-link'">
          <span class="nav-icon">👤</span> My Profile
        </RouterLink>
        <RouterLink to="/matches" v-voix="'matches-link'">
          <span class="nav-icon">🔄</span> Find Matches
        </RouterLink>
        <RouterLink to="/messages" v-voix="'messages-link'">
          <span class="nav-icon">💬</span> Messages
        </RouterLink>
        <RouterLink to="/schedule" v-voix="'schedule-link'">
          <span class="nav-icon">📅</span> Schedule
        </RouterLink>
        <RouterLink to="/notifications" v-voix="'notifications-link'">
          <span class="nav-icon">🔔</span> Notifications
        </RouterLink>
        <div class="nav-spacer"></div>
        <RouterLink to="/help" v-voix="'help-link'">
          <span class="nav-icon">❓</span> Help
        </RouterLink>
        <RouterLink to="/settings" v-voix="'settings-link'">
          <span class="nav-icon">⚙️</span> Settings
        </RouterLink>
        <button 
          @click="logout" 
          class="logout-button"
          v-voix="'logout-button'"
          hint="Click to log out from your account"
        >
          <span class="nav-icon">🚪</span> Logout
        </button>
      </nav>
    </aside>

    <main :class="{'with-sidebar': showNavigation}">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #4a8cff;
  --secondary-color: #5c6bc0;
  --accent-color: #ff5252;
  --background-color: #f8f9fa;
  --text-color: #333;
  --light-text: #777;
  --border-color: #e1e4e8;
  --success-color: #66bb6a;
  --warning-color: #ffa726;
  --error-color: #ef5350;
  --content-width: 1200px;
  --sidebar-width: 250px;
  --header-height: 70px;
  --box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  --transition: all 0.3s ease;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
}

a {
  text-decoration: none;
  color: var(--primary-color);
  transition: var(--transition);
}

button {
  cursor: pointer;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 1rem;
  transition: var(--transition);
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.landing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: var(--header-height);
  border-bottom: 1px solid var(--border-color);
  background-color: white;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.site-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.site-name-small {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.auth-nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.auth-nav a {
  padding: 8px 16px;
  border-radius: 4px;
  transition: var(--transition);
}

.auth-nav a:hover {
  background-color: rgba(74, 140, 255, 0.1);
}

.login-btn {
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
}

.login-btn:hover {
  background-color: var(--secondary-color);
}

/* Sidebar Navigation */
.main-nav {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background-color: white;
  border-right: 1px solid var(--border-color);
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: var(--box-shadow);
  z-index: 10;
}

.navigation-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.navigation-menu a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: var(--text-color);
  font-weight: 500;
  transition: var(--transition);
}

.navigation-menu a.router-link-active {
  background-color: rgba(74, 140, 255, 0.1);
  color: var(--primary-color);
}

.navigation-menu a:hover,
.navigation-menu button:hover {
  background-color: rgba(74, 140, 255, 0.05);
}

.nav-icon {
  font-size: 1.2rem;
}

.nav-spacer {
  flex: 1;
  min-height: 1rem;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: var(--text-color);
  font-weight: 500;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  transition: var(--transition);
  margin-top: 0.5rem;
}

.logout-button:hover {
  color: var(--error-color);
}

/* Main Content */
main {
  flex: 1;
  padding: 2rem;
  max-width: var(--content-width);
  margin: 0 auto;
  width: 100%;
}

main.with-sidebar {
  margin-left: var(--sidebar-width);
  width: calc(100% - var(--sidebar-width));
  max-width: none;
}

@media (max-width: 768px) {
  .main-nav {
    width: 100%;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .main-nav.active {
    transform: translateX(0);
  }
  
  main.with-sidebar {
    margin-left: 0;
    width: 100%;
  }
}
</style>
