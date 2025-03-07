<script setup>
import { ref } from 'vue'
import { useLibraryStore } from '../stores/library'
import { useRouter } from 'vue-router'
import CreatePlaylistModal from '../components/CreatePlaylistModal.vue'
import MusicPlayer from '../components/MusicPlayer.vue'

const libraryStore = useLibraryStore()
const router = useRouter()
const isCreatePlaylistModalOpen = ref(false)

const openPlaylist = (playlistId) => {
  router.push({ name: 'playlist', params: { id: playlistId } })
}

const getPlaylistTrackCount = (playlistId) => {
  const playlist = libraryStore.playlists.find(p => p.id === playlistId)
  return playlist ? playlist.tracks.length : 0
}
</script>

<template>
  <main class="playlists-view">
    <div class="playlists-header">
      <h1>Your Playlists</h1>
      <button 
        v-voix="'new-playlist-button'"
        v-bind:hint="'Create a new empty playlist'"
        class="new-playlist-button"
        @click="isCreatePlaylistModalOpen = true"
        aria-label="Create new playlist"
      >
        New Playlist
      </button>
    </div>
    
    <div class="playlists-grid">
      <div 
        v-for="playlist in libraryStore.playlists" 
        :key="playlist.id"
        class="playlist-card"
        @click="openPlaylist(playlist.id)"
        v-voix="'open-playlist-' + playlist.id + '-card'"
        v-bind:hint="'Open the ' + playlist.name + ' playlist with ' + getPlaylistTrackCount(playlist.id) + ' tracks'"
        role="button"
        :aria-label="'Open ' + playlist.name + ' playlist'"
      >
        <div class="playlist-info">
          <h3>{{ playlist.name }}</h3>
          <p v-if="getPlaylistTrackCount(playlist.id) === 1">1 track</p>
          <p v-else>{{ getPlaylistTrackCount(playlist.id) }} tracks</p>
        </div>
      </div>
    </div>
    
    <div v-if="libraryStore.playlists.length === 0" class="empty-playlists">
      <p>You don't have any playlists yet. Create one to get started!</p>
    </div>
    
    <div class="player-container">
      <MusicPlayer />
    </div>
    
    <CreatePlaylistModal 
      :isOpen="isCreatePlaylistModalOpen" 
      @close="isCreatePlaylistModalOpen = false" 
    />
  </main>
</template>

<style scoped>
.playlists-view {
  padding: 24px;
  padding-bottom: 120px; /* Space for the player */
}

.playlists-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.playlists-header h1 {
  margin: 0;
}

.new-playlist-button {
  background-color: #bb86fc;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.new-playlist-button:hover {
  background-color: #a370db;
}

.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

.playlist-card {
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 24px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.playlist-card:hover {
  background-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-4px);
}

.playlist-info h3 {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
}

.playlist-info p {
  margin: 0;
  color: #888;
  font-size: 0.9rem;
}

.empty-playlists {
  padding: 64px 0;
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