<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useRestaurantStore } from './stores/foodStore'

const { cartItemCount, loadFromLocalStorage, generateRestaurants } = useRestaurantStore()

// Initialize data on app mount
onMounted(() => {
  // Load or generate restaurant data
  loadFromLocalStorage()
})
</script>

<template>
  <header>
    <div class="logo-container">
      <RouterLink to="/" v-voix="'HomeLink'" hint="Click to return to home page">
        <h1 class="logo">FoodExpress</h1>
      </RouterLink>
    </div>

    <nav>
      <RouterLink to="/" v-voix="'HomeNavLink'">Home</RouterLink>
      <RouterLink to="/about" v-voix="'AboutNavLink'">About</RouterLink>
    </nav>

    <div class="cart-button">
      <RouterLink to="/cart" class="cart-icon" v-voix="'CartButton'" hint="View your shopping cart">
        🛒 <span class="cart-count" v-if="cartItemCount > 0">{{ cartItemCount }}</span>
      </RouterLink>
    </div>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <p>&copy; {{ new Date().getFullYear() }} FoodExpress Demo</p>
  </footer>
</template>

<style>
:root {
  --primary-color: #ff6b6b;
  --secondary-color: #4ecdc4;
  --text-color: #333;
  --bg-color: #f9f9f9;
  --card-bg: #fff;
  --border-color: #e5e5e5;
  --success-color: #6bff6b;
  --warning-color: #ffb347;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--bg-color);
}

a {
  text-decoration: none;
  color: var(--primary-color);
}

button {
  cursor: pointer;
}
</style>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
  margin: 0;
}

nav {
  display: flex;
  gap: 1.5rem;
}

nav a {
  color: var(--text-color);
  font-weight: 500;
  position: relative;
}

nav a.router-link-active {
  color: var(--primary-color);
}

nav a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
}

.cart-icon {
  font-size: 1.5rem;
  position: relative;
  display: inline-block;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--primary-color);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  min-height: calc(100vh - 180px);
}

footer {
  text-align: center;
  padding: 1.5rem;
  background-color: #f1f1f1;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  header {
    flex-direction: column;
    padding: 1rem;
  }
  
  nav {
    margin: 1rem 0;
  }
  
  .cart-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}
</style>
