<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePhotoStore } from '@/stores/photoStore'

const router = useRouter()
const route = useRoute()
const photoStore = usePhotoStore()

// State
const selectedAlbumId = ref(route.params.id || null)
const showCreateModal = ref(false)
const newAlbumName = ref('')
const editingAlbumId = ref(null)
const editingAlbumName = ref('')

// Computed
const albums = computed(() => photoStore.albums)

const selectedAlbum = computed(() => {
  if (!selectedAlbumId.value) return null
  return albums.value.find(album => album.id === selectedAlbumId.value)
})

const albumPhotos = computed(() => {
  if (!selectedAlbumId.value) return []
  return photoStore.photos.filter(photo => photo.albumId === selectedAlbumId.value)
})

// Methods
function selectAlbum(albumId) {
  selectedAlbumId.value = albumId
  router.push({ name: 'albums', params: { id: albumId } })
}

function openCreateModal() {
  showCreateModal.value = true
  newAlbumName.value = ''
}

function closeCreateModal() {
  showCreateModal.value = false
}

function createAlbum() {
  if (newAlbumName.value.trim()) {
    const albumId = photoStore.addAlbum(newAlbumName.value.trim())
    closeCreateModal()
    selectAlbum(albumId)
  }
}

function startEditingAlbum(album) {
  editingAlbumId.value = album.id
  editingAlbumName.value = album.name
}

function saveAlbumEdit() {
  if (editingAlbumName.value.trim() && editingAlbumId.value) {
    photoStore.updateAlbum(editingAlbumId.value, { name: editingAlbumName.value.trim() })
    cancelAlbumEdit()
  }
}

function cancelAlbumEdit() {
  editingAlbumId.value = null
  editingAlbumName.value = ''
}

function deleteAlbum(albumId) {
  if (confirm('Are you sure you want to delete this album? The photos will not be deleted.')) {
    photoStore.deleteAlbum(albumId)
    if (selectedAlbumId.value === albumId) {
      selectedAlbumId.value = null
      router.push({ name: 'albums' })
    }
  }
}

function viewPhoto(photoId) {
  photoStore.selectPhoto(photoId)
  router.push({ name: 'editor', params: { id: photoId } })
}

function removeFromAlbum(photoId) {
  photoStore.setPhotoAlbum(photoId, null)
}
</script>

<template>
  <div class="albums-view">
    <div class="albums-sidebar">
      <div class="albums-header">
        <h2 v-voix="'albums-heading'">Albums</h2>
        <button 
          @click="openCreateModal" 
          class="action-button primary small"
          v-voix="'create-album-button'"
          hint="Create a new album">
          + New Album
        </button>
      </div>
      
      <div class="albums-list">
        <div 
          v-for="album in albums" 
          :key="album.id" 
          class="album-item"
          :class="{ active: selectedAlbumId === album.id }"
          @click="selectAlbum(album.id)"
          v-voix="'album-item-' + album.id"
          :hint="`Album: ${album.name} with ${photoStore.photosByAlbum(album.id).length} photos. Click to view contents`">
          
          <div v-if="editingAlbumId === album.id" class="edit-album-form" @click.stop>
            <input 
              v-model="editingAlbumName" 
              type="text" 
              @keyup.enter="saveAlbumEdit"
              v-voix="'edit-album-input-' + album.id"
              :hint="`Type a new name for album: ${album.name}`">
            
            <div class="edit-actions">
              <button 
                @click="saveAlbumEdit" 
                class="action-button primary small"
                v-voix="'save-album-name-button-' + album.id"
                hint="Save the new album name">
                Save
              </button>
              
              <button 
                @click="cancelAlbumEdit" 
                class="action-button small"
                v-voix="'cancel-album-edit-button-' + album.id"
                hint="Cancel editing the album name">
                Cancel
              </button>
            </div>
          </div>
          
          <template v-else>
            <span class="album-name">{{ album.name }}</span>
            <span class="album-count">{{ photoStore.photosByAlbum(album.id).length }}</span>
            
            <div class="album-actions" @click.stop>
              <button 
                @click="startEditingAlbum(album)" 
                class="icon-button"
                v-voix="'edit-album-button-' + album.id"
                :hint="`Rename album: ${album.name}`">
                ✏️
              </button>
              
              <button 
                @click="deleteAlbum(album.id)" 
                class="icon-button"
                v-voix="'delete-album-button-' + album.id"
                :hint="`Delete album: ${album.name}. This will not delete the photos inside it.`">
                🗑️
              </button>
            </div>
          </template>
        </div>
        
        <p v-if="albums.length === 0" class="no-albums-message">
          No albums yet. Create your first album to organize your photos.
        </p>
      </div>
    </div>
    
    <div class="album-content">
      <div v-if="selectedAlbum" class="album-details">
        <h1 v-voix="'selected-album-heading'">{{ selectedAlbum.name }}</h1>
        
        <div class="photo-grid">
          <div 
            v-for="photo in albumPhotos" 
            :key="photo.id" 
            class="photo-item"
            @click="viewPhoto(photo.id)"
            v-voix="'album-photo-item-' + photo.id"
            :hint="`Photo: ${photo.name}. Click to open in editor`">
            <img :src="photo.src" :alt="photo.name" />
            
            <div class="photo-info">
              <div class="photo-name">{{ photo.name }}</div>
              
              <button 
                @click.stop="removeFromAlbum(photo.id)" 
                class="icon-button"
                v-voix="'remove-from-album-button-' + photo.id"
                :hint="`Remove photo ${photo.name} from this album`">
                ❌
              </button>
            </div>
          </div>
          
          <p v-if="albumPhotos.length === 0" class="no-photos-message">
            No photos in this album yet. Add photos from the Library view.
          </p>
        </div>
      </div>
      
      <div v-else class="no-selection">
        <p>Select an album from the sidebar or create a new one.</p>
      </div>
    </div>
    
    <!-- Create Album Modal -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal-content">
        <h2 v-voix="'create-album-heading'">Create New Album</h2>
        
        <div class="form-group">
          <label v-voix="'album-name-label'">Album Name</label>
          <input 
            v-model="newAlbumName" 
            type="text" 
            placeholder="Enter album name"
            v-voix="'album-name-input'"
            hint="Type a name for your new album">
        </div>
        
        <div class="modal-actions">
          <button 
            @click="closeCreateModal" 
            class="action-button"
            v-voix="'cancel-create-album-button'"
            hint="Cancel creating a new album">
            Cancel
          </button>
          
          <button 
            @click="createAlbum" 
            class="action-button primary"
            :disabled="!newAlbumName.trim()"
            v-voix="'create-album-confirm-button'"
            hint="Create the new album with the specified name">
            Create Album
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.albums-view {
  display: flex;
  height: calc(100vh - 100px);
}

.albums-sidebar {
  width: 260px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.albums-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.albums-header h2 {
  margin: 0;
}

.albums-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.album-item {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.album-item:hover {
  background: #e0e0e0;
}

.album-item.active {
  background: #2196F3;
  color: white;
}

.album-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-count {
  background: rgba(0,0,0,0.1);
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 0.8em;
  margin-left: 8px;
}

.album-actions {
  display: flex;
  gap: 5px;
  margin-left: 10px;
  opacity: 0.6;
}

.album-item:hover .album-actions {
  opacity: 1;
}

.edit-album-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-album-form input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.edit-actions {
  display: flex;
  gap: 5px;
  justify-content: flex-end;
}

.album-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
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

.photo-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.photo-info {
  padding: 8px;
  background: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.photo-name {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
}

.action-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  cursor: pointer;
}

.action-button.small {
  padding: 4px 8px;
  font-size: 0.9em;
}

.action-button.primary {
  background: #4CAF50;
  color: white;
  border-color: #45a049;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-albums-message,
.no-photos-message {
  text-align: center;
  padding: 20px;
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
  width: 400px;
  max-width: 90%;
}

.form-group {
  margin: 20px 0;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>