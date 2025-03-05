<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAnalyticsStore } from '../stores/analytics'
import { useCalendarStore } from '../stores/calendar'
import { useTasksStore } from '../stores/tasks'

// Import Chart.js components
import { Bar, Pie, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement } from 'chart.js'

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement)

const analyticsStore = useAnalyticsStore()
const calendarStore = useCalendarStore()
const tasksStore = useTasksStore()

// Date range state
const dateRange = ref(analyticsStore.dateRange)

// Chart data
const chartData = ref({
  meetingsPerDay: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Number of Meetings',
        backgroundColor: '#4F46E5',
        data: analyticsStore.getMeetingsPerDay
      }
    ]
  },
  
  meetingDurations: {
    labels: analyticsStore.getMeetingDurations.labels,
    datasets: [
      {
        backgroundColor: ['#4F46E5', '#EC4899', '#10B981', '#F59E0B'],
        data: analyticsStore.getMeetingDurations.data
      }
    ]
  },
  
  timeAllocation: {
    labels: analyticsStore.getTimeAllocation.labels,
    datasets: [
      {
        backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#3B82F6'],
        data: analyticsStore.getTimeAllocation.data
      }
    ]
  },
  
  meetingsByDepartment: {
    labels: analyticsStore.getMeetingsByDepartment.labels,
    datasets: [
      {
        label: 'Meetings by Department',
        backgroundColor: '#4F46E5',
        data: analyticsStore.getMeetingsByDepartment.data
      }
    ]
  },
  
  meetingsByDay: {
    labels: analyticsStore.getMeetingsByDay.labels,
    datasets: [
      {
        label: 'Meetings by Day of Week',
        backgroundColor: '#4F46E5',
        data: analyticsStore.getMeetingsByDay.data
      }
    ]
  },
  
  monthlyMeetingTrend: {
    labels: analyticsStore.getMonthlyMeetingTrend.labels,
    datasets: [
      {
        label: 'Monthly Meeting Trend',
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        data: analyticsStore.getMonthlyMeetingTrend.data,
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// Chart options
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        boxWidth: 10
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1
    }
  }
}

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

// For demo purposes - get personalized insights
const personalizedInsights = analyticsStore.getPersonalizedInsights()

// Helper for displaying key metrics
const formatPercentage = (value) => {
  return `${value}%`
}

// Check user permissions
const canViewAnalytics = computed(() => {
  return calendarStore.currentRole === 'admin' || calendarStore.currentRole === 'manager'
})

// Set date range and refresh analytics
const setDateRange = (range) => {
  dateRange.value = range
  analyticsStore.setDateRange(range)
  
  // Update chart data after refresh
  updateChartData()
}

// Update chart data from the store
const updateChartData = () => {
  chartData.value = {
    meetingsPerDay: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Number of Meetings',
          backgroundColor: '#4F46E5',
          data: analyticsStore.getMeetingsPerDay
        }
      ]
    },
    
    meetingDurations: {
      labels: analyticsStore.getMeetingDurations.labels,
      datasets: [
        {
          backgroundColor: ['#4F46E5', '#EC4899', '#10B981', '#F59E0B'],
          data: analyticsStore.getMeetingDurations.data
        }
      ]
    },
    
    timeAllocation: {
      labels: analyticsStore.getTimeAllocation.labels,
      datasets: [
        {
          backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#3B82F6'],
          data: analyticsStore.getTimeAllocation.data
        }
      ]
    },
    
    meetingsByDepartment: {
      labels: analyticsStore.getMeetingsByDepartment.labels,
      datasets: [
        {
          label: 'Meetings by Department',
          backgroundColor: '#4F46E5',
          data: analyticsStore.getMeetingsByDepartment.data
        }
      ]
    },
    
    meetingsByDay: {
      labels: analyticsStore.getMeetingsByDay.labels,
      datasets: [
        {
          label: 'Meetings by Day of Week',
          backgroundColor: '#4F46E5',
          data: analyticsStore.getMeetingsByDay.data
        }
      ]
    },
    
    monthlyMeetingTrend: {
      labels: analyticsStore.getMonthlyMeetingTrend.labels,
      datasets: [
        {
          label: 'Monthly Meeting Trend',
          borderColor: '#4F46E5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          data: analyticsStore.getMonthlyMeetingTrend.data,
          fill: true,
          tension: 0.4
        }
      ]
    }
  }
}

// Refresh data on mount
onMounted(() => {
  analyticsStore.refreshAnalytics()
})
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-center">
      <h1 
        v-voix="'analytics-heading'" 
        class="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0"
      >
        Analytics Dashboard
      </h1>
      
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">Time Period:</span>
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button 
            v-voix="'day-range'" 
            hint="View daily analytics"
            class="px-3 py-1 text-sm font-medium rounded-l-md border"
            :class="dateRange === 'day' ? 
              'bg-indigo-600 text-white border-indigo-700' : 
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="setDateRange('day')"
          >
            Day
          </button>
          <button 
            v-voix="'week-range'" 
            hint="View weekly analytics"
            class="px-3 py-1 text-sm font-medium border-t border-b"
            :class="dateRange === 'week' ? 
              'bg-indigo-600 text-white border-indigo-700' : 
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="setDateRange('week')"
          >
            Week
          </button>
          <button 
            v-voix="'month-range'" 
            hint="View monthly analytics"
            class="px-3 py-1 text-sm font-medium border-t border-b"
            :class="dateRange === 'month' ? 
              'bg-indigo-600 text-white border-indigo-700' : 
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="setDateRange('month')"
          >
            Month
          </button>
          <button 
            v-voix="'year-range'" 
            hint="View yearly analytics"
            class="px-3 py-1 text-sm font-medium rounded-r-md border"
            :class="dateRange === 'year' ? 
              'bg-indigo-600 text-white border-indigo-700' : 
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="setDateRange('year')"
          >
            Year
          </button>
        </div>
        
        <button 
          v-voix="'refresh-analytics'" 
          hint="Refresh analytics data"
          class="ml-2 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          @click="analyticsStore.refreshAnalytics"
          :disabled="analyticsStore.isLoading"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5" 
            :class="{ 'animate-spin': analyticsStore.isLoading }"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Access restrictions message for non-managers/admins -->
    <div 
      v-if="!canViewAnalytics"
      class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 mb-8"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-lg font-medium text-yellow-800 dark:text-yellow-300">Limited Access</h3>
          <div class="mt-2 text-yellow-700 dark:text-yellow-200">
            <p>
              Analytics dashboard access is restricted to users with Manager or Admin roles. 
              You currently have {{ calendarStore.currentRole }} permissions.
            </p>
            <p class="mt-2">
              For demonstration purposes, all charts are shown, but in a real application, 
              this data would be restricted based on your role.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Key Metrics -->
    <div class="mb-8">
      <h2 
        v-voix="'key-metrics-heading'" 
        class="text-xl font-medium text-gray-900 dark:text-white mb-4"
      >
        Key Metrics <span class="text-sm font-normal text-gray-500 dark:text-gray-400">({{ dateRange }})</span>
      </h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Meetings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Meetings</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {{ analyticsStore.getKeyMetrics.totalMeetingsThisMonth }}
              </p>
            </div>
            <div class="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Total Meeting Hours -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Meeting Hours</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {{ analyticsStore.getKeyMetrics.totalMeetingHours }}
              </p>
            </div>
            <div class="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Average Meeting Length -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Meeting Length</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {{ analyticsStore.getKeyMetrics.averageMeetingLength }} min
              </p>
            </div>
            <div class="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Focus Time Percentage -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Focus Time</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {{ formatPercentage(analyticsStore.getKeyMetrics.focusTimePercentage) }}
              </p>
            </div>
            <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Charts Grid -->
    <div class="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Meetings Per Day -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Meetings Per Day</h3>
        <div class="h-64">
          <Bar :data="chartData.meetingsPerDay" :options="barOptions" />
        </div>
      </div>
      
      <!-- Meeting Durations -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Meeting Durations</h3>
        <div class="h-64">
          <Pie :data="chartData.meetingDurations" :options="pieOptions" />
        </div>
      </div>
      
      <!-- Time Allocation -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Time Allocation</h3>
        <div class="h-64">
          <Pie :data="chartData.timeAllocation" :options="pieOptions" />
        </div>
      </div>
      
      <!-- Monthly Meeting Trend -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Meeting Trend</h3>
        <div class="h-64">
          <Line :data="chartData.monthlyMeetingTrend" :options="lineOptions" />
        </div>
      </div>
    </div>
    
    <!-- AI Insights -->
    <div class="mb-8">
      <h2 
        v-voix="'insights-heading'" 
        class="text-xl font-medium text-gray-900 dark:text-white mb-4"
      >
        Personalized Insights
      </h2>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-start">
          <div class="flex-shrink-0 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              AI-Generated Meeting Insights
            </h3>
            <ul class="space-y-3">
              <li 
                v-for="(insight, index) in personalizedInsights" 
                :key="index"
                class="flex items-start"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-700 dark:text-gray-300">{{ insight }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Additional Metrics -->
    <div class="mb-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Attendance Rate -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-base font-medium text-gray-900 dark:text-white mb-2">Meeting Attendance Rate</h3>
        <div class="flex items-baseline">
          <p class="text-3xl font-semibold text-gray-900 dark:text-white">
            {{ analyticsStore.getAttendanceRate }}%
          </p>
          <span class="ml-2 text-sm text-green-600 dark:text-green-400">
            +2% from last period
          </span>
        </div>
        <div class="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            class="bg-green-600 h-2.5 rounded-full" 
            :style="{ width: `${analyticsStore.getAttendanceRate}%` }"
          ></div>
        </div>
      </div>
      
      <!-- Task Completion Rate -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-base font-medium text-gray-900 dark:text-white mb-2">Task Completion Rate</h3>
        <div class="flex items-baseline">
          <p class="text-3xl font-semibold text-gray-900 dark:text-white">
            {{ analyticsStore.getTaskCompletionRate }}%
          </p>
          <span class="ml-2 text-sm text-yellow-600 dark:text-yellow-400">
            -3% from last period
          </span>
        </div>
        <div class="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            class="bg-yellow-500 h-2.5 rounded-full" 
            :style="{ width: `${analyticsStore.getTaskCompletionRate}%` }"
          ></div>
        </div>
      </div>
      
      <!-- Average Meeting Rating -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-base font-medium text-gray-900 dark:text-white mb-2">Meeting Effectiveness</h3>
        <div class="flex items-baseline">
          <p class="text-3xl font-semibold text-gray-900 dark:text-white">
            {{ analyticsStore.getAvgMeetingRating.toFixed(1) }}/5
          </p>
          <span class="ml-2 text-sm text-green-600 dark:text-green-400">
            +0.3 from last period
          </span>
        </div>
        <div class="mt-3 flex">
          <div v-for="i in 5" :key="i" class="mr-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5" 
              :class="i <= Math.round(analyticsStore.getAvgMeetingRating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Productivity Score -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-base font-medium text-gray-900 dark:text-white mb-2">Productivity Score</h3>
        <div class="flex items-baseline">
          <p class="text-3xl font-semibold text-gray-900 dark:text-white">
            {{ analyticsStore.getProductivityScore }}/100
          </p>
          <span class="ml-2 text-sm text-green-600 dark:text-green-400">
            +5 from last period
          </span>
        </div>
        <div class="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            class="bg-indigo-600 h-2.5 rounded-full" 
            :style="{ width: `${analyticsStore.getProductivityScore}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- Demo Notice -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-lg font-medium text-blue-800 dark:text-blue-300">Demo Notice</h3>
          <div class="mt-2 text-blue-700 dark:text-blue-200">
            <p>
              This Analytics Dashboard shows simulated data for demonstration purposes. In a production environment, 
              this would display real-time analytics based on your actual calendar usage, task completion rates, 
              and meeting patterns.
            </p>
            <p class="mt-2">
              Try changing the time period using the buttons above to see how the data updates dynamically.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>