<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <div class="container">
      <div class="logo-container">
        <RouterLink to="/" v-voix="'app-logo'" hint="Navigate to home page">
          <img alt="MyRecipeBook logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
          <span class="app-title">MyRecipeBook</span>
        </RouterLink>
      </div>

      <nav class="main-nav" v-voix="'main-navigation'" hint="Main navigation menu">
        <RouterLink to="/" v-voix="'nav-home'">Home</RouterLink>
        <RouterLink to="/recipes" v-voix="'nav-recipes'">Recipes</RouterLink>
        <RouterLink to="/add" v-voix="'nav-add-recipe'">Add Recipe</RouterLink>
        <RouterLink to="/about" v-voix="'nav-about'">About</RouterLink>
        <RouterLink to="/contact" v-voix="'nav-contact'">Contact</RouterLink>
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
      <p v-voix="'footer-copyright'">© 2025 MyRecipeBook Demo</p>
    </div>
  </footer>
</template>

<style>
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  color: #333;
  line-height: 1.6;
  width: 100%;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;
}

/* Header styles */
.app-header {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-container a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 0.5rem;
}

.main-nav {
  display: flex;
  gap: 1.5rem;
}

.main-nav a {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: color 0.3s ease;
  padding: 0.5rem 0;
}

.main-nav a:hover {
  color: #ff6b6b;
}

.main-nav a.router-link-active {
  color: #ff6b6b;
  border-bottom: 2px solid #ff6b6b;
}

/* Main content styles */
.main-content {
  min-height: calc(100vh - 140px);
  padding: 2rem 0;
}

/* Footer styles */
.app-footer {
  background-color: #333;
  color: white;
  padding: 1rem 0;
  text-align: center;
}

/* Responsive styles */
@media (max-width: 768px) {
  .app-header .container {
    flex-direction: column;
    gap: 1rem;
  }

  .main-nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
