<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const storyId = computed(() => route.params.id);
const story = ref(null);
const loading = ref(true);
const scrollProgress = ref(0);
const activeSection = ref(0);

// Mock data for now - would be replaced with API calls
const fetchStory = async (id) => {
  // Simulate API fetch delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock story data
  return {
    id,
    headline: 'Climate Summit Reaches Breakthrough Agreement',
    subheadline: 'World leaders commit to ambitious carbon reduction targets',
    author: 'Jane Doe',
    date: 'March 6, 2025',
    heroImage: 'https://picsum.photos/1200/800',
    sections: [
      {
        id: 'intro',
        title: 'The Agreement',
        content: 'After two weeks of intense negotiations, world leaders at the Global Climate Summit have reached a historic agreement to limit global warming to 1.5 degrees Celsius above pre-industrial levels. The accord represents the most ambitious climate action plan to date, with binding commitments from both developed and developing nations.',
        media: {
          type: 'image',
          url: 'https://picsum.photos/800/600',
          caption: 'Delegates celebrating the agreement'
        }
      },
      {
        id: 'key-points',
        title: 'Key Points',
        content: 'The agreement includes several groundbreaking provisions: mandatory emissions cuts of 50% by 2030, establishment of a $100 billion climate fund, phasing out of coal power by 2035, and a global carbon pricing mechanism. Critics argue that while significant, these measures may still be insufficient to prevent the worst impacts of climate change.',
        media: {
          type: 'chart',
          chartData: {
            labels: ['2025', '2030', '2035', '2040', '2045', '2050'],
            datasets: [
              { label: 'Business as usual', data: [100, 110, 120, 130, 140, 150] },
              { label: 'New agreement', data: [100, 70, 50, 35, 25, 15] }
            ]
          },
          caption: 'Projected emissions reduction under new agreement'
        }
      },
      {
        id: 'reactions',
        title: 'Global Reactions',
        content: 'Reaction to the agreement has been largely positive, with environmental groups cautiously optimistic. "This is a turning point," said Greenpeace director Maria Chen. "For the first time, we see concrete action matching the scale of the crisis." Market analysts predict a surge in renewable energy investments following the announcement.',
        media: {
          type: 'social',
          tweets: [
            { user: '@GreenpeaceIntl', content: 'A historic day for our planet. The real work begins now. #ClimateAction' },
            { user: '@UNClimateChange', content: 'Today marks a turning point in global climate policy. Congratulations to all delegations for their tireless work.' }
          ]
        }
      },
      {
        id: 'analysis',
        title: 'What This Means For You',
        content: 'The agreement will have far-reaching implications for everyday life. Consumers can expect accelerated transitions to electric vehicles, increased availability of renewable energy options, and potential carbon taxes on certain goods. However, the agreement also promises job creation in green industries and improved air quality in urban areas.',
        media: {
          type: 'video',
          placeholder: 'https://picsum.photos/800/450',
          caption: 'How the climate agreement affects daily life'
        }
      },
      {
        id: 'timeline',
        title: 'Road to Implementation',
        content: 'Implementation of the agreement begins immediately, with the first progress reviews scheduled for 2026. Nations must submit detailed action plans within six months, and a new international monitoring body will track compliance. The next five years are considered critical for establishing the infrastructure and policies needed to meet the 2030 targets.',
        media: {
          type: 'timeline',
          events: [
            { year: '2025', event: 'Agreement signed' },
            { year: '2026', event: 'First progress review' },
            { year: '2030', event: '50% emissions reduction target' },
            { year: '2035', event: 'Coal phase-out deadline' },
            { year: '2050', event: 'Carbon neutrality goal' }
          ]
        }
      }
    ],
    relatedStories: [
      { id: '2', title: 'Tech Giants Announce Net-Zero Supply Chains', image: 'https://picsum.photos/300/200' },
      { id: '3', title: 'Extreme Weather Events Linked to Climate Change', image: 'https://picsum.photos/300/200' }
    ]
  };
};

const handleScroll = () => {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  
  // Calculate scroll progress (0 to 100)
  scrollProgress.value = (scrollPosition / (documentHeight - windowHeight)) * 100;
  
  // Determine active section based on scroll position
  if (story.value) {
    const sections = document.querySelectorAll('.story-section');
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2) {
        activeSection.value = index;
      }
    });
  }
};

onMounted(async () => {
  // Fetch story data
  story.value = await fetchStory(storyId.value);
  loading.value = false;
  
  // Set up scroll event listener
  window.addEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="story-container">
    <div v-if="loading" class="loading-container">
      <div class="loading-indicator" v-voix="'loading-indicator'" hint="Please wait while the story loads">Loading story...</div>
    </div>
    
    <div v-else class="story-content">
      <!-- Progress indicator -->
      <div class="progress-bar">
        <div class="progress-indicator" :style="{ width: `${scrollProgress}%` }"></div>
      </div>
      
      <!-- Hero section -->
      <section class="hero-section" v-voix="'story-hero-section'">
        <div class="overlay"></div>
        <img :src="story.heroImage" alt="Story hero image" class="hero-image">
        <div class="hero-content">
          <h1 class="headline">{{ story.headline }}</h1>
          <h2 class="subheadline">{{ story.subheadline }}</h2>
          <div class="story-meta">
            <span class="author">By {{ story.author }}</span>
            <span class="date">{{ story.date }}</span>
          </div>
          <div class="scroll-indicator" v-voix="'scroll-down-indicator'" hint="Scroll down to start reading">
            <span>Scroll to begin</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </div>
        </div>
      </section>
      
      <!-- Story sections -->
      <div v-for="(section, index) in story.sections" :key="section.id" class="story-section" :class="{ 'active': activeSection === index }">
        <div class="section-content">
          <h2 class="section-title">{{ section.title }}</h2>
          <div class="section-text">{{ section.content }}</div>
          
          <!-- Different media types -->
          <div class="media-container" v-if="section.media">
            <!-- Image -->
            <div v-if="section.media.type === 'image'" class="media-image">
              <img :src="section.media.url" :alt="section.media.caption">
              <p class="caption">{{ section.media.caption }}</p>
            </div>
            
            <!-- Chart (placeholder) -->
            <div v-else-if="section.media.type === 'chart'" class="media-chart" v-voix="'chart-' + section.id" hint="Interactive chart showing data relevant to this section">
              <div class="chart-placeholder">
                <h3>Emissions Reduction Projection</h3>
                <div class="mock-chart">
                  <div v-for="(year, i) in section.media.chartData.labels" :key="i" class="chart-column">
                    <div class="chart-bar business" :style="{ height: section.media.chartData.datasets[0].data[i] * 0.5 + 'px' }"></div>
                    <div class="chart-bar agreement" :style="{ height: section.media.chartData.datasets[1].data[i] * 0.5 + 'px' }"></div>
                    <span class="chart-label">{{ year }}</span>
                  </div>
                </div>
                <div class="chart-legend">
                  <div class="legend-item">
                    <div class="legend-color business"></div>
                    <span>Business as usual</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color agreement"></div>
                    <span>New agreement</span>
                  </div>
                </div>
              </div>
              <p class="caption">{{ section.media.caption }}</p>
            </div>
            
            <!-- Social media -->
            <div v-else-if="section.media.type === 'social'" class="media-social" v-voix="'social-media-' + section.id" hint="Social media reactions to this story">
              <div class="social-container">
                <div v-for="(tweet, i) in section.media.tweets" :key="i" class="tweet">
                  <div class="tweet-header">
                    <span class="tweet-user">{{ tweet.user }}</span>
                  </div>
                  <div class="tweet-content">{{ tweet.content }}</div>
                </div>
              </div>
            </div>
            
            <!-- Video placeholder -->
            <div v-else-if="section.media.type === 'video'" class="media-video" v-voix="'video-' + section.id" hint="Video content related to this section">
              <div class="video-placeholder">
                <img :src="section.media.placeholder" alt="Video thumbnail">
                <div class="play-button" v-voix="'play-video-' + section.id">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                </div>
              </div>
              <p class="caption">{{ section.media.caption }}</p>
            </div>
            
            <!-- Timeline -->
            <div v-else-if="section.media.type === 'timeline'" class="media-timeline" v-voix="'timeline-' + section.id" hint="Timeline of key events">
              <div class="timeline-container">
                <div class="timeline-line"></div>
                <div v-for="(item, i) in section.media.events" :key="i" class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-year">{{ item.year }}</div>
                  <div class="timeline-event">{{ item.event }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Related stories -->
      <section class="related-stories">
        <h2>Related Stories</h2>
        <div class="stories-grid">
          <div v-for="story in story.relatedStories" :key="story.id" class="related-story-card" v-voix="'related-story-' + story.id">
            <router-link :to="`/story/${story.id}`">
              <img :src="story.image" :alt="story.title">
              <h3>{{ story.title }}</h3>
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.story-container {
  position: relative;
  width: 100%;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.loading-indicator {
  font-size: 1.5rem;
  color: var(--color-text);
}

.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: 100;
}

.progress-indicator {
  height: 100%;
  background-color: #3498db;
  transition: width 0.3s;
}

/* Hero section */
.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.hero-content {
  position: relative;
  max-width: 800px;
  padding: 0 2rem;
  text-align: center;
  z-index: 1;
}

.headline {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.subheadline {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 400;
}

.story-meta {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  font-size: 1rem;
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

/* Story sections */
.story-section {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 0;
  opacity: 0.7;
  transition: opacity 0.5s, transform 0.5s;
}

.story-section.active {
  opacity: 1;
}

.section-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.section-text {
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 2rem;
}

/* Media containers */
.media-container {
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.media-container img {
  width: 100%;
  display: block;
}

.caption {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: #666;
  background-color: #f9f9f9;
}

/* Chart styles */
.chart-placeholder {
  padding: 2rem;
  background-color: white;
}

.chart-placeholder h3 {
  margin-bottom: 1rem;
  text-align: center;
}

.mock-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 250px;
  border-bottom: 2px solid #ddd;
  margin-bottom: 1rem;
}

.chart-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
}

.chart-bar {
  width: 20px;
  transition: height 1s ease-out;
}

.chart-bar.business {
  background-color: #e74c3c;
}

.chart-bar.agreement {
  background-color: #2ecc71;
}

.chart-label {
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.legend-color.business {
  background-color: #e74c3c;
}

.legend-color.agreement {
  background-color: #2ecc71;
}

/* Social media styles */
.social-container {
  padding: 1rem;
  background-color: #f8f9fa;
}

.tweet {
  background-color: white;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.tweet-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.tweet-user {
  font-weight: bold;
  color: #1da1f2;
}

/* Video styles */
.video-placeholder {
  position: relative;
  cursor: pointer;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
}

.play-button:hover {
  background-color: rgba(255, 255, 255, 1);
}

/* Timeline styles */
.timeline-container {
  position: relative;
  padding: 2rem 0;
  background-color: white;
}

.timeline-line {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 100%;
  background-color: #3498db;
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  display: flex;
  margin-bottom: 2rem;
}

.timeline-item:nth-child(odd) {
  flex-direction: row-reverse;
}

.timeline-dot {
  position: absolute;
  top: 0;
  left: 50%;
  width: 20px;
  height: 20px;
  background-color: #3498db;
  border-radius: 50%;
  transform: translateX(-50%);
}

.timeline-year {
  width: 30%;
  font-weight: bold;
  text-align: center;
}

.timeline-event {
  width: 40%;
  padding: 0 1rem;
}

/* Related stories */
.related-stories {
  padding: 4rem 2rem;
  background-color: #f8f9fa;
}

.related-stories h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.related-story-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.related-story-card:hover {
  transform: translateY(-5px);
}

.related-story-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.related-story-card h3 {
  padding: 1rem;
  margin: 0;
  background-color: white;
}

/* Media queries */
@media (max-width: 768px) {
  .headline {
    font-size: 2rem;
  }
  
  .subheadline {
    font-size: 1.2rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-text {
    font-size: 1rem;
  }
  
  .timeline-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .timeline-item:nth-child(odd) {
    flex-direction: column;
    align-items: center;
  }
  
  .timeline-year, .timeline-event {
    width: 80%;
    margin-top: 1.5rem;
  }
}
</style>