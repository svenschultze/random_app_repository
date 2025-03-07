import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePhotoStore = defineStore('photos', () => {
  const photos = ref([])
  const albums = ref([])
  const tags = ref([])
  const selectedPhotoId = ref(null)

  // Computed properties
  const selectedPhoto = computed(() => {
    return photos.value.find(photo => photo.id === selectedPhotoId.value) || null
  })
  
  const photosByAlbum = computed(() => (albumId) => {
    return photos.value.filter(photo => photo.albumId === albumId)
  })
  
  const photosByTag = computed(() => (tagId) => {
    return photos.value.filter(photo => photo.tags.includes(tagId))
  })

  // Actions
  function addPhoto(photo) {
    photos.value.push({
      ...photo,
      id: crypto.randomUUID(),
      tags: photo.tags || [],
      edits: photo.edits || {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        crop: null,
        rotate: 0,
        flip: { horizontal: false, vertical: false }
      },
      createdAt: new Date().toISOString()
    })
  }

  function updatePhoto(id, updates) {
    const index = photos.value.findIndex(photo => photo.id === id)
    if (index !== -1) {
      photos.value[index] = { ...photos.value[index], ...updates }
    }
  }

  function deletePhoto(id) {
    const index = photos.value.findIndex(photo => photo.id === id)
    if (index !== -1) {
      photos.value.splice(index, 1)
    }
    if (selectedPhotoId.value === id) {
      selectedPhotoId.value = null
    }
  }

  function selectPhoto(id) {
    selectedPhotoId.value = id
  }

  function addAlbum(name) {
    const id = crypto.randomUUID()
    albums.value.push({ id, name, createdAt: new Date().toISOString() })
    return id
  }

  function updateAlbum(id, updates) {
    const index = albums.value.findIndex(album => album.id === id)
    if (index !== -1) {
      albums.value[index] = { ...albums.value[index], ...updates }
    }
  }

  function deleteAlbum(id) {
    const index = albums.value.findIndex(album => album.id === id)
    if (index !== -1) {
      albums.value.splice(index, 1)
      // Remove album reference from photos
      photos.value.forEach(photo => {
        if (photo.albumId === id) {
          photo.albumId = null
        }
      })
    }
  }

  function addTag(name) {
    const id = crypto.randomUUID()
    tags.value.push({ id, name })
    return id
  }

  function updateTag(id, name) {
    const index = tags.value.findIndex(tag => tag.id === id)
    if (index !== -1) {
      tags.value[index].name = name
    }
  }

  function deleteTag(id) {
    const index = tags.value.findIndex(tag => tag.id === id)
    if (index !== -1) {
      tags.value.splice(index, 1)
      // Remove tag from all photos
      photos.value.forEach(photo => {
        photo.tags = photo.tags.filter(tagId => tagId !== id)
      })
    }
  }

  function addTagToPhoto(photoId, tagId) {
    const photo = photos.value.find(p => p.id === photoId)
    if (photo && !photo.tags.includes(tagId)) {
      photo.tags.push(tagId)
    }
  }

  function removeTagFromPhoto(photoId, tagId) {
    const photo = photos.value.find(p => p.id === photoId)
    if (photo) {
      photo.tags = photo.tags.filter(id => id !== tagId)
    }
  }

  function setPhotoAlbum(photoId, albumId) {
    const photo = photos.value.find(p => p.id === photoId)
    if (photo) {
      photo.albumId = albumId
    }
  }

  // Return all properties and methods
  return {
    // State
    photos,
    albums,
    tags,
    selectedPhotoId,
    
    // Getters
    selectedPhoto,
    photosByAlbum,
    photosByTag,
    
    // Actions
    addPhoto,
    updatePhoto,
    deletePhoto,
    selectPhoto,
    addAlbum,
    updateAlbum,
    deleteAlbum,
    addTag,
    updateTag,
    deleteTag,
    addTagToPhoto,
    removeTagFromPhoto,
    setPhotoAlbum
  }
})