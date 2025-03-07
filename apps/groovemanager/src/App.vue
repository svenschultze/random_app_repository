<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="app-logo">
        <h1>GrooveManager</h1>
      </div>
      
      <nav>
        <RouterLink 
          v-voix="'home-nav-link'" 
          to="/" 
          active-class="active"
        >
          Library
        </RouterLink>
        
        <RouterLink 
          v-voix="'playlists-nav-link'" 
          to="/playlists" 
          active-class="active"
        >
          Playlists
        </RouterLink>
        
        <RouterLink 
          v-voix="'about-nav-link'" 
          to="/about" 
          active-class="active"
        >
          About
        </RouterLink>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #bb86fc;
  --secondary-color: #03dac6;
  --background-dark: #121212;
  --surface-dark: #1e1e1e;
  --text-light: #ffffff;
  --text-medium: #aaaaaa;
  --text-dark: #888888;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--background-dark);
  color: var(--text-light);
  line-height: 1.6;
}

/* App-specific styles */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.app-logo h1 {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

nav {
  display: flex;
  gap: 16px;
}

nav a {
  color: var(--text-medium);
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s;
  font-weight: 500;
}

nav a:hover {
  color: var(--text-light);
  background-color: rgba(255, 255, 255, 0.05);
}

nav a.active {
  color: var(--primary-color);
  background-color: rgba(187, 134, 252, 0.08);
}

/* Responsive styles */
@media (max-width: 600px) {
  .app-header {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }
  
  nav {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
