<script setup>
import { ref } from 'vue'
import { useLibraryStore } from '../stores/library'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const libraryStore = useLibraryStore()
const playlistName = ref('')
const error = ref('')

const createPlaylist = () => {
  if (!playlistName.value.trim()) {
    error.value = 'Please enter a playlist name'
    return
  }
  
  error.value = ''
  const id = libraryStore.createPlaylist(playlistName.value.trim())
  playlistName.value = ''
  emit('close')
}

const closeModal = () => {
  playlistName.value = ''
  error.value = ''
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Create New Playlist</h2>
        <button 
          v-voix="'close-modal-button'"
          class="close-button" 
          @click="closeModal"
          aria-label="Close modal"
        >
          ×
        </button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label for="playlist-name">Playlist Name</label>
          <input
            v-voix="'playlist-name-input'" 
            id="playlist-name"
            type="text"
            v-model="playlistName"
            placeholder="Enter playlist name"
            class="form-control"
            @keyup.enter="createPlaylist"
          />
          <p v-if="error" class="error-message">{{ error }}</p>
        </div>
      </div>
      
      <div class="modal-footer">
        <button 
          v-voix="'cancel-create-playlist-button'"
          class="cancel-button" 
          @click="closeModal"
          aria-label="Cancel"
        >
          Cancel
        </button>
        <button 
          v-voix="'create-playlist-button'"
          class="create-button" 
          @click="createPlaylist"
          aria-label="Create playlist"
        >
          Create Playlist
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1e1e1e;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #333;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-button:hover {
  color: #fff;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #aaa;
}

.form-control {
  width: 100%;
  padding: 12px;
  background-color: #333;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  box-shadow: 0 0 0 2px #bb86fc;
}

.error-message {
  color: #ff5252;
  font-size: 0.85rem;
  margin-top: 8px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #333;
}

.cancel-button, .create-button {
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button {
  background-color: transparent;
  border: 1px solid #555;
  color: #ccc;
  margin-right: 12px;
}

.cancel-button:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.create-button {
  background-color: #bb86fc;
  border: none;
  color: #000;
}

.create-button:hover {
  background-color: #a370db;
}
</style>