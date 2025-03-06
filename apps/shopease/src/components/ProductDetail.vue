<script setup>
import { ref, computed, watch } from 'vue';
import store from '@/store';
import Button from '@/components/ui/Button.vue';
import IconButton from '@/components/ui/IconButton.vue';

const product = computed(() => store.currentProduct());
const quantity = ref(1);
const selectedImageIndex = ref(0);

const formattedPrice = computed(() => {
  if (!product.value) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(product.value.price);
});

const formattedDiscountedPrice = computed(() => {
  if (!product.value) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(product.value.discountedPrice);
});

const updateQuantity = (delta) => {
  const newQuantity = quantity.value + delta;
  if (newQuantity >= 1 && newQuantity <= (product.value?.stock || 10)) {
    quantity.value = newQuantity;
  }
};

const addToCart = () => {
  if (product.value) {
    store.addToCart(product.value.id, quantity.value);
    closeDetail();
  }
};

const buyNow = () => {
  if (product.value) {
    store.addToCart(product.value.id, quantity.value);
    store.startCheckout();
  }
};

const closeDetail = () => {
  store.closeProductDetail();
};

const selectImage = (index) => {
  selectedImageIndex.value = index;
};

// Reset selected image and quantity when product changes
watch(product, () => {
  selectedImageIndex.value = 0;
  quantity.value = 1;
});
</script>

<template>
  <div class="product-detail-overlay" v-if="product">
    <div class="product-detail-container">
      <button 
        class="close-button" 
        @click="closeDetail"
        v-voix="'close-product-detail'"
        hint="Close the product details and return to shopping"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div class="product-detail-content">
        <div class="product-images">
          <div class="main-image">
            <img :src="product.images[selectedImageIndex]" :alt="product.name" />
          </div>
          <div class="image-thumbnails">
            <button 
              v-for="(image, index) in product.images" 
              :key="index" 
              class="thumbnail" 
              :class="{ active: index === selectedImageIndex }" 
              @click="selectImage(index)"
              v-voix="`product-image-thumbnail-${index+1}`"
              :hint="`Select product image ${index+1}`"
            >
              <img :src="image" :alt="`${product.name} thumbnail ${index + 1}`" />
            </button>
          </div>
        </div>
        
        <div class="product-info">
          <div class="product-badges">
            <div class="badge new-badge" v-if="product.isNewArrival">New Arrival</div>
            <div class="badge bestseller-badge" v-if="product.isBestSeller">Bestseller</div>
            <div class="badge exclusive-badge" v-if="product.hasExclusiveOffer">Exclusive</div>
          </div>
          
          <h1 class="product-name">{{ product.name }}</h1>
          <div class="product-brand">By {{ product.brand }}</div>
          
          <div class="product-rating">
            <div class="stars">
              <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" width="18" height="18" 
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                stroke-linecap="round" stroke-linejoin="round" 
                :class="{ 'filled': i <= Math.round(product.rating) }">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
            <span class="rating-count">({{ product.reviews.count }} reviews)</span>
          </div>
          
          <div class="product-price">
            <span class="original-price" :class="{ 'has-discount': product.discountPercentage > 0 }">
              {{ formattedPrice }}
            </span>
            <span class="discounted-price" v-if="product.discountPercentage > 0">
              {{ formattedDiscountedPrice }}
              <span class="discount-tag">{{ product.discountPercentage }}% OFF</span>
            </span>
          </div>
          
          <div class="product-description">
            <p>{{ product.description }}</p>
          </div>
          
          <div class="product-details">
            <h3>Specifications</h3>
            <div class="specifications">
              <div class="spec-item" v-for="(spec, index) in product.specifications" :key="index">
                <span class="spec-name">{{ spec.name }}:</span>
                <span class="spec-value">{{ spec.value }}</span>
              </div>
            </div>
          </div>
          
          <div class="product-status">
            <div class="stock" :class="{ 'low-stock': product.stock < 10 }">
              {{ product.stock > 0 ? (product.stock < 10 ? `Only ${product.stock} left!` : 'In Stock') : 'Out of Stock' }}
            </div>
            <div class="shipping" v-if="product.stock > 0">Free Shipping</div>
          </div>
          
          <div class="product-actions">
            <div class="quantity-selector">
              <IconButton 
                icon='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
                label="Decrease quantity"
                color="dark"
                @click="updateQuantity(-1)"
                :disabled="quantity <= 1"
                id="decrease-quantity"
                hint="Decrease product quantity"
              />
              <span 
                class="quantity-value"
                v-voix="'product-quantity'"
                :hint="`Current quantity: ${quantity}`"
              >{{ quantity }}</span>
              <IconButton 
                icon='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
                label="Increase quantity"
                color="dark"
                @click="updateQuantity(1)"
                :disabled="quantity >= product.stock"
                id="increase-quantity"
                hint="Increase product quantity"
              />
            </div>
            
            <div class="button-group">
              <Button 
                label="Add to Cart"
                variant="outline"
                icon='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>'
                @click="addToCart"
                :disabled="product.stock <= 0"
                id="add-to-cart-button"
                hint="Add this product to your shopping cart"
              />
              <Button 
                label="Buy Now"
                variant="primary"
                @click="buyNow"
                :disabled="product.stock <= 0"
                id="buy-now-button"
                hint="Buy this product now and proceed to checkout"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="product-reviews" v-if="product.reviews.items.length > 0">
        <h3>Customer Reviews</h3>
        <div class="reviews-container">
          <div v-for="review in product.reviews.items" :key="review.id" class="review-item">
            <div class="review-header">
              <div class="reviewer-name">{{ review.author }}</div>
              <div class="review-date">{{ new Date(review.date).toLocaleDateString() }}</div>
            </div>
            <div class="review-rating">
              <div class="stars">
                <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" width="14" height="14" 
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                  stroke-linecap="round" stroke-linejoin="round" 
                  :class="{ 'filled': i <= review.rating }">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
            </div>
            <div class="review-text">{{ review.text }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

.product-detail-container {
  background-color: white;
  border-radius: 16px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.4s ease-out;
  padding: 24px;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text, #2b2b2b);
  z-index: 2;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.2);
}

.product-detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

/* Product Images Section */
.product-images {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-image {
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1;
  background-color: var(--color-background-soft, #f5f5f5);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-thumbnails {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.thumbnail {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  padding: 0;
  background: none;
  transition: all 0.2s ease;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail.active {
  border-color: var(--color-primary, #4361ee);
  transform: translateY(-2px);
}

/* Product Info Section */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
}

.new-badge {
  background-color: var(--color-secondary, #3f37c9);
  color: white;
}

.bestseller-badge {
  background-color: var(--color-primary, #4361ee);
  color: white;
}

.exclusive-badge {
  background-color: var(--color-accent, #f72585);
  color: white;
}

.product-name {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text, #2b2b2b);
}

.product-brand {
  font-size: 1rem;
  color: var(--color-text-light, #646464);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
  color: #d4d4d4;
}

.stars .filled {
  color: #ffc107;
  fill: #ffc107;
}

.rating-value {
  font-weight: 600;
  color: var(--color-text, #2b2b2b);
}

.rating-count {
  color: var(--color-text-light, #646464);
}

.product-price {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.original-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text, #2b2b2b);
}

.original-price.has-discount {
  font-size: 1.1rem;
  text-decoration: line-through;
  color: var(--color-text-light, #646464);
  font-weight: 400;
}

.discounted-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent, #f72585);
  display: flex;
  align-items: center;
  gap: 10px;
}

.discount-tag {
  font-size: 0.875rem;
  background-color: var(--color-accent, #f72585);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
}

.product-description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text, #2b2b2b);
  margin-top: 8px;
}

.product-details h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--color-text, #2b2b2b);
}

.specifications {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 24px;
}

.spec-item {
  display: flex;
}

.spec-name {
  font-weight: 600;
  color: var(--color-text-light, #646464);
  margin-right: 8px;
  flex-shrink: 0;
}

.spec-value {
  color: var(--color-text, #2b2b2b);
}

.product-status {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.stock {
  color: #22c55e;
  font-weight: 600;
}

.stock.low-stock {
  color: #f59e0b;
}

.shipping {
  color: var(--color-text-light, #646464);
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  background-color: var(--color-background-soft, #f5f5f5);
  border-radius: 8px;
  padding: 4px 8px;
}

.quantity-value {
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.button-group {
  display: flex;
  gap: 12px;
}

.button-group > * {
  flex: 1;
}

/* Product Reviews Section */
.product-reviews {
  margin-top: 40px;
  border-top: 1px solid var(--color-border, #e2e8f0);
  padding-top: 24px;
}

.product-reviews h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 20px;
}

.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-item {
  padding: 16px;
  background-color: var(--color-background-soft, #f5f5f5);
  border-radius: 8px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.reviewer-name {
  font-weight: 600;
}

.review-date {
  color: var(--color-text-light, #646464);
  font-size: 0.875rem;
}

.review-rating {
  margin-bottom: 8px;
}

.review-text {
  line-height: 1.5;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Responsive styles */
@media (max-width: 768px) {
  .product-detail-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .specifications {
    grid-template-columns: 1fr;
  }
  
  .product-detail-container {
    padding: 16px;
  }
  
  .button-group {
    flex-direction: column;
  }
}
</style>