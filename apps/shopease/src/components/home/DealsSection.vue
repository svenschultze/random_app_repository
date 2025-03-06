<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import store from '@/store';
import ProductCard from '@/components/ProductCard.vue';
import Button from '@/components/ui/Button.vue';

const deals = computed(() => store.state.deals.slice(0, 1));
const discountedProducts = computed(() => store.discountedProducts());
const dealsLoaded = computed(() => deals.value.length > 0 && discountedProducts.value.length > 0);

// For countdown timer
const deal = computed(() => deals.value[0]);
const timeLeft = ref({
  hours: 0,
  minutes: 0,
  seconds: 0
});

const updateCountdown = () => {
  if (!deal.value) return;
  
  const totalSeconds = deal.value.expiryHours * 60 * 60;
  const randomElapsedSeconds = Math.floor(Math.random() * (totalSeconds / 2));
  const remainingSeconds = totalSeconds - randomElapsedSeconds;
  
  timeLeft.value = {
    hours: Math.floor(remainingSeconds / 3600),
    minutes: Math.floor((remainingSeconds % 3600) / 60),
    seconds: remainingSeconds % 60
  };
};

// Update the countdown when the deal changes
const startCountdown = () => {
  updateCountdown();
  
  // Update every second in a real app
  // For demo purposes, we'll just set it once
};

// Call startCountdown when the component is mounted
startCountdown();
</script>

<template>
  <section class="deals-section" v-voix="'deals-section'" hint="Deals and promotions section">
    <div v-if="dealsLoaded">
      <div class="deal-banner">
        <div class="deal-content">
          <div class="deal-badge">{{ deal.title.split('-')[0].trim() }}</div>
          <h2 class="deal-title">{{ deal.title.split('-')[1].trim() }}</h2>
          <p class="deal-description">{{ deal.description }}</p>
          
          <div class="deal-countdown">
            <div class="countdown-item">
              <span class="countdown-value">{{ timeLeft.hours.toString().padStart(2, '0') }}</span>
              <span class="countdown-label">Hours</span>
            </div>
            <div class="countdown-divider">:</div>
            <div class="countdown-item">
              <span class="countdown-value">{{ timeLeft.minutes.toString().padStart(2, '0') }}</span>
              <span class="countdown-label">Minutes</span>
            </div>
            <div class="countdown-divider">:</div>
            <div class="countdown-item">
              <span class="countdown-value">{{ timeLeft.seconds.toString().padStart(2, '0') }}</span>
              <span class="countdown-label">Seconds</span>
            </div>
          </div>
          
          <RouterLink to="/deals">
            <Button 
              label="Shop All Deals" 
              variant="accent" 
              size="lg"
              id="shop-all-deals"
              hint="Browse all deals and promotions"
            />
          </RouterLink>
        </div>
      </div>
      
      <div class="discounted-products">
        <h3 class="products-title">Hot Deals</h3>
        <div class="products-grid">
          <div v-for="product in discountedProducts.slice(0, 4)" :key="product.id" class="product-item">
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="deals-loading">
      <div class="loader"></div>
      <p>Loading deals...</p>
    </div>
  </section>
</template>

<style scoped>
.deals-section {
  padding: 60px 24px;
}

.deal-banner {
  background: linear-gradient(135deg, var(--color-accent, #f72585) 0%, #7209b7 100%);
  border-radius: 16px;
  padding: 40px;
  color: white;
  margin-bottom: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
}

.deal-banner::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" opacity="0.1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>');
  background-size: 100px 100px;
  opacity: 0.1;
}

.deal-content {
  max-width: 600px;
  position: relative;
  z-index: 1;
}

.deal-badge {
  display: inline-block;
  background-color: white;
  color: var(--color-accent, #f72585);
  font-weight: 700;
  font-size: 0.875rem;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.deal-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 16px;
  line-height: 1.2;
}

.deal-description {
  font-size: 1.1rem;
  margin: 0 0 24px;
  opacity: 0.9;
}

.deal-countdown {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.countdown-value {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 1.5rem;
  font-weight: 700;
  min-width: 60px;
  text-align: center;
}

.countdown-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.countdown-divider {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: -12px;
}

.discounted-products {
  max-width: 1200px;
  margin: 0 auto;
}

.products-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 24px;
  color: var(--color-text, #2b2b2b);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

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

@media (max-width: 1024px) {
  .deal-title {
    font-size: 2rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .countdown-value {
    min-width: 50px;
    font-size: 1.25rem;
    padding: 10px 12px;
  }
}

@media (max-width: 768px) {
  .deal-banner {
    padding: 30px;
  }
}

@media (max-width: 640px) {
  .deals-section {
    padding: 40px 16px;
  }
  
  .deal-title {
    font-size: 1.5rem;
  }
  
  .deal-description {
    font-size: 1rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .countdown-value {
    min-width: 40px;
    font-size: 1rem;
    padding: 8px 10px;
  }
  
  .countdown-label {
    font-size: 0.7rem;
  }
}
</style>