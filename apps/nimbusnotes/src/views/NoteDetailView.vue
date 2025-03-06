<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Mock data for demo
const allNotes = ref([
  { id: 1, title: 'Project Meeting Notes', content: 'Discussed new features for Q4. Team members present: Alice, Bob, Charlie.\n\nAction items:\n- Alice will research competitive products\n- Bob will start on UI design\n- Charlie will update the backend\n\nNext meeting scheduled for March 12th.', date: '2025-03-05', tags: ['Work', 'Meetings'], pinned: true, folder: 'Work' },
  { id: 2, title: 'Grocery List', content: '# Shopping List\n\n- Milk\n- Eggs\n- Bread\n- Apples\n- Bananas\n- Chicken\n- Rice\n- Pasta\n- Tomato sauce\n- Cheese', date: '2025-03-04', tags: ['Personal', 'Shopping'], pinned: true, folder: 'Personal' },
  { id: 3, title: 'Book Recommendations', content: 'Science fiction titles to read:\n\n1. Project Hail Mary by Andy Weir\n2. The Three-Body Problem by Liu Cixin\n3. Leviathan Wakes by James S.A. Corey\n4. Hyperion by Dan Simmons\n5. Dune by Frank Herbert', date: '2025-03-02', tags: ['Books', 'Personal'], pinned: false, folder: 'Personal' },
  { id: 4, title: 'Fitness Plan', content: '# Weekly Workout Plan\n\n## Monday: Upper Body\n- Bench press: 3 sets x 10 reps\n- Pull-ups: 3 sets x 8 reps\n- Shoulder press: 3 sets x 12 reps\n\n## Tuesday: Cardio\n- 30 minutes jogging\n- 15 minutes HIIT\n\n## Wednesday: Rest\n\n## Thursday: Lower Body\n- Squats: 3 sets x 12 reps\n- Deadlifts: 3 sets x 8 reps\n- Lunges: 3 sets x 10 reps per leg\n\n## Friday: Core & Cardio\n- Planks: 3 sets x 60 seconds\n- Russian twists: 3 sets x 20 reps\n- 20 minutes cycling', date: '2025-02-28', tags: ['Health', 'Personal'], pinned: false, folder: 'Personal' },
  { id: 5, title: 'Travel Ideas', content: '# Summer Vacation Ideas\n\n## Beach Destinations\n- Maui, Hawaii\n- Santorini, Greece\n- Bali, Indonesia\n\n## Mountain Retreats\n- Banff, Canada\n- Swiss Alps\n- Patagonia, Argentina\n\n## City Breaks\n- Tokyo, Japan\n- Barcelona, Spain\n- Copenhagen, Denmark\n\n## Budget options:\n- Thailand\n- Portugal\n- Mexico', date: '2025-02-25', tags: ['Travel', 'Personal'], pinned: false, folder: 'Personal' }
])

// Available tags and folders for the dropdown
const allTags = ref(['Work', 'Meetings', 'Personal', 'Shopping', 'Books', 'Health', 'Travel', 'Research', 'Technology', 'Updates'])
const allFolders = ref(['Work', 'Personal', 'Research', 'Archive', 'Ideas'])

// Note being edited
const currentNote = ref({
  id: null,
  title: '',
  content: '',
  date: new Date().toISOString().split('T')[0],
  tags: [],
  pinned: false,
  folder: 'Personal'
})

// UI state
const isNewNote = computed(() => route.params.id === 'new')
const isEditing = ref(true)
const showTagsDropdown = ref(false)
const showFoldersDropdown = ref(false)
const newTagInput = ref('')

// Init component
onMounted(() => {
  if (isNewNote.value) {
    // Creating a new note
    currentNote.value = {
      id: Date.now(),
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      tags: [],
      pinned: false,
      folder: 'Personal'
    }
    isEditing.value = true
  } else {
    // Find existing note
    const noteId = parseInt(route.params.id)
    const foundNote = allNotes.value.find(note => note.id === noteId)
    
    if (foundNote) {
      currentNote.value = { ...foundNote }
      isEditing.value = false
    } else {
      // Note not found, redirect to notes list
      router.push('/notes')
    }
  }
})

// Functions
const toggleEditMode = () => {
  isEditing.value = !isEditing.value
}

const saveNote = () => {
  // In a real app, this would save to a store or API
  const noteIndex = allNotes.value.findIndex(note => note.id === currentNote.value.id)
  
  if (noteIndex >= 0) {
    // Update existing note
    allNotes.value[noteIndex] = { ...currentNote.value }
  } else {
    // Add new note
    allNotes.value.push({ ...currentNote.value })
  }
  
  isEditing.value = false
  
  // Redirect to notes list if it's a new note
  if (isNewNote.value) {
    router.push('/notes')
  }
}

const deleteNote = () => {
  if (confirm('Are you sure you want to delete this note?')) {
    // In a real app, this would call an API
    const noteIndex = allNotes.value.findIndex(note => note.id === currentNote.value.id)
    if (noteIndex >= 0) {
      allNotes.value.splice(noteIndex, 1)
    }
    router.push('/notes')
  }
}

const togglePinned = () => {
  currentNote.value.pinned = !currentNote.value.pinned
}

const addTag = () => {
  if (newTagInput.value.trim() && !currentNote.value.tags.includes(newTagInput.value.trim())) {
    currentNote.value.tags.push(newTagInput.value.trim())
    // Add to all tags if it's a new tag
    if (!allTags.value.includes(newTagInput.value.trim())) {
      allTags.value.push(newTagInput.value.trim())
    }
    newTagInput.value = ''
  }
  showTagsDropdown.value = false
}

const selectExistingTag = (tag) => {
  if (!currentNote.value.tags.includes(tag)) {
    currentNote.value.tags.push(tag)
  }
  showTagsDropdown.value = false
}

const removeTag = (index) => {
  currentNote.value.tags.splice(index, 1)
}

const selectFolder = (folder) => {
  currentNote.value.folder = folder
  showFoldersDropdown.value = false
}
</script>

<template>
  <div class="note-detail-container">
    <!-- Header with actions -->
    <header class="note-header">
      <div class="left-actions">
        <button 
          @click="$router.push('/notes')" 
          class="back-button"
          v-voix="'Back to Notes'"
          hint="Return to the notes list">
          ← Back
        </button>
      </div>
      
      <div class="right-actions">
        <button 
          v-if="!isNewNote" 
          @click="togglePinned" 
          class="action-button pin-button"
          :class="{ active: currentNote.pinned }"
          v-voix="currentNote.pinned ? 'Unpin Note' : 'Pin Note'"
          hint="Toggle pinning this note to dashboard">
          📌 {{ currentNote.pinned ? 'Pinned' : 'Pin' }}
        </button>
        
        <button 
          v-if="!isEditing" 
          @click="toggleEditMode" 
          class="action-button edit-button"
          v-voix="'Edit Note'"
          hint="Enter editing mode">
          ✏️ Edit
        </button>
        
        <button 
          v-if="isEditing" 
          @click="saveNote" 
          class="action-button save-button"
          v-voix="'Save Note'"
          hint="Save your changes">
          💾 Save
        </button>
        
        <button 
          v-if="!isNewNote" 
          @click="deleteNote" 
          class="action-button delete-button"
          v-voix="'Delete Note'"
          hint="Delete this note permanently">
          🗑️ Delete
        </button>
      </div>
    </header>
    
    <!-- Note Content -->
    <div class="note-content">
      <!-- Title -->
      <div class="title-container">
        <input 
          v-if="isEditing" 
          v-model="currentNote.title" 
          placeholder="Note title" 
          class="note-title-input"
          v-voix="'Note Title Input'"
          hint="Enter the title for your note">
        <h1 v-else class="note-title">{{ currentNote.title || 'Untitled Note' }}</h1>
      </div>
      
      <!-- Tags and Folder -->
      <div class="metadata-container">
        <div class="tags-section">
          <div class="tags-list">
            <div 
              v-for="(tag, index) in currentNote.tags" 
              :key="index" 
              class="tag-item"
              v-voix="'Tag: ' + tag">
              <span>{{ tag }}</span>
              <button 
                v-if="isEditing" 
                @click="removeTag(index)" 
                class="remove-tag"
                v-voix="'Remove Tag ' + tag"
                hint="Remove this tag from the note">
                ×
              </button>
            </div>
            
            <div v-if="isEditing" class="add-tag-container">
              <button 
                @click="showTagsDropdown = !showTagsDropdown" 
                class="add-tag-button"
                v-voix="'Add Tag'"
                hint="Add a new tag to this note">
                + Add Tag
              </button>
              
              <div v-if="showTagsDropdown" class="tags-dropdown">
                <div class="create-tag">
                  <input 
                    v-model="newTagInput" 
                    placeholder="New tag name" 
                    class="new-tag-input"
                    @keyup.enter="addTag"
                    v-voix="'New Tag Input'"
                    hint="Type a new tag name and press enter">
                  <button 
                    @click="addTag" 
                    class="create-tag-button"
                    v-voix="'Add New Tag'"
                    hint="Add this new tag">
                    +
                  </button>
                </div>
                
                <div class="existing-tags">
                  <div 
                    v-for="tag in allTags.filter(t => !currentNote.tags.includes(t))" 
                    :key="tag"
                    @click="selectExistingTag(tag)"
                    class="existing-tag"
                    v-voix="'Existing Tag: ' + tag"
                    hint="Click to add this tag">
                    {{ tag }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="folder-section">
          <div v-if="isEditing" class="folder-dropdown-container">
            <button 
              @click="showFoldersDropdown = !showFoldersDropdown" 
              class="folder-button"
              v-voix="'Select Folder'"
              hint="Change the folder for this note">
              📁 {{ currentNote.folder }}
            </button>
            
            <div v-if="showFoldersDropdown" class="folders-dropdown">
              <div 
                v-for="folder in allFolders" 
                :key="folder"
                @click="selectFolder(folder)"
                class="folder-option"
                :class="{ active: currentNote.folder === folder }"
                v-voix="'Folder: ' + folder"
                hint="Select this folder">
                {{ folder }}
              </div>
            </div>
          </div>
          <div v-else class="folder-display" v-voix="'Folder: ' + currentNote.folder">
            📁 {{ currentNote.folder }}
          </div>
        </div>
      </div>
      
      <!-- Note Content Editor -->
      <div class="content-editor">
        <textarea 
          v-if="isEditing" 
          v-model="currentNote.content" 
          placeholder="Write your note here..." 
          class="note-content-textarea"
          v-voix="'Note Content Editor'"
          hint="Type the content of your note here"></textarea>
        <div 
          v-else 
          class="note-content-display"
          v-voix="'Note Content'">
          <p v-for="(paragraph, index) in currentNote.content.split('\n')" 
             :key="index" 
             class="content-paragraph"
             v-voix="'Paragraph ' + (index + 1)"
             :class="{ 'heading': paragraph.startsWith('# '), 
                      'subheading': paragraph.startsWith('## '), 
                      'list-item': paragraph.startsWith('- ') || paragraph.startsWith('* ') || /^\d+\./.test(paragraph) }">
            {{ paragraph.replace(/^# /, '')
                      .replace(/^## /, '')
                      .replace(/^- /, '')
                      .replace(/^\* /, '')
                      .replace(/^\d+\. /, '') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-detail-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header Styles */
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.left-actions, .right-actions {
  display: flex;
  gap: 0.75rem;
}

.back-button {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
}

.back-button:hover {
  background-color: var(--color-background-mute);
}

.action-button {
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: var(--color-background-mute);
}

.pin-button.active {
  background-color: #4169E1;
  color: white;
  border-color: #4169E1;
}

.edit-button:hover {
  border-color: #4169E1;
  color: #4169E1;
}

.save-button {
  background-color: #4169E1;
  color: white;
  border-color: #4169E1;
}

.save-button:hover {
  background-color: #3451B2;
}

.delete-button:hover {
  background-color: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}

/* Note Content Styles */
.note-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.title-container {
  margin-bottom: 0.5rem;
}

.note-title-input {
  width: 100%;
  padding: 0.75rem 0;
  font-size: 1.8rem;
  font-weight: 600;
  border: none;
  border-bottom: 1px dashed var(--color-border);
  background-color: transparent;
  color: var(--color-heading);
  outline: none;
}

.note-title-input:focus {
  border-bottom: 1px solid var(--color-heading);
}

.note-title {
  font-size: 1.8rem;
  color: var(--color-heading);
  margin: 0;
  padding: 0.75rem 0;
}

/* Metadata Styles */
.metadata-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.tags-section {
  flex-grow: 1;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.tag-item {
  background-color: var(--color-background-mute);
  color: var(--color-text);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.remove-tag {
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 12px;
}

.remove-tag:hover {
  color: var(--color-text);
}

.add-tag-container {
  position: relative;
}

.add-tag-button {
  background: none;
  border: 1px dashed var(--color-border);
  color: var(--color-text-light);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  cursor: pointer;
}

.add-tag-button:hover {
  color: var(--color-text);
  border-color: var(--color-text);
}

.tags-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 0.5rem;
}

.create-tag {
  display: flex;
  padding: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.new-tag-input {
  flex-grow: 1;
  border: none;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  background-color: var(--color-background-soft);
  border-radius: 4px;
}

.create-tag-button {
  background-color: #4169E1;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  cursor: pointer;
}

.existing-tags {
  max-height: 150px;
  overflow-y: auto;
  padding: 0.5rem;
}

.existing-tag {
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.9rem;
}

.existing-tag:hover {
  background-color: var(--color-background-mute);
}

.folder-section {
  position: relative;
}

.folder-button {
  background: none;
  border: 1px solid var(--color-border);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.folder-button:hover {
  background-color: var(--color-background-mute);
}

.folders-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 150px;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 0.5rem;
}

.folder-option {
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.9rem;
}

.folder-option:hover {
  background-color: var(--color-background-mute);
}

.folder-option.active {
  background-color: var(--color-background-mute);
  font-weight: 600;
}

.folder-display {
  font-size: 0.9rem;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Content Editor Styles */
.content-editor {
  flex-grow: 1;
  margin-top: 1rem;
}

.note-content-textarea {
  width: 100%;
  min-height: 400px;
  padding: 1rem;
  font-size: 1rem;
  line-height: 1.6;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  resize: vertical;
  font-family: inherit;
}

.note-content-display {
  padding: 1rem;
  min-height: 400px;
  line-height: 1.6;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
}

.content-paragraph {
  margin-bottom: 1rem;
}

.content-paragraph.heading {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.content-paragraph.subheading {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 1.2rem;
  margin-bottom: 0.8rem;
  color: var(--color-heading);
}

.content-paragraph.list-item {
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
}

.content-paragraph.list-item::before {
  content: "•";
  position: absolute;
  left: 0;
}

@media (max-width: 768px) {
  .note-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .right-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .metadata-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .folder-section {
    align-self: flex-start;
  }
}
</style>