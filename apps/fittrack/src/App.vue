<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { ref, onMounted } from 'vue';
import { initializeData } from '@/services/dataService';
import VoixInput from '@/components/VoixInput.vue';

const isMobileMenuOpen = ref(false);

onMounted(() => {
  // Initialize data on first load
  initializeData();
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<template>
  <header class="app-header">
    <div class="container header-container">
      <div class="logo-container">
        <RouterLink to="/" class="logo-link" v-voix="'logo-link'" hint="Navigate to home page">
          <h1 class="logo-text">FitTrack</h1>
        </RouterLink>
      </div>
      
      <button 
        class="mobile-menu-toggle" 
        @click="toggleMobileMenu" 
        v-voix="'toggle-menu-button'" 
        hint="Toggle navigation menu"
      >
        <span class="menu-icon"></span>
      </button>
      
      <nav class="main-nav" :class="{ 'is-open': isMobileMenuOpen }">
        <RouterLink 
          to="/" 
          class="nav-link" 
          @click="isMobileMenuOpen = false"
          v-voix="'home-nav-link'"
          hint="Go to dashboard page"
        >
          Dashboard
        </RouterLink>
        <RouterLink 
          to="/workouts" 
          class="nav-link" 
          @click="isMobileMenuOpen = false"
          v-voix="'workouts-nav-link'"
          hint="View workout history"
        >
          Workouts
        </RouterLink>
        <RouterLink 
          to="/stats" 
          class="nav-link" 
          @click="isMobileMenuOpen = false"
          v-voix="'stats-nav-link'"
          hint="View statistics and analytics"
        >
          Stats
        </RouterLink>
        <RouterLink 
          to="/settings" 
          class="nav-link" 
          @click="isMobileMenuOpen = false"
          v-voix="'settings-nav-link'"
          hint="Adjust your fitness goals and preferences"
        >
          Settings
        </RouterLink>
        <RouterLink 
          to="/about" 
          class="nav-link" 
          @click="isMobileMenuOpen = false"
          v-voix="'about-nav-link'"
          hint="Learn about this application"
        >
          About
        </RouterLink>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <div class="container">
      <RouterView />
    </div>
  </main>

  <footer class="app-footer">
    <div class="container">
      <p class="footer-text" v-voix="'footer-text'">
        FitTrack Demo App &copy; {{ new Date().getFullYear() }} - For demonstration purposes only
      </p>
    </div>
  </footer>
  
  <!-- Voix Input Bar -->
  <VoixInput />
</template>

<style>
:root {
  --primary-color: #4CAF50;
  --primary-dark: #388E3C;
  --primary-light: #A5D6A7;
  --accent-color: #FF9800;
  --text-color: #333333;
  --text-light: #666666;
  --background-color: #f5f5f5;
  --card-color: #ffffff;
  --border-color: #e0e0e0;
  --header-height: 64px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header Styles */
.app-header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--header-height);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-link {
  text-decoration: none;
  color: var(--primary-color);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
}

.main-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-link.router-link-active {
  color: var(--primary-color);
  font-weight: 600;
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  position: relative;
}

.menu-icon {
  display: block;
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: var(--text-color);
  transition: all 0.3s;
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: var(--text-color);
  transition: all 0.3s;
}

.menu-icon::before {
  transform: translateY(-8px);
}

.menu-icon::after {
  transform: translateY(8px);
}

/* Main Content Styles */
.main-content {
  padding-top: calc(var(--header-height) + 2rem);
  padding-bottom: calc(2rem + 70px); /* Extra padding to accommodate the fixed input bar */
  min-height: calc(100vh - var(--header-height) - 60px - 70px);
}

/* Footer Styles */
.app-footer {
  background-color: white;
  padding: 1rem 0;
  text-align: center;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
}

.footer-text {
  color: var(--text-light);
  font-size: 0.9rem;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }

  .main-nav {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    background-color: white;
    flex-direction: column;
    gap: 0;
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .main-nav.is-open {
    height: 250px;
  }

  .nav-link {
    display: block;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
}
</style>
