<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  expression: {
    type: String,
    default: 'x^2'
  },
  xRange: {
    type: Array,
    default: () => [-10, 10]
  },
  yRange: {
    type: Array,
    default: () => [-10, 10]
  }
})

const graphCanvas = ref(null)
const ctx = ref(null)
const canvasWidth = ref(800)
const canvasHeight = ref(500)
const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)

// Mock function to evaluate mathematical expressions
// In a real app, this would use a math expression evaluation library
const evaluateExpression = (expr, x) => {
  // For demo purposes, we'll handle common math functions
  try {
    // Create a safe expression with math functions
    let processedExpr = expr
      // Replace x with its value
      .replace(/x/g, `(${x})`)
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
    
    // Use Function constructor to evaluate - this is just for demo
    // In production, use a proper math library for safer evaluation
    const fn = new Function('Math', 'return ' + processedExpr)
    return fn(Math)
  } catch (e) {
    console.error('Error evaluating expression:', e)
    return 0
  }
}

// Render the graph
const renderGraph = () => {
  if (!ctx.value) return
  
  const canvas = graphCanvas.value
  const width = canvas.width
  const height = canvas.height
  
  // Clear canvas
  ctx.value.clearRect(0, 0, width, height)
  
  // Draw grid
  drawGrid()
  
  // Draw axes
  drawAxes()
  
  // Draw function
  drawFunction()
}

// Draw the coordinate grid
const drawGrid = () => {
  if (!ctx.value) return
  
  const context = ctx.value
  const width = canvasWidth.value
  const height = canvasHeight.value
  const gridSize = 20 * zoom.value
  
  context.strokeStyle = 'rgba(200, 200, 200, 0.3)'
  context.lineWidth = 1
  
  // Calculate grid offset for panning
  const offsetX = panX.value % gridSize
  const offsetY = panY.value % gridSize
  
  // Vertical lines
  for (let x = offsetX; x < width; x += gridSize) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, height)
    context.stroke()
  }
  
  // Horizontal lines
  for (let y = offsetY; y < height; y += gridSize) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }
}

// Draw the coordinate axes
const drawAxes = () => {
  if (!ctx.value) return
  
  const context = ctx.value
  const width = canvasWidth.value
  const height = canvasHeight.value
  
  // Calculate axes positions (centered + pan)
  const xAxis = height / 2 + panY.value
  const yAxis = width / 2 + panX.value
  
  context.strokeStyle = 'rgba(0, 0, 0, 0.5)'
  context.lineWidth = 2
  
  // X-axis
  context.beginPath()
  context.moveTo(0, xAxis)
  context.lineTo(width, xAxis)
  context.stroke()
  
  // Y-axis
  context.beginPath()
  context.moveTo(yAxis, 0)
  context.lineTo(yAxis, height)
  context.stroke()
  
  // Draw axis labels and ticks
  context.fillStyle = 'rgba(0, 0, 0, 0.7)'
  context.font = '12px Arial'
  
  // X-axis ticks and labels
  const xStep = gridToPixel(1, 0)[0] - gridToPixel(0, 0)[0]
  for (let i = Math.ceil(pixelToGrid(0, 0)[0]); i <= Math.floor(pixelToGrid(width, 0)[0]); i++) {
    if (i === 0) continue // Skip origin
    
    const [x, y] = gridToPixel(i, 0)
    
    // Tick
    context.beginPath()
    context.moveTo(x, xAxis - 5)
    context.lineTo(x, xAxis + 5)
    context.stroke()
    
    // Label
    context.fillText(i.toString(), x - 5, xAxis + 20)
  }
  
  // Y-axis ticks and labels
  const yStep = gridToPixel(0, 1)[1] - gridToPixel(0, 0)[1]
  for (let i = Math.ceil(pixelToGrid(0, height)[1]); i <= Math.floor(pixelToGrid(0, 0)[1]); i++) {
    if (i === 0) continue // Skip origin
    
    const [x, y] = gridToPixel(0, i)
    
    // Tick
    context.beginPath()
    context.moveTo(yAxis - 5, y)
    context.lineTo(yAxis + 5, y)
    context.stroke()
    
    // Label
    context.fillText(i.toString(), yAxis + 10, y + 5)
  }
  
  // Origin label
  context.fillText('0', yAxis + 5, xAxis + 15)
}

// Draw the function curve
const drawFunction = () => {
  if (!props.expression || !ctx.value) return
  
  const context = ctx.value
  const width = canvasWidth.value
  const height = canvasHeight.value
  
  context.strokeStyle = 'rgba(255, 0, 0, 0.8)'
  context.lineWidth = 2
  
  context.beginPath()
  
  let started = false
  
  for (let pixelX = 0; pixelX < width; pixelX += 2) {
    const [x, ignored1] = pixelToGrid(pixelX, 0)
    let y
    
    try {
      y = evaluateExpression(props.expression, x)
    } catch (e) {
      continue
    }
    
    if (isNaN(y) || !isFinite(y)) continue
    
    const [ignored2, pixelY] = gridToPixel(0, y)
    
    if (pixelY < -1000 || pixelY > height + 1000) continue
    
    if (!started) {
      context.moveTo(pixelX, pixelY)
      started = true
    } else {
      context.lineTo(pixelX, pixelY)
    }
  }
  
  context.stroke()
}

// Convert grid coordinates to pixel coordinates
const gridToPixel = (gridX, gridY) => {
  const pixelX = canvasWidth.value / 2 + (gridX * zoom.value * 20) + panX.value
  const pixelY = canvasHeight.value / 2 - (gridY * zoom.value * 20) + panY.value
  return [pixelX, pixelY]
}

// Convert pixel coordinates to grid coordinates
const pixelToGrid = (pixelX, pixelY) => {
  const gridX = ((pixelX - canvasWidth.value / 2) - panX.value) / (zoom.value * 20)
  const gridY = -((pixelY - canvasHeight.value / 2) - panY.value) / (zoom.value * 20)
  return [gridX, gridY]
}

// Handle canvas interaction
const handleZoom = (e) => {
  e.preventDefault()
  
  // Determine zoom direction
  const direction = e.deltaY > 0 ? -1 : 1
  const factor = 1.1
  
  // Calculate new zoom level
  const newZoom = direction > 0 ? zoom.value * factor : zoom.value / factor
  
  // Apply zoom limits
  zoom.value = Math.max(0.1, Math.min(10, newZoom))
  
  renderGraph()
}

// Initialize canvas and start rendering
onMounted(() => {
  const canvas = graphCanvas.value
  if (canvas) {
    // Set canvas dimensions
    canvas.width = canvasWidth.value
    canvas.height = canvasHeight.value
    
    // Get rendering context
    ctx.value = canvas.getContext('2d')
    
    // Initial render
    renderGraph()
    
    // Add event listener for zooming
    canvas.addEventListener('wheel', handleZoom)
  }
})

// Watch for changes to redraw
watch(
  () => props.expression,
  () => renderGraph()
)

watch(zoom, () => renderGraph())
watch(panX, () => renderGraph())
watch(panY, () => renderGraph())
</script>

<template>
  <div class="graph-visualizer">
    <div class="graph-controls">
      <div class="current-function" v-voix="'CurrentFunction'">
        f(x) = {{ expression }}
      </div>
      <div class="zoom-controls">
        <button 
          @click="zoom *= 1.2" 
          class="zoom-button" 
          v-voix="'ZoomInButton'"
          hint="Zoom in on the graph"
        >
          +
        </button>
        <button 
          @click="zoom /= 1.2" 
          class="zoom-button" 
          v-voix="'ZoomOutButton'"
          hint="Zoom out on the graph"
        >
          -
        </button>
        <button 
          @click="zoom = 1; panX = 0; panY = 0" 
          class="reset-button" 
          v-voix="'ResetViewButton'"
          hint="Reset the graph view"
        >
          Reset View
        </button>
      </div>
    </div>
    
    <div class="canvas-container">
      <canvas 
        ref="graphCanvas" 
        class="graph-canvas"
        v-voix="'GraphCanvas'"
        hint="Interactive graph visualization area"
        @mousedown="isDragging = true"
        @mouseup="isDragging = false"
        @mouseleave="isDragging = false"
        @mousemove="(e) => { 
          if (isDragging) { 
            panX += e.movementX; 
            panY += e.movementY; 
          } 
        }"
      ></canvas>
    </div>
  </div>
</template>

<style scoped>
.graph-visualizer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.graph-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-bottom: 1rem;
}

.current-function {
  font-family: monospace;
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-background-soft);
  border-radius: 4px;
}

.zoom-controls {
  display: flex;
  gap: 0.5rem;
}

.zoom-button, .reset-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: var(--color-background-mute);
  cursor: pointer;
  transition: background-color 0.2s;
}

.zoom-button {
  font-size: 1.2rem;
  font-weight: bold;
  width: 40px;
}

.reset-button {
  font-size: 0.9rem;
}

.zoom-button:hover, .reset-button:hover {
  background-color: var(--color-primary);
  color: white;
}

.canvas-container {
  width: 100%;
  max-width: 800px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.graph-canvas {
  width: 100%;
  height: 500px;
  cursor: grab;
}

.graph-canvas:active {
  cursor: grabbing;
}
</style>