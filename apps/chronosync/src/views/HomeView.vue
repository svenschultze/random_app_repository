<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCalendarStore } from '../stores/calendar'
import { useTasksStore } from '../stores/tasks'
import { useNotificationsStore } from '../stores/notifications'

const router = useRouter()
const calendarStore = useCalendarStore()
const tasksStore = useTasksStore()
const notificationsStore = useNotificationsStore()

const upcomingEvents = ref([])
const todaysTasks = ref([])
const isLoading = ref(true)

onMounted(() => {
  // Simulate loading data
  setTimeout(() => {
    loadDashboardData()
    isLoading.value = false
  }, 600)
})

const loadDashboardData = () => {
  // Get upcoming events for the next 7 days
  const now = new Date()
  const nextWeek = new Date()
  nextWeek.setDate(now.getDate() + 7)
  
  upcomingEvents.value = calendarStore.getEvents
    .filter(event => {
      const eventStart = new Date(event.start)
      return eventStart >= now && eventStart <= nextWeek
    })
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5)
  
  // Get today's tasks
  todaysTasks.value = tasksStore.getTodaysTasks
}

const formatEventTime = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatEventDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

const navigateToCalendar = () => {
  router.push('/calendar')
}

const navigateToTasks = () => {
  router.push('/tasks')
}

const generateDemoNotification = () => {
  notificationsStore.simulateNewNotification('approval')
}
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg text-white p-8 mb-8">
      <h1 
        v-voix="'welcome-heading'" 
        class="text-3xl sm:text-4xl font-bold mb-4"
      >
        Welcome to ChronoSync
      </h1>
      <p class="text-lg text-indigo-100 mb-6">
        AI-powered calendar management for seamless scheduling, task coordination, and peak productivity.
      </p>
      <div class="flex flex-wrap gap-4 mt-6">
        <button 
          v-voix="'get-started-button'" 
          hint="Navigate to calendar view"
          class="btn bg-white text-indigo-700 hover:bg-indigo-50 font-medium py-2 px-6 rounded-md"
          @click="navigateToCalendar"
        >
          Open Calendar
        </button>
        <button 
          v-voix="'try-demo-button'" 
          hint="Generate a demo notification"
          class="btn bg-indigo-700 text-white hover:bg-indigo-800 font-medium py-2 px-6 rounded-md"
          @click="generateDemoNotification"
        >
          Try Demo Features
        </button>
      </div>
    </div>
    
    <!-- Key Features Grid -->
    <div class="mb-12">
      <h2 
        v-voix="'features-heading'" 
        class="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center"
      >
        Key Features
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="card bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div class="text-indigo-600 dark:text-indigo-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">AI-Powered Scheduling</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Intelligent scheduling that considers user preferences, availability, and meeting priorities.
          </p>
        </div>
        
        <!-- Feature 2 -->
        <div class="card bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div class="text-pink-600 dark:text-pink-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Time Zone Management</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Automatic time zone conversion for global teams to coordinate meetings without confusion.
          </p>
        </div>
        
        <!-- Feature 3 -->
        <div class="card bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div class="text-green-600 dark:text-green-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Multi-User Coordination</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Simplified scheduling across teams with visual indicators of shared availability.
          </p>
        </div>
        
        <!-- Feature 4 -->
        <div class="card bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div class="text-orange-600 dark:text-orange-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Task Integration</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Seamlessly connect tasks and calendar events for unified time and project management.
          </p>
        </div>
        
        <!-- Feature 5 -->
        <div class="card bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div class="text-blue-600 dark:text-blue-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Role-Based Access</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Flexible permission system allows proper access levels for team members and guests.
          </p>
        </div>
        
        <!-- Feature 6 -->
        <div class="card bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div class="text-purple-600 dark:text-purple-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Advanced Analytics</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Insightful metrics on meeting time, productivity patterns, and team collaboration.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Dashboard Widgets -->
    <div class="mb-12">
      <h2 
        v-voix="'dashboard-heading'" 
        class="text-2xl font-bold text-gray-900 dark:text-white mb-8"
      >
        Your Dashboard
      </h2>
      
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Upcoming Events Widget -->
        <div class="card bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 
              v-voix="'upcoming-events-heading'" 
              class="text-lg font-medium text-gray-900 dark:text-white"
            >
              Upcoming Events
            </h3>
            <button 
              v-voix="'view-calendar-button'" 
              hint="Navigate to calendar view"
              class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              @click="navigateToCalendar"
            >
              View Calendar
            </button>
          </div>
          
          <div v-if="upcomingEvents.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
            No upcoming events scheduled
          </div>
          
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div 
              v-for="event in upcomingEvents" 
              :key="event.id"
              class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750"
            >
              <div class="flex items-start">
                <div 
                  class="h-3 w-3 mt-1.5 rounded-full mr-3" 
                  :style="{ backgroundColor: event.color || '#3B82F6' }"
                ></div>
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {{ event.title }}
                  </h4>
                  <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span class="mr-2">{{ formatEventDate(event.start) }}</span>
                    <span>{{ formatEventTime(event.start) }} - {{ formatEventTime(event.end) }}</span>
                  </div>
                  <div 
                    v-if="event.status === 'pending'" 
                    class="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                  >
                    Pending Approval
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Today's Tasks Widget -->
        <div class="card bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 
              v-voix="'todays-tasks-heading'" 
              class="text-lg font-medium text-gray-900 dark:text-white"
            >
              Today's Tasks
            </h3>
            <button 
              v-voix="'view-tasks-button'" 
              hint="Navigate to tasks view"
              class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              @click="navigateToTasks"
            >
              View All Tasks
            </button>
          </div>
          
          <div v-if="todaysTasks.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
            No tasks due today
          </div>
          
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div 
              v-for="task in todaysTasks" 
              :key="task.id"
              class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750"
            >
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                  <svg 
                    v-if="task.status === 'completed'" 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-5 w-5 text-green-500" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <svg 
                    v-else-if="task.status === 'in-progress'" 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-5 w-5 text-blue-500" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <svg 
                    v-else 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-5 w-5 text-gray-400" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3 flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ task.title }}
                  </p>
                  <div class="mt-1 flex items-center">
                    <span 
                      v-if="task.priority === 'high'" 
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 mr-2"
                    >
                      High
                    </span>
                    <span 
                      v-else-if="task.priority === 'medium'" 
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 mr-2"
                    >
                      Medium
                    </span>
                    <span 
                      v-else 
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 mr-2"
                    >
                      Low
                    </span>
                    <span 
                      class="inline-flex items-center text-xs text-gray-500 dark:text-gray-400"
                    >
                      {{ task.timeEstimate }} {{ task.timeEstimate === 1 ? 'hour' : 'hours' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Role Simulation Section -->
    <div class="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-12">
      <h2 
        v-voix="'role-simulation-heading'" 
        class="text-2xl font-bold text-gray-900 dark:text-white mb-4"
      >
        Try Different Roles
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Experience how ChronoSync adapts to different user permissions:
      </p>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          class="border border-gray-200 dark:border-gray-700 rounded-md p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          :class="{ 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700': calendarStore.currentRole === 'admin' }"
          @click="calendarStore.setCurrentRole('admin')"
        >
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">Admin</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">Full access to all features, user management, and settings.</p>
        </div>
        
        <div 
          class="border border-gray-200 dark:border-gray-700 rounded-md p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          :class="{ 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700': calendarStore.currentRole === 'manager' }"
          @click="calendarStore.setCurrentRole('manager')"
        >
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">Manager</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">Can manage team events, approve requests, and view analytics.</p>
        </div>
        
        <div 
          class="border border-gray-200 dark:border-gray-700 rounded-md p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          :class="{ 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700': calendarStore.currentRole === 'employee' }"
          @click="calendarStore.setCurrentRole('employee')"
        >
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">Employee</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">Can manage personal events and tasks, view team availability.</p>
        </div>
        
        <div 
          class="border border-gray-200 dark:border-gray-700 rounded-md p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          :class="{ 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700': calendarStore.currentRole === 'guest' }"
          @click="calendarStore.setCurrentRole('guest')"
        >
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">Guest</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">View-only access to shared events and limited interactions.</p>
        </div>
      </div>
    </div>
    
    <!-- CTA Section -->
    <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-8 text-center">
      <h2 
        v-voix="'cta-heading'" 
        class="text-2xl font-bold text-gray-900 dark:text-white mb-4"
      >
        Experience the Full Demo
      </h2>
      <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
        Explore all features of ChronoSync including AI scheduling, task management, analytics, and more.
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <button 
          v-voix="'explore-calendar-button'" 
          hint="Navigate to calendar view"
          class="btn btn-primary"
          @click="navigateToCalendar"
        >
          Explore Calendar
        </button>
        <button 
          v-voix="'explore-tasks-button'" 
          hint="Navigate to tasks view"
          class="btn bg-white text-indigo-700 hover:bg-gray-50 border border-indigo-300"
          @click="navigateToTasks"
        >
          Manage Tasks
        </button>
      </div>
    </div>
  </div>
</template>
