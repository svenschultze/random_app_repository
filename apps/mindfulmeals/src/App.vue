<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <RouterLink to="/" class="navbar-brand" v-voix="'MindfulMeals Home'">
          <span class="brand-text">MindfulMeals</span>
        </RouterLink>
        
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
          v-voix="'Toggle Navigation Menu'"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <RouterLink to="/" class="nav-link" v-voix="'Dashboard'" hint="Main view with summary of your daily progress">
                <i class="bi bi-house-door"></i> Dashboard
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/meal-plan" class="nav-link" v-voix="'Meal Plan'" hint="View and filter your daily meal suggestions">
                <i class="bi bi-calendar-check"></i> Meal Plan
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/food-tracker" class="nav-link" v-voix="'Food Tracker'" hint="Log food items and track your nutrition">
                <i class="bi bi-journal-plus"></i> Food Tracker
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/exercises" class="nav-link" v-voix="'Mindful Exercises'" hint="Access guided mindful eating exercises">
                <i class="bi bi-peace"></i> Mindful Exercises
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/analytics" class="nav-link" v-voix="'Analytics'" hint="View nutrition analytics and progress charts">
                <i class="bi bi-bar-chart"></i> Analytics
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/community" class="nav-link" v-voix="'Community'" hint="Read community posts and expert tips">
                <i class="bi bi-people"></i> Community
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </header>

    <main class="container py-4">
      <RouterView />
    </main>

    <footer class="bg-light py-4 mt-5">
      <div class="container text-center">
        <p class="mb-0">© 2025 MindfulMeals - A Demo App for Mindful Eating</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Import Bootstrap Icons */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css");

.brand-text {
  font-weight: 700;
  font-size: 1.5rem;
  color: #4a854a;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.nav-link {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  color: #555;
}

.nav-link.router-link-active {
  color: #4a854a;
  font-weight: 600;
}
</style>
