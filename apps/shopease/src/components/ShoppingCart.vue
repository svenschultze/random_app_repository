<script setup>
import { computed } from 'vue';
import store from '@/store';
import Button from '@/components/ui/Button.vue';
import IconButton from '@/components/ui/IconButton.vue';

const cartItems = computed(() => store.state.cart);
const cartTotal = computed(() => store.cartTotal());
const cartItemCount = computed(() => store.cartItemCount());
const isCartEmpty = computed(() => cartItemCount.value === 0);

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

const updateQuantity = (productId, delta) => {
  const item = cartItems.value.find(item => item.productId === productId);
  if (item) {
    const newQuantity = item.quantity + delta;
    store.updateCartItemQuantity(productId, newQuantity);
  }
};

const removeFromCart = (productId) => {
  store.removeFromCart(productId);
};

const closeCart = () => {
  store.toggleCart();
};

const proceedToCheckout = () => {
  store.startCheckout();
};

</script>

<template>
  <div class="cart-overlay" v-if="store.state.ui.showCart">
    <div class="cart-panel">
      <div class="cart-header">
        <h2 class="cart-title">Your Shopping Cart</h2>
        <IconButton 
          icon='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
          label="Close cart"
          color="dark"
          @click="closeCart"
          id="close-cart"
          hint="Close the shopping cart"
        />
      </div>
      
      <div class="cart-content">
        <div v-if="isCartEmpty" class="empty-cart">
          <div class="empty-cart-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <p class="empty-cart-message">Your cart is empty</p>
          <p class="empty-cart-subtext">Find something amazing to add to your cart!</p>
          <Button 
            label="Continue Shopping" 
            variant="primary" 
            @click="closeCart"
            id="continue-shopping"
            hint="Continue shopping"
          />
        </div>
        
        <div v-else class="cart-items">
          <div v-for="item in cartItems" :key="item.productId" class="cart-item">
            <div class="cart-item-image">
              <img :src="item.product.images[0]" :alt="item.product.name" />
            </div>
            
            <div class="cart-item-content">
              <div class="cart-item-details">
                <h3 class="cart-item-name">{{ item.product.name }}</h3>
                <div class="cart-item-price">
                  <span v-if="item.product.discountPercentage > 0" class="original-price">
                    {{ formatPrice(item.product.price) }}
                  </span>
                  <span v-if="item.product.discountPercentage > 0" class="discounted-price">
                    {{ formatPrice(item.product.discountedPrice) }}
                  </span>
                  <span v-else>
                    {{ formatPrice(item.product.price) }}
                  </span>
                </div>
              </div>
              
              <div class="cart-item-actions">
                <div class="quantity-controls">
                  <IconButton 
                    icon='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
                    label="Decrease quantity"
                    color="dark"
                    size="sm"
                    @click="updateQuantity(item.productId, -1)"
                    :disabled="item.quantity <= 1"
                    :id="`decrease-quantity-${item.productId}`"
                    hint="Decrease product quantity"
                  />
                  <span class="quantity">{{ item.quantity }}</span>
                  <IconButton 
                    icon='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
                    label="Increase quantity"
                    color="dark"
                    size="sm"
                    @click="updateQuantity(item.productId, 1)"
                    :disabled="item.quantity >= item.product.stock"
                    :id="`increase-quantity-${item.productId}`"
                    hint="Increase product quantity"
                  />
                </div>
                
                <IconButton 
                  icon='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
                  label="Remove from cart"
                  color="dark"
                  size="sm"
                  @click="removeFromCart(item.productId)"
                  :id="`remove-item-${item.productId}`"
                  hint="Remove this product from your cart"
                />
              </div>
              
              <div class="cart-item-subtotal">
                <span>Subtotal:</span>
                <span class="subtotal-value">
                  {{ formatPrice(item.product.discountPercentage > 0 
                    ? item.product.discountedPrice * item.quantity 
                    : item.product.price * item.quantity) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="cart-footer" v-if="!isCartEmpty">
        <div class="cart-summary">
          <div class="cart-summary-row">
            <span class="summary-label">Items ({{ cartItemCount }}):</span>
            <span class="summary-value">{{ cartTotal }}</span>
          </div>
          <div class="cart-summary-row">
            <span class="summary-label">Shipping:</span>
            <span class="summary-value free">Free</span>
          </div>
          <div class="cart-summary-row total">
            <span class="summary-label">Total:</span>
            <span class="summary-value">{{ cartTotal }}</span>
          </div>
        </div>
        
        <div class="cart-actions">
          <Button 
            label="Continue Shopping" 
            variant="outline" 
            @click="closeCart"
            id="continue-shopping-with-items"
            hint="Continue shopping"
          />
          <Button 
            label="Checkout" 
            variant="primary" 
            icon='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M12 5l7 7-7 7"/></svg>'
            iconPosition="right"
            @click="proceedToCheckout"
            id="proceed-to-checkout"
            hint="Proceed to checkout and complete your purchase"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 480px;
  background-color: white;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.3s ease-out;
}

.cart-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
}

.cart-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text, #2b2b2b);
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  padding: 40px 20px;
}

.empty-cart-icon {
  color: var(--color-text-light, #646464);
  margin-bottom: 20px;
}

.empty-cart-message {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--color-text, #2b2b2b);
}

.empty-cart-subtext {
  color: var(--color-text-light, #646464);
  margin: 0 0 24px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-item-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text, #2b2b2b);
}

.cart-item-price {
  display: flex;
  align-items: center;
  gap: 8px;
}

.original-price {
  font-size: 0.9rem;
  text-decoration: line-through;
  color: var(--color-text-light, #646464);
}

.discounted-price {
  font-weight: 600;
  color: var(--color-accent, #f72585);
}

.cart-item-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--color-background-soft, #f5f5f5);
  border-radius: 6px;
  padding: 4px 8px;
}

.quantity {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.cart-item-subtotal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
}

.subtotal-value {
  font-weight: 600;
}

.cart-footer {
  border-top: 1px solid var(--color-border, #e2e8f0);
  padding: 20px;
}

.cart-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.cart-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  color: var(--color-text-light, #646464);
}

.summary-value {
  font-weight: 600;
}

.summary-value.free {
  color: #22c55e;
}

.cart-summary-row.total {
  padding-top: 12px;
  border-top: 1px dashed var(--color-border, #e2e8f0);
  font-size: 1.1rem;
}

.cart-summary-row.total .summary-label,
.cart-summary-row.total .summary-value {
  font-weight: 700;
  color: var(--color-text, #2b2b2b);
}

.cart-actions {
  display: flex;
  gap: 12px;
}

.cart-actions > * {
  flex: 1;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@media (max-width: 480px) {
  .cart-overlay {
    max-width: 100%;
  }
}
</style>