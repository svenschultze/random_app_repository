<script setup>
import { ref, computed, watch } from 'vue'
import { useLibraryStore } from '../stores/library'
import { formatTime } from '../utils/formatters'

const libraryStore = useLibraryStore()

const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const isSeeking = ref(false)

// Update current time during playback
const updateProgress = () => {
  if (!libraryStore.audioElement || isSeeking.value) return
  
  currentTime.value = libraryStore.audioElement.currentTime
  duration.value = libraryStore.audioElement.duration || 0
  
  if (duration.value > 0) {
    progress.value = (currentTime.value / duration.value) * 100
  }
}

// Set up interval for updating progress
let progressInterval = null

watch(() => libraryStore.isPlaying, (isPlaying) => {
  if (isPlaying) {
    progressInterval = setInterval(updateProgress, 1000)
  } else {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
  }
})

// Handle seeking
const startSeeking = () => {
  isSeeking.value = true
}

const seek = (event) => {
  if (!libraryStore.audioElement) return
  
  const seekBar = event.target
  const rect = seekBar.getBoundingClientRect()
  const seekPos = (event.clientX - rect.left) / rect.width
  
  progress.value = seekPos * 100
}

const endSeeking = (event) => {
  if (!libraryStore.audioElement) return
  
  const seekBar = event.target
  const rect = seekBar.getBoundingClientRect()
  const seekPos = (event.clientX - rect.left) / rect.width
  
  const newTime = seekPos * (libraryStore.audioElement.duration || 0)
  libraryStore.audioElement.currentTime = newTime
  currentTime.value = newTime
  
  isSeeking.value = false
}

// Format the displayed track duration
const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedDuration = computed(() => {
  return libraryStore.currentTrack
    ? formatTime(libraryStore.currentTrack.duration)
    : '--:--'
})

// Toggle play/pause
const togglePlayPause = () => {
  if (libraryStore.isPlaying) {
    libraryStore.pauseTrack()
  } else {
    libraryStore.resumeTrack()
  }
}
</script>

<template>
  <div class="music-player" v-if="libraryStore.currentTrack">
    <div class="current-track-info">
      <img 
        v-if="libraryStore.currentTrack"
        :src="libraryStore.albums.find(a => a.id === libraryStore.currentTrack.albumId)?.cover"
        alt="Album cover"
        class="album-thumbnail"
      />
      <div class="track-details">
        <div class="track-title">{{ libraryStore.currentTrack.title }}</div>
        <div class="track-artist">{{ libraryStore.currentTrack.artist }}</div>
      </div>
    </div>
    
    <div class="player-controls">
      <div class="control-buttons">
        <button 
          v-voix="'previous-track-button'"
          v-bind:hint="libraryStore.currentTrack ? 'Play previous track' : 'Previous track (disabled)'"
          class="control-button"
          @click="libraryStore.playPreviousTrack()"
          :aria-label="libraryStore.currentTrack ? 'Play previous track' : 'Previous track (disabled)'"
        >
          ⏮
        </button>
        
        <button 
          v-voix="'play-pause-button'"
          v-bind:hint="libraryStore.isPlaying ? 'Pause ' + (libraryStore.currentTrack?.title || 'current track') : 'Play ' + (libraryStore.currentTrack?.title || 'current track')"
          class="control-button play-pause"
          @click="togglePlayPause"
          :aria-label="libraryStore.isPlaying ? 'Pause current track' : 'Play current track'"
        >
          {{ libraryStore.isPlaying ? '⏸' : '▶' }}
        </button>
        
        <button 
          v-voix="'next-track-button'"
          v-bind:hint="libraryStore.currentTrack ? 'Play next track' : 'Next track (disabled)'"
          class="control-button"
          @click="libraryStore.playNextTrack()"
          :aria-label="libraryStore.currentTrack ? 'Play next track' : 'Next track (disabled)'"
        >
          ⏭
        </button>
      </div>
      
      <div class="progress-container">
        <span class="time-display">{{ formattedCurrentTime }}</span>
        <div 
          v-voix="'track-progress-bar'"
          v-bind:hint="'Seek to a different position in the track'"
          class="progress-bar"
          @mousedown="startSeeking"
          @mousemove="isSeeking ? seek($event) : null"
          @mouseup="endSeeking"
          @mouseleave="isSeeking = false"
          role="slider"
          :aria-label="'Audio track progress'"
          :aria-valuemin="0"
          :aria-valuemax="100"
          :aria-valuenow="progress"
        >
          <div class="progress-bar-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <span class="time-display">{{ formattedDuration }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.music-player {
  display: flex;
  flex-direction: column;
  background-color: #121212;
  border-top: 1px solid #333;
  padding: 12px 24px;
  width: 100%;
}

.current-track-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.album-thumbnail {
  width: 56px;
  height: 56px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 16px;
}

.track-details {
  flex: 1;
}

.track-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.track-artist {
  font-size: 0.9rem;
  color: #aaa;
}

.player-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.control-buttons {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.control-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  margin: 0 8px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.control-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.play-pause {
  font-size: 1.5rem;
  background-color: #bb86fc;
  color: #000;
}

.play-pause:hover {
  background-color: #a370db;
}

.progress-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.time-display {
  font-size: 0.8rem;
  color: #aaa;
  width: 45px;
  text-align: center;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background-color: #444;
  border-radius: 2px;
  margin: 0 10px;
  cursor: pointer;
  position: relative;
}

.progress-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #bb86fc;
  border-radius: 2px;
}
</style>