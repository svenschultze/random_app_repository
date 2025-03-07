<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRestaurantStore } from '@/stores/foodStore'

const route = useRoute()
const router = useRouter()
const { getRestaurant, addToCart, generateRestaurants } = useRestaurantStore()
const restaurantId = route.params.id
const selectedItem = ref(null)
const itemQuantity = ref(1)
const showModal = ref(false)

// Store restaurant data
const restaurant = ref(null)

// Load restaurant data on mount
onMounted(() => {
  const result = getRestaurant(restaurantId)
  if (!result) {
    console.error(`Restaurant with ID ${restaurantId} not found`)
    // Generate new data and try again
    generateRestaurants()
    const retryResult = getRestaurant(restaurantId)
    
    if (retryResult) {
      restaurant.value = retryResult
    } else {
      console.error(`Restaurant still not found after data regeneration. Returning to home.`)
      router.push({ name: 'home' })
    }
  } else {
    restaurant.value = result
  }
})

const menuCategories = computed(() => {
  if (!restaurant.value) return []
  
  const categories = new Set()
  restaurant.value.menu.forEach(item => {
    categories.add(item.category)
  })
  
  return Array.from(categories)
})

// Get menu items for a specific category
const getMenuItemsByCategory = (category) => {
  if (!restaurant.value) return []
  return restaurant.value.menu.filter(item => item.category === category)
}

// Handle showing item details
const showItemDetails = (item) => {
  selectedItem.value = item
  itemQuantity.value = 1
  showModal.value = true
}

// Add to cart directly from list
const directAddToCart = (item, id, qty) => {
  console.log(`Adding ${qty} of ${item.name} to cart from restaurant ${id}`)
  addToCart(item, id, qty)
}

// Add to cart and close modal
const addItemToCart = () => {
  if (selectedItem.value) {
    console.log(`Adding ${itemQuantity.value} of ${selectedItem.value.name} to cart from modal`)
    addToCart(selectedItem.value, restaurantId, itemQuantity.value)
    showModal.value = false
  }
}

// Close modal
const closeModal = () => {
  showModal.value = false
}

// Format price
const formatPrice = (price) => {
  return `$${price.toFixed(2)}`
}

// Calculate discounted price
const calculateDiscountedPrice = (price, discount) => {
  return price * (1 - discount / 100)
}
</script>

<template>
  <div v-if="restaurant" class="restaurant-view">
    <div class="restaurant-header">
      <div class="restaurant-banner" :style="{ backgroundImage: `url(${restaurant.image})` }">
        <div class="banner-overlay">
          <button 
            class="back-btn" 
            @click="router.push({ name: 'home' })"
            v-voix="'BackToHomeButton'"
            hint="Return to restaurant list"
          >
            ← Back
          </button>
          
          <div class="restaurant-title">
            <h1>{{ restaurant.name }}</h1>
            <div class="restaurant-info">
              <span class="cuisine">{{ restaurant.cuisine }}</span>
              <span class="rating">⭐ {{ restaurant.rating.toFixed(1) }}</span>
            </div>
            <p class="description">{{ restaurant.description }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="menu-container">
      <h2 class="menu-title">Menu</h2>
      
      <div v-for="category in menuCategories" :key="category" class="menu-category">
        <h3 class="category-title">{{ category }}</h3>
        
        <div class="menu-items">
          <div 
            v-for="item in getMenuItemsByCategory(category)" 
            :key="item.id" 
            class="menu-item"
            @click="showItemDetails(item)"
            v-voix="`MenuItem_${item.id}`"
            :hint="`${item.name}, ${formatPrice(item.price)}. Click to view details and add to cart`"
          >
            <div class="item-image-container">
              <img :src="item.image" :alt="item.name" class="item-image" />
              <div v-if="item.discount > 0" class="discount-badge">{{ item.discount }}% OFF</div>
            </div>
            
            <div class="item-details">
              <div class="item-header">
                <h4 class="item-name">{{ item.name }}</h4>
                <div class="item-price">
                  <span v-if="item.discount > 0" class="original-price">{{ formatPrice(item.price) }}</span>
                  <span class="current-price">{{ formatPrice(calculateDiscountedPrice(item.price, item.discount)) }}</span>
                </div>
              </div>
              <p class="item-description">{{ item.description }}</p>
              <button 
                class="add-to-cart-btn"
                @click.stop="directAddToCart(item, restaurantId, 1)"
                v-voix="`AddToCart_${item.id}`"
                hint="Add this item to your cart"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Item Detail Modal -->
    <div v-if="showModal && selectedItem" class="modal">
      <div class="modal-content">
        <button 
          class="close-modal-btn" 
          @click="closeModal"
          v-voix="'CloseModalButton'"
          hint="Close this popup"
        >
          &times;
        </button>
        
        <div class="modal-item-details">
          <img :src="selectedItem.image" :alt="selectedItem.name" class="modal-item-image" />
          
          <div class="modal-item-info">
            <h3>{{ selectedItem.name }}</h3>
            
            <div class="modal-item-price">
              <span v-if="selectedItem.discount > 0" class="original-price">{{ formatPrice(selectedItem.price) }}</span>
              <span class="current-price">{{ formatPrice(calculateDiscountedPrice(selectedItem.price, selectedItem.discount)) }}</span>
              <span v-if="selectedItem.discount > 0" class="discount-text">{{ selectedItem.discount }}% off</span>
            </div>
            
            <p class="modal-item-description">{{ selectedItem.description }}</p>
            
            <div class="quantity-selector">
              <label for="quantity" v-voix="'QuantityLabel'">Quantity:</label>
              <div class="quantity-controls">
                <button 
                  @click="itemQuantity = Math.max(1, itemQuantity - 1)"
                  v-voix="'DecreaseQuantityButton'"
                  hint="Decrease item quantity"
                >
                  -
                </button>
                <input 
                  type="number" 
                  id="quantity" 
                  v-model="itemQuantity" 
                  min="1"
                  v-voix="'QuantityInput'"
                  hint="Item quantity"
                />
                <button 
                  @click="itemQuantity++"
                  v-voix="'IncreaseQuantityButton'"
                  hint="Increase item quantity"
                >
                  +
                </button>
              </div>
            </div>
            
            <div class="modal-actions">
              <button 
                class="modal-add-btn" 
                @click="addItemToCart"
                v-voix="'AddToCartModalButton'"
                hint="Add selected quantity to your cart"
              >
                Add to Cart - {{ formatPrice(calculateDiscountedPrice(selectedItem.price, selectedItem.discount) * itemQuantity) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.restaurant-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.restaurant-header {
  margin: -2rem -1rem 0;
}

.restaurant-banner {
  height: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.back-btn {
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  align-self: flex-start;
  transition: background 0.2s;
}

.back-btn:hover {
  background: white;
}

.restaurant-title {
  color: white;
}

.restaurant-title h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.restaurant-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.cuisine {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.description {
  max-width: 60%;
  font-size: 1.1rem;
}

.menu-container {
  padding: 1rem 0;
}

.menu-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--text-color);
  text-align: center;
}

.menu-category {
  margin-bottom: 3rem;
}

.category-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border-color);
}

.menu-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.menu-item {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.menu-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.item-image-container {
  position: relative;
}

.item-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.85rem;
}

.item-details {
  padding: 1rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.item-name {
  font-size: 1.2rem;
  margin: 0;
}

.item-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.original-price {
  font-size: 0.9rem;
  text-decoration: line-through;
  color: #999;
}

.current-price {
  font-weight: bold;
  color: var(--primary-color);
}

.item-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.add-to-cart-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.add-to-cart-btn:hover {
  background-color: #ff5252;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-modal-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
}

.modal-item-details {
  display: flex;
  flex-direction: column;
}

.modal-item-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.modal-item-info {
  padding: 1.5rem;
}

.modal-item-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.modal-item-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.discount-text {
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.modal-item-description {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.quantity-controls button {
  background-color: #f1f1f1;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.quantity-controls input {
  width: 60px;
  text-align: center;
  border: none;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  padding: 0.5rem;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.modal-add-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.modal-add-btn:hover {
  background-color: #ff5252;
}

@media (min-width: 768px) {
  .modal-item-details {
    flex-direction: row;
  }
  
  .modal-item-image {
    width: 40%;
    height: auto;
  }
  
  .modal-item-info {
    width: 60%;
  }
}

@media (max-width: 768px) {
  .restaurant-banner {
    height: 250px;
  }
  
  .description {
    max-width: 100%;
  }
  
  .menu-items {
    grid-template-columns: 1fr;
  }
}
</style>