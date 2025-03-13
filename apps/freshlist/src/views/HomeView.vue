<script setup>
import { inject, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import CategoryBreakdown from '@/components/CategoryBreakdown.vue'

const router = useRouter()
const user = inject('user')
const groceryItems = inject('groceryItems')
const appSettings = inject('appSettings')

// Dashboard config modal state
const showConfigModal = ref(false)

// Navigate to settings page with dashboard tab active
const goToDashboardSettings = () => {
  router.push('/settings?tab=dashboard')
}

// Computed properties for summary statistics
const totalItems = computed(() => groceryItems.value.length)
const purchasedItems = computed(() => groceryItems.value.filter(item => item.isPurchased).length)
const percentComplete = computed(() => {
  return totalItems.value ? Math.round((purchasedItems.value / totalItems.value) * 100) : 0
})

const categoryCount = computed(() => {
  const categories = new Set(groceryItems.value.map(item => item.category))
  return categories.size
})

// Navigate to grocery list
const viewList = () => {
  router.push('/list')
}

// Navigate to add item form
const addItem = () => {
  router.push('/item/edit/new')
}
</script>

<template>
  <div v-if="user" class="dashboard" :class="appSettings.dashboard.layout">
    <div class="dashboard-header">
      <h1 v-voix="'dashboard-title'">Dashboard</h1>
      <button 
        @click="goToDashboardSettings" 
        class="config-button" 
        v-voix="'configure-dashboard-button'"
        hint="Configure dashboard layout and widgets"
      >
        <span class="config-icon">⚙️</span>
        Configure Dashboard
      </button>
    </div>
    <!-- User Profile Widget -->
    <section v-if="appSettings.dashboard.widgets.userProfile" class="user-profile widget">
      <div class="widget-header">
        <h2 v-voix="'user-profile-title'">User Profile</h2>
      </div>
      <div class="widget-content">
        <img :src="user.avatar" :alt="user.name" class="avatar" v-voix="'user-avatar'" hint="Profile picture of the randomly generated user" />
        <div class="user-info">
          <h2 v-voix="'user-name'">{{ user.name }}</h2>
          <p class="user-bio" v-voix="'user-bio'">{{ user.bio }}</p>
        </div>
      </div>
    </section>

    <!-- Summary Stats Widget -->
    <section v-if="appSettings.dashboard.widgets.summaryStats" class="summary-card widget">
      <div class="widget-header">
        <h2 v-voix="'grocery-summary-title'">Your Grocery List</h2>
      </div>
      
      <div class="widget-content">
        <div class="summary-stats">
          <div class="stat-item" v-voix="'total-items-stat'">
            <span class="stat-number">{{ totalItems }}</span>
            <span class="stat-label">Total Items</span>
          </div>
          
          <div class="stat-item" v-voix="'categories-stat'">
            <span class="stat-number">{{ categoryCount }}</span>
            <span class="stat-label">Categories</span>
          </div>
          
          <div class="stat-item" v-voix="'purchased-stat'">
            <span class="stat-number">{{ purchasedItems }}/{{ totalItems }}</span>
            <span class="stat-label">Purchased</span>
          </div>
        </div>
        
        <!-- Progress Bar Widget (nested within summary stats or can be separate) -->
        <div v-if="appSettings.dashboard.widgets.progressBar" class="progress-container" v-voix="'progress-bar'" hint="Visual representation of shopping progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: percentComplete + '%' }"></div>
          </div>
          <span class="progress-text">{{ percentComplete }}% Complete</span>
        </div>

        <div class="action-buttons">
          <button @click="viewList" class="btn primary" v-voix="'view-list-button'" hint="Go to full grocery list view">
            View Full List
          </button>
          <button @click="addItem" class="btn secondary" v-voix="'add-item-button'" hint="Add a new item to the grocery list">
            Add New Item
          </button>
        </div>
      </div>
    </section>

    <!-- Recently Added Items Widget -->
    <section v-if="appSettings.dashboard.widgets.recentItems" class="recent-items widget">
      <div class="widget-header">
        <h2 v-voix="'recent-items-title'">Recently Added Items</h2>
      </div>
      
      <div class="widget-content">
        <ul class="item-preview-list">
          <li v-for="item in groceryItems.slice(0, 3)" :key="item.id" class="item-preview"
              v-voix="'item-preview-' + item.id" :hint="item.name + ', ' + item.quantity + ' ' + item.unit">
            <div class="item-preview-content">
              <h3>{{ item.name }}</h3>
              <p>{{ item.quantity }} {{ item.unit }} - {{ item.category }}</p>
            </div>
            <span class="item-status" :class="{ 'purchased': item.isPurchased }">
              {{ item.isPurchased ? 'Purchased' : 'To Buy' }}
            </span>
          </li>
        </ul>
      </div>
    </section>
    
    <!-- Category Breakdown Widget -->
    <section v-if="appSettings.dashboard.widgets.categoryBreakdown" class="widget category-breakdown-widget">
      <CategoryBreakdown />
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Dashboard header with configuration button */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.dashboard-header h1 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.8rem;
}

.config-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  color: var(--color-text);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.config-button:hover {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary-dark);
}

.config-icon {
  font-size: 1.2rem;
}

/* Dashboard layout variations */
.dashboard.compact {
  gap: 1rem;
}

.dashboard.compact .widget {
  padding: 1rem;
}

.dashboard.expanded {
  gap: 3rem;
}

.dashboard.expanded .widget {
  padding: 2.5rem;
}

/* Grid layout for wider screens */
@media (min-width: 1200px) {
  .dashboard {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 2rem;
  }
  
  .dashboard.compact {
    grid-gap: 1rem;
  }
  
  .dashboard.expanded {
    grid-gap: 3rem;
  }
  
  .dashboard .widget.user-profile {
    grid-column: 1;
  }
  
  .dashboard .widget.summary-card {
    grid-column: 2;
  }
  
  .dashboard .widget.recent-items,
  .dashboard .widget.category-breakdown-widget {
    grid-column: span 2;
  }
}

/* Common widget styling */
.widget {
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
  transition: background-color 0.3s, box-shadow 0.3s;
}

.widget-header {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
}

.widget-header h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.5rem;
}

.widget-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* User profile widget specific styles */
.user-profile {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.user-profile .widget-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  object-fit: cover;
  border: 3px solid #4caf50;
}

.user-info h2 {
  margin-top: 0;
  color: #333;
  font-size: 1.8rem;
}

.user-bio {
  color: #666;
  line-height: 1.5;
}

.summary-card {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary-card h2 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1.5rem;
}

.summary-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-right: 1rem;
}

.stat-item:last-child {
  margin-right: 0;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #4caf50;
}

.stat-label {
  margin-top: 0.5rem;
  color: #666;
}

.progress-container {
  margin-bottom: 2rem;
}

.progress-bar {
  height: 12px;
  background-color: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 1rem;
}

.btn.primary {
  background-color: #4caf50;
  color: white;
}

.btn.primary:hover {
  background-color: #3d9140;
}

.btn.secondary {
  background-color: white;
  color: #4caf50;
  border: 2px solid #4caf50;
}

.btn.secondary:hover {
  background-color: #f5f5f5;
}

.recent-items {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recent-items h2 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1.5rem;
}

.item-preview-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.item-preview:last-child {
  border-bottom: none;
}

.item-preview-content h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.item-preview-content p {
  margin: 0.25rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

.item-status {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  background-color: #f0f0f0;
  color: #666;
}

.item-status.purchased {
  background-color: #e8f5e9;
  color: #4caf50;
}

@media (max-width: 768px) {
  .user-profile {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1.5rem;
  }
  
  .summary-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stat-item {
    margin-right: 0;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>