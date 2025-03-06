<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  initialExpression: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['update:expression', 'mode-change', 'execute-calculation'])

// State
const expression = ref(props.initialExpression)
const expressionType = ref('standard') // standard, symbolic, matrix, calculus
const suggestions = ref([])
const showSuggestions = ref(false)
const result = ref('')
const previewResult = ref('')

// Detect expression type based on input
const detectExpressionType = (expr) => {
  if (expr.includes('x') || expr.includes('y') || expr.includes('=')) {
    return 'symbolic'
  } else if (expr.includes('[') || expr.includes(']') || expr.includes('matrix')) {
    return 'matrix'
  } else if (expr.includes('∫') || expr.includes('d/dx') || expr.includes('lim')) {
    return 'calculus'
  }
  return 'standard'
}

// Watch for expression changes
watch(expression, (newExpr) => {
  emit('update:expression', newExpr)
  
  const newType = detectExpressionType(newExpr)
  if (newType !== expressionType.value) {
    expressionType.value = newType
    emit('mode-change', newType)
  }
  
  // Generate suggestions based on current expression
  updateSuggestions(newExpr)
  
  // Try to compute a live preview if possible
  updatePreview(newExpr)
})

// Update suggestions based on current expression
const updateSuggestions = (expr) => {
  // Reset suggestions
  suggestions.value = []
  
  // Simple rule-based suggestions
  if (expr.includes('=')) {
    suggestions.value.push('Solve for x')
    suggestions.value.push('Graph this equation')
  } else if (expr.includes('x')) {
    suggestions.value.push('Simplify expression')
    suggestions.value.push('Graph this function')
  } else if (expr.length > 0 && !isNaN(expr)) {
    suggestions.value.push('Convert units')
    suggestions.value.push('Scientific notation')
  }
  
  showSuggestions.value = suggestions.value.length > 0
}

// Helper function to process expressions
const processExpression = (expr) => {
  return expr
    // Replace common functions with Math equivalents
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/abs\(/g, 'Math.abs(')
    .replace(/log\(/g, 'Math.log10(')
    .replace(/ln\(/g, 'Math.log(')
    // Replace constants
    .replace(/pi/g, 'Math.PI')
    .replace(/e\^/g, 'Math.exp(')
    .replace(/e(?![a-zA-Z])/g, 'Math.E');
}

// Helper function to format calculation results
const formatResult = (result) => {
  if (Number.isInteger(result)) {
    return result.toString();
  } else {
    // Avoid scientific notation for regular numbers
    const formatted = parseFloat(result.toFixed(8));
    return formatted.toString();
  }
}

// Update live preview
const updatePreview = (expr) => {
  if (expr.length === 0) {
    previewResult.value = ''
    return
  }
  
  try {
    // Standard mode calculations
    if (expressionType.value === 'standard') {
      try {
        const processedExpr = processExpression(expr);
        const safeEval = new Function('Math', 'return ' + processedExpr);
        const result = safeEval(Math);
        previewResult.value = formatResult(result);
      } catch (e) {
        // Only show empty preview if there's an error
        previewResult.value = '';
      }
    } 
    // Symbolic mode calculations
    else if (expressionType.value === 'symbolic') {
      if (expr.includes('=')) {
        // Equation solving preview
        const sides = expr.split('=');
        if (sides.length === 2) {
          try {
            // Check if it's a simple equation like x=5
            const leftSide = sides[0].trim();
            const rightSide = sides[1].trim();
            
            if (leftSide === 'x' && !rightSide.includes('x')) {
              // Simple assignment x = value
              previewResult.value = `x = ${rightSide}`;
            } else if (rightSide === 'x' && !leftSide.includes('x')) {
              // Simple assignment value = x
              previewResult.value = `x = ${leftSide}`;
            } else {
              // More complex equation
              previewResult.value = 'Solving equation...';
            }
          } catch (e) {
            previewResult.value = '';
          }
        }
      } else if (expr.includes('x')) {
        // Expression with x variable
        try {
          // Try with a sample value
          const sampleX = 2;
          const withSampleValue = expr.replace(/x/g, sampleX);
          const processedExpr = processExpression(withSampleValue);
          const safeEval = new Function('Math', 'return ' + processedExpr);
          const result = safeEval(Math);
          
          previewResult.value = `When x=${sampleX}, result = ${formatResult(result)}`;
        } catch (e) {
          previewResult.value = '';
        }
      } else {
        // Standard expression in symbolic mode
        try {
          const processedExpr = processExpression(expr);
          const safeEval = new Function('Math', 'return ' + processedExpr);
          const result = safeEval(Math);
          previewResult.value = formatResult(result);
        } catch (e) {
          previewResult.value = '';
        }
      }
    } 
    // Matrix mode preview
    else if (expressionType.value === 'matrix') {
      if (expr.toLowerCase().includes('det') || 
          expr.toLowerCase().includes('determinant')) {
        previewResult.value = 'Calculating determinant...';
      } else if (expr.toLowerCase().includes('inverse')) {
        previewResult.value = 'Calculating inverse...';
      } else if (expr.toLowerCase().includes('transp')) {
        previewResult.value = 'Calculating transpose...';
      } else {
        previewResult.value = 'Matrix operation...';
      }
    } 
    // Calculus mode preview
    else if (expressionType.value === 'calculus') {
      if (expr.toLowerCase().includes('d/dx')) {
        previewResult.value = 'Calculating derivative...';
      } else if (expr.includes('∫')) {
        previewResult.value = 'Calculating integral...';
      } else if (expr.toLowerCase().includes('lim')) {
        previewResult.value = 'Calculating limit...';
      } else {
        try {
          const processedExpr = processExpression(expr);
          const safeEval = new Function('Math', 'return ' + processedExpr);
          const result = safeEval(Math);
          previewResult.value = formatResult(result);
        } catch (e) {
          previewResult.value = '';
        }
      }
    }
  } catch (e) {
    previewResult.value = '';
  }
}

// Calculate result
const calculateResult = () => {
  if (!expression.value) return;
  
  // This would call the appropriate calculation engine based on expression type
  try {
    // Process the expression
    let processedExpr = expression.value
      // Replace common functions with Math equivalents
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      // Replace constants
      .replace(/pi/g, 'Math.PI')
      .replace(/e(?![a-zA-Z])/g, 'Math.E');
    
    if (expressionType.value === 'standard' && !expression.value.includes('x')) {
      try {
        const safeEval = new Function('Math', 'return ' + processedExpr)
        const calculatedResult = safeEval(Math)
        
        // Format the result
        result.value = Number.isInteger(calculatedResult) 
          ? calculatedResult.toString() 
          : parseFloat(calculatedResult.toFixed(8)).toString()
      } catch (e) {
        result.value = 'Error: Invalid expression'
      }
    } else {
      // For symbolic, matrix, calculus - in a real app, this would use specialized libraries
      result.value = 'Calculation requires mathematical library'
    }
    
    emit('execute-calculation', {
      expression: expression.value,
      result: result.value,
      type: expressionType.value
    })
  } catch (e) {
    result.value = 'Error: ' + e.message
  }
}

// Apply a suggestion
const applySuggestion = (suggestion) => {
  if (suggestion === 'Graph this function' || suggestion === 'Graph this equation') {
    emit('mode-change', 'graph')
  } else if (suggestion === 'Solve for x') {
    // Would integrate with a symbolic math library
    result.value = 'Solving for x...'
  } else if (suggestion === 'Simplify expression') {
    // Would integrate with a symbolic math library
    result.value = 'Simplifying...'
  }
  showSuggestions.value = false
}

// Clear the expression
const clearExpression = () => {
  expression.value = ''
  result.value = ''
  previewResult.value = ''
  showSuggestions.value = false
}
</script>

<template>
  <div class="expression-builder">
    <div class="input-canvas">
      <div class="expression-input">
        <input 
          type="text" 
          v-model="expression" 
          v-voix="'CalculatorInput'"
          hint="Type your calculation or equation here" 
          placeholder="What do you want to calculate?"
          @keyup.enter="calculateResult"
        />
        <button 
          v-if="expression.length > 0" 
          @click="clearExpression" 
          class="clear-button" 
          v-voix="'ClearButton'"
          hint="Clear the current expression"
          aria-label="Clear expression"
        >
          ×
        </button>
        <button 
          @click="calculateResult" 
          class="calculate-button" 
          v-voix="'CalculateButton'"
          hint="Perform the calculation"
          :disabled="expression.length === 0"
        >
          =
        </button>
      </div>
      
      <div v-if="previewResult && previewResult !== ''" class="preview-result">
        Preview: {{ previewResult }}
      </div>
      
      <div v-if="showSuggestions" class="suggestions">
        <div class="suggestions-title">Suggestions:</div>
        <div 
          v-for="(suggestion, index) in suggestions" 
          :key="index" 
          class="suggestion-item"
          v-voix="'Suggestion' + index"
          @click="applySuggestion(suggestion)"
        >
          {{ suggestion }}
        </div>
      </div>
    </div>
    
    <div v-if="result" class="result-display" v-voix="'CalculationResult'">
      <div class="result-label">Result:</div>
      <div class="result-value">{{ result }}</div>
    </div>
  </div>
</template>

<style scoped>
.expression-builder {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.input-canvas {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.expression-input {
  display: flex;
  align-items: center;
  background: var(--color-background);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.expression-input input {
  flex: 1;
  padding: 1rem;
  font-size: 1.2rem;
  border: none;
  background: transparent;
  color: var(--color-text);
  outline: none;
}

.clear-button, .calculate-button {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-button {
  color: var(--color-text-light);
}

.calculate-button {
  background-color: var(--color-primary);
  color: white;
  padding: 1rem;
}

.calculate-button:disabled {
  background-color: var(--color-border);
  cursor: not-allowed;
}

.preview-result {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: var(--color-text-light);
  font-style: italic;
}

.suggestions {
  margin-top: 1rem;
  border-top: 1px solid var(--color-border);
  padding-top: 0.75rem;
}

.suggestions-title {
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--color-text-light);
}

.suggestion-item {
  display: inline-block;
  margin-right: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-background-mute);
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-item:hover {
  background-color: var(--color-primary);
  color: white;
}

.result-display {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.result-label {
  font-size: 0.9rem;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
}

.result-value {
  font-size: 2rem;
  font-weight: bold;
}
</style>