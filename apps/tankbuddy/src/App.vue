<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="app-logo">
        <h1 class="app-title">TankBuddy</h1>
      </div>
      
      <nav class="app-nav">
        <RouterLink 
          to="/" 
          class="nav-link"
          v-voix="'Dashboard'"
        >
          Dashboard
        </RouterLink>
        <RouterLink 
          to="/stations" 
          class="nav-link"
          v-voix="'Stations'"
        >
          Stations
        </RouterLink>
        <RouterLink 
          to="/fillups" 
          class="nav-link"
          v-voix="'Fill-ups'"
        >
          Fill-ups
        </RouterLink>
      </nav>
    </header>

    <main class="app-content">
      <RouterView />
    </main>
    
    <footer class="app-footer">
      <p>&copy; 2023 TankBuddy - Demo Application</p>
    </footer>
  </div>
</template>

<style>
/* Global styles */
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-background: #f9fafb;
  --color-surface: #ffffff;
  --color-text: #1f2937;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--color-text);
  background-color: var(--color-background);
  line-height: 1.6;
  font-size: 16px;
}

/* App layout */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: var(--color-surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

.app-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.2s ease-in-out;
}

.nav-link:hover {
  color: var(--color-text);
}

.nav-link.router-link-active {
  color: var(--color-primary);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--color-primary);
}

.app-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.app-footer {
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .app-header {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .app-nav {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
