<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCalendarStore } from '../stores/calendar'
import { useNotificationsStore } from '../stores/notifications'
import { format, addDays, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns'

const calendarStore = useCalendarStore()
const notificationsStore = useNotificationsStore()

// Date range for availability view (5 days by default)
const startDate = ref(new Date())
const numDays = ref(5)
const endDate = computed(() => {
  return addDays(startDate.value, numDays.value - 1)
})

// Selected users
const selectedUsers = ref([])
const allUsersSelected = ref(false)

// Time range for the day (working hours)
const dayStartHour = ref(8) // 8 AM
const dayEndHour = ref(18) // 6 PM
const hoursList = computed(() => {
  const hours = []
  for (let hour = dayStartHour.value; hour <= dayEndHour.value; hour++) {
    hours.push({
      hour,
      label: format(new Date().setHours(hour, 0, 0, 0), 'h a')
    })
  }
  return hours
})

// Days to display in the grid
const daysInRange = computed(() => {
  const days = []
  let currentDate = new Date(startDate.value)
  
  for (let i = 0; i < numDays.value; i++) {
    days.push({
      date: new Date(currentDate),
      dayName: format(currentDate, 'EEE'),
      dayNumber: format(currentDate, 'd'),
      monthDay: format(currentDate, 'MMM d')
    })
    currentDate = addDays(currentDate, 1)
  }
  
  return days
})

// Move date range forward/backward
const goToNextPeriod = () => {
  startDate.value = addDays(startDate.value, numDays.value)
}

const goToPreviousPeriod = () => {
  startDate.value = addDays(startDate.value, -numDays.value)
}

const goToToday = () => {
  startDate.value = new Date()
}

// Calculate availability for selected users
const availabilityMatrix = computed(() => {
  const matrix = {}
  
  // Initialize matrix for each selected user
  selectedUsers.value.forEach(userId => {
    matrix[userId] = {}
    
    // For each day in the range
    daysInRange.value.forEach(day => {
      const dateKey = format(day.date, 'yyyy-MM-dd')
      matrix[userId][dateKey] = {}
      
      // Initialize all hours as unavailable
      hoursList.value.forEach(hourInfo => {
        matrix[userId][dateKey][hourInfo.hour] = false
      })
    })
  })
  
  // Fill in availability based on calendar data
  selectedUsers.value.forEach(userId => {
    // Get the stored availability data for this user
    const userAvailability = calendarStore.availabilityData[userId] || []
    
    // Update matrix based on available time blocks
    userAvailability.forEach(availabilityBlock => {
      const blockStart = new Date(availabilityBlock.start)
      const blockEnd = new Date(availabilityBlock.end)
      
      // Check each day in the range
      daysInRange.value.forEach(day => {
        const dayStart = startOfDay(day.date)
        const dayEnd = endOfDay(day.date)
        
        // If the availability block overlaps with this day
        if (
          isWithinInterval(blockStart, { start: dayStart, end: dayEnd }) ||
          isWithinInterval(blockEnd, { start: dayStart, end: dayEnd }) ||
          (blockStart <= dayStart && blockEnd >= dayEnd)
        ) {
          // Determine which hours are available
          const dateKey = format(day.date, 'yyyy-MM-dd')
          
          // For each hour in the availability block
          hoursList.value.forEach(hourInfo => {
            const hourDate = new Date(day.date)
            hourDate.setHours(hourInfo.hour, 0, 0, 0)
            
            // If this hour is within the availability block
            if (hourDate >= blockStart && hourDate < blockEnd) {
              matrix[userId][dateKey][hourInfo.hour] = true
            }
          })
        }
      })
    })
  })
  
  return matrix
})

// Calculate common availability across all selected users
const commonAvailability = computed(() => {
  if (selectedUsers.value.length === 0) return {}
  
  const common = {}
  
  // For each day in the range
  daysInRange.value.forEach(day => {
    const dateKey = format(day.date, 'yyyy-MM-dd')
    common[dateKey] = {}
    
    // For each hour, check if all selected users are available
    hoursList.value.forEach(hourInfo => {
      common[dateKey][hourInfo.hour] = selectedUsers.value.every(userId => 
        availabilityMatrix.value[userId]?.[dateKey]?.[hourInfo.hour]
      )
    })
  })
  
  return common
})

// Find the best meeting times
const findOptimalMeetingTimes = () => {
  if (selectedUsers.value.length === 0) {
    notificationsStore.addNotification({
      type: 'system',
      message: 'Please select at least one user to find optimal meeting times.'
    })
    return
  }
  
  // Get all times when all selected users are available
  const availableTimes = []
  
  // Check each day
  Object.keys(commonAvailability.value).forEach(dateKey => {
    // Check for each hour
    Object.keys(commonAvailability.value[dateKey]).forEach(hour => {
      if (commonAvailability.value[dateKey][hour]) {
        const date = new Date(dateKey)
        date.setHours(parseInt(hour), 0, 0, 0)
        
        availableTimes.push({
          date,
          day: format(date, 'EEE, MMM d'),
          time: format(date, 'h:mm a'),
          score: calculateTimeScore(date)
        })
      }
    })
  })
  
  // If no times found
  if (availableTimes.length === 0) {
    notificationsStore.addNotification({
      type: 'system',
      message: 'No common available times found for the selected users in this date range.'
    })
    return
  }
  
  // Sort by score (higher is better)
  availableTimes.sort((a, b) => b.score - a.score)
  
  // Take top 3 or all if less than 3
  const bestTimes = availableTimes.slice(0, Math.min(3, availableTimes.length))
  
  // Show notification with best times
  notificationsStore.addNotification({
    type: 'system',
    message: `Best meeting times found: ${bestTimes.map(t => `${t.day} at ${t.time}`).join('; ')}`
  })
}

// Calculate a "score" for a time slot based on criteria
const calculateTimeScore = (date) => {
  const hour = date.getHours()
  const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
  
  let score = 100
  
  // Prefer midweek days
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    score -= 30 // Weekend penalty
  } else if (dayOfWeek === 1 || dayOfWeek === 5) {
    score -= 10 // Monday/Friday penalty
  }
  
  // Prefer mid-day hours
  if (hour < 9) {
    score -= 15 // Early morning penalty
  } else if (hour > 16) {
    score -= 15 // Late afternoon penalty
  }
  
  // Prefer times closer to now
  const dayDiff = Math.floor((date - new Date()) / (1000 * 60 * 60 * 24))
  score -= dayDiff * 5 // Penalty for days in the future
  
  return score
}

// Toggle user selection
const toggleUserSelection = (userId) => {
  const index = selectedUsers.value.indexOf(userId)
  if (index === -1) {
    selectedUsers.value.push(userId)
  } else {
    selectedUsers.value.splice(index, 1)
  }
  
  // Update all users selected state
  allUsersSelected.value = selectedUsers.value.length === calendarStore.users.length
}

// Toggle all users
const toggleAllUsers = () => {
  if (allUsersSelected.value) {
    selectedUsers.value = []
  } else {
    selectedUsers.value = calendarStore.users.map(user => user.id)
  }
  allUsersSelected.value = !allUsersSelected.value
}

// Get cell class based on availability
const getCellClass = (userId, dateKey, hour) => {
  if (!userId) {
    // This is a common availability cell
    return commonAvailability.value[dateKey]?.[hour]
      ? 'bg-green-100 dark:bg-green-900/30'
      : 'bg-gray-100 dark:bg-gray-800'
  } else {
    // This is a specific user's availability cell
    return availabilityMatrix.value[userId]?.[dateKey]?.[hour]
      ? 'bg-blue-100 dark:bg-blue-900/30'
      : 'bg-gray-100 dark:bg-gray-800'
  }
}

// Initialize with all users selected
onMounted(() => {
  selectedUsers.value = calendarStore.users.map(user => user.id)
  allUsersSelected.value = true
})
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-center">
      <h1 
        v-voix="'availability-heading'" 
        class="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0"
      >
        Multi-User Availability
      </h1>
      
      <div class="flex flex-wrap gap-2">
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button 
            v-voix="'previous-button'" 
            hint="View previous time period"
            class="px-3 py-2 text-sm font-medium rounded-l-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="goToPreviousPeriod"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          <button 
            v-voix="'today-button'" 
            hint="Go to today"
            class="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-t border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="goToToday"
          >
            Today
          </button>
          <button 
            v-voix="'next-button'" 
            hint="View next time period"
            class="px-3 py-2 text-sm font-medium rounded-r-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="goToNextPeriod"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <button 
          v-voix="'find-optimal-times'" 
          hint="Find the best meeting times for selected users"
          class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
          @click="findOptimalMeetingTimes"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
          Find Optimal Times
        </button>
      </div>
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <!-- Date Range Display -->
      <div class="text-center text-lg font-medium text-gray-900 dark:text-white mb-6">
        Availability for {{ format(startDate, 'MMM d') }} - {{ format(endDate, 'MMM d, yyyy') }}
      </div>
      
      <!-- User Selection -->
      <div class="mb-8">
        <h2 
          v-voix="'select-users-heading'" 
          class="text-lg font-medium text-gray-900 dark:text-white mb-4"
        >
          Select Users
        </h2>
        
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center">
            <input 
              v-voix="'select-all-users'" 
              hint="Select or deselect all users"
              type="checkbox" 
              id="select-all" 
              v-model="allUsersSelected"
              @change="toggleAllUsers"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="select-all" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">Select All</label>
          </div>
          
          <div 
            v-for="user in calendarStore.users" 
            :key="user.id"
            class="flex items-center"
          >
            <input 
              v-voix="`select-user-${user.id}`" 
              :hint="`Select or deselect ${user.name}`"
              type="checkbox" 
              :id="`user-${user.id}`" 
              :checked="selectedUsers.includes(user.id)"
              @change="toggleUserSelection(user.id)"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label :for="`user-${user.id}`" class="ml-2 flex items-center gap-2">
              <img 
                :src="user.avatar" 
                alt="" 
                class="w-6 h-6 rounded-full"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ user.name }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">({{ user.timezone }})</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Legend -->
      <div class="mb-4 flex flex-wrap gap-4">
        <div class="flex items-center">
          <div class="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 mr-2"></div>
          <span class="text-sm text-gray-700 dark:text-gray-300">Available</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-gray-100 dark:bg-gray-800 mr-2"></div>
          <span class="text-sm text-gray-700 dark:text-gray-300">Unavailable</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-green-100 dark:bg-green-900/30 mr-2"></div>
          <span class="text-sm text-gray-700 dark:text-gray-300">Common Availability</span>
        </div>
      </div>
      
      <!-- Availability Grid -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th 
                scope="col" 
                class="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32"
              >
                User / Time
              </th>
              <th 
                v-for="day in daysInRange" 
                :key="day.date"
                scope="col" 
                class="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                :class="{ 'bg-indigo-50 dark:bg-indigo-900/10': format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') }"
              >
                {{ day.dayName }}, {{ day.monthDay }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Hours Header -->
            <tr class="bg-gray-50 dark:bg-gray-750">
              <td class="p-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                Hours
              </td>
              <td 
                v-for="day in daysInRange" 
                :key="day.date"
                class="p-0"
                :class="{ 'bg-indigo-50 dark:bg-indigo-900/10': format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') }"
              >
                <div class="grid grid-cols-11 gap-0">
                  <div 
                    v-for="hourInfo in hoursList" 
                    :key="`header-${day.date}-${hourInfo.hour}`"
                    class="p-1 text-center text-xs text-gray-500 dark:text-gray-400"
                  >
                    {{ hourInfo.hour % 12 || 12 }}{{ hourInfo.hour >= 12 ? 'p' : 'a' }}
                  </div>
                </div>
              </td>
            </tr>
            
            <!-- Common Availability Row -->
            <tr>
              <td class="p-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                Common Availability
              </td>
              <td 
                v-for="day in daysInRange" 
                :key="`common-${day.date}`"
                class="p-0"
                :class="{ 'bg-indigo-50 dark:bg-indigo-900/10': format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') }"
              >
                <div class="grid grid-cols-11 gap-0">
                  <div 
                    v-for="hourInfo in hoursList" 
                    :key="`common-${day.date}-${hourInfo.hour}`"
                    class="border border-gray-200 dark:border-gray-700 h-6"
                    :class="getCellClass(null, format(day.date, 'yyyy-MM-dd'), hourInfo.hour)"
                  ></div>
                </div>
              </td>
            </tr>
            
            <!-- User Rows -->
            <tr v-for="user in calendarStore.users.filter(user => selectedUsers.includes(user.id))" :key="user.id">
              <td class="p-2 whitespace-nowrap">
                <div class="flex items-center">
                  <img 
                    :src="user.avatar" 
                    alt="" 
                    class="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.name }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ user.timezone }}
                    </div>
                  </div>
                </div>
              </td>
              <td 
                v-for="day in daysInRange" 
                :key="`user-${user.id}-${day.date}`"
                class="p-0"
                :class="{ 'bg-indigo-50 dark:bg-indigo-900/10': format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') }"
              >
                <div class="grid grid-cols-11 gap-0">
                  <div 
                    v-for="hourInfo in hoursList" 
                    :key="`user-${user.id}-${day.date}-${hourInfo.hour}`"
                    class="border border-gray-200 dark:border-gray-700 h-6"
                    :class="getCellClass(user.id, format(day.date, 'yyyy-MM-dd'), hourInfo.hour)"
                  ></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Meeting Scheduling Options -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 
        v-voix="'scheduling-options-heading'" 
        class="text-lg font-medium text-gray-900 dark:text-white mb-4"
      >
        Meeting Scheduling Options
      </h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">
            Schedule Based on Availability
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Select users from the grid above and click "Find Optimal Times" to let AI suggest 
            the best meeting times based on common availability and scheduling preferences.
          </p>
          <button 
            v-voix="'find-best-times-button'" 
            hint="Find optimal meeting times for selected users"
            class="btn btn-primary"
            @click="findOptimalMeetingTimes"
          >
            Find Best Meeting Times
          </button>
        </div>
        
        <div>
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">
            Schedule a New Meeting
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Create a new meeting with the selected users. The meeting will be sent as a pending request
            if any of the selected users have conflicts.
          </p>
          <button 
            v-voix="'schedule-meeting-button'" 
            hint="Create a new meeting with selected users"
            class="btn bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            :disabled="selectedUsers.length === 0"
            @click="$router.push('/calendar')"
          >
            Go to Calendar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>