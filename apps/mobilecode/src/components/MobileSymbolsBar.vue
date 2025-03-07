<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  language: {
    type: String,
    default: 'javascript'
  }
});

// Common symbols for all languages
const commonSymbols = [
  { text: '(', hint: 'Insert opening parenthesis' },
  { text: ')', hint: 'Insert closing parenthesis' },
  { text: '[', hint: 'Insert opening square bracket' },
  { text: ']', hint: 'Insert closing square bracket' },
  { text: '=', hint: 'Insert equals sign' },
  { text: '.', hint: 'Insert period' },
  { text: '\'', hint: 'Insert single quote' },
  { text: '"', hint: 'Insert double quote' },
  { text: ':', hint: 'Insert colon' },
  { text: ',', hint: 'Insert comma' }
];

// Language-specific symbols
const jsSymbols = [
  { text: '{', hint: 'Insert opening curly brace' },
  { text: '}', hint: 'Insert closing curly brace' },
  { text: ';', hint: 'Insert semicolon' },
  { text: '=>', hint: 'Insert arrow function' },
  { text: '===', hint: 'Insert strict equality' },
  { text: '!==', hint: 'Insert strict inequality' },
  { text: '`', hint: 'Insert backtick for template literals' }
];

const htmlSymbols = [
  { text: '<', hint: 'Insert less-than sign' },
  { text: '>', hint: 'Insert greater-than sign' },
  { text: '</', hint: 'Insert closing tag prefix' },
  { text: '/>', hint: 'Insert self-closing tag suffix' },
  { text: '="', hint: 'Insert attribute equals quote' }
];

const cssSymbols = [
  { text: '{', hint: 'Insert opening curly brace' },
  { text: '}', hint: 'Insert closing curly brace' },
  { text: ';', hint: 'Insert semicolon' },
  { text: '#', hint: 'Insert hash for ID selector' },
  { text: '.', hint: 'Insert period for class selector' },
  { text: ':', hint: 'Insert colon for pseudo-selectors' },
  { text: '!important', hint: 'Insert !important declaration' }
];

const pythonSymbols = [
  { text: ':', hint: 'Insert colon' },
  { text: 'def ', hint: 'Insert Python function prefix' },
  { text: 'class ', hint: 'Insert Python class prefix' },
  { text: 'import ', hint: 'Insert import statement' },
  { text: 'from ', hint: 'Insert from statement' },
  { text: 'if ', hint: 'Insert if statement prefix' },
  { text: 'elif ', hint: 'Insert elif statement prefix' },
  { text: 'else:', hint: 'Insert else statement' },
  { text: '    ', hint: 'Insert 4 spaces (indentation)' }
];

// Language-specific snippets
const jsSnippets = [
  { text: 'function() {\n  \n}', display: 'func', hint: 'Insert function' },
  { text: 'if () {\n  \n}', display: 'if', hint: 'Insert if statement' },
  { text: 'for (let i = 0; i < ; i++) {\n  \n}', display: 'for', hint: 'Insert for loop' },
  { text: 'const  = ', display: 'const', hint: 'Insert constant declaration' },
  { text: 'let  = ', display: 'let', hint: 'Insert variable declaration' },
  { text: 'console.log()', display: 'log', hint: 'Insert console.log' },
  { text: '() => {\n  \n}', display: 'arrow', hint: 'Insert arrow function' }
];

const htmlSnippets = [
  { text: '<div>\n  \n</div>', display: 'div', hint: 'Insert div element' },
  { text: '<span></span>', display: 'span', hint: 'Insert span element' },
  { text: '<p>\n  \n</p>', display: 'p', hint: 'Insert paragraph' },
  { text: '<a href=""></a>', display: 'a', hint: 'Insert anchor tag' },
  { text: '<img src="" alt="">', display: 'img', hint: 'Insert image' },
  { text: '<ul>\n  <li></li>\n</ul>', display: 'ul', hint: 'Insert unordered list' },
  { text: '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title></title>\n</head>\n<body>\n  \n</body>\n</html>', display: 'html', hint: 'Insert HTML template' }
];

const cssSnippets = [
  { text: 'display: flex;', display: 'flex', hint: 'Insert flexbox display' },
  { text: 'display: grid;', display: 'grid', hint: 'Insert grid display' },
  { text: 'margin: 0;', display: 'margin', hint: 'Insert margin property' },
  { text: 'padding: 0;', display: 'padding', hint: 'Insert padding property' },
  { text: 'border: 1px solid black;', display: 'border', hint: 'Insert border property' },
  { text: 'color: ;', display: 'color', hint: 'Insert color property' },
  { text: 'background-color: ;', display: 'bg-color', hint: 'Insert background-color property' }
];

const pythonSnippets = [
  { text: 'def function_name():\n    ', display: 'def', hint: 'Insert function definition' },
  { text: 'class ClassName:\n    def __init__(self):\n        ', display: 'class', hint: 'Insert class definition' },
  { text: 'if condition:\n    ', display: 'if', hint: 'Insert if block' },
  { text: 'for item in collection:\n    ', display: 'for', hint: 'Insert for loop' },
  { text: 'while condition:\n    ', display: 'while', hint: 'Insert while loop' },
  { text: 'print()', display: 'print', hint: 'Insert print statement' },
  { text: 'return ', display: 'return', hint: 'Insert return statement' }
];

// Computed symbols and snippets based on language
const symbols = computed(() => {
  const baseSymbols = [...commonSymbols];
  
  switch (props.language) {
    case 'javascript':
      return [...baseSymbols, ...jsSymbols];
    case 'html':
      return [...baseSymbols, ...htmlSymbols];
    case 'css':
      return [...baseSymbols, ...cssSymbols];
    case 'python':
      return [...baseSymbols, ...pythonSymbols];
    default:
      return baseSymbols;
  }
});

const snippets = computed(() => {
  switch (props.language) {
    case 'javascript':
      return jsSnippets;
    case 'html':
      return htmlSnippets;
    case 'css':
      return cssSnippets;
    case 'python':
      return pythonSnippets;
    default:
      return jsSnippets;
  }
});

const emit = defineEmits(['insert-symbol']);

const showSnippets = ref(false);

function toggleSnippets() {
  showSnippets.value = !showSnippets.value;
}

function insertSymbol(symbol) {
  emit('insert-symbol', symbol.text);
}
</script>

<template>
  <div class="mobile-symbols-bar">
    <div class="bar-toggle">
      <button 
        @click="toggleSnippets" 
        class="toggle-button"
        v-voix="'toggle-snippets-button'"
        :hint="showSnippets ? 'Show symbols' : 'Show snippets'"
      >
        {{ showSnippets ? 'Symbols' : 'Snippets' }}
      </button>
    </div>
    
    <div class="symbols-container">
      <template v-if="!showSnippets">
        <button 
          v-for="(symbol, index) in symbols" 
          :key="`symbol-${index}`" 
          @click="insertSymbol(symbol)" 
          class="symbol-button"
          v-voix="'symbol-button-' + symbol.text"
          :hint="symbol.hint"
        >
          {{ symbol.text }}
        </button>
      </template>
      
      <template v-else>
        <button 
          v-for="(snippet, index) in snippets" 
          :key="`snippet-${index}`" 
          @click="insertSymbol(snippet)" 
          class="snippet-button"
          v-voix="'snippet-button-' + snippet.display"
          :hint="snippet.hint"
        >
          {{ snippet.display }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.mobile-symbols-bar {
  display: flex;
  flex-wrap: wrap;
  padding: 8px 4px;
  background-color: var(--symbols-bar-bg, #f0f0f0);
  border-top: 1px solid var(--border-color, #ddd);
  overflow-x: auto;
  white-space: nowrap;
}

.bar-toggle {
  flex: 0 0 auto;
  margin-right: 8px;
}

.toggle-button {
  background-color: var(--toggle-button-bg, #007bff);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 0.9rem;
  cursor: pointer;
}

.symbols-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 4px;
  padding-bottom: 4px;
  flex: 1;
}

.symbol-button,
.snippet-button {
  flex: 0 0 auto;
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--button-border, #ccc);
  border-radius: 4px;
  background-color: var(--button-bg, white);
  font-family: monospace;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0 8px;
}

.symbol-button:hover,
.snippet-button:hover {
  background-color: var(--button-hover-bg, #f5f5f5);
}

.snippet-button {
  font-size: 0.9rem;
  min-width: auto;
  padding: 0 10px;
}

/* Custom scrollbar for the symbols container */
.symbols-container::-webkit-scrollbar {
  height: 4px;
}

.symbols-container::-webkit-scrollbar-track {
  background: var(--scrollbar-track, #f1f1f1);
}

.symbols-container::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb, #888);
  border-radius: 2px;
}

.symbols-container::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover, #555);
}
</style>