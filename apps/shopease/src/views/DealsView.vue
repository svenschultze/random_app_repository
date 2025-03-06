<script setup>
import { computed, onMounted } from 'vue';
import store from '@/store';
import ProductCard from '@/components/ProductCard.vue';

// Initialize store if needed
onMounted(() => {
  if (store.state.products.length === 0 || store.state.deals.length === 0) {
    store.initializeStore();
  }
});

const deals = computed(() => store.state.deals);
const discountedProducts = computed(() => store.discountedProducts());
const dealsLoaded = computed(() => deals.value.length > 0 && discountedProducts.value.length > 0);

// Format remaining time for each deal
const formatRemainingTime = (hours) => {
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}, ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
};
</script>

<template>
  <main class="deals-view">
    <div class="page-header">
      <h1 class="page-title">Deals & Promotions</h1>
      <p class="page-subtitle">Limited-time offers and exclusive discounts</p>
    </div>
    
    <div v-if="dealsLoaded" class="deals-container">
      <!-- Active Deals -->
      <section class="active-deals">
        <h2 class="section-title">Active Promotions</h2>
        
        <div class="deals-grid">
          <div 
            v-for="deal in deals" 
            :key="deal.id" 
            class="deal-card"
            v-voix="`deal-${deal.id}`"
            :hint="`Deal ${deal.id}: ${deal.title}`"
          >
            <div class="deal-badge">{{ deal.title.split('-')[0].trim() }}</div>
            <h3 class="deal-title">{{ deal.title.split('-')[1].trim() }}</h3>
            <p class="deal-description">{{ deal.description }}</p>
            <div class="deal-meta">
              <div class="time-remaining">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Ends in {{ formatRemainingTime(deal.expiryHours) }}
              </div>
              <div v-if="deal.appliesTo === 'category'" class="deal-applies-to">
                Applies to: {{ deal.categoryOrProducts }}
              </div>
              <div v-else class="deal-applies-to">
                Applies to specific products
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Discounted Products -->
      <section class="discounted-products">
        <h2 class="section-title">Products on Sale</h2>
        
        <div class="products-grid">
          <div v-for="product in discountedProducts" :key="product.id" class="product-card-wrapper">
            <ProductCard :product="product" />
          </div>
        </div>
      </section>
    </div>
    
    <div v-else class="deals-loading">
      <div class="loader"></div>
      <p>Loading deals and promotions...</p>
    </div>
  </main>
</template>

<style scoped>
.deals-view {
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

.deals-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 24px;
  color: var(--color-text, #2b2b2b);
  position: relative;
  padding-bottom: 12px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background-color: var(--color-primary, #4361ee);
  border-radius: 2px;
}

/* Active Deals */
.deals-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.deal-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.deal-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 6px;
  background: linear-gradient(to bottom, var(--color-accent, #f72585), var(--color-primary, #4361ee));
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.deal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.deal-badge {
  display: inline-block;
  background-color: var(--color-accent, #f72585);
  color: white;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.deal-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--color-text, #2b2b2b);
}

.deal-description {
  color: var(--color-text-light, #646464);
  margin: 0 0 20px;
  font-size: 0.9rem;
  line-height: 1.5;
}

.deal-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-remaining {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--color-accent, #f72585);
  font-weight: 600;
}

.deal-applies-to {
  font-size: 0.875rem;
  color: var(--color-text-light, #646464);
}

/* Products on Sale */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.product-card-wrapper {
  transition: transform 0.3s ease;
}

.product-card-wrapper:hover {
  transform: translateY(-5px);
}

/* Loading state */
.deals-loading {
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
  .deals-grid {
    grid-template-columns: 1fr;
  }
  
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .deals-view {
    padding: 30px 16px;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
}
</style>