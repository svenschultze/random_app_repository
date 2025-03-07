<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import VideoCard from '../components/VideoCard.vue'
import { 
  getChannelById, 
  getAllVideos, 
  formatViewCount,
  currentUser
} from '../stores/videoStore'

const route = useRoute()
const channel = ref(null)
const videos = ref([])
const activeTab = ref('videos')

const isSubscribed = computed(() => {
  return currentUser.subscriptions.includes(channel.value?.id)
})

const channelVideos = computed(() => {
  return videos.value.filter(video => video.channelId === channel.value?.id)
})

const handleSubscribe = () => {
  // In a real app, this would send a request to the API
  if (isSubscribed.value) {
    // Logic for unsubscribe would go here
  } else {
    // Logic for subscribe would go here
  }
}

const setActiveTab = (tab) => {
  activeTab.value = tab
}

onMounted(() => {
  const channelId = route.params.channelId
  
  // In a real app, this would fetch channel data from an API
  channel.value = getChannelById(channelId)
  videos.value = getAllVideos()
})
</script>

<template>
  <div v-if="channel" class="channel-container">
    <div class="channel-banner">
      <img :src="channel.bannerImage" :alt="`${channel.name} banner`" class="banner-img" />
    </div>
    
    <div class="channel-header">
      <div class="channel-info">
        <img 
          :src="channel.profilePicture" 
          :alt="channel.name" 
          class="channel-img"
        />
        
        <div class="channel-details">
          <h1 class="channel-name">{{ channel.name }}</h1>
          <p class="channel-subscribers">{{ formatViewCount(channel.subscribers) }} subscribers</p>
        </div>
      </div>
      
      <button 
        @click="handleSubscribe" 
        class="subscribe-button" 
        :class="{ 'subscribed': isSubscribed }"
        v-voix="'SubscribeChannelButton'"
        :hint="isSubscribed ? 'Unsubscribe from this channel' : 'Subscribe to this channel'"
      >
        {{ isSubscribed ? 'Subscribed' : 'Subscribe' }}
      </button>
    </div>
    
    <div class="channel-description">
      <p>{{ channel.description }}</p>
    </div>
    
    <div class="channel-tabs">
      <button 
        @click="setActiveTab('videos')" 
        class="tab-button" 
        :class="{ 'active': activeTab === 'videos' }"
        v-voix="'VideosTab'"
        hint="Show channel videos"
      >
        VIDEOS
      </button>
      <button 
        @click="setActiveTab('about')" 
        class="tab-button" 
        :class="{ 'active': activeTab === 'about' }"
        v-voix="'AboutTab'"
        hint="Show channel information"
      >
        ABOUT
      </button>
    </div>
    
    <div v-if="activeTab === 'videos'" class="channel-videos">
      <div class="videos-grid">
        <VideoCard 
          v-for="video in channelVideos" 
          :key="video.id" 
          :video="video" 
        />
      </div>
      
      <div v-if="channelVideos.length === 0" class="no-videos">
        <p>This channel hasn't uploaded any videos yet.</p>
      </div>
    </div>
    
    <div v-if="activeTab === 'about'" class="channel-about">
      <div class="about-section">
        <h3>Description</h3>
        <p>{{ channel.description }}</p>
      </div>
      
      <div class="stats-section">
        <h3>Stats</h3>
        <p>Joined: January 1, 2023</p>
        <p>{{ formatViewCount(channel.subscribers) }} subscribers</p>
        <p>{{ channelVideos.length }} videos</p>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <p>Loading channel...</p>
  </div>
</template>

<style scoped>
.channel-container {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
}

.channel-banner {
  width: 100%;
  height: 200px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.channel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.channel-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.channel-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.channel-name {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
}

.channel-subscribers {
  font-size: 0.9rem;
  color: #606060;
  margin: 0;
}

.subscribe-button {
  background-color: #cc0000;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 2px;
  cursor: pointer;
}

.subscribe-button.subscribed {
  background-color: #f0f0f0;
  color: #606060;
}

.channel-description {
  padding: 1rem 0;
  font-size: 0.9rem;
  line-height: 1.4;
  border-bottom: 1px solid #e0e0e0;
}

.channel-tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin: 1rem 0;
}

.tab-button {
  background: none;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #606060;
  cursor: pointer;
  position: relative;
}

.tab-button.active {
  color: #0f0f0f;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #0f0f0f;
}

.channel-videos {
  padding: 1rem 0;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

.channel-about {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 0;
}

.about-section, .stats-section {
  padding: 1rem 0;
}

.about-section h3, .stats-section h3 {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.no-videos {
  text-align: center;
  padding: 3rem 0;
  color: #606060;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.2rem;
  color: #606060;
}

@media (min-width: 640px) {
  .videos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .videos-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .channel-about {
    flex-direction: row;
  }
  
  .about-section {
    flex: 2;
  }
  
  .stats-section {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .channel-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .subscribe-button {
    margin-top: 1rem;
  }
}
</style>