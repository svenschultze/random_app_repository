<script setup>
import { inject, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { faker } from '@faker-js/faker'

const route = useRoute()
const router = useRouter()
const groceryItems = inject('groceryItems')
const categories = inject('categories')

const itemId = route.params.id
const isNew = itemId === 'new'

// Form data
const formData = ref({
  name: '',
  quantity: 1,
  unit: 'pcs',
  category: '',
  isPurchased: false,
  price: 0,
  notes: '',
  image: ''
})

// Units options
const unitOptions = ['pack', 'kg', 'lb', 'pcs', 'bottle', 'can']

// Load existing item data if editing
onMounted(() => {
  if (!isNew) {
    const existingItem = groceryItems.value.find(item => item.id === itemId)
    if (existingItem) {
      formData.value = { ...existingItem }
    } else {
      router.push('/list')
    }
  } else {
    // Set default category for new items
    formData.value.category = categories.value[0]
    // Generate random image for new items
    formData.value.image = faker.image.urlLoremFlickr({ category: 'food' })
  }
})

// Form validation
const errors = ref({})
const isFormValid = computed(() => {
  let valid = true
  errors.value = {}
  
  if (!formData.value.name.trim()) {
    errors.value.name = 'Name is required'
    valid = false
  }
  
  if (formData.value.quantity <= 0) {
    errors.value.quantity = 'Quantity must be greater than 0'
    valid = false
  }
  
  if (!formData.value.category) {
    errors.value.category = 'Category is required'
    valid = false
  }
  
  if (formData.value.price < 0) {
    errors.value.price = 'Price cannot be negative'
    valid = false
  }
  
  return valid
})

// Save the item
const saveItem = () => {
  if (!isFormValid.value) return
  
  if (isNew) {
    // Create new item
    const newItem = {
      ...formData.value,
      id: faker.string.uuid(),
      dateAdded: new Date()
    }
    groceryItems.value.push(newItem)
  } else {
    // Update existing item
    const index = groceryItems.value.findIndex(item => item.id === itemId)
    if (index !== -1) {
      groceryItems.value[index] = { ...formData.value }
    }
  }
  
  // Navigate back to list
  router.push('/list')
}

// Cancel editing
const cancelEditing = () => {
  router.back()
}

// Format price to 2 decimal places
const formatPrice = (value) => {
  return parseFloat(value).toFixed(2)
}
</script>

<template>
  <div class="item-edit-page">
    <div class="edit-header">
      <button @click="cancelEditing" class="btn back-btn" v-voix="'cancel-edit-button'" hint="Cancel and return to previous screen">
        ← Cancel
      </button>
      <h1 v-voix="'edit-form-title'">{{ isNew ? 'Add New Item' : 'Edit Item' }}</h1>
    </div>
    
    <form @submit.prevent="saveItem" class="edit-form">
      <div class="form-grid">
        <div class="form-group">
          <label for="item-name" v-voix="'item-name-label'">Item Name</label>
          <input 
            type="text" 
            id="item-name" 
            v-model="formData.name" 
            placeholder="Enter item name"
            class="form-input"
            :class="{ 'error': errors.name }"
            v-voix="'item-name-input'"
            hint="Enter the name of the grocery item"
          />
          <span class="error-text" v-if="errors.name" v-voix="'item-name-error'">{{ errors.name }}</span>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="item-quantity" v-voix="'item-quantity-label'">Quantity</label>
            <input 
              type="number" 
              id="item-quantity" 
              v-model.number="formData.quantity" 
              min="1"
              class="form-input"
              :class="{ 'error': errors.quantity }"
              v-voix="'item-quantity-input'"
              hint="Enter the quantity needed"
            />
            <span class="error-text" v-if="errors.quantity" v-voix="'item-quantity-error'">{{ errors.quantity }}</span>
          </div>
          
          <div class="form-group">
            <label for="item-unit" v-voix="'item-unit-label'">Unit</label>
            <select 
              id="item-unit" 
              v-model="formData.unit"
              class="form-select"
              v-voix="'item-unit-select'"
              hint="Select the unit of measurement"
            >
              <option v-for="unit in unitOptions" :key="unit" :value="unit">
                {{ unit }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="item-category" v-voix="'item-category-label'">Category</label>
          <select 
            id="item-category" 
            v-model="formData.category"
            class="form-select"
            :class="{ 'error': errors.category }"
            v-voix="'item-category-select'"
            hint="Select a category for this item"
          >
            <option value="" disabled>Select a category</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <span class="error-text" v-if="errors.category" v-voix="'item-category-error'">{{ errors.category }}</span>
        </div>
        
        <div class="form-group">
          <label for="item-price" v-voix="'item-price-label'">Price ($)</label>
          <input 
            type="number" 
            id="item-price" 
            v-model.number="formData.price" 
            min="0"
            step="0.01"
            class="form-input"
            :class="{ 'error': errors.price }"
            @blur="formData.price = formatPrice(formData.price)"
            v-voix="'item-price-input'"
            hint="Enter the estimated price"
          />
          <span class="error-text" v-if="errors.price" v-voix="'item-price-error'">{{ errors.price }}</span>
        </div>
        
        <div class="form-group checkbox-group">
          <input 
            type="checkbox" 
            id="item-purchased" 
            v-model="formData.isPurchased"
            v-voix="'item-purchased-checkbox'"
            hint="Mark this item as already purchased"
          />
          <label for="item-purchased" v-voix="'item-purchased-label'">Item is already purchased</label>
        </div>
        
        <div class="form-group full-width">
          <label for="item-notes" v-voix="'item-notes-label'">Notes</label>
          <textarea 
            id="item-notes" 
            v-model="formData.notes" 
            placeholder="Add any additional notes here"
            class="form-textarea"
            v-voix="'item-notes-textarea'"
            hint="Add any additional information about this item"
          ></textarea>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="cancelEditing" class="btn cancel-btn" v-voix="'cancel-button'" hint="Cancel changes and return to previous screen">
          Cancel
        </button>
        <button type="submit" class="btn save-btn" v-voix="'save-button'" hint="Save changes to this item">
          Save Item
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.item-edit-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.edit-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.edit-header h1 {
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

.edit-form {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
}

label {
  font-weight: 600;
  color: #555;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #4caf50;
  outline: none;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.error {
  border-color: #f44336;
}

.error-text {
  font-size: 0.85rem;
  color: #f44336;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
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

.cancel-btn {
  background-color: #f5f5f5;
  color: #555;
}

.cancel-btn:hover {
  background-color: #eaeaea;
}

.save-btn {
  background-color: #4caf50;
  color: white;
}

.save-btn:hover {
  background-color: #3d9140;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn {
    width: 100%;
  }
}
</style>