<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePhotoStore } from '@/stores/photoStore'
import { generateDemoData } from '@/utils/demoPhotos'

const photoStore = usePhotoStore()
const router = useRouter()

// State
const isLoading = ref(false)
const showUploadModal = ref(false)
const searchQuery = ref('')
const filterBy = ref('all')
const sortBy = ref('date-desc')

// Selected photos for batch operations
const selectedPhotoIds = ref([])
const selectMode = ref(false)

// Refs for file input
const fileInput = ref(null)

// Computed
const filteredPhotos = computed(() => {
  let photos = [...photoStore.photos]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    photos = photos.filter(photo => {
      const matchesFileName = photo.name && photo.name.toLowerCase().includes(query)
      const matchesAlbum = photo.albumName && photo.albumName.toLowerCase().includes(query)
      
      // Check if any tags match the query
      const matchesTags = photo.tags.some(tagId => {
        const tag = photoStore.tags.find(t => t.id === tagId)
        return tag && tag.name.toLowerCase().includes(query)
      })
      
      return matchesFileName || matchesAlbum || matchesTags
    })
  }
  
  // Apply category filter
  if (filterBy.value === 'untagged') {
    photos = photos.filter(photo => photo.tags.length === 0)
  } else if (filterBy.value === 'noalbum') {
    photos = photos.filter(photo => !photo.albumId)
  } else if (filterBy.value !== 'all') {
    // Filter by specific album or tag
    const [type, id] = filterBy.value.split(':')
    if (type === 'album') {
      photos = photos.filter(photo => photo.albumId === id)
    } else if (type === 'tag') {
      photos = photos.filter(photo => photo.tags.includes(id))
    }
  }
  
  // Apply sorting
  if (sortBy.value === 'date-desc') {
    photos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortBy.value === 'date-asc') {
    photos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  } else if (sortBy.value === 'name-asc') {
    photos.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'name-desc') {
    photos.sort((a, b) => b.name.localeCompare(a.name))
  }
  
  return photos
})

const isPhotoSelected = computed(() => (photoId) => {
  return selectedPhotoIds.value.includes(photoId)
})

const hasSelectedPhotos = computed(() => {
  return selectedPhotoIds.value.length > 0
})

const albums = computed(() => {
  return photoStore.albums
})

const tags = computed(() => {
  return photoStore.tags
})

// Methods
function handleFileSelect(event) {
  const files = event.target.files
  if (files.length) {
    processFiles(files)
  }
}

function handleDrop(event) {
  event.preventDefault()
  if (event.dataTransfer.files.length) {
    processFiles(event.dataTransfer.files)
  }
}

function processFiles(files) {
  isLoading.value = true
  
  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const photoData = {
          src: e.target.result,
          name: file.name,
          type: file.type,
          size: file.size,
          albumId: null
        }
        
        photoStore.addPhoto(photoData)
      }
      
      reader.readAsDataURL(file)
    }
  })
  
  // Reset the file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  
  isLoading.value = false
  showUploadModal.value = false
}

function allowDrop(event) {
  event.preventDefault()
}

function toggleSelectMode() {
  selectMode.value = !selectMode.value
  if (!selectMode.value) {
    selectedPhotoIds.value = []
  }
}

function togglePhotoSelection(photoId) {
  if (selectMode.value) {
    const index = selectedPhotoIds.value.indexOf(photoId)
    if (index === -1) {
      selectedPhotoIds.value.push(photoId)
    } else {
      selectedPhotoIds.value.splice(index, 1)
    }
  } else {
    photoStore.selectPhoto(photoId)
    router.push({ name: 'editor', params: { id: photoId } })
  }
}

function selectAllPhotos() {
  if (filteredPhotos.value.length === selectedPhotoIds.value.length) {
    // Deselect all
    selectedPhotoIds.value = []
  } else {
    // Select all filtered photos
    selectedPhotoIds.value = filteredPhotos.value.map(photo => photo.id)
  }
}

function deleteSelectedPhotos() {
  if (confirm(`Are you sure you want to delete ${selectedPhotoIds.value.length} photo(s)?`)) {
    selectedPhotoIds.value.forEach(id => {
      photoStore.deletePhoto(id)
    })
    selectedPhotoIds.value = []
  }
}

// Handle album operations for selected photos
function addSelectedToAlbum(albumId) {
  selectedPhotoIds.value.forEach(photoId => {
    photoStore.setPhotoAlbum(photoId, albumId)
  })
}

// Handle tag operations for selected photos
function addTagToSelected(tagId) {
  selectedPhotoIds.value.forEach(photoId => {
    photoStore.addTagToPhoto(photoId, tagId)
  })
}

function removeTagFromSelected(tagId) {
  selectedPhotoIds.value.forEach(photoId => {
    photoStore.removeTagFromPhoto(photoId, tagId)
  })
}

// Creating new albums and tags
function createNewAlbum(name) {
  const albumId = photoStore.addAlbum(name)
  if (hasSelectedPhotos.value) {
    addSelectedToAlbum(albumId)
  }
}

function createNewTag(name) {
  const tagId = photoStore.addTag(name)
  if (hasSelectedPhotos.value) {
    addTagToSelected(tagId)
  }
}

function openUploadModal() {
  showUploadModal.value = true
}

// Initialize the application with demo data
onMounted(async () => {
  // Only load demo photos if there are none already
  if (photoStore.photos.length === 0) {
    isLoading.value = true
    try {
      await generateDemoData(photoStore)
    } catch (error) {
      console.error('Error loading demo photos:', error)
    } finally {
      isLoading.value = false
    }
  }
})
</script>

<template>
  <div class="library-view">
    <div class="toolbar">
      <h1 v-voix="'library-heading'">Photo Library</h1>
      
      <div class="search-filter">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search photos..." 
          v-voix="'search-input'"
          hint="Type to search photos by name, album or tags">
        
        <select 
          v-model="filterBy" 
          v-voix="'filter-select'"
          hint="Filter photos by category">
          <option value="all">All Photos</option>
          <option value="untagged">Untagged</option>
          <option value="noalbum">No Album</option>
          <optgroup label="Albums">
            <option v-for="album in albums" :key="album.id" :value="`album:${album.id}`">
              {{ album.name }}
            </option>
          </optgroup>
          <optgroup label="Tags">
            <option v-for="tag in tags" :key="tag.id" :value="`tag:${tag.id}`">
              {{ tag.name }}
            </option>
          </optgroup>
        </select>
        
        <select 
          v-model="sortBy" 
          v-voix="'sort-select'"
          hint="Sort photos by date or name">
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>
      </div>
      
      <div class="actions">
        <button 
          @click="openUploadModal" 
          class="action-button primary"
          v-voix="'upload-photos-button'"
          hint="Click to add new photos to your library">
          Upload Photos
        </button>
        
        <button 
          @click="toggleSelectMode" 
          class="action-button"
          :class="{ active: selectMode }"
          v-voix="'select-mode-button'"
          hint="Toggle selection mode to select multiple photos">
          {{ selectMode ? 'Exit Selection' : 'Select Multiple' }}
        </button>
        
        <template v-if="selectMode && hasSelectedPhotos">
          <button 
            @click="selectAllPhotos" 
            class="action-button"
            v-voix="'select-all-button'"
            hint="Select all photos currently visible">
            {{ filteredPhotos.length === selectedPhotoIds.length ? 'Deselect All' : 'Select All' }}
          </button>
          
          <button 
            @click="deleteSelectedPhotos" 
            class="action-button danger"
            v-voix="'delete-selected-button'"
            hint="Delete all selected photos">
            Delete Selected
          </button>
          
          <select 
            @change="addSelectedToAlbum($event.target.value)" 
            v-voix="'add-to-album-select'"
            hint="Add selected photos to an album">
            <option value="" disabled selected>Add to Album</option>
            <option v-for="album in albums" :key="album.id" :value="album.id">
              {{ album.name }}
            </option>
            <option value="new">+ Create New Album</option>
          </select>
          
          <select 
            @change="addTagToSelected($event.target.value)" 
            v-voix="'add-tag-select'"
            hint="Add a tag to selected photos">
            <option value="" disabled selected>Add Tag</option>
            <option v-for="tag in tags" :key="tag.id" :value="tag.id">
              {{ tag.name }}
            </option>
            <option value="new">+ Create New Tag</option>
          </select>
        </template>
      </div>
    </div>
    
    <div 
      class="photo-grid" 
      @dragover="allowDrop" 
      @drop="handleDrop">
      <p v-if="filteredPhotos.length === 0 && !isLoading" class="no-photos-message">
        No photos found. Upload some photos to get started.
      </p>
      
      <div 
        v-for="photo in filteredPhotos" 
        :key="photo.id" 
        class="photo-item"
        :class="{ selected: isPhotoSelected(photo.id) }"
        @click="togglePhotoSelection(photo.id)"
        v-voix="'photo-item-' + photo.id"
        :hint="`Photo: ${photo.name}. Click to ${selectMode ? 'select' : 'open in editor'}`">
        <img :src="photo.src" :alt="photo.name" />
        
        <div class="photo-info">
          <div class="photo-name">{{ photo.name }}</div>
          
          <div class="photo-tags" v-if="photo.tags.length > 0">
            <span 
              v-for="tagId in photo.tags" 
              :key="tagId" 
              class="tag">
              {{ photoStore.tags.find(t => t.id === tagId)?.name }}
            </span>
          </div>
        </div>
        
        <div v-if="selectMode" class="select-indicator">
          <input 
            type="checkbox" 
            :checked="isPhotoSelected(photo.id)" 
            @click.stop 
            v-voix="'photo-select-checkbox-' + photo.id"
            :hint="`Checkbox to select photo: ${photo.name}`">
        </div>
      </div>
    </div>
    
    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="modal-overlay">
      <div class="modal-content">
        <h2 v-voix="'upload-photos-heading'">Upload Photos</h2>
        
        <div 
          class="dropzone"
          @dragover="allowDrop"
          @drop="handleDrop">
          <p>Drag and drop photos here or</p>
          <input 
            ref="fileInput"
            type="file" 
            @change="handleFileSelect" 
            multiple 
            accept="image/*"
            v-voix="'file-input'"
            hint="Select photos from your device">
        </div>
        
        <div class="modal-actions">
          <button 
            @click="showUploadModal = false" 
            class="action-button"
            v-voix="'cancel-upload-button'"
            hint="Cancel the upload and close this dialog">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.library-view {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
}

.search-filter {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.search-filter input,
.search-filter select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-filter input {
  flex-grow: 1;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.action-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  cursor: pointer;
}

.action-button.primary {
  background: #4CAF50;
  color: white;
  border-color: #45a049;
}

.action-button.danger {
  background: #f44336;
  color: white;
  border-color: #d32f2f;
}

.action-button.active {
  background: #2196F3;
  color: white;
  border-color: #0b7dda;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  min-height: 300px;
  border: 2px dashed #ccc;
  border-radius: 4px;
}

.photo-item {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.photo-item:hover {
  transform: scale(1.02);
}

.photo-item.selected {
  border: 3px solid #2196F3;
}

.photo-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.photo-info {
  padding: 8px;
  background: #f5f5f5;
}

.photo-name {
  font-weight: bold;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.photo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  font-size: 0.8em;
  padding: 2px 6px;
  background: #e0e0e0;
  border-radius: 10px;
}

.select-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  padding: 5px;
}

.no-photos-message {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #666;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 4px;
  width: 500px;
  max-width: 90%;
}

.dropzone {
  border: 2px dashed #ccc;
  padding: 40px;
  text-align: center;
  margin: 20px 0;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>