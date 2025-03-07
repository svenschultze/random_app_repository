<script setup>
import { ref, onMounted } from 'vue'
import VideoCard from '../components/VideoCard.vue'
import { getAllVideos } from '../stores/videoStore'

const videos = ref([])

onMounted(() => {
  // In a real app, this would fetch videos from an API
  videos.value = getAllVideos()
})
</script>

<template>
  <div class="home-container">
    <h1 class="visually-hidden">VueTube Home</h1>
    
    <div class="videos-grid">
      <VideoCard 
        v-for="video in videos" 
        :key="video.id" 
        :video="video" 
      />
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 1rem 0;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
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
}

@media (min-width: 1280px) {
  .videos-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
