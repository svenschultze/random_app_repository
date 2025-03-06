<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

// Track current calculation mode
const currentMode = ref('standard')

// Change calculator mode
const changeMode = (mode) => {
  currentMode.value = mode
}
</script>

<template>
  <div class="calculator-app">
    <header>
      <div class="app-title" v-voix="'AppTitle'">CalcIntuitive</div>
      <nav>
        <RouterLink to="/" v-voix="'StandardModeLink'" hint="Basic calculation mode">Standard</RouterLink>
        <RouterLink to="/advanced" v-voix="'AdvancedModeLink'" hint="Access to symbolic math, matrices and more">Advanced</RouterLink>
        <RouterLink to="/graph" v-voix="'GraphModeLink'" hint="Visualize functions with interactive graphing">Graph</RouterLink>
        <RouterLink to="/about" v-voix="'AboutLink'">About</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.calculator-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--color-background-soft);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.5px;
}

nav {
  display: flex;
  gap: 1.5rem;
}

nav a {
  text-decoration: none;
  color: var(--color-text);
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

nav a:hover {
  background-color: var(--color-background-mute);
}

nav a.router-link-active {
  color: var(--color-primary);
  background-color: var(--color-background-mute);
  font-weight: bold;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
