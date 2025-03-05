<script setup>
import { useFoodLogStore } from '@/stores/foodLogStore';
import { computed, onMounted, ref, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  chartType: {
    type: String,
    default: 'macros', // 'macros' or 'goals'
    required: false,
  }
});

const chartContainer = ref(null);
const chart = ref(null);
const foodLogStore = useFoodLogStore();

const macroPercentages = computed(() => foodLogStore.macroPercentages);
const goalPercentages = computed(() => foodLogStore.goalPercentages);
const totalNutrition = computed(() => foodLogStore.totalNutrition);
const goals = computed(() => foodLogStore.goals);

// Create and update chart when data changes
watch(
  [macroPercentages, goalPercentages, totalNutrition], 
  () => {
    if (chart.value) {
      updateChart();
    }
  },
  { deep: true }
);

onMounted(() => {
  createChart();
});

function createChart() {
  if (chartContainer.value) {
    const ctx = chartContainer.value.getContext('2d');
    
    if (props.chartType === 'macros') {
      chart.value = new Chart(ctx, {
        type: 'doughnut',
        data: getMacroChartData(),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.label}: ${context.raw}%`;
                }
              }
            }
          }
        }
      });
    } else if (props.chartType === 'goals') {
      chart.value = new Chart(ctx, {
        type: 'bar',
        data: getGoalsChartData(),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const nutrient = context.label.toLowerCase();
                  return `${context.raw}% of goal (${totalNutrition.value[nutrient]} / ${goals.value[nutrient]})`;
                }
              }
            }
          },
          scales: {
            x: {
              max: 100,
              min: 0,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
    }
  }
}

function updateChart() {
  if (!chart.value) return;
  
  if (props.chartType === 'macros') {
    chart.value.data = getMacroChartData();
  } else if (props.chartType === 'goals') {
    chart.value.data = getGoalsChartData();
  }
  
  chart.value.update();
}

function getMacroChartData() {
  return {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [
        macroPercentages.value.protein,
        macroPercentages.value.carbs,
        macroPercentages.value.fat
      ],
      backgroundColor: [
        '#e74c3c', // red
        '#f39c12', // orange
        '#3498db'  // blue
      ],
      borderWidth: 0,
      hoverOffset: 10
    }]
  };
}

function getGoalsChartData() {
  return {
    labels: ['Calories', 'Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [
        goalPercentages.value.calories,
        goalPercentages.value.protein,
        goalPercentages.value.carbs,
        goalPercentages.value.fat
      ],
      backgroundColor: [
        '#3498db', // blue
        '#e74c3c', // red
        '#f39c12', // orange
        '#2ecc71'  // green
      ],
      borderRadius: 5,
      borderWidth: 0
    }]
  };
}
</script>

<template>
  <div class="chart-container" :aria-label="props.chartType + ' chart'" v-voix="props.chartType + ' chart'">
    <canvas ref="chartContainer" height="250"></canvas>
    
    <div class="chart-summary mt-3" v-if="props.chartType === 'macros'">
      <div class="d-flex justify-content-around">
        <div class="text-center">
          <div 
            class="fw-bold" 
            style="color: #e74c3c;"
            v-voix="'Protein: ' + macroPercentages.protein + ' percent'"
          >
            {{ macroPercentages.protein }}%
          </div>
          <div class="small">Protein</div>
        </div>
        <div class="text-center">
          <div 
            class="fw-bold" 
            style="color: #f39c12;"
            v-voix="'Carbs: ' + macroPercentages.carbs + ' percent'"
          >
            {{ macroPercentages.carbs }}%
          </div>
          <div class="small">Carbs</div>
        </div>
        <div class="text-center">
          <div 
            class="fw-bold" 
            style="color: #3498db;"
            v-voix="'Fat: ' + macroPercentages.fat + ' percent'"
          >
            {{ macroPercentages.fat }}%
          </div>
          <div class="small">Fat</div>
        </div>
      </div>
    </div>
    
    <div class="chart-summary mt-3" v-if="props.chartType === 'goals'">
      <div 
        class="text-center mb-2" 
        v-voix="'Calories: ' + totalNutrition.calories + ' out of ' + goals.calories + ', ' + goalPercentages.calories + ' percent complete'"
      >
        <span class="fw-bold">Calories:</span> {{ totalNutrition.calories }} / {{ goals.calories }} 
        ({{ goalPercentages.calories }}%)
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  margin: auto;
  height: 300px;
}

.chart-summary {
  font-size: 0.9rem;
}
</style>