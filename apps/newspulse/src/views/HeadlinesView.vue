<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// News categories
const categories = ref([
  'All',
  'World',
  'Politics',
  'Technology',
  'Science',
  'Health',
  'Business',
  'Sports',
  'Entertainment',
  'Environment'
]);

// Current filter
const activeCategory = ref('All');

// Pagination
const currentPage = ref(1);
const totalPages = ref(5);
const articlesPerPage = 12;
const loadMoreEnabled = ref(false);
const isLoading = ref(false);

// Breaking news
const breakingNews = ref([
  {
    id: 'breaking-1',
    headline: 'Major Breakthrough in Renewable Energy Storage',
    summary: 'Scientists announce revolutionary battery technology with 10x capacity',
    category: 'Technology',
    source: 'Tech Insights',
    timestamp: '2 hours ago',
    image: 'https://picsum.photos/800/450?random=101'
  },
  {
    id: 'breaking-2',
    headline: 'Peace Talks Resume in Conflict Zone',
    summary: 'International mediators bring opposing sides to negotiation table',
    category: 'World',
    source: 'Global News',
    timestamp: '3 hours ago',
    image: 'https://picsum.photos/800/450?random=102'
  }
]);

// Editor's picks
const editorsPicks = ref([
  {
    id: 'editors-1',
    headline: 'The Future of Work: How AI is Transforming Industries',
    category: 'Technology',
    source: 'Future Trends',
    timestamp: 'Yesterday',
    image: 'https://picsum.photos/400/250?random=201'
  },
  {
    id: 'editors-2',
    headline: 'Ocean Conservation Efforts Show Promising Results',
    category: 'Environment',
    source: 'Ocean Watch',
    timestamp: 'Yesterday',
    image: 'https://picsum.photos/400/250?random=202'
  },
  {
    id: 'editors-3',
    headline: 'New Study Challenges Conventional Nutrition Advice',
    category: 'Health',
    source: 'Health Today',
    timestamp: '2 days ago',
    image: 'https://picsum.photos/400/250?random=203'
  }
]);

// Weather data
const weatherData = ref({
  location: 'New York, NY',
  temperature: 72,
  condition: 'Partly Cloudy',
  high: 78,
  low: 65,
  wind: '10 mph',
  humidity: '45%',
  forecast: [
    { day: 'Tue', temp: 75, condition: 'Sunny' },
    { day: 'Wed', temp: 73, condition: 'Cloudy' },
    { day: 'Thu', temp: 68, condition: 'Rain' },
    { day: 'Fri', temp: 70, condition: 'Partly Cloudy' }
  ]
});

// Mock articles data with varying card sizes
const allArticles = ref([
  {
    id: '1',
    headline: 'Global Climate Summit Addresses Rising Sea Levels',
    summary: 'World leaders gather to discuss urgent action on climate change as coastal cities face increasing threats',
    category: 'Environment',
    source: 'Environmental Watch',
    timestamp: '2 hours ago',
    image: 'https://picsum.photos/800/450?random=1',
    size: 'large'
  },
  {
    id: '2',
    headline: 'Tech Giants Announce AI Ethics Coalition',
    summary: 'Major technology companies form alliance to establish standards for responsible AI development',
    category: 'Technology',
    source: 'Tech Chronicle',
    timestamp: '3 hours ago',
    image: 'https://picsum.photos/800/450?random=2',
    size: 'medium'
  },
  {
    id: '3',
    headline: 'Healthcare Reform Bill Passes Senate',
    summary: 'Landmark legislation expands coverage and reduces prescription drug costs',
    category: 'Politics',
    source: 'Capital News',
    timestamp: '5 hours ago',
    image: 'https://picsum.photos/800/450?random=3',
    size: 'medium'
  },
  {
    id: '4',
    headline: 'Scientists Discover Potential Cancer Treatment Breakthrough',
    summary: 'New immunotherapy approach shows promising results in early clinical trials',
    category: 'Health',
    source: 'Medical Journal',
    timestamp: '6 hours ago',
    image: 'https://picsum.photos/800/450?random=4',
    size: 'large'
  },
  {
    id: '5',
    headline: 'Stock Markets Reach Record High',
    summary: 'Investors respond positively to strong economic indicators and corporate earnings',
    category: 'Business',
    source: 'Financial Times',
    timestamp: '7 hours ago',
    image: 'https://picsum.photos/800/450?random=5',
    size: 'small'
  },
  {
    id: '6',
    headline: 'New Spacecraft Successfully Reaches Mars Orbit',
    summary: 'Mission to study Martian atmosphere begins after perfect insertion maneuver',
    category: 'Science',
    source: 'Space News',
    timestamp: '9 hours ago',
    image: 'https://picsum.photos/800/450?random=6',
    size: 'medium'
  },
  {
    id: '7',
    headline: 'Global Sports Championship Opens With Spectacular Ceremony',
    summary: 'Athletes from 195 countries participate in the month-long competition',
    category: 'Sports',
    source: 'Sports Network',
    timestamp: '10 hours ago',
    image: 'https://picsum.photos/800/450?random=7',
    size: 'small'
  },
  {
    id: '8',
    headline: 'Award-Winning Film Director Announces New Project',
    summary: 'Much-anticipated collaboration with acclaimed actors begins production next month',
    category: 'Entertainment',
    source: 'Entertainment Weekly',
    timestamp: '12 hours ago',
    image: 'https://picsum.photos/800/450?random=8',
    size: 'small'
  },
  {
    id: '9',
    headline: 'Diplomatic Relations Restored Between Rival Nations',
    summary: 'Historic agreement ends decades of tension and opens path for economic cooperation',
    category: 'World',
    source: 'International Herald',
    timestamp: '14 hours ago',
    image: 'https://picsum.photos/800/450?random=9',
    size: 'medium'
  },
  {
    id: '10',
    headline: 'Revolutionary Urban Planning Project Transforms City Center',
    summary: 'Sustainable design incorporates green spaces, pedestrian zones, and renewable energy',
    category: 'Environment',
    source: 'Urban Development',
    timestamp: '18 hours ago',
    image: 'https://picsum.photos/800/450?random=10',
    size: 'medium'
  },
  {
    id: '11',
    headline: 'Advances in Quantum Computing Break Calculation Record',
    summary: 'New processor completes task in minutes that would take classical computers thousands of years',
    category: 'Technology',
    source: 'Quantum Review',
    timestamp: '20 hours ago',
    image: 'https://picsum.photos/800/450?random=11',
    size: 'small'
  },
  {
    id: '12',
    headline: 'Public Health Initiative Reduces Chronic Disease Rates',
    summary: 'Community-based program shows success in promoting healthy lifestyle changes',
    category: 'Health',
    source: 'Health Policy',
    timestamp: '22 hours ago',
    image: 'https://picsum.photos/800/450?random=12',
    size: 'small'
  },
  {
    id: '13',
    headline: 'Major Infrastructure Bill Aims to Modernize Transportation',
    summary: 'Bipartisan legislation includes funding for roads, bridges, rail, and electric vehicle charging stations',
    category: 'Politics',
    source: 'Government News',
    timestamp: 'Yesterday',
    image: 'https://picsum.photos/800/450?random=13',
    size: 'large'
  },
  {
    id: '14',
    headline: 'Ocean Expedition Discovers New Marine Species',
    summary: 'Deep-sea research team identifies previously unknown life forms in unexplored trench',
    category: 'Science',
    source: 'Ocean Explorer',
    timestamp: 'Yesterday',
    image: 'https://picsum.photos/800/450?random=14',
    size: 'medium'
  },
  {
    id: '15',
    headline: 'Global Trade Agreement Reduces Import Tariffs',
    summary: 'Major economies agree to new terms that could boost international commerce',
    category: 'Business',
    source: 'Economic Journal',
    timestamp: 'Yesterday',
    image: 'https://picsum.photos/800/450?random=15',
    size: 'small'
  }
]);

// Filter articles based on selected category
const filteredArticles = computed(() => {
  if (activeCategory.value === 'All') {
    return allArticles.value;
  }
  return allArticles.value.filter(article => article.category === activeCategory.value);
});

// Articles for current page
const currentArticles = computed(() => {
  const startIndex = (currentPage.value - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  return filteredArticles.value.slice(startIndex, endIndex);
});

// Set active category
const setCategory = (category) => {
  activeCategory.value = category;
  currentPage.value = 1; // Reset to first page when changing category
};

// Load more articles
const loadMore = async () => {
  if (currentPage.value < totalPages.value) {
    isLoading.value = true;
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    currentPage.value++;
    isLoading.value = false;
  }
};

// Navigate to article detail
const navigateToArticle = (id) => {
  router.push(`/story/${id}`);
};

// Intersection observer for infinite scroll
let observer;
const loadTriggerRef = ref(null);

onMounted(() => {
  // If infinite scroll is enabled
  if (loadMoreEnabled.value) {
    nextTick(() => {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !isLoading.value && currentPage.value < totalPages.value) {
          loadMore();
        }
      }, { threshold: 0.1 });
      
      if (loadTriggerRef.value) {
        observer.observe(loadTriggerRef.value);
      }
    });
  }
});

// Get weather icon based on condition
const getWeatherIcon = (condition) => {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('sun')) return '☀️';
  if (conditionLower.includes('cloud')) return '⛅';
  if (conditionLower.includes('rain')) return '🌧️';
  if (conditionLower.includes('snow')) return '❄️';
  if (conditionLower.includes('storm')) return '⛈️';
  return '🌤️';
};
</script>

<template>
  <div class="headlines-container">
    <!-- Categories filter bar -->
    <section class="categories-section" v-voix="'categories-section'" hint="Filter headlines by category">
      <div class="categories-bar">
        <button 
          v-for="category in categories" 
          :key="category" 
          class="category-button" 
          :class="{ 'active': activeCategory === category }"
          @click="setCategory(category)"
          v-voix="'category-' + category.toLowerCase()"
          :hint="`Show ${category} news`"
        >
          {{ category }}
        </button>
      </div>
    </section>

    <!-- Breaking news section -->
    <section 
      class="breaking-section"
      v-voix="'breaking-news-section'"
      hint="Breaking news section with latest urgent stories"
    >
      <div class="section-header">
        <h2>Breaking News</h2>
      </div>
      <div class="breaking-container">
        <div 
          v-for="news in breakingNews" 
          :key="news.id" 
          class="breaking-card"
          @click="navigateToArticle(news.id)"
          v-voix="'breaking-news-' + news.id"
          :hint="`Breaking news: ${news.headline}`"
        >
          <div class="card-image">
            <img :src="news.image" :alt="news.headline">
            <div class="breaking-label">Breaking</div>
          </div>
          <div class="card-content">
            <div class="card-meta">
              <span class="card-category">{{ news.category }}</span>
              <span class="card-timestamp">{{ news.timestamp }}</span>
            </div>
            <h3 class="card-headline">{{ news.headline }}</h3>
            <p class="card-summary">{{ news.summary }}</p>
            <div class="card-source">Source: {{ news.source }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main content area with sidebar layout -->
    <div class="main-content">
      <!-- Articles grid -->
      <section 
        class="articles-section"
        v-voix="'headlines-section'"
        hint="Main articles section with latest headlines"
      >
        <div class="section-header">
          <h2>{{ activeCategory === 'All' ? 'Top Stories' : activeCategory + ' Headlines' }}</h2>
        </div>
        
        <div class="articles-grid">
          <div 
            v-for="article in currentArticles" 
            :key="article.id" 
            class="article-card"
            :class="article.size"
            @click="navigateToArticle(article.id)"
            v-voix="'article-' + article.id"
            :hint="`${article.headline}: ${article.summary}`"
          >
            <div class="card-image">
              <img :src="article.image" :alt="article.headline">
              <div class="card-category">{{ article.category }}</div>
            </div>
            <div class="card-content">
              <h3 class="card-headline">{{ article.headline }}</h3>
              <p v-if="article.size !== 'small'" class="card-summary">{{ article.summary }}</p>
              <div class="card-meta">
                <span class="card-source">{{ article.source }}</span>
                <span class="card-timestamp">{{ article.timestamp }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination or infinite scroll -->
        <div class="pagination-container" v-if="!loadMoreEnabled">
          <button 
            class="pagination-button prev" 
            :disabled="currentPage === 1"
            @click="currentPage--"
            v-voix="'previous-page'"
            hint="Go to previous page of articles"
          >
            ◀ Previous
          </button>
          
          <div class="pagination-info">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
          
          <button 
            class="pagination-button next" 
            :disabled="currentPage === totalPages"
            @click="loadMore"
            v-voix="'next-page'"
            hint="Go to next page of articles"
          >
            Next ▶
          </button>
        </div>
        
        <!-- Infinite scroll loader -->
        <div v-else class="infinite-loader" ref="loadTriggerRef">
          <div v-if="isLoading" class="loader">
            <div class="loader-animation"></div>
            <span>Loading more articles...</span>
          </div>
          <div v-else-if="currentPage < totalPages" class="scroll-hint">
            Scroll for more articles
          </div>
          <div v-else class="end-message">
            You've reached the end of the articles
          </div>
        </div>
      </section>
      
      <!-- Sidebar content -->
      <aside class="sidebar">
        <!-- Weather widget -->
        <div 
          class="weather-widget"
          v-voix="'weather-widget'"
          hint="Current weather information and forecast"
        >
          <div class="widget-header">
            <h3>Weather</h3>
          </div>
          <div class="weather-current">
            <div class="weather-main">
              <div class="weather-icon" v-html="getWeatherIcon(weatherData.condition)"></div>
              <div class="weather-temp">{{ weatherData.temperature }}°</div>
            </div>
            <div class="weather-details">
              <div class="weather-location">{{ weatherData.location }}</div>
              <div class="weather-condition">{{ weatherData.condition }}</div>
              <div class="weather-minmax">H: {{ weatherData.high }}° L: {{ weatherData.low }}°</div>
            </div>
          </div>
          <div class="weather-forecast">
            <div 
              v-for="day in weatherData.forecast" 
              :key="day.day" 
              class="forecast-day"
            >
              <div class="forecast-name">{{ day.day }}</div>
              <div class="forecast-icon" v-html="getWeatherIcon(day.condition)"></div>
              <div class="forecast-temp">{{ day.temp }}°</div>
            </div>
          </div>
          <div class="weather-footer">
            <div class="weather-extra">
              <span>Wind: {{ weatherData.wind }}</span>
              <span>Humidity: {{ weatherData.humidity }}</span>
            </div>
          </div>
        </div>
        
        <!-- Editor's picks section -->
        <div 
          class="editors-picks"
          v-voix="'editors-picks-section'"
          hint="Specially selected stories by our editors"
        >
          <div class="widget-header">
            <h3>Editor's Picks</h3>
          </div>
          <div class="editors-list">
            <div 
              v-for="article in editorsPicks" 
              :key="article.id" 
              class="editor-article"
              @click="navigateToArticle(article.id)"
              v-voix="'editors-pick-' + article.id"
              :hint="`Editor's pick: ${article.headline}`"
            >
              <div class="editor-article-image">
                <img :src="article.image" :alt="article.headline">
              </div>
              <div class="editor-article-content">
                <div class="editor-article-category">{{ article.category }}</div>
                <h4 class="editor-article-headline">{{ article.headline }}</h4>
                <div class="editor-article-meta">
                  <span class="editor-article-source">{{ article.source }}</span>
                  <span class="editor-article-time">{{ article.timestamp }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.headlines-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Categories filter bar */
.categories-section {
  margin-bottom: 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--background-color-alt, #fff);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  padding: 1rem 0;
  border-radius: var(--border-radius, 8px);
}

.categories-bar {
  display: flex;
  overflow-x: auto;
  padding: 0 1rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scroll-behavior: smooth;
}

.categories-bar::-webkit-scrollbar {
  height: 4px;
}

.categories-bar::-webkit-scrollbar-track {
  background: var(--border-color, #e1e8ed);
}

.categories-bar::-webkit-scrollbar-thumb {
  background-color: var(--primary-color, #3498db);
  border-radius: 100px;
}

.category-button {
  background: none;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 100px;
  font-size: 0.9rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s;
  margin-right: 0.5rem;
  color: var(--text-color, #333);
}

.category-button:hover {
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color, #3498db);
}

.category-button.active {
  background-color: var(--primary-color, #3498db);
  color: white;
  font-weight: 600;
}

/* Section headers */
.section-header {
  margin-bottom: 1.5rem;
  position: relative;
}

.section-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  display: inline-block;
  position: relative;
}

.section-header h2::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -10px;
  width: 40px;
  height: 3px;
  background-color: var(--primary-color, #3498db);
}

/* Breaking news section */
.breaking-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background-color: rgba(231, 76, 60, 0.08);
  border-radius: var(--border-radius, 8px);
  border-left: 5px solid var(--accent-color, #e74c3c);
}

.breaking-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1.5rem;
}

.breaking-card {
  display: flex;
  background-color: var(--background-color-alt, #fff);
  border-radius: var(--border-radius, 8px);
  overflow: hidden;
  box-shadow: var(--shadow, 0 4px 12px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.breaking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.breaking-card .card-image {
  width: 180px;
  position: relative;
}

.breaking-card .card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.breaking-label {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: var(--accent-color, #e74c3c);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.breaking-card .card-content {
  padding: 1.25rem;
  flex: 1;
  min-width: 0;
}

.breaking-card .card-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
}

.breaking-card .card-category {
  color: var(--primary-color, #3498db);
  font-weight: 600;
}

.breaking-card .card-timestamp {
  color: var(--text-color-light, #666);
}

.breaking-card .card-headline {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.breaking-card .card-summary {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  color: var(--text-color-light, #666);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.breaking-card .card-source {
  font-size: 0.8rem;
  color: var(--text-color-light, #666);
  font-style: italic;
}

/* Main content layout */
.main-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

/* Articles grid */
.articles-section {
  margin-bottom: 3rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.article-card {
  background-color: var(--background-color-alt, #fff);
  border-radius: var(--border-radius, 8px);
  overflow: hidden;
  box-shadow: var(--shadow, 0 4px 12px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  position: relative;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.article-card.large {
  grid-column: span 6;
}

.article-card.medium {
  grid-column: span 4;
}

.article-card.small {
  grid-column: span 3;
}

.article-card .card-image {
  position: relative;
  width: 100%;
}

.article-card.large .card-image {
  height: 280px;
}

.article-card.medium .card-image {
  height: 200px;
}

.article-card.small .card-image {
  height: 160px;
}

.article-card .card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-card .card-category {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: var(--primary-color, #3498db);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.article-card .card-content {
  padding: 1.25rem;
}

.article-card .card-headline {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.article-card.large .card-headline {
  font-size: 1.4rem;
}

.article-card .card-summary {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  color: var(--text-color-light, #666);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card .card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-color-light, #666);
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}

.pagination-button {
  background-color: var(--background-color-alt, #fff);
  border: 1px solid var(--border-color, #e1e8ed);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-button:hover:not(:disabled) {
  background-color: var(--primary-color, #3498db);
  color: white;
  border-color: var(--primary-color, #3498db);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  margin: 0 1rem;
  font-size: 0.9rem;
  color: var(--text-color-light, #666);
}

/* Infinite scroll loader */
.infinite-loader {
  margin-top: 2rem;
  padding: 1rem;
  text-align: center;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.loader-animation {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(52, 152, 219, 0.2);
  border-top-color: var(--primary-color, #3498db);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.scroll-hint, .end-message {
  font-size: 0.9rem;
  color: var(--text-color-light, #666);
  padding: 1rem;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.widget-header {
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color, #e1e8ed);
  padding-bottom: 0.5rem;
}

.widget-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

/* Weather widget */
.weather-widget {
  background-color: var(--background-color-alt, #fff);
  border-radius: var(--border-radius, 8px);
  padding: 1.25rem;
  box-shadow: var(--shadow, 0 4px 12px rgba(0, 0, 0, 0.1));
}

.weather-current {
  display: flex;
  margin-bottom: 1.5rem;
}

.weather-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1.5rem;
}

.weather-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.weather-temp {
  font-size: 2rem;
  font-weight: 700;
}

.weather-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.weather-location {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.weather-condition {
  color: var(--text-color-light, #666);
  margin-bottom: 0.25rem;
}

.weather-minmax {
  font-size: 0.9rem;
  color: var(--text-color-light, #666);
}

.weather-forecast {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-top: 1px solid var(--border-color, #e1e8ed);
  border-bottom: 1px solid var(--border-color, #e1e8ed);
  margin-bottom: 1rem;
}

.forecast-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.9rem;
}

.forecast-name {
  margin-bottom: 0.5rem;
}

.forecast-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.weather-footer {
  font-size: 0.8rem;
  color: var(--text-color-light, #666);
}

.weather-extra {
  display: flex;
  justify-content: space-between;
}

/* Editor's picks */
.editors-picks {
  background-color: var(--background-color-alt, #fff);
  border-radius: var(--border-radius, 8px);
  padding: 1.25rem;
  box-shadow: var(--shadow, 0 4px 12px rgba(0, 0, 0, 0.1));
}

.editors-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.editor-article {
  display: flex;
  cursor: pointer;
  transition: transform 0.3s;
}

.editor-article:hover {
  transform: translateY(-3px);
}

.editor-article-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
}

.editor-article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.editor-article-content {
  min-width: 0;
}

.editor-article-category {
  font-size: 0.7rem;
  color: var(--primary-color, #3498db);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.editor-article-headline {
  font-size: 0.95rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.editor-article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-color-light, #666);
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .article-card.large {
    grid-column: span 6;
  }
  
  .article-card.medium {
    grid-column: span 6;
  }
  
  .article-card.small {
    grid-column: span 4;
  }
}

@media (max-width: 992px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .breaking-container {
    grid-template-columns: 1fr;
  }
  
  .article-card.large {
    grid-column: span 12;
  }
  
  .article-card.medium {
    grid-column: span 6;
  }
  
  .article-card.small {
    grid-column: span 6;
  }
}

@media (max-width: 768px) {
  .headlines-container {
    padding: 1rem;
  }
  
  .article-card.large,
  .article-card.medium,
  .article-card.small {
    grid-column: span 12;
  }
  
  .breaking-card {
    flex-direction: column;
  }
  
  .breaking-card .card-image {
    width: 100%;
    height: 200px;
  }
  
  .category-button {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .article-card.large .card-image,
  .article-card.medium .card-image,
  .article-card.small .card-image {
    height: 180px;
  }
  
  .weather-current {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .weather-main {
    margin-right: 0;
    margin-bottom: 1rem;
  }
}
</style>