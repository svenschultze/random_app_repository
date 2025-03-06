<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import fileStore from '@/stores/fileStore'
import FileItem from '../components/FileItem.vue'

const router = useRouter()
const isLoading = ref(false)
const searchQuery = ref('')
const selectedFileForAction = ref(null)
const showPermanentDeleteConfirm = ref(false)

// Filter files based on search query
const filteredFiles = computed(() => {
  // Get files from the store, ensuring we have an array
  const files = fileStore.trashedFiles || [];
  
  // First filter for valid file objects
  const validFiles = Array.isArray(files) ? files.filter(file => 
    file && typeof file === 'object' && !Array.isArray(file) && file.name
  ) : [];
  
  if (!searchQuery.value) {
    return validFiles;
  }
  
  const query = searchQuery.value.toLowerCase();
  return validFiles.filter(file => 
    file.name.toLowerCase().includes(query)
  );
})

// File operation handlers
const handleFileSelect = (file) => {
  if (!file) return
  
  // In trash view, clicking a file does nothing
  // but we keep this for consistency
}

const handleRestore = async (file) => {
  if (!file) return
  
  isLoading.value = true
  
  try {
    await fileStore.restoreFile(file.id)
  } finally {
    isLoading.value = false
  }
}

const handlePermanentDelete = (file) => {
  if (!file) return
  
  selectedFileForAction.value = file
  showPermanentDeleteConfirm.value = true
}

const confirmPermanentDelete = async () => {
  if (!selectedFileForAction.value) return
  
  isLoading.value = true
  
  try {
    // In a real app, this would permanently delete the file
    // For our demo, we'll just remove it from the trash
    const index = fileStore.trashedFiles.value.findIndex(
      file => file.id === selectedFileForAction.value.id
    )
    
    if (index !== -1) {
      fileStore.trashedFiles.value.splice(index, 1)
    }
    
    showPermanentDeleteConfirm.value = false
    selectedFileForAction.value = null
  } finally {
    isLoading.value = false
  }
}

const cancelPermanentDelete = () => {
  showPermanentDeleteConfirm.value = false
  selectedFileForAction.value = null
}

const emptyTrash = async () => {
  if (fileStore.trashedFiles.value.length === 0) return
  
  isLoading.value = true
  
  try {
    // In a real app, this would permanently delete all files
    // For our demo, we'll just clear the trash array
    await new Promise(resolve => setTimeout(resolve, 1500))
    fileStore.trashedFiles.value = []
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="trash-view">
    <div class="trash-header">
      <h1 class="page-title" v-voix="'Trash Page'">Trash</h1>
      
      <button 
        v-if="filteredFiles.length > 0"
        class="empty-trash-btn" 
        @click="emptyTrash"
        v-voix="'Empty Trash'"
        hint="Permanently delete all files in trash">
        Empty Trash
      </button>
    </div>
    
    <!-- File Search -->
    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search trash..."
        class="search-input"
        v-voix="'Search Trash'"
        hint="Type to filter trashed files by name">
    </div>
    
    <!-- File List -->
    <div class="file-list" v-voix="'Trashed Files List'" hint="List of deleted files in trash">
      <div v-if="isLoading" class="loading-indicator">Loading...</div>
      
      <div v-else-if="filteredFiles.length === 0" class="empty-state">
        <div class="empty-icon">🗑️</div>
        <p>Trash is empty</p>
        <p class="empty-message">Files you delete will appear here for recovery</p>
      </div>
      
      <div v-else class="trash-items">
        <div 
          v-for="file in filteredFiles" 
          :key="file.id" 
          class="trash-item"
          v-voix="'File ' + file.name + ' in trash'"
          :hint="'Deleted file: ' + file.name">
          
          <div class="file-icon">{{ fileStore.getFileIcon(file.type) }}</div>
          
          <div class="file-info">
            <div class="file-name">{{ file.name }}</div>
            <div class="file-details">
              <span class="file-size">{{ file.size }}</span>
              <span class="file-date">{{ new Date(file.dateModified).toLocaleDateString() }}</span>
            </div>
          </div>
          
          <div class="trash-actions">
            <button 
              class="action-btn restore-btn" 
              title="Restore" 
              @click="handleRestore(file)"
              v-voix="'Restore ' + file.name"
              hint="Restore this file from trash">
              Restore
            </button>
            
            <button 
              class="action-btn delete-btn" 
              title="Delete Permanently" 
              @click="handlePermanentDelete(file)"
              v-voix="'Permanently Delete ' + file.name"
              hint="Permanently delete this file">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Permanent Delete Confirmation Modal -->
    <div v-if="showPermanentDeleteConfirm" class="modal-overlay">
      <div class="modal-container" v-voix="'Permanent Delete Confirmation'" hint="Dialog to confirm permanent deletion">
        <div class="modal-header">
          <h2>Permanent Delete</h2>
          <button 
            class="close-modal" 
            @click="cancelPermanentDelete"
            v-voix="'Close Delete Modal'"
            hint="Cancel deletion">×</button>
        </div>
        <div class="modal-body">
          <p class="delete-warning">
            Are you sure you want to permanently delete 
            <strong>{{ selectedFileForAction?.name }}</strong>?
          </p>
          <p>This action cannot be undone.</p>
          <div class="modal-actions">
            <button 
              class="cancel-btn" 
              @click="cancelPermanentDelete"
              v-voix="'Cancel Delete'"
              hint="Cancel the delete operation">Cancel</button>
            <button 
              class="delete-btn" 
              @click="confirmPermanentDelete"
              v-voix="'Confirm Permanent Delete'"
              hint="Permanently delete this file without possibility of recovery">
              Permanently Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trash-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.trash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.empty-trash-btn {
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.empty-trash-btn:hover {
  background-color: #c0392b;
}

.search-bar {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
}

.file-list {
  flex: 1;
  overflow-y: auto;
}

.loading-indicator {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6c757d;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-message {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: #adb5bd;
}

.trash-items {
  display: flex;
  flex-direction: column;
}

.trash-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background-color: white;
  transition: background-color 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.trash-item:hover {
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

.trash-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.85rem;
}

.restore-btn {
  color: #4361ee;
  background-color: #edf2ff;
  border: 1px solid #bac8ff;
}

.restore-btn:hover {
  background-color: #dbe4ff;
}

.delete-btn {
  color: #e74c3c;
  background-color: #fff5f5;
  border: 1px solid #ffc9c9;
}

.delete-btn:hover {
  background-color: #ffe3e3;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.close-modal {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 1.5rem;
}

.delete-warning {
  margin-bottom: 1rem;
  color: #e74c3c;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.cancel-btn {
  padding: 0.75rem 1.25rem;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  color: #495057;
  font-weight: 500;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #e9ecef;
}

.delete-btn {
  padding: 0.75rem 1.25rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c0392b;
}

@media (max-width: 768px) {
  .trash-item {
    flex-wrap: wrap;
  }
  
  .file-info {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .trash-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>