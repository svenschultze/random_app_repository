<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLibraryStore } from '../stores/library'
import TrackList from '../components/TrackList.vue'
import MusicPlayer from '../components/MusicPlayer.vue'

const route = useRoute()
const libraryStore = useLibraryStore()

// Get the current playlist from the route params
const playlist = computed(() => {
  return libraryStore.playlists.find(p => p.id === route.params.id)
})

// Get the tracks in the playlist
const playlistTracks = computed(() => {
  if (!playlist.value) return []
  
  return playlist.value.tracks.map(trackId => {
    return libraryStore.tracks.find(t => t.id === trackId)
  }).filter(track => track !== undefined)
})

// Play the entire playlist
const playPlaylist = () => {
  if (playlistTracks.value.length > 0) {
    libraryStore.playTrack(playlistTracks.value[0].id)
  }
}
</script>

<template>
  <main class="playlist-view">
    <div v-if="playlist" class="playlist-header">
      <div class="playlist-info">
        <h1>{{ playlist.name }}</h1>
        <p v-if="playlistTracks.length === 1">1 track</p>
        <p v-else>{{ playlistTracks.length }} tracks</p>
      </div>
      
      <button 
        v-voix="'play-playlist-button'"
        v-bind:hint="'Play all tracks in the ' + playlist.name + ' playlist'"
        class="play-playlist-button"
        @click="playPlaylist"
        :disabled="playlistTracks.length === 0"
        :aria-label="'Play all tracks in the ' + playlist.name + ' playlist'"
      >
        Play All
      </button>
    </div>
    
    <div v-if="playlistTracks.length > 0" class="playlist-tracks">
      <TrackList 
        :tracks="playlistTracks" 
        :playlistId="playlist?.id"
      />
    </div>
    
    <div v-else class="empty-playlist">
      <p>This playlist is empty. Add some tracks from the library!</p>
    </div>
    
    <div class="player-container">
      <MusicPlayer />
    </div>
  </main>
</template>

<style scoped>
.playlist-view {
  padding: 24px;
  padding-bottom: 120px; /* Space for the player */
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.playlist-info h1 {
  margin: 0 0 8px 0;
  font-size: 2rem;
}

.playlist-info p {
  margin: 0;
  color: #888;
}

.play-playlist-button {
  background-color: #bb86fc;
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.play-playlist-button:hover {
  background-color: #a370db;
}

.play-playlist-button:disabled {
  background-color: #444;
  color: #888;
  cursor: not-allowed;
}

.empty-playlist {
  padding: 48px 0;
  text-align: center;
  color: #888;
}

.player-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}
</style>