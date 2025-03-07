<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLibraryStore } from '../stores/library'
import SearchBar from '../components/SearchBar.vue'
import AlbumCard from '../components/AlbumCard.vue'
import TrackList from '../components/TrackList.vue'
import MusicPlayer from '../components/MusicPlayer.vue'
import CreatePlaylistModal from '../components/CreatePlaylistModal.vue'

const libraryStore = useLibraryStore()
const isCreatePlaylistModalOpen = ref(false)
const currentView = ref('albums') // albums, tracks, artists

// Generate library automatically on mount
onMounted(() => {
  libraryStore.generateLibrary()
})

// Filter and sort albums
const displayedAlbums = computed(() => {
  if (!libraryStore.searchQuery.trim()) {
    return libraryStore.albums.slice().sort((a, b) => b.year - a.year)
  }
  
  const query = libraryStore.searchQuery.toLowerCase()
  return libraryStore.albums
    .filter(album => 
      album.title.toLowerCase().includes(query) || 
      album.artist.toLowerCase().includes(query) ||
      album.genre.toLowerCase().includes(query)
    )
    .sort((a, b) => b.year - a.year)
})

// Grouped artists
const artistsWithAlbums = computed(() => {
  const artists = libraryStore.artists.map(artist => {
    const artistAlbums = libraryStore.albums.filter(album => album.artistId === artist.id)
    return {
      ...artist,
      albums: artistAlbums
    }
  })
  
  if (!libraryStore.searchQuery.trim()) {
    return artists
  }
  
  const query = libraryStore.searchQuery.toLowerCase()
  return artists.filter(artist => 
    artist.name.toLowerCase().includes(query) ||
    artist.albums.some(album => 
      album.title.toLowerCase().includes(query) || 
      album.genre.toLowerCase().includes(query)
    )
  )
})

// Function to regenerate the library
const regenerateLibrary = () => {
  libraryStore.generateLibrary()
}
</script>

<template>
  <main class="home">
    <div class="generate-demo-container">
      <button
        v-voix="'generate-demo-data-button'" 
        v-bind:hint="'Generate a new set of random artists, albums, and tracks'"
        class="generate-button"
        @click="regenerateLibrary"
        aria-label="Generate new random demo data"
      >
        Generate Demo Data
      </button>
    </div>
    
    <SearchBar />
    
    <div class="view-selector">
      <button 
        v-voix="'show-albums-view-button'"
        v-bind:hint="'Switch to browse by albums view'"
        :class="{ active: currentView === 'albums' }" 
        @click="currentView = 'albums'"
        aria-label="Show albums view"
      >
        Albums
      </button>
      <button 
        v-voix="'show-tracks-view-button'"
        v-bind:hint="'Switch to browse by tracks view'"
        :class="{ active: currentView === 'tracks' }" 
        @click="currentView = 'tracks'"
        aria-label="Show tracks view"
      >
        Tracks
      </button>
      <button 
        v-voix="'show-artists-view-button'"
        v-bind:hint="'Switch to browse by artists view'"
        :class="{ active: currentView === 'artists' }" 
        @click="currentView = 'artists'"
        aria-label="Show artists view"
      >
        Artists
      </button>
    </div>
    
    <!-- Albums View -->
    <div v-if="currentView === 'albums'" class="albums-view">
      <div class="albums-grid">
        <AlbumCard 
          v-for="album in displayedAlbums" 
          :key="album.id" 
          :album="album" 
        />
      </div>
      
      <div v-if="displayedAlbums.length === 0" class="no-results">
        <p>No albums found matching your search.</p>
      </div>
    </div>
    
    <!-- Tracks View -->
    <div v-if="currentView === 'tracks'" class="tracks-view">
      <TrackList 
        :tracks="libraryStore.filteredTracks" 
        :showAlbum="true"
        :showArtist="true"
      />
      
      <div v-if="libraryStore.filteredTracks.length === 0" class="no-results">
        <p>No tracks found matching your search.</p>
      </div>
    </div>
    
    <!-- Artists View -->
    <div v-if="currentView === 'artists'" class="artists-view">
      <div v-for="artist in artistsWithAlbums" :key="artist.id" class="artist-section">
        <div class="artist-header">
          <h2>{{ artist.name }}</h2>
        </div>
        
        <div class="artist-albums">
          <AlbumCard 
            v-for="album in artist.albums" 
            :key="album.id" 
            :album="album" 
          />
        </div>
      </div>
      
      <div v-if="artistsWithAlbums.length === 0" class="no-results">
        <p>No artists found matching your search.</p>
      </div>
    </div>
    
    <!-- Music Player -->
    <div class="player-container">
      <MusicPlayer />
    </div>
    
    <!-- Create Playlist Modal -->
    <CreatePlaylistModal 
      :isOpen="isCreatePlaylistModalOpen" 
      @close="isCreatePlaylistModalOpen = false" 
    />
  </main>
</template>

<style scoped>
.home {
  padding-bottom: 120px; /* Space for the player */
}

.generate-demo-container {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.generate-button {
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

.generate-button:hover {
  background-color: #a370db;
}

.view-selector {
  display: flex;
  justify-content: center;
  margin: 0 0 24px 0;
  border-bottom: 1px solid #333;
}

.view-selector button {
  background: none;
  border: none;
  color: #888;
  font-size: 1rem;
  font-weight: 500;
  padding: 12px 24px;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.view-selector button:hover {
  color: #fff;
}

.view-selector button.active {
  color: #bb86fc;
}

.view-selector button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #bb86fc;
}

.albums-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 16px;
}

.artist-section {
  margin-bottom: 40px;
}

.artist-header {
  padding: 0 24px;
  margin-bottom: 16px;
}

.artist-header h2 {
  font-size: 1.5rem;
  margin: 0;
}

.artist-albums {
  display: flex;
  flex-wrap: wrap;
  margin: 0 8px;
}

.no-results {
  padding: 40px 0;
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

/* Mobile responsive styles */
@media (max-width: 768px) {
  .albums-grid {
    justify-content: space-around;
  }
  
  .view-selector button {
    padding: 12px 16px;
    font-size: 0.9rem;
  }
}
</style>
