<script setup>
import { computed, ref, onMounted } from 'vue';
import store from '@/store';
import ProductCard from '@/components/ProductCard.vue';

// Initialize store if needed
onMounted(() => {
  if (store.state.products.length === 0) {
    store.initializeStore();
  }
});

// Products and filters
const allProducts = computed(() => store.filteredProducts());
const productsLoaded = computed(() => allProducts.value.length > 0);

// Filter states
const selectedCategory = ref(null);
const selectedRating = ref(0);
const priceRange = ref({ min: 0, max: 2000 });
const sortOption = ref('featured');

// Category options from store
const categories = computed(() => {
  const uniqueCategories = [...new Set(store.state.products.map(p => p.category))];
  return uniqueCategories.sort();
});

// Update filters
const updateCategory = (category) => {
  selectedCategory.value = category;
  store.applyFilter('category', category);
};

const updateRating = (rating) => {
  selectedRating.value = rating;
  store.applyFilter('rating', rating);
};

const updatePriceRange = () => {
  store.applyFilter('priceRange', priceRange.value);
};

const updateSort = (option) => {
  sortOption.value = option;
  store.applyFilter('sort', option);
};

const clearAllFilters = () => {
  selectedCategory.value = null;
  selectedRating.value = 0;
  priceRange.value = { min: 0, max: 2000 };
  sortOption.value = 'featured';
  store.clearFilters();
};
</script>

<template>
  <main class="products-view">
    <div class="page-header">
      <h1 class="page-title">All Products</h1>
      <p class="page-subtitle">Browse our extensive collection of quality products</p>
    </div>
    
    <div class="products-container">
      <aside class="filters-sidebar">
        <div class="filters-header">
          <h2 class="filters-title">Filters</h2>
          <button 
            class="clear-filters" 
            @click="clearAllFilters"
            v-voix="'clear-all-filters'"
            hint="Clear all product filters"
          >
            Clear All
          </button>
        </div>
        
        <!-- Category filter -->
        <div class="filter-group">
          <h3 class="filter-group-title">Categories</h3>
          <div class="filter-options">
            <label 
              v-for="category in categories" 
              :key="category" 
              class="filter-option"
              v-voix="`category-filter-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`"
              :hint="`Filter by ${category} category`"
            >
              <input 
                type="radio" 
                name="category" 
                :value="category" 
                :checked="selectedCategory === category"
                @change="updateCategory(category)" 
              />
              <span class="option-label">{{ category }}</span>
            </label>
            <label 
              class="filter-option"
              v-voix="'category-filter-all'"
              hint="Show all categories"
            >
              <input 
                type="radio" 
                name="category" 
                :value="null" 
                :checked="selectedCategory === null"
                @change="updateCategory(null)" 
              />
              <span class="option-label">All Categories</span>
            </label>
          </div>
        </div>
        
        <!-- Price range filter -->
        <div class="filter-group">
          <h3 class="filter-group-title">Price Range</h3>
          <div class="price-range">
            <div class="price-inputs">
              <div class="price-input">
                <label for="min-price">Min</label>
                <input 
                  id="min-price" 
                  type="number" 
                  v-model.number="priceRange.min" 
                  @change="updatePriceRange"
                  v-voix="'min-price-input'"
                  hint="Set minimum price filter"
                />
              </div>
              <div class="price-input">
                <label for="max-price">Max</label>
                <input 
                  id="max-price" 
                  type="number" 
                  v-model.number="priceRange.max" 
                  @change="updatePriceRange"
                  v-voix="'max-price-input'"
                  hint="Set maximum price filter"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Rating filter -->
        <div class="filter-group">
          <h3 class="filter-group-title">Rating</h3>
          <div class="rating-options">
            <button 
              v-for="rating in [4, 3, 2, 0]" 
              :key="rating" 
              class="rating-option" 
              :class="{ active: selectedRating === rating }"
              @click="updateRating(rating)"
              v-voix="`rating-filter-${rating || 'all'}`"
              :hint="`Filter by ${rating ? `${rating}+ stars` : 'all ratings'}`"
            >
              <template v-if="rating > 0">
                <div class="stars">
                  <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                    stroke-linecap="round" stroke-linejoin="round" 
                    :class="{ 'filled': i <= rating }">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <span>& Up</span>
              </template>
              <template v-else>
                <span>All Ratings</span>
              </template>
            </button>
          </div>
        </div>
      </aside>
      
      <div class="products-content">
        <div class="products-header">
          <div class="products-count">
            {{ allProducts.length }} {{ allProducts.length === 1 ? 'Product' : 'Products' }}
          </div>
          <div class="sort-options">
            <label for="sort-select">Sort By:</label>
            <select 
              id="sort-select" 
              v-model="sortOption" 
              @change="updateSort(sortOption)"
              v-voix="'sort-products'"
              hint="Sort products by different criteria"
            >
              <option value="featured">Featured</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        
        <div v-if="productsLoaded" class="products-grid">
          <div v-for="product in allProducts" :key="product.id" class="product-card-wrapper">
            <ProductCard :product="product" />
          </div>
        </div>
        
        <div v-else class="products-loading">
          <div class="loader"></div>
          <p>Loading products...</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.products-view {
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

.products-container {
  display: flex;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Filters sidebar */
.filters-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.filters-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text, #2b2b2b);
}

.clear-filters {
  background: none;
  border: none;
  color: var(--color-primary, #4361ee);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.clear-filters:hover {
  opacity: 0.8;
}

.filter-group {
  margin-bottom: 24px;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
  padding-bottom: 20px;
}

.filter-group-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 16px;
  color: var(--color-text, #2b2b2b);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.option-label {
  font-size: 0.9rem;
  color: var(--color-text, #2b2b2b);
}

/* Price range filter */
.price-range {
  margin-top: 12px;
}

.price-inputs {
  display: flex;
  gap: 12px;
}

.price-input {
  flex: 1;
}

.price-input label {
  display: block;
  font-size: 0.8rem;
  color: var(--color-text-light, #646464);
  margin-bottom: 4px;
}

.price-input input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid var(--color-border, #e2e8f0);
  font-size: 0.9rem;
}

/* Rating filter */
.rating-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--color-border, #e2e8f0);
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rating-option:hover {
  background-color: var(--color-background-soft, #f5f5f5);
}

.rating-option.active {
  background-color: rgba(67, 97, 238, 0.1);
  border-color: var(--color-primary, #4361ee);
  color: var(--color-primary, #4361ee);
}

.stars {
  display: flex;
  color: #d4d4d4;
}

.stars .filled {
  color: #ffc107;
  fill: #ffc107;
}

/* Products content */
.products-content {
  flex: 1;
}

.products-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.products-count {
  font-size: 0.9rem;
  color: var(--color-text-light, #646464);
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-options label {
  font-size: 0.9rem;
  color: var(--color-text-light, #646464);
}

.sort-options select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--color-border, #e2e8f0);
  background-color: white;
  font-size: 0.9rem;
  cursor: pointer;
}

/* Products grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.product-card-wrapper {
  transition: transform 0.3s ease;
}

.product-card-wrapper:hover {
  transform: translateY(-5px);
}

/* Loading state */
.products-loading {
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

/* Responsive styles */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .products-container {
    flex-direction: column;
  }
  
  .filters-sidebar {
    width: 100%;
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .products-view {
    padding: 30px 16px;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
}
</style>