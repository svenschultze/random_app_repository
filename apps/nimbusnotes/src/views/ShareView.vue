<script setup>
import { ref, computed } from 'vue'

// Mock data for demo
const allNotes = ref([
  { id: 1, title: 'Project Meeting Notes', content: 'Discussed new features for Q4...', date: '2025-03-05', tags: ['Work', 'Meetings'], pinned: true, folder: 'Work', shared: true, collaborators: ['alice@example.com', 'bob@example.com'] },
  { id: 2, title: 'Grocery List', content: 'Milk, eggs, bread, fruits...', date: '2025-03-04', tags: ['Personal', 'Shopping'], pinned: true, folder: 'Personal', shared: false, collaborators: [] },
  { id: 3, title: 'Book Recommendations', content: 'Science fiction titles to read next...', date: '2025-03-02', tags: ['Books', 'Personal'], pinned: false, folder: 'Personal', shared: true, collaborators: ['charlie@example.com'] },
  { id: 4, title: 'Fitness Plan', content: 'Monday: upper body, Tuesday: cardio...', date: '2025-02-28', tags: ['Health', 'Personal'], pinned: false, folder: 'Personal', shared: false, collaborators: [] },
  { id: 5, title: 'Travel Ideas', content: 'Potential destinations for summer vacation...', date: '2025-02-25', tags: ['Travel', 'Personal'], pinned: false, folder: 'Personal', shared: false, collaborators: [] }
])

// Mock users for demo
const contacts = ref([
  { email: 'alice@example.com', name: 'Alice Johnson', avatar: '👩' },
  { email: 'bob@example.com', name: 'Bob Smith', avatar: '👨' },
  { email: 'charlie@example.com', name: 'Charlie Davis', avatar: '🧑' },
  { email: 'diana@example.com', name: 'Diana Wilson', avatar: '👩‍🦰' },
  { email: 'evan@example.com', name: 'Evan Brown', avatar: '👨‍🦱' }
])

// UI state
const selectedNoteId = ref(null)
const shareModalOpen = ref(false)
const sharingEmail = ref('')
const sharingPermission = ref('view') // view or edit
const showSharedOnly = ref(false)
const searchQuery = ref('')

// Computed properties
const selectedNote = computed(() => {
  if (!selectedNoteId.value) return null
  return allNotes.value.find(note => note.id === selectedNoteId.value)
})

const filteredNotes = computed(() => {
  let filtered = [...allNotes.value]
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query)
    )
  }
  
  // Filter by shared status if needed
  if (showSharedOnly.value) {
    filtered = filtered.filter(note => note.shared)
  }
  
  return filtered
})

// Get collaborator details by email
const getCollaboratorDetails = (email) => {
  return contacts.value.find(contact => contact.email === email) || { email, name: email, avatar: '👤' }
}

// Share functions
const openShareModal = (noteId) => {
  selectedNoteId.value = noteId
  shareModalOpen.value = true
}

const closeShareModal = () => {
  shareModalOpen.value = false
  sharingEmail.value = ''
  sharingPermission.value = 'view'
}

const addCollaborator = () => {
  if (!sharingEmail.value.trim() || !selectedNoteId.value) return
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(sharingEmail.value.trim())) {
    alert('Please enter a valid email address')
    return
  }
  
  const noteIndex = allNotes.value.findIndex(note => note.id === selectedNoteId.value)
  if (noteIndex === -1) return
  
  // Check if already a collaborator
  if (allNotes.value[noteIndex].collaborators.includes(sharingEmail.value.trim())) {
    alert('This person is already a collaborator')
    return
  }
  
  // Add collaborator
  allNotes.value[noteIndex].collaborators.push(sharingEmail.value.trim())
  allNotes.value[noteIndex].shared = true
  
  // Reset form
  sharingEmail.value = ''
}

const removeCollaborator = (noteId, email) => {
  const noteIndex = allNotes.value.findIndex(note => note.id === noteId)
  if (noteIndex === -1) return
  
  // Remove collaborator
  allNotes.value[noteIndex].collaborators = allNotes.value[noteIndex].collaborators.filter(e => e !== email)
  
  // If no more collaborators, set shared to false
  if (allNotes.value[noteIndex].collaborators.length === 0) {
    allNotes.value[noteIndex].shared = false
  }
}

const generateShareLink = (noteId) => {
  // This would generate a real sharing link in a real app
  return `https://nimbusnotes.app/shared/${noteId}?token=abc123`
}

const copyShareLink = (noteId) => {
  const link = generateShareLink(noteId)
  // In a real app, this would use the clipboard API
  console.log('Copied link:', link)
  alert('Share link copied to clipboard!')
}
</script>

<template>
  <div class="share-view-container">
    <h1 class="view-title">Share & Collaborate</h1>
    
    <!-- Filters & Search -->
    <div class="filters-row">
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search notes..." 
          class="search-input"
          v-voix="'Search Notes'"
          hint="Type to search through your notes">
      </div>
      
      <div class="filter-options">
        <label class="filter-label" v-voix="'Show Shared Notes Only'">
          <input 
            type="checkbox" 
            v-model="showSharedOnly"
            v-voix="'Show Shared Only Checkbox'"
            hint="Check to only show notes you've shared with others">
          Show shared notes only
        </label>
      </div>
    </div>
    
    <!-- Notes Grid -->
    <div class="notes-grid">
      <div 
        v-for="note in filteredNotes" 
        :key="note.id"
        class="note-card"
        :class="{ 'shared-note': note.shared }"
        v-voix="'Note: ' + note.title + (note.shared ? ', Shared' : '')">
        <div class="note-header">
          <h3 class="note-title">{{ note.title }}</h3>
          <div class="note-badges">
            <span v-if="note.shared" class="shared-badge" title="Shared">👥</span>
          </div>
        </div>
        
        <p class="note-preview">{{ note.content.substring(0, 100) }}{{ note.content.length > 100 ? '...' : '' }}</p>
        
        <div class="collaborators-section" v-if="note.shared && note.collaborators.length > 0">
          <h4 class="collaborators-title" v-voix="'Collaborators'">Collaborators:</h4>
          <div class="collaborators-list">
            <div 
              v-for="email in note.collaborators" 
              :key="email" 
              class="collaborator-item"
              v-voix="'Collaborator: ' + getCollaboratorDetails(email).name">
              <span class="collaborator-avatar">{{ getCollaboratorDetails(email).avatar }}</span>
              <span class="collaborator-name">{{ getCollaboratorDetails(email).name }}</span>
              <button 
                @click="removeCollaborator(note.id, email)" 
                class="remove-collaborator"
                v-voix="'Remove Collaborator'"
                hint="Remove this person from the shared note">
                ×
              </button>
            </div>
          </div>
        </div>
        
        <div class="note-actions">
          <button 
            @click="openShareModal(note.id)" 
            class="share-button"
            v-voix="'Share Note'"
            hint="Share this note with others">
            {{ note.shared ? 'Manage Sharing' : 'Share' }}
          </button>
          <button 
            v-if="note.shared" 
            @click="copyShareLink(note.id)" 
            class="copy-link-button"
            v-voix="'Copy Share Link'"
            hint="Copy a shareable link to this note">
            Copy Link
          </button>
          <button 
            @click="$router.push(`/notes/${note.id}`)" 
            class="view-button"
            v-voix="'View Note'"
            hint="Open this note for viewing or editing">
            View
          </button>
        </div>
      </div>
      
      <div v-if="filteredNotes.length === 0" class="empty-state">
        <p v-if="showSharedOnly">You don't have any shared notes yet.</p>
        <p v-else-if="searchQuery">No notes match your search criteria.</p>
        <p v-else>You don't have any notes to share. Create a note first.</p>
        <button 
          @click="$router.push('/notes/new')" 
          class="new-note-button"
          v-voix="'Create New Note'"
          hint="Create a new note that you can share">
          Create a Note
        </button>
      </div>
    </div>
    
    <!-- Share Modal -->
    <div v-if="shareModalOpen && selectedNote" class="share-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 v-voix="'Share Note: ' + selectedNote.title">Share "{{ selectedNote.title }}"</h2>
          <button 
            @click="closeShareModal" 
            class="close-modal"
            v-voix="'Close Share Dialog'"
            hint="Close this sharing dialog">
            ×
          </button>
        </div>
        
        <div class="modal-body">
          <div class="sharing-form">
            <div class="form-group">
              <label for="sharing-email" v-voix="'Email Address'">Email address:</label>
              <input 
                type="email" 
                id="sharing-email" 
                v-model="sharingEmail" 
                placeholder="example@email.com" 
                class="sharing-input"
                v-voix="'Email Input'"
                hint="Enter the email address of the person to share with">
            </div>
            
            <div class="form-group">
              <label for="sharing-permission" v-voix="'Permission Level'">Permission:</label>
              <select 
                id="sharing-permission" 
                v-model="sharingPermission"
                class="permission-select"
                v-voix="'Permission Select'"
                hint="Choose what the recipient can do with this note">
                <option value="view">Can view</option>
                <option value="edit">Can edit</option>
              </select>
            </div>
            
            <button 
              @click="addCollaborator" 
              class="add-collaborator-button"
              :disabled="!sharingEmail.trim()"
              v-voix="'Add Collaborator'"
              hint="Share this note with the entered email address">
              Share
            </button>
          </div>
          
          <div class="sharing-link-section">
            <h3 v-voix="'Get Shareable Link'">Get a shareable link:</h3>
            <div class="sharing-link-container">
              <input 
                type="text" 
                :value="generateShareLink(selectedNote.id)" 
                readonly 
                class="sharing-link-input"
                v-voix="'Shareable Link'"
                hint="Copy this link to share with others">
              <button 
                @click="copyShareLink(selectedNote.id)" 
                class="copy-link-button"
                v-voix="'Copy Link'"
                hint="Copy this shareable link to your clipboard">
                Copy
              </button>
            </div>
          </div>
          
          <div v-if="selectedNote.collaborators.length > 0" class="current-collaborators">
            <h3 v-voix="'Current Collaborators'">Current collaborators:</h3>
            <ul class="collaborators-list">
              <li 
                v-for="email in selectedNote.collaborators" 
                :key="email"
                class="collaborator-item"
                v-voix="'Collaborator: ' + getCollaboratorDetails(email).name">
                <div class="collaborator-info">
                  <span class="collaborator-avatar">{{ getCollaboratorDetails(email).avatar }}</span>
                  <div class="collaborator-details">
                    <div class="collaborator-name">{{ getCollaboratorDetails(email).name }}</div>
                    <div class="collaborator-email">{{ email }}</div>
                  </div>
                </div>
                <button 
                  @click="removeCollaborator(selectedNote.id, email)" 
                  class="remove-button"
                  v-voix="'Remove Access'"
                  hint="Remove this person's access to the note">
                  Remove
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.share-view-container {
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

/* Filters Row */
.filters-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-container {
  flex-grow: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
}

.filter-options {
  display: flex;
  align-items: center;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

/* Notes Grid */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.note-card {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.note-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.note-card.shared-note {
  border-left: 4px solid #4169E1;
}

.note-card.shared-note::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 40px 40px 0;
  border-color: transparent #4169E1 transparent transparent;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.note-title {
  font-size: 1.1rem;
  margin: 0;
  color: var(--color-heading);
  font-weight: 600;
  flex-grow: 1;
}

.note-badges {
  display: flex;
  gap: 0.5rem;
}

.shared-badge {
  font-size: 1.2rem;
}

.note-preview {
  font-size: 0.9rem;
  color: var(--color-text);
  margin-bottom: 1rem;
  flex-grow: 1;
}

/* Collaborators Section */
.collaborators-section {
  margin-top: auto;
  margin-bottom: 1rem;
}

.collaborators-title {
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  color: var(--color-text-light);
}

.collaborators-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.collaborator-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-background-mute);
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.collaborator-avatar {
  font-size: 1rem;
}

.remove-collaborator {
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Note Actions */
.note-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.share-button, .copy-link-button, .view-button {
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  flex: 1;
  text-align: center;
}

.share-button {
  background-color: #4169E1;
  color: white;
  border: none;
}

.copy-link-button {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.view-button {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
}

.empty-state p {
  margin-bottom: 1.5rem;
  color: var(--color-text-light);
}

.new-note-button {
  padding: 0.75rem 1.5rem;
  background-color: #4169E1;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

/* Share Modal */
.share-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--color-background);
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1.5rem;
  background-color: var(--color-background-soft);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--color-heading);
}

.close-modal {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

/* Sharing Form */
.sharing-form {
  margin-bottom: 2rem;
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

.sharing-input, .permission-select {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  font-size: 0.9rem;
}

.add-collaborator-button {
  padding: 0.75rem;
  background-color: #4169E1;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
}

.add-collaborator-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Sharing Link Section */
.sharing-link-section {
  margin-bottom: 2rem;
}

.sharing-link-section h3 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: var(--color-heading);
}

.sharing-link-container {
  display: flex;
  gap: 0.5rem;
}

.sharing-link-input {
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background-mute);
  font-size: 0.9rem;
  color: var(--color-text-light);
}

/* Current Collaborators */
.current-collaborators h3 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: var(--color-heading);
}

.current-collaborators ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.current-collaborators li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--color-background-soft);
  border-radius: 4px;
}

.collaborator-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.collaborator-details {
  display: flex;
  flex-direction: column;
}

.collaborator-name {
  font-weight: 500;
}

.collaborator-email {
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.remove-button {
  padding: 0.25rem 0.5rem;
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: #E74C3C;
  cursor: pointer;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .notes-grid {
    grid-template-columns: 1fr;
  }
  
  .note-actions {
    flex-direction: column;
  }
  
  .sharing-link-container {
    flex-direction: column;
  }
}
</style>