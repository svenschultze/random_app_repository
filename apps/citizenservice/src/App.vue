<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { availableLanguages, setLanguage } from './i18n'

const route = useRoute()
const { t, locale } = useI18n()
const showOnboarding = ref(false)
const currentTheme = ref('light')

// Compute the document direction based on current language
const isRtl = computed(() => {
  const lang = availableLanguages.find(l => l.code === locale.value)
  return lang && lang.dir === 'rtl'
})

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', currentTheme.value)
}

const changeLanguage = (langCode) => {
  locale.value = langCode
  setLanguage(langCode)
  // No localStorage persistence
}

const toggleOnboarding = () => {
  showOnboarding.value = !showOnboarding.value
}

onMounted(() => {
  // Check if first visit to show onboarding
  const hasVisitedBefore = localStorage.getItem('hasVisitedBefore')
  if (!hasVisitedBefore && route.path === '/') {
    showOnboarding.value = true
    localStorage.setItem('hasVisitedBefore', 'true')
  }
  
  // Set theme from local storage or system preference
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    currentTheme.value = savedTheme
    document.documentElement.setAttribute('data-theme', savedTheme)
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    currentTheme.value = 'dark'
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})

// Save theme preference when changed
watch(() => currentTheme.value, (newTheme) => {
  localStorage.setItem('theme', newTheme)
})

// Reset onboarding visibility when route changes
watch(() => route.path, () => {
  showOnboarding.value = false
})
</script>

<template>
  <div :class="['app-container', { 'dark-theme': currentTheme === 'dark', 'rtl': isRtl }]">
    <header>
      <div class="logo-container">
        <RouterLink to="/">
          <img alt="Government Service Portal Logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
        </RouterLink>
      </div>

      <div class="title-container">
        <h1>{{ t('common.appName') }}</h1>
      </div>

      <div class="accessibility-controls">
        <button 
          v-voix="'change-theme'" 
          :hint="currentTheme === 'light' ? t('nav.theme.dark') : t('nav.theme.light')"
          class="theme-toggle" 
          @click="toggleTheme">
          {{ currentTheme === 'light' ? '🌙' : '☀️' }}
        </button>
        
        <div class="language-selector">
          <select 
            v-voix="'select-language'" 
            :hint="t('nav.language')"
            v-model="locale" 
            @change="changeLanguage(locale)">
            <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
              {{ lang.flag }} {{ lang.name }}
            </option>
          </select>
        </div>
      </div>

      <nav>
        <RouterLink v-voix="'home-link'" to="/">{{ t('nav.home') }}</RouterLink>
        <RouterLink v-voix="'services-link'" to="/services">{{ t('nav.services') }}</RouterLink>
        <RouterLink v-voix="'dashboard-link'" to="/dashboard">{{ t('nav.dashboard') }}</RouterLink>
        <RouterLink v-voix="'help-link'" to="/help">{{ t('nav.help') }}</RouterLink>
        <RouterLink v-voix="'about-link'" to="/about">{{ t('nav.about') }}</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <!-- Onboarding overlay -->
    <div v-if="showOnboarding" class="onboarding-overlay">
      <div class="onboarding-content">
        <h2>{{ t('home.title') }}</h2>
        <p>{{ t('home.welcomeMessage') }}</p>
        
        <div class="onboarding-steps">
          <div class="onboarding-step">
            <div class="step-number">1</div>
            <p>{{ t('services.title') }}</p>
          </div>
          <div class="onboarding-step">
            <div class="step-number">2</div>
            <p>{{ t('application.title', { service: '' }) }}</p>
          </div>
          <div class="onboarding-step">
            <div class="step-number">3</div>
            <p>{{ t('serviceDetail.applyNow') }}</p>
          </div>
          <div class="onboarding-step">
            <div class="step-number">4</div>
            <p>{{ t('dashboard.applications') }}</p>
          </div>
        </div>
        
        <button 
          v-voix="'close-onboarding'" 
          hint="Close onboarding"
          class="close-onboarding" 
          @click="toggleOnboarding">
          {{ t('common.close') }}
        </button>
      </div>
    </div>

    <footer>
      <div class="footer-links">
        <a v-voix="'privacy-link'" href="#privacy">{{ t('about.privacy') }}</a>
        <a v-voix="'terms-link'" href="#terms">{{ t('about.terms') }}</a>
        <a v-voix="'accessibility-link'" href="#accessibility">{{ t('about.accessibility') }}</a>
        <a v-voix="'contact-link'" href="#contact">{{ t('about.contact') }}</a>
      </div>
      <div class="copyright">
        © 2025 {{ t('common.appName') }}
      </div>
    </footer>
  </div>
</template>

<style>
:root {
  --primary-color: #1a5d98;
  --secondary-color: #4b9cd3;
  --accent-color: #f59e0b;
  --text-color: #333;
  --background-color: #f5f7fa;
  --card-background: #ffffff;
  --border-color: #e2e8f0;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition-speed: 0.3s;
}

[data-theme="dark"] {
  --primary-color: #3b82f6;
  --secondary-color: #60a5fa;
  --accent-color: #fbbf24;
  --text-color: #e5e7eb;
  --background-color: #1f2937;
  --card-background: #374151;
  --border-color: #4b5563;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color var(--transition-speed), color var(--transition-speed);
}

/* RTL support */
.rtl {
  direction: rtl;
  text-align: right;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: var(--card-background);
  padding: 1rem 2rem;
  box-shadow: var(--shadow);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  transition: background-color var(--transition-speed);
}

.logo-container {
  margin-right: 1rem;
}

.rtl .logo-container {
  margin-right: 0;
  margin-left: 1rem;
}

.title-container h1 {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.accessibility-controls {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rtl .accessibility-controls {
  margin-left: 0;
  margin-right: auto;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background-color var(--transition-speed);
}

.theme-toggle:hover {
  background-color: var(--border-color);
}

.language-selector select {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background-color: var(--card-background);
  color: var(--text-color);
}

nav {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

nav a {
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color var(--transition-speed), color var(--transition-speed);
}

nav a:hover {
  background-color: var(--primary-color);
  color: white;
}

nav a.router-link-active {
  color: white;
  background-color: var(--primary-color);
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

footer {
  background-color: var(--card-background);
  padding: 1rem 2rem;
  text-align: center;
  transition: background-color var(--transition-speed);
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: var(--text-color);
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: var(--primary-color);
}

.copyright {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.8;
}

/* Onboarding overlay */
.onboarding-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.onboarding-content {
  background-color: var(--card-background);
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  text-align: center;
  animation: slideIn 0.5s ease-out;
}

.onboarding-steps {
  margin: 2rem 0;
  text-align: left;
}

.rtl .onboarding-steps {
  text-align: right;
}

.onboarding-step {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.step-number {
  background-color: var(--primary-color);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
}

.rtl .step-number {
  margin-right: 0;
  margin-left: 1rem;
}

.close-onboarding {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.close-onboarding:hover {
  background-color: var(--secondary-color);
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  header {
    flex-direction: column;
    padding: 1rem;
  }
  
  .accessibility-controls {
    margin: 1rem 0;
    width: 100%;
    justify-content: center;
  }
  
  nav {
    flex-wrap: wrap;
  }
  
  main {
    padding: 1rem;
  }
}
</style>
