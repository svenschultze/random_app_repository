<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import store from '@/store';
import ProductCard from '@/components/ProductCard.vue';

const searchQuery = computed(() => store.state.search.query);
const searchResults = computed(() => store.state.search.results);
const hasResults = computed(() => searchResults.value.length > 0);
const isSearching = computed(() => searchQuery.value.trim() !== '');
</script>

<template>
  <div class="search-results-overlay" v-if="isSearching">
    <div class="search-results-container">
      <div class="search-header">
        <h2 class="search-title">
          Search Results for "{{ searchQuery }}"
        </h2>
        <p class="results-count">
          {{ searchResults.length }} {{ searchResults.length === 1 ? 'result' : 'results' }} found
        </p>
      </div>
      
      <div v-if="hasResults" class="results-grid">
        <div v-for="product in searchResults" :key="product.id" class="result-item">
          <ProductCard :product="product" compact />
        </div>
      </div>
      
      <div v-else class="no-results">
        <div class="no-results-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <h3 class="no-results-title">No products found</h3>
        <p class="no-results-text">
          We couldn't find any products matching "{{ searchQuery }}".
          Try checking your spelling or using different keywords.
        </p>
      </div>
      
      <div class="search-footer">
        <RouterLink to="/products" class="browse-all-link" v-voix="'browse-all-products'" hint="Browse all products">
          Browse All Products
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-results-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 90;
  overflow-y: auto;
  animation: fadeIn 0.3s ease;
}

.search-results-container {
  max-width: 1200px;
  margin: 80px auto 40px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.search-header {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
}

.search-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--color-text, #2b2b2b);
}

.results-count {
  color: var(--color-text-light, #646464);
  margin: 0;
  font-size: 0.9rem;
}

.results-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  animation: slideUp 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.result-item:hover {
  transform: translateX(5px);
  background-color: var(--color-background-soft, #f5f5f5);
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
  color: var(--color-text-light, #646464);
  gap: 16px;
}

.no-results-icon {
  opacity: 0.3;
}

.no-results-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text, #2b2b2b);
}

.no-results-text {
  max-width: 400px;
  margin: 0;
  line-height: 1.5;
}

.search-footer {
  display: flex;
  justify-content: center;
  padding-top: 24px;
  border-top: 1px solid var(--color-border, #e2e8f0);
}

.browse-all-link {
  color: var(--color-primary, #4361ee);
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.browse-all-link:hover {
  background-color: rgba(67, 97, 238, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 768px) {
  .search-results-container {
    margin-top: 70px;
    padding: 0 16px;
  }
}
</style>