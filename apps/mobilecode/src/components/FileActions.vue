<script setup>
import { ref } from 'vue';

const props = defineProps({
  filename: {
    type: String,
    required: true
  },
  saveStatus: {
    type: String,
    default: ''
  }
});

const emit = defineEmits([
  'update:filename',
  'save',
  'new',
  'toggle-explorer'
]);

const isEditingFilename = ref(false);
const editableFilename = ref(props.filename);

function startEditingFilename() {
  editableFilename.value = props.filename;
  isEditingFilename.value = true;
}

function saveFilename() {
  if (editableFilename.value.trim()) {
    emit('update:filename', editableFilename.value);
  } else {
    editableFilename.value = props.filename;
  }
  isEditingFilename.value = false;
}
</script>

<template>
  <div class="file-actions">
    <!-- Files button -->
    <button 
      @click="emit('toggle-explorer')" 
      class="action-button files-button"
      v-voix="'files-button'"
      hint="Open file explorer"
    >
      📁
    </button>
    
    <!-- Filename (clickable to edit) -->
    <div class="filename-container">
      <div 
        v-if="!isEditingFilename" 
        @click="startEditingFilename" 
        class="filename"
        v-voix="'filename-display'"
        hint="Click to edit filename"
      >
        {{ filename }}
      </div>
      <input 
        v-else 
        v-model="editableFilename" 
        @blur="saveFilename" 
        @keyup.enter="saveFilename" 
        class="filename-input"
        ref="filenameInput"
        v-voix="'filename-input'"
        hint="Enter new filename and press Enter"
      />
    </div>
    
    <!-- Save status indicator -->
    <div class="save-status" v-if="saveStatus">
      <span v-if="saveStatus === 'saving'" class="saving-indicator">Saving...</span>
      <span v-if="saveStatus === 'saved'" class="saved-indicator">Saved ✓</span>
    </div>
    
    <!-- Save/New buttons -->
    <div class="file-buttons">
      <button 
        @click="emit('new')" 
        class="action-button new-button"
        v-voix="'new-file-button'"
        hint="Create new file"
      >
        New
      </button>
      <button 
        @click="emit('save')" 
        class="action-button save-button"
        v-voix="'save-file-button'"
        hint="Save current file"
      >
        Save
      </button>
    </div>
  </div>
</template>

<style scoped>
.file-actions {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: var(--header-bg, #2c3e50);
  color: var(--header-text, white);
}

.action-button {
  background: none;
  border: none;
  color: var(--button-text, white);
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 4px;
  margin: 0 2px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.action-button:hover {
  background-color: var(--button-hover, rgba(255, 255, 255, 0.1));
}

.files-button {
  font-size: 1.2rem;
  padding: 6px 8px;
}

.filename-container {
  flex: 1;
  margin: 0 10px;
  overflow: hidden;
}

.filename {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
}

.filename:hover {
  background-color: var(--button-hover, rgba(255, 255, 255, 0.1));
}

.filename-input {
  width: 100%;
  background-color: var(--input-bg, #1a2734);
  color: var(--input-text, white);
  border: 1px solid var(--input-border, #3d5066);
  border-radius: 4px;
  padding: 6px;
  font-size: 0.9rem;
}

.save-status {
  font-size: 0.8rem;
  margin-right: 8px;
  min-width: 60px;
}

.saving-indicator {
  color: var(--saving-color, #f0ad4e);
}

.saved-indicator {
  color: var(--saved-color, #5cb85c);
}

.file-buttons {
  display: flex;
}

.save-button {
  background-color: var(--save-button-bg, #28a745);
}

.save-button:hover {
  background-color: var(--save-button-hover, #218838);
}

.new-button {
  background-color: var(--new-button-bg, #007bff);
}

.new-button:hover {
  background-color: var(--new-button-hover, #0069d9);
}

@media (max-width: 576px) {
  .action-button {
    padding: 6px 8px;
  }
  
  .file-buttons {
    display: flex;
  }
}
</style>