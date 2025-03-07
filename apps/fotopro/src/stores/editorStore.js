import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePhotoStore } from './photoStore'

export const useEditorStore = defineStore('editor', () => {
  const photoStore = usePhotoStore()
  
  // Current tool selection
  const currentTool = ref('select') // select, crop, adjust, filter, etc.
  const isEditing = ref(false)
  
  // Temporary edits (not yet saved to the photo)
  const temporaryEdits = ref({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    crop: null,
    rotate: 0,
    flip: { horizontal: false, vertical: false }
  })
  
  // History for undo/redo
  const history = ref([])
  const historyIndex = ref(-1)
  
  // Canvas reference for fabric.js
  const canvas = ref(null)
  
  // Computed values
  const selectedPhoto = computed(() => photoStore.selectedPhoto)
  
  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)
  
  // Methods
  function setTool(tool) {
    currentTool.value = tool
  }
  
  function startEditing() {
    if (selectedPhoto.value) {
      isEditing.value = true
      // Initialize temporary edits from the current photo edits
      temporaryEdits.value = { ...selectedPhoto.value.edits }
      // Initialize history with current state
      history.value = [{ ...temporaryEdits.value }]
      historyIndex.value = 0
    }
  }
  
  function updateTemporaryEdit(property, value) {
    temporaryEdits.value[property] = value
    // Add to history
    addToHistory()
  }
  
  function updateBrightness(value) {
    updateTemporaryEdit('brightness', value)
  }
  
  function updateContrast(value) {
    updateTemporaryEdit('contrast', value)
  }
  
  function updateSaturation(value) {
    updateTemporaryEdit('saturation', value)
  }
  
  function updateCrop(cropData) {
    updateTemporaryEdit('crop', cropData)
  }
  
  function updateRotation(degrees) {
    updateTemporaryEdit('rotate', degrees)
  }
  
  function flipHorizontal() {
    const newFlip = {
      ...temporaryEdits.value.flip,
      horizontal: !temporaryEdits.value.flip.horizontal
    }
    updateTemporaryEdit('flip', newFlip)
  }
  
  function flipVertical() {
    const newFlip = {
      ...temporaryEdits.value.flip,
      vertical: !temporaryEdits.value.flip.vertical
    }
    updateTemporaryEdit('flip', newFlip)
  }
  
  function resetEdits() {
    temporaryEdits.value = {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      crop: null,
      rotate: 0,
      flip: { horizontal: false, vertical: false }
    }
    // Reset history
    history.value = [{ ...temporaryEdits.value }]
    historyIndex.value = 0
  }
  
  function cancelEditing() {
    isEditing.value = false
    temporaryEdits.value = { ...selectedPhoto.value.edits }
    // Clear history
    history.value = []
    historyIndex.value = -1
  }
  
  function saveEdits() {
    if (selectedPhoto.value && isEditing.value) {
      photoStore.updatePhoto(selectedPhoto.value.id, {
        edits: { ...temporaryEdits.value }
      })
      isEditing.value = false
      // Clear history
      history.value = []
      historyIndex.value = -1
    }
  }
  
  function addToHistory() {
    // If we're not at the end of the history, truncate it
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }
    
    // Add current state to history
    history.value.push({ ...temporaryEdits.value })
    historyIndex.value = history.value.length - 1
    
    // Limit history size (optional)
    if (history.value.length > 30) {
      history.value.shift()
      historyIndex.value--
    }
  }
  
  function undo() {
    if (canUndo.value) {
      historyIndex.value--
      temporaryEdits.value = { ...history.value[historyIndex.value] }
    }
  }
  
  function redo() {
    if (canRedo.value) {
      historyIndex.value++
      temporaryEdits.value = { ...history.value[historyIndex.value] }
    }
  }
  
  function setCanvas(canvasInstance) {
    canvas.value = canvasInstance
  }
  
  function clearCanvas() {
    canvas.value = null
  }
  
  return {
    // State
    currentTool,
    isEditing,
    temporaryEdits,
    canvas,
    
    // Computed
    selectedPhoto,
    canUndo,
    canRedo,
    
    // Methods
    setTool,
    startEditing,
    updateTemporaryEdit,
    updateBrightness,
    updateContrast,
    updateSaturation,
    updateCrop,
    updateRotation,
    flipHorizontal,
    flipVertical,
    resetEdits,
    cancelEditing,
    saveEdits,
    undo,
    redo,
    setCanvas,
    clearCanvas
  }
})