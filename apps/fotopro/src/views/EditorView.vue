<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePhotoStore } from '@/stores/photoStore'
import { useEditorStore } from '@/stores/editorStore'

// Temporary workaround: We'll mock the Fabric.js functionality for this demo
// In a real implementation, we would properly import and use Fabric.js
const fabric = {
  Canvas: class MockCanvas {
    constructor() {
      this.objects = []
    }
    
    setWidth() {}
    setHeight() {}
    centerObject() {}
    add() {}
    setBackgroundImage() {}
    renderAll() {}
    dispose() {}
  },
  
  Image: {
    fromURL(url, callback) {
      const img = new Image()
      img.src = url
      img.onload = () => {
        callback({
          width: img.width,
          height: img.height,
          scale: () => {},
          rotate: () => {},
          set: () => {},
          filters: [],
          applyFilters: () => {}
        })
      }
    },
    
    filters: {
      Brightness: class { constructor() {} },
      Contrast: class { constructor() {} },
      Saturation: class { constructor() {} }
    }
  }
}

const router = useRouter()
const route = useRoute()
const photoStore = usePhotoStore()
const editorStore = useEditorStore()

// DOM refs
const canvasEl = ref(null)
const canvasWrapper = ref(null)

// State variables
const isLoading = ref(true)
const photoId = ref(route.params.id)
const exportModalOpen = ref(false)
const exportFormat = ref('jpeg')
const exportQuality = ref(0.8)

// Initialize Fabric canvas
let canvas = null

// Computed properties
const photo = computed(() => {
  return photoStore.photos.find(p => p.id === photoId.value) || null
})

const edits = computed(() => {
  return editorStore.isEditing ? editorStore.temporaryEdits : (photo.value?.edits || {})
})

// Methods
function initializeCanvas() {
  if (!canvasEl.value || !photo.value) return
  
  // Clean up any existing canvas
  if (canvas) {
    canvas.dispose()
  }
  
  // Create new canvas
  canvas = new fabric.Canvas(canvasEl.value, {
    selection: false,
    preserveObjectStacking: true
  })
  
  // Store canvas reference in editor store
  editorStore.setCanvas(canvas)
  
  // Load the image
  fabric.Image.fromURL(photo.value.src, (img) => {
    // Calculate scaling to fit canvas
    const containerWidth = canvasWrapper.value.clientWidth
    const containerHeight = canvasWrapper.value.clientHeight - 40 // Subtract some space for controls
    
    const scale = Math.min(
      containerWidth / img.width,
      containerHeight / img.height
    )
    
    // Set canvas size
    canvas.setWidth(img.width * scale)
    canvas.setHeight(img.height * scale)
    
    // Scale the image to fit
    img.scale(scale)
    
    // Center the image
    canvas.centerObject(img)
    
    // Add the image to canvas
    canvas.add(img)
    canvas.setBackgroundImage(img)
    
    // Apply any existing edits
    applyEdits()
    
    isLoading.value = false
  })
}

function applyEdits() {
  if (!canvas || !photo.value) return
  
  const filters = []
  const backgroundImage = canvas.backgroundImage
  
  if (!backgroundImage) return
  
  // Apply brightness adjustment
  if (edits.value.brightness !== 0) {
    filters.push(new fabric.Image.filters.Brightness({
      brightness: edits.value.brightness
    }))
  }
  
  // Apply contrast adjustment
  if (edits.value.contrast !== 0) {
    filters.push(new fabric.Image.filters.Contrast({
      contrast: edits.value.contrast
    }))
  }
  
  // Apply saturation adjustment
  if (edits.value.saturation !== 0) {
    filters.push(new fabric.Image.filters.Saturation({
      saturation: edits.value.saturation
    }))
  }
  
  // Apply rotation if needed
  if (edits.value.rotate !== 0) {
    backgroundImage.rotate(edits.value.rotate)
  }
  
  // Apply flip if needed
  if (edits.value.flip) {
    backgroundImage.set({
      flipX: edits.value.flip.horizontal,
      flipY: edits.value.flip.vertical
    })
  }
  
  // Apply crop if needed
  if (edits.value.crop) {
    // Cropping is more complex and might need a special implementation
    // For simplicity, we're not implementing it here
  }
  
  // Apply the filters
  backgroundImage.filters = filters
  backgroundImage.applyFilters()
  
  // Render the canvas
  canvas.renderAll()
}

function startEditing() {
  editorStore.startEditing()
}

function cancelEditing() {
  editorStore.cancelEditing()
  applyEdits()
}

function saveEdits() {
  editorStore.saveEdits()
}

function resetEdits() {
  editorStore.resetEdits()
  applyEdits()
}

function updateBrightness(value) {
  editorStore.updateBrightness(parseFloat(value))
  applyEdits()
}

function updateContrast(value) {
  editorStore.updateContrast(parseFloat(value))
  applyEdits()
}

function updateSaturation(value) {
  editorStore.updateSaturation(parseFloat(value))
  applyEdits()
}

function rotateLeft() {
  const newRotation = (edits.value.rotate - 90) % 360
  editorStore.updateRotation(newRotation)
  applyEdits()
}

function rotateRight() {
  const newRotation = (edits.value.rotate + 90) % 360
  editorStore.updateRotation(newRotation)
  applyEdits()
}

function flipHorizontal() {
  editorStore.flipHorizontal()
  applyEdits()
}

function flipVertical() {
  editorStore.flipVertical()
  applyEdits()
}

function goBack() {
  router.push({ name: 'library' })
}

function openExportModal() {
  exportModalOpen.value = true
}

function closeExportModal() {
  exportModalOpen.value = false
}

function exportImage() {
  if (!canvas) return
  
  // Export options based on format
  const options = {
    format: exportFormat.value,
    quality: exportQuality.value
  }
  
  // Get data URL from canvas
  const dataUrl = canvas.toDataURL(options)
  
  // Create a link element to trigger download
  const link = document.createElement('a')
  const fileName = photo.value.name.replace(/\.[^/.]+$/, '') + '.' + exportFormat.value
  
  link.download = fileName
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  closeExportModal()
}

function undo() {
  editorStore.undo()
  applyEdits()
}

function redo() {
  editorStore.redo()
  applyEdits()
}

// Watch for changes in photo ID or window resize
watch(() => route.params.id, (newId) => {
  photoId.value = newId
  isLoading.value = true
  initializeCanvas()
})

// Setup the canvas when component is mounted
onMounted(() => {
  // Initialize canvas after a short delay to make sure the DOM is ready
  setTimeout(initializeCanvas, 100)
  
  // Add window resize handler
  window.addEventListener('resize', initializeCanvas)
})

// Clean up when component is unmounted
onUnmounted(() => {
  window.removeEventListener('resize', initializeCanvas)
  if (canvas) {
    canvas.dispose()
    editorStore.clearCanvas()
  }
})
</script>

<template>
  <div class="editor-view">
    <div class="editor-header">
      <button 
        @click="goBack" 
        class="action-button"
        v-voix="'back-to-library-button'"
        hint="Return to the photo library">
        Back to Library
      </button>
      
      <h1 v-voix="'photo-editor-heading'">Photo Editor</h1>
      
      <div class="header-actions">
        <button 
          v-if="!editorStore.isEditing" 
          @click="startEditing" 
          class="action-button primary"
          v-voix="'start-editing-button'"
          hint="Begin editing this photo">
          Edit Photo
        </button>
        
        <template v-else>
          <button 
            @click="saveEdits" 
            class="action-button primary"
            v-voix="'save-edits-button'"
            hint="Save your changes to this photo">
            Save
          </button>
          
          <button 
            @click="cancelEditing" 
            class="action-button"
            v-voix="'cancel-edits-button'"
            hint="Cancel editing and discard changes">
            Cancel
          </button>
        </template>
        
        <button 
          @click="openExportModal" 
          class="action-button"
          v-voix="'export-button'"
          hint="Export the photo with current edits">
          Export
        </button>
      </div>
    </div>
    
    <div class="editor-container">
      <div class="tools-sidebar">
        <div class="tool-section">
          <h3 v-voix="'adjustments-heading'">Adjustments</h3>
          
          <div class="tool-control">
            <label v-voix="'brightness-label'">Brightness</label>
            <input 
              type="range" 
              min="-1" 
              max="1" 
              step="0.05" 
              :value="edits.brightness" 
              @input="updateBrightness($event.target.value)"
              :disabled="!editorStore.isEditing"
              v-voix="'brightness-slider'"
              hint="Adjust the brightness from darker to brighter">
            <span>{{ Math.round(edits.brightness * 100) }}%</span>
          </div>
          
          <div class="tool-control">
            <label v-voix="'contrast-label'">Contrast</label>
            <input 
              type="range" 
              min="-1" 
              max="1" 
              step="0.05" 
              :value="edits.contrast" 
              @input="updateContrast($event.target.value)"
              :disabled="!editorStore.isEditing"
              v-voix="'contrast-slider'"
              hint="Adjust the contrast from less to more">
            <span>{{ Math.round(edits.contrast * 100) }}%</span>
          </div>
          
          <div class="tool-control">
            <label v-voix="'saturation-label'">Saturation</label>
            <input 
              type="range" 
              min="-1" 
              max="1" 
              step="0.05" 
              :value="edits.saturation" 
              @input="updateSaturation($event.target.value)"
              :disabled="!editorStore.isEditing"
              v-voix="'saturation-slider'"
              hint="Adjust the color saturation from less to more">
            <span>{{ Math.round(edits.saturation * 100) }}%</span>
          </div>
        </div>
        
        <div class="tool-section">
          <h3 v-voix="'transform-heading'">Transform</h3>
          
          <div class="tool-buttons">
            <button 
              @click="rotateLeft" 
              :disabled="!editorStore.isEditing"
              v-voix="'rotate-left-button'"
              hint="Rotate the image 90 degrees counterclockwise">
              ↺ Rotate Left
            </button>
            
            <button 
              @click="rotateRight" 
              :disabled="!editorStore.isEditing"
              v-voix="'rotate-right-button'"
              hint="Rotate the image 90 degrees clockwise">
              ↻ Rotate Right
            </button>
            
            <button 
              @click="flipHorizontal" 
              :disabled="!editorStore.isEditing"
              v-voix="'flip-horizontal-button'"
              hint="Flip the image horizontally">
              ↔ Flip Horizontal
            </button>
            
            <button 
              @click="flipVertical" 
              :disabled="!editorStore.isEditing"
              v-voix="'flip-vertical-button'"
              hint="Flip the image vertically">
              ↕ Flip Vertical
            </button>
          </div>
        </div>
        
        <div class="tool-section" v-if="editorStore.isEditing">
          <h3 v-voix="'history-heading'">History</h3>
          
          <div class="tool-buttons">
            <button 
              @click="undo" 
              :disabled="!editorStore.canUndo"
              v-voix="'undo-button'"
              hint="Undo the last edit">
              ↩ Undo
            </button>
            
            <button 
              @click="redo" 
              :disabled="!editorStore.canRedo"
              v-voix="'redo-button'"
              hint="Redo the last undone edit">
              ↪ Redo
            </button>
            
            <button 
              @click="resetEdits" 
              v-voix="'reset-button'"
              hint="Reset all edits to default values">
              Reset All
            </button>
          </div>
        </div>
      </div>
      
      <div ref="canvasWrapper" class="canvas-wrapper">
        <div v-if="isLoading" class="loading-indicator">
          Loading image...
        </div>
        
        <canvas ref="canvasEl" id="canvas"></canvas>
      </div>
    </div>
    
    <!-- Export Modal -->
    <div v-if="exportModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2 v-voix="'export-photo-heading'">Export Photo</h2>
        
        <div class="export-options">
          <div class="option-group">
            <label v-voix="'format-label'">Format</label>
            <select 
              v-model="exportFormat"
              v-voix="'format-select'"
              hint="Choose the file format for export">
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
          
          <div class="option-group" v-if="exportFormat === 'jpeg' || exportFormat === 'webp'">
            <label v-voix="'quality-label'">Quality</label>
            <input 
              type="range" 
              min="0.1" 
              max="1" 
              step="0.1" 
              v-model="exportQuality"
              v-voix="'quality-slider'"
              hint="Adjust the export quality from lower to higher">
            <span>{{ Math.round(exportQuality * 100) }}%</span>
          </div>
        </div>
        
        <div class="modal-actions">
          <button 
            @click="closeExportModal" 
            class="action-button"
            v-voix="'cancel-export-button'"
            hint="Cancel export and close this dialog">
            Cancel
          </button>
          
          <button 
            @click="exportImage" 
            class="action-button primary"
            v-voix="'download-button'"
            hint="Download the edited image">
            Download
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-view {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  padding: 20px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.editor-container {
  display: flex;
  flex: 1;
  gap: 20px;
  overflow: hidden;
}

.tools-sidebar {
  width: 260px;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 15px;
  overflow-y: auto;
}

.tool-section {
  margin-bottom: 20px;
}

.tool-section h3 {
  margin-top: 0;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
}

.tool-control {
  margin-bottom: 10px;
}

.tool-control label {
  display: block;
  margin-bottom: 5px;
}

.tool-control input[type="range"] {
  width: 100%;
  margin-bottom: 5px;
}

.tool-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.tool-buttons button {
  padding: 8px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  border-radius: 4px;
  cursor: pointer;
}

.tool-buttons button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.canvas-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
}

.action-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  cursor: pointer;
}

.action-button.primary {
  background: #4CAF50;
  color: white;
  border-color: #45a049;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 4px;
  width: 400px;
  max-width: 90%;
}

.export-options {
  margin: 20px 0;
}

.option-group {
  margin-bottom: 15px;
}

.option-group label {
  display: block;
  margin-bottom: 5px;
}

.option-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>