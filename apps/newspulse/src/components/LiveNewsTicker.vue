<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

// Mock news data
const newsItems = ref([
  {
    id: 1,
    type: 'breaking',
    category: 'Politics',
    headline: 'Major reform bill passes with bipartisan support',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    id: 2,
    type: 'markets',
    category: 'Finance',
    headline: 'Global markets surge as interest rates stabilize',
    timestamp: new Date(Date.now() - 1000 * 60 * 32), // 32 minutes ago
  },
  {
    id: 3,
    type: 'update',
    category: 'Technology',
    headline: 'Tech giant unveils AI-powered healthcare solution',
    timestamp: new Date(Date.now() - 1000 * 60 * 48), // 48 minutes ago
  },
  {
    id: 4,
    type: 'breaking',
    category: 'World',
    headline: 'Peace talks resume in conflict region',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: 5,
    type: 'update',
    category: 'Science',
    headline: 'Climate scientists report breakthrough in carbon capture',
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
  },
  {
    id: 6,
    type: 'markets',
    category: 'Crypto',
    headline: 'Bitcoin surpasses $100,000 mark for first time',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
  },
  {
    id: 7,
    type: 'update',
    category: 'Sports',
    headline: 'National team advances to finals after stunning upset',
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
  },
]);

// Control states
const isPaused = ref(false);
const isReversed = ref(false);
const tickerRef = ref(null);
const tickerContentRef = ref(null);
const animationSpeed = ref(20); // seconds for one loop

// Timer for live updates
let updateTimer = null;

// Format relative time
const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const diff = now - timestamp;
  
  // Less than a minute
  if (diff < 60 * 1000) {
    return 'Just now';
  }
  // Less than an hour
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}m ago`;
  }
  // Less than a day
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}h ago`;
  }
  
  // For older news
  return 'Today';
};

// Get CSS variables for animation
const animationVars = computed(() => {
  const direction = isReversed.value ? 'reverse' : 'normal';
  const playState = isPaused.value ? 'paused' : 'running';
  
  return {
    '--animation-direction': direction,
    '--animation-state': playState,
    '--animation-duration': `${animationSpeed.value}s`
  };
});

// Icon based on news type
const getNewsIcon = (type) => {
  switch (type) {
    case 'breaking':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
    case 'markets':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>';
    case 'update':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    default:
      return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  }
};

// Toggle pause state
const togglePause = () => {
  isPaused.value = !isPaused.value;
};

// Toggle direction
const toggleDirection = () => {
  isReversed.value = !isReversed.value;
};

// Adjust animation speed based on content width
const adjustAnimationSpeed = () => {
  if (tickerContentRef.value && tickerRef.value) {
    const contentWidth = tickerContentRef.value.scrollWidth;
    const containerWidth = tickerRef.value.clientWidth;
    
    // Adjust speed proportionally to content length
    // Base speed of 20s for content that's 2x the container width
    const ratio = contentWidth / containerWidth;
    animationSpeed.value = Math.max(10, Math.min(30, ratio * 10));
  }
};

// Simulate adding new breaking news
const addNewNewsItem = () => {
  const breakingNews = {
    id: Date.now(),
    type: 'breaking',
    category: 'Just In',
    headline: 'Breaking: New live update added to news ticker',
    timestamp: new Date(),
  };
  
  // Add to beginning of the array
  newsItems.value.unshift(breakingNews);
  
  // Remove the oldest item if we have too many
  if (newsItems.value.length > 10) {
    newsItems.value.pop();
  }
  
  // Re-adjust animation speed for new content
  setTimeout(adjustAnimationSpeed, 100);
};

onMounted(() => {
  adjustAnimationSpeed();
  window.addEventListener('resize', adjustAnimationSpeed);
  
  // Setup timer for simulating live updates
  updateTimer = setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance to add news every minute
      addNewNewsItem();
    }
  }, 60000); // Check every minute
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', adjustAnimationSpeed);
  if (updateTimer) {
    clearInterval(updateTimer);
  }
});
</script>

<template>
  <div 
    class="news-ticker-container"
    v-voix="'Live news ticker'"
    hint="Horizontally scrolling live news updates"
  >
    <div class="ticker-header">
      <div class="live-indicator">
        <span class="live-text">LIVE</span>
        <span class="live-dot"></span>
      </div>
      
      <div class="ticker-controls">
        <button 
          @click="togglePause" 
          class="control-button"
          v-voix="isPaused ? 'Play news ticker' : 'Pause news ticker'"
          :hint="isPaused ? 'Resume scrolling' : 'Pause scrolling'"
        >
          <span v-if="isPaused">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </span>
          <span v-else>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          </span>
        </button>
        <button 
          @click="toggleDirection" 
          class="control-button"
          v-voix="'Change ticker direction'"
          hint="Change scroll direction"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </button>
      </div>
    </div>
    
    <div 
      ref="tickerRef"
      class="ticker" 
      :style="animationVars"
    >
      <div 
        ref="tickerContentRef"
        class="ticker-content"
        @mouseover="isPaused = true"
        @mouseleave="isPaused = false"
      >
        <div 
          v-for="item in newsItems" 
          :key="item.id" 
          class="news-item"
          :class="'news-' + item.type"
        >
          <div class="news-icon" v-html="getNewsIcon(item.type)"></div>
          <div class="news-category">{{ item.category }}</div>
          <div class="news-headline">{{ item.headline }}</div>
          <div class="news-time">{{ formatRelativeTime(item.timestamp) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-ticker-container {
  width: 100%;
  background-color: var(--background-color-alt, #fff);
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--shadow, 0 4px 12px rgba(0, 0, 0, 0.1));
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.ticker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--border-color, #e1e8ed);
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.live-text {
  font-weight: bold;
  font-size: 0.9rem;
  color: var(--accent-color, #e74c3c);
  letter-spacing: 0.05em;
}

.live-dot {
  width: 8px;
  height: 8px;
  background-color: var(--accent-color, #e74c3c);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}

.ticker-controls {
  display: flex;
  gap: 0.5rem;
}

.control-button {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-color-light, #666);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  transition: all 0.2s;
}

.control-button:hover {
  background-color: var(--background-color, #f8f9fa);
  color: var(--text-color, #333);
}

.ticker {
  position: relative;
  height: 3rem;
  overflow: hidden;
}

.ticker-content {
  position: absolute;
  white-space: nowrap;
  will-change: transform;
  animation: ticker var(--animation-duration) linear infinite;
  animation-direction: var(--animation-direction);
  animation-play-state: var(--animation-state);
  display: flex;
}

@keyframes ticker {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.news-item {
  display: inline-flex;
  align-items: center;
  height: 3rem;
  padding: 0 1.5rem;
  position: relative;
}

.news-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--border-color, #e1e8ed);
}

.news-icon {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
}

.news-category {
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-right: 0.5rem;
}

.news-headline {
  font-size: 0.95rem;
  color: var(--text-color, #333);
  margin-right: 1rem;
}

.news-time {
  font-size: 0.8rem;
  color: var(--text-color-light, #666);
}

/* News type styling */
.news-breaking {
  color: var(--accent-color, #e74c3c);
}

.news-breaking .news-category {
  background-color: rgba(231, 76, 60, 0.1);
  color: var(--accent-color, #e74c3c);
}

.news-markets {
  color: var(--primary-color, #3498db);
}

.news-markets .news-category {
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color, #3498db);
}

.news-update {
  color: var(--secondary-color, #2ecc71);
}

.news-update .news-category {
  background-color: rgba(46, 204, 113, 0.1);
  color: var(--secondary-color, #2ecc71);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .ticker {
    height: 2.5rem;
  }
  
  .news-item {
    height: 2.5rem;
    padding: 0 0.75rem;
  }
  
  .news-headline {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 480px) {
  .news-category {
    display: none;
  }
  
  .news-headline {
    max-width: 150px;
  }
  
  .ticker-header {
    padding: 0.3rem 0.75rem;
  }
}
</style>