<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ExpressionBuilder from '../components/ExpressionBuilder.vue'
import CalculatorTools from '../components/CalculatorTools.vue'

const router = useRouter()
const route = useRoute()
const currentExpression = ref('')
const currentMode = ref('symbolic') // symbolic, matrix, calculus
const matrixDimensions = ref({ rows: 2, cols: 2 })
const matrixData = ref([])

// Initialize from route query parameters
onMounted(() => {
  if (route.query.expr) {
    currentExpression.value = route.query.expr
  }
  
  if (route.query.mode && ['symbolic', 'matrix', 'calculus'].includes(route.query.mode)) {
    currentMode.value = route.query.mode
  }
  
  // Initialize matrix data if in matrix mode
  if (currentMode.value === 'matrix') {
    initializeMatrix()
  }
})

// Initialize matrix with zeros
const initializeMatrix = () => {
  const { rows, cols } = matrixDimensions.value
  matrixData.value = Array(rows).fill().map(() => Array(cols).fill(0))
}

// Update matrix dimensions
const updateMatrixDimensions = (newRows, newCols) => {
  matrixDimensions.value = { 
    rows: Math.max(1, Math.min(5, newRows)), 
    cols: Math.max(1, Math.min(5, newCols)) 
  }
  initializeMatrix()
}

// Update matrix cell value
const updateMatrixCell = (row, col, value) => {
  matrixData.value[row][col] = parseFloat(value) || 0
}

// Handle mode change
const handleModeChange = (mode) => {
  if (mode === 'graph') {
    router.push({ 
      path: '/graph',
      query: { expr: currentExpression.value }
    })
  } else if (mode === 'standard') {
    router.push('/')
  } else if (['symbolic', 'matrix', 'calculus'].includes(mode)) {
    currentMode.value = mode
    
    if (mode === 'matrix') {
      initializeMatrix()
    }
  }
}

// Insert symbol into the expression
const handleInsertSymbol = (tool) => {
  if (tool.value.endsWith('()')) {
    const baseValue = tool.value.substring(0, tool.value.length - 2)
    currentExpression.value += baseValue + '('
  } else {
    currentExpression.value += tool.value
  }
}

// Execute calculation
const handleCalculation = (result) => {
  console.log('Advanced calculation result:', result)
}
</script>

<template>
  <div class="advanced-view">
    <h1 class="screen-reader-only">CalcIntuitive Advanced Calculator</h1>
    
    <div class="mode-selector">
      <button 
        v-for="mode in ['symbolic', 'matrix', 'calculus']" 
        :key="mode"
        @click="handleModeChange(mode)"
        :class="{ active: currentMode === mode }"
        v-voix="'AdvancedMode' + mode.charAt(0).toUpperCase() + mode.slice(1)"
        :hint="`Switch to ${mode} calculation mode`"
      >
        {{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
      </button>
    </div>
    
    <div class="mode-specific-panel">
      <!-- Symbolic Math Mode -->
      <div v-if="currentMode === 'symbolic'" class="symbolic-panel">
        <div class="mode-description" v-voix="'SymbolicModeDescription'">
          Solve equations, simplify expressions, or perform symbolic manipulations.
        </div>
        <ExpressionBuilder 
          v-model:expression="currentExpression"
          @mode-change="handleModeChange"
          @execute-calculation="handleCalculation"
        />
      </div>
      
      <!-- Matrix Mode -->
      <div v-else-if="currentMode === 'matrix'" class="matrix-panel">
        <div class="mode-description" v-voix="'MatrixModeDescription'">
          Perform operations on matrices. Set dimensions and values below.
        </div>
        
        <div class="matrix-dimensions">
          <div class="dimension-control">
            <label v-voix="'MatrixRowsLabel'">Rows:</label>
            <button 
              @click="updateMatrixDimensions(matrixDimensions.rows - 1, matrixDimensions.cols)"
              :disabled="matrixDimensions.rows <= 1"
              v-voix="'DecreaseRowsButton'"
              hint="Decrease number of rows"
            >-</button>
            <span>{{ matrixDimensions.rows }}</span>
            <button 
              @click="updateMatrixDimensions(matrixDimensions.rows + 1, matrixDimensions.cols)"
              :disabled="matrixDimensions.rows >= 5"
              v-voix="'IncreaseRowsButton'"
              hint="Increase number of rows"
            >+</button>
          </div>
          
          <div class="dimension-control">
            <label v-voix="'MatrixColumnsLabel'">Columns:</label>
            <button 
              @click="updateMatrixDimensions(matrixDimensions.rows, matrixDimensions.cols - 1)"
              :disabled="matrixDimensions.cols <= 1"
              v-voix="'DecreaseColumnsButton'"
              hint="Decrease number of columns"
            >-</button>
            <span>{{ matrixDimensions.cols }}</span>
            <button 
              @click="updateMatrixDimensions(matrixDimensions.rows, matrixDimensions.cols + 1)"
              :disabled="matrixDimensions.cols >= 5"
              v-voix="'IncreaseColumnsButton'"
              hint="Increase number of columns"
            >+</button>
          </div>
        </div>
        
        <div class="matrix-grid">
          <div 
            class="matrix-row"
            v-for="(row, rowIndex) in matrixData"
            :key="rowIndex"
          >
            <input 
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              type="number"
              v-model="matrixData[rowIndex][colIndex]"
              v-voix="'MatrixCell' + rowIndex + '_' + colIndex"
              :hint="`Matrix element at row ${rowIndex + 1}, column ${colIndex + 1}`"
            />
          </div>
        </div>
        
        <div class="matrix-operations">
          <button 
            class="matrix-op-button" 
            v-voix="'MatrixDeterminantButton'"
            hint="Calculate the determinant of this matrix"
          >
            Determinant
          </button>
          <button 
            class="matrix-op-button" 
            v-voix="'MatrixInverseButton'"
            hint="Calculate the inverse of this matrix"
          >
            Inverse
          </button>
          <button 
            class="matrix-op-button" 
            v-voix="'MatrixTransposeButton'"
            hint="Calculate the transpose of this matrix"
          >
            Transpose
          </button>
        </div>
      </div>
      
      <!-- Calculus Mode -->
      <div v-else-if="currentMode === 'calculus'" class="calculus-panel">
        <div class="mode-description" v-voix="'CalculusModeDescription'">
          Calculate derivatives, integrals, limits, and more.
        </div>
        
        <div class="calculus-input">
          <div class="calculus-type-selector">
            <button 
              class="calculus-type-button active" 
              v-voix="'DerivativeButton'"
              hint="Calculate the derivative of a function"
            >
              Derivative
            </button>
            <button 
              class="calculus-type-button" 
              v-voix="'IntegralButton'"
              hint="Calculate the integral of a function"
            >
              Integral
            </button>
            <button 
              class="calculus-type-button" 
              v-voix="'LimitButton'"
              hint="Calculate the limit of a function"
            >
              Limit
            </button>
          </div>
          
          <ExpressionBuilder 
            v-model:expression="currentExpression"
            @mode-change="handleModeChange"
            @execute-calculation="handleCalculation"
          />
        </div>
      </div>
    </div>
    
    <CalculatorTools 
      @insert-symbol="handleInsertSymbol"
      @change-mode="handleModeChange"
    />
  </div>
</template>

<style scoped>
.advanced-view {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.mode-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.mode-selector button {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background-color: var(--color-background-soft);
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  font-weight: bold;
}

.mode-selector button:hover {
  background-color: var(--color-background-mute);
  transform: translateY(-2px);
}

.mode-selector button.active {
  background-color: var(--color-primary);
  color: white;
}

.mode-specific-panel {
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mode-description {
  margin-bottom: 1.5rem;
  font-style: italic;
  color: var(--color-text-light);
}

/* Matrix specific styles */
.matrix-dimensions {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.dimension-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dimension-control button {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 4px;
  background-color: var(--color-background-mute);
  cursor: pointer;
}

.dimension-control button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.matrix-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 500px;
  margin: 0 auto 1.5rem;
}

.matrix-row {
  display: flex;
  gap: 0.5rem;
}

.matrix-row input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  text-align: center;
  font-family: monospace;
}

.matrix-operations {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.matrix-op-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: var(--color-background-mute);
  cursor: pointer;
  transition: background-color 0.2s;
}

.matrix-op-button:hover {
  background-color: var(--color-primary);
  color: white;
}

/* Calculus specific styles */
.calculus-input {
  margin-bottom: 1.5rem;
}

.calculus-type-selector {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.calculus-type-button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.calculus-type-button.active {
  border-bottom-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: bold;
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