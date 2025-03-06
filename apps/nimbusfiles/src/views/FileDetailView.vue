<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import fileStore from '@/stores/fileStore'

const route = useRoute()
const router = useRouter()
const file = ref(null)
const isLoading = ref(true)
const showRenameModal = ref(false)
const showShareModal = ref(false)
const showDeleteConfirm = ref(false)
const newFileName = ref('')
const shareLink = ref('')

// Format file date
const formattedDate = computed(() => {
  if (!file.value?.dateModified) return 'Unknown'
  return new Date(file.value.dateModified).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Get file icon
const fileIcon = computed(() => {
  if (!file.value) return '📄'
  return fileStore.getFileIcon(file.value.type)
})

// Check if this file type supports preview
const canPreview = computed(() => {
  if (!file.value) return false
  return fileStore.supportsPreviewing(file.value.type)
})

// Get file metadata formatted for display
const fileMetadata = computed(() => {
  if (!file.value) return []
  
  return [
    { label: 'Type', value: file.value.type.toUpperCase() },
    { label: 'Size', value: file.value.size },
    { label: 'Modified', value: formattedDate.value },
    { label: 'Path', value: fileStore.getPath(file.value.id) }
  ]
})

// Load file data
onMounted(async () => {
  isLoading.value = true
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    file.value = fileStore.getFileById(route.params.id)
    
    if (!file.value) {
      // File not found, go back to file list
      router.push('/')
    }
  } finally {
    isLoading.value = false
  }
})

// File action handlers
const navigateBack = () => {
  router.push('/')
}

const downloadFile = () => {
  alert(`Downloading ${file.value.name}...`)
  // In a real app, this would trigger a file download
}

const openRenameModal = () => {
  newFileName.value = file.value.name
  showRenameModal.value = true
}

const confirmRename = async () => {
  if (!file.value || !newFileName.value.trim()) return
  
  isLoading.value = true
  
  try {
    await fileStore.renameFile(file.value.id, newFileName.value)
    showRenameModal.value = false
    newFileName.value = ''
  } finally {
    isLoading.value = false
  }
}

const cancelRename = () => {
  showRenameModal.value = false
  newFileName.value = ''
}

const openDeleteModal = () => {
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!file.value) return
  
  isLoading.value = true
  
  try {
    await fileStore.deleteFile(file.value.id)
    showDeleteConfirm.value = false
    navigateBack()
  } finally {
    isLoading.value = false
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
}

const shareFile = async () => {
  if (!file.value) return
  
  isLoading.value = true
  
  try {
    const result = await fileStore.shareFile(file.value.id)
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
}

const copyShareLink = () => {
  // In a real app, this would copy to clipboard
  alert('Link copied to clipboard: ' + shareLink.value)
}
</script>

<template>
  <div class="file-detail-view">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner">Loading...</div>
    </div>
    
    <!-- File Not Found -->
    <div v-else-if="!file" class="not-found">
      <h2 v-voix="'File Not Found'">File Not Found</h2>
      <p>The requested file could not be found.</p>
      <button 
        class="back-btn" 
        @click="navigateBack"
        v-voix="'Back to Files'"
        hint="Return to file explorer">
        Back to Files
      </button>
    </div>
    
    <!-- File Detail Content -->
    <div v-else class="file-content">
      <div class="file-header">
        <button 
          class="back-btn" 
          @click="navigateBack"
          v-voix="'Back to Files'"
          hint="Return to file explorer">
          ⬅ Back to Files
        </button>
      </div>
      
      <div class="file-details-section">
        <div class="file-primary-info">
          <div class="file-icon-large">{{ fileIcon }}</div>
          <div class="file-name-container">
            <h1 class="file-title" v-voix="'File Name: ' + file.name">{{ file.name }}</h1>
            <div class="file-actions">
              <button 
                class="action-btn" 
                @click="downloadFile"
                v-voix="'Download File'"
                hint="Download this file to your device">
                <span class="action-icon">⬇️</span>
                Download
              </button>
              
              <button 
                class="action-btn" 
                @click="shareFile"
                v-voix="'Share File'"
                hint="Share this file with others">
                <span class="action-icon">🔗</span>
                Share
              </button>
              
              <button 
                class="action-btn" 
                @click="openRenameModal"
                v-voix="'Rename File'"
                hint="Change the name of this file">
                <span class="action-icon">🔄</span>
                Rename
              </button>
              
              <button 
                class="action-btn delete-btn" 
                @click="openDeleteModal"
                v-voix="'Delete File'"
                hint="Delete this file">
                <span class="action-icon">🗑️</span>
                Delete
              </button>
            </div>
          </div>
        </div>
        
        <div class="details-container">
          <div class="metadata-section">
            <h3 v-voix="'File Details'">File Details</h3>
            <table class="metadata-table">
              <tbody>
                <tr v-for="(item, index) in fileMetadata" :key="index">
                  <th v-voix="item.label">{{ item.label }}</th>
                  <td v-voix="item.value">{{ item.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="preview-section">
            <h3 v-voix="'File Preview'">File Preview</h3>
            <div 
              class="preview-container" 
              v-voix="canPreview ? 'Preview Available' : 'No Preview Available'"
              :hint="canPreview ? 'Preview of file content' : 'This file type does not support preview'">
              <div v-if="canPreview" class="preview-content">
                <div class="preview-placeholder">
                  {{ fileIcon }}
                  <div class="preview-text">Preview for {{ file.name }}</div>
                </div>
              </div>
              <div v-else class="no-preview">
                <div class="no-preview-icon">{{ fileIcon }}</div>
                <p>No preview available for this file type</p>
              </div>
            </div>
          </div>
        </div>
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
            <strong>{{ file?.name }}</strong>?
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
.file-detail-view {
  width: 100%;
  height: 100%;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.loading-spinner {
  color: #6c757d;
  font-size: 1rem;
}

.not-found {
  text-align: center;
  padding: 3rem;
}

.back-btn {
  padding: 0.75rem 1.25rem;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  color: #495057;
}

.file-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.file-header {
  margin-bottom: 1.5rem;
}

.file-details-section {
  flex: 1;
}

.file-primary-info {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.file-icon-large {
  font-size: 3.5rem;
  margin-right: 1.5rem;
}

.file-name-container {
  flex: 1;
}

.file-title {
  font-size: 1.75rem;
  margin: 0 0 1rem 0;
  word-break: break-word;
}

.file-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  color: #495057;
  font-weight: 500;
  cursor: pointer;
}

.action-btn:hover {
  background-color: #e9ecef;
}

.action-icon {
  margin-right: 0.5rem;
}

.delete-btn {
  color: #e74c3c;
  border-color: #e74c3c;
}

.delete-btn:hover {
  background-color: #fadbd8;
}

.details-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.metadata-section, .preview-section {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.metadata-section h3, .preview-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.metadata-table {
  width: 100%;
  border-collapse: collapse;
}

.metadata-table th, .metadata-table td {
  padding: 0.75rem 0;
  border-bottom: 1px solid #dee2e6;
}

.metadata-table th {
  font-weight: 500;
  color: #6c757d;
  text-align: left;
  width: 40%;
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  min-height: 16rem;
  border: 1px solid #dee2e6;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 3rem;
}

.preview-text {
  font-size: 1rem;
  color: #6c757d;
  margin-top: 1rem;
}

.no-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6c757d;
}

.no-preview-icon {
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
  .details-container {
    grid-template-columns: 1fr;
  }
  
  .metadata-section {
    margin-bottom: 1.5rem;
  }
  
  .file-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
  
  .modal-container {
    width: 95%;
  }
}
</style>