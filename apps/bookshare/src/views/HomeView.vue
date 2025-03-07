<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useBookStore } from '@/store'
import { useRouter } from 'vue-router'

const bookStore = useBookStore()
const { books, currentUser, filters } = storeToRefs(bookStore)
const router = useRouter()

// Search and filter functionality
const searchTerm = ref('')
const selectedGenre = ref(null)

// Computed list of unique genres from all books
const genres = computed(() => {
  const genreSet = new Set()
  books.value.forEach(book => {
    genreSet.add(book.type)
  })
  return Array.from(genreSet)
})

// Filtered books based on search and genre
const filteredBooks = computed(() => {
  return books.value.filter(book => {
    // Filter by search term
    const matchesSearch = searchTerm.value === '' || 
      book.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      book.tags.some(tag => tag.toLowerCase().includes(searchTerm.value.toLowerCase()))
    
    // Filter by genre
    const matchesGenre = selectedGenre.value === null || book.type === selectedGenre.value
    
    return matchesSearch && matchesGenre
  })
})

// User reading progress and recommended books
const booksInProgress = computed(() => {
  const progressBooks = []
  if (currentUser.value && currentUser.value.bookProgress) {
    Object.entries(currentUser.value.bookProgress).forEach(([bookId, progress]) => {
      const book = books.value.find(b => b.id === bookId)
      if (book) {
        progressBooks.push({
          ...book,
          progress,
          progressPercent: Math.round((progress / book.content.length) * 100)
        })
      }
    })
  }
  return progressBooks
})

const recommendedBooks = computed(() => {
  if (!currentUser.value || !currentUser.value.preferences) return []
  
  return books.value
    .filter(book => 
      book.tags.some(tag => 
        currentUser.value.preferences.includes(tag)
      ) && 
      (!currentUser.value.bookProgress || !currentUser.value.bookProgress[book.id])
    )
    .slice(0, 3)
})

// Actions
const openBook = (bookId) => {
  bookStore.selectBook(bookId)
  router.push({ name: 'reader', params: { id: bookId } })
}

const applyFilters = () => {
  filters.value.searchTerm = searchTerm.value
  filters.value.genre = selectedGenre.value
}

const clearFilters = () => {
  searchTerm.value = ''
  selectedGenre.value = null
  filters.value.searchTerm = ''
  filters.value.genre = null
}
</script>

<template>
  <div class="home-view">
    <!-- Hero section -->
    <section class="hero">
      <div class="hero-content">
        <h1 v-voix="'page-title'" class="app-title">BookShare</h1>
        <p class="app-tagline">Discover, read, and collaborate on books in a whole new way</p>
        <p class="app-description">Welcome, {{ currentUser.name }}! Explore our collection, highlight your favorite passages, and share your thoughts with other readers.</p>
      </div>
    </section>
    
    <!-- Continue reading section -->
    <section v-if="booksInProgress.length > 0" class="reading-progress">
      <h2 v-voix="'continue-reading-section'">Continue Reading</h2>
      <div class="progress-books">
        <div 
          v-for="book in booksInProgress" 
          :key="`progress-${book.id}`" 
          class="progress-card"
          @click="openBook(book.id)"
          v-voix="'continue-book-' + book.id"
          :hint="'Continue reading ' + book.title + ', ' + book.progressPercent + '% complete'"
        >
          <div class="book-cover" :style="{ background: book.coverStyle.gradient, backgroundImage: book.coverStyle.pattern }">
            <span class="book-title">{{ book.title }}</span>
          </div>
          <div class="progress-info">
            <div class="progress-meta">
              <span class="book-short-title">{{ book.title }}</span>
              <span class="progress-percent">{{ book.progressPercent }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress" :style="{ width: `${book.progressPercent}%` }"></div>
            </div>
            <p class="progress-action">Continue reading →</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Recommended books section -->
    <section v-if="recommendedBooks.length > 0" class="recommendations">
      <h2 v-voix="'recommendations-section'">Recommended For You</h2>
      <div class="recommended-books">
        <div 
          v-for="book in recommendedBooks" 
          :key="`rec-${book.id}`" 
          class="recommendation-card"
          @click="openBook(book.id)"
          v-voix="'recommended-book-' + book.id"
          :hint="'Start reading ' + book.title + ' by ' + book.author"
        >
          <div class="book-cover" :style="{ background: book.coverStyle.gradient, backgroundImage: book.coverStyle.pattern }">
            <span class="book-title">{{ book.title }}</span>
          </div>
          <div class="rec-info">
            <h3>{{ book.title }}</h3>
            <p class="book-author">{{ book.author }}</p>
            <div class="tag-list">
              <span 
                v-for="(tag, index) in book.tags.slice(0, 2)" 
                :key="index" 
                class="book-tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Library section with search and filters -->
    <section class="library-section">
      <div class="library-header">
        <h2 v-voix="'library-section'">Book Library</h2>
        <div class="filter-controls">
          <div class="search-container">
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="Search books..." 
              class="search-input"
              v-voix="'search-input'"
              hint="Search books by title, author, or keywords"
              @keyup.enter="applyFilters"
            />
            <button 
              @click="applyFilters" 
              class="search-button"
              v-voix="'search-button'"
            >
              Search
            </button>
          </div>
          <div class="genre-filter">
            <select 
              v-model="selectedGenre" 
              class="genre-select"
              v-voix="'genre-filter'"
              @change="applyFilters"
            >
              <option :value="null">All Genres</option>
              <option v-for="genre in genres" :key="genre" :value="genre">
                {{ genre.charAt(0).toUpperCase() + genre.slice(1) }}
              </option>
            </select>
            <button 
              v-if="selectedGenre || searchTerm" 
              @click="clearFilters" 
              class="clear-filters"
              v-voix="'clear-filters'"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      <div class="book-library">
        <div 
          v-for="book in filteredBooks" 
          :key="book.id" 
          class="book-card"
        >
          <div class="book-cover" :style="{ background: book.coverStyle.gradient, backgroundImage: book.coverStyle.pattern }">
            <span class="book-title">{{ book.title }}</span>
          </div>
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p class="book-author">by {{ book.author }}</p>
            <div class="tags">
              <span v-for="(tag, index) in book.tags.slice(0, 3)" :key="index" class="tag">{{ tag }}</span>
            </div>
            <p class="book-description">{{ book.description }}</p>
            <div class="book-meta">
              <span class="chapters">{{ book.content.length }} chapters</span>
              <span class="type">{{ book.type }}</span>
            </div>
            <button 
              @click="openBook(book.id)" 
              class="read-button"
              v-voix="'read-book-' + book.id"
              :hint="'Opens ' + book.title + ' by ' + book.author + ' in the reader view'"
            >
              Read Book
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  padding: 0;
}

/* Hero section */
.hero {
  background: linear-gradient(135deg, #2c3e50, #4b6cb7);
  color: white;
  padding: 4rem 2rem;
  margin-bottom: 3rem;
  border-radius: 0.5rem;
  text-align: center;
}

.app-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 800;
}

.app-tagline {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 300;
}

.app-description {
  font-size: 1.1rem;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.9;
}

/* Section styling */
section {
  margin-bottom: 3rem;
}

section h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.5rem;
}

section h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #4b6cb7;
}

/* Reading progress section */
.progress-books {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.progress-card {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.progress-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.progress-card .book-cover {
  width: 100px;
  height: 150px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 0.5rem;
}

.progress-card .book-title {
  font-size: 0.9rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.progress-info {
  padding: 1rem;
  flex-grow: 1;
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.book-short-title {
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.progress-percent {
  font-weight: 600;
  color: #4b6cb7;
}

.progress-bar {
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress {
  height: 100%;
  background-color: #4b6cb7;
  border-radius: 3px;
}

.progress-action {
  color: #4b6cb7;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
}

/* Recommendations section */
.recommended-books {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.recommendation-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.recommendation-card .book-cover {
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 1rem;
}

.rec-info {
  padding: 1.25rem;
}

.rec-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.tag-list {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.book-tag {
  background-color: #eef2ff;
  color: #4b6cb7;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Library section */
.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-container {
  display: flex;
}

.search-input {
  border: 1px solid #e5e7eb;
  border-right: none;
  padding: 0.6rem 1rem;
  border-radius: 8px 0 0 8px;
  min-width: 250px;
  font-size: 0.9rem;
}

.search-button {
  background-color: #4b6cb7;
  color: white;
  border: none;
  padding: 0 1rem;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-weight: 500;
}

.genre-filter {
  display: flex;
  gap: 0.5rem;
}

.genre-select {
  padding: 0.6rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  font-size: 0.9rem;
  min-width: 150px;
}

.clear-filters {
  border: 1px solid #e5e7eb;
  background-color: white;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.book-library {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.book-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.book-cover {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 1rem;
  text-align: center;
  position: relative;
}

.book-title {
  font-weight: bold;
  font-size: 1.2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  max-width: 90%;
}

.book-info {
  padding: 1.75rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.book-info h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
}

.book-author {
  color: #6b7280;
  font-style: italic;
  margin-bottom: 1rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background-color: #eef2ff;
  color: #4b6cb7;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 500;
}

.book-description {
  margin-bottom: 1.5rem;
  flex-grow: 1;
  color: #4b5563;
  line-height: 1.6;
}

.book-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.chapters::before {
  content: '📖 ';
}

.type::before {
  content: '🏷️ ';
}

.read-button {
  background-color: #4b6cb7;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  align-self: flex-start;
  display: flex;
  align-items: center;
}

.read-button:hover {
  background-color: #3b5998;
}

.read-button::after {
  content: ' →';
  margin-left: 0.5rem;
}

@media (max-width: 768px) {
  .hero {
    padding: 3rem 1.5rem;
    margin-bottom: 2rem;
  }
  
  .app-title {
    font-size: 2.5rem;
  }
  
  .library-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-controls {
    width: 100%;
    flex-direction: column;
  }
  
  .search-input {
    min-width: auto;
    flex-grow: 1;
  }
  
  .book-library {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .progress-books,
  .recommended-books {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .progress-card {
    flex-direction: column;
  }
  
  .progress-card .book-cover {
    width: 100%;
    height: 120px;
  }
  
  .book-short-title {
    max-width: none;
  }
}
</style>
