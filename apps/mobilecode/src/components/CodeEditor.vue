<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { python } from '@codemirror/lang-python';
import { linter, lintGutter } from '@codemirror/lint';
import { useCodeRunnerStore } from '@/stores/codeRunner';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'javascript'
  },
  theme: {
    type: String,
    default: 'light'
  },
  fontSize: {
    type: Number,
    default: 14
  }
});

const emit = defineEmits(['update:modelValue']);

const code = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Initialize the code runner store
const codeRunnerStore = useCodeRunnerStore();

// Create a custom linter
const codeLinter = linter(view => {
  if (!props.modelValue.trim()) return [];
  
  const result = codeRunnerStore.lintCode(props.modelValue, props.language);
  
  if (!result.valid && result.errors.length > 0) {
    return result.errors.map(error => {
      // Convert error to the format CodeMirror expects
      return {
        from: error.col && error.line ? 
              getPositionFromLineCol(error.line, error.col) : 
              0,
        to: error.col && error.line ? 
            getPositionFromLineCol(error.line, error.col + 1) : 
            view.state.doc.length,
        severity: 'error',
        message: error.message
      };
    });
  }
  
  return [];
});

// Helper function to convert line/col to position
function getPositionFromLineCol(line, col) {
  // CodeMirror is 0-based for lines but browser errors are usually 1-based
  const adjustedLine = Math.max(0, line - 1);
  const lines = props.modelValue.split('\n');
  
  // Calculate position
  let pos = 0;
  for (let i = 0; i < adjustedLine; i++) {
    pos += (lines[i]?.length || 0) + 1; // +1 for newline
  }
  pos += Math.min(col || 0, lines[adjustedLine]?.length || 0);
  
  return pos;
}

// Get language extension based on prop
const extensions = computed(() => {
  const extensions = [lintGutter(), codeLinter];
  
  // Add language support
  switch (props.language) {
    case 'javascript':
      extensions.push(javascript());
      break;
    case 'html':
      extensions.push(html());
      break;
    case 'css':
      extensions.push(css());
      break;
    case 'python':
      extensions.push(python());
      break;
    default:
      extensions.push(javascript());
  }
  
  return extensions;
});

// Custom editor style
const editorStyle = computed(() => {
  return {
    fontSize: `${props.fontSize}px`,
    '--bg-color': props.theme === 'dark' ? '#1e1e1e' : 'white',
    '--text-color': props.theme === 'dark' ? '#e0e0e0' : '#333',
    '--line-number-color': props.theme === 'dark' ? '#8f908a' : '#999',
    '--cursor-color': props.theme === 'dark' ? '#fff' : '#000',
    '--selection-bg': props.theme === 'dark' ? '#4b4d57' : '#d7d4f0',
    '--active-line-bg': props.theme === 'dark' ? '#2c313a' : '#f0f9ff'
  };
});
</script>

<template>
  <div 
    class="code-editor-container"
    :class="{ 'dark': theme === 'dark' }"
  >
    <Codemirror
      v-model="code"
      :style="editorStyle"
      :extensions="extensions"
      :tab-size="2"
      :indent-with-tab="true"
      :line-numbers="true"
      class="editor-instance"
    />
  </div>
</template>

<style scoped>
.code-editor-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--editor-bg-color, white);
}

.code-editor-container.dark {
  --editor-bg-color: #1e1e1e;
}

.editor-instance {
  height: 100%;
  width: 100%;
}
</style>

<style>
/* CodeMirror custom styling - these styles need to be global */
.cm-editor {
  height: 100%;
  background-color: var(--bg-color, white);
  color: var(--text-color, #333);
}

.cm-scroller {
  font-family: monospace;
  overflow: auto;
}

.cm-content {
  caret-color: var(--cursor-color, #000);
  line-height: 1.5;
  padding: 8px 0;
}

.cm-cursor {
  border-left-color: var(--cursor-color, #000) !important;
  border-left-width: 2px !important;
}

.cm-activeLine {
  background-color: var(--active-line-bg, #f0f9ff) !important;
}

.cm-gutters {
  background-color: var(--bg-color, white) !important;
  color: var(--line-number-color, #999) !important;
  border: none !important;
}

.cm-activeLineGutter {
  background-color: var(--active-line-bg, #f0f9ff) !important;
}

.cm-selectionMatch {
  background-color: var(--selection-bg, #d7d4f0) !important;
}
</style>