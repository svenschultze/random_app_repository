<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Sample user skills data (would come from user profile in a real app)
const userSkills = ref({
  teaching: [
    { id: 1, name: 'JavaScript Programming', level: 'Advanced' },
    { id: 2, name: 'Digital Photography', level: 'Expert' }
  ],
  learning: [
    { id: 1, name: 'Spanish Language', level: 'Beginner' },
    { id: 2, name: 'Guitar', level: 'Intermediate' }
  ]
})

// Sample matches data (would come from an API in a real app)
const matches = ref([
  {
    id: 201,
    name: 'Maria Chen',
    avatar: 'https://randomuser.me/api/portraits/women/49.jpg',
    bio: 'Spanish teacher and cooking enthusiast. Love sharing my language and culture through food and conversation.',
    location: 'San Francisco, CA',
    compatibility: 95,
    canTeachYou: [
      { name: 'Spanish Language', level: 'Expert' },
      { name: 'Cooking', level: 'Advanced' }
    ],
    youCanTeach: [
      { name: 'JavaScript Programming', level: 'Beginner' }
    ],
    commonInterests: ['Photography', 'Travel', 'Technology'],
    availability: {
      days: ['Monday', 'Wednesday', 'Friday'],
      timeOfDay: ['Afternoon', 'Evening']
    },
    preferredSessionType: 'Both online and in-person',
    isNew: true
  },
  {
    id: 202,
    name: 'David Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    bio: 'Professional guitarist and music teacher with 10 years of experience. Looking to improve my photography skills.',
    location: 'Portland, OR',
    compatibility: 87,
    canTeachYou: [
      { name: 'Guitar', level: 'Expert' },
      { name: 'Music Theory', level: 'Advanced' }
    ],
    youCanTeach: [
      { name: 'Digital Photography', level: 'Beginner' }
    ],
    commonInterests: ['Music', 'Art', 'Travel'],
    availability: {
      days: ['Tuesday', 'Thursday', 'Saturday'],
      timeOfDay: ['Morning', 'Evening']
    },
    preferredSessionType: 'Online only',
    isNew: true
  },
  {
    id: 203,
    name: 'Emma Torres',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    bio: 'Bilingual Spanish/English speaker and certified yoga instructor. Tech enthusiast looking to learn coding.',
    location: 'Austin, TX',
    compatibility: 82,
    canTeachYou: [
      { name: 'Spanish Language', level: 'Native' },
      { name: 'Yoga', level: 'Expert' }
    ],
    youCanTeach: [
      { name: 'JavaScript Programming', level: 'Beginner' },
      { name: 'Digital Photography', level: 'Beginner' }
    ],
    commonInterests: ['Technology', 'Health', 'Photography'],
    availability: {
      days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
      timeOfDay: ['Morning', 'Afternoon']
    },
    preferredSessionType: 'Both online and in-person',
    isNew: false
  },
  {
    id: 204,
    name: 'James Lee',
    avatar: 'https://randomuser.me/api/portraits/men/74.jpg',
    bio: 'Software engineer by day, amateur musician by night. Looking to improve my Spanish for an upcoming trip.',
    location: 'New York, NY',
    compatibility: 78,
    canTeachYou: [
      { name: 'Guitar', level: 'Advanced' },
      { name: 'Piano', level: 'Intermediate' }
    ],
    youCanTeach: [
      { name: 'JavaScript Programming', level: 'Beginner' },
      { name: 'Digital Photography', level: 'Intermediate' }
    ],
    commonInterests: ['Technology', 'Music', 'Travel'],
    availability: {
      days: ['Tuesday', 'Thursday', 'Saturday'],
      timeOfDay: ['Evening']
    },
    preferredSessionType: 'Online only',
    isNew: false
  },
  {
    id: 205,
    name: 'Sophie Parker',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    bio: 'Spanish literature professor with a passion for photography. Would love to improve my coding skills.',
    location: 'Chicago, IL',
    compatibility: 75,
    canTeachYou: [
      { name: 'Spanish Language', level: 'Expert' },
      { name: 'Literature', level: 'Expert' }
    ],
    youCanTeach: [
      { name: 'JavaScript Programming', level: 'Beginner' },
      { name: 'Digital Photography', level: 'Intermediate' }
    ],
    commonInterests: ['Photography', 'Books', 'Art'],
    availability: {
      days: ['Monday', 'Wednesday', 'Friday'],
      timeOfDay: ['Afternoon']
    },
    preferredSessionType: 'Both online and in-person',
    isNew: false
  }
])

// Filters
const filters = ref({
  searchTerm: '',
  teachSkill: '',
  learnSkill: '',
  minCompatibility: 0,
  sessionType: 'all', // 'all', 'online', 'in-person'
  sortBy: 'compatibility', // 'compatibility', 'newest'
  showNewOnly: false
})

// Filter matches based on current filters
const filteredMatches = computed(() => {
  let result = [...matches.value]
  
  // Search term filter
  if (filters.value.searchTerm) {
    const term = filters.value.searchTerm.toLowerCase()
    result = result.filter(match => 
      match.name.toLowerCase().includes(term) || 
      match.bio.toLowerCase().includes(term) ||
      match.location.toLowerCase().includes(term) ||
      match.canTeachYou.some(skill => skill.name.toLowerCase().includes(term)) ||
      match.youCanTeach.some(skill => skill.name.toLowerCase().includes(term)) ||
      match.commonInterests.some(interest => interest.toLowerCase().includes(term))
    )
  }
  
  // Teach skill filter
  if (filters.value.teachSkill) {
    result = result.filter(match => 
      match.canTeachYou.some(skill => 
        skill.name.toLowerCase().includes(filters.value.teachSkill.toLowerCase()))
    )
  }
  
  // Learn skill filter
  if (filters.value.learnSkill) {
    result = result.filter(match => 
      match.youCanTeach.some(skill => 
        skill.name.toLowerCase().includes(filters.value.learnSkill.toLowerCase()))
    )
  }
  
  // Compatibility filter
  if (filters.value.minCompatibility > 0) {
    result = result.filter(match => 
      match.compatibility >= filters.value.minCompatibility
    )
  }
  
  // Session type filter
  if (filters.value.sessionType !== 'all') {
    const typeFilter = filters.value.sessionType === 'online' ? 'Online only' : 'In-person only'
    result = result.filter(match => 
      match.preferredSessionType.includes(typeFilter) || 
      match.preferredSessionType.includes('Both')
    )
  }
  
  // New matches only filter
  if (filters.value.showNewOnly) {
    result = result.filter(match => match.isNew)
  }
  
  // Sort results
  if (filters.value.sortBy === 'compatibility') {
    result.sort((a, b) => b.compatibility - a.compatibility)
  } else if (filters.value.sortBy === 'newest') {
    result.sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1)
  }
  
  return result
})

// UI state
const selectedMatch = ref(null)
const isMatchDetailsOpen = ref(false)

const viewMatchDetails = (match) => {
  selectedMatch.value = match
  isMatchDetailsOpen.value = true
}

const closeMatchDetails = () => {
  isMatchDetailsOpen.value = false
}

const sendMessage = (matchId) => {
  // In a real app, this would navigate to the messages view with this match selected
  router.push('/messages')
}

const viewProfile = (matchId) => {
  // In a real app, this would navigate to the profile view for this match
  router.push('/profile')
}

const resetFilters = () => {
  filters.value = {
    searchTerm: '',
    teachSkill: '',
    learnSkill: '',
    minCompatibility: 0,
    sessionType: 'all',
    sortBy: 'compatibility',
    showNewOnly: false
  }
}

// Additional computed properties for UI
const matchesCount = computed(() => filteredMatches.value.length)
const hasActiveFilters = computed(() => {
  return filters.value.searchTerm ||
    filters.value.teachSkill ||
    filters.value.learnSkill ||
    filters.value.minCompatibility > 0 ||
    filters.value.sessionType !== 'all' ||
    filters.value.showNewOnly
})

// Animation flags
const isLoading = ref(true)

onMounted(() => {
  // Simulate API loading
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<template>
  <div class="matches-container">
    <div class="matches-header">
      <h1 v-voix="'matches-title'">Find Matches</h1>
      <p class="matches-subtitle" v-voix="'matches-subtitle'">
        Discover people to exchange skills with based on your interests
      </p>
    </div>

    <div class="matches-content">
      <!-- Filters Panel -->
      <div class="filters-panel">
        <h2 class="filters-title" v-voix="'filters-title'">Search & Filter</h2>
        
        <div class="filter-group">
          <label for="searchTerm" v-voix="'search-label'">Search</label>
          <input 
            type="text" 
            id="searchTerm" 
            v-model="filters.searchTerm" 
            placeholder="Search by name, skill, location..."
            v-voix="'search-input'"
            hint="Enter keywords to search matches"
          >
        </div>
        
        <div class="filter-group">
          <label for="teachSkill" v-voix="'teach-skill-label'">Skills you want to learn</label>
          <input 
            type="text" 
            id="teachSkill" 
            v-model="filters.teachSkill" 
            placeholder="e.g., Spanish, Guitar"
            v-voix="'teach-skill-input'"
            hint="Enter skills you want to learn from others"
          >
        </div>
        
        <div class="filter-group">
          <label for="learnSkill" v-voix="'learn-skill-label'">Skills you can teach</label>
          <input 
            type="text" 
            id="learnSkill" 
            v-model="filters.learnSkill" 
            placeholder="e.g., JavaScript, Photography"
            v-voix="'learn-skill-input'"
            hint="Enter skills you can teach to others"
          >
        </div>
        
        <div class="filter-group">
          <label for="minCompatibility" v-voix="'compatibility-label'">
            Minimum Compatibility: {{ filters.minCompatibility }}%
          </label>
          <input 
            type="range" 
            id="minCompatibility" 
            v-model.number="filters.minCompatibility" 
            min="0" 
            max="100" 
            step="5"
            v-voix="'compatibility-slider'"
            hint="Adjust to filter by minimum compatibility percentage"
          >
        </div>
        
        <div class="filter-group">
          <label v-voix="'session-type-label'">Session Type</label>
          <div class="radio-group">
            <div class="radio-option">
              <input 
                type="radio" 
                id="all" 
                value="all" 
                v-model="filters.sessionType"
                v-voix="'all-sessions-radio'"
                hint="Show matches available for any session type"
              >
              <label for="all" v-voix="'all-sessions-label'">All</label>
            </div>
            <div class="radio-option">
              <input 
                type="radio" 
                id="online" 
                value="online" 
                v-model="filters.sessionType"
                v-voix="'online-sessions-radio'"
                hint="Show matches available for online sessions"
              >
              <label for="online" v-voix="'online-sessions-label'">Online</label>
            </div>
            <div class="radio-option">
              <input 
                type="radio" 
                id="inPerson" 
                value="in-person" 
                v-model="filters.sessionType"
                v-voix="'in-person-sessions-radio'"
                hint="Show matches available for in-person sessions"
              >
              <label for="inPerson" v-voix="'in-person-sessions-label'">In-Person</label>
            </div>
          </div>
        </div>
        
        <div class="filter-group">
          <label v-voix="'sort-by-label'">Sort By</label>
          <div class="radio-group">
            <div class="radio-option">
              <input 
                type="radio" 
                id="compatibility" 
                value="compatibility" 
                v-model="filters.sortBy"
                v-voix="'compatibility-sort-radio'"
                hint="Sort matches by compatibility percentage"
              >
              <label for="compatibility" v-voix="'compatibility-sort-label'">Compatibility</label>
            </div>
            <div class="radio-option">
              <input 
                type="radio" 
                id="newest" 
                value="newest" 
                v-model="filters.sortBy"
                v-voix="'newest-sort-radio'"
                hint="Sort matches by newest first"
              >
              <label for="newest" v-voix="'newest-sort-label'">Newest</label>
            </div>
          </div>
        </div>
        
        <div class="filter-group checkbox-group">
          <input 
            type="checkbox" 
            id="showNewOnly" 
            v-model="filters.showNewOnly"
            v-voix="'new-only-checkbox'"
            hint="Show only new matches"
          >
          <label for="showNewOnly" v-voix="'new-only-label'">Show new matches only</label>
        </div>
        
        <button 
          v-if="hasActiveFilters" 
          class="reset-filters-button" 
          @click="resetFilters"
          v-voix="'reset-filters-button'"
          hint="Clear all filters"
        >
          Reset Filters
        </button>
      </div>

      <!-- Matches Results -->
      <div class="matches-results">
        <div class="results-header">
          <h2 class="results-title" v-voix="'results-title'">
            <span v-if="isLoading">Finding matches...</span>
            <span v-else>{{ matchesCount }} Matches Found</span>
          </h2>
        </div>
        
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Searching for your perfect skill exchange partners...</p>
        </div>
        
        <div v-else-if="filteredMatches.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No matches found</h3>
          <p>Try adjusting your filters or search criteria</p>
          <button 
            class="reset-filters-button" 
            @click="resetFilters"
            v-voix="'reset-empty-filters-button'"
            hint="Clear all filters to see all matches"
          >
            Reset All Filters
          </button>
        </div>
        
        <div v-else class="match-cards">
          <div 
            v-for="match in filteredMatches" 
            :key="match.id" 
            class="match-card"
            :class="{ 'is-new': match.isNew }"
            v-voix="`match-card-${match.id}`"
          >
            <div v-if="match.isNew" class="new-badge" v-voix="`new-badge-${match.id}`">New</div>
            <div class="match-header">
              <img :src="match.avatar" :alt="match.name" class="match-avatar">
              <div class="match-info">
                <h3 class="match-name">{{ match.name }}</h3>
                <p class="match-location">{{ match.location }}</p>
              </div>
              <div class="match-score">
                <span class="score-value">{{ match.compatibility }}%</span>
                <span class="score-label">Match</span>
              </div>
            </div>
            
            <p class="match-bio">{{ match.bio }}</p>
            
            <div class="skills-exchange">
              <div class="skill-list">
                <h4 v-voix="`match-${match.id}-can-teach`">Can teach you:</h4>
                <ul>
                  <li v-for="(skill, index) in match.canTeachYou" :key="index">
                    {{ skill.name }} <span class="skill-level">({{ skill.level }})</span>
                  </li>
                </ul>
              </div>
              <div class="skill-list">
                <h4 v-voix="`match-${match.id}-you-teach`">You can teach:</h4>
                <ul>
                  <li v-for="(skill, index) in match.youCanTeach" :key="index">
                    {{ skill.name }} <span class="skill-level">({{ skill.level }})</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div class="match-actions">
              <button 
                class="view-details-button" 
                @click="viewMatchDetails(match)"
                v-voix="`view-details-${match.id}`"
                hint="See more details about this match"
              >
                View Details
              </button>
              <button 
                class="message-button" 
                @click="sendMessage(match.id)"
                v-voix="`message-match-${match.id}`"
                hint="Send a message to this person"
              >
                Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Match Details Modal -->
    <div v-if="isMatchDetailsOpen && selectedMatch" class="match-details-modal">
      <div 
        class="modal-backdrop" 
        @click="closeMatchDetails"
        v-voix="'modal-backdrop'"
        hint="Click to close the details"
      ></div>
      <div class="modal-content">
        <button 
          class="close-modal-button" 
          @click="closeMatchDetails"
          v-voix="'close-modal-button'"
          hint="Close the details view"
        >
          ✕
        </button>
        
        <div class="modal-header">
          <img :src="selectedMatch.avatar" :alt="selectedMatch.name" class="modal-avatar">
          <div class="modal-user-info">
            <h2 class="modal-name">{{ selectedMatch.name }}</h2>
            <p class="modal-location">{{ selectedMatch.location }}</p>
            <div class="modal-match-score">
              <span class="score-value">{{ selectedMatch.compatibility }}% Match</span>
            </div>
          </div>
        </div>
        
        <div class="modal-section">
          <h3 v-voix="'modal-about-title'">About</h3>
          <p class="modal-bio">{{ selectedMatch.bio }}</p>
        </div>
        
        <div class="modal-section">
          <h3 v-voix="'modal-skills-title'">Skills Exchange</h3>
          <div class="modal-skills-grid">
            <div class="modal-skill-section">
              <h4 v-voix="'modal-can-teach-title'">Can teach you:</h4>
              <ul class="modal-skill-list">
                <li v-for="(skill, index) in selectedMatch.canTeachYou" :key="index">
                  {{ skill.name }} <span class="skill-level">({{ skill.level }})</span>
                </li>
              </ul>
            </div>
            <div class="modal-skill-section">
              <h4 v-voix="'modal-you-teach-title'">You can teach:</h4>
              <ul class="modal-skill-list">
                <li v-for="(skill, index) in selectedMatch.youCanTeach" :key="index">
                  {{ skill.name }} <span class="skill-level">({{ skill.level }})</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="modal-section">
          <h3 v-voix="'modal-common-interests-title'">Common Interests</h3>
          <div class="modal-interests">
            <span 
              v-for="(interest, index) in selectedMatch.commonInterests" 
              :key="index" 
              class="interest-tag"
            >
              {{ interest }}
            </span>
          </div>
        </div>
        
        <div class="modal-section">
          <h3 v-voix="'modal-availability-title'">Availability</h3>
          <div class="modal-availability">
            <div class="availability-item">
              <strong>Days:</strong> {{ selectedMatch.availability.days.join(', ') }}
            </div>
            <div class="availability-item">
              <strong>Time of day:</strong> {{ selectedMatch.availability.timeOfDay.join(', ') }}
            </div>
            <div class="availability-item">
              <strong>Session type:</strong> {{ selectedMatch.preferredSessionType }}
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button 
            class="view-profile-button" 
            @click="viewProfile(selectedMatch.id)"
            v-voix="'modal-view-profile-button'"
            hint="View this person's full profile"
          >
            View Full Profile
          </button>
          <button 
            class="send-message-button" 
            @click="sendMessage(selectedMatch.id)"
            v-voix="'modal-message-button'"
            hint="Send a message to this person"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.matches-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.matches-header {
  margin-bottom: 2rem;
}

.matches-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.matches-subtitle {
  color: var(--light-text);
  font-size: 1.1rem;
}

.matches-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
}

/* Filters Panel */
.filters-panel {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 1.5rem;
}

.filters-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group:last-child {
  margin-bottom: 1rem;
}

.filter-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.filter-group input[type="text"] {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.3s;
}

.filter-group input[type="text"]:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 140, 255, 0.2);
}

.filter-group input[type="range"] {
  width: 100%;
  margin-top: 0.5rem;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.reset-filters-button {
  width: 100%;
  padding: 0.75rem;
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 0.5rem;
}

.reset-filters-button:hover {
  background-color: var(--background-color);
}

/* Matches Results */
.matches-results {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  color: var(--light-text);
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(74, 140, 255, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  color: var(--light-text);
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.empty-state p {
  margin-bottom: 1.5rem;
}

/* Match Cards */
.match-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.match-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  position: relative;
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.match-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.match-card.is-new {
  border-color: var(--primary-color);
}

.new-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.match-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.match-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.match-info {
  flex: 1;
}

.match-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-color);
}

.match-location {
  color: var(--light-text);
  font-size: 0.95rem;
}

.match-score {
  background-color: rgba(74, 140, 255, 0.1);
  color: var(--primary-color);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.score-value {
  font-weight: 700;
  font-size: 1.25rem;
}

.score-label {
  font-size: 0.75rem;
  font-weight: 500;
}

.match-bio {
  margin-bottom: 1.5rem;
  line-height: 1.5;
  color: var(--text-color);
}

.skills-exchange {
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  background-color: var(--background-color);
  padding: 1.25rem;
  border-radius: 8px;
}

.skill-list h4 {
  font-size: 0.95rem;
  color: var(--light-text);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.skill-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-list li {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.skill-level {
  font-weight: normal;
  color: var(--light-text);
  font-size: 0.85rem;
}

.match-actions {
  display: flex;
  gap: 1rem;
}

.view-details-button,
.message-button {
  flex: 1;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
  text-align: center;
}

.view-details-button {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  background-color: transparent;
}

.view-details-button:hover {
  background-color: rgba(74, 140, 255, 0.1);
}

.message-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.message-button:hover {
  background-color: var(--secondary-color);
}

/* Match Details Modal */
.match-details-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  z-index: 101;
}

.close-modal-button {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--light-text);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: var(--transition);
}

.close-modal-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--text-color);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.modal-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.modal-user-info {
  flex: 1;
}

.modal-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--text-color);
}

.modal-location {
  color: var(--light-text);
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.modal-match-score {
  display: inline-block;
  background-color: rgba(74, 140, 255, 0.1);
  color: var(--primary-color);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
}

.modal-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-section:last-child {
  border-bottom: none;
  margin-bottom: 1.5rem;
  padding-bottom: 0;
}

.modal-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.modal-bio {
  line-height: 1.6;
}

.modal-skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.modal-skill-section h4 {
  font-size: 1rem;
  color: var(--light-text);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.modal-skill-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.modal-skill-list li {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  padding: 0.5rem;
  background-color: var(--background-color);
  border-radius: 6px;
}

.modal-interests {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.interest-tag {
  display: inline-block;
  background-color: var(--background-color);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 500;
}

.modal-availability {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.availability-item {
  display: flex;
  gap: 0.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.view-profile-button,
.send-message-button {
  flex: 1;
  padding: 0.875rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  text-align: center;
}

.view-profile-button {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  background-color: transparent;
}

.view-profile-button:hover {
  background-color: rgba(74, 140, 255, 0.1);
}

.send-message-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.send-message-button:hover {
  background-color: var(--secondary-color);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .matches-content {
    grid-template-columns: 1fr;
  }
  
  .filters-panel {
    position: static;
    margin-bottom: 1.5rem;
  }
  
  .radio-group {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .matches-container {
    padding: 1rem;
  }
  
  .skills-exchange {
    grid-template-columns: 1fr;
  }
  
  .match-actions {
    flex-direction: column;
  }
  
  .modal-header {
    flex-direction: column;
    text-align: center;
  }
  
  .modal-match-score {
    margin-top: 0.5rem;
  }
  
  .modal-skills-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .match-header {
    flex-direction: column;
    text-align: center;
  }
  
  .match-score {
    margin-top: 1rem;
  }
}
</style>