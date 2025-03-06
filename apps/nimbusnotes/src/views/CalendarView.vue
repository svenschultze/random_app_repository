<script setup>
import { ref, computed, onMounted } from 'vue'

// Mock data for demo
const allNotes = ref([
  { id: 1, title: 'Project Meeting Notes', content: 'Discussed new features for Q4...', date: '2025-03-05', tags: ['Work', 'Meetings'], pinned: true, folder: 'Work' },
  { id: 2, title: 'Grocery List', content: 'Milk, eggs, bread, fruits...', date: '2025-03-04', tags: ['Personal', 'Shopping'], pinned: true, folder: 'Personal' },
  { id: 3, title: 'Book Recommendations', content: 'Science fiction titles to read next...', date: '2025-03-02', tags: ['Books', 'Personal'], pinned: false, folder: 'Personal' },
  { id: 4, title: 'Fitness Plan', content: 'Monday: upper body, Tuesday: cardio...', date: '2025-02-28', tags: ['Health', 'Personal'], pinned: false, folder: 'Personal' },
  { id: 5, title: 'Travel Ideas', content: 'Potential destinations for summer vacation...', date: '2025-02-25', tags: ['Travel', 'Personal'], pinned: false, folder: 'Personal' },
  { id: 6, title: 'Weekly Team Updates', content: 'Progress on different project milestones...', date: '2025-03-01', tags: ['Work', 'Updates'], pinned: false, folder: 'Work' },
  { id: 7, title: 'Research Notes: AI', content: 'Latest developments in machine learning...', date: '2025-02-20', tags: ['Research', 'Technology'], pinned: false, folder: 'Research' },
  { id: 8, title: 'Birthday Gift Ideas', content: 'Gift options for upcoming celebrations...', date: '2025-02-18', tags: ['Personal', 'Shopping'], pinned: false, folder: 'Personal' },
  // Additional mock entries for calendar demonstration
  { id: 9, title: 'Product Launch Plan', content: 'Steps for upcoming product launch...', date: '2025-03-10', tags: ['Work', 'Planning'], pinned: false, folder: 'Work' },
  { id: 10, title: 'Vacation Checklist', content: 'Things to pack and prepare...', date: '2025-03-15', tags: ['Travel', 'Personal'], pinned: false, folder: 'Personal' },
  { id: 11, title: 'Quarterly Review', content: 'Prepare for quarterly performance review...', date: '2025-03-20', tags: ['Work', 'Meetings'], pinned: false, folder: 'Work' },
  { id: 12, title: 'Home Improvement Ideas', content: 'Renovation plans for the kitchen...', date: '2025-03-08', tags: ['Home', 'Personal'], pinned: false, folder: 'Personal' }
])

// Calendar state
const currentDate = ref(new Date())
const viewMode = ref('month') // 'month', 'week', or 'timeline'
const selectedDate = ref(null)
const dayNotes = ref([])

// Get current year and month
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

// Month navigation
const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

const goToToday = () => {
  currentDate.value = new Date()
  selectedDate.value = null
  dayNotes.value = []
}

// Month name
const monthName = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).toLocaleString('default', { month: 'long' })
})

// Days in month for the calendar grid
const daysInMonth = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  
  // Get first day of month
  const firstDay = new Date(year, month, 1)
  const firstDayIndex = firstDay.getDay() // 0 for Sunday
  
  // Get last day of month
  const lastDay = new Date(year, month + 1, 0)
  const lastDate = lastDay.getDate()
  
  // Get days from previous month to fill the first row
  const prevMonthLastDate = new Date(year, month, 0).getDate()
  const prevMonthDays = []
  
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = prevMonthLastDate - i
    const date = new Date(year, month - 1, day)
    const notesForDay = getNotesForDate(date)
    
    prevMonthDays.push({
      date,
      day,
      currentMonth: false,
      notesCount: notesForDay.length,
      hasNotes: notesForDay.length > 0
    })
  }
  
  // Current month days
  const currentMonthDays = []
  
  for (let i = 1; i <= lastDate; i++) {
    const date = new Date(year, month, i)
    const notesForDay = getNotesForDate(date)
    
    currentMonthDays.push({
      date,
      day: i,
      currentMonth: true,
      notesCount: notesForDay.length,
      hasNotes: notesForDay.length > 0,
      isToday: isToday(date)
    })
  }
  
  // Next month days to fill remaining grid
  const nextMonthDays = []
  const daysNeeded = 42 - (prevMonthDays.length + currentMonthDays.length)
  
  for (let i = 1; i <= daysNeeded; i++) {
    const date = new Date(year, month + 1, i)
    const notesForDay = getNotesForDate(date)
    
    nextMonthDays.push({
      date,
      day: i,
      currentMonth: false,
      notesCount: notesForDay.length,
      hasNotes: notesForDay.length > 0
    })
  }
  
  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
})

// Timeline view data
const timelineNotes = computed(() => {
  // Sort notes by date for timeline view
  return [...allNotes.value].sort((a, b) => new Date(a.date) - new Date(b.date))
})

// Helper functions
const isToday = (date) => {
  const today = new Date()
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear()
}

const getNotesForDate = (date) => {
  const formattedDate = date.toISOString().split('T')[0]
  return allNotes.value.filter(note => note.date === formattedDate)
}

const selectDate = (day) => {
  selectedDate.value = day.date
  dayNotes.value = getNotesForDate(day.date)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date)
}

// On component mount
onMounted(() => {
  viewMode.value = 'month' // Default view
})
</script>

<template>
  <div class="calendar-view-container">
    <h1 class="view-title">Calendar</h1>
    
    <!-- View Switcher and Navigation -->
    <div class="calendar-header">
      <div class="view-switcher">
        <button 
          @click="viewMode = 'month'" 
          :class="{ active: viewMode === 'month' }"
          v-voix="'Month View'"
          hint="Switch to month calendar view">
          Month
        </button>
        <button 
          @click="viewMode = 'timeline'" 
          :class="{ active: viewMode === 'timeline' }"
          v-voix="'Timeline View'"
          hint="Switch to chronological timeline view">
          Timeline
        </button>
      </div>
      
      <div v-if="viewMode === 'month'" class="month-navigation">
        <button 
          @click="prevMonth" 
          class="nav-button"
          v-voix="'Previous Month'"
          hint="Go to previous month">
          &lt;
        </button>
        <h2 class="current-month" v-voix="monthName + ' ' + currentYear">{{ monthName }} {{ currentYear }}</h2>
        <button 
          @click="nextMonth" 
          class="nav-button"
          v-voix="'Next Month'"
          hint="Go to next month">
          &gt;
        </button>
        <button 
          @click="goToToday" 
          class="today-button"
          v-voix="'Go to Today'"
          hint="Return to current month">
          Today
        </button>
      </div>
    </div>
    
    <!-- Month Calendar View -->
    <div v-if="viewMode === 'month'" class="calendar-container">
      <div class="calendar-grid">
        <!-- Weekday Headers -->
        <div class="weekday-header" v-voix="'Sunday'">Sun</div>
        <div class="weekday-header" v-voix="'Monday'">Mon</div>
        <div class="weekday-header" v-voix="'Tuesday'">Tue</div>
        <div class="weekday-header" v-voix="'Wednesday'">Wed</div>
        <div class="weekday-header" v-voix="'Thursday'">Thu</div>
        <div class="weekday-header" v-voix="'Friday'">Fri</div>
        <div class="weekday-header" v-voix="'Saturday'">Sat</div>
        
        <!-- Calendar Cells -->
        <div 
          v-for="(day, index) in daysInMonth" 
          :key="index"
          class="calendar-day"
          :class="{ 
            'other-month': !day.currentMonth, 
            'today': day.isToday,
            'has-notes': day.hasNotes,
            'selected': selectedDate && day.date.toDateString() === selectedDate.toDateString()
          }"
          @click="selectDate(day)"
          v-voix="'Day ' + day.day + (day.hasNotes ? ' with ' + day.notesCount + ' notes' : '')"
          :hint="'Click to view notes for ' + (day.date.toLocaleDateString())">
          <div class="day-number">{{ day.day }}</div>
          <div v-if="day.hasNotes" class="notes-indicator">
            <span class="notes-count">{{ day.notesCount }}</span>
          </div>
        </div>
      </div>
      
      <!-- Selected Day Notes -->
      <div v-if="selectedDate" class="day-notes-panel">
        <h3 class="day-title" v-voix="'Notes for ' + formatDate(selectedDate)">
          Notes for {{ formatDate(selectedDate) }}
        </h3>
        
        <div class="day-notes-list">
          <div 
            v-for="note in dayNotes" 
            :key="note.id"
            class="day-note-item"
            @click="$router.push(`/notes/${note.id}`)"
            v-voix="'Note: ' + note.title"
            hint="Click to open this note">
            <div class="note-title">{{ note.title }}</div>
            <div class="note-tags">
              <span 
                v-for="tag in note.tags" 
                :key="tag" 
                class="note-tag"
                v-voix="'Tag: ' + tag">
                {{ tag }}
              </span>
            </div>
          </div>
          
          <div v-if="dayNotes.length === 0" class="empty-day-notes">
            No notes for this day. 
            <button 
              @click="$router.push('/notes/new')" 
              class="new-note-link"
              v-voix="'Create a new note'"
              hint="Click to create a new note for this date">
              Create a new note?
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Timeline View -->
    <div v-if="viewMode === 'timeline'" class="timeline-container">
      <div class="timeline">
        <div 
          v-for="(note, index) in timelineNotes" 
          :key="note.id"
          class="timeline-item"
          v-voix="'Timeline item: ' + note.title + ' from ' + note.date">
          <!-- Timeline node -->
          <div class="timeline-node">
            <div class="timeline-date" v-voix="note.date">{{ new Date(note.date).toLocaleDateString() }}</div>
            <div class="timeline-connector" v-if="index < timelineNotes.length - 1"></div>
          </div>
          
          <!-- Timeline content -->
          <div 
            class="timeline-content"
            @click="$router.push(`/notes/${note.id}`)"
            v-voix="'Note: ' + note.title"
            hint="Click to open this note">
            <h3 class="timeline-title">{{ note.title }}</h3>
            <p class="timeline-preview">{{ note.content.substring(0, 100) }}{{ note.content.length > 100 ? '...' : '' }}</p>
            <div class="timeline-tags">
              <span 
                v-for="tag in note.tags" 
                :key="tag" 
                class="timeline-tag"
                v-voix="'Tag: ' + tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="timelineNotes.length === 0" class="empty-timeline">
          No notes available for the timeline view.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-view-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.view-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

/* Calendar Header */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-switcher {
  display: flex;
  gap: 0.5rem;
  background-color: var(--color-background-soft);
  padding: 0.25rem;
  border-radius: 8px;
}

.view-switcher button {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: var(--color-text);
}

.view-switcher button.active {
  background-color: var(--color-background);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.month-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-month {
  font-size: 1.2rem;
  margin: 0;
  min-width: 200px;
  text-align: center;
}

.nav-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.nav-button:hover {
  background-color: var(--color-background-soft);
}

.today-button {
  padding: 0.5rem 1rem;
  background-color: var(--color-background-soft);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.today-button:hover {
  background-color: var(--color-background-mute);
}

/* Calendar Grid */
.calendar-container {
  display: grid;
  grid-template-columns: 7fr 3fr;
  gap: 1.5rem;
  align-items: start;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  background-color: var(--color-background-soft);
  padding: 1rem;
  border-radius: 8px;
}

.weekday-header {
  text-align: center;
  font-weight: 600;
  padding: 0.5rem;
  color: var(--color-text-light);
}

.calendar-day {
  height: 100px;
  background-color: var(--color-background);
  border-radius: 4px;
  padding: 0.5rem;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.calendar-day:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.calendar-day.other-month {
  opacity: 0.5;
}

.calendar-day.today {
  border: 2px solid #4169E1;
}

.calendar-day.has-notes {
  background-color: rgba(65, 105, 225, 0.1);
}

.calendar-day.selected {
  background-color: rgba(65, 105, 225, 0.2);
  border: 2px solid #4169E1;
}

.day-number {
  font-weight: 500;
}

.notes-indicator {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background-color: #4169E1;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

/* Day Notes Panel */
.day-notes-panel {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  height: 100%;
}

.day-title {
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-heading);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.day-notes-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 500px;
  overflow-y: auto;
}

.day-note-item {
  background-color: var(--color-background);
  padding: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.day-note-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.note-title {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.note-tag {
  font-size: 0.75rem;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  padding: 0.2rem 0.4rem;
  border-radius: 12px;
}

.empty-day-notes {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
}

.new-note-link {
  background: none;
  border: none;
  color: #4169E1;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
}

/* Timeline View */
.timeline-container {
  padding: 1rem;
}

.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
  display: flex;
}

.timeline-node {
  position: absolute;
  left: -40px;
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-node::before {
  content: "";
  width: 12px;
  height: 12px;
  background-color: #4169E1;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

.timeline-date {
  transform: rotate(-90deg);
  white-space: nowrap;
  font-size: 0.8rem;
  position: absolute;
  top: 35px;
  width: max-content;
  color: var(--color-text-light);
}

.timeline-connector {
  height: 100px;
  width: 2px;
  background-color: var(--color-border);
  position: absolute;
  top: 15px;
}

.timeline-content {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
}

.timeline-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.timeline-title {
  font-size: 1.1rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}

.timeline-preview {
  font-size: 0.9rem;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.timeline-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.timeline-tag {
  font-size: 0.75rem;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  padding: 0.2rem 0.4rem;
  border-radius: 12px;
}

.empty-timeline {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-light);
  background-color: var(--color-background-soft);
  border-radius: 8px;
}

@media (max-width: 768px) {
  .calendar-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .calendar-container {
    grid-template-columns: 1fr;
  }
  
  .calendar-day {
    height: 70px;
  }
  
  .day-notes-panel {
    margin-top: 1.5rem;
  }
  
  .timeline-content {
    margin-left: 0;
  }
}
</style>