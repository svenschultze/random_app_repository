<script setup>
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import ProductDetail from '@/components/ProductDetail.vue';
import ShoppingCart from '@/components/ShoppingCart.vue';
import Checkout from '@/components/Checkout.vue';
import SearchResults from '@/components/SearchResults.vue';
</script>

<template>
  <div class="app-container">
    <AppHeader />
    
    <RouterView />
    
    <AppFooter />
    
    <!-- Overlay components -->
    <ProductDetail />
    <ShoppingCart />
    <Checkout />
    <SearchResults />
  </div>
</template>

<style>
/* Global CSS Variables */
:root {
  --color-primary: #4361ee;
  --color-primary-dark: #3a56d4;
  --color-secondary: #3f37c9;
  --color-accent: #f72585;
  
  --color-text: #2b2b2b;
  --color-text-light: #646464;
  
  --color-background: #ffffff;
  --color-background-soft: #f5f5f5;
  
  --color-border: #e2e8f0;
  
  --section-gap: 160px;
}

/* Base styles */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  font-weight: normal;
}

body {
  min-height: 100vh;
  color: var(--color-text);
  background: var(--color-background);
  line-height: 1.6;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Common utility classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
