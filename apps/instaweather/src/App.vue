<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}
</script>

<template>
  <div class="app-container">
    <header>
      <div class="header-content">
        <div class="logo-container">
          <h1 class="app-title" v-voix="'app title'">InstaWeather</h1>
        </div>
        
        <div class="search-icon">
          <RouterLink to="/search" v-voix="'search weather'">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </RouterLink>
        </div>
        
        <button 
          class="menu-button" 
          v-voix="'toggle navigation menu'"
          @click="toggleMobileMenu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <nav :class="{ 'show': showMobileMenu }">
        <RouterLink to="/" v-voix="'home page'">Home</RouterLink>
        <RouterLink to="/search" v-voix="'search page'">Search</RouterLink>
        <RouterLink to="/settings" v-voix="'settings page'">Settings</RouterLink>
        <RouterLink to="/about" v-voix="'about page'">About</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
:root {
  --primary-color: #4392F1;
  --secondary-color: #1E2B52;
  --accent-color: #DC493A;
  --background-color: #F3F6FB;
  --text-color: #333;
  --light-text: #8895A7;
  --card-bg: #FFFFFF;
  --warning-color: #FF9800;
  --shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

.app-container {
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: var(--card-bg);
  padding: 0.5rem 1rem;
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
}

.search-icon {
  display: flex;
  align-items: center;
  color: var(--secondary-color);
}

.menu-button {
  background: none;
  border: none;
  color: var(--secondary-color);
  cursor: pointer;
  display: block;
}

nav {
  display: none;
  flex-direction: column;
  padding: 1rem 0;
  transition: max-height 0.3s ease;
}

nav.show {
  display: flex;
}

nav a {
  color: var(--secondary-color);
  text-decoration: none;
  padding: 0.5rem 0;
  font-weight: 500;
}

nav a.router-link-active {
  color: var(--primary-color);
  font-weight: 700;
}

main {
  flex: 1;
  padding: 1rem;
  overflow-x: hidden;
}

@media (min-width: 768px) {
  header {
    padding: 1rem 2rem;
  }

  .menu-button {
    display: none;
  }

  nav {
    display: flex;
    flex-direction: row;
    padding: 0;
    margin-top: 1rem;
  }

  nav a {
    padding: 0 1rem;
  }

  nav a:first-child {
    padding-left: 0;
  }
}
</style>
