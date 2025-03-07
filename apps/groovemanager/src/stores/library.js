import { defineStore } from 'pinia'

// Arrays of random data for generating music library
const artistFirstNames = ['Cosmic', 'Electric', 'Midnight', 'Crystal', 'Velvet', 'Solar', 'Neon', 'Sonic', 'Digital', 'Lunar']
const artistLastNames = ['Wave', 'Echo', 'Pulse', 'Drift', 'Horizon', 'Vision', 'Fusion', 'Dream', 'Storm', 'Groove']
const albumAdjectives = ['Lost', 'Hidden', 'Eternal', 'Infinite', 'Neon', 'Digital', 'Analog', 'Ethereal', 'Virtual', 'Quantum']
const albumNouns = ['Dreams', 'Echoes', 'Waves', 'Signals', 'Horizons', 'Memories', 'Rhythms', 'Pulses', 'Journey', 'Dimensions']
const trackAdjectives = ['Silent', 'Electric', 'Cosmic', 'Distant', 'Golden', 'Analog', 'Fading', 'Glowing', 'Drifting', 'Crystal']
const trackNouns = ['Waves', 'Echo', 'Dream', 'Memory', 'Signal', 'Light', 'Path', 'Horizon', 'Pulse', 'Whisper']
const genres = ['Synthwave', 'Electronic', 'Ambient', 'Lo-Fi', 'Chillwave', 'Vaporwave', 'Downtempo', 'Trip-Hop', 'Future Bass', 'Electro']

// Base64 encoded silent audio snippet (1 second)
const silentAudioBase64 = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADmAD///////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAQKAAAAAAAAA5gGjAjw/////////////////////////////////wQArwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UEQAAAAAAAAAAAAAAAAAAAAAAFhpbmcAAAAPAAAAAwAAA2QA2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJALTAAAAAAAAAAAkOARVslsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UEQAAA82pIAZU2AEH1KIAAAAAAAAAAIAAAADAAAAAAAARGF0YQAAACMAAABoAAAAfEyXgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=='

export const useLibraryStore = defineStore('library', {
  state: () => ({
    artists: [],
    albums: [],
    tracks: [],
    playlists: [],
    currentTrack: null,
    isPlaying: false,
    searchQuery: '',
    audioElement: null,
    loading: false
  }),

  getters: {
    // Get filtered tracks based on search query
    filteredTracks: (state) => {
      if (!state.searchQuery.trim()) return state.tracks
      
      const query = state.searchQuery.toLowerCase()
      return state.tracks.filter(track => 
        track.title.toLowerCase().includes(query) || 
        track.artist.toLowerCase().includes(query) || 
        track.album.toLowerCase().includes(query) ||
        track.genre.toLowerCase().includes(query)
      )
    },
    
    // Get tracks grouped by album
    tracksByAlbum: (state) => {
      const grouped = {}
      
      state.albums.forEach(album => {
        grouped[album.id] = state.tracks.filter(track => track.albumId === album.id)
      })
      
      return grouped
    },
    
    // Get tracks by artist
    tracksByArtist: (state) => {
      const grouped = {}
      
      state.artists.forEach(artist => {
        grouped[artist.id] = state.tracks.filter(track => track.artistId === artist.id)
      })
      
      return grouped
    }
  },

  actions: {
    // Generate a random music library
    generateLibrary() {
      this.loading = true
      
      // Clear existing data
      this.artists = []
      this.albums = []
      this.tracks = []
      this.playlists = []
      this.currentTrack = null
      this.isPlaying = false
      
      // Generate artists (10-15)
      const numArtists = Math.floor(Math.random() * 6) + 10
      
      for (let i = 0; i < numArtists; i++) {
        const artist = {
          id: `artist-${i}`,
          name: this.generateArtistName(),
          image: `https://picsum.photos/seed/artist${i}/200/200`
        }
        this.artists.push(artist)
        
        // Generate 1-3 albums per artist
        const numAlbums = Math.floor(Math.random() * 3) + 1
        
        for (let j = 0; j < numAlbums; j++) {
          const albumId = `album-${i}-${j}`
          const genre = genres[Math.floor(Math.random() * genres.length)]
          const year = Math.floor(Math.random() * 21) + 2000 // 2000-2020
          
          const album = {
            id: albumId,
            title: this.generateAlbumTitle(),
            artist: artist.name,
            artistId: artist.id,
            year,
            genre,
            cover: `https://picsum.photos/seed/album${i}${j}/300/300`
          }
          this.albums.push(album)
          
          // Generate 5-12 tracks per album
          const numTracks = Math.floor(Math.random() * 8) + 5
          
          for (let k = 0; k < numTracks; k++) {
            const durationSeconds = Math.floor(Math.random() * 240) + 120 // 2-6 minutes
            
            const track = {
              id: `track-${i}-${j}-${k}`,
              title: this.generateTrackTitle(),
              artist: artist.name,
              artistId: artist.id,
              album: album.title,
              albumId: album.id,
              trackNumber: k + 1,
              duration: durationSeconds,
              genre,
              year,
              audio: silentAudioBase64
            }
            this.tracks.push(track)
          }
        }
      }
      
      // Create some default playlists
      this.playlists = [
        {
          id: 'playlist-favorites',
          name: 'Favorites',
          tracks: this.getRandomTracks(15)
        },
        {
          id: 'playlist-recently-played',
          name: 'Recently Played',
          tracks: this.getRandomTracks(10)
        }
      ]
      
      // Set up audio element
      if (!this.audioElement) {
        this.audioElement = new Audio()
      }
      
      this.loading = false
    },
    
    // Create a new playlist
    createPlaylist(name) {
      const id = `playlist-${Date.now()}`
      this.playlists.push({
        id,
        name,
        tracks: []
      })
      return id
    },
    
    // Add track to playlist
    addTrackToPlaylist(playlistId, trackId) {
      const playlist = this.playlists.find(p => p.id === playlistId)
      const track = this.tracks.find(t => t.id === trackId)
      
      if (playlist && track && !playlist.tracks.includes(trackId)) {
        playlist.tracks.push(trackId)
      }
    },
    
    // Remove track from playlist
    removeTrackFromPlaylist(playlistId, trackId) {
      const playlist = this.playlists.find(p => p.id === playlistId)
      
      if (playlist) {
        const index = playlist.tracks.indexOf(trackId)
        if (index !== -1) {
          playlist.tracks.splice(index, 1)
        }
      }
    },
    
    // Play a track
    playTrack(trackId) {
      const track = this.tracks.find(t => t.id === trackId)
      
      if (track) {
        this.currentTrack = track
        this.isPlaying = true
        
        if (this.audioElement) {
          this.audioElement.src = track.audio
          this.audioElement.play()
        }
      }
    },
    
    // Pause current track
    pauseTrack() {
      this.isPlaying = false
      
      if (this.audioElement) {
        this.audioElement.pause()
      }
    },
    
    // Resume current track
    resumeTrack() {
      if (this.currentTrack) {
        this.isPlaying = true
        
        if (this.audioElement) {
          this.audioElement.play()
        }
      }
    },
    
    // Play next track (simple implementation)
    playNextTrack() {
      if (!this.currentTrack) return
      
      const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack.id)
      if (currentIndex < this.tracks.length - 1) {
        this.playTrack(this.tracks[currentIndex + 1].id)
      }
    },
    
    // Play previous track
    playPreviousTrack() {
      if (!this.currentTrack) return
      
      const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack.id)
      if (currentIndex > 0) {
        this.playTrack(this.tracks[currentIndex - 1].id)
      }
    },
    
    // Helper: Generate random artist name
    generateArtistName() {
      const first = artistFirstNames[Math.floor(Math.random() * artistFirstNames.length)]
      const last = artistLastNames[Math.floor(Math.random() * artistLastNames.length)]
      return `${first} ${last}`
    },
    
    // Helper: Generate random album title
    generateAlbumTitle() {
      const adj = albumAdjectives[Math.floor(Math.random() * albumAdjectives.length)]
      const noun = albumNouns[Math.floor(Math.random() * albumNouns.length)]
      return `${adj} ${noun}`
    },
    
    // Helper: Generate random track title
    generateTrackTitle() {
      const adj = trackAdjectives[Math.floor(Math.random() * trackAdjectives.length)]
      const noun = trackNouns[Math.floor(Math.random() * trackNouns.length)]
      return `${adj} ${noun}`
    },
    
    // Helper: Get random tracks
    getRandomTracks(count) {
      const shuffled = [...this.tracks].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count).map(t => t.id)
    }
  }
})