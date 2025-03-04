<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <div class="app-container">
    <header>
      <div class="logo-container">
        <img alt="JobTrek logo" class="logo" src="@/assets/logo.svg" width="40" height="40" />
        <h1 v-voix="'JobTrek App Title'">JobTrek</h1>
      </div>

      <!-- Mobile menu button -->
      <button 
        class="mobile-menu-button" 
        @click="toggleMobileMenu"
        v-voix="'Toggle Navigation Menu'"
        hint="Opens the main navigation menu"
      >
        <span class="menu-icon">&#9776;</span>
      </button>

      <!-- Navigation -->
      <nav :class="{ 'mobile-open': isMobileMenuOpen }">
        <RouterLink to="/" v-voix="'Navigate To Home'">Home</RouterLink>
        <RouterLink to="/dashboard" v-voix="'Navigate To Dashboard'">Dashboard</RouterLink>
        <RouterLink to="/goals" v-voix="'Navigate To Goals'">Goals</RouterLink>
        <RouterLink to="/daily-log" v-voix="'Navigate To Daily Log'">Daily Log</RouterLink>
        <RouterLink to="/analytics" v-voix="'Navigate To Analytics'">Analytics</RouterLink>
        <RouterLink to="/network" v-voix="'Navigate To Network'">Network</RouterLink>
        <RouterLink to="/profile" v-voix="'Navigate To Profile'">Profile</RouterLink>
        <RouterLink to="/about" v-voix="'Navigate To About'">About</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <p>&copy; 2025 JobTrek - Track your career growth daily</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo {
  height: 40px;
  width: auto;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: #e0e0e0;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

nav a.router-link-active {
  color: #42b983;
  font-weight: bold;
}

main {
  flex: 1;
  padding: 1rem;
}

footer {
  background-color: #f5f5f5;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Responsive styles */
@media (max-width: 768px) {
  .mobile-menu-button {
    display: block;
  }

  nav {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background-color: #2c3e50;
    flex-direction: column;
    padding: 1rem;
    transform: translateY(-100%);
    transition: transform 0.3s ease-in-out;
    z-index: 10;
  }

  nav.mobile-open {
    transform: translateY(0);
  }
}
</style>
