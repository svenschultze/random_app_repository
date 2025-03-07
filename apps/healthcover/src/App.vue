<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import store from './store'

// Load saved policy on app mount
onMounted(() => {
  store.loadSavedPolicy();
});
</script>

<template>
  <div class="app-container">
    <header>
      <div class="logo-container">
        <h1 class="logo-text">HealthCover Demo</h1>
      </div>

      <nav>
        <RouterLink to="/">Dashboard</RouterLink>
        <RouterLink to="/coverage">Coverage</RouterLink>
        <RouterLink to="/claims">Claims</RouterLink>
        <RouterLink to="/profile">ID Card</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <p>HealthCover Demo - For demonstration purposes only. Not a real insurance product.</p>
    </footer>
  </div>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #2c3e50;
  --secondary-color: #42b983;
  --accent-color: #e74c3c;
  --text-color: #333;
  --light-bg: #f8f9fa;
  --border-color: #ddd;
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  background-color: var(--light-bg);
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header styles */
header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

nav a.router-link-active {
  background-color: var(--secondary-color);
  color: white;
}

/* Main content */
main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Footer */
footer {
  background-color: var(--primary-color);
  color: white;
  text-align: center;
  padding: 1rem;
  font-size: 0.8rem;
}

/* Card styles */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Button styles */
.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #3aa876;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-danger {
  background-color: var(--accent-color);
}

.btn-danger:hover {
  background-color: #c0392b;
}

/* Loading indicator */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--secondary-color);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Dashboard overview grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Media queries */
@media (max-width: 768px) {
  header {
    text-align: center;
  }
  
  nav {
    justify-content: center;
  }
  
  main {
    padding: 1rem;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
