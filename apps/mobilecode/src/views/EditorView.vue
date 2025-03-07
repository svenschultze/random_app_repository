<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import CodeEditor from '@/components/CodeEditor.vue';
import EditorToolbar from '@/components/EditorToolbar.vue';
import MobileSymbolsBar from '@/components/MobileSymbolsBar.vue';
import FileActions from '@/components/FileActions.vue';
import PreviewPanel from '@/components/PreviewPanel.vue';
import FileExplorer from '@/components/FileExplorer.vue';
import ConsoleOutput from '@/components/ConsoleOutput.vue';
import { useFileSystemStore } from '@/stores/fileSystem';
import { useCodeRunnerStore } from '@/stores/codeRunner';

// Initialize stores
const fileSystemStore = useFileSystemStore();
const codeRunnerStore = useCodeRunnerStore();

// Initialize on mount
onMounted(() => {
  fileSystemStore.init();
});

// UI state
const theme = ref('light');
const fontSize = ref(14);
const showFileExplorer = ref(false);
const showPreview = ref(false);
const showConsole = ref(false);
const saveStatus = ref(''); // 'saved', 'unsaved', 'saving'

// File state
const code = computed({
  get: () => {
    return fileSystemStore.selectedFile?.content || '// Select or create a file to start coding';
  },
  set: (newValue) => {
    if (fileSystemStore.selectedFileId) {
      fileSystemStore.updateFileContent(fileSystemStore.selectedFileId, newValue);
    }
  }
});

// Current file information
const filename = computed(() => fileSystemStore.selectedFile?.name || 'untitled.js');
const language = computed(() => fileSystemStore.selectedFile?.language || 'javascript');
const selectedFileId = computed(() => fileSystemStore.selectedFileId);

// Check if there's an actual file selected
const hasActiveFile = computed(() => !!selectedFileId.value);

// Create a new file in current directory
function createNewFile() {
  const defaultContent = '// Start coding here';
  const defaultName = 'untitled.js';
  const defaultLanguage = 'javascript';
  
  // Create file in current directory
  const fileId = fileSystemStore.createFile(
    defaultName, 
    defaultContent, 
    defaultLanguage
  );
  
  // No need to close explorer - user might want to rename immediately
}

// Save the current file
function saveFile() {
  if (!hasActiveFile.value) {
    // If no file is selected, create one
    createNewFile();
    return;
  }
  
  // File is already automatically saved through the store,
  // just show a saved indicator
  saveStatus.value = 'saved';
  
  // Reset after 2 seconds
  setTimeout(() => {
    saveStatus.value = '';
  }, 2000);
}

// Handle file selection from explorer
function handleFileSelected(fileId) {
  showFileExplorer.value = false;
}

// Run the current code
async function runCode() {
  if (!hasActiveFile.value) return;
  
  showConsole.value = true;
  const result = await codeRunnerStore.runCode(code.value, language.value);
  
  // If we have errors, ensure console stays open
  if (!result.success) {
    showConsole.value = true;
  }
}

// Insert symbol or snippet from the mobile bar
function insertSymbol(symbol) {
  if (hasActiveFile.value) {
    fileSystemStore.updateFileContent(
      selectedFileId.value, 
      fileSystemStore.selectedFile.content + symbol
    );
  }
}

// File types for syntax highlighting and execution
const supportedLanguages = {
  'javascript': { name: 'JavaScript', extension: 'js' },
  'html': { name: 'HTML', extension: 'html' },
  'css': { name: 'CSS', extension: 'css' },
  'python': { name: 'Python', extension: 'py' }
};


// Preview functionality is now handled by the PreviewPanel component

// Toggle settings
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('mobile-code-editor-theme', theme.value);
}

function increaseFont() {
  fontSize.value += 2;
  localStorage.setItem('mobile-code-editor-fontsize', fontSize.value);
}

function decreaseFont() {
  if (fontSize.value > 10) {
    fontSize.value -= 2;
    localStorage.setItem('mobile-code-editor-fontsize', fontSize.value);
  }
}

// Load saved preferences
onMounted(() => {
  // Load theme
  const savedTheme = localStorage.getItem('mobile-code-editor-theme');
  if (savedTheme) {
    theme.value = savedTheme;
  }
  
  // Load font size
  const savedFontSize = localStorage.getItem('mobile-code-editor-fontsize');
  if (savedFontSize) {
    fontSize.value = parseInt(savedFontSize, 10);
  }
  
  // Set document theme
  document.documentElement.setAttribute('data-theme', theme.value);
});

// Update document theme when theme changes
watch(theme, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme);
});
</script>

<template>
  <div class="editor-container" :class="{ 'dark-theme': theme === 'dark' }">
    <!-- File actions bar -->
    <FileActions 
      v-voix="'file-actions'" 
      :filename="filename" 
      :saveStatus="saveStatus"
      @save="saveFile"
      @new="createNewFile"
      @toggle-explorer="showFileExplorer = !showFileExplorer"
    />
    
    <!-- Enhanced file explorer -->
    <FileExplorer 
      v-if="showFileExplorer"
      v-voix="'file-explorer'"
      :visible="showFileExplorer"
      @close="showFileExplorer = false"
      @file-selected="handleFileSelected"
    />
    
    <!-- Editor toolbar with run button -->
    <EditorToolbar 
      v-voix="'editor-toolbar'"
      :theme="theme"
      :fontSize="fontSize"
      :showPreview="showPreview"
      :showConsole="showConsole"
      :language="language"
      @toggle-theme="toggleTheme"
      @increase-font="increaseFont"
      @decrease-font="decreaseFont"
      @toggle-preview="showPreview = !showPreview"
      @toggle-console="showConsole = !showConsole"
      @run-code="runCode"
    />
    
    <!-- Main editor area -->
    <div 
      class="editor-area" 
      :class="{ 
        'with-preview': showPreview, 
        'with-console': showConsole 
      }"
    >
      <CodeEditor 
        v-voix="'code-editor'"
        v-model="code" 
        :language="language" 
        :theme="theme"
        :fontSize="fontSize"
      />
      
      <!-- Preview panel (conditionally shown) -->
      <PreviewPanel 
        v-if="showPreview" 
        v-voix="'preview-panel'"
        :code="hasActiveFile ? code : '// Select or create a file to preview'" 
        :language="language" 
      />
    </div>
    
    <!-- Console output panel -->
    <ConsoleOutput
      :visible="showConsole"
      :language="language"
      @run-code="runCode"
      @close="showConsole = false"
    />
    
    <!-- Mobile symbols bar for coding shortcuts -->
    <MobileSymbolsBar 
      v-voix="'mobile-symbols-bar'"
      :language="language"
      @insert-symbol="insertSymbol"
    />
  </div>
</template>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.editor-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-area.with-preview {
  flex-direction: column;
}

@media (min-width: 768px) {
  .editor-area.with-preview {
    flex-direction: row;
  }
}

.preview-panel {
  flex: 1;
  min-height: 40vh;
  overflow: hidden;
  border-top: 1px solid var(--border-color);
}

@media (min-width: 768px) {
  .preview-panel {
    border-top: none;
    border-left: 1px solid var(--border-color);
  }
}

.preview-frame {
  width: 100%;
  height: 100%;
  border: none;
  background-color: white;
}

.file-explorer {
  position: absolute;
  top: 0;
  left: 0;
  width: 80%;
  height: 100vh;
  background-color: var(--bg-color);
  z-index: 100;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.file-explorer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid var(--border-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-color);
}

.file-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.file-item {
  padding: 10px;
  border-bottom: 1px solid var(--border-color-light);
  cursor: pointer;
}

.file-item:hover {
  background-color: var(--hover-color);
}

.no-files {
  padding: 20px;
  text-align: center;
  color: var(--text-color-muted);
}

.new-file-button {
  margin: 10px;
  padding: 10px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dark-theme {
  --bg-color: #1e1e1e;
  --text-color: #e0e0e0;
  --border-color: #444;
  --border-color-light: #333;
  --hover-color: #2d2d2d;
  --text-color-muted: #888;
  --accent-color: #0078d7;
}

/* Default light theme variables are set in App.vue or main.css */
</style>