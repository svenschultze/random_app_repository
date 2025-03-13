<script setup>
import { inject, computed } from 'vue';

const groceryItems = inject('groceryItems');
const categories = inject('categories');

// Calculate category breakdown
const categoryBreakdown = computed(() => {
  const breakdown = categories.value.map(category => {
    const itemsInCategory = groceryItems.value.filter(item => item.category === category);
    const totalItems = itemsInCategory.length;
    const purchasedItems = itemsInCategory.filter(item => item.isPurchased).length;
    const percentComplete = totalItems > 0 ? Math.round((purchasedItems / totalItems) * 100) : 0;
    
    return {
      name: category,
      totalItems,
      purchasedItems,
      percentComplete,
      totalPrice: itemsInCategory.reduce((sum, item) => sum + item.price, 0).toFixed(2)
    };
  });
  
  // Filter out empty categories and sort by number of items (highest first)
  return breakdown
    .filter(category => category.totalItems > 0)
    .sort((a, b) => b.totalItems - a.totalItems);
});
</script>

<template>
  <div class="category-breakdown" v-voix="'category-breakdown'">
    <h2 v-voix="'category-breakdown-title'">Category Breakdown</h2>
    
    <div class="categories-grid">
      <div 
        v-for="category in categoryBreakdown" 
        :key="category.name" 
        class="category-card"
        v-voix="'category-' + category.name.toLowerCase()"
        :hint="category.name + ': ' + category.purchasedItems + ' of ' + category.totalItems + ' items purchased'"
      >
        <div class="category-header">
          <h3>{{ category.name }}</h3>
          <span class="item-count">{{ category.totalItems }} items</span>
        </div>
        
        <div class="category-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: category.percentComplete + '%' }"></div>
          </div>
          <span class="progress-text">{{ category.percentComplete }}% Complete</span>
        </div>
        
        <div class="category-details">
          <div class="detail-item">
            <span class="detail-label">Items:</span>
            <span class="detail-value">{{ category.purchasedItems }}/{{ category.totalItems }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Est. Cost:</span>
            <span class="detail-value">${{ category.totalPrice }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="categoryBreakdown.length === 0" class="empty-state" v-voix="'empty-categories'">
      No items found in any category.
    </div>
  </div>
</template>

<style scoped>
.category-breakdown {
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
}

.category-breakdown h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--color-text);
  font-size: 1.5rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.category-card {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1rem;
  transition: box-shadow 0.2s, transform 0.2s;
}

.category-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.category-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-text);
}

.item-count {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.category-progress {
  margin-bottom: 1rem;
}

.progress-bar {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.category-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.detail-label {
  color: var(--color-text-secondary);
}

.detail-value {
  font-weight: 500;
  color: var(--color-text);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
  font-style: italic;
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>