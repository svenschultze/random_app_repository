<script setup>
import { ref, onMounted, computed } from 'vue'
import CardComponent from '@/components/CardComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import moment from 'moment'

// Current date and navigation
const currentMonth = ref(moment().month())
const currentYear = ref(moment().year())

// Mock event data
const events = ref([
  { 
    id: 1, 
    title: 'Team Meeting', 
    start: '2025-03-05T10:00:00', 
    end: '2025-03-05T11:00:00', 
    type: 'meeting', 
    location: 'Conference Room A',
    description: 'Weekly team sync to discuss project progress and upcoming deliverables'
  },
  { 
    id: 2, 
    title: 'Client Presentation', 
    start: '2025-03-07T14:00:00', 
    end: '2025-03-07T15:30:00', 
    type: 'meeting', 
    location: 'Main Conference Room',
    description: 'Present quarterly marketing results to ABC Corp.'
  },
  { 
    id: 3, 
    title: 'Morning Shift', 
    start: '2025-03-06T08:00:00', 
    end: '2025-03-06T12:00:00', 
    type: 'shift', 
    location: 'Main Office',
    description: 'Regular morning shift'
  },
  { 
    id: 4, 
    title: 'Afternoon Shift', 
    start: '2025-03-06T13:00:00', 
    end: '2025-03-06T17:00:00', 
    type: 'shift', 
    location: 'Main Office',
    description: 'Regular afternoon shift'
  },
  { 
    id: 5, 
    title: 'Project Deadline: Website Redesign', 
    start: '2025-03-15T00:00:00', 
    end: '2025-03-15T23:59:59', 
    type: 'deadline', 
    location: null,
    description: 'Final deliverables due for the website redesign project'
  },
  { 
    id: 6, 
    title: 'Team Building', 
    start: '2025-03-20T13:00:00', 
    end: '2025-03-20T17:00:00', 
    type: 'event', 
    location: 'City Park',
    description: 'Quarterly team building activity'
  },
  { 
    id: 7, 
    title: 'Budget Planning', 
    start: '2025-03-12T09:00:00', 
    end: '2025-03-12T11:00:00', 
    type: 'meeting', 
    location: 'Finance Department',
    description: 'Q2 budget planning session'
  },
  { 
    id: 8, 
    title: 'All Hands Meeting', 
    start: '2025-03-28T15:00:00', 
    end: '2025-03-28T16:00:00', 
    type: 'meeting', 
    location: 'Main Hall',
    description: 'Monthly all hands company meeting'
  }
])

// Calendar state
const calendarDays = ref([])
const selectedDate = ref(moment().format('YYYY-MM-DD'))
const selectedEvent = ref(null)
const showEventDetail = ref(false)
const showNewEventForm = ref(false)

// New event form
const newEvent = ref({
  title: '',
  start: '',
  end: '',
  type: 'meeting',
  location: '',
  description: ''
})

// Navigate to previous month
const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  generateCalendarDays()
}

// Navigate to next month
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  generateCalendarDays()
}

// Navigate to current month
const goToToday = () => {
  currentMonth.value = moment().month()
  currentYear.value = moment().year()
  selectedDate.value = moment().format('YYYY-MM-DD')
  generateCalendarDays()
}

// Format the month and year for display
const formattedMonth = computed(() => {
  return moment().month(currentMonth.value).year(currentYear.value).format('MMMM YYYY')
})

// Generate calendar days for the current month
const generateCalendarDays = () => {
  const days = []
  const firstDay = moment().year(currentYear.value).month(currentMonth.value).startOf('month')
  const lastDay = moment().year(currentYear.value).month(currentMonth.value).endOf('month')
  
  // Get the first day of the week of the first day of the month
  const firstDayOfWeek = firstDay.day()
  
  // Add days from previous month to fill the first week if needed
  const prevMonthLastDay = moment(firstDay).subtract(1, 'day')
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = moment(prevMonthLastDay).subtract(i, 'days')
    days.push({
      date: day.format('YYYY-MM-DD'),
      day: day.date(),
      isCurrentMonth: false,
      isToday: day.isSame(moment(), 'day'),
      events: getDayEvents(day.format('YYYY-MM-DD'))
    })
  }
  
  // Add days of current month
  for (let i = 0; i < lastDay.date(); i++) {
    const day = moment(firstDay).add(i, 'days')
    days.push({
      date: day.format('YYYY-MM-DD'),
      day: day.date(),
      isCurrentMonth: true,
      isToday: day.isSame(moment(), 'day'),
      events: getDayEvents(day.format('YYYY-MM-DD'))
    })
  }
  
  // Add days from next month to complete the last week if needed
  const lastDayOfWeek = lastDay.day()
  if (lastDayOfWeek < 6) {
    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
      const day = moment(lastDay).add(i, 'days')
      days.push({
        date: day.format('YYYY-MM-DD'),
        day: day.date(),
        isCurrentMonth: false,
        isToday: day.isSame(moment(), 'day'),
        events: getDayEvents(day.format('YYYY-MM-DD'))
      })
    }
  }
  
  calendarDays.value = days
}

// Get events for a specific day
const getDayEvents = (date) => {
  return events.value.filter(event => {
    const eventStart = moment(event.start).format('YYYY-MM-DD')
    const eventEnd = moment(event.end).format('YYYY-MM-DD')
    
    return eventStart <= date && eventEnd >= date
  })
}

// Select a date
const selectDate = (date) => {
  selectedDate.value = date
}

// View event details
const viewEventDetails = (event) => {
  selectedEvent.value = event
  showEventDetail.value = true
}

// Open new event form
const openNewEventForm = () => {
  // Set default start time to selected date at 9 AM
  const defaultStart = moment(selectedDate.value).hour(9).minute(0).second(0).format('YYYY-MM-DDTHH:mm')
  // Set default end time to 1 hour after start
  const defaultEnd = moment(selectedDate.value).hour(10).minute(0).second(0).format('YYYY-MM-DDTHH:mm')
  
  newEvent.value = {
    title: '',
    start: defaultStart,
    end: defaultEnd,
    type: 'meeting',
    location: '',
    description: ''
  }
  
  showNewEventForm.value = true
}

// Create new event
const createEvent = () => {
  if (newEvent.value.title.trim() === '' || !newEvent.value.start || !newEvent.value.end) {
    return
  }
  
  const event = {
    id: events.value.length + 1,
    ...newEvent.value
  }
  
  events.value.push(event)
  
  // Reset form and refresh calendar
  newEvent.value = {
    title: '',
    start: '',
    end: '',
    type: 'meeting',
    location: '',
    description: ''
  }
  
  showNewEventForm.value = false
  generateCalendarDays()
}

// Format time for display
const formatTime = (dateTime) => {
  return moment(dateTime).format('h:mm A')
}

// Format date for display
const formatDate = (dateTime) => {
  return moment(dateTime).format('MMM D, YYYY')
}

// Format date range for display
const formatDateRange = (start, end) => {
  const startDate = moment(start).format('MMM D')
  const endDate = moment(end).format('MMM D')
  const startTime = moment(start).format('h:mm A')
  const endTime = moment(end).format('h:mm A')
  
  if (moment(start).isSame(end, 'day')) {
    return `${startDate}, ${startTime} - ${endTime}`
  } else {
    return `${startDate}, ${startTime} - ${endDate}, ${endTime}`
  }
}

// Get event type class
const getEventTypeClass = (type) => {
  return {
    'meeting': 'event-meeting',
    'shift': 'event-shift',
    'deadline': 'event-deadline',
    'event': 'event-special'
  }[type] || 'event-default'
}

// Get events for selected date
const eventsForSelectedDate = computed(() => {
  return events.value.filter(event => {
    const eventStart = moment(event.start).format('YYYY-MM-DD')
    const eventEnd = moment(event.end).format('YYYY-MM-DD')
    
    return eventStart <= selectedDate.value && eventEnd >= selectedDate.value
  }).sort((a, b) => {
    return moment(a.start).valueOf() - moment(b.start).valueOf()
  })
})

onMounted(() => {
  generateCalendarDays()
})
</script>

<template>
  <div class="schedule-view">
    <div class="page-header">
      <h1 class="page-title">Schedule</h1>
      <ButtonComponent 
        @click="openNewEventForm" 
        variant="primary"
        v-voix="'create-event-button'"
        hint="Create a new event"
      >
        Create Event
      </ButtonComponent>
    </div>

    <CardComponent title="Calendar">
      <div class="calendar-controls">
        <div class="calendar-navigation">
          <ButtonComponent 
            @click="previousMonth" 
            variant="secondary" 
            size="small"
            v-voix="'previous-month-button'"
            hint="View previous month"
          >
            &larr; Previous
          </ButtonComponent>
          <h3 class="month-title">{{ formattedMonth }}</h3>
          <ButtonComponent 
            @click="nextMonth" 
            variant="secondary" 
            size="small"
            v-voix="'next-month-button'"
            hint="View next month"
          >
            Next &rarr;
          </ButtonComponent>
        </div>
        <ButtonComponent 
          @click="goToToday" 
          variant="info" 
          size="small"
          v-voix="'today-button'"
          hint="Go to today"
        >
          Today
        </ButtonComponent>
      </div>

      <div class="calendar">
        <div class="calendar-header">
          <div class="calendar-day-name">Sun</div>
          <div class="calendar-day-name">Mon</div>
          <div class="calendar-day-name">Tue</div>
          <div class="calendar-day-name">Wed</div>
          <div class="calendar-day-name">Thu</div>
          <div class="calendar-day-name">Fri</div>
          <div class="calendar-day-name">Sat</div>
        </div>
        <div class="calendar-body">
          <div 
            v-for="day in calendarDays" 
            :key="day.date" 
            class="calendar-day" 
            :class="{ 
              'other-month': !day.isCurrentMonth, 
              'today': day.isToday,
              'selected': day.date === selectedDate 
            }"
            @click="selectDate(day.date)"
          >
            <div class="calendar-date">{{ day.day }}</div>
            <div class="day-events">
              <div 
                v-for="(event, index) in day.events.slice(0, 3)" 
                :key="`${day.date}-${event.id}`"
                :class="['day-event', getEventTypeClass(event.type)]"
                @click.stop="viewEventDetails(event)"
                v-voix="'event-' + event.id"
                :hint="`Event: ${event.title} at ${formatTime(event.start)}`"
              >
                {{ event.title }}
              </div>
              <div v-if="day.events.length > 3" class="more-events">
                +{{ day.events.length - 3 }} more
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardComponent>

    <CardComponent :title="`Events for ${formatDate(selectedDate)}`">
      <div v-if="eventsForSelectedDate.length === 0" class="no-events">
        No events scheduled for this date.
      </div>
      <ul v-else class="day-event-list">
        <li 
          v-for="event in eventsForSelectedDate" 
          :key="event.id" 
          class="day-event-item"
          @click="viewEventDetails(event)"
        >
          <div class="event-time">{{ formatTime(event.start) }} - {{ formatTime(event.end) }}</div>
          <div class="event-details">
            <h4 class="event-title">{{ event.title }}</h4>
            <div v-if="event.location" class="event-location">{{ event.location }}</div>
            <div :class="['event-type-badge', getEventTypeClass(event.type)]">{{ event.type }}</div>
          </div>
        </li>
      </ul>
    </CardComponent>

    <!-- Event Detail Modal -->
    <div class="modal" v-if="showEventDetail && selectedEvent">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Event Details</h2>
          <button 
            class="modal-close" 
            @click="showEventDetail = false"
            v-voix="'close-event-details'"
            hint="Close event details"
          >
            &times;
          </button>
        </div>
        <div class="modal-body">
          <div class="event-detail">
            <h3 class="event-detail-title">{{ selectedEvent.title }}</h3>
            <div :class="['event-type-badge', getEventTypeClass(selectedEvent.type)]">
              {{ selectedEvent.type }}
            </div>
            
            <div class="event-detail-meta">
              <div class="meta-item">
                <span class="meta-label">When:</span>
                <span>{{ formatDateRange(selectedEvent.start, selectedEvent.end) }}</span>
              </div>
              <div class="meta-item" v-if="selectedEvent.location">
                <span class="meta-label">Where:</span>
                <span>{{ selectedEvent.location }}</span>
              </div>
            </div>
            
            <div class="event-detail-description">
              <h4>Description</h4>
              <p>{{ selectedEvent.description || 'No description provided.' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Event Modal -->
    <div class="modal" v-if="showNewEventForm">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Create New Event</h2>
          <button 
            class="modal-close" 
            @click="showNewEventForm = false"
            v-voix="'close-new-event-form'"
            hint="Close new event form"
          >
            &times;
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createEvent">
            <div class="form-group">
              <label for="event-title">Title</label>
              <input 
                type="text" 
                id="event-title" 
                v-model="newEvent.title" 
                required
                v-voix="'event-title-input'"
                hint="Enter the event title"
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="event-start">Start Time</label>
                <input 
                  type="datetime-local" 
                  id="event-start" 
                  v-model="newEvent.start" 
                  required
                  v-voix="'event-start-input'"
                  hint="Select the event start time"
                />
              </div>
              <div class="form-group">
                <label for="event-end">End Time</label>
                <input 
                  type="datetime-local" 
                  id="event-end" 
                  v-model="newEvent.end" 
                  required
                  v-voix="'event-end-input'"
                  hint="Select the event end time"
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="event-type">Event Type</label>
                <select 
                  id="event-type" 
                  v-model="newEvent.type"
                  v-voix="'event-type-input'"
                  hint="Select the event type"
                >
                  <option value="meeting">Meeting</option>
                  <option value="shift">Shift</option>
                  <option value="deadline">Deadline</option>
                  <option value="event">Special Event</option>
                </select>
              </div>
              <div class="form-group">
                <label for="event-location">Location</label>
                <input 
                  type="text" 
                  id="event-location" 
                  v-model="newEvent.location"
                  v-voix="'event-location-input'"
                  hint="Enter the event location"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="event-description">Description</label>
              <textarea 
                id="event-description" 
                v-model="newEvent.description"
                rows="4"
                v-voix="'event-description-input'"
                hint="Enter the event description"
              ></textarea>
            </div>
            
            <div class="form-actions">
              <ButtonComponent 
                variant="secondary" 
                @click="showNewEventForm = false"
                type="button"
                v-voix="'cancel-event-creation'"
                hint="Cancel event creation"
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent 
                variant="primary" 
                type="submit"
                v-voix="'submit-new-event'"
                hint="Create the new event"
              >
                Create Event
              </ButtonComponent>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.schedule-view {
  margin: 0 auto;
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  margin: 0;
  font-weight: 600;
}

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.month-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.calendar {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f8f9fa;
  border-bottom: 1px solid var(--border-color);
}

.calendar-day-name {
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(100px, auto);
}

.calendar-day {
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 0.5rem;
  position: relative;
  min-height: 120px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.calendar-day:nth-child(7n) {
  border-right: none;
}

.calendar-day:hover {
  background-color: rgba(52, 152, 219, 0.05);
}

.other-month {
  background-color: #f8f9fa;
  color: #aaa;
}

.today {
  background-color: rgba(52, 152, 219, 0.1);
}

.selected {
  background-color: rgba(52, 152, 219, 0.2);
}

.calendar-date {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.day-event {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.event-meeting {
  background-color: #e3f2fd;
  color: #1976d2;
}

.event-shift {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.event-deadline {
  background-color: #ffebee;
  color: #c62828;
}

.event-special {
  background-color: #fff8e1;
  color: #f57f17;
}

.event-default {
  background-color: #f5f5f5;
  color: #616161;
}

.more-events {
  font-size: 0.75rem;
  text-align: center;
  color: #666;
  margin-top: 0.25rem;
}

.no-events {
  text-align: center;
  padding: 2rem 0;
  color: #666;
  font-style: italic;
}

.day-event-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.day-event-item {
  display: flex;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.day-event-item:last-child {
  border-bottom: none;
}

.day-event-item:hover {
  background-color: rgba(52, 152, 219, 0.05);
}

.event-time {
  min-width: 150px;
  font-weight: 500;
}

.event-details {
  flex: 1;
}

.event-title {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 500;
}

.event-location {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.event-type-badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 1.5rem;
}

/* Form styles */
.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Event detail styles */
.event-detail-title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.event-detail-meta {
  margin: 1.5rem 0;
}

.meta-item {
  margin-bottom: 0.5rem;
}

.meta-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.event-detail-description {
  margin-top: 1.5rem;
}

.event-detail-description h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
  
  .calendar-day {
    min-height: 80px;
  }
}
</style>