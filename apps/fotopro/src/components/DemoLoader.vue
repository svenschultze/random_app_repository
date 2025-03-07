<script setup>
import { ref } from 'vue'
import { usePhotoStore } from '@/stores/photoStore'
import { generateDemoData } from '@/utils/demoPhotos'

const photoStore = usePhotoStore()
const isLoading = ref(false)
const isComplete = ref(false)
const error = ref(null)

// Function to load demo data
async function loadDemoData() {
  if (isLoading.value) return
  
  isLoading.value = true
  error.value = null
  
  try {
    // Check if we already have photos
    if (photoStore.photos.length > 0) {
      if (!confirm('This will add additional demo photos. Continue?')) {
        isLoading.value = false
        return
      }
    }
    
    // Generate the data
    const success = await generateDemoData(photoStore)
    
    if (success) {
      isComplete.value = true
      setTimeout(() => {
        isComplete.value = false
      }, 3000)
    } else {
      error.value = 'Failed to generate demo data'
    }
  } catch (err) {
    error.value = err.message || 'An error occurred'
    console.error('Demo data error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="demo-loader">
    <button 
      @click="loadDemoData" 
      class="demo-button"
      :disabled="isLoading"
      v-voix="'load-demo-photos-button'"
      hint="Load a set of demo photos into the library for testing">
      {{ isLoading ? 'Loading...' : 'Load Demo Photos' }}
    </button>
    
    <span v-if="isComplete" class="success-message">
      Demo photos loaded successfully!
    </span>
    
    <span v-if="error" class="error-message">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
.demo-loader {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-button {
  background-color: #673ab7;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.demo-button:hover {
  background-color: #5e35b1;
}

.demo-button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.success-message {
  color: #4caf50;
  font-weight: bold;
}

.error-message {
  color: #f44336;
  font-weight: bold;
}
</style>