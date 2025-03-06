<script setup>
import { onMounted } from 'vue';
import store from '@/store';
import HeroSection from '@/components/home/HeroSection.vue';
import FeaturedProducts from '@/components/home/FeaturedProducts.vue';
import CategoryShowcase from '@/components/home/CategoryShowcase.vue';
import DealsSection from '@/components/home/DealsSection.vue';

// Initialize store if needed
onMounted(() => {
  if (store.state.products.length === 0) {
    store.initializeStore();
  }
});
</script>

<template>
  <main class="home-view">
    <HeroSection />
    <FeaturedProducts />
    <CategoryShowcase />
    <DealsSection />
  </main>
</template>

<style>
.home-view {
  min-height: 100vh;
}
</style>
