<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import LiveNewsTicker from '../components/LiveNewsTicker.vue';
import PersonalizedFeed from '../components/PersonalizedFeed.vue';

const router = useRouter();

// Mock data for featured stories and categories
const headlines = ref([
  {
    id: '1',
    title: 'Climate Summit Reaches Breakthrough Agreement',
    image: 'https://picsum.photos/1200/800?random=1',
    category: 'Environment',
    summary: 'World leaders commit to ambitious carbon reduction targets'
  },
  {
    id: '2',
    title: 'Tech Giants Announce Net-Zero Supply Chains',
    image: 'https://picsum.photos/1200/800?random=2',
    category: 'Technology',
    summary: 'Major companies pledge carbon-neutral operations by 2030'
  },
  {
    id: '3',
    title: 'Extreme Weather Events Linked to Climate Change',
    image: 'https://picsum.photos/1200/800?random=3',
    category: 'Science',
    summary: 'New study finds direct connection between global warming and severe storms'
  },
  {
    id: '4',
    title: 'Breakthrough in Renewable Energy Storage',
    image: 'https://picsum.photos/1200/800?random=4',
    category: 'Technology',
    summary: 'Scientists develop high-capacity battery with sustainable materials'
  },
  {
    id: '5',
    title: 'Global Arts Festival Launches Virtual Experience',
    image: 'https://picsum.photos/1200/800?random=5',
    category: 'Culture',
    summary: 'Innovative platform allows worldwide participation in annual event'
  }
]);

const trendingTopics = ref([
  { name: 'Climate Action', count: 1243 },
  { name: 'AI Ethics', count: 856 },
  { name: 'Space Exploration', count: 721 },
  { name: 'Healthcare Innovation', count: 689 },
  { name: 'Digital Privacy', count: 542 }
]);

const localNews = ref([
  {
    id: '6',
    title: 'City Council Approves Green Infrastructure Plan',
    summary: 'New urban development to include renewable energy and green spaces'
  },
  {
    id: '7',
    title: 'Local Tech Startup Secures Major Investment',
    summary: 'Company focused on sustainable transportation receives $50M funding'
  }
]);

// Reactive elements
const activeHeadlineIndex = ref(0);
const scrollProgress = ref(0);
const isWelcomeVisible = ref(true);

// Auto-rotate featured headlines
let headlineInterval;

const startHeadlineRotation = () => {
  headlineInterval = setInterval(() => {
    activeHeadlineIndex.value = (activeHeadlineIndex.value + 1) % headlines.value.length;
  }, 7000);
};

const stopHeadlineRotation = () => {
  clearInterval(headlineInterval);
};

const activeHeadline = computed(() => headlines.value[activeHeadlineIndex.value]);

const setActiveHeadline = (index) => {
  stopHeadlineRotation();
  activeHeadlineIndex.value = index;
  startHeadlineRotation();
};

const navigateToStory = (storyId) => {
  router.push(`/story/${storyId}`);
};

const trackScroll = () => {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  
  // Update scroll progress for animations
  scrollProgress.value = scrollPosition / windowHeight;
  
  // Hide welcome screen when scrolled past threshold
  if (scrollPosition > windowHeight * 0.3) {
    isWelcomeVisible.value = false;
  } else {
    isWelcomeVisible.value = true;
  }
};

onMounted(() => {
  startHeadlineRotation();
  window.addEventListener('scroll', trackScroll);
});
</script>

<template>
  <div class="home-container">
    <!-- Dynamic welcome screen -->
    <section class="welcome-screen" :class="{ 'visible': isWelcomeVisible }">
      <div class="dynamic-background">
        <div 
          v-for="(headline, index) in headlines" 
          :key="headline.id" 
          class="background-slide" 
          :class="{ 'active': index === activeHeadlineIndex }"
          :style="{ backgroundImage: `url(${headline.image})` }"
        ></div>
      </div>
      
      <div class="overlay"></div>
      
      <div class="welcome-content">
        <h1 class="site-title">NewsPulse</h1>
        <h2 class="welcome-prompt" v-voix="'welcome-prompt'" hint="Click to start exploring stories">What's happening today?</h2>
        
        <div class="featured-headline" @click="navigateToStory(activeHeadline.id)" v-voix="'featured-headline'" hint="Featured story, click to read">
          <div class="headline-category">{{ activeHeadline.category }}</div>
          <h2 class="headline-title">{{ activeHeadline.title }}</h2>
          <p class="headline-summary">{{ activeHeadline.summary }}</p>
          <div class="headline-cta">Read the full story</div>
        </div>
        
        <div class="headline-indicators">
          <button 
            v-for="(headline, index) in headlines" 
            :key="headline.id"
            class="headline-indicator" 
            :class="{ 'active': index === activeHeadlineIndex }"
            @click="setActiveHeadline(index)"
            v-voix="'headline-indicator-' + index"
            :hint="`Switch to headline: ${headline.title}`"
          ></button>
        </div>
        
        <div class="scroll-indicator" v-voix="'scroll-to-explore'" hint="Scroll down to explore more content">
          <span>Scroll to explore</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </div>
      </div>
    </section>
    
    <!-- Main content -->
    <div class="content-container">
      <!-- Live News Ticker -->
      <LiveNewsTicker />
      
      <!-- Personalized Feed Section -->
      <PersonalizedFeed />
      
      <!-- Headlines section with scroll-driven narrative -->
      <section class="headlines-section">
        <h2 class="section-title">Today's Headlines</h2>
        
        <div class="headlines-grid">
          <div 
            v-for="headline in headlines" 
            :key="headline.id" 
            class="headline-card"
            @click="navigateToStory(headline.id)"
            v-voix="'headline-' + headline.id"
            :hint="`${headline.title}: ${headline.summary}`"
          >
            <div class="card-image">
              <img :src="headline.image" :alt="headline.title">
              <div class="card-category">{{ headline.category }}</div>
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ headline.title }}</h3>
              <p class="card-summary">{{ headline.summary }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Context-aware sections -->
      <section class="context-section">
        <div class="context-columns">
          <!-- Trending topics -->
          <div class="trending-topics">
            <h2 class="section-title">Trending Topics</h2>
            <ul class="trending-list">
              <li 
                v-for="topic in trendingTopics" 
                :key="topic.name" 
                class="trending-item"
                v-voix="'trending-' + topic.name.toLowerCase().replace(' ', '-')"
              >
                <span class="topic-name">#{{ topic.name }}</span>
                <span class="topic-count">{{ topic.count }}</span>
              </li>
            </ul>
          </div>
          
          <!-- Local news -->
          <div class="local-news">
            <h2 class="section-title">Near You</h2>
            <div class="local-news-list">
              <div 
                v-for="news in localNews" 
                :key="news.id" 
                class="local-news-item"
                @click="navigateToStory(news.id)"
                v-voix="'local-' + news.id"
                :hint="`Local news: ${news.title}`"
              >
                <h3 class="local-title">{{ news.title }}</h3>
                <p class="local-summary">{{ news.summary }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Interactive personalization -->
      <section class="personalization-section">
        <h2 class="section-title">Discover More</h2>
        
        <div class="category-tabs">
          <button 
            v-for="category in ['For You', 'Technology', 'Environment', 'Culture', 'Science']" 
            :key="category" 
            class="category-tab"
            v-voix="'category-' + category.toLowerCase().replace(' ', '-')"
          >
            {{ category }}
          </button>
        </div>
        
        <div class="voice-control-hint" v-voix="'voice-control-hint'" hint="Information about using voice commands">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          <span>Try saying "Show me technology news" or "Read the headline about climate"</span>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  position: relative;
  width: 100%;
}

/* Welcome screen */
.welcome-screen {
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  overflow: hidden;
  transition: opacity 0.5s;
}

.welcome-screen.visible {
  opacity: 1;
}

.dynamic-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.background-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.background-slide.active {
  opacity: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%);
}

.welcome-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  padding: 0 2rem;
}

.site-title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: 2px;
}

.welcome-prompt {
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 3rem;
}

.featured-headline {
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: left;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
}

.featured-headline:hover {
  transform: translateY(-5px);
  background-color: rgba(0, 0, 0, 0.8);
}

.headline-category {
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.headline-title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.headline-summary {
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.headline-cta {
  color: #3498db;
  font-weight: 600;
}

.headline-indicators {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 3rem;
}

.headline-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.headline-indicator.active {
  background-color: white;
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce 2s infinite;
  cursor: pointer;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

/* Content container */
.content-container {
  background-color: #f8f9fa;
}

/* Headlines section */
.headlines-section {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.headlines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.headline-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  cursor: pointer;
}

.headline-card:hover {
  transform: translateY(-5px);
}

.card-image {
  position: relative;
  height: 200px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: #3498db;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.card-summary {
  font-size: 0.9rem;
  color: #666;
}

/* Context section */
.context-section {
  background-color: #fff;
  padding: 5rem 2rem;
}

.context-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.trending-list {
  list-style: none;
  padding: 0;
}

.trending-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s;
  cursor: pointer;
}

.trending-item:hover {
  background-color: #f8f9fa;
}

.topic-count {
  background-color: #f0f0f0;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.local-news-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.local-news-item {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
}

.local-news-item:hover {
  transform: translateY(-3px);
  background-color: #f0f0f0;
}

.local-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.local-summary {
  font-size: 0.9rem;
  color: #666;
}

/* Personalization section */
.personalization-section {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.category-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.category-tab {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.category-tab:hover {
  background-color: #3498db;
  color: white;
  border-color: #3498db;
}

.voice-control-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 3rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 8px;
  color: #666;
}

/* Media queries */
@media (max-width: 768px) {
  .site-title {
    font-size: 3rem;
  }
  
  .welcome-prompt {
    font-size: 1.5rem;
  }
  
  .headline-title {
    font-size: 1.5rem;
  }
  
  .context-columns {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}
</style>