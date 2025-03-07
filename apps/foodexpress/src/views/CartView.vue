<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRestaurantStore } from '@/stores/foodStore'

const router = useRouter()
const { cart, updateCartItemQuantity, removeFromCart, getRestaurant } = useRestaurantStore()

// Debug cart contents when component mounts
onMounted(() => {
  console.log('Cart contents:', cart.items)
  console.log('Cart total:', cart.total)
})

// Get restaurant name for items
const getRestaurantName = (restaurantId) => {
  const restaurant = getRestaurant(restaurantId)
  return restaurant ? restaurant.name : 'Unknown Restaurant'
}

// Group cart items by restaurant
const cartItemsByRestaurant = computed(() => {
  const grouped = {}
  
  cart.items.forEach(item => {
    if (!grouped[item.restaurantId]) {
      grouped[item.restaurantId] = {
        restaurantName: getRestaurantName(item.restaurantId),
        items: []
      }
    }
    
    grouped[item.restaurantId].items.push(item)
  })
  
  return grouped
})

// Calculate subtotal, tax, and total
const subtotal = computed(() => cart.total)
const tax = computed(() => subtotal.value * 0.08) // 8% tax
const deliveryFee = computed(() => subtotal.value > 0 ? 2.99 : 0)
const total = computed(() => subtotal.value + tax.value + deliveryFee.value)

// Format price
const formatPrice = (price) => {
  return `$${price.toFixed(2)}`
}

// Calculate discounted price
const calculateDiscountedPrice = (price, discount) => {
  return price * (1 - discount / 100)
}

// Handle checkout
const proceedToCheckout = () => {
  if (cart.items.length > 0) {
    router.push({ name: 'checkout' })
  }
}
</script>

<template>
  <div class="cart-view">
    <h1>Your Cart</h1>
    
    <div v-if="cart.items.length === 0" class="empty-cart">
      <p>Your cart is empty.</p>
      <button 
        class="browse-btn" 
        @click="router.push({ name: 'home' })"
        v-voix="'BrowseRestaurantsButton'"
        hint="Go back to restaurant list"
      >
        Browse Restaurants
      </button>
    </div>
    
    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="(group, restaurantId) in cartItemsByRestaurant" :key="restaurantId" class="restaurant-group">
          <h2 class="restaurant-name">{{ group.restaurantName }}</h2>
          
          <div 
            v-for="item in group.items" 
            :key="item.itemId" 
            class="cart-item"
            v-voix="`CartItem_${item.itemId}`"
            :hint="`${item.name}, ${item.quantity} at ${formatPrice(calculateDiscountedPrice(item.price, item.discount))}`"
          >
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              
              <div class="item-price">
                <span v-if="item.discount > 0" class="original-price">{{ formatPrice(item.price) }}</span>
                <span class="current-price">{{ formatPrice(calculateDiscountedPrice(item.price, item.discount)) }}</span>
                <span v-if="item.discount > 0" class="discount-badge">{{ item.discount }}% OFF</span>
              </div>
            </div>
            
            <div class="item-quantity">
              <div class="quantity-controls">
                <button 
                  @click="updateCartItemQuantity(item.itemId, item.quantity - 1)" 
                  class="quantity-btn"
                  v-voix="`DecreaseQuantity_${item.itemId}`"
                  hint="Decrease quantity by one"
                >
                  -
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button 
                  @click="updateCartItemQuantity(item.itemId, item.quantity + 1)" 
                  class="quantity-btn"
                  v-voix="`IncreaseQuantity_${item.itemId}`"
                  hint="Increase quantity by one"
                >
                  +
                </button>
              </div>
            </div>
            
            <div class="item-total">
              {{ formatPrice(calculateDiscountedPrice(item.price, item.discount) * item.quantity) }}
            </div>
            
            <button 
              class="remove-btn" 
              @click="removeFromCart(item.itemId)"
              v-voix="`RemoveItem_${item.itemId}`"
              hint="Remove item from cart"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
      
      <div class="cart-summary">
        <h2>Order Summary</h2>
        
        <div class="summary-item">
          <span>Subtotal</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        
        <div class="summary-item">
          <span>Tax (8%)</span>
          <span>{{ formatPrice(tax) }}</span>
        </div>
        
        <div class="summary-item">
          <span>Delivery Fee</span>
          <span>{{ formatPrice(deliveryFee) }}</span>
        </div>
        
        <div class="summary-total">
          <span>Total</span>
          <span>{{ formatPrice(total) }}</span>
        </div>
        
        <button 
          class="checkout-btn" 
          @click="proceedToCheckout"
          v-voix="'CheckoutButton'"
          hint="Proceed to checkout to complete your order"
        >
          Proceed to Checkout
        </button>
        
        <button 
          class="continue-shopping-btn" 
          @click="router.push({ name: 'home' })"
          v-voix="'ContinueShoppingButton'"
          hint="Continue browsing restaurants"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cart-view h1 {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: var(--text-color);
}

.empty-cart {
  text-align: center;
  padding: 3rem;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-cart p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #666;
}

.browse-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.browse-btn:hover {
  background-color: #ff5252;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.cart-items {
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.restaurant-group {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.restaurant-group:last-child {
  border-bottom: none;
}

.restaurant-name {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  overflow: hidden;
}

.item-details h3 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.original-price {
  font-size: 0.85rem;
  text-decoration: line-through;
  color: #999;
}

.current-price {
  font-weight: bold;
  color: var(--primary-color);
}

.discount-badge {
  background-color: var(--primary-color);
  color: white;
  padding: 0.1rem 0.3rem;
  border-radius: 2px;
  font-size: 0.75rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.quantity-btn {
  background: none;
  border: none;
  width: 28px;
  height: 28px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.quantity {
  width: 30px;
  text-align: center;
  font-weight: 500;
}

.item-total {
  font-weight: bold;
  min-width: 70px;
  text-align: right;
}

.remove-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
}

.remove-btn:hover {
  color: var(--primary-color);
}

.cart-summary {
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.cart-summary h2 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #666;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin: 1.5rem 0;
  font-weight: bold;
  font-size: 1.2rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.checkout-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 1rem;
}

.checkout-btn:hover {
  background-color: #ff5252;
}

.continue-shopping-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.continue-shopping-btn:hover {
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    grid-template-columns: 60px 1fr;
    grid-template-areas:
      "image details"
      "image price"
      "quantity total"
      "remove remove";
    gap: 0.5rem;
    padding: 1rem 0;
  }
  
  .item-image {
    grid-area: image;
  }
  
  .item-details {
    grid-area: details;
  }
  
  .item-quantity {
    grid-area: quantity;
  }
  
  .item-total {
    grid-area: total;
    text-align: right;
  }
  
  .remove-btn {
    grid-area: remove;
    justify-self: end;
  }
  
  .item-image img {
    width: 60px;
    height: 60px;
  }
}
</style>