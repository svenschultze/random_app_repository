<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <RouterLink to="/" class="logo-link" v-voix="'app-logo'">
          <span class="logo-text">PollPal</span>
        </RouterLink>
        
        <nav class="main-nav">
          <RouterLink to="/" v-voix="'nav-home'">Home</RouterLink>
          <RouterLink to="/create" v-voix="'nav-create-poll'">Create Poll</RouterLink>
        </nav>
      </div>
    </div>
  </header>

  <RouterView />
  
  <footer class="app-footer">
    <div class="container">
      <p class="footer-text" v-voix="'footer-text'">
        &copy; 2025 PollPal - A demo polling application
      </p>
    </div>
  </footer>
</template>

<style>
/* Global styles */
body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #333;
  background-color: #f8f9fa;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

a {
  text-decoration: none;
  color: #0084ff;
}

/* Header styles */
.app-header {
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-link {
  color: #0084ff;
  font-size: 1.8rem;
  font-weight: 700;
  text-decoration: none;
}

.logo-text {
  background: linear-gradient(135deg, #0084ff, #0066cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.main-nav {
  display: flex;
  gap: 20px;
}

.main-nav a {
  color: #555;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.main-nav a:hover {
  color: #0084ff;
  background-color: rgba(0, 132, 255, 0.1);
}

.main-nav a.router-link-active {
  color: #0084ff;
  background-color: rgba(0, 132, 255, 0.1);
}

/* Footer styles */
.app-footer {
  background-color: #ffffff;
  border-top: 1px solid #eaeaea;
  padding: 20px 0;
  margin-top: 40px;
  text-align: center;
}

.footer-text {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
}

/* Responsive styles */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .main-nav {
    width: 100%;
    justify-content: center;
  }
}
</style>
