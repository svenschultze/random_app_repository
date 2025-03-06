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

const folders = computed(() => {
  const folderSet = new Set(allNotes.value.map(note => note.folder))
  return ['All', ...Array.from(folderSet)]
})

const tags = computed(() => {
  const tagSet = new Set(allNotes.value.flatMap(note => note.tags))
  return Array.from(tagSet)
})

// UI state
const selectedFolder = ref('All')
const selectedTags = ref([])
const sortOption = ref('date')
const searchQuery = ref('')

// Computed filtered notes
const filteredNotes = computed(() => {
  return allNotes.value.filter(note => {
    // Folder filter
    if (selectedFolder.value !== 'All' && note.folder !== selectedFolder.value) {
      return false
    }
    
    // Tag filter
    if (selectedTags.value.length > 0 && !selectedTags.value.some(tag => note.tags.includes(tag))) {
      return false
    }
    
    // Search filter
    if (searchQuery.value && !(
      note.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      note.content.toLowerCase().includes(searchQuery.value.toLowerCase())
    )) {
      return false
    }
    
    return true
  })
})

// Computed sorted notes
const sortedNotes = computed(() => {
  return [...filteredNotes.value].sort((a, b) => {
    if (sortOption.value === 'date') {
      return new Date(b.date) - new Date(a.date)
    } else if (sortOption.value === 'title') {
      return a.title.localeCompare(b.title)
    } else if (sortOption.value === 'pinned') {
      return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)
    }
    return 0
  })
})

const toggleTag = (tag) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
}

const clearFilters = () => {
  selectedFolder.value = 'All'
  selectedTags.value = []
  searchQuery.value = ''
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(date)
}
</script>

<template>
  <div class="notes-list-container">
    <h1 class="view-title">Notes</h1>
    
    <div class="notes-list-layout">
      <!-- Sidebar Filters -->
      <aside class="filter-sidebar">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search notes..." 
            class="search-input"
            v-voix="'Search Notes'"
            hint="Type to search through your notes by title or content">
        </div>
        
        <div class="filter-section">
          <h3 class="filter-title">Folders</h3>
          <ul class="filter-list">
            <li 
              v-for="folder in folders" 
              :key="folder"
              :class="{ active: selectedFolder === folder }"
              @click="selectedFolder = folder"
              v-voix="'Folder: ' + folder"
              hint="Click to filter notes by this folder">
              <span class="folder-icon">📁</span> {{ folder }}
            </li>
          </ul>
        </div>
        
        <div class="filter-section">
          <h3 class="filter-title">Tags</h3>
          <div class="tags-list">
            <button 
              v-for="tag in tags" 
              :key="tag"
              :class="{ active: selectedTags.includes(tag) }"
              @click="toggleTag(tag)"
              class="tag-button"
              v-voix="'Tag: ' + tag"
              hint="Click to toggle filtering by this tag">
              {{ tag }}
            </button>
          </div>
        </div>
        
        <button 
          class="clear-filters-button" 
          @click="clearFilters"
          v-voix="'Clear All Filters'"
          hint="Click to reset all search filters">
          Clear Filters
        </button>
      </aside>
      
      <!-- Notes List -->
      <div class="notes-content">
        <div class="notes-toolbar">
          <div class="notes-count">{{ sortedNotes.length }} notes</div>
          <div class="sort-options">
            <label for="sort-select" v-voix="'Sort By Options'">Sort by:</label>
            <select 
              id="sort-select" 
              v-model="sortOption"
              v-voix="'Sort Order Selection'"
              hint="Select how to order your notes">
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="pinned">Pinned</option>
            </select>
          </div>
        </div>
        
        <div class="notes-grid">
          <div 
            v-for="note in sortedNotes" 
            :key="note.id"
            class="note-card"
            :class="{ pinned: note.pinned }"
            @click="$router.push(`/notes/${note.id}`)"
            v-voix="'Note: ' + note.title"
            hint="Click to open this note">
            <div class="note-header">
              <h3 class="note-title">{{ note.title }}</h3>
              <div class="note-actions">
                <span v-if="note.pinned" class="pin-icon" title="Pinned">📌</span>
                <span class="note-date">{{ formatDate(note.date) }}</span>
              </div>
            </div>
            <p class="note-preview">{{ note.content }}</p>
            <div class="note-footer">
              <div class="note-folder">{{ note.folder }}</div>
              <div class="note-tags">
                <span 
                  v-for="tag in note.tags.slice(0, 2)" 
                  :key="tag" 
                  class="tag"
                  v-voix="'Tag: ' + tag">
                  {{ tag }}
                </span>
                <span v-if="note.tags.length > 2" class="more-tags">+{{ note.tags.length - 2 }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="sortedNotes.length === 0" class="empty-state">
          <p>No notes found matching your criteria.</p>
          <button 
            @click="clearFilters"
            v-voix="'Clear Filters'"
            hint="Click to reset all search filters">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
    
    <div class="floating-action">
      <button 
        class="new-note-button" 
        @click="$router.push('/notes/new')"
        v-voix="'Create New Note'"
        hint="Click to create a new note">
        <span class="icon">+</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.notes-list-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  height: 100%;
}

.view-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

.notes-list-layout {
  display: flex;
  gap: 1.5rem;
  height: calc(100% - 5rem);
}

/* Sidebar Styles */
.filter-sidebar {
  width: 250px;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-container {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  font-size: 0.9rem;
}

.filter-section {
  margin-bottom: 1.5rem;
}

.filter-title {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: var(--color-heading);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.filter-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.filter-list li {
  padding: 0.5rem 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 4px;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
}

.filter-list li:hover {
  background-color: var(--color-background-mute);
}

.filter-list li.active {
  background-color: var(--color-background-mute);
  font-weight: 600;
}

.folder-icon {
  font-size: 1.2rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-button {
  background-color: var(--color-background-mute);
  border: none;
  border-radius: 12px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.tag-button:hover {
  background-color: var(--color-background);
}

.tag-button.active {
  background-color: #4169E1;
  color: white;
}

.clear-filters-button {
  margin-top: auto;
  padding: 0.5rem;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;
}

.clear-filters-button:hover {
  background-color: var(--color-background-mute);
}

/* Notes Content Styles */
.notes-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.notes-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.notes-count {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-options select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  font-size: 0.9rem;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  overflow-y: auto;
}

.note-card {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  height: 200px;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.note-card.pinned {
  border-left: 4px solid #4169E1;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.note-title {
  font-size: 1rem;
  margin: 0;
  color: var(--color-heading);
  font-weight: 600;
}

.note-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pin-icon {
  font-size: 1rem;
  color: #4169E1;
}

.note-date {
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.note-preview {
  font-size: 0.9rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.note-folder {
  font-size: 0.8rem;
  color: var(--color-text-light);
  background-color: var(--color-background-soft);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.note-tags {
  display: flex;
  gap: 0.25rem;
}

.tag {
  font-size: 0.75rem;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  padding: 0.2rem 0.4rem;
  border-radius: 12px;
}

.more-tags {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.empty-state {
  padding: 2rem;
  text-align: center;
  background-color: var(--color-background-soft);
  border-radius: 8px;
}

.empty-state p {
  margin-bottom: 1rem;
  color: var(--color-text-light);
}

.empty-state button {
  padding: 0.5rem 1rem;
  background-color: var(--color-background-mute);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Floating Action Button */
.floating-action {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
}

.new-note-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #4169E1;
  color: white;
  border: none;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.new-note-button:hover {
  background-color: #3451B2;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .notes-list-layout {
    flex-direction: column;
  }
  
  .filter-sidebar {
    width: 100%;
    height: auto;
  }
  
  .notes-grid {
    grid-template-columns: 1fr;
  }
}
</style>