<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showSplash = ref(true)

onMounted(() => {
  // Show splash screen for 2 seconds, then redirect to home
  setTimeout(() => {
    showSplash.value = false
  }, 2000)
})
</script>

<template>
  <div v-if="showSplash">
    <!-- Splash Screen -->
    <div class="splash-screen">
      <img alt="EasyFly logo" class="logo" src="@/assets/logo.svg" width="150" height="150" />
      <h1>EasyFly</h1>
      <p>Book flights with ease</p>
    </div>
  </div>
  <div v-else>
    <!-- Main App Layout -->
    <header>
      <div class="header-content">
        <router-link to="/" class="logo-container" v-voix="'Home Page Link'">
          <img alt="EasyFly logo" class="logo" src="@/assets/logo.svg" width="40" height="40" />
          <h1>EasyFly</h1>
        </router-link>
      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <nav class="bottom-nav">
        <RouterLink to="/" v-voix="'Home Navigation Button'" hint="Search for flights">
          <i class="nav-icon">🏠</i>
          <span>Home</span>
        </RouterLink>
        <RouterLink to="/my-bookings" v-voix="'My Bookings Navigation Button'" hint="View your booked flights">
          <i class="nav-icon">✈️</i>
          <span>My Bookings</span>
        </RouterLink>
        <RouterLink to="/alerts" v-voix="'Alerts Navigation Button'" hint="Manage your price alerts and notifications">
          <i class="nav-icon">🔔</i>
          <span>Alerts</span>
        </RouterLink>
        <RouterLink to="/settings" v-voix="'Settings Navigation Button'" hint="Adjust app preferences and settings">
          <i class="nav-icon">⚙️</i>
          <span>Settings</span>
        </RouterLink>
      </nav>
    </footer>
  </div>
</template>

<style scoped>
/* Global layout */
:root {
  --primary-color: #4a90e2;
  --secondary-color: #f8f9fa;
  --text-color: #333;
  --border-color: #e1e4e8;
}

/* Splash Screen */
.splash-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--primary-color);
  color: white;
  text-align: center;
}

.splash-screen h1 {
  margin-top: 1rem;
  font-size: 2.5rem;
  font-weight: bold;
}

.splash-screen p {
  margin-top: 0.5rem;
  font-size: 1.2rem;
}

/* Header */
header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
}

.logo-container h1 {
  margin-left: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
}

/* Main content */
main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  min-height: calc(100vh - 140px);
}

/* Bottom Navigation */
footer {
  background-color: white;
  border-top: 1px solid var(--border-color);
  position: fixed;
  bottom: 0;
  width: 100%;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0;
}

.bottom-nav a {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
  text-decoration: none;
  font-size: 0.8rem;
}

.bottom-nav a.router-link-active {
  color: var(--primary-color);
}

.nav-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .logo-container h1 {
    font-size: 1.2rem;
  }
}
</style>
