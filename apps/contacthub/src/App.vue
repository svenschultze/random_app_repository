<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
import { useVoix } from 'vue-voix';
import NavigationBar from './components/NavigationBar.vue';

</script>

<template>
  <div class="app-container" v-voix="'app-container'" hint="ContactHub application for managing your contacts locally">
    <NavigationBar />
    <main class="main-content">
      <RouterView />
    </main>
    <footer class="footer">
      <p>ContactHub Demo - A client-side only contact management application</p>
    </footer>
  </div>
</template>

<style>
/* Global styles */
:root {
  --color-primary: #5c6bc0;
  --color-primary-dark: #4a59b0;
  --color-text: #333;
  --color-text-light: #666;
  --color-border: #ddd;
  --color-background: #f8f9fa;
  --color-error: #f44336;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  background-color: var(--color-background);
  color: var(--color-text);
  line-height: 1.6;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

.footer {
  text-align: center;
  padding: 1.5rem;
  margin-top: 2rem;
  background-color: #fff;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-light);
  font-size: 0.9rem;
}

button {
  cursor: pointer;
}

a {
  text-decoration: none;
  color: var(--color-primary);
}

/* Accessibility focus styles */
:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Utility classes */
.text-center {
  text-align: center;
}

.mb-1 {
  margin-bottom: 0.5rem;
}

.mb-2 {
  margin-bottom: 1rem;
}

.mb-3 {
  margin-bottom: 1.5rem;
}

.mt-1 {
  margin-top: 0.5rem;
}

.mt-2 {
  margin-top: 1rem;
}

.mt-3 {
  margin-top: 1.5rem;
}
</style>
