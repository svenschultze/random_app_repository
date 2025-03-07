<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  priceHistory: {
    type: Array,
    required: true
  },
  fuelType: {
    type: String,
    default: 'unleaded'
  }
});

// Chart dimensions and styling
const width = 800;
const height = 300;
const padding = { top: 20, right: 30, bottom: 40, left: 60 };

// Computed data points for the chart
const dataPoints = computed(() => {
  return props.priceHistory.map((entry, index) => {
    return {
      date: new Date(entry.date),
      price: entry[props.fuelType],
      index
    };
  });
});

// Calculate X and Y scales for the chart
const xScale = computed(() => {
  if (dataPoints.value.length === 0) return { min: 0, max: 1, step: 0.25 };
  
  const dates = dataPoints.value.map(point => point.date.getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const range = maxDate - minDate;
  
  // Calculate a nice step size (e.g., 2 weeks)
  const twoWeeks = 14 * 24 * 60 * 60 * 1000;
  const stepSize = Math.max(twoWeeks, range / 4);
  
  return {
    min: minDate,
    max: maxDate,
    step: stepSize
  };
});

const yScale = computed(() => {
  if (dataPoints.value.length === 0) return { min: 0, max: 2, step: 0.5 };
  
  const prices = dataPoints.value.map(point => point.price);
  let minPrice = Math.min(...prices);
  let maxPrice = Math.max(...prices);
  
  // Add a small buffer
  const buffer = (maxPrice - minPrice) * 0.1;
  minPrice = Math.max(0, minPrice - buffer);
  maxPrice = maxPrice + buffer;
  
  // Calculate a nice step size
  const stepSize = (maxPrice - minPrice) / 4;
  
  return {
    min: minPrice,
    max: maxPrice,
    step: stepSize
  };
});

// Format date for X-axis labels
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Format price for Y-axis labels
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

// Generate path for the line
const linePath = computed(() => {
  if (dataPoints.value.length === 0) return '';
  
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const xRange = xScale.value.max - xScale.value.min;
  const yRange = yScale.value.max - yScale.value.min;
  
  // Map data points to SVG coordinates
  const points = dataPoints.value.map(point => {
    const x = padding.left + ((point.date.getTime() - xScale.value.min) / xRange) * chartWidth;
    const y = height - padding.bottom - ((point.price - yScale.value.min) / yRange) * chartHeight;
    return `${x},${y}`;
  });
  
  return `M ${points.join(' L ')}`;
});

// Generate X-axis ticks
const xTicks = computed(() => {
  const ticks = [];
  const chartWidth = width - padding.left - padding.right;
  const range = xScale.value.max - xScale.value.min;
  
  for (let timestamp = xScale.value.min; timestamp <= xScale.value.max; timestamp += xScale.value.step) {
    const x = padding.left + ((timestamp - xScale.value.min) / range) * chartWidth;
    ticks.push({
      x,
      label: formatDate(timestamp)
    });
  }
  
  return ticks;
});

// Generate Y-axis ticks
const yTicks = computed(() => {
  const ticks = [];
  const chartHeight = height - padding.top - padding.bottom;
  const range = yScale.value.max - yScale.value.min;
  
  for (let price = yScale.value.min; price <= yScale.value.max; price += yScale.value.step) {
    const y = height - padding.bottom - ((price - yScale.value.min) / range) * chartHeight;
    ticks.push({
      y,
      label: formatPrice(price)
    });
  }
  
  return ticks;
});
</script>

<template>
  <div class="price-history-chart">
    <h3 class="chart-title">
      {{ fuelType.charAt(0).toUpperCase() + fuelType.slice(1) }} Price History
    </h3>
    
    <div class="chart-container">
      <svg :width="width" :height="height" viewBox="0 0 800 300" class="chart">
        <!-- X and Y axes -->
        <line 
          :x1="padding.left" 
          :y1="height - padding.bottom" 
          :x2="width - padding.right" 
          :y2="height - padding.bottom" 
          class="axis"
        />
        <line 
          :x1="padding.left" 
          :y1="padding.top" 
          :x2="padding.left" 
          :y2="height - padding.bottom" 
          class="axis"
        />
        
        <!-- X-axis ticks and labels -->
        <g v-for="tick in xTicks" :key="'x-' + tick.x">
          <line 
            :x1="tick.x" 
            :y1="height - padding.bottom" 
            :x2="tick.x" 
            :y2="height - padding.bottom + 5" 
            class="tick"
          />
          <text 
            :x="tick.x" 
            :y="height - padding.bottom + 20" 
            class="tick-label" 
            text-anchor="middle"
          >
            {{ tick.label }}
          </text>
        </g>
        
        <!-- Y-axis ticks and labels -->
        <g v-for="tick in yTicks" :key="'y-' + tick.y">
          <line 
            :x1="padding.left - 5" 
            :y1="tick.y" 
            :x2="padding.left" 
            :y2="tick.y" 
            class="tick"
          />
          <text 
            :x="padding.left - 10" 
            :y="tick.y + 4" 
            class="tick-label" 
            text-anchor="end"
          >
            {{ tick.label }}
          </text>
        </g>
        
        <!-- Grid lines (optional) -->
        <g v-for="tick in yTicks" :key="'grid-' + tick.y">
          <line 
            :x1="padding.left" 
            :y1="tick.y" 
            :x2="width - padding.right" 
            :y2="tick.y" 
            class="grid-line"
          />
        </g>
        
        <!-- Price line -->
        <path :d="linePath" class="price-line" fill="none" />
        
        <!-- Data points -->
        <g v-for="point in dataPoints" :key="'point-' + point.index">
          <circle 
            :cx="padding.left + ((point.date.getTime() - xScale.min) / (xScale.max - xScale.min)) * (width - padding.left - padding.right)" 
            :cy="height - padding.bottom - ((point.price - yScale.min) / (yScale.max - yScale.min)) * (height - padding.top - padding.bottom)" 
            r="4" 
            class="data-point"
          />
        </g>
      </svg>
      
      <div v-if="dataPoints.length === 0" class="no-data">
        No price history data available.
      </div>
    </div>
  </div>
</template>

<style scoped>
.price-history-chart {
  margin-bottom: 2rem;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.chart-container {
  overflow-x: auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.chart {
  max-width: 100%;
}

.axis {
  stroke: #9ca3af;
  stroke-width: 1;
}

.tick {
  stroke: #9ca3af;
  stroke-width: 1;
}

.tick-label {
  font-size: 12px;
  fill: #6b7280;
}

.grid-line {
  stroke: #e5e7eb;
  stroke-width: 1;
  stroke-dasharray: 2 2;
}

.price-line {
  stroke: #3b82f6;
  stroke-width: 2;
}

.data-point {
  fill: #3b82f6;
  stroke: #ffffff;
  stroke-width: 1;
}

.no-data {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-style: italic;
}

@media (max-width: 768px) {
  .chart {
    width: 800px;
  }
}
</style>