<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ExpressionBuilder from '../components/ExpressionBuilder.vue'
import GraphVisualizer from '../components/GraphVisualizer.vue'

const route = useRoute()
const currentExpression = ref('x^2')
const graphExpression = ref('x^2')
const showControls = ref(false)
const xRange = ref([-10, 10])
const yRange = ref([-10, 10])

// Initialize with route query parameters
onMounted(() => {
  if (route.query.expr) {
    currentExpression.value = route.query.expr
    graphExpression.value = route.query.expr
  }
})

// Plot the current expression
const plotGraph = () => {
  graphExpression.value = currentExpression.value
}

// Toggle advanced controls
const toggleControls = () => {
  showControls.value = !showControls.value
}

// Update axis ranges
const updateRanges = () => {
  // Validate and update ranges
  xRange.value = [
    Math.min(xRange.value[0], xRange.value[1] - 1),
    Math.max(xRange.value[1], xRange.value[0] + 1)
  ]
  
  yRange.value = [
    Math.min(yRange.value[0], yRange.value[1] - 1),
    Math.max(yRange.value[1], yRange.value[0] + 1)
  ]
}

// Add a function preset
const addPreset = (preset) => {
  currentExpression.value = preset
  plotGraph()
}
</script>

<template>
  <div class="graph-view">
    <h1 class="screen-reader-only">CalcIntuitive Graph Visualizer</h1>
    
    <div class="graph-input-panel">
      <div class="expression-container">
        <ExpressionBuilder 
          v-model:expression="currentExpression"
        />
      </div>
      
      <div class="graph-controls">
        <button 
          @click="plotGraph" 
          class="plot-button" 
          v-voix="'PlotGraphButton'"
          hint="Visualize the current function"
        >
          Plot Graph
        </button>
        
        <button 
          @click="toggleControls" 
          class="toggle-controls-button" 
          v-voix="'ToggleControlsButton'"
          hint="Show or hide advanced graph controls"
        >
          {{ showControls ? 'Hide Controls' : 'Show Controls' }}
        </button>
      </div>
      
      <div v-if="showControls" class="advanced-controls">
        <div class="range-controls">
          <div class="range-control">
            <label v-voix="'XRangeLabel'">X Range:</label>
            <input 
              type="number" 
              v-model.number="xRange[0]" 
              @change="updateRanges"
              v-voix="'XRangeMinInput'"
              hint="Minimum value for X axis"
            />
            <span>to</span>
            <input 
              type="number" 
              v-model.number="xRange[1]" 
              @change="updateRanges"
              v-voix="'XRangeMaxInput'"
              hint="Maximum value for X axis"
            />
          </div>
          
          <div class="range-control">
            <label v-voix="'YRangeLabel'">Y Range:</label>
            <input 
              type="number" 
              v-model.number="yRange[0]" 
              @change="updateRanges"
              v-voix="'YRangeMinInput'"
              hint="Minimum value for Y axis"
            />
            <span>to</span>
            <input 
              type="number" 
              v-model.number="yRange[1]" 
              @change="updateRanges"
              v-voix="'YRangeMaxInput'"
              hint="Maximum value for Y axis"
            />
          </div>
        </div>
        
        <div class="presets">
          <div class="presets-title" v-voix="'PresetsTitle'">Function Presets:</div>
          <div class="preset-buttons">
            <button 
              v-for="(preset, index) in ['x^2', 'sin(x)', 'cos(x)', 'tan(x)', 'log(x)', 'e^x', '1/x']"
              :key="index"
              @click="addPreset(preset)"
              class="preset-button"
              v-voix="'Preset' + index"
              :hint="`Use function preset: ${preset}`"
            >
              {{ preset }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="graph-container">
      <GraphVisualizer 
        :expression="graphExpression"
        :x-range="xRange"
        :y-range="yRange"
      />
    </div>
  </div>
</template>

<style scoped>
.graph-view {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.graph-input-panel {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.expression-container {
  margin-bottom: 1.5rem;
}

.graph-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.plot-button, .toggle-controls-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.plot-button {
  background-color: var(--color-primary);
  color: white;
  font-weight: bold;
}

.toggle-controls-button {
  background-color: var(--color-background-mute);
  color: var(--color-text);
}

.plot-button:hover, .toggle-controls-button:hover {
  transform: translateY(-2px);
}

.plot-button:active, .toggle-controls-button:active {
  transform: translateY(1px);
}

.advanced-controls {
  padding: 1rem;
  background-color: var(--color-background-mute);
  border-radius: 4px;
}

.range-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.range-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-control input {
  width: 60px;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  text-align: center;
}

.presets {
  margin-top: 1rem;
}

.presets-title {
  margin-bottom: 0.75rem;
  font-weight: bold;
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.preset-button {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: var(--color-background);
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: monospace;
}

.preset-button:hover {
  background-color: var(--color-primary);
  color: white;
}

.graph-container {
  margin-top: 2rem;
}

.screen-reader-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>