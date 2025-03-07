<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFileSystemStore } from '@/stores/fileSystem';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'file-selected']);

// Get file system store
const fileSystemStore = useFileSystemStore();

// Initialize file system on mount
onMounted(() => {
  fileSystemStore.init();
});

// Computed properties
const currentPath = computed(() => fileSystemStore.currentPath);
const currentFiles = computed(() => fileSystemStore.currentFiles);
const currentFolders = computed(() => fileSystemStore.currentFolders);
const breadcrumbs = computed(() => fileSystemStore.breadcrumbs);
const canNavigateUp = computed(() => fileSystemStore.parentPath !== null);
const selectedFileId = computed(() => fileSystemStore.selectedFileId);

// State for UI interactions
const newItemName = ref('');
const isCreatingFile = ref(false);
const isCreatingFolder = ref(false);
const renamingItemId = ref(null);
const renamingItemType = ref(null); // 'file' or 'folder'
const newItemNameRef = ref(null);
const editedName = ref('');

// File types for icons
const fileIcons = {
  js: '📄',
  html: '🌐',
  css: '🎨',
  json: '📋',
  py: '🐍',
  default: '📄'
};

// Get icon for file
const getFileIcon = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  return fileIcons[extension] || fileIcons.default;
};

// Select a file
const selectFile = (fileId) => {
  fileSystemStore.selectFile(fileId);
  emit('file-selected', fileId);
};

// Navigate to folder
const navigateToFolder = (path) => {
  fileSystemStore.navigateToPath(path);
};

// Navigate up to parent folder
const navigateUp = () => {
  if (canNavigateUp.value) {
    fileSystemStore.navigateToParent();
  }
};

// Start creating new file
const startCreatingFile = () => {
  isCreatingFile.value = true;
  isCreatingFolder.value = false;
  renamingItemId.value = null;
  newItemName.value = '';
  
  // Focus the input on next tick
  setTimeout(() => {
    if (newItemNameRef.value) {
      newItemNameRef.value.focus();
    }
  }, 50);
};

// Start creating new folder
const startCreatingFolder = () => {
  isCreatingFolder.value = true;
  isCreatingFile.value = false;
  renamingItemId.value = null;
  newItemName.value = '';
  
  // Focus the input on next tick
  setTimeout(() => {
    if (newItemNameRef.value) {
      newItemNameRef.value.focus();
    }
  }, 50);
};

// Create new file
const createNewFile = () => {
  if (newItemName.value.trim()) {
    const fileId = fileSystemStore.createFile(
      newItemName.value,
      '',
      detectLanguage(newItemName.value)
    );
    
    isCreatingFile.value = false;
    newItemName.value = '';
    
    // Select the new file
    selectFile(fileId);
  }
};

// Create new folder
const createNewFolder = () => {
  if (newItemName.value.trim()) {
    fileSystemStore.createFolder(newItemName.value);
    isCreatingFolder.value = false;
    newItemName.value = '';
  }
};

// Detect language based on file extension
const detectLanguage = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  switch (extension) {
    case 'js': return 'javascript';
    case 'html': return 'html';
    case 'css': return 'css';
    case 'py': return 'python';
    default: return 'javascript';
  }
};

// Start renaming item
const startRenaming = (itemId, type) => {
  renamingItemId.value = itemId;
  renamingItemType.value = type;
  
  // Set initial value based on type
  if (type === 'file') {
    const file = fileSystemStore.files.find(f => f.id === itemId);
    editedName.value = file ? file.name : '';
  } else if (type === 'folder') {
    const folder = fileSystemStore.folders.find(f => f.id === itemId);
    editedName.value = folder ? folder.name : '';
  }
  
  // Focus the input on next tick
  setTimeout(() => {
    const renameInput = document.getElementById(`rename-input-${itemId}`);
    if (renameInput) {
      renameInput.focus();
      renameInput.select();
    }
  }, 50);
};

// Finish renaming item
const finishRenaming = () => {
  if (editedName.value.trim() && renamingItemId.value) {
    if (renamingItemType.value === 'file') {
      fileSystemStore.renameFile(renamingItemId.value, editedName.value);
    } else if (renamingItemType.value === 'folder') {
      fileSystemStore.renameFolder(renamingItemId.value, editedName.value);
    }
  }
  
  renamingItemId.value = null;
  renamingItemType.value = null;
  editedName.value = '';
};

// Cancel renaming or creating
const cancelAction = () => {
  isCreatingFile.value = false;
  isCreatingFolder.value = false;
  renamingItemId.value = null;
  renamingItemType.value = null;
  newItemName.value = '';
  editedName.value = '';
};

// Delete item
const deleteItem = (itemId, type) => {
  if (confirm(`Are you sure you want to delete this ${type}?`)) {
    if (type === 'file') {
      fileSystemStore.deleteFile(itemId);
    } else if (type === 'folder') {
      fileSystemStore.deleteFolder(itemId);
    }
  }
};

// Handle key events
const handleKeyDown = (event, action) => {
  if (event.key === 'Enter') {
    if (action === 'createFile') {
      createNewFile();
    } else if (action === 'createFolder') {
      createNewFolder();
    } else if (action === 'rename') {
      finishRenaming();
    }
  } else if (event.key === 'Escape') {
    cancelAction();
  }
};
</script>

<template>
  <div 
    v-if="visible" 
    class="file-explorer"
    v-voix="'file-explorer'"
  >
    <div class="explorer-header">
      <h3>Files</h3>
      <div class="explorer-actions">
        <button 
          @click="startCreatingFile" 
          class="action-button"
          v-voix="'new-file-button'"
          hint="Create a new file"
        >
          New File
        </button>
        <button 
          @click="startCreatingFolder" 
          class="action-button"
          v-voix="'new-folder-button'"
          hint="Create a new folder"
        >
          New Folder
        </button>
        <button 
          @click="$emit('close')" 
          class="close-button"
          v-voix="'close-explorer-button'"
          hint="Close file explorer"
        >
          ×
        </button>
      </div>
    </div>
    
    <!-- Breadcrumb navigation -->
    <div class="breadcrumbs">
      <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
        <span 
          v-if="index > 0" 
          class="breadcrumb-separator"
        >/</span>
        <button 
          @click="navigateToFolder(crumb.path)" 
          class="breadcrumb-button"
          :class="{ 'current': index === breadcrumbs.length - 1 }"
          v-voix="'breadcrumb-' + crumb.path"
          :hint="'Navigate to ' + crumb.name"
        >
          {{ crumb.name }}
        </button>
      </template>
    </div>
    
    <!-- File creation form -->
    <div v-if="isCreatingFile || isCreatingFolder" class="new-item-form">
      <input 
        ref="newItemNameRef"
        v-model="newItemName" 
        :placeholder="isCreatingFile ? 'New file name (example.js)' : 'New folder name'"
        class="new-item-input"
        @keydown="handleKeyDown($event, isCreatingFile ? 'createFile' : 'createFolder')"
        v-voix="'new-item-input'"
        :hint="isCreatingFile ? 'Enter new file name' : 'Enter new folder name'"
      />
      <div class="new-item-actions">
        <button 
          @click="isCreatingFile ? createNewFile() : createNewFolder()" 
          class="action-button"
          v-voix="'create-button'"
          hint="Create new item"
        >
          Create
        </button>
        <button 
          @click="cancelAction" 
          class="action-button"
          v-voix="'cancel-button'"
          hint="Cancel creation"
        >
          Cancel
        </button>
      </div>
    </div>
    
    <!-- Navigation button -->
    <div v-if="canNavigateUp" class="navigation-section">
      <button 
        @click="navigateUp" 
        class="navigation-button"
        v-voix="'parent-directory-button'"
        hint="Go to parent directory"
      >
        <span class="nav-icon">⬆️</span> Parent Directory
      </button>
    </div>
    
    <!-- Folders list -->
    <div class="folders-section">
      <div 
        v-for="folder in currentFolders" 
        :key="folder.id" 
        class="folder-item"
      >
        <div class="folder-content">
          <template v-if="renamingItemId === folder.id && renamingItemType === 'folder'">
            <input 
              :id="`rename-input-${folder.id}`"
              v-model="editedName" 
              class="rename-input"
              @keydown="handleKeyDown($event, 'rename')"
              @blur="finishRenaming"
              v-voix="'rename-folder-input'"
              hint="Enter new folder name"
            />
          </template>
          <template v-else>
            <button 
              @click="navigateToFolder(folder.path)" 
              class="folder-button"
              v-voix="'folder-' + folder.id"
              :hint="'Open folder ' + folder.name"
            >
              <span class="folder-icon">📁</span>
              {{ folder.name }}
            </button>
            
            <div class="item-actions">
              <button 
                @click="startRenaming(folder.id, 'folder')" 
                class="item-action-button"
                v-voix="'rename-folder-' + folder.id"
                :hint="'Rename folder ' + folder.name"
              >
                ✏️
              </button>
              <button 
                @click="deleteItem(folder.id, 'folder')" 
                class="item-action-button delete-button"
                v-voix="'delete-folder-' + folder.id"
                :hint="'Delete folder ' + folder.name"
              >
                🗑️
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
    
    <!-- Files list -->
    <div class="files-section">
      <div 
        v-for="file in currentFiles" 
        :key="file.id" 
        class="file-item"
        :class="{ 'selected': selectedFileId === file.id }"
      >
        <div class="file-content">
          <template v-if="renamingItemId === file.id && renamingItemType === 'file'">
            <input 
              :id="`rename-input-${file.id}`"
              v-model="editedName" 
              class="rename-input"
              @keydown="handleKeyDown($event, 'rename')"
              @blur="finishRenaming"
              v-voix="'rename-file-input'"
              hint="Enter new file name"
            />
          </template>
          <template v-else>
            <button 
              @click="selectFile(file.id)" 
              class="file-button"
              v-voix="'file-' + file.id"
              :hint="'Open file ' + file.name"
            >
              <span class="file-icon">{{ getFileIcon(file.name) }}</span>
              {{ file.name }}
            </button>
            
            <div class="item-actions">
              <button 
                @click="startRenaming(file.id, 'file')" 
                class="item-action-button"
                v-voix="'rename-file-' + file.id"
                :hint="'Rename file ' + file.name"
              >
                ✏️
              </button>
              <button 
                @click="deleteItem(file.id, 'file')" 
                class="item-action-button delete-button"
                v-voix="'delete-file-' + file.id"
                :hint="'Delete file ' + file.name"
              >
                🗑️
              </button>
            </div>
          </template>
        </div>
      </div>
      
      <div v-if="currentFiles.length === 0 && currentFolders.length === 0" class="empty-state">
        <p>No files or folders in this directory</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-explorer {
  position: absolute;
  top: 0;
  left: 0;
  width: 85%;
  height: 100vh;
  background-color: var(--bg-color);
  z-index: 100;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.explorer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--header-bg, #252526);
}

.explorer-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--header-text, white);
}

.explorer-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  background: none;
  border: none;
  color: var(--button-text, white);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.action-button:hover {
  background-color: var(--button-hover-bg, rgba(255, 255, 255, 0.1));
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-color);
  padding: 0 8px;
}

.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  padding: 8px 10px;
  background-color: var(--breadcrumb-bg, #333);
  border-bottom: 1px solid var(--border-color);
  font-size: 0.85rem;
  align-items: center;
}

.breadcrumb-button {
  background: none;
  border: none;
  color: var(--breadcrumb-text, #ccc);
  cursor: pointer;
  padding: 2px 4px;
  margin: 0;
  border-radius: 3px;
}

.breadcrumb-button:hover {
  background-color: var(--breadcrumb-hover-bg, rgba(255, 255, 255, 0.1));
  color: var(--breadcrumb-hover-text, white);
}

.breadcrumb-button.current {
  color: var(--breadcrumb-current-text, white);
  font-weight: bold;
}

.breadcrumb-separator {
  color: var(--breadcrumb-separator, #888);
  margin: 0 4px;
}

.new-item-form {
  padding: 10px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--form-bg, #2d2d2d);
}

.new-item-input {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--input-border, #444);
  border-radius: 4px;
  background-color: var(--input-bg, #1e1e1e);
  color: var(--input-text, white);
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.new-item-input:focus {
  outline: 2px solid var(--accent-color, #007bff);
}

.new-item-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.navigation-section {
  padding: 8px 10px;
  border-bottom: 1px solid var(--border-color-light);
}

.navigation-button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  background-color: var(--nav-button-bg, #383838);
  border: none;
  border-radius: 4px;
  color: var(--nav-button-text, #ddd);
  cursor: pointer;
  text-align: left;
  font-size: 0.9rem;
}

.navigation-button:hover {
  background-color: var(--nav-button-hover-bg, #444);
}

.nav-icon {
  font-size: 1rem;
}

.folders-section,
.files-section {
  overflow-y: auto;
  padding: 8px 10px;
}

.folders-section {
  border-bottom: 1px solid var(--border-color-light);
}

.folder-item,
.file-item {
  margin-bottom: 4px;
}

.folder-content,
.file-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

.folder-button,
.file-button {
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: none;
  background: none;
  color: var(--text-color);
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  border-radius: 4px;
}

.folder-button:hover,
.file-button:hover {
  background-color: var(--hover-color);
}

.file-item.selected .file-button {
  background-color: var(--selected-bg, #094771);
  color: var(--selected-text, white);
}

.folder-icon,
.file-icon {
  font-size: 1.1rem;
}

.item-actions {
  display: flex;
  gap: 2px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.folder-content:hover .item-actions,
.file-content:hover .item-actions {
  opacity: 1;
}

.item-action-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
  border-radius: 4px;
}

.item-action-button:hover {
  background-color: var(--button-hover-bg, rgba(255, 255, 255, 0.1));
}

.delete-button:hover {
  background-color: var(--delete-button-bg, rgba(255, 0, 0, 0.2));
}

.rename-input {
  flex-grow: 1;
  padding: 6px 8px;
  border: 1px solid var(--input-border, #444);
  border-radius: 4px;
  background-color: var(--input-bg, #1e1e1e);
  color: var(--input-text, white);
  font-size: 0.9rem;
  margin-right: 8px;
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: var(--text-color-muted);
  font-style: italic;
}
</style>