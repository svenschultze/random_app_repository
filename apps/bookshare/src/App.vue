<script setup>
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/store'

const bookStore = useBookStore()
const { currentUser } = storeToRefs(bookStore)
const route = useRoute()

// Mobile menu toggle
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Check if route is reader to apply different layout
const isReaderView = computed(() => {
  return route.name === 'reader'
})
</script>

<template>
  <div class="app-container" :class="{ 'reader-mode': isReaderView }">
    <header :class="{ 'reader-header': isReaderView }">
      <div class="header-content">
        <div class="logo-section">
          <RouterLink to="/" class="logo" v-voix="'app-logo'">
            <span class="logo-text">BookShare</span>
          </RouterLink>
        </div>

        <!-- Desktop navigation -->
        <nav class="desktop-nav">
          <RouterLink to="/" v-voix="'nav-home'">Home</RouterLink>
          <RouterLink to="/about" v-voix="'nav-about'">About</RouterLink>
          <a href="#" class="user-profile" v-voix="'user-profile'">
            <img :src="currentUser.avatar" alt="User avatar" class="avatar">
            <span class="username">{{ currentUser.name }}</span>
          </a>
        </nav>

        <!-- Mobile menu button -->
        <button @click="toggleMobileMenu" class="mobile-menu-button" v-voix="'mobile-menu-toggle'">
          <span class="menu-icon"></span>
        </button>
      </div>

      <!-- Mobile navigation -->
      <nav class="mobile-nav" :class="{ 'open': mobileMenuOpen }">
        <RouterLink @click="mobileMenuOpen = false" to="/" v-voix="'mobile-nav-home'">Home</RouterLink>
        <RouterLink @click="mobileMenuOpen = false" to="/about" v-voix="'mobile-nav-about'">About</RouterLink>
        <a href="#" class="user-profile-mobile" v-voix="'mobile-user-profile'">
          <img :src="currentUser.avatar" alt="User avatar" class="avatar">
          <span class="username">{{ currentUser.name }}</span>
        </a>
      </nav>
    </header>

    <main :class="{ 'reader-main': isReaderView }">
      <RouterView />
    </main>

    <footer v-if="!isReaderView">
      <div class="footer-content">
        <div class="footer-section">
          <h3>BookShare</h3>
          <p>A collaborative reading platform for sharing annotations and insights.</p>
        </div>
        <div class="footer-section">
          <h3>Features</h3>
          <ul>
            <li>Interactive book reading</li>
            <li>Text highlighting</li>
            <li>Collaborative annotations</li>
            <li>Reading progress tracking</li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Demo Info</h3>
          <p>This is a front-end demo with local data. No actual user accounts or backend functionality is implemented.</p>
        </div>
        <div class="footer-section">
          <h3>Connect</h3>
          <div class="social-links">
            <a href="#" class="social-link">Twitter</a>
            <a href="#" class="social-link">GitHub</a>
            <a href="#" class="social-link">Email</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 BookShare Demo | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #4b6cb7;
  --primary-dark: #2c3e50;
  --secondary-color: #6a82fb;
  --accent-color: #fc5c7d;
  --text-color: #2d3748;
  --text-light: #6b7280;
  --bg-color: #f8f9fa;
  --card-bg: #ffffff;
  --border-color: #e5e7eb;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --font-main: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--font-main);
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
}

* {
  box-sizing: border-box;
}
</style>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header styles */
header {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-md);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reader-header {
  background: #fff;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.reader-header .logo-text {
  color: var(--primary-color);
}

.reader-header .desktop-nav a {
  color: var(--text-color);
}

.reader-header .desktop-nav a:hover,
.reader-header .desktop-nav a.router-link-active {
  color: var(--primary-color);
  background-color: rgba(75, 108, 183, 0.08);
}

.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.desktop-nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.desktop-nav a:hover,
.desktop-nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.15);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.35rem 1rem 0.35rem 0.35rem;
  border-radius: 99px;
}

.reader-header .user-profile {
  background-color: rgba(75, 108, 183, 0.1);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

/* Mobile menu */
.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  width: 40px;
  height: 40px;
  position: relative;
}

.menu-icon {
  display: block;
  width: 24px;
  height: 2px;
  background-color: currentColor;
  position: relative;
  transition: all 0.3s ease;
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: currentColor;
  transition: all 0.3s ease;
}

.menu-icon::before {
  top: -8px;
}

.menu-icon::after {
  bottom: -8px;
}

.mobile-nav {
  display: none;
  flex-direction: column;
  padding: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.mobile-nav.open {
  padding: 1rem 2rem;
  max-height: 300px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.reader-header .mobile-nav.open {
  border-top: 1px solid var(--border-color);
}

.mobile-nav a {
  color: white;
  text-decoration: none;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.reader-header .mobile-nav a {
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
}

.user-profile-mobile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding: 0.75rem 0;
}

/* Main content */
main {
  flex-grow: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.reader-main {
  max-width: none;
  padding: 0;
}

/* Footer */
footer {
  background-color: var(--primary-dark);
  color: white;
  padding: 3rem 2rem 1rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: var(--accent-color);
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.social-link {
  color: white;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.social-link:hover {
  opacity: 1;
}

.footer-bottom {
  max-width: 1400px;
  margin: 2rem auto 0;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.8;
}

.footer-bottom a {
  color: white;
  text-decoration: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
  }

  .desktop-nav {
    display: none;
  }

  .mobile-menu-button {
    display: block;
  }

  .mobile-nav {
    display: flex;
  }

  main {
    padding: 1.5rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-section {
    text-align: center;
  }

  .footer-section h3::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .social-links {
    justify-content: center;
  }
}

@media (min-width: 769px) {
  .mobile-nav {
    display: none;
  }
}
</style>
