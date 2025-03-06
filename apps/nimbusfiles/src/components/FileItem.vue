<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import fileStore from '@/stores/fileStore'

const props = defineProps({
  file: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value === 'object' && !Array.isArray(value)
    }
  }
})

const emit = defineEmits(['select', 'delete', 'rename', 'share'])
const router = useRouter()

// Format file date
const formattedDate = computed(() => {
  if (!props.file || !props.file.dateModified) return 'Unknown'
  return new Date(props.file.dateModified).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

// Get file icon
const fileIcon = computed(() => {
  if (!props.file || !props.file.type) return '📄'
  return fileStore.getFileIcon(props.file.type)
})

// Handle file/folder click
const handleClick = () => {
  if (!props.file) return
  
  if (props.file.isFolder) {
    // Navigate into folder
    fileStore.navigateToFolder(props.file.id)
  } else {
    // Navigate to file details view
    router.push({ name: 'fileDetail', params: { id: props.file.id } })
  }
  
  emit('select', props.file)
}

// Handle file actions
const handleDelete = (event) => {
  if (!props.file) return
  event.stopPropagation()
  emit('delete', props.file)
}

const handleRename = (event) => {
  if (!props.file) return
  event.stopPropagation()
  emit('rename', props.file)
}

const handleShare = (event) => {
  if (!props.file) return
  event.stopPropagation()
  emit('share', props.file)
}
</script>

<template>
  <div v-if="props.file"
    class="file-item" 
    @click="handleClick"
    v-voix="props.file.isFolder ? 'Folder ' + props.file.name : 'File ' + props.file.name"
    :hint="props.file.isFolder 
      ? 'Click to open folder ' + props.file.name 
      : 'Click to view file details for ' + props.file.name">
    
    <div class="file-icon">{{ fileIcon }}</div>
    
    <div class="file-info">
      <div class="file-name">{{ props.file.name }}</div>
      <div class="file-details">
        <span class="file-size">{{ props.file.size }}</span>
        <span class="file-date">{{ formattedDate }}</span>
      </div>
    </div>
    
    <div class="file-actions">
      <button 
        class="action-btn" 
        title="Rename" 
        @click="handleRename"
        v-voix="'Rename ' + props.file.name"
        hint="Rename this file">🔄</button>
      
      <button 
        class="action-btn" 
        title="Share" 
        @click="handleShare"
        v-voix="'Share ' + props.file.name"
        hint="Share this file with others">🔗</button>
      
      <button 
        class="action-btn delete-btn" 
        title="Delete" 
        @click="handleDelete"
        v-voix="'Delete ' + props.file.name"
        hint="Delete this file">🗑️</button>
    </div>
  </div>
  <div v-else class="file-item-placeholder">
    <div class="loading-indicator">Loading...</div>
  </div>
</template>

<style scoped>
.file-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.file-item:hover {
  background-color: #f1f3f5;
}

.file-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  overflow: hidden;
}

.file-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-details {
  display: flex;
  font-size: 0.8rem;
  color: #6c757d;
}

.file-size {
  margin-right: 1rem;
}

.file-actions {
  display: flex;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.file-item:hover .file-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  font-size: 1rem;
  margin-left: 0.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  color: #495057;
}

.action-btn:hover {
  background-color: #e9ecef;
}

.delete-btn:hover {
  color: #e74c3c;
}

@media (max-width: 768px) {
  .file-actions {
    opacity: 1;
    font-size: 0.875rem;
  }
  
  .file-item {
    flex-wrap: wrap;
  }
  
  .file-info {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .file-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

.file-item-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background-color: #f8f9fa;
  height: 60px;
}

.loading-indicator {
  color: #6c757d;
  font-size: 0.9rem;
}
</style>