<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isEditor = computed(() => route.name === 'editor')
</script>

<template>
  <div class="app-container">
    <header>
      <div class="container header-content">
        <div class="logo-container">
          <img alt="Survey Architect logo" class="logo" src="@/assets/logo.svg" width="40" height="40" />
          <h1 v-voix="'app-title'">Survey Architect</h1>
        </div>

        <nav>
          <RouterLink to="/" v-voix="'nav-home'">Home</RouterLink>
          <RouterLink to="/editor" v-voix="'nav-editor'">Editor</RouterLink>
          <RouterLink to="/preview" v-voix="'nav-preview'">Preview</RouterLink>
          <RouterLink to="/about" v-voix="'nav-about'">About</RouterLink>
        </nav>
      </div>
    </header>

    <main :class="{ 'full-width': isEditor }">
      <RouterView />
    </main>
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.logo-container h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.025rem;
}

.logo {
  color: var(--accent-color);
}

nav {
  display: flex;
  gap: var(--spacing-xl);
}

nav a {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  padding: var(--spacing-xs) 0;
  position: relative;
  transition: color 0.2s;
}

nav a:hover {
  color: var(--accent-color);
}

nav a.router-link-active {
  color: var(--accent-color);
}

nav a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--accent-color);
  border-radius: var(--radius-full);
}

main {
  flex: 1;
  padding: var(--spacing-xl) 0;
  width: 100%;
}

main.full-width {
  padding: 0;
}

main:not(.full-width) {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
}

footer {
  text-align: center;
  padding: var(--spacing-lg) 0;
  background-color: var(--neutral-50);
  border-top: 1px solid var(--border-color);
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }
  
  nav {
    width: 100%;
    justify-content: space-between;
    gap: var(--spacing-sm);
  }
  
  nav a {
    padding: var(--spacing-xs) var(--spacing-xs);
  }
}
</style>
