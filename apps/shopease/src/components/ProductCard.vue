<script setup>
import { computed } from 'vue';
import store from '@/store';
import IconButton from '@/components/ui/IconButton.vue';

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
});

const idPrefix = computed(() => `product-${props.product.id}`);

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(props.product.price);
});

const formattedDiscountedPrice = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(props.product.discountedPrice);
});

const handleViewDetails = () => {
  store.viewProductDetail(props.product.id);
};

const handleAddToCart = () => {
  store.addToCart(props.product.id, 1);
};
</script>

<template>
  <div 
    class="product-card" 
    :class="{ 'product-card-compact': compact }"
    @click="handleViewDetails"
    v-voix="`${idPrefix}-card`"
    :hint="`Product card for ${product.name}. Click to view details`"
  >
    <div class="product-badges" v-if="!compact">
      <div class="badge new-badge" v-if="product.isNewArrival">New</div>
      <div class="badge sale-badge" v-if="product.discountPercentage > 0">
        {{ product.discountPercentage }}% OFF
      </div>
    </div>
    
    <div class="product-image">
      <img :src="product.images[0]" :alt="product.name" loading="lazy" />
    </div>
    
    <div class="product-info">
      <div class="product-category" v-if="!compact">{{ product.category }}</div>
      <h3 class="product-name">{{ product.name }}</h3>
      
      <div class="product-rating" v-if="!compact">
        <div class="stars">
          <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
            stroke-linecap="round" stroke-linejoin="round" 
            :class="{ 'filled': i <= Math.round(product.rating) }">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <span class="rating-count">({{ product.reviews.count }})</span>
      </div>
      
      <div class="product-price">
        <span class="original-price" :class="{ 'has-discount': product.discountPercentage > 0 }">
          {{ formattedPrice }}
        </span>
        <span class="discounted-price" v-if="product.discountPercentage > 0">
          {{ formattedDiscountedPrice }}
        </span>
      </div>
    </div>
    
    <div class="product-actions" v-if="!compact">
      <IconButton 
        icon='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>'
        label="Add to Cart"
        color="primary"
        @click.stop="handleAddToCart"
        :id="`${idPrefix}-add-to-cart`"
        hint="Add this product to your shopping cart"
      />
    </div>
  </div>
</template>

<style scoped>
.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;
  height: 100%;
}

.product-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.new-badge {
  background-color: var(--color-secondary, #3f37c9);
  color: white;
}

.sale-badge {
  background-color: var(--color-accent, #f72585);
  color: white;
}

.product-image {
  aspect-ratio: 1;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.product-category {
  font-size: 0.8rem;
  color: var(--color-text-light, #646464);
  text-transform: uppercase;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text, #2b2b2b);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stars {
  display: flex;
  color: #d4d4d4;
}

.stars .filled {
  color: #ffc107;
  fill: #ffc107;
}

.rating-count {
  font-size: 0.8rem;
  color: var(--color-text-light, #646464);
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.original-price {
  font-weight: 600;
  color: var(--color-text, #2b2b2b);
}

.original-price.has-discount {
  text-decoration: line-through;
  color: var(--color-text-light, #646464);
  font-weight: 400;
}

.discounted-price {
  font-weight: 700;
  color: var(--color-accent, #f72585);
}

.product-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px 16px;
}

/* Compact mode styling */
.product-card-compact {
  flex-direction: row;
  padding: 8px;
  gap: 12px;
}

.product-card-compact .product-image {
  width: 70px;
  height: 70px;
  aspect-ratio: 1;
  border-radius: 8px;
  flex-shrink: 0;
}

.product-card-compact .product-info {
  padding: 0;
  gap: 4px;
}

.product-card-compact .product-name {
  font-size: 0.9rem;
  -webkit-line-clamp: 1;
}

.product-card-compact .product-price {
  margin-top: 0;
}
</style>