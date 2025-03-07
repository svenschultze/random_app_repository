<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header>
      <div class="logo-container">
        <h1 class="app-title" v-voix="'app-title'">MediCheck</h1>
      </div>

      <nav>
        <RouterLink to="/" v-voix="'home-link'">Home</RouterLink>
        <RouterLink to="/symptom-checker" v-voix="'symptom-checker-link'">Symptom Checker</RouterLink>
        <RouterLink to="/profile" v-voix="'profile-link'">My Profile</RouterLink>
        <RouterLink to="/about" v-voix="'about-link'">About</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <p class="disclaimer">
        MediCheck is for informational purposes only and is not a substitute for professional medical advice, 
        diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.
      </p>
      <p class="copyright">© 2025 MediCheck</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #3498db;
  color: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.app-title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  transition: background-color 0.2s;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.3);
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

footer {
  background-color: #f5f7fa;
  padding: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: #666;
}

.disclaimer {
  max-width: 800px;
  margin: 0 auto 0.5rem;
}

.copyright {
  margin: 0;
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    align-items: center;
  }
  
  nav a {
    width: 100%;
    text-align: center;
  }
}
</style>
