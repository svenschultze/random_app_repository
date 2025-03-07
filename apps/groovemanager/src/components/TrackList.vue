<script setup>
import { ref, computed } from 'vue'
import { useLibraryStore } from '../stores/library'
import { formatDuration } from '../utils/formatters'

const props = defineProps({
  tracks: {
    type: Array,
    required: true
  },
  showAlbum: {
    type: Boolean,
    default: true
  },
  showArtist: {
    type: Boolean,
    default: true
  },
  showYear: {
    type: Boolean,
    default: false
  },
  playlistId: {
    type: String,
    default: null
  }
})

const libraryStore = useLibraryStore()

const isTrackPlaying = (track) => {
  return libraryStore.isPlaying && 
    libraryStore.currentTrack && 
    libraryStore.currentTrack.id === track.id
}
</script>

<template>
  <div class="track-list">
    <table>
      <thead>
        <tr>
          <th class="track-number">#</th>
          <th class="track-title">Title</th>
          <th v-if="showArtist" class="track-artist">Artist</th>
          <th v-if="showAlbum" class="track-album">Album</th>
          <th v-if="showYear" class="track-year">Year</th>
          <th class="track-duration">Duration</th>
          <th class="track-actions"></th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="track in tracks" 
          :key="track.id" 
          :class="{ 'playing': isTrackPlaying(track) }"
          @dblclick="libraryStore.playTrack(track.id)"
        >
          <td class="track-number">
            <span v-if="!isTrackPlaying(track)">{{ track.trackNumber }}</span>
            <span v-else class="now-playing-icon">▶</span>
          </td>
          <td class="track-title">{{ track.title }}</td>
          <td v-if="showArtist" class="track-artist">{{ track.artist }}</td>
          <td v-if="showAlbum" class="track-album">{{ track.album }}</td>
          <td v-if="showYear" class="track-year">{{ track.year }}</td>
          <td class="track-duration">{{ formatDuration(track.duration) }}</td>
          <td class="track-actions">
            <button 
              v-voix="'track-play-button-' + track.id"
              v-bind:hint="'Play ' + track.title + ' by ' + track.artist"
              @click="libraryStore.playTrack(track.id)" 
              class="action-button"
              :aria-label="'Play ' + track.title + ' by ' + track.artist"
            >
              ▶
            </button>
            
            <button 
              v-if="playlistId"
              v-voix="'track-remove-button-' + track.id"
              v-bind:hint="'Remove ' + track.title + ' from this playlist'"
              @click="libraryStore.removeTrackFromPlaylist(playlistId, track.id)" 
              class="action-button remove"
              :aria-label="'Remove ' + track.title + ' from playlist'"
            >
              ✕
            </button>
            
            <div v-else class="playlist-dropdown">
              <button 
                v-voix="'track-add-to-playlist-button-' + track.id"
                v-bind:hint="'Add ' + track.title + ' to a playlist'"
                class="action-button"
                @click="$event.currentTarget.nextElementSibling.classList.toggle('show')"
                :aria-label="'Add ' + track.title + ' to a playlist'"
              >
                +
              </button>
              <div class="dropdown-content">
                <button 
                  v-for="playlist in libraryStore.playlists" 
                  :key="playlist.id"
                  v-voix="'add-to-playlist-' + playlist.id + '-button-' + track.id"
                  v-bind:hint="'Add ' + track.title + ' to playlist ' + playlist.name"
                  @click="libraryStore.addTrackToPlaylist(playlist.id, track.id)"
                  :aria-label="'Add to playlist ' + playlist.name"
                >
                  {{ playlist.name }}
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.track-list {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  padding: 12px 8px;
  border-bottom: 1px solid #444;
  font-weight: 600;
  color: #888;
  font-size: 0.9rem;
}

td {
  padding: 12px 8px;
  border-bottom: 1px solid #222;
}

tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.track-number {
  width: 40px;
  text-align: center;
  color: #888;
}

.track-title {
  width: 30%;
}

.track-artist, .track-album {
  width: 20%;
}

.track-year {
  width: 10%;
}

.track-duration {
  width: 80px;
  text-align: right;
  color: #888;
}

.track-actions {
  width: 80px;
  text-align: right;
}

.playing {
  background-color: rgba(98, 0, 238, 0.15);
}

.playing:hover {
  background-color: rgba(98, 0, 238, 0.2);
}

.playing .track-title {
  color: #bb86fc;
  font-weight: 500;
}

.now-playing-icon {
  color: #bb86fc;
}

.action-button {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 0.85rem;
  border-radius: 50%;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.action-button.remove:hover {
  color: #ff5252;
}

.playlist-dropdown {
  display: inline-block;
  position: relative;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #222;
  min-width: 160px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 4px;
  overflow: hidden;
}

.dropdown-content.show {
  display: block;
}

.dropdown-content button {
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  border: none;
  background: none;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-content button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>