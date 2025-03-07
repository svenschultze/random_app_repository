<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, computed } from 'vue'

const isLoggedIn = ref(false)
const userType = ref('candidate') // 'candidate' or 'company'

const navLinks = computed(() => {
  if (!isLoggedIn.value) {
    return [
      { to: '/', label: 'Home', id: 'home-nav' },
      { to: '/about', label: 'About', id: 'about-nav' },
      { to: '/login', label: 'Login', id: 'login-nav' },
      { to: '/signup', label: 'Sign Up', id: 'signup-nav' }
    ]
  } else {
    return [
      { to: '/swipe', label: 'Swipe', id: 'swipe-nav' },
      { to: '/matches', label: 'Matches', id: 'matches-nav' },
      { to: '/profile', label: 'Profile', id: 'profile-nav' }
    ]
  }
})
</script>

<template>
  <div class="app">
    <header>
      <div class="logo-container">
        <h1 v-voix="'app-title'">JobSwipe</h1>
      </div>

      <nav>
        <RouterLink 
          v-for="link in navLinks" 
          :key="link.to" 
          :to="link.to"
          v-voix="link.id"
          :hint="'Navigate to ' + link.label + ' page'"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <p>&copy; 2025 JobSwipe - Find your perfect match!</p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.logo-container h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  color: #ff5757;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  text-decoration: none;
  color: var(--color-text);
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover {
  background-color: rgba(235, 235, 235, 0.3);
}

nav a.router-link-active {
  font-weight: bold;
  color: #ff5757;
}

main {
  flex: 1;
  padding: 1rem;
}

footer {
  padding: 1rem;
  text-align: center;
  border-top: 1px solid var(--color-border);
  font-size: 0.9rem;
  color: #888;
}

@media (max-width: 768px) {
  header {
    flex-direction: column;
    gap: 1rem;
  }
  
  nav {
    width: 100%;
    justify-content: center;
  }
}
</style>
