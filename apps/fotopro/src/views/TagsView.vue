<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePhotoStore } from '@/stores/photoStore'

const router = useRouter()
const route = useRoute()
const photoStore = usePhotoStore()

// State
const selectedTagId = ref(route.params.id || null)
const showCreateModal = ref(false)
const newTagName = ref('')
const editingTagId = ref(null)
const editingTagName = ref('')

// Computed
const tags = computed(() => photoStore.tags)

const selectedTag = computed(() => {
  if (!selectedTagId.value) return null
  return tags.value.find(tag => tag.id === selectedTagId.value)
})

const taggedPhotos = computed(() => {
  if (!selectedTagId.value) return []
  return photoStore.photosByTag(selectedTagId.value)
})

// Methods
function selectTag(tagId) {
  selectedTagId.value = tagId
  router.push({ name: 'tags', params: { id: tagId } })
}

function openCreateModal() {
  showCreateModal.value = true
  newTagName.value = ''
}

function closeCreateModal() {
  showCreateModal.value = false
}

function createTag() {
  if (newTagName.value.trim()) {
    const tagId = photoStore.addTag(newTagName.value.trim())
    closeCreateModal()
    selectTag(tagId)
  }
}

function startEditingTag(tag) {
  editingTagId.value = tag.id
  editingTagName.value = tag.name
}

function saveTagEdit() {
  if (editingTagName.value.trim() && editingTagId.value) {
    photoStore.updateTag(editingTagId.value, editingTagName.value.trim())
    cancelTagEdit()
  }
}

function cancelTagEdit() {
  editingTagId.value = null
  editingTagName.value = ''
}

function deleteTag(tagId) {
  if (confirm('Are you sure you want to delete this tag? The tag will be removed from all photos.')) {
    photoStore.deleteTag(tagId)
    if (selectedTagId.value === tagId) {
      selectedTagId.value = null
      router.push({ name: 'tags' })
    }
  }
}

function viewPhoto(photoId) {
  photoStore.selectPhoto(photoId)
  router.push({ name: 'editor', params: { id: photoId } })
}

function removeTagFromPhoto(photoId) {
  photoStore.removeTagFromPhoto(photoId, selectedTagId.value)
}
</script>

<template>
  <div class="tags-view">
    <div class="tags-sidebar">
      <div class="tags-header">
        <h2 v-voix="'tags-heading'">Tags</h2>
        <button 
          @click="openCreateModal" 
          class="action-button primary small"
          v-voix="'create-tag-button'"
          hint="Create a new tag">
          + New Tag
        </button>
      </div>
      
      <div class="tags-list">
        <div 
          v-for="tag in tags" 
          :key="tag.id" 
          class="tag-item"
          :class="{ active: selectedTagId === tag.id }"
          @click="selectTag(tag.id)"
          v-voix="'tag-item-' + tag.id"
          :hint="`Tag: ${tag.name} with ${photoStore.photosByTag(tag.id).length} photos. Click to view tagged photos`">
          
          <div v-if="editingTagId === tag.id" class="edit-tag-form" @click.stop>
            <input 
              v-model="editingTagName" 
              type="text" 
              @keyup.enter="saveTagEdit"
              v-voix="'edit-tag-input-' + tag.id"
              :hint="`Type a new name for tag: ${tag.name}`">
            
            <div class="edit-actions">
              <button 
                @click="saveTagEdit" 
                class="action-button primary small"
                v-voix="'save-tag-name-button-' + tag.id"
                hint="Save the new tag name">
                Save
              </button>
              
              <button 
                @click="cancelTagEdit" 
                class="action-button small"
                v-voix="'cancel-tag-edit-button-' + tag.id"
                hint="Cancel editing the tag name">
                Cancel
              </button>
            </div>
          </div>
          
          <template v-else>
            <span class="tag-name">{{ tag.name }}</span>
            <span class="tag-count">{{ photoStore.photosByTag(tag.id).length }}</span>
            
            <div class="tag-actions" @click.stop>
              <button 
                @click="startEditingTag(tag)" 
                class="icon-button"
                v-voix="'edit-tag-button-' + tag.id"
                :hint="`Rename tag: ${tag.name}`">
                ✏️
              </button>
              
              <button 
                @click="deleteTag(tag.id)" 
                class="icon-button"
                v-voix="'delete-tag-button-' + tag.id"
                :hint="`Delete tag: ${tag.name}. This will remove the tag from all photos.`">
                🗑️
              </button>
            </div>
          </template>
        </div>
        
        <p v-if="tags.length === 0" class="no-tags-message">
          No tags yet. Create your first tag to categorize your photos.
        </p>
      </div>
    </div>
    
    <div class="tag-content">
      <div v-if="selectedTag" class="tag-details">
        <h1 v-voix="'selected-tag-heading'">{{ selectedTag.name }}</h1>
        
        <div class="photo-grid">
          <div 
            v-for="photo in taggedPhotos" 
            :key="photo.id" 
            class="photo-item"
            @click="viewPhoto(photo.id)"
            v-voix="'tagged-photo-item-' + photo.id"
            :hint="`Photo: ${photo.name}. Click to open in editor`">
            <img :src="photo.src" :alt="photo.name" />
            
            <div class="photo-info">
              <div class="photo-name">{{ photo.name }}</div>
              
              <button 
                @click.stop="removeTagFromPhoto(photo.id)" 
                class="icon-button"
                v-voix="'remove-tag-button-' + photo.id"
                :hint="`Remove tag ${selectedTag ? selectedTag.name : ''} from photo ${photo.name}`">
                ❌
              </button>
            </div>
          </div>
          
          <p v-if="taggedPhotos.length === 0" class="no-photos-message">
            No photos with this tag yet. Add this tag to photos from the Library view.
          </p>
        </div>
      </div>
      
      <div v-else class="no-selection">
        <p>Select a tag from the sidebar or create a new one.</p>
      </div>
    </div>
    
    <!-- Create Tag Modal -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal-content">
        <h2 v-voix="'create-tag-heading'">Create New Tag</h2>
        
        <div class="form-group">
          <label v-voix="'tag-name-label'">Tag Name</label>
          <input 
            v-model="newTagName" 
            type="text" 
            placeholder="Enter tag name"
            v-voix="'tag-name-input'"
            hint="Type a name for your new tag">
        </div>
        
        <div class="modal-actions">
          <button 
            @click="closeCreateModal" 
            class="action-button"
            v-voix="'cancel-create-tag-button'"
            hint="Cancel creating a new tag">
            Cancel
          </button>
          
          <button 
            @click="createTag" 
            class="action-button primary"
            :disabled="!newTagName.trim()"
            v-voix="'create-tag-confirm-button'"
            hint="Create the new tag with the specified name">
            Create Tag
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tags-view {
  display: flex;
  height: calc(100vh - 100px);
}

.tags-sidebar {
  width: 260px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.tags-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.tags-header h2 {
  margin: 0;
}

.tags-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.tag-item {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-item:hover {
  background: #e0e0e0;
}

.tag-item.active {
  background: #2196F3;
  color: white;
}

.tag-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag-count {
  background: rgba(0,0,0,0.1);
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 0.8em;
  margin-left: 8px;
}

.tag-actions {
  display: flex;
  gap: 5px;
  margin-left: 10px;
  opacity: 0.6;
}

.tag-item:hover .tag-actions {
  opacity: 1;
}

.edit-tag-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-tag-form input {
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

.tag-content {
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

.no-tags-message,
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