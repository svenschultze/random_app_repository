<script setup>
import { ref, computed } from 'vue'
import fileStore from '@/stores/fileStore'
import FileItem from './FileItem.vue'

const isLoading = ref(false)
const showRenameModal = ref(false)
const showShareModal = ref(false)
const showDeleteConfirm = ref(false)
const selectedFileForAction = ref(null)
const newFileName = ref('')
const shareLink = ref('')
const searchQuery = ref('')

// Filter files based on search query
const filteredFiles = computed(() => {
  // Get files from the store, ensuring we have an array
  const files = fileStore.currentFiles || [];
  
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

// Compute current path breadcrumbs
const breadcrumbs = computed(() => {
  if (!fileStore.currentPath) {
    return [{ name: 'My Files', id: null }]
  }
  
  const crumbs = [{ name: 'My Files', id: null }]
  let current = fileStore.getFileById(fileStore.currentPath)
  
  if (current) {
    crumbs.push({ name: current.name, id: current.id })
  }
  
  return crumbs
})

// Handle navigation using breadcrumbs
const navigateToBreadcrumb = (crumb) => {
  fileStore.navigateToFolder(crumb.id)
}

// Go up to parent directory
const goToParentFolder = () => {
  fileStore.navigateUp()
}

// Create a new folder
const createNewFolder = async () => {
  isLoading.value = true
  
  try {
    await fileStore.createFolder('New Folder', fileStore.currentPath.value)
  } finally {
    isLoading.value = false
  }
}

// File operation handlers
const handleDelete = (file) => {
  selectedFileForAction.value = file
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!selectedFileForAction.value) return
  
  isLoading.value = true
  
  try {
    await fileStore.deleteFile(selectedFileForAction.value.id)
    showDeleteConfirm.value = false
    selectedFileForAction.value = null
  } finally {
    isLoading.value = false
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  selectedFileForAction.value = null
}

const handleRename = (file) => {
  selectedFileForAction.value = file
  newFileName.value = file.name
  showRenameModal.value = true
}

const confirmRename = async () => {
  if (!selectedFileForAction.value || !newFileName.value.trim()) return
  
  isLoading.value = true
  
  try {
    await fileStore.renameFile(selectedFileForAction.value.id, newFileName.value)
    showRenameModal.value = false
    selectedFileForAction.value = null
    newFileName.value = ''
  } finally {
    isLoading.value = false
  }
}

const cancelRename = () => {
  showRenameModal.value = false
  selectedFileForAction.value = null
  newFileName.value = ''
}

const handleShare = async (file) => {
  selectedFileForAction.value = file
  isLoading.value = true
  
  try {
    const result = await fileStore.shareFile(file.id)
    if (result) {
      shareLink.value = result.link
      showShareModal.value = true
    }
  } finally {
    isLoading.value = false
  }
}

const closeShareModal = () => {
  showShareModal.value = false
  shareLink.value = ''
  selectedFileForAction.value = null
}

const copyShareLink = () => {
  // In a real app, this would copy to clipboard
  alert('Link copied to clipboard: ' + shareLink.value)
}
</script>

<template>
  <div class="file-explorer">
    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb-container" v-voix="'File Path Navigation'" hint="Breadcrumb navigation to see current location">
      <button 
        v-if="fileStore.currentPath" 
        class="back-btn" 
        @click="goToParentFolder"
        v-voix="'Go Up'"
        hint="Go back to parent folder">
        ⬅
      </button>
      
      <div class="breadcrumbs">
        <span 
          v-for="(crumb, index) in breadcrumbs" 
          :key="index"
          class="breadcrumb-item"
          @click="navigateToBreadcrumb(crumb)"
          v-voix="'Navigate to ' + crumb.name"
          :hint="'Click to navigate to ' + crumb.name">
          {{ crumb.name }}
          <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">/</span>
        </span>
      </div>
      
      <div class="explorer-actions">
        <button 
          class="explorer-action-btn" 
          @click="createNewFolder"
          v-voix="'Create New Folder'"
          hint="Create a new folder in current location">
          + New Folder
        </button>
      </div>
    </div>
    
    <!-- File Search -->
    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search files..."
        class="search-input"
        v-voix="'File Search'"
        hint="Type to filter files by name">
    </div>
    
    <!-- File List -->
    <div class="file-list" v-voix="'File List'" hint="List of files and folders in current location">
      <div v-if="isLoading" class="loading-indicator">Loading...</div>
      
      <div v-else-if="filteredFiles.length === 0" class="empty-state">
        <div class="empty-icon">📂</div>
        <p>No files found in this location</p>
      </div>
      
      <div v-else>
        <template v-for="(file, index) in filteredFiles" :key="file && typeof file === 'object' ? file.id : index">
          <FileItem 
            v-if="file && typeof file === 'object'"
            :file="file"
            @delete="handleDelete"
            @rename="handleRename"
            @share="handleShare"
          />
        </template>
      </div>
    </div>
    
    <!-- Rename Modal -->
    <div v-if="showRenameModal" class="modal-overlay">
      <div class="modal-container" v-voix="'Rename File Modal'" hint="Dialog to rename a file">
        <div class="modal-header">
          <h2>Rename File</h2>
          <button 
            class="close-modal" 
            @click="cancelRename"
            v-voix="'Close Rename Modal'"
            hint="Cancel renaming">×</button>
        </div>
        <div class="modal-body">
          <div class="input-group">
            <label for="new-filename" v-voix="'New File Name Label'">New name:</label>
            <input 
              id="new-filename" 
              type="text" 
              v-model="newFileName" 
              class="form-input"
              v-voix="'New File Name Input'"
              hint="Enter the new name for the file">
          </div>
          <div class="modal-actions">
            <button 
              class="cancel-btn" 
              @click="cancelRename"
              v-voix="'Cancel Rename'"
              hint="Cancel the rename operation">Cancel</button>
            <button 
              class="confirm-btn" 
              @click="confirmRename"
              v-voix="'Confirm Rename'"
              hint="Save the new file name">Rename</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Share Modal -->
    <div v-if="showShareModal" class="modal-overlay">
      <div class="modal-container" v-voix="'Share File Modal'" hint="Dialog to share a file">
        <div class="modal-header">
          <h2>Share File</h2>
          <button 
            class="close-modal" 
            @click="closeShareModal"
            v-voix="'Close Share Modal'"
            hint="Close sharing dialog">×</button>
        </div>
        <div class="modal-body">
          <p>Share this file with others using the link below:</p>
          <div class="share-link-container">
            <input 
              type="text" 
              readonly 
              :value="shareLink" 
              class="share-link-input"
              v-voix="'Share Link'"
              hint="Link that can be shared with others">
            <button 
              class="copy-link-btn" 
              @click="copyShareLink"
              v-voix="'Copy Link'"
              hint="Copy the share link to clipboard">Copy</button>
          </div>
          <p class="share-info">This link will expire in 7 days.</p>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay">
      <div class="modal-container" v-voix="'Delete Confirmation Modal'" hint="Dialog to confirm file deletion">
        <div class="modal-header">
          <h2>Delete File</h2>
          <button 
            class="close-modal" 
            @click="cancelDelete"
            v-voix="'Close Delete Modal'"
            hint="Cancel deletion">×</button>
        </div>
        <div class="modal-body">
          <p class="delete-warning">
            Are you sure you want to delete 
            <strong>{{ selectedFileForAction?.name }}</strong>?
          </p>
          <div class="modal-actions">
            <button 
              class="cancel-btn" 
              @click="cancelDelete"
              v-voix="'Cancel Delete'"
              hint="Cancel the delete operation">Cancel</button>
            <button 
              class="delete-btn" 
              @click="confirmDelete"
              v-voix="'Confirm Delete'"
              hint="Permanently delete the file">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-explorer {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.breadcrumb-container {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  margin-right: 0.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: #495057;
}

.back-btn:hover {
  background-color: #e9ecef;
}

.breadcrumbs {
  flex: 1;
  display: flex;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: thin;
}

.breadcrumb-item {
  color: #6c757d;
  cursor: pointer;
}

.breadcrumb-item:hover {
  color: #212529;
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: #ced4da;
}

.breadcrumb-item:last-child {
  color: #212529;
  font-weight: 500;
  cursor: default;
}

.breadcrumb-item:last-child:hover {
  text-decoration: none;
}

.explorer-actions {
  margin-left: 1rem;
}

.explorer-action-btn {
  padding: 0.5rem 0.75rem;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  color: #495057;
  font-weight: 500;
  cursor: pointer;
}

.explorer-action-btn:hover {
  background-color: #e9ecef;
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

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
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

.confirm-btn {
  padding: 0.75rem 1.25rem;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.confirm-btn:hover {
  background-color: #3a56d4;
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

.delete-warning {
  margin-bottom: 1.5rem;
  color: #e74c3c;
}

.share-link-container {
  display: flex;
  margin-bottom: 1rem;
}

.share-link-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px 0 0 4px;
  font-size: 0.9rem;
  background-color: #f8f9fa;
}

.copy-link-btn {
  padding: 0.75rem 1.25rem;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  font-weight: 500;
  cursor: pointer;
}

.share-info {
  font-size: 0.875rem;
  color: #6c757d;
}

@media (max-width: 768px) {
  .explorer-actions {
    display: none;
  }
  
  .breadcrumb-container {
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .modal-container {
    width: 95%;
  }
}
</style>