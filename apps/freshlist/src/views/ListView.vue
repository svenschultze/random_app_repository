<script setup>
import { inject, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmModal from '../components/ConfirmModal.vue'

const router = useRouter()
const groceryItems = inject('groceryItems')
const categories = inject('categories')
const appSettings = inject('appSettings')

// Confirmation modal state
const showDeleteModal = ref(false)
const itemToDelete = ref(null)

// Filter and sort state
const selectedCategory = ref('All')
const searchQuery = ref('')
const sortBy = ref(appSettings.display.sortDefaultField || 'name')
const sortDirection = ref('asc')

// Toggle purchased status
const togglePurchased = (item) => {
  item.isPurchased = !item.isPurchased
}

// View item details
const viewItemDetails = (id) => {
  router.push(`/item/${id}`)
}

// Add new item
const addNewItem = () => {
  router.push('/item/edit/new')
}

// Edit item
const editItem = (id) => {
  router.push(`/item/edit/${id}`)
}

// Show delete confirmation
const confirmDelete = (id) => {
  itemToDelete.value = id
  showDeleteModal.value = true
}

// Delete item after confirmation
const deleteItem = () => {
  if (itemToDelete.value) {
    const index = groceryItems.value.findIndex(item => item.id === itemToDelete.value)
    if (index !== -1) {
      groceryItems.value.splice(index, 1)
    }
    closeDeleteModal()
  }
}

// Close delete modal
const closeDeleteModal = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

// Filtered and sorted items
const filteredItems = computed(() => {
  let result = [...groceryItems.value]
  
  // Apply category filter
  if (selectedCategory.value !== 'All') {
    result = result.filter(item => item.category === selectedCategory.value)
  }
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query) ||
      item.notes.toLowerCase().includes(query)
    )
  }
  
  // Apply sorting
  result.sort((a, b) => {
    let aValue = a[sortBy.value]
    let bValue = b[sortBy.value]
    
    // Special case for purchased status
    if (sortBy.value === 'isPurchased') {
      return sortDirection.value === 'asc' 
        ? (a.isPurchased === b.isPurchased ? 0 : a.isPurchased ? 1 : -1)
        : (a.isPurchased === b.isPurchased ? 0 : a.isPurchased ? -1 : 1)
    }
    
    // Compare values
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
  
  return result
})

// Change sort order
const changeSortOrder = (field) => {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortDirection.value = 'asc'
  }
}
</script>

<template>
  <div class="grocery-list-page" :class="{ 'compact-view': appSettings.display.compactView }">
    <div class="list-header">
      <h1 v-voix="'grocery-list-title'">Grocery List</h1>
      <button @click="addNewItem" class="btn add-btn" v-voix="'add-new-item-button'" hint="Add a new item to your grocery list">
        Add New Item
      </button>
    </div>
    
    <div class="filter-bar">
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search items..." 
          class="search-input"
          v-voix="'search-items-input'"
          hint="Search for grocery items by name, category, or notes"
        />
      </div>
      
      <div class="category-filter">
        <label for="category-select" v-voix="'category-filter-label'">Filter by:</label>
        <select 
          id="category-select" 
          v-model="selectedCategory" 
          class="category-select"
          v-voix="'category-select'"
          hint="Filter grocery items by category"
        >
          <option value="All">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="list-content">
      <table class="grocery-table">
        <thead>
          <tr>
            <th v-voix="'header-status'">Status</th>
            <th @click="changeSortOrder('name')" class="sortable" v-voix="'header-name'">
              Name 
              <span v-if="sortBy === 'name'" class="sort-icon">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="changeSortOrder('quantity')" class="sortable" v-voix="'header-quantity'">
              Quantity
              <span v-if="sortBy === 'quantity'" class="sort-icon">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="changeSortOrder('category')" class="sortable" v-voix="'header-category'">
              Category
              <span v-if="sortBy === 'category'" class="sort-icon">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="changeSortOrder('isPurchased')" class="sortable" v-voix="'header-purchased'">
              Purchased
              <span v-if="sortBy === 'isPurchased'" class="sort-icon">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th v-voix="'header-actions'">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.id" :class="{ 'purchased-row': item.isPurchased }"
              v-voix="'grocery-item-' + item.id" :hint="item.name + ' - ' + item.quantity + ' ' + item.unit + ' - ' + item.category">
            <td>
              <input 
                type="checkbox" 
                :checked="item.isPurchased" 
                @change="togglePurchased(item)"
                :id="'item-checkbox-' + item.id"
                v-voix="'checkbox-' + item.id"
                :hint="'Mark ' + item.name + ' as ' + (item.isPurchased ? 'not purchased' : 'purchased')"
              />
            </td>
            <td class="item-name">{{ item.name }}</td>
            <td>{{ item.quantity }} {{ item.unit }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.isPurchased ? 'Yes' : 'No' }}</td>
            <td class="actions">
              <button 
                @click="viewItemDetails(item.id)" 
                class="btn view-btn"
                v-voix="'view-details-' + item.id"
                hint="View details for this item"
              >
                View
              </button>
              <button 
                @click="editItem(item.id)" 
                class="btn edit-btn"
                v-voix="'edit-item-' + item.id"
                hint="Edit this item"
              >
                Edit
              </button>
              <button 
                @click="confirmDelete(item.id)" 
                class="btn delete-btn"
                v-voix="'delete-item-' + item.id"
                hint="Delete this item from your grocery list"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="filteredItems.length === 0">
            <td colspan="6" class="empty-list" v-voix="'empty-list-message'">
              No items found. Try changing your filters or add a new item.
            </td>
          </tr>
        </tbody>
      </table>
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
  </div>
</template>

<style scoped>
.grocery-list-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-header h1 {
  margin: 0;
  color: #333;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.add-btn {
  background-color: #4caf50;
  color: white;
}

.add-btn:hover {
  background-color: #3d9140;
}

.filter-bar {
  display: flex;
  gap: 1rem;
  align-items: center;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-container {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.category-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 150px;
}

.list-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.grocery-table {
  width: 100%;
  border-collapse: collapse;
}

.grocery-table th,
.grocery-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  transition: padding 0.3s;
}

.compact-view .grocery-table th,
.compact-view .grocery-table td {
  padding: 0.5rem 1rem;
}

.grocery-table th {
  background-color: #f9f9f9;
  font-weight: 600;
  color: #555;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: #f0f0f0;
}

.sort-icon {
  margin-left: 0.5rem;
  font-size: 0.8rem;
}

.item-name {
  font-weight: 500;
}

.purchased-row {
  background-color: #f9fff9;
  color: #999;
}

.purchased-row .item-name {
  text-decoration: line-through;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  background-color: #2196f3;
  color: white;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
}

.view-btn:hover {
  background-color: #0b7dda;
}

.edit-btn {
  background-color: #ff9800;
  color: white;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
}

.edit-btn:hover {
  background-color: #e68a00;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.empty-list {
  text-align: center;
  padding: 2rem;
  color: #777;
  font-style: italic;
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-container {
    width: 100%;
  }
  
  .category-filter {
    width: 100%;
  }
  
  .category-select {
    flex: 1;
  }
  
  .grocery-table {
    display: block;
    overflow-x: auto;
  }
}
</style>