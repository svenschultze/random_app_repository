<script setup>
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import store from '@/store';

// Initialize store if needed
onMounted(() => {
  if (store.state.categories.length === 0) {
    store.initializeStore();
  }
});

const categories = computed(() => store.state.categories);
const categoriesLoaded = computed(() => categories.value.length > 0);
</script>

<template>
  <main class="categories-view">
    <div class="page-header">
      <h1 class="page-title">Shop by Category</h1>
      <p class="page-subtitle">Find exactly what you're looking for by browsing our product categories</p>
    </div>
    
    <div v-if="categoriesLoaded" class="categories-grid">
      <RouterLink 
        v-for="category in categories" 
        :key="category.id" 
        :to="`/categories/${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`" 
        class="category-card"
        v-voix="`category-${category.id}`"
        :hint="`Browse ${category.name} category`"
      >
        <div class="category-image">
          <img :src="category.image" :alt="category.name" loading="lazy" />
        </div>
        <div class="category-overlay">
          <h3 class="category-name">{{ category.name }}</h3>
          <span class="category-link">Browse Products</span>
        </div>
      </RouterLink>
    </div>
    
    <div v-else class="categories-loading">
      <div class="loader"></div>
      <p>Loading categories...</p>
    </div>
  </main>
</template>

<style scoped>
.categories-view {
  padding: 40px 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--color-text, #2b2b2b);
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-light, #646464);
  margin: 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.category-card {
  position: relative;
  height: 240px;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.category-image {
  width: 100%;
  height: 100%;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.category-card:hover .category-image img {
  transform: scale(1.1);
}

.category-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  transition: all 0.3s ease;
}

.category-card:hover .category-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4));
  height: 100%;
  justify-content: center;
  align-items: center;
}

.category-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  transition: all 0.3s ease;
}

.category-card:hover .category-name {
  transform: translateY(-10px);
}

.category-link {
  font-size: 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  position: relative;
}

.category-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0;
  height: 2px;
  background-color: white;
  transition: width 0.3s ease;
}

.category-card:hover .category-link {
  opacity: 1;
  transform: translateY(0);
}

.category-card:hover .category-link::after {
  width: 100%;
}

.categories-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 16px;
  color: var(--color-text-light, #646464);
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--color-primary, #4361ee);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .page-title {
    font-size: 2rem;
  }
}

@media (max-width: 640px) {
  .categories-view {
    padding: 30px 16px;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .category-card {
    height: 180px;
  }
}
</style>