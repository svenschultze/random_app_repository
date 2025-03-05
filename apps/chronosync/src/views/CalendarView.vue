<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCalendarStore } from '../stores/calendar'
import { useTasksStore } from '../stores/tasks'
import { useNotificationsStore } from '../stores/notifications'
import { format, parseISO, addDays, subDays, addMonths, subMonths, addWeeks, subWeeks, isSameDay } from 'date-fns'

const calendarStore = useCalendarStore()
const tasksStore = useTasksStore()
const notificationsStore = useNotificationsStore()

// States
const currentDate = ref(new Date())
const selectedTimeZone = ref(calendarStore.timeZone)
const showEventModal = ref(false)
const showScheduleModal = ref(false)
const eventBeingEdited = ref(null)
const newEvent = ref({
  title: '',
  start: '',
  end: '',
  description: '',
  attendees: [],
  status: 'pending',
  location: '',
  isAllDay: false,
  color: '#4F46E5'
})
const availableTimeSlots = ref([])
const isLoadingTimeSlots = ref(false)

// Compute visible events based on current view and date
const visibleEvents = computed(() => {
  const startDate = new Date(currentDate.value)
  let endDate = new Date(currentDate.value)
  
  if (calendarStore.currentView === 'day') {
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)
  } else if (calendarStore.currentView === 'week') {
    // Start from Sunday of the current week
    const day = startDate.getDay()
    startDate.setDate(startDate.getDate() - day)
    startDate.setHours(0, 0, 0, 0)
    
    // End on Saturday of the current week
    endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6)
    endDate.setHours(23, 59, 59, 999)
  } else if (calendarStore.currentView === 'month') {
    // Start from the 1st day of the month
    startDate.setDate(1)
    startDate.setHours(0, 0, 0, 0)
    
    // End on the last day of the month
    endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
    endDate.setHours(23, 59, 59, 999)
  }
  
  return calendarStore.getEvents.filter(event => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
    
    return (eventStart >= startDate && eventStart <= endDate) || 
           (eventEnd >= startDate && eventEnd <= endDate) ||
           (eventStart <= startDate && eventEnd >= endDate)
  })
})

// Generate time slots for day view
const timeSlots = computed(() => {
  const slots = []
  for (let hour = 0; hour < 24; hour++) {
    slots.push({
      hour,
      label: format(new Date().setHours(hour, 0, 0, 0), 'h a')
    })
  }
  return slots
})

// Generate days for week view
const weekDays = computed(() => {
  const days = []
  const startOfWeek = new Date(currentDate.value)
  const day = startOfWeek.getDay()
  startOfWeek.setDate(startOfWeek.getDate() - day) // Start from Sunday
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(startOfWeek, i)
    days.push({
      date,
      dayName: format(date, 'EEE'),
      dayNumber: format(date, 'd')
    })
  }
  
  return days
})

// Generate days for month view
const monthDays = computed(() => {
  const days = []
  const firstDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
  const lastDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0)
  
  // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay()
  
  // Calculate the date of the first cell in the calendar grid (might be from the previous month)
  const startDate = subDays(firstDay, firstDayOfWeek)
  
  // We need 6 weeks (42 days) to ensure we have enough cells for all months
  for (let i = 0; i < 42; i++) {
    const date = addDays(startDate, i)
    const isCurrentMonth = date.getMonth() === currentDate.value.getMonth()
    
    days.push({
      date,
      dayNumber: format(date, 'd'),
      isCurrentMonth,
      events: getEventsForDay(date)
    })
  }
  
  return days
})

// Helper function to get events for a specific day (used in month view)
const getEventsForDay = (day) => {
  return calendarStore.getEvents.filter(event => {
    const eventStart = new Date(event.start)
    return isSameDay(eventStart, day)
  }).sort((a, b) => new Date(a.start) - new Date(b.start))
}

// Get events happening at a specific hour (used in day/week view)
const getEventsAtHour = (date, hour) => {
  const targetDate = new Date(date)
  targetDate.setHours(hour)
  
  return calendarStore.getEvents.filter(event => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
    
    // Check if the event is happening during this hour
    return isSameDay(eventStart, targetDate) && 
           eventStart.getHours() <= hour && 
           eventEnd.getHours() > hour
  })
}

// Navigation functions
const goToNextPeriod = () => {
  if (calendarStore.currentView === 'day') {
    currentDate.value = addDays(currentDate.value, 1)
  } else if (calendarStore.currentView === 'week') {
    currentDate.value = addWeeks(currentDate.value, 1)
  } else if (calendarStore.currentView === 'month') {
    currentDate.value = addMonths(currentDate.value, 1)
  }
}

const goToPreviousPeriod = () => {
  if (calendarStore.currentView === 'day') {
    currentDate.value = subDays(currentDate.value, 1)
  } else if (calendarStore.currentView === 'week') {
    currentDate.value = subWeeks(currentDate.value, 1)
  } else if (calendarStore.currentView === 'month') {
    currentDate.value = subMonths(currentDate.value, 1)
  }
}

const goToToday = () => {
  currentDate.value = new Date()
}

// Modal functions
const openNewEventModal = () => {
  // Initialize with current date and default duration of 1 hour
  const now = new Date()
  const oneHourLater = new Date(now)
  oneHourLater.setHours(now.getHours() + 1)
  
  newEvent.value = {
    title: '',
    start: now.toISOString(),
    end: oneHourLater.toISOString(),
    description: '',
    attendees: [calendarStore.users.find(user => user.role === calendarStore.currentRole)?.id], // Current user
    status: calendarStore.currentRole === 'admin' || calendarStore.currentRole === 'manager' ? 'confirmed' : 'pending',
    location: '',
    isAllDay: false,
    color: '#4F46E5'
  }
  
  eventBeingEdited.value = null
  showEventModal.value = true
}

const openEditEventModal = (event) => {
  if (!calendarStore.hasEditPermission && event.status === 'confirmed') {
    notificationsStore.addNotification({
      type: 'system',
      message: 'You do not have permission to edit confirmed events.'
    })
    return
  }
  
  eventBeingEdited.value = { ...event }
  showEventModal.value = true
}

const closeEventModal = () => {
  showEventModal.value = false
  eventBeingEdited.value = null
}

// Create a video meeting link (integration demo)
const createVideoMeeting = () => {
  // Generate a mock meeting link
  const meetingId = Math.floor(100000000 + Math.random() * 900000000)
  const meetingLink = `https://zoom.us/j/${meetingId}`
  
  // Update the location field with the meeting link
  if (eventBeingEdited.value) {
    eventBeingEdited.value.location = meetingLink
  } else {
    newEvent.value.location = meetingLink
  }
  
  // Show notification
  notificationsStore.addNotification({
    type: 'system',
    message: 'Video meeting link created successfully.'
  })
}

const saveEvent = () => {
  if (eventBeingEdited.value) {
    // Update existing event
    calendarStore.updateEvent(eventBeingEdited.value)
    
    // If the event is newly approved, create a notification
    if (eventBeingEdited.value.status === 'confirmed' && 
        calendarStore.getEventById(eventBeingEdited.value.id).status === 'pending') {
      notificationsStore.addNotification({
        type: 'system',
        message: `Event "${eventBeingEdited.value.title}" has been approved.`
      })
    }
  } else {
    // Create new event
    const newEventAdded = calendarStore.addEvent(newEvent.value)
    
    // If the event needs approval, create a notification
    if (newEventAdded.status === 'pending') {
      notificationsStore.addNotification({
        type: 'approval',
        message: `New event "${newEventAdded.title}" needs approval.`,
        relatedId: newEventAdded.id
      })
    }
  }
  
  closeEventModal()
}

const deleteEvent = () => {
  if (eventBeingEdited.value) {
    calendarStore.deleteEvent(eventBeingEdited.value.id)
    closeEventModal()
  }
}

// Smart scheduling functions
const openSmartScheduleModal = () => {
  availableTimeSlots.value = []
  showScheduleModal.value = true
}

const findOptimalTime = () => {
  isLoadingTimeSlots.value = true
  
  // Simulate AI processing delay
  setTimeout(() => {
    // Get selected users (or default to all if none selected)
    const selectedAttendees = eventBeingEdited.value?.attendees || 
                            newEvent.value.attendees.length > 0 ? 
                            newEvent.value.attendees : 
                            calendarStore.users.map(user => user.id)
    
    // Find optimal time slots (simulated AI algorithm)
    availableTimeSlots.value = calendarStore.findOptimalTime(1, selectedAttendees)
    isLoadingTimeSlots.value = false
  }, 1500)
}

const selectTimeSlot = (slot) => {
  if (eventBeingEdited.value) {
    eventBeingEdited.value.start = slot.start
    eventBeingEdited.value.end = slot.end
  } else {
    newEvent.value.start = slot.start
    newEvent.value.end = slot.end
  }
  
  showScheduleModal.value = false
}

const formatTimeSlot = (slot) => {
  const start = new Date(slot.start)
  const end = new Date(slot.end)
  
  return `${format(start, 'EEE, MMM d')} at ${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`
}

// Initialize with appropriate timezone
onMounted(() => {
  selectedTimeZone.value = calendarStore.timeZone
})

// Watch for changes to the timezone
watch(selectedTimeZone, (newTimeZone) => {
  calendarStore.setTimeZone(newTimeZone)
})

// Compute current view title
const viewTitle = computed(() => {
  if (calendarStore.currentView === 'day') {
    return format(currentDate.value, 'EEEE, MMMM d, yyyy')
  } else if (calendarStore.currentView === 'week') {
    const startDate = new Date(weekDays.value[0].date)
    const endDate = new Date(weekDays.value[6].date)
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
  } else {
    return format(currentDate.value, 'MMMM yyyy')
  }
})

// Computed properties for event form inputs
const eventTitleValue = computed({
  get: () => eventBeingEdited.value ? eventBeingEdited.value.title : newEvent.value.title,
  set: (value) => {
    if (eventBeingEdited.value) {
      eventBeingEdited.value.title = value
    } else {
      newEvent.value.title = value
    }
  }
})

const eventStartValue = computed({
  get: () => eventBeingEdited.value ? eventBeingEdited.value.start.substring(0, 16) : newEvent.value.start.substring(0, 16),
  set: (value) => {
    if (eventBeingEdited.value) {
      eventBeingEdited.value.start = value
    } else {
      newEvent.value.start = value
    }
  }
})

const eventEndValue = computed({
  get: () => eventBeingEdited.value ? eventBeingEdited.value.end.substring(0, 16) : newEvent.value.end.substring(0, 16),
  set: (value) => {
    if (eventBeingEdited.value) {
      eventBeingEdited.value.end = value
    } else {
      newEvent.value.end = value
    }
  }
})

const eventDescriptionValue = computed({
  get: () => eventBeingEdited.value ? eventBeingEdited.value.description : newEvent.value.description,
  set: (value) => {
    if (eventBeingEdited.value) {
      eventBeingEdited.value.description = value
    } else {
      newEvent.value.description = value
    }
  }
})

const eventLocationValue = computed({
  get: () => eventBeingEdited.value ? eventBeingEdited.value.location : newEvent.value.location,
  set: (value) => {
    if (eventBeingEdited.value) {
      eventBeingEdited.value.location = value
    } else {
      newEvent.value.location = value
    }
  }
})

const eventAttendeesValue = computed({
  get: () => eventBeingEdited.value ? eventBeingEdited.value.attendees : newEvent.value.attendees,
  set: (value) => {
    if (eventBeingEdited.value) {
      eventBeingEdited.value.attendees = value
    } else {
      newEvent.value.attendees = value
    }
  }
})

const eventIsAllDayValue = computed({
  get: () => eventBeingEdited.value ? eventBeingEdited.value.isAllDay : newEvent.value.isAllDay,
  set: (value) => {
    if (eventBeingEdited.value) {
      eventBeingEdited.value.isAllDay = value
    } else {
      newEvent.value.isAllDay = value
    }
  }
})

const eventStatusValue = computed({
  get: () => eventBeingEdited.value ? eventBeingEdited.value.status : newEvent.value.status,
  set: (value) => {
    if (eventBeingEdited.value) {
      eventBeingEdited.value.status = value
    } else {
      newEvent.value.status = value
    }
  }
})

const eventColorValue = computed({
  get: () => eventBeingEdited.value ? eventBeingEdited.value.color : newEvent.value.color,
  set: (value) => {
    if (eventBeingEdited.value) {
      eventBeingEdited.value.color = value
    } else {
      newEvent.value.color = value
    }
  }
})

// Get event style based on status
const getEventStatusClass = (status) => {
  if (status === 'confirmed') return 'bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-700'
  if (status === 'pending') return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700'
  if (status === 'cancelled') return 'bg-red-100 border-red-300 dark:bg-red-900/20 dark:border-red-700'
  return 'bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700'
}
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Calendar Header -->
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-center">
      <h1 
        v-voix="'calendar-heading'" 
        class="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0"
      >
        Calendar
      </h1>
      
      <div class="flex flex-wrap gap-2">
        <!-- View selector -->
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button 
            v-voix="'day-view-button'" 
            hint="Switch to day view"
            class="px-4 py-2 text-sm font-medium rounded-l-md border"
            :class="calendarStore.currentView === 'day' ? 
              'bg-indigo-600 text-white border-indigo-700' : 
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="calendarStore.setCurrentView('day')"
          >
            Day
          </button>
          <button 
            v-voix="'week-view-button'" 
            hint="Switch to week view"
            class="px-4 py-2 text-sm font-medium border-t border-b"
            :class="calendarStore.currentView === 'week' ? 
              'bg-indigo-600 text-white border-indigo-700' : 
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="calendarStore.setCurrentView('week')"
          >
            Week
          </button>
          <button 
            v-voix="'month-view-button'" 
            hint="Switch to month view"
            class="px-4 py-2 text-sm font-medium rounded-r-md border"
            :class="calendarStore.currentView === 'month' ? 
              'bg-indigo-600 text-white border-indigo-700' : 
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="calendarStore.setCurrentView('month')"
          >
            Month
          </button>
        </div>
        
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button 
            v-voix="'previous-button'" 
            hint="Go to previous period"
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
            hint="Go to next period"
            class="px-3 py-2 text-sm font-medium rounded-r-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="goToNextPeriod"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <!-- Time zone selector -->
        <select 
          v-voix="'timezone-selector'" 
          hint="Select a time zone"
          v-model="selectedTimeZone"
          class="px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-sm"
        >
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="Europe/London">London (GMT)</option>
          <option value="Europe/Berlin">Berlin (CET)</option>
          <option value="Asia/Tokyo">Tokyo (JST)</option>
          <option value="Asia/Shanghai">China (CST)</option>
          <option value="Australia/Sydney">Sydney (AEST)</option>
        </select>
      </div>
    </div>
    
    <!-- Create Event and Smart Schedule buttons -->
    <div class="mb-6 flex flex-wrap gap-3">
      <button 
        v-voix="'create-event-button'" 
        hint="Create a new calendar event"
        class="btn btn-primary inline-flex items-center"
        @click="openNewEventModal"
        :disabled="calendarStore.currentRole === 'guest'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Create Event
      </button>
      
      <button 
        v-voix="'smart-schedule-button'" 
        hint="Find optimal time slots for meetings"
        class="btn bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 inline-flex items-center"
        @click="openSmartScheduleModal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
        </svg>
        Smart Schedule
      </button>
      
      <button 
        v-if="calendarStore.currentRole === 'admin' || calendarStore.currentRole === 'manager'" 
        v-voix="'pending-approvals-button'" 
        hint="Show events pending approval"
        class="btn bg-white dark:bg-gray-800 text-yellow-600 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 inline-flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        Pending Approvals
        <span 
          v-if="calendarStore.getPendingEvents.length > 0"
          class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
        >
          {{ calendarStore.getPendingEvents.length }}
        </span>
      </button>
    </div>
    
    <!-- Current View Title -->
    <div class="mb-6 text-xl font-medium text-gray-900 dark:text-white text-center">
      {{ viewTitle }}
    </div>
    
    <!-- Calendar Grid -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <!-- Day View -->
      <div v-if="calendarStore.currentView === 'day'" class="min-h-[600px]">
        <div class="grid grid-cols-[80px_1fr] divide-x divide-gray-200 dark:divide-gray-700">
          <!-- Time labels column -->
          <div class="pt-16">
            <div 
              v-for="slot in timeSlots" 
              :key="slot.hour"
              class="h-20 border-t border-gray-200 dark:border-gray-700 pl-2 pt-1 text-xs text-gray-500 dark:text-gray-400"
            >
              {{ slot.label }}
            </div>
          </div>
          
          <!-- Events column -->
          <div class="relative">
            <!-- Date header -->
            <div class="sticky top-0 z-10 bg-indigo-50 dark:bg-indigo-900/20 h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ format(currentDate, 'EEEE, MMMM d') }}
              </h3>
            </div>
            
            <!-- Time slots with events -->
            <div class="relative">
              <div 
                v-for="slot in timeSlots" 
                :key="slot.hour"
                class="h-20 border-t border-gray-200 dark:border-gray-700 relative"
              >
                <!-- Events in this time slot -->
                <div 
                  v-for="event in getEventsAtHour(currentDate, slot.hour)" 
                  :key="event.id"
                  class="absolute left-0 right-4 mx-2 p-2 rounded border text-xs shadow-sm overflow-hidden cursor-pointer"
                  :class="getEventStatusClass(event.status)"
                  :style="{
                    top: `${((new Date(event.start).getMinutes()) / 60) * 100}%`,
                    height: `${Math.min(100, (((new Date(event.end) - new Date(event.start)) / 3600000) * 100))}%`
                  }"
                  @click="openEditEventModal(event)"
                >
                  <div class="font-medium text-gray-900 dark:text-white truncate">{{ event.title }}</div>
                  <div class="text-gray-600 dark:text-gray-300">
                    {{ format(new Date(event.start), 'h:mm a') }} - {{ format(new Date(event.end), 'h:mm a') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Week View -->
      <div v-else-if="calendarStore.currentView === 'week'" class="min-h-[600px]">
        <div class="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] divide-x divide-gray-200 dark:divide-gray-700">
          <!-- Empty top-left cell -->
          <div class="pt-16"></div>
          
          <!-- Day headers -->
          <div 
            v-for="day in weekDays" 
            :key="day.date"
            class="sticky top-0 z-10 bg-indigo-50 dark:bg-indigo-900/20 h-16 flex flex-col items-center justify-center border-b border-gray-200 dark:border-gray-700"
            :class="{ 'bg-indigo-100 dark:bg-indigo-900/40': isSameDay(day.date, new Date()) }"
          >
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ day.dayName }}</div>
            <div 
              class="text-xl font-medium rounded-full w-8 h-8 flex items-center justify-center"
              :class="isSameDay(day.date, new Date()) ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-300'"
            >
              {{ day.dayNumber }}
            </div>
          </div>
          
          <!-- Time grid -->
          <div>
            <div 
              v-for="slot in timeSlots" 
              :key="slot.hour"
              class="h-20 border-t border-gray-200 dark:border-gray-700 pl-2 pt-1 text-xs text-gray-500 dark:text-gray-400"
            >
              {{ slot.label }}
            </div>
          </div>
          
          <!-- Days columns with events -->
          <div 
            v-for="day in weekDays" 
            :key="day.date"
            class="relative border-t border-gray-200 dark:border-gray-700"
          >
            <div 
              v-for="slot in timeSlots" 
              :key="slot.hour"
              class="h-20 border-t border-gray-200 dark:border-gray-700 relative"
            >
              <!-- Events in this time slot -->
              <div 
                v-for="event in getEventsAtHour(day.date, slot.hour)" 
                :key="event.id"
                class="absolute left-0 right-1 mx-1 p-1 rounded border text-xs shadow-sm overflow-hidden cursor-pointer"
                :class="getEventStatusClass(event.status)"
                :style="{
                  top: `${((new Date(event.start).getMinutes()) / 60) * 100}%`,
                  height: `${Math.min(100, (((new Date(event.end) - new Date(event.start)) / 3600000) * 100))}%`
                }"
                @click="openEditEventModal(event)"
              >
                <div class="font-medium text-gray-900 dark:text-white truncate">{{ event.title }}</div>
                <div class="text-gray-600 dark:text-gray-300 text-xs">
                  {{ format(new Date(event.start), 'h:mm') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Month View -->
      <div v-else class="min-h-[600px]">
        <!-- Day of week headers -->
        <div class="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          <div 
            v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" 
            :key="day"
            class="py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {{ day }}
          </div>
        </div>
        
        <!-- Calendar cells grid -->
        <div class="grid grid-cols-7 grid-rows-6 divide-x divide-y divide-gray-200 dark:divide-gray-700">
          <div 
            v-for="(day, index) in monthDays" 
            :key="index"
            class="min-h-28 p-1"
            :class="{ 
              'bg-white dark:bg-gray-800': day.isCurrentMonth, 
              'bg-gray-50 dark:bg-gray-850': !day.isCurrentMonth,
              'bg-indigo-50 dark:bg-indigo-900/20': isSameDay(day.date, new Date()) && day.isCurrentMonth
            }"
          >
            <!-- Day number -->
            <div 
              class="text-right text-sm p-1"
              :class="day.isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'"
            >
              {{ day.dayNumber }}
            </div>
            
            <!-- Events in this day -->
            <div class="space-y-1 max-h-24 overflow-y-auto">
              <div 
                v-for="event in day.events.slice(0, 3)" 
                :key="event.id"
                class="px-1 py-0.5 rounded text-xs truncate cursor-pointer"
                :style="{ backgroundColor: event.color + '20', color: event.color }"
                @click="openEditEventModal(event)"
              >
                {{ event.title }}
              </div>
              
              <!-- Show more indicator if needed -->
              <div 
                v-if="day.events.length > 3"
                class="text-xs text-gray-500 dark:text-gray-400 text-center"
              >
                +{{ day.events.length - 3 }} more
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Event Modal -->
    <div 
      v-if="showEventModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 
            v-voix="'event-modal-heading'" 
            class="text-xl font-medium text-gray-900 dark:text-white"
          >
            {{ eventBeingEdited ? 'Edit Event' : 'Create Event' }}
          </h3>
          <button 
            v-voix="'close-event-modal'" 
            hint="Close event modal"
            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            @click="closeEventModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="saveEvent">
            <div class="mb-4">
              <label v-voix="'event-title-label'" for="event-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Title
              </label>
              <input 
                v-voix="'event-title-input'" 
                hint="Enter the title of the event"
                id="event-title"
                type="text" 
                v-model="eventTitleValue"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label v-voix="'event-start-label'" for="event-start" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Time
                </label>
                <input 
                  v-voix="'event-start-input'" 
                  hint="Enter the start time of the event"
                  id="event-start"
                  type="datetime-local" 
                  v-model="eventStartValue"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label v-voix="'event-end-label'" for="event-end" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Time
                </label>
                <input 
                  v-voix="'event-end-input'" 
                  hint="Enter the end time of the event"
                  id="event-end"
                  type="datetime-local" 
                  v-model="eventEndValue"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>
            
            <div class="mb-4">
              <label v-voix="'event-description-label'" for="event-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea 
                v-voix="'event-description-input'" 
                hint="Enter a description for the event"
                id="event-description"
                v-model="eventDescriptionValue"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
            
            <div class="mb-4">
              <label v-voix="'event-location-label'" for="event-location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <div class="flex space-x-2">
                <input 
                  v-voix="'event-location-input'" 
                  hint="Enter the location of the event"
                  id="event-location"
                  type="text" 
                  v-model="eventLocationValue"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  v-voix="'create-video-meeting'"
                  hint="Create a video meeting link"
                  type="button"
                  class="px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm flex items-center"
                  @click="createVideoMeeting"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Video
                </button>
              </div>
            </div>
            
            <div class="mb-4">
              <label v-voix="'event-attendees-label'" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Attendees
              </label>
              <div class="space-y-2">
                <div 
                  v-for="user in calendarStore.users" 
                  :key="user.id"
                  class="flex items-center"
                >
                  <input 
                    :id="`attendee-${user.id}`"
                    type="checkbox" 
                    :value="user.id"
                    v-model="eventAttendeesValue"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label :for="`attendee-${user.id}`" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    {{ user.name }} ({{ user.role }})
                  </label>
                </div>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                All Day Event
              </label>
              <div class="flex items-center">
                <input 
                  v-voix="'all-day-checkbox'" 
                  hint="Mark as an all-day event"
                  id="all-day-event"
                  type="checkbox" 
                  v-model="eventIsAllDayValue"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label for="all-day-event" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  All day
                </label>
              </div>
            </div>
            
            <div v-if="(calendarStore.currentRole === 'admin' || calendarStore.currentRole === 'manager')" class="mb-6">
              <label v-voix="'event-status-label'" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Status
              </label>
              <select 
                v-voix="'event-status-select'" 
                hint="Select the status of the event"
                v-model="eventStatusValue"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending Approval</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div class="mb-6">
              <label v-voix="'event-color-label'" for="event-color" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Color
              </label>
              <div class="flex space-x-2">
                <div 
                  v-for="color in ['#4F46E5', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#6366F1', '#8B5CF6']" 
                  :key="color"
                  class="w-8 h-8 rounded-full cursor-pointer border-2"
                  :class="eventColorValue === color ? 'border-gray-600 dark:border-gray-300' : 'border-transparent'"
                  :style="{ backgroundColor: color }"
                  @click="eventColorValue = color"
                ></div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button 
                v-if="eventBeingEdited && calendarStore.hasEditPermission"
                v-voix="'delete-event-button'" 
                hint="Delete this event"
                type="button"
                class="px-4 py-2 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                @click="deleteEvent"
              >
                Delete
              </button>
              
              <button 
                v-voix="'smart-schedule-button'" 
                hint="Find optimal meeting times"
                type="button"
                class="px-4 py-2 border border-indigo-300 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:border-indigo-700 dark:text-indigo-400 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                @click="openSmartScheduleModal"
              >
                Smart Schedule
              </button>
              
              <button 
                v-voix="'save-event-button'" 
                hint="Save this event"
                type="submit"
                class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Smart Schedule Modal -->
    <div 
      v-if="showScheduleModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 
            v-voix="'smart-schedule-heading'" 
            class="text-xl font-medium text-gray-900 dark:text-white"
          >
            AI-Powered Smart Scheduling
          </h3>
          <button 
            v-voix="'close-schedule-modal'" 
            hint="Close smart schedule modal"
            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            @click="showScheduleModal = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Our AI will analyze calendars, preferences, and availability to suggest optimal meeting times.
          </p>
          
          <button 
            v-voix="'find-optimal-time-button'" 
            hint="Start AI analysis to find optimal meeting times"
            class="w-full mb-6 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center"
            @click="findOptimalTime"
            :disabled="isLoadingTimeSlots"
          >
            <svg v-if="isLoadingTimeSlots" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoadingTimeSlots ? 'Analyzing calendars...' : 'Find Optimal Time' }}
          </button>
          
          <div v-if="availableTimeSlots.length > 0" class="space-y-3">
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">Recommended Time Slots</h4>
            
            <div 
              v-for="(slot, index) in availableTimeSlots" 
              :key="index"
              class="p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"
              @click="selectTimeSlot(slot)"
            >
              <div class="flex items-center">
                <div 
                  class="h-2 w-2 rounded-full mr-2"
                  :class="[
                    index === 0 ? 'bg-green-500' : index === 1 ? 'bg-yellow-500' : 'bg-orange-500'
                  ]"
                ></div>
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ formatTimeSlot(slot) }}
                </div>
              </div>
              
              <div class="mt-1 flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Confidence score: {{ slot.score }}%
                </div>
                <button 
                  class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  @click.stop="selectTimeSlot(slot)"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
          
          <div v-else-if="!isLoadingTimeSlots" class="text-center text-gray-500 dark:text-gray-400 py-4">
            Click "Find Optimal Time" to get AI-suggested meeting slots
          </div>
        </div>
      </div>
    </div>
  </div>
</template>