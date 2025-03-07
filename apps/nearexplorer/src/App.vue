<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const showNavigation = computed(() => route.name !== 'explore' && route.name !== 'poiDetail')
</script>

<template>
  <div class="app-container">
    <header v-if="showNavigation">
      <div class="header-content">
        <h1 class="app-title" v-voix="'app-title'">NearExplorer</h1>
        <nav>
          <RouterLink to="/" v-voix="'home-link'">Home</RouterLink>
          <RouterLink to="/explore" v-voix="'explore-link'">Explore</RouterLink>
          <RouterLink to="/profile" v-voix="'profile-link'">Profile</RouterLink>
          <RouterLink to="/about" v-voix="'about-link'">About</RouterLink>
        </nav>
      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <footer v-if="showNavigation">
      <p>&copy; 2025 NearExplorer</p>
    </footer>
  </div>
</template>

<style>
/* Global styles */
body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', Arial, sans-serif;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #3498db;
  padding: 1rem;
  color: white;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  margin: 0;
  font-size: 1.5rem;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.3);
}

main {
  flex: 1;
}

footer {
  background-color: #ecf0f1;
  padding: 1rem;
  text-align: center;
  color: #7f8c8d;
}

/* Map container takes full height in explore and POI views */
.map-full-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* Utility classes for map overlays */
.map-overlay {
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.bottom-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  padding: 1rem;
  z-index: 2;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

/* Button styles */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

.btn:active {
  transform: scale(0.98);
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-secondary {
  background-color: #ecf0f1;
  color: #2c3e50;
}

.btn-success {
  background-color: #2ecc71;
  color: white;
}
</style>
