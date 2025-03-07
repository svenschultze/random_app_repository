<script setup>
import { ref, computed } from 'vue'
import { useLibraryStore } from '../stores/library'
import { formatYear } from '../utils/formatters'

const props = defineProps({
  album: {
    type: Object,
    required: true
  }
})

const libraryStore = useLibraryStore()

const tracks = computed(() => {
  return libraryStore.tracks.filter(track => track.albumId === props.album.id)
})

const playAlbum = () => {
  if (tracks.value.length > 0) {
    libraryStore.playTrack(tracks.value[0].id)
  }
}
</script>

<template>
  <div class="album-card">
    <div class="album-cover-container">
      <img 
        :src="album.cover" 
        :alt="album.title + ' album cover'" 
        class="album-cover" 
      />
      <div class="album-overlay">
        <button 
          v-voix="'play-album-button-' + album.id"
          v-bind:hint="'Play album ' + album.title + ' by ' + album.artist"
          @click="playAlbum" 
          class="play-album-button"
          :aria-label="'Play album ' + album.title + ' by ' + album.artist"
        >
          ▶
        </button>
      </div>
    </div>
    <div class="album-info">
      <h3 class="album-title">{{ album.title }}</h3>
      <p class="album-artist">{{ album.artist }}</p>
      <p class="album-details">
        <span class="album-year">{{ formatYear(album.year) }}</span>
        <span class="album-genre">{{ album.genre }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.album-card {
  width: 200px;
  margin: 16px;
  transition: transform 0.2s;
}

.album-card:hover {
  transform: translateY(-5px);
}

.album-cover-container {
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.album-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s;
}

.album-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.album-cover-container:hover .album-overlay {
  opacity: 1;
}

.album-cover-container:hover .album-cover {
  filter: blur(2px);
}

.play-album-button {
  background-color: #bb86fc;
  color: #000;
  border: none;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.play-album-button:hover {
  transform: scale(1.1);
  background-color: #a370db;
}

.album-info {
  padding: 12px 8px;
}

.album-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-artist {
  font-size: 0.9rem;
  color: #aaa;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #888;
  margin: 0;
}

.album-year, .album-genre {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>