<script setup>
import { ref, computed } from 'vue'

// Mock data for demo
const allNotes = ref([
  { id: 1, title: 'Project Meeting Notes', content: 'Discussed new features for Q4. Team members present: Alice, Bob, Charlie.\n\nAction items:\n- Alice will research competitive products\n- Bob will start on UI design\n- Charlie will update the backend\n\nNext meeting scheduled for March 12th.', date: '2025-03-05', tags: ['Work', 'Meetings'], pinned: true, folder: 'Work' },
  { id: 2, title: 'Grocery List', content: '# Shopping List\n\n- Milk\n- Eggs\n- Bread\n- Apples\n- Bananas\n- Chicken\n- Rice\n- Pasta\n- Tomato sauce\n- Cheese', date: '2025-03-04', tags: ['Personal', 'Shopping'], pinned: true, folder: 'Personal' },
  { id: 3, title: 'Book Recommendations', content: 'Science fiction titles to read:\n\n1. Project Hail Mary by Andy Weir\n2. The Three-Body Problem by Liu Cixin\n3. Leviathan Wakes by James S.A. Corey\n4. Hyperion by Dan Simmons\n5. Dune by Frank Herbert', date: '2025-03-02', tags: ['Books', 'Personal'], pinned: false, folder: 'Personal' },
  { id: 4, title: 'Fitness Plan', content: '# Weekly Workout Plan\n\n## Monday: Upper Body\n- Bench press: 3 sets x 10 reps\n- Pull-ups: 3 sets x 8 reps\n- Shoulder press: 3 sets x 12 reps\n\n## Tuesday: Cardio\n- 30 minutes jogging\n- 15 minutes HIIT\n\n## Wednesday: Rest\n\n## Thursday: Lower Body\n- Squats: 3 sets x 12 reps\n- Deadlifts: 3 sets x 8 reps\n- Lunges: 3 sets x 10 reps per leg\n\n## Friday: Core & Cardio\n- Planks: 3 sets x 60 seconds\n- Russian twists: 3 sets x 20 reps\n- 20 minutes cycling', date: '2025-02-28', tags: ['Health', 'Personal'], pinned: false, folder: 'Personal' },
  { id: 5, title: 'Travel Ideas', content: '# Summer Vacation Ideas\n\n## Beach Destinations\n- Maui, Hawaii\n- Santorini, Greece\n- Bali, Indonesia\n\n## Mountain Retreats\n- Banff, Canada\n- Swiss Alps\n- Patagonia, Argentina\n\n## City Breaks\n- Tokyo, Japan\n- Barcelona, Spain\n- Copenhagen, Denmark\n\n## Budget options:\n- Thailand\n- Portugal\n- Mexico', date: '2025-02-25', tags: ['Travel', 'Personal'], pinned: false, folder: 'Personal' },
  { id: 6, title: 'Weekly Team Updates', content: 'Progress on different project milestones. Backend API is 75% complete. Frontend work is starting next week.', date: '2025-03-01', tags: ['Work', 'Updates'], pinned: false, folder: 'Work' },
  { id: 7, title: 'Research Notes: AI', content: 'Latest developments in machine learning and artificial intelligence technologies. Need to follow up on new transformer models.', date: '2025-02-20', tags: ['Research', 'Technology'], pinned: false, folder: 'Research' },
  { id: 8, title: 'Birthday Gift Ideas', content: 'Gift options for upcoming celebrations. Consider books, tech gadgets, or experience gifts like concert tickets.', date: '2025-02-18', tags: ['Personal', 'Shopping'], pinned: false, folder: 'Personal' }
])

// Search state
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const advancedFiltersVisible = ref(false)

// Advanced filters
const dateRangeStart = ref('')
const dateRangeEnd = ref('')
const selectedTags = ref([])
const selectedFolders = ref([])
const contentOnly = ref(false)
const caseInsensitive = ref(true)

// Available tags and folders for filter selection
const allTags = computed(() => {
  const tagSet = new Set(allNotes.value.flatMap(note => note.tags))
  return Array.from(tagSet)
})

const allFolders = computed(() => {
  const folderSet = new Set(allNotes.value.map(note => note.folder))
  return Array.from(folderSet)
})

// Recent searches (in a real app, this would persist)
const recentSearches = ref(['meeting notes', 'shopping list', 'workout plan', 'travel ideas'])

// Search functions
const performSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  
  isSearching.value = true
  
  // Simulate delay for searching
  setTimeout(() => {
    const query = caseInsensitive.value ? searchQuery.value.toLowerCase() : searchQuery.value
    
    searchResults.value = allNotes.value.filter(note => {
      // Apply date range filter
      if (dateRangeStart.value && new Date(note.date) < new Date(dateRangeStart.value)) {
        return false
      }
      if (dateRangeEnd.value && new Date(note.date) > new Date(dateRangeEnd.value)) {
        return false
      }
      
      // Apply tag filter
      if (selectedTags.value.length > 0 && !selectedTags.value.some(tag => note.tags.includes(tag))) {
        return false
      }
      
      // Apply folder filter
      if (selectedFolders.value.length > 0 && !selectedFolders.value.includes(note.folder)) {
        return false
      }
      
      // Search in title or content
      const title = caseInsensitive.value ? note.title.toLowerCase() : note.title
      const content = caseInsensitive.value ? note.content.toLowerCase() : note.content
      
      if (contentOnly.value) {
        return content.includes(query)
      } else {
        return title.includes(query) || content.includes(query)
      }
    }).map(note => {
      // For each matched note, add highlighted excerpts
      const content = caseInsensitive.value ? note.content.toLowerCase() : note.content
      const query = caseInsensitive.value ? searchQuery.value.toLowerCase() : searchQuery.value
      
      let excerptIndex = content.indexOf(query)
      let excerpt = ''
      
      if (excerptIndex >= 0) {
        // Create a context excerpt around the match
        const startIndex = Math.max(0, excerptIndex - 50)
        const endIndex = Math.min(content.length, excerptIndex + query.length + 50)
        excerpt = (startIndex > 0 ? '...' : '') +
                 note.content.substring(startIndex, endIndex) +
                 (endIndex < content.length ? '...' : '')
      }
      
      return {
        ...note,
        excerpt
      }
    })
    
    // Add to recent searches if it's a new search
    if (searchQuery.value.trim() && !recentSearches.value.includes(searchQuery.value)) {
      recentSearches.value.unshift(searchQuery.value)
      if (recentSearches.value.length > 5) {
        recentSearches.value.pop()
      }
    }
    
    isSearching.value = false
  }, 300) // Simulated search delay
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

const clearFilters = () => {
  dateRangeStart.value = ''
  dateRangeEnd.value = ''
  selectedTags.value = []
  selectedFolders.value = []
  contentOnly.value = false
  caseInsensitive.value = true
}

const useRecentSearch = (search) => {
  searchQuery.value = search
  performSearch()
}

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

const toggleFolder = (folder) => {
  const index = selectedFolders.value.indexOf(folder)
  if (index === -1) {
    selectedFolders.value.push(folder)
  } else {
    selectedFolders.value.splice(index, 1)
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(date)
}

// Highlight matched text in the excerpt
const highlightMatches = (excerpt, query) => {
  if (!query || !excerpt) return excerpt
  
  const searchTerm = caseInsensitive.value ? query.toLowerCase() : query
  const regex = new RegExp(searchTerm, caseInsensitive.value ? 'gi' : 'g')
  
  return excerpt.replace(regex, match => `<mark>${match}</mark>`)
}
</script>

<template>
  <div class="search-view-container">
    <h1 class="view-title">Search</h1>
    
    <!-- Search Bar -->
    <div class="search-container">
      <div class="search-input-group">
        <input 
          type="text" 
          v-model="searchQuery" 
          @keyup.enter="performSearch" 
          placeholder="Search your notes..." 
          class="search-input"
          v-voix="'Search Input'"
          hint="Type your search query here and press enter">
        <button 
          v-if="searchQuery" 
          @click="clearSearch" 
          class="clear-search-button"
          v-voix="'Clear Search'"
          hint="Clear the search field">
          ×
        </button>
        <button 
          @click="performSearch" 
          class="search-button"
          v-voix="'Search Button'"
          hint="Execute the search">
          <span class="search-icon">🔍</span>
        </button>
      </div>
      
      <button 
        @click="advancedFiltersVisible = !advancedFiltersVisible" 
        class="advanced-search-toggle"
        v-voix="'Toggle Advanced Filters'"
        hint="Show or hide advanced search options">
        {{ advancedFiltersVisible ? 'Hide Filters' : 'Advanced Filters' }}
      </button>
    </div>
    
    <!-- Advanced Filters -->
    <div v-if="advancedFiltersVisible" class="advanced-filters">
      <div class="filter-row">
        <div class="filter-group">
          <label 
            for="date-start" 
            class="filter-label"
            v-voix="'Date Range Start'">
            From Date:
          </label>
          <input 
            type="date" 
            id="date-start" 
            v-model="dateRangeStart" 
            class="date-input"
            v-voix="'From Date Input'"
            hint="Select the earliest date to include in results">
        </div>
        
        <div class="filter-group">
          <label 
            for="date-end" 
            class="filter-label"
            v-voix="'Date Range End'">
            To Date:
          </label>
          <input 
            type="date" 
            id="date-end" 
            v-model="dateRangeEnd" 
            class="date-input"
            v-voix="'To Date Input'"
            hint="Select the latest date to include in results">
        </div>
      </div>
      
      <div class="filter-row tags-filter">
        <div class="filter-label" v-voix="'Tags Filter'">Tags:</div>
        <div class="tags-list">
          <button 
            v-for="tag in allTags" 
            :key="tag"
            :class="{ active: selectedTags.includes(tag) }"
            @click="toggleTag(tag)"
            class="tag-button"
            v-voix="'Tag: ' + tag"
            hint="Toggle this tag filter">
            {{ tag }}
          </button>
        </div>
      </div>
      
      <div class="filter-row folders-filter">
        <div class="filter-label" v-voix="'Folders Filter'">Folders:</div>
        <div class="folders-list">
          <button 
            v-for="folder in allFolders" 
            :key="folder"
            :class="{ active: selectedFolders.includes(folder) }"
            @click="toggleFolder(folder)"
            class="folder-button"
            v-voix="'Folder: ' + folder"
            hint="Toggle this folder filter">
            {{ folder }}
          </button>
        </div>
      </div>
      
      <div class="filter-row options-filter">
        <div class="filter-group">
          <input 
            type="checkbox" 
            id="content-only" 
            v-model="contentOnly"
            v-voix="'Content Only Checkbox'"
            hint="Check to search only within note content, not titles">
          <label for="content-only" class="checkbox-label">Search in content only</label>
        </div>
        
        <div class="filter-group">
          <input 
            type="checkbox" 
            id="case-insensitive" 
            v-model="caseInsensitive"
            v-voix="'Case Insensitive Checkbox'"
            hint="Check to ignore case when searching">
          <label for="case-insensitive" class="checkbox-label">Case insensitive</label>
        </div>
      </div>
      
      <div class="filter-actions">
        <button 
          @click="clearFilters" 
          class="clear-filters-button"
          v-voix="'Clear Filters'"
          hint="Reset all search filters">
          Clear Filters
        </button>
        <button 
          @click="performSearch" 
          class="apply-filters-button"
          v-voix="'Apply Filters'"
          hint="Execute search with current filters">
          Apply Filters
        </button>
      </div>
    </div>
    
    <!-- Recent Searches -->
    <div v-if="!searchQuery && !searchResults.length" class="recent-searches">
      <h2 class="section-title" v-voix="'Recent Searches'">Recent Searches</h2>
      <ul class="recent-list">
        <li 
          v-for="(search, index) in recentSearches" 
          :key="index" 
          @click="useRecentSearch(search)"
          v-voix="'Recent Search: ' + search"
          hint="Click to use this search term">
          <span class="recent-icon">🕒</span>
          <span class="recent-term">{{ search }}</span>
        </li>
      </ul>
    </div>
    
    <!-- Search Results -->
    <div v-if="isSearching" class="search-results-loading" v-voix="'Searching'">
      Searching...
    </div>
    
    <div v-else-if="searchResults.length > 0" class="search-results">
      <h2 class="section-title" v-voix="'Search Results'">{{ searchResults.length }} Results Found</h2>
      
      <div 
        v-for="result in searchResults" 
        :key="result.id" 
        class="search-result-item"
        @click="$router.push(`/notes/${result.id}`)"
        v-voix="'Search Result: ' + result.title"
        hint="Click to open this note">
        <div class="result-header">
          <h3 class="result-title">{{ result.title }}</h3>
          <div class="result-metadata">
            <span class="result-folder">{{ result.folder }}</span>
            <span class="result-date">{{ formatDate(result.date) }}</span>
          </div>
        </div>
        
        <div 
          v-if="result.excerpt" 
          class="result-excerpt" 
          v-html="highlightMatches(result.excerpt, searchQuery)"></div>
        
        <div class="result-tags">
          <span 
            v-for="tag in result.tags" 
            :key="tag" 
            class="result-tag"
            v-voix="'Tag: ' + tag">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
    
    <div v-else-if="searchQuery && !isSearching" class="no-results" v-voix="'No Results'">
      <p>No results found for "{{ searchQuery }}"</p>
      <button 
        @click="clearFilters" 
        class="clear-filters-button"
        v-voix="'Clear Search Filters'"
        hint="Reset all search filters">
        Clear Filters
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-view-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.view-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

/* Search Bar Styles */
.search-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.search-input-group {
  position: relative;
  display: flex;
  width: 100%;
}

.search-input {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
}

.clear-search-button {
  position: absolute;
  right: 3.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--color-text-light);
  cursor: pointer;
}

.search-button {
  width: 3rem;
  background-color: #4169E1;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon {
  font-size: 1.25rem;
}

.advanced-search-toggle {
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 0.9rem;
  color: var(--color-text);
  cursor: pointer;
  text-decoration: underline;
}

/* Advanced Filters Styles */
.advanced-filters {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.filter-row {
  display: flex;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 500;
  margin-right: 0.5rem;
  min-width: 80px;
}

.date-input {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
}

.tags-filter, .folders-filter {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tags-list, .folders-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-button, .folder-button {
  background-color: var(--color-background-mute);
  border: none;
  border-radius: 12px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.tag-button:hover, .folder-button:hover {
  background-color: var(--color-background);
}

.tag-button.active, .folder-button.active {
  background-color: #4169E1;
  color: white;
}

.options-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.checkbox-label {
  cursor: pointer;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.5rem;
}

.clear-filters-button {
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text);
  cursor: pointer;
}

.apply-filters-button {
  padding: 0.5rem 1rem;
  background-color: #4169E1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Recent Searches Styles */
.recent-searches {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.recent-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recent-list li {
  padding: 0.75rem;
  background-color: var(--color-background-soft);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: background-color 0.2s ease;
}

.recent-list li:hover {
  background-color: var(--color-background-mute);
}

.recent-icon {
  font-size: 1.2rem;
}

/* Search Results Styles */
.search-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-result-item {
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.search-result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.result-title {
  font-size: 1.1rem;
  margin: 0;
  color: var(--color-heading);
}

.result-metadata {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.result-folder {
  background-color: var(--color-background-mute);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.result-excerpt {
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.result-excerpt :deep(mark) {
  background-color: rgba(65, 105, 225, 0.2);
  color: var(--color-text);
  padding: 0.1rem 0;
}

.result-tags {
  display: flex;
  gap: 0.5rem;
}

.result-tag {
  font-size: 0.75rem;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  padding: 0.2rem 0.4rem;
  border-radius: 12px;
}

.search-results-loading, .no-results {
  padding: 2rem;
  text-align: center;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  margin-top: 1rem;
}

.no-results p {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .result-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .result-metadata {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>