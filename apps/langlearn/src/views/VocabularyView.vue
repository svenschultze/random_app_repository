<script setup>
import { ref, computed } from 'vue'
import { useLessonsStore } from '../stores/lessons'
import { useUserStore } from '../stores/user'

const lessonsStore = useLessonsStore()
const userStore = useUserStore()

// Get user's completed lessons
const completedLessons = computed(() => lessonsStore.completedLessons)

// View state
const activeTab = ref('all') // 'all', 'recent', 'favorite', 'difficult'
const searchTerm = ref('')
const showingFlashcard = ref(false)

// Mock vocabulary data
// In a real app, this would be generated from lessons the user has completed
const mockVocabulary = [
  // Basic greetings
  { id: 'vocab-1', term: 'Hello', translation: 'Hola', lessonId: 'basics-1', learned: true, favorite: true, difficulty: 'easy' },
  { id: 'vocab-2', term: 'Goodbye', translation: 'Adiós', lessonId: 'basics-1', learned: true, favorite: false, difficulty: 'easy' },
  { id: 'vocab-3', term: 'Thank you', translation: 'Gracias', lessonId: 'basics-1', learned: true, favorite: true, difficulty: 'easy' },
  { id: 'vocab-4', term: 'Please', translation: 'Por favor', lessonId: 'basics-1', learned: true, favorite: false, difficulty: 'easy' },
  
  // Common phrases
  { id: 'vocab-5', term: 'How are you?', translation: '¿Cómo estás?', lessonId: 'basics-2', learned: true, favorite: false, difficulty: 'medium' },
  { id: 'vocab-6', term: 'I am fine', translation: 'Estoy bien', lessonId: 'basics-2', learned: true, favorite: false, difficulty: 'medium' },
  { id: 'vocab-7', term: 'My name is', translation: 'Me llamo', lessonId: 'basics-2', learned: true, favorite: true, difficulty: 'easy' },
  { id: 'vocab-8', term: 'Nice to meet you', translation: 'Mucho gusto', lessonId: 'basics-2', learned: true, favorite: false, difficulty: 'medium' },
  
  // Numbers
  { id: 'vocab-9', term: 'One', translation: 'Uno', lessonId: 'numbers-1', learned: true, favorite: false, difficulty: 'easy' },
  { id: 'vocab-10', term: 'Two', translation: 'Dos', lessonId: 'numbers-1', learned: true, favorite: false, difficulty: 'easy' },
  { id: 'vocab-11', term: 'Three', translation: 'Tres', lessonId: 'numbers-1', learned: true, favorite: false, difficulty: 'easy' },
  { id: 'vocab-12', term: 'Four', translation: 'Cuatro', lessonId: 'numbers-1', learned: true, favorite: false, difficulty: 'easy' },
  { id: 'vocab-13', term: 'Five', translation: 'Cinco', lessonId: 'numbers-1', learned: true, favorite: false, difficulty: 'easy' },
  
  // Airport vocabulary
  { id: 'vocab-14', term: 'Airport', translation: 'Aeropuerto', lessonId: 'travel-1', learned: true, favorite: false, difficulty: 'medium' },
  { id: 'vocab-15', term: 'Ticket', translation: 'Boleto', lessonId: 'travel-1', learned: true, favorite: true, difficulty: 'medium' },
  { id: 'vocab-16', term: 'Passport', translation: 'Pasaporte', lessonId: 'travel-1', learned: true, favorite: false, difficulty: 'medium' },
  { id: 'vocab-17', term: 'Flight', translation: 'Vuelo', lessonId: 'travel-1', learned: true, favorite: false, difficulty: 'hard' },
  { id: 'vocab-18', term: 'Bathroom', translation: 'Baño', lessonId: 'travel-1', learned: true, favorite: false, difficulty: 'medium' },
]

// Filter vocabulary based on active tab and search term
const filteredVocabulary = computed(() => {
  let filtered = [...mockVocabulary]
  
  // Filter by tab
  if (activeTab.value === 'recent') {
    // In a real app, we would sort by recently learned
    filtered = filtered.slice(0, 10)
  } else if (activeTab.value === 'favorite') {
    filtered = filtered.filter(vocab => vocab.favorite)
  } else if (activeTab.value === 'difficult') {
    filtered = filtered.filter(vocab => vocab.difficulty === 'hard')
  }
  
  // Filter by search term
  if (searchTerm.value.trim()) {
    const search = searchTerm.value.toLowerCase().trim()
    filtered = filtered.filter(vocab => 
      vocab.term.toLowerCase().includes(search) || 
      vocab.translation.toLowerCase().includes(search)
    )
  }
  
  return filtered
})

// Get vocabulary stats
const vocabStats = computed(() => {
  return {
    total: mockVocabulary.length,
    favorites: mockVocabulary.filter(v => v.favorite).length,
    mastered: mockVocabulary.filter(v => v.difficulty === 'easy').length,
    learning: mockVocabulary.filter(v => v.difficulty === 'medium').length,
    difficult: mockVocabulary.filter(v => v.difficulty === 'hard').length
  }
})

// Flashcard state
const currentFlashcardIndex = ref(0)
const showingTranslation = ref(false)
const practiceMode = ref('all') // 'all', 'favorites', 'difficult'

// Flashcard filtering based on practice mode
const flashcardVocabulary = computed(() => {
  if (practiceMode.value === 'favorites') {
    return mockVocabulary.filter(vocab => vocab.favorite)
  } else if (practiceMode.value === 'difficult') {
    return mockVocabulary.filter(vocab => vocab.difficulty === 'hard')
  } else {
    return mockVocabulary
  }
})

// Current flashcard
const currentFlashcard = computed(() => {
  if (flashcardVocabulary.value.length === 0) return null
  
  const index = currentFlashcardIndex.value % flashcardVocabulary.value.length
  return flashcardVocabulary.value[index]
})

// Start flashcard practice
const startPractice = (mode = 'all') => {
  practiceMode.value = mode
  showingFlashcard.value = true
  currentFlashcardIndex.value = 0
  showingTranslation.value = false
}

// Flashcard navigation
const nextFlashcard = () => {
  currentFlashcardIndex.value++
  showingTranslation.value = false
}

const prevFlashcard = () => {
  if (currentFlashcardIndex.value > 0) {
    currentFlashcardIndex.value--
    showingTranslation.value = false
  }
}

// Toggle showing translation
const toggleTranslation = () => {
  showingTranslation.value = !showingTranslation.value
}

// Exit flashcard practice
const exitPractice = () => {
  showingFlashcard.value = false
}

// Toggle favorite status
const toggleFavorite = (vocabId) => {
  const vocab = mockVocabulary.find(v => v.id === vocabId)
  if (vocab) {
    vocab.favorite = !vocab.favorite
  }
}

// Update difficulty
const updateDifficulty = (vocabId, difficulty) => {
  const vocab = mockVocabulary.find(v => v.id === vocabId)
  if (vocab) {
    vocab.difficulty = difficulty
  }
}
</script>

<template>
  <div class="vocabulary-container">
    <!-- Flashcard practice mode -->
    <div v-if="showingFlashcard" class="flashcard-container">
      <div class="flashcard-header">
        <button 
          class="btn btn-text" 
          @click="exitPractice"
          v-voix="'exit-flashcards'"
          hint="Exit flashcard practice"
        >
          ← Back to Vocabulary
        </button>
        
        <div class="flashcard-info">
          <span v-voix="'flashcard-counter'" :hint="`Flashcard ${currentFlashcardIndex + 1} of ${flashcardVocabulary.length}`">
            {{ currentFlashcardIndex + 1 }} / {{ flashcardVocabulary.length }}
          </span>
        </div>
      </div>
      
      <div 
        v-if="currentFlashcard" 
        class="flashcard" 
        @click="toggleTranslation"
        v-voix="'flashcard'"
        hint="Click to flip the flashcard"
      >
        <div class="flashcard-front" v-if="!showingTranslation">
          <div class="flashcard-content">
            <h2 class="flashcard-text">{{ currentFlashcard.term }}</h2>
            <p class="flashcard-hint">Click to reveal translation</p>
          </div>
        </div>
        
        <div class="flashcard-back" v-else>
          <div class="flashcard-content">
            <h2 class="flashcard-text">{{ currentFlashcard.translation }}</h2>
            <p class="flashcard-original">{{ currentFlashcard.term }}</p>
          </div>
        </div>
      </div>
      
      <div class="flashcard-actions">
        <button 
          v-if="currentFlashcardIndex > 0" 
          class="btn btn-secondary"
          @click="prevFlashcard"
          v-voix="'prev-flashcard'"
          hint="Go to previous flashcard"
        >
          Previous
        </button>
        
        <button 
          v-if="showingTranslation"
          class="btn-difficulty easy"
          @click="updateDifficulty(currentFlashcard.id, 'easy'); nextFlashcard()"
          v-voix="'easy-button'"
          hint="Mark word as easy and go to next flashcard"
        >
          Easy
        </button>
        
        <button 
          v-if="showingTranslation"
          class="btn-difficulty medium"
          @click="updateDifficulty(currentFlashcard.id, 'medium'); nextFlashcard()"
          v-voix="'medium-button'"
          hint="Mark word as medium difficulty and go to next flashcard"
        >
          Medium
        </button>
        
        <button 
          v-if="showingTranslation"
          class="btn-difficulty hard"
          @click="updateDifficulty(currentFlashcard.id, 'hard'); nextFlashcard()"
          v-voix="'hard-button'"
          hint="Mark word as hard and go to next flashcard"
        >
          Hard
        </button>
        
        <button 
          class="btn btn-primary"
          @click="nextFlashcard"
          v-voix="'next-flashcard'"
          hint="Go to next flashcard"
        >
          {{ showingTranslation ? 'Skip' : 'Reveal' }}
        </button>
      </div>
    </div>
    
    <!-- Regular vocabulary view -->
    <div v-else>
      <div class="vocabulary-header">
        <div>
          <h1 class="page-title">Vocabulary</h1>
          <p class="page-description">Review and practice the words and phrases you've learned.</p>
        </div>
        
        <div class="practice-buttons">
          <button 
            class="btn btn-primary"
            @click="startPractice('all')"
            v-voix="'practice-all'"
            hint="Practice all vocabulary with flashcards"
          >
            Practice All
          </button>
          <button 
            class="btn btn-secondary"
            @click="startPractice('favorites')"
            v-voix="'practice-favorites'"
            hint="Practice favorite vocabulary with flashcards"
          >
            Practice Favorites
          </button>
        </div>
      </div>
      
      <div class="vocabulary-stats">
        <div class="stat-card">
          <div class="stat-value" v-voix="'total-words'" :hint="`${vocabStats.total} total words learned`">{{ vocabStats.total }}</div>
          <div class="stat-label">Total Words</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value" v-voix="'favorite-words'" :hint="`${vocabStats.favorites} favorite words`">{{ vocabStats.favorites }}</div>
          <div class="stat-label">Favorites</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value" v-voix="'mastered-words'" :hint="`${vocabStats.mastered} mastered words`">{{ vocabStats.mastered }}</div>
          <div class="stat-label">Mastered</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value" v-voix="'learning-words'" :hint="`${vocabStats.learning} words being learned`">{{ vocabStats.learning }}</div>
          <div class="stat-label">Learning</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value" v-voix="'difficult-words'" :hint="`${vocabStats.difficult} difficult words`">{{ vocabStats.difficult }}</div>
          <div class="stat-label">Difficult</div>
        </div>
      </div>
      
      <div class="vocabulary-tools">
        <div class="search-container">
          <input 
            v-model="searchTerm" 
            type="text" 
            placeholder="Search vocabulary..."
            class="search-input"
            v-voix="'search-vocabulary'"
            hint="Search for specific words"
          />
        </div>
        
        <div class="filter-tabs">
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'all' }"
            @click="activeTab = 'all'"
            v-voix="'all-tab'"
            hint="View all vocabulary"
          >
            All
          </button>
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'recent' }"
            @click="activeTab = 'recent'"
            v-voix="'recent-tab'"
            hint="View recently learned vocabulary"
          >
            Recent
          </button>
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'favorite' }"
            @click="activeTab = 'favorite'"
            v-voix="'favorites-tab'"
            hint="View favorite vocabulary"
          >
            Favorites
          </button>
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'difficult' }"
            @click="activeTab = 'difficult'"
            v-voix="'difficult-tab'"
            hint="View difficult vocabulary"
          >
            Difficult
          </button>
        </div>
      </div>
      
      <div v-if="filteredVocabulary.length === 0" class="empty-state">
        <p>No vocabulary found matching your current filters.</p>
      </div>
      
      <div v-else class="vocabulary-list">
        <div class="vocabulary-header-row">
          <div class="term-column">Term</div>
          <div class="translation-column">Translation</div>
          <div class="difficulty-column">Difficulty</div>
          <div class="actions-column">Actions</div>
        </div>
        
        <div 
          v-for="vocab in filteredVocabulary" 
          :key="vocab.id"
          class="vocabulary-row"
          v-voix="`vocab-${vocab.id}`"
          :hint="`${vocab.term}: ${vocab.translation}`"
        >
          <div class="term-column">{{ vocab.term }}</div>
          <div class="translation-column">{{ vocab.translation }}</div>
          
          <div class="difficulty-column">
            <div 
              class="difficulty-badge" 
              :class="vocab.difficulty"
              v-voix="`difficulty-${vocab.id}`"
              :hint="`Difficulty: ${vocab.difficulty}`"
            >
              {{ vocab.difficulty.charAt(0).toUpperCase() + vocab.difficulty.slice(1) }}
            </div>
          </div>
          
          <div class="actions-column">
            <button 
              class="action-button favorite-button"
              :class="{ active: vocab.favorite }"
              @click="toggleFavorite(vocab.id)"
              v-voix="`favorite-${vocab.id}`"
              :hint="vocab.favorite ? 'Remove from favorites' : 'Add to favorites'"
            >
              <span v-if="vocab.favorite">★</span>
              <span v-else>☆</span>
            </button>
            
            <div class="difficulty-actions">
              <button 
                class="difficulty-button"
                :class="{ active: vocab.difficulty === 'easy' }"
                @click="updateDifficulty(vocab.id, 'easy')"
                v-voix="`easy-${vocab.id}`"
                hint="Mark as easy"
              >
                E
              </button>
              <button 
                class="difficulty-button"
                :class="{ active: vocab.difficulty === 'medium' }"
                @click="updateDifficulty(vocab.id, 'medium')"
                v-voix="`medium-${vocab.id}`"
                hint="Mark as medium difficulty"
              >
                M
              </button>
              <button 
                class="difficulty-button"
                :class="{ active: vocab.difficulty === 'hard' }"
                @click="updateDifficulty(vocab.id, 'hard')"
                v-voix="`hard-${vocab.id}`"
                hint="Mark as hard"
              >
                H
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vocabulary-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.vocabulary-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
}

.page-description {
  color: var(--text-light);
  max-width: 600px;
}

.practice-buttons {
  display: flex;
  gap: 0.75rem;
}

/* Vocabulary Stats */
.vocabulary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-light);
}

/* Vocabulary Tools */
.vocabulary-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-container {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-button {
  padding: 0.5rem 1rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button:hover {
  background-color: var(--border-color);
}

.tab-button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* Vocabulary List */
.vocabulary-list {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.vocabulary-header-row {
  display: grid;
  grid-template-columns: 1fr 1fr 100px 120px;
  padding: 1rem;
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-light);
}

.vocabulary-row {
  display: grid;
  grid-template-columns: 1fr 1fr 100px 120px;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
}

.vocabulary-row:last-child {
  border-bottom: none;
}

.vocabulary-row:hover {
  background-color: var(--bg-color);
}

.term-column, .translation-column {
  padding-right: 1rem;
}

.difficulty-column {
  display: flex;
  justify-content: center;
}

.difficulty-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
}

.difficulty-badge.easy {
  background-color: #10b981;
  color: white;
}

.difficulty-badge.medium {
  background-color: #f59e0b;
  color: white;
}

.difficulty-badge.hard {
  background-color: #ef4444;
  color: white;
}

.actions-column {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: var(--text-light);
  transition: color 0.2s;
}

.action-button:hover {
  color: var(--primary-color);
}

.favorite-button.active {
  color: var(--accent-color);
}

.difficulty-actions {
  display: flex;
  gap: 0.25rem;
}

.difficulty-button {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  border: 1px solid var(--border-color);
  background-color: white;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.difficulty-button:hover {
  background-color: var(--border-color);
}

.difficulty-button.active {
  color: white;
}

.difficulty-button.active:nth-child(1) {
  background-color: #10b981;
  border-color: #10b981;
}

.difficulty-button.active:nth-child(2) {
  background-color: #f59e0b;
  border-color: #f59e0b;
}

.difficulty-button.active:nth-child(3) {
  background-color: #ef4444;
  border-color: #ef4444;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: var(--bg-color);
  border-radius: 0.75rem;
  color: var(--text-light);
}

/* Flashcard Mode */
.flashcard-container {
  max-width: 600px;
  margin: 0 auto;
}

.flashcard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.flashcard-info {
  font-size: 0.875rem;
  color: var(--text-light);
}

.flashcard {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: transform 0.3s;
  perspective: 1000px;
}

.flashcard:hover {
  transform: translateY(-5px);
}

.flashcard-content {
  padding: 2rem;
  text-align: center;
}

.flashcard-text {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--primary-dark);
}

.flashcard-hint {
  color: var(--text-light);
  font-size: 0.875rem;
  font-style: italic;
}

.flashcard-original {
  color: var(--text-light);
  font-size: 1rem;
  margin-top: 0.5rem;
}

.flashcard-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-difficulty {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  color: white;
}

.btn-difficulty.easy {
  background-color: #10b981;
}

.btn-difficulty.easy:hover {
  background-color: #059669;
}

.btn-difficulty.medium {
  background-color: #f59e0b;
}

.btn-difficulty.medium:hover {
  background-color: #d97706;
}

.btn-difficulty.hard {
  background-color: #ef4444;
}

.btn-difficulty.hard:hover {
  background-color: #dc2626;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-secondary {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

.btn-text {
  background: none;
  border: none;
  color: var(--text-light);
  padding: 0;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-text:hover {
  color: var(--primary-color);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .vocabulary-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .practice-buttons {
    width: 100%;
  }
  
  .practice-buttons .btn {
    flex: 1;
  }
  
  .vocabulary-header-row, .vocabulary-row {
    grid-template-columns: 1fr 1fr;
  }
  
  .difficulty-column, .actions-column {
    display: none;
  }
}

@media (max-width: 640px) {
  .vocabulary-tools {
    flex-direction: column;
  }
  
  .filter-tabs {
    width: 100%;
    overflow-x: auto;
  }
  
  .flashcard {
    height: 250px;
  }
  
  .flashcard-text {
    font-size: 1.5rem;
  }
  
  .flashcard-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .flashcard-actions button {
    width: 100%;
  }
}
</style>