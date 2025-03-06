<script setup>
import { computed, ref } from 'vue';
import store from '@/store';
import ProductCard from '@/components/ProductCard.vue';

const featuredProducts = computed(() => {
  return store.state.products.filter(product => product.isFeatured).slice(0, 8);
});

const productsLoaded = computed(() => featuredProducts.value.length > 0);

// For responsive grid layout
const columns = ref(4);
const updateColumns = () => {
  if (window.innerWidth < 640) {
    columns.value = 1;
  } else if (window.innerWidth < 768) {
    columns.value = 2;
  } else if (window.innerWidth < 1024) {
    columns.value = 3;
  } else {
    columns.value = 4;
  }
};

// Split products into column groups for masonry layout
const columnProducts = computed(() => {
  const result = Array.from({ length: columns.value }, () => []);
  
  featuredProducts.value.forEach((product, index) => {
    const columnIndex = index % columns.value;
    result[columnIndex].push(product);
  });
  
  return result;
});
</script>

<template>
  <section class="featured-products" v-voix="'featured-products-section'" hint="Featured products section">
    <div class="section-header">
      <h2 class="section-title">Featured Products</h2>
      <p class="section-subtitle">Handpicked selections just for you</p>
    </div>
    
    <div v-if="productsLoaded" class="products-grid" :class="`columns-${columns}`">
      <div v-for="(column, columnIndex) in columnProducts" :key="`column-${columnIndex}`" class="product-column">
        <div v-for="product in column" :key="product.id" class="product-card-wrapper">
          <ProductCard :product="product" />
        </div>
      </div>
    </div>
    
    <div v-else class="products-loading">
      <div class="loader"></div>
      <p>Loading featured products...</p>
    </div>
  </section>
</template>

<style scoped>
.featured-products {
  padding: 40px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--color-text, #2b2b2b);
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-light, #646464);
  margin: 0;
}

.products-grid {
  display: flex;
  gap: 24px;
  margin: 0 24px;
}

.product-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
}

.product-card-wrapper {
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.product-card-wrapper:hover {
  transform: translateY(-5px);
}

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

@media (max-width: 1024px) {
  .section-title {
    font-size: 1.75rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 640px) {
  .featured-products {
    padding: 30px 0;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .products-grid {
    margin: 0 16px;
  }
}
</style>