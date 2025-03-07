<script setup>
import { ref } from 'vue';

const props = defineProps({
  theme: {
    type: String,
    required: true
  },
  fontSize: {
    type: Number,
    required: true
  },
  showPreview: {
    type: Boolean,
    default: false
  },
  showConsole: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'javascript'
  }
});

const emit = defineEmits([
  'toggle-theme',
  'increase-font', 
  'decrease-font',
  'toggle-preview',
  'toggle-console',
  'run-code'
]);

// Get language display name
const getLanguageDisplay = () => {
  switch (props.language) {
    case 'javascript': return 'JavaScript';
    case 'html': return 'HTML';
    case 'css': return 'CSS';
    case 'python': return 'Python';
    default: return props.language;
  }
};
</script>

<template>
  <div class="editor-toolbar">
    <!-- Left section -->
    <div class="toolbar-section">
      <!-- Theme toggle -->
      <button 
        @click="emit('toggle-theme')" 
        class="toolbar-button"
        v-voix="'toggle-theme-button'"
        :hint="theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'"
      >
        {{ theme === 'light' ? '🌙' : '☀️' }}
      </button>
      
      <!-- Font size controls -->
      <div class="font-controls">
        <button 
          @click="emit('decrease-font')" 
          class="toolbar-button"
          v-voix="'decrease-font-button'"
          hint="Decrease font size"
        >
          A-
        </button>
        <span class="font-size-display">{{ fontSize }}px</span>
        <button 
          @click="emit('increase-font')" 
          class="toolbar-button"
          v-voix="'increase-font-button'"
          hint="Increase font size"
        >
          A+
        </button>
      </div>
    </div>
    
    <!-- Middle section - language display -->
    <div class="toolbar-section language-display">
      <span class="language-badge">{{ getLanguageDisplay() }}</span>
    </div>
    
    <!-- Right section -->
    <div class="toolbar-section">
      <!-- Console toggle -->
      <button 
        @click="emit('toggle-console')" 
        class="toolbar-button"
        :class="{ 'active': showConsole }"
        v-voix="'toggle-console-button'"
        :hint="showConsole ? 'Hide console' : 'Show console'"
      >
        🖥️
      </button>
      
      <!-- Preview toggle -->
      <button 
        @click="emit('toggle-preview')" 
        class="toolbar-button"
        :class="{ 'active': showPreview }"
        v-voix="'toggle-preview-button'"
        :hint="showPreview ? 'Hide preview' : 'Show preview'"
      >
        👁️
      </button>
      
      <!-- Run button (only for javascript and python) -->
      <button 
        v-if="language === 'javascript' || language === 'python'"
        @click="emit('run-code')" 
        class="toolbar-button run-button"
        v-voix="'run-code-button'"
        :hint="'Run ' + getLanguageDisplay() + ' code'"
      >
        ▶️ Run
      </button>
    </div>
  </div>
</template>

<style scoped>
.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: var(--toolbar-bg, #f0f0f0);
  border-bottom: 1px solid var(--border-color, #ddd);
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  color: var(--button-color, #333);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-button:hover,
.toolbar-button:focus {
  background-color: var(--button-hover-bg, rgba(0, 0, 0, 0.1));
}

.toolbar-button.active {
  background-color: var(--button-active-bg, rgba(0, 0, 0, 0.2));
}

.run-button {
  font-size: 0.9rem;
  background-color: var(--run-button-bg, #28a745);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.run-button:hover {
  background-color: var(--run-button-hover-bg, #218838);
}

.font-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.font-size-display {
  font-size: 0.9rem;
  color: var(--text-color, #333);
  min-width: 40px;
  text-align: center;
}

.language-display {
  flex: 1;
  justify-content: center;
}

.language-badge {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: var(--language-badge-bg, rgba(0, 0, 0, 0.1));
  color: var(--language-badge-text, #333);
  font-weight: bold;
}

/* Media queries for mobile screens */
@media (max-width: 600px) {
  .language-display {
    display: none;
  }
  
  .font-size-display {
    min-width: 30px;
    font-size: 0.8rem;
  }
  
  .toolbar-button {
    padding: 6px;
  }
}

/* Dark theme styles are applied through CSS variables defined in parent */
</style>