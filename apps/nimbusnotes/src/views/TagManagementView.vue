<script setup>
import { ref, computed } from 'vue'

// Mock data for demo
const allNotes = ref([
  { id: 1, title: 'Project Meeting Notes', content: 'Discussed new features for Q4...', date: '2025-03-05', tags: ['Work', 'Meetings'], pinned: true, folder: 'Work' },
  { id: 2, title: 'Grocery List', content: 'Milk, eggs, bread, fruits...', date: '2025-03-04', tags: ['Personal', 'Shopping'], pinned: true, folder: 'Personal' },
  { id: 3, title: 'Book Recommendations', content: 'Science fiction titles to read next...', date: '2025-03-02', tags: ['Books', 'Personal'], pinned: false, folder: 'Personal' },
  { id: 4, title: 'Fitness Plan', content: 'Monday: upper body, Tuesday: cardio...', date: '2025-02-28', tags: ['Health', 'Personal'], pinned: false, folder: 'Personal' },
  { id: 5, title: 'Travel Ideas', content: 'Potential destinations for summer vacation...', date: '2025-02-25', tags: ['Travel', 'Personal'], pinned: false, folder: 'Personal' },
  { id: 6, title: 'Weekly Team Updates', content: 'Progress on different project milestones...', date: '2025-03-01', tags: ['Work', 'Updates'], pinned: false, folder: 'Work' },
  { id: 7, title: 'Research Notes: AI', content: 'Latest developments in machine learning...', date: '2025-02-20', tags: ['Research', 'Technology'], pinned: false, folder: 'Research' },
  { id: 8, title: 'Birthday Gift Ideas', content: 'Gift options for upcoming celebrations...', date: '2025-02-18', tags: ['Personal', 'Shopping'], pinned: false, folder: 'Personal' }
])

// Tag management state
const searchQuery = ref('')
const newTagName = ref('')
const newTagColor = ref('#4169E1')
const editingTag = ref(null)
const showConfirmDelete = ref(false)
const tagToDelete = ref(null)

// Available colors for tag customization
const availableColors = [
  { name: 'Blue', value: '#4169E1' },
  { name: 'Green', value: '#3CB371' },
  { name: 'Purple', value: '#9370DB' },
  { name: 'Red', value: '#E74C3C' },
  { name: 'Orange', value: '#FF9800' },
  { name: 'Teal', value: '#008080' },
  { name: 'Pink', value: '#FF69B4' },
  { name: 'Yellow', value: '#FFD700' }
]

// Tag data with counts and metadata
const tagData = ref([
  { name: 'Work', notes: 2, color: '#4169E1' },
  { name: 'Meetings', notes: 1, color: '#9370DB' },
  { name: 'Personal', notes: 5, color: '#3CB371' },
  { name: 'Shopping', notes: 2, color: '#FF9800' },
  { name: 'Books', notes: 1, color: '#FF69B4' },
  { name: 'Health', notes: 1, color: '#008080' },
  { name: 'Travel', notes: 1, color: '#FFD700' },
  { name: 'Research', notes: 1, color: '#E74C3C' },
  { name: 'Technology', notes: 1, color: '#4169E1' },
  { name: 'Updates', notes: 1, color: '#3CB371' }
])

// Computed tags filtered by search query
const filteredTags = computed(() => {
  if (!searchQuery.value) {
    return tagData.value
  }
  return tagData.value.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Computed to check if tag name already exists
const tagNameExists = computed(() => {
  if (!newTagName.value) return false
  
  const existingTag = tagData.value.find(tag => 
    tag.name.toLowerCase() === newTagName.value.toLowerCase() &&
    (!editingTag.value || tag.name !== editingTag.value.name)
  )
  
  return !!existingTag
})

// Functions
const addNewTag = () => {
  if (!newTagName.value.trim() || tagNameExists.value) return
  
  tagData.value.push({
    name: newTagName.value.trim(),
    notes: 0,
    color: newTagColor.value
  })
  
  newTagName.value = ''
  newTagColor.value = '#4169E1'
}

const startEditTag = (tag) => {
  editingTag.value = { ...tag }
  newTagName.value = tag.name
  newTagColor.value = tag.color
}

const saveTagEdit = () => {
  if (!newTagName.value.trim() || tagNameExists.value) return
  
  const tagIndex = tagData.value.findIndex(tag => tag.name === editingTag.value.name)
  if (tagIndex !== -1) {
    // Update tag in the tags list
    tagData.value[tagIndex].name = newTagName.value.trim()
    tagData.value[tagIndex].color = newTagColor.value
    
    // Update all notes with this tag (in a real app, this would be handled more efficiently)
    allNotes.value.forEach(note => {
      const tagIndex = note.tags.indexOf(editingTag.value.name)
      if (tagIndex !== -1) {
        note.tags[tagIndex] = newTagName.value.trim()
      }
    })
  }
  
  cancelEdit()
}

const cancelEdit = () => {
  editingTag.value = null
  newTagName.value = ''
  newTagColor.value = '#4169E1'
}

const confirmDeleteTag = (tag) => {
  tagToDelete.value = tag
  showConfirmDelete.value = true
}

const deleteTag = () => {
  if (!tagToDelete.value) return
  
  // Remove tag from the tags list
  const tagIndex = tagData.value.findIndex(tag => tag.name === tagToDelete.value.name)
  if (tagIndex !== -1) {
    tagData.value.splice(tagIndex, 1)
  }
  
  // Remove tag from all notes (in a real app, this would be handled more efficiently)
  allNotes.value.forEach(note => {
    note.tags = note.tags.filter(tag => tag !== tagToDelete.value.name)
  })
  
  showConfirmDelete.value = false
  tagToDelete.value = null
}

const cancelDelete = () => {
  showConfirmDelete.value = false
  tagToDelete.value = null
}

const viewNotesWithTag = (tag) => {
  // In a real app, this would navigate to a filtered notes list
  console.log(`View notes with tag: ${tag.name}`)
}
</script>

<template>
  <div class="tags-management-container">
    <h1 class="view-title">Tag Management</h1>
    
    <!-- Search and Create Tag -->
    <div class="actions-row">
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search tags..." 
          class="search-input"
          v-voix="'Search Tags'"
          hint="Type to filter tags by name">
      </div>
      
      <div class="create-tag-container" :class="{ editing: editingTag }">
        <h2 class="section-title" v-voix="editingTag ? 'Edit Tag' : 'Create New Tag'">
          {{ editingTag ? 'Edit Tag' : 'Create New Tag' }}
        </h2>
        
        <div class="create-tag-form">
          <div class="form-group">
            <label for="tag-name" v-voix="'Tag Name'">Tag Name:</label>
            <input 
              type="text" 
              id="tag-name" 
              v-model="newTagName" 
              placeholder="Enter tag name" 
              class="tag-name-input"
              v-voix="'Tag Name Input'"
              hint="Type the name for your tag">
            <span v-if="tagNameExists" class="validation-error">This tag name already exists</span>
          </div>
          
          <div class="form-group">
            <label for="tag-color" v-voix="'Tag Color'">Tag Color:</label>
            <div class="color-selector">
              <div 
                v-for="color in availableColors" 
                :key="color.value"
                class="color-option"
                :class="{ active: newTagColor === color.value }"
                :style="{ backgroundColor: color.value }"
                @click="newTagColor = color.value"
                v-voix="'Color: ' + color.name"
                hint="Select this color for the tag">
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button 
              v-if="editingTag" 
              @click="cancelEdit" 
              class="cancel-button"
              v-voix="'Cancel Edit'"
              hint="Cancel tag editing">
              Cancel
            </button>
            <button 
              v-if="editingTag" 
              @click="saveTagEdit" 
              class="save-button"
              :disabled="!newTagName.trim() || tagNameExists"
              v-voix="'Save Tag'"
              hint="Save the edited tag">
              Save Changes
            </button>
            <button 
              v-else 
              @click="addNewTag" 
              class="add-button"
              :disabled="!newTagName.trim() || tagNameExists"
              v-voix="'Add Tag'"
              hint="Create a new tag with these settings">
              Add Tag
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tags List -->
    <div class="tags-list-container">
      <h2 class="section-title" v-voix="'All Tags'">All Tags</h2>
      
      <div class="tags-list">
        <div 
          v-for="tag in filteredTags" 
          :key="tag.name" 
          class="tag-item"
          v-voix="'Tag: ' + tag.name + ' with ' + tag.notes + ' notes'">
          <div class="tag-content">
            <div class="tag-color" :style="{ backgroundColor: tag.color }"></div>
            <div class="tag-info">
              <div class="tag-name">{{ tag.name }}</div>
              <div class="tag-count">{{ tag.notes }} note{{ tag.notes !== 1 ? 's' : '' }}</div>
            </div>
          </div>
          
          <div class="tag-actions">
            <button 
              @click="viewNotesWithTag(tag)" 
              class="action-button view-button"
              v-voix="'View Notes With Tag ' + tag.name"
              hint="View all notes with this tag">
              Notes
            </button>
            <button 
              @click="startEditTag(tag)" 
              class="action-button edit-button"
              v-voix="'Edit Tag ' + tag.name"
              hint="Edit this tag's name or color">
              Edit
            </button>
            <button 
              @click="confirmDeleteTag(tag)" 
              class="action-button delete-button"
              v-voix="'Delete Tag ' + tag.name"
              hint="Delete this tag">
              Delete
            </button>
          </div>
        </div>
        
        <div v-if="filteredTags.length === 0" class="empty-state">
          No tags found. Create a new tag to get started.
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Dialog -->
    <div v-if="showConfirmDelete" class="confirm-delete-dialog">
      <div class="dialog-content">
        <h3 v-voix="'Confirm Delete'">Confirm Delete</h3>
        <p>
          Are you sure you want to delete the tag "{{ tagToDelete?.name }}"?<br>
          This will remove the tag from {{ tagToDelete?.notes }} note{{ tagToDelete?.notes !== 1 ? 's' : '' }}.
        </p>
        <div class="dialog-actions">
          <button 
            @click="cancelDelete" 
            class="cancel-button"
            v-voix="'Cancel Delete'"
            hint="Cancel tag deletion">
            Cancel
          </button>
          <button 
            @click="deleteTag" 
            class="confirm-button"
            v-voix="'Confirm Delete'"
            hint="Confirm tag deletion">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tags-management-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
}

.view-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

/* Actions Row Styles */
.actions-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.search-container {
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
}

/* Create Tag Styles */
.create-tag-container {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
}

.create-tag-container.editing {
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
}

.section-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.create-tag-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
}

.tag-name-input {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
}

.validation-error {
  color: #E74C3C;
  font-size: 0.85rem;
}

.color-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 2px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: var(--color-text);
  transform: scale(1.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.5rem;
}

.cancel-button, .add-button, .save-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-button {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.add-button, .save-button {
  background-color: #4169E1;
  color: white;
  border: none;
}

.add-button:disabled, .save-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Tags List Styles */
.tags-list-container {
  margin-top: 2rem;
}

.tags-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tag-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tag-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tag-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tag-color {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.tag-info {
  display: flex;
  flex-direction: column;
}

.tag-name {
  font-weight: 500;
  font-size: 1rem;
}

.tag-count {
  font-size: 0.85rem;
  color: var(--color-text-light);
}

.tag-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  border: 1px solid var(--color-border);
  background: none;
}

.view-button {
  color: #4169E1;
  border-color: #4169E1;
}

.edit-button {
  color: #3CB371;
  border-color: #3CB371;
}

.delete-button {
  color: #E74C3C;
  border-color: #E74C3C;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  color: var(--color-text-light);
  font-style: italic;
}

/* Confirm Dialog Styles */
.confirm-delete-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.dialog-content {
  background-color: var(--color-background);
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.dialog-content h3 {
  margin-top: 0;
  color: var(--color-heading);
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.dialog-actions button {
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.dialog-actions .cancel-button {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.dialog-actions .confirm-button {
  background-color: #E74C3C;
  color: white;
  border: none;
}

@media (max-width: 768px) {
  .actions-row {
    grid-template-columns: 1fr;
  }
  
  .tag-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .tag-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>