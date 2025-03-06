<script setup>
import { RouterView } from 'vue-router';
import { onMounted, watch } from 'vue';
import store from './store';

// Initialize theme on mount
onMounted(() => {
  document.documentElement.setAttribute('data-theme', store.state.theme);
});

// Watch for theme changes
watch(() => store.state.theme, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme);
});
</script>

<template>
  <RouterView />
</template>

<style>
/* Global styles */
:root {
  /* Light theme variables */
  --color-text: #212121;
  --color-text-muted: #657786;
  --color-heading: #111111;
  --color-background: #ffffff;
  --color-background-soft: #f5f8fa;
  --color-background-mute: #ebeef0;
  --color-border: #e1e8ed;
  --color-border-soft: #ebeef0;
  --color-primary: #1da1f2;
}

:root[data-theme="dark"] {
  /* Dark theme variables */
  --color-text: #ffffff;
  --color-text-muted: #8899a6;
  --color-heading: #ffffff;
  --color-background: #15202b;
  --color-background-soft: #192734;
  --color-background-mute: #243447;
  --color-border: #38444d;
  --color-border-soft: #2f3336;
  --color-primary: #1da1f2;
}

/* Global base styles */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

body {
  min-height: 100vh;
  color: var(--color-text);
  background: var(--color-background);
  transition: color 0.2s, background-color 0.2s;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
