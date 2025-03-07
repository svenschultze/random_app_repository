<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { 
  searchVideos, 
  getChannelById, 
  formatViewCount, 
  formatUploadDate 
} from '../stores/videoStore'

const route = useRoute()
const searchResults = ref([])
const query = ref('')

// Enhanced search result with channel info
const enhancedResults = computed(() => {
  return searchResults.value.map(video => {
    const channel = getChannelById(video.channelId)
    return {
      ...video,
      channelName: channel.name,
      channelImage: channel.profilePicture
    }
  })
})

const performSearch = () => {
  if (query.value) {
    searchResults.value = searchVideos(query.value)
  } else {
    searchResults.value = []
  }
}

watch(() => route.query.q, (newQuery) => {
  query.value = newQuery || ''
  performSearch()
})

onMounted(() => {
  query.value = route.query.q || ''
  performSearch()
})
</script>

<template>
  <div class="search-container">
    <h1 class="search-header">
      Search results for "{{ query }}"
    </h1>
    
    <div v-if="enhancedResults.length > 0" class="search-results">
      <div 
        v-for="result in enhancedResults" 
        :key="result.id" 
        class="search-result-item"
      >
        <RouterLink 
          :to="`/watch/${result.id}`" 
          class="result-thumbnail"
          v-voix="`SearchResultThumbnail-${result.id}`"
          :hint="`Watch video: ${result.title}`"
        >
          <img 
            :src="result.thumbnailUrl" 
            :alt="result.title" 
            class="thumbnail-img"
          />
          <span class="duration">{{ result.duration }}</span>
        </RouterLink>
        
        <div class="result-details">
          <RouterLink 
            :to="`/watch/${result.id}`"
            class="result-title-link"
            v-voix="`SearchResultTitle-${result.id}`"
            :hint="`Watch video: ${result.title}`"
          >
            <h3 class="result-title">{{ result.title }}</h3>
          </RouterLink>
          
          <div class="result-meta">
            <span>{{ formatViewCount(result.views) }} views</span>
            <span class="dot-separator">•</span>
            <span>{{ formatUploadDate(result.uploadDate) }}</span>
          </div>
          
          <RouterLink 
            :to="`/channel/${result.channelId}`" 
            class="result-channel"
            v-voix="`SearchResultChannel-${result.channelId}`"
            :hint="`Go to ${result.channelName}'s channel`"
          >
            <img 
              :src="result.channelImage" 
              :alt="result.channelName" 
              class="channel-img"
            />
            <span class="channel-name">{{ result.channelName }}</span>
          </RouterLink>
          
          <p class="result-description">{{ result.description }}</p>
        </div>
      </div>
    </div>
    
    <div v-else-if="query" class="no-results">
      <p>No videos found matching "{{ query }}"</p>
    </div>
    
    <div v-else class="no-query">
      <p>Enter a search term to find videos</p>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 0;
}

.search-header {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  color: #0f0f0f;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-result-item {
  display: flex;
  gap: 1rem;
}

.result-thumbnail {
  position: relative;
  width: 320px;
  height: 180px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.result-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.result-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  color: #0f0f0f;
}

.result-meta {
  font-size: 0.9rem;
  color: #606060;
  margin-bottom: 0.5rem;
}

.dot-separator {
  margin: 0 4px;
}

.result-channel {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.channel-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.channel-name {
  font-size: 0.9rem;
  color: #606060;
}

.result-description {
  font-size: 0.9rem;
  line-height: 1.4;
  color: #606060;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.no-results, .no-query {
  text-align: center;
  padding: 3rem 0;
  color: #606060;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .search-result-item {
    flex-direction: column;
  }
  
  .result-thumbnail {
    width: 100%;
    height: 0;
    padding-top: 56.25%; /* 16:9 aspect ratio */
  }
  
  .thumbnail-img {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>