<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Mock data for personalized articles
const recommendations = ref([
  {
    id: 'p1',
    title: 'The Future of Renewable Energy: Breakthroughs in Solar Technology',
    summary: 'Revolutionary new solar panels achieve record efficiency levels, potentially transforming global energy markets',
    category: 'Technology',
    image: 'https://picsum.photos/400/240?random=101',
    source: 'Tech Today',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    readingTime: 6,
    reason: 'Based on your interests in technology',
    saved: false
  },
  {
    id: 'p2',
    title: 'Global Climate Summit Achieves Unexpected Breakthrough Agreement',
    summary: 'World leaders reach consensus on ambitious carbon reduction targets after marathon negotiation session',
    category: 'Environment',
    image: 'https://picsum.photos/400/240?random=102',
    source: 'World News',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    readingTime: 8,
    reason: 'Trending in your area',
    saved: true
  },
  {
    id: 'p3',
    title: 'Artificial Intelligence in Healthcare: Ethical Considerations',
    summary: 'As AI diagnostics become mainstream, experts debate important ethical questions about privacy and decision-making',
    category: 'Health',
    image: 'https://picsum.photos/400/240?random=103',
    source: 'Medical Journal',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    readingTime: 10,
    reason: 'Similar to articles you\'ve read',
    saved: false
  },
  {
    id: 'p4',
    title: 'Financial Markets React to Central Bank Policy Shift',
    summary: 'Investors recalibrate strategies as central banks signal new approach to inflation and interest rates',
    category: 'Finance',
    image: 'https://picsum.photos/400/240?random=104',
    source: 'Financial Times',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    readingTime: 5,
    reason: 'Based on your reading history',
    saved: false
  },
  {
    id: 'p5',
    title: 'Remote Work Revolution: Companies Adopt Hybrid Models',
    summary: 'Major corporations finalize plans for permanent flexible work arrangements following pandemic shift',
    category: 'Business',
    image: 'https://picsum.photos/400/240?random=105',
    source: 'Business Insider',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    readingTime: 7,
    reason: 'Recommended for you',
    saved: false
  },
  {
    id: 'p6',
    title: 'Advances in Quantum Computing Breaking New Ground',
    summary: 'Scientists achieve quantum advantage in solving previously intractable problems',
    category: 'Science',
    image: 'https://picsum.photos/400/240?random=106',
    source: 'Science Daily',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
    readingTime: 11,
    reason: 'Based on your interests in technology',
    saved: false
  }
]);

// Toggle saved state
const toggleSaved = (article) => {
  article.saved = !article.saved;
};

// Dismiss an article
const dismissArticle = (id) => {
  const index = recommendations.value.findIndex(article => article.id === id);
  if (index !== -1) {
    recommendations.value.splice(index, 1);
  }
};

// Navigate to article
const navigateToArticle = (id) => {
  router.push(`/story/${id}`);
};

// Format publish date
const formatPublishDate = (date) => {
  const now = new Date();
  const diff = now - date;
  
  // Less than a day
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  // Less than a week
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
  
  // Format as MM/DD/YYYY
  return date.toLocaleDateString();
};

// Scroll controls
const scrollContainer = ref(null);

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -300, behavior: 'smooth' });
  }
};

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 300, behavior: 'smooth' });
  }
};

// Lazy load with fade-in effect
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  const cards = document.querySelectorAll('.article-card');
  cards.forEach(card => {
    observer.observe(card);
  });
});
</script>

<template>
  <section 
    class="personalized-feed"
    v-voix="'Personalized article recommendations'"
    hint="Content recommended based on your interests and reading history"
  >
    <div class="section-header">
      <div class="header-content">
        <h2 class="section-title">Just For You</h2>
        <p class="section-description">
          Content personalized to your interests and reading preferences
        </p>
      </div>
      
      <div class="carousel-controls">
        <button 
          @click="scrollLeft" 
          class="control-button left"
          v-voix="'Scroll left'"
          hint="Scroll to previous recommendations"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button 
          @click="scrollRight" 
          class="control-button right"
          v-voix="'Scroll right'"
          hint="Scroll to more recommendations"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
    
    <div 
      ref="scrollContainer"
      class="recommendations-carousel"
    >
      <div 
        v-for="article in recommendations" 
        :key="article.id" 
        class="article-card"
        v-voix="'Article: ' + article.title"
        :hint="article.summary"
      >
        <div class="card-image">
          <img :src="article.image" :alt="article.title">
          <div class="card-category">{{ article.category }}</div>
          <div class="reason-tag">{{ article.reason }}</div>
        </div>
        
        <div class="card-content" @click="navigateToArticle(article.id)">
          <h3 class="card-title">{{ article.title }}</h3>
          <p class="card-summary">{{ article.summary }}</p>
          
          <div class="card-meta">
            <div class="meta-source">
              <span class="source-name">{{ article.source }}</span>
              <span class="meta-divider">·</span>
              <span class="publish-date">{{ formatPublishDate(article.publishDate) }}</span>
            </div>
            <div class="reading-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              {{ article.readingTime }} min read
            </div>
          </div>
        </div>
        
        <div class="card-actions">
          <button 
            class="action-button save"
            :class="{ 'saved': article.saved }"
            @click="toggleSaved(article)"
            v-voix="article.saved ? 'Unsave article' : 'Save article'"
            :hint="article.saved ? 'Remove from saved articles' : 'Save for later reading'"
          >
            <svg v-if="!article.saved" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          </button>
          
          <button 
            class="action-button share"
            v-voix="'Share article'"
            hint="Share this article"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          </button>
          
          <button 
            class="action-button dismiss"
            @click.stop="dismissArticle(article.id)"
            v-voix="'Dismiss recommendation'"
            hint="Remove this recommendation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.personalized-feed {
  background-color: var(--background-color-alt, #fff);
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--shadow, 0 4px 12px rgba(0, 0, 0, 0.1));
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.header-content {
  flex: 1;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-color, #333);
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 40px;
  height: 3px;
  background-color: var(--primary-color, #3498db);
}

.section-description {
  font-size: 0.95rem;
  color: var(--text-color-light, #666);
  margin-top: 1rem;
}

.carousel-controls {
  display: flex;
  gap: 0.5rem;
}

.control-button {
  background-color: var(--background-color, #f8f9fa);
  border: 1px solid var(--border-color, #e1e8ed);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.control-button:hover {
  background-color: var(--primary-color, #3498db);
  color: white;
  border-color: var(--primary-color, #3498db);
}

.recommendations-carousel {
  display: flex;
  overflow-x: auto;
  gap: 1.25rem;
  padding: 0.5rem 0.25rem;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color, #e1e8ed) transparent;
}

.recommendations-carousel::-webkit-scrollbar {
  height: 6px;
}

.recommendations-carousel::-webkit-scrollbar-track {
  background: transparent;
}

.recommendations-carousel::-webkit-scrollbar-thumb {
  background-color: var(--border-color, #e1e8ed);
  border-radius: 20px;
}

.article-card {
  flex: 0 0 340px;
  border-radius: var(--border-radius, 8px);
  overflow: hidden;
  background-color: var(--background-color, #f8f9fa);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.6s forwards;
  animation-delay: calc(var(--i, 0) * 0.1s);
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.article-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card-image {
  position: relative;
  height: 180px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-category {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: var(--primary-color, #3498db);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

.reason-tag {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.card-content {
  padding: 1.25rem;
  cursor: pointer;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-color, #333);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-summary {
  font-size: 0.9rem;
  color: var(--text-color-light, #666);
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-color-light, #666);
}

.meta-source {
  display: flex;
  align-items: center;
}

.source-name {
  font-weight: 600;
}

.meta-divider {
  margin: 0 0.3rem;
}

.reading-time {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  padding: 0 1.25rem 1.25rem;
  gap: 0.75rem;
}

.action-button {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-color-light, #666);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: var(--background-color-mute, #f0f0f0);
  color: var(--text-color, #333);
}

.action-button.save.saved {
  color: var(--primary-color, #3498db);
}

/* Mobile responsive design */
@media (max-width: 768px) {
  .personalized-feed {
    padding: 1rem;
  }
  
  .article-card {
    flex: 0 0 280px;
  }
  
  .card-image {
    height: 160px;
  }
  
  .section-header {
    flex-direction: column;
  }
  
  .carousel-controls {
    align-self: flex-end;
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .article-card {
    flex: 0 0 240px;
  }
  
  .card-image {
    height: 140px;
  }
  
  .card-title {
    font-size: 1rem;
  }
  
  .card-summary {
    font-size: 0.85rem;
    -webkit-line-clamp: 2;
  }
  
  .card-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>