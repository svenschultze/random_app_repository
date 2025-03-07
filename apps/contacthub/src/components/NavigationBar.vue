<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav class="navigation-bar">
    <RouterLink to="/" class="logo" v-voix="'nav-home'">
      ContactHub
    </RouterLink>
    
    <div class="nav-links">
      <RouterLink to="/" v-voix="'nav-contacts'">Contacts</RouterLink>
      <RouterLink to="/about" v-voix="'nav-about'">About</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navigation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--color-primary);
}

.nav-links a.router-link-active {
  color: var(--color-primary);
  font-weight: 500;
}

@media (max-width: 640px) {
  .navigation-bar {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .nav-links {
    width: 100%;
    justify-content: center;
  }
}
</style>