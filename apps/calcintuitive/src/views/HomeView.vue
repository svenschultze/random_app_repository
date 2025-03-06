<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ExpressionBuilder from '../components/ExpressionBuilder.vue'
import CalculatorTools from '../components/CalculatorTools.vue'

const router = useRouter()
const currentExpression = ref('')

// Handle mode change
const handleModeChange = (mode) => {
  if (mode === 'graph') {
    router.push({ 
      path: '/graph',
      query: { expr: currentExpression.value }
    })
  } else if (mode === 'matrix' || mode === 'symbolic' || mode === 'calculus') {
    router.push({ 
      path: '/advanced',
      query: { mode, expr: currentExpression.value }
    })
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
  console.log('Calculation result:', result)
}
</script>

<template>
  <div class="calculator-view">
    <h1 class="screen-reader-only">CalcIntuitive Standard Calculator</h1>
    
    <div class="welcome-prompt" v-if="!currentExpression">
      <h2 v-voix="'WelcomePromptTitle'">Welcome to CalcIntuitive</h2>
      <p>
        Begin typing your calculation, or tap a function below to get started.
      </p>
    </div>
    
    <ExpressionBuilder 
      v-model:expression="currentExpression"
      @mode-change="handleModeChange"
      @execute-calculation="handleCalculation"
    />
    
    <CalculatorTools 
      @insert-symbol="handleInsertSymbol"
      @change-mode="handleModeChange"
    />
  </div>
</template>

<style scoped>
.calculator-view {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.welcome-prompt {
  text-align: center;
  margin: 2rem 0;
  padding: 2rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.welcome-prompt h2 {
  margin-top: 0;
  color: var(--color-heading);
}

.welcome-prompt p {
  margin-bottom: 0;
  color: var(--color-text);
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
