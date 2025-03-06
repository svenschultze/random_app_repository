<script setup>
import { ref } from 'vue'

const emit = defineEmits(['insert-symbol', 'change-mode'])

// Define tool categories
const categories = ref([
  {
    name: 'Basic',
    tools: [
      { display: '+', value: '+', description: 'Addition' },
      { display: '−', value: '-', description: 'Subtraction' },
      { display: '×', value: '*', description: 'Multiplication' },
      { display: '÷', value: '/', description: 'Division' },
      { display: '^', value: '^', description: 'Exponent' },
      { display: '√', value: 'sqrt()', description: 'Square root' },
      { display: '()', value: '()', description: 'Parentheses' },
    ]
  },
  {
    name: 'Functions',
    tools: [
      { display: 'sin', value: 'sin()', description: 'Sine function' },
      { display: 'cos', value: 'cos()', description: 'Cosine function' },
      { display: 'tan', value: 'tan()', description: 'Tangent function' },
      { display: 'log', value: 'log()', description: 'Logarithm' },
      { display: 'ln', value: 'ln()', description: 'Natural logarithm' },
      { display: '|x|', value: 'abs()', description: 'Absolute value' },
    ]
  },
  {
    name: 'Advanced',
    tools: [
      { display: 'x', value: 'x', description: 'Variable x' },
      { display: '=', value: '=', description: 'Equals sign' },
      { display: '∫', value: '∫', description: 'Integral' },
      { display: 'd/dx', value: 'd/dx()', description: 'Derivative' },
      { display: '∑', value: '∑', description: 'Summation' },
      { display: 'π', value: 'pi', description: 'Pi constant' },
      { display: 'e', value: 'e', description: 'Euler\'s number' },
    ]
  }
])

const activeCategory = ref('Basic')

const setCategory = (category) => {
  activeCategory.value = category
}

const insertSymbol = (tool) => {
  emit('insert-symbol', tool)
}

const changeMode = (mode) => {
  emit('change-mode', mode)
}
</script>

<template>
  <div class="calculator-tools">
    <div class="tool-categories">
      <button 
        v-for="category in categories" 
        :key="category.name"
        @click="setCategory(category.name)"
        :class="{ active: activeCategory === category.name }"
        v-voix="'Category' + category.name"
        :hint="`Switch to ${category.name} tools`"
      >
        {{ category.name }}
      </button>
    </div>
    
    <div class="tool-grid">
      <button 
        v-for="(tool, index) in categories.find(c => c.name === activeCategory).tools" 
        :key="index"
        @click="insertSymbol(tool)"
        class="tool-button"
        v-voix="'Tool' + tool.display"
        :hint="tool.description"
      >
        {{ tool.display }}
      </button>
    </div>
    
    <div class="mode-switchers">
      <button 
        @click="changeMode('matrix')" 
        class="mode-button"
        v-voix="'MatrixModeButton'"
        hint="Switch to matrix operation mode"
      >
        Matrix Mode
      </button>
      <button 
        @click="changeMode('graph')" 
        class="mode-button"
        v-voix="'GraphModeButton'"
        hint="Switch to graph visualization mode"
      >
        Graph Mode
      </button>
      <button 
        @click="changeMode('unit')" 
        class="mode-button"
        v-voix="'UnitConversionButton'"
        hint="Switch to unit conversion mode"
      >
        Unit Conversion
      </button>
    </div>
  </div>
</template>

<style scoped>
.calculator-tools {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.tool-categories {
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.tool-categories button {
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  color: var(--color-text-light);
}

.tool-categories button.active {
  border-bottom-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: bold;
}

.tool-categories button:hover {
  color: var(--color-text);
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.tool-button {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background-soft);
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  font-size: 1.1rem;
}

.tool-button:hover {
  background-color: var(--color-background-mute);
  transform: translateY(-2px);
}

.tool-button:active {
  transform: translateY(1px);
}

.mode-switchers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.mode-button {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.9rem;
}

.mode-button:hover {
  background-color: var(--color-primary);
  color: white;
}
</style>