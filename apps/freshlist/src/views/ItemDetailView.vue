<script setup>
import { inject, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmModal from '../components/ConfirmModal.vue'

const route = useRoute()
const router = useRouter()
const groceryItems = inject('groceryItems')
const appSettings = inject('appSettings')

// Confirmation modal state
const showDeleteModal = ref(false)

const itemId = route.params.id
const item = computed(() => {
  return groceryItems.value.find(item => item.id === itemId)
})

// Navigate back to list
const goBackToList = () => {
  router.push('/list')
}

// Edit the item
const editItem = () => {
  router.push(`/item/edit/${itemId}`)
}

// Show delete confirmation
const confirmDelete = () => {
  showDeleteModal.value = true
}

// Delete the item after confirmation
const deleteItem = () => {
  const index = groceryItems.value.findIndex(item => item.id === itemId)
  if (index !== -1) {
    groceryItems.value.splice(index, 1)
    router.push('/list')
  }
  showDeleteModal.value = false
}

// Close delete modal
const closeDeleteModal = () => {
  showDeleteModal.value = false
}

// Toggle purchased status
const togglePurchased = () => {
  if (item.value) {
    item.value.isPurchased = !item.value.isPurchased
  }
}

const formattedPrice = computed(() => {
  if (!item.value) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(item.value.price)
})

const formattedDate = computed(() => {
  if (!item.value) return ''
  return new Date(item.value.dateAdded).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<template>
  <div v-if="item" class="item-detail-page">
    <div class="detail-header">
      <button @click="goBackToList" class="btn back-btn" v-voix="'back-to-list-button'" hint="Return to grocery list">
        ← Back to List
      </button>
      <h1 v-voix="'item-detail-title'">Item Details</h1>
    </div>
    
    <div class="item-detail-content">
      <div class="item-image-container" v-if="appSettings.display.showImages">
        <img :src="item.image" :alt="item.name" class="item-image" v-voix="'item-image'" hint="Image of the grocery item" />
      </div>
      
      <div class="item-info">
        <h2 class="item-name" v-voix="'item-name'">{{ item.name }}</h2>
        
        <div class="item-status" :class="{ 'purchased': item.isPurchased }" v-voix="'item-status'">
          {{ item.isPurchased ? 'Purchased' : 'Not Purchased' }}
        </div>
        
        <div class="info-grid">
          <div class="info-item" v-voix="'item-category'">
            <span class="label">Category:</span>
            <span class="value">{{ item.category }}</span>
          </div>
          
          <div class="info-item" v-voix="'item-quantity'">
            <span class="label">Quantity:</span>
            <span class="value">{{ item.quantity }} {{ item.unit }}</span>
          </div>
          
          <div class="info-item" v-voix="'item-price'">
            <span class="label">Price:</span>
            <span class="value">{{ formattedPrice }}</span>
          </div>
          
          <div class="info-item" v-voix="'item-date-added'">
            <span class="label">Added on:</span>
            <span class="value">{{ formattedDate }}</span>
          </div>
        </div>
        
        <div class="notes-section" v-voix="'item-notes'">
          <h3>Notes</h3>
          <p>{{ item.notes }}</p>
        </div>
        
        <div class="action-buttons">
          <button @click="togglePurchased" class="btn purchase-btn" :class="{ 'unpurchase-btn': item.isPurchased }"
                  v-voix="'toggle-purchase-button'" :hint="item.isPurchased ? 'Mark as not purchased' : 'Mark as purchased'">
            {{ item.isPurchased ? 'Mark as Not Purchased' : 'Mark as Purchased' }}
          </button>
          <button @click="editItem" class="btn edit-btn" v-voix="'edit-item-button'" hint="Edit this item">
            Edit Item
          </button>
          <button @click="confirmDelete" class="btn delete-btn" v-voix="'delete-item-button'" hint="Delete this item from your grocery list">
            Delete Item
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h2 v-voix="'item-not-found'">Item not found</h2>
    <button @click="goBackToList" class="btn back-btn" v-voix="'back-to-list-not-found'" hint="Return to grocery list">
      Back to List
    </button>
  </div>
  
  <!-- Delete confirmation modal -->
  <ConfirmModal
    :show="showDeleteModal"
    title="Delete Item"
    message="Are you sure you want to delete this item from your grocery list? This action cannot be undone."
    confirmText="Delete Item"
    cancelText="Cancel"
    confirmClass="danger"
    @confirm="deleteItem"
    @cancel="closeDeleteModal"
  />
</template>

<style scoped>
.item-detail-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.detail-header h1 {
  margin: 0;
  color: #333;
}

.back-btn {
  background-color: #f5f5f5;
  color: #555;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: #eaeaea;
}

.item-detail-content {
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-image-container {
  width: 40%;
  overflow: hidden;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.item-name {
  font-size: 1.8rem;
  margin: 0;
  color: #333;
}

.item-status {
  display: inline-block;
  padding: 0.4rem 1rem;
  background-color: #f0f0f0;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
}

.item-status.purchased {
  background-color: #e8f5e9;
  color: #4caf50;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.label {
  font-size: 0.9rem;
  color: #777;
}

.value {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.notes-section h3 {
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.notes-section p {
  margin: 0;
  color: #555;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
  text-align: center;
  font-size: 1rem;
}

.purchase-btn {
  background-color: #4caf50;
  color: white;
}

.purchase-btn:hover {
  background-color: #3d9140;
}

.unpurchase-btn {
  background-color: #f44336;
  color: white;
}

.unpurchase-btn:hover {
  background-color: #d32f2f;
}

.edit-btn {
  background-color: #ff9800;
  color: white;
}

.edit-btn:hover {
  background-color: #e68a00;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 3rem;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.not-found h2 {
  margin: 0;
  color: #d32f2f;
}

@media (max-width: 768px) {
  .item-detail-content {
    flex-direction: column;
  }
  
  .item-image-container {
    width: 100%;
    height: 250px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>