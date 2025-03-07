<script setup>
import { ref, computed, watch } from 'vue';
import { useCodeRunnerStore } from '@/stores/codeRunner';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['run-code', 'close']);

// Get code runner store
const codeRunnerStore = useCodeRunnerStore();

// Computed properties for state
const isLoading = computed(() => codeRunnerStore.isRunning);
const consoleOutput = computed(() => codeRunnerStore.output);
const hasError = computed(() => codeRunnerStore.hasError);
const errors = computed(() => codeRunnerStore.errors);

// Auto-scroll to bottom when output changes
const consoleOutputRef = ref(null);
watch(consoleOutput, () => {
  if (consoleOutputRef.value) {
    setTimeout(() => {
      consoleOutputRef.value.scrollTop = consoleOutputRef.value.scrollHeight;
    }, 50);
  }
});

// Execute code
const runCode = () => {
  emit('run-code');
};

// Clear output
const clearOutput = () => {
  codeRunnerStore.clearOutput();
};

// Format timestamp
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// Get CSS class for output type
const getOutputClass = (type) => {
  switch (type) {
    case 'error': return 'console-error';
    case 'warn': return 'console-warning';
    case 'info': return 'console-info';
    default: return 'console-log';
  }
};
</script>

<template>
  <div 
    v-if="visible" 
    class="console-container"
    v-voix="'console-output'"
  >
    <div class="console-header">
      <div class="console-title">
        {{ hasError ? 'Console (Error)' : 'Console' }}
      </div>
      <div class="console-actions">
        <button 
          @click="clearOutput" 
          class="console-action-button"
          v-voix="'clear-console-button'"
          hint="Clear console output"
        >
          Clear
        </button>
        <button 
          @click="runCode" 
          class="console-action-button run-button"
          :disabled="isLoading"
          v-voix="'run-code-button'"
          :hint="'Run ' + language + ' code'"
        >
          {{ isLoading ? 'Running...' : 'Run' }}
        </button>
        <button 
          @click="$emit('close')" 
          class="console-action-button close-button"
          v-voix="'close-console-button'"
          hint="Close console panel"
        >
          ×
        </button>
      </div>
    </div>
    
    <div 
      ref="consoleOutputRef" 
      class="console-output"
      v-voix="'console-output-area'"
    >
      <div v-if="errors.length > 0" class="error-section">
        <div 
          v-for="error in errors" 
          :key="error.id" 
          class="error-item"
        >
          <div class="error-header">
            <span class="error-badge">ERROR</span>
            <span class="error-time">{{ formatTime(error.timestamp) }}</span>
          </div>
          <pre class="error-text">{{ error.text }}</pre>
          <div v-if="error.line" class="error-location">
            at line {{ error.line }}{{ error.col ? `, column ${error.col}` : '' }}
          </div>
        </div>
      </div>
      
      <div class="output-messages">
        <div 
          v-for="item in consoleOutput" 
          :key="item.id" 
          :class="['console-item', getOutputClass(item.type)]"
        >
          <span class="console-time">{{ formatTime(item.timestamp) }}</span>
          <span class="console-text">{{ item.text }}</span>
        </div>
        
        <div v-if="consoleOutput.length === 0 && !hasError" class="console-empty">
          <span v-if="language === 'javascript'">// Press Run to execute JavaScript code</span>
          <span v-else-if="language === 'python'">
            # Press Run to execute Python code
            <br><small>(First run may take a moment to load the Python runtime)</small>
          </span>
          <span v-else>// Press Run to execute code</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.console-container {
  display: flex;
  flex-direction: column;
  background-color: var(--console-bg, #1e1e1e);
  color: var(--console-text, #e0e0e0);
  border-top: 1px solid var(--border-color, #444);
  height: 40vh;
  overflow: hidden;
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: var(--console-header-bg, #252526);
  border-bottom: 1px solid var(--border-color, #444);
}

.console-title {
  font-weight: bold;
  font-size: 0.9rem;
}

.console-actions {
  display: flex;
  gap: 8px;
}

.console-action-button {
  background: none;
  border: none;
  color: var(--button-text, #e0e0e0);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.console-action-button:hover {
  background-color: var(--button-hover-bg, rgba(255, 255, 255, 0.1));
}

.console-action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.run-button {
  background-color: var(--run-button-bg, #0e639c);
}

.run-button:hover:not(:disabled) {
  background-color: var(--run-button-hover-bg, #1177bb);
}

.close-button {
  font-size: 1.2rem;
  line-height: 0.8;
}

.console-output {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  font-family: monospace;
  font-size: 0.9rem;
}

.error-section {
  margin-bottom: 8px;
}

.error-item {
  margin-bottom: 8px;
  padding: 8px;
  background-color: var(--error-bg, rgba(255, 0, 0, 0.1));
  border-left: 3px solid var(--error-border, #ff5050);
  border-radius: 4px;
}

.error-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.error-badge {
  color: var(--error-text, #ff5050);
  font-weight: bold;
}

.error-time {
  font-size: 0.8rem;
  color: var(--time-color, #888);
}

.error-text {
  margin: 4px 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.error-location {
  font-size: 0.8rem;
  color: var(--location-color, #888);
}

.console-item {
  margin: 2px 0;
  padding: 2px 0;
  border-radius: 2px;
}

.console-log {
  color: var(--log-color, #e0e0e0);
}

.console-error {
  color: var(--error-text, #ff5050);
}

.console-warning {
  color: var(--warning-text, #ffcc00);
}

.console-info {
  color: var(--info-text, #0099ff);
}

.console-time {
  font-size: 0.8rem;
  color: var(--time-color, #888);
  margin-right: 8px;
}

.console-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.console-empty {
  color: var(--comment-color, #608b4e);
  padding: 16px 0;
  font-style: italic;
}
</style>