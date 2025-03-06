<script setup>
defineProps({
  title: {
    type: String,
    required: false,
    default: ''
  },
  subtitle: {
    type: String,
    required: false,
    default: ''
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  },
  contentClass: {
    type: String,
    required: false,
    default: ''
  },
  hasRefresh: {
    type: Boolean,
    required: false,
    default: false
  },
  hasMore: {
    type: Boolean,
    required: false,
    default: false
  },
  hasOptions: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['refresh', 'more', 'options'])

const handleRefresh = () => {
  emit('refresh')
}

const handleMore = () => {
  emit('more')
}

const handleOptions = () => {
  emit('options')
}
</script>

<template>
  <div class="card">
    <div class="card-header" v-if="title || hasRefresh || hasMore || hasOptions">
      <div class="header-content">
        <h3 class="card-title" v-if="title">{{ title }}</h3>
        <p class="card-subtitle" v-if="subtitle">{{ subtitle }}</p>
      </div>
      <div class="header-actions">
        <button 
          v-if="hasRefresh" 
          @click="handleRefresh" 
          class="action-button"
          v-voix="'Refresh Card Content'"
          hint="Click to reload data in this card"
        >
          <span class="icon">🔄</span>
        </button>
        <button 
          v-if="hasOptions" 
          @click="handleOptions" 
          class="action-button"
          v-voix="'Card Options'"
          hint="Click to see additional configuration options"
        >
          <span class="icon">⚙️</span>
        </button>
        <button 
          v-if="hasMore" 
          @click="handleMore" 
          class="action-button"
          v-voix="'View More Details'"
          hint="Click to view expanded information"
        >
          <span class="icon">⋯</span>
        </button>
      </div>
    </div>
    <div class="card-content" :class="contentClass">
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Loading...</p>
      </div>
      <slot v-else></slot>
    </div>
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 4px 10px var(--shadow-color);
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 6px 14px var(--shadow-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.header-content {
  flex-grow: 1;
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.card-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  background: transparent;
  border: none;
  color: var(--text-color);
  opacity: 0.6;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.action-button:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05);
}

.card-content {
  padding: 1.25rem;
}

.card-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--border-color);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  color: var(--text-color);
  opacity: 0.6;
}

.loader {
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>