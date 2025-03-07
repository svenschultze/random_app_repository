<script setup>
import { RouterLink } from 'vue-router'
import { formatViewCount, formatUploadDate, getChannelById } from '../stores/videoStore'

const props = defineProps({
  video: {
    type: Object,
    required: true
  }
})

const channel = getChannelById(props.video.channelId)
</script>

<template>
  <div class="video-card">
    <RouterLink 
      :to="`/watch/${video.id}`" 
      class="thumbnail-container"
      v-voix="`VideoThumbnail-${video.id}`"
      :hint="`Watch video: ${video.title}. Duration: ${video.duration}. ${video.description.substring(0, 50)}${video.description.length > 50 ? '...' : ''}`"
    >
      <img 
        :src="video.thumbnailUrl" 
        :alt="video.title" 
        class="thumbnail"
      />
      <span class="duration">{{ video.duration }}</span>
    </RouterLink>
    
    <div class="video-info">
      <RouterLink 
        :to="`/channel/${channel.id}`" 
        class="channel-img-container"
        v-voix="`ChannelPicture-${channel.id}`"
        :hint="`Go to ${channel.name}'s channel`"
      >
        <img 
          :src="channel.profilePicture" 
          :alt="channel.name" 
          class="channel-img"
        />
      </RouterLink>
      
      <div class="video-details">
        <RouterLink 
          :to="`/watch/${video.id}`"
          class="video-title-link"
          v-voix="`VideoTitle-${video.id}`"
          :hint="`Watch video: ${video.title} by ${channel.name}. ${formatViewCount(video.views)} views.`"
        >
          <h3 class="video-title">{{ video.title }}</h3>
        </RouterLink>
        
        <RouterLink 
          :to="`/channel/${channel.id}`"
          class="channel-name"
          v-voix="`ChannelName-${channel.id}`"
          :hint="`Go to ${channel.name}'s channel. ${formatViewCount(channel.subscribers)} subscribers. Creator of this video.`"
        >
          {{ channel.name }}
        </RouterLink>
        
        <div class="video-meta">
          <span>{{ formatViewCount(video.views) }} views</span>
          <span class="dot-separator">•</span>
          <span>{{ formatUploadDate(video.uploadDate) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-card {
  width: 100%;
  cursor: pointer;
  transition: transform 0.2s;
}

.video-card:hover {
  transform: translateY(-2px);
}

.thumbnail-container {
  position: relative;
  display: block;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 10px;
}

.thumbnail {
  position: absolute;
  top: 0;
  left: 0;
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

.video-info {
  display: flex;
  padding: 0 4px;
}

.channel-img-container {
  margin-right: 12px;
  flex-shrink: 0;
}

.channel-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.video-details {
  flex: 1;
  min-width: 0; /* Prevents overflow issues */
}

.video-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 4px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #0f0f0f;
}

.channel-name {
  display: block;
  font-size: 0.9rem;
  color: #606060;
  margin-bottom: 4px;
}

.video-meta {
  font-size: 0.9rem;
  color: #606060;
}

.dot-separator {
  margin: 0 4px;
}
</style>