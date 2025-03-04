<script setup>
import { ref, computed, onMounted } from 'vue'

// Current date
const currentDate = ref(new Date())

// Month names
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Days in calendar view
const calendarDays = ref([])

// Selected date for log
const selectedDate = ref(new Date())

// Format date as YYYY-MM-DD for internal use
const formatDateYMD = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Sample log entries
const logEntries = ref({
  // Sample entries for the past few days
  '2025-03-03': {
    reflection: 'Had a productive meeting with the design team about the new product features. Everyone liked my wireframe concepts.',
    achievements: [
      { id: 1, title: 'Presented wireframes to team', category: 'Presentation' },
      { id: 2, title: 'Received positive feedback from PM', category: 'Recognition' }
    ],
    mood: 'happy',
    challenges: 'Struggled with time management due to multiple meetings',
    productivity: 4
  },
  '2025-03-02': {
    reflection: 'Spent most of the day working on design concepts. Made good progress but still need refinement.',
    achievements: [
      { id: 1, title: 'Completed initial wireframes', category: 'Design' }
    ],
    mood: 'neutral',
    challenges: 'Felt stuck on a particular user flow problem',
    productivity: 3
  },
  '2025-03-01': {
    reflection: 'Research day. Read several articles about the latest UX trends and took detailed notes.',
    achievements: [
      { id: 1, title: 'Compiled research findings document', category: 'Research' }
    ],
    mood: 'happy',
    challenges: 'None significant today',
    productivity: 4
  }
})

// Current log form
const currentLog = ref({
  reflection: '',
  achievements: [],
  mood: 'neutral',
  challenges: '',
  productivity: 3
})

// New achievement for form
const newAchievement = ref({
  title: '',
  category: ''
})

// Achievement categories
const achievementCategories = [
  'Design', 'Development', 'Research', 'Presentation', 
  'Learning', 'Networking', 'Mentoring', 'Recognition'
]

// Mood options
const moods = [
  { value: 'happy', label: 'Productive & Happy', emoji: '😀' },
  { value: 'neutral', label: 'Average Day', emoji: '😐' },
  { value: 'tired', label: 'Tired but Made Progress', emoji: '😴' },
  { value: 'frustrated', label: 'Frustrated', emoji: '😣' },
  { value: 'inspired', label: 'Inspired & Creative', emoji: '🤩' }
]

// Productivity levels
const productivityLevels = [
  { value: 1, label: 'Very Low' },
  { value: 2, label: 'Below Average' },
  { value: 3, label: 'Average' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Exceptional' }
]

// Format date for display
const formattedDate = computed(() => {
  return selectedDate.value.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

// Check if the selected date has a log
const hasLogForSelectedDate = computed(() => {
  const dateKey = formatDateYMD(selectedDate.value)
  return logEntries.value[dateKey] !== undefined
})

// Get log for selected date
const getLogForSelectedDate = () => {
  const dateKey = formatDateYMD(selectedDate.value)
  if (logEntries.value[dateKey]) {
    currentLog.value = { ...logEntries.value[dateKey] }
  } else {
    // Reset form for new entry
    currentLog.value = {
      reflection: '',
      achievements: [],
      mood: 'neutral',
      challenges: '',
      productivity: 3
    }
  }
}

// Build the calendar days array
const buildCalendar = () => {
  calendarDays.value = []
  
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // First day of the month
  const firstDay = new Date(year, month, 1)
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0)
  
  // Start from the previous month if needed to fill the first week
  let day = new Date(firstDay)
  day.setDate(day.getDate() - day.getDay())
  
  // Create 42 days (6 weeks) to ensure consistent calendar size
  for (let i = 0; i < 42; i++) {
    const formattedDate = formatDateYMD(day)
    calendarDays.value.push({
      date: new Date(day),
      isCurrentMonth: day.getMonth() === month,
      hasLog: logEntries.value[formattedDate] !== undefined,
      isToday: formattedDate === formatDateYMD(new Date()),
      mood: logEntries.value[formattedDate]?.mood || null
    })
    day.setDate(day.getDate() + 1)
  }
}

// Navigate to previous month
const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
  buildCalendar()
}

// Navigate to next month
const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
  buildCalendar()
}

// Select a date from the calendar
const selectDate = (date) => {
  selectedDate.value = new Date(date)
  getLogForSelectedDate()
}

// Add new achievement to form
const addAchievement = () => {
  if (newAchievement.value.title && newAchievement.value.category) {
    currentLog.value.achievements.push({
      id: Date.now(), // Use timestamp as unique ID
      title: newAchievement.value.title,
      category: newAchievement.value.category
    })
    newAchievement.value = { title: '', category: '' }
  }
}

// Remove achievement from form
const removeAchievement = (index) => {
  currentLog.value.achievements.splice(index, 1)
}

// Save current log
const saveLog = () => {
  if (currentLog.value.reflection) {
    const dateKey = formatDateYMD(selectedDate.value)
    logEntries.value[dateKey] = { ...currentLog.value }
    buildCalendar() // Refresh calendar to show new log indicators
  }
}

// Format month and year for display
const formattedMonthYear = computed(() => {
  return `${months[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
})

// Get day of month
const getDayOfMonth = (date) => {
  return date.getDate()
}

// Get emotion emoji for mood
const getMoodEmoji = (mood) => {
  return moods.find(m => m.value === mood)?.emoji || '😐'
}

onMounted(() => {
  buildCalendar()
  getLogForSelectedDate()
})
</script>

<template>
  <div class="daily-log-container">
    <div class="daily-log-header">
      <h1 v-voix="'Daily Log Title'">Daily Career Journal</h1>
      <p class="subheading">Track your professional progress and reflections</p>
    </div>

    <div class="log-content">
      <!-- Calendar Section -->
      <div class="calendar-section">
        <div class="calendar-header">
          <button 
            class="btn-icon" 
            @click="previousMonth"
            v-voix="'Previous Month Button'"
            hint="Navigate to the previous month"
          >
            &lt;
          </button>
          <h2 v-voix="'Calendar Month And Year'">{{ formattedMonthYear }}</h2>
          <button 
            class="btn-icon" 
            @click="nextMonth"
            v-voix="'Next Month Button'"
            hint="Navigate to the next month"
          >
            &gt;
          </button>
        </div>
        
        <div class="calendar">
          <div class="calendar-days-header">
            <div class="calendar-day-name">Sun</div>
            <div class="calendar-day-name">Mon</div>
            <div class="calendar-day-name">Tue</div>
            <div class="calendar-day-name">Wed</div>
            <div class="calendar-day-name">Thu</div>
            <div class="calendar-day-name">Fri</div>
            <div class="calendar-day-name">Sat</div>
          </div>
          
          <div class="calendar-grid">
            <div 
              v-for="(day, index) in calendarDays" 
              :key="index" 
              class="calendar-day" 
              :class="{
                'current-month': day.isCurrentMonth,
                'has-log': day.hasLog,
                'is-today': day.isToday,
                'is-selected': formatDateYMD(day.date) === formatDateYMD(selectedDate)
              }"
              @click="selectDate(day.date)"
              v-voix="`Select Date ${day.date.toLocaleDateString()}`"
              :hint="`View or create log for ${day.date.toLocaleDateString()}`"
            >
              <div class="day-number">{{ getDayOfMonth(day.date) }}</div>
              <div v-if="day.hasLog" class="mood-indicator">
                {{ getMoodEmoji(day.mood) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Log Entry Form -->
      <div class="log-form-section">
        <div class="log-date">
          <h2 v-voix="'Log Date'">{{ formattedDate }}</h2>
          <div 
            class="log-status" 
            v-if="hasLogForSelectedDate"
            v-voix="'Log Status'"
          >
            Entry exists
          </div>
        </div>
        
        <div class="form-group">
          <label for="reflection" v-voix="'Daily Reflection Label'">Daily Reflection</label>
          <textarea 
            id="reflection" 
            v-model="currentLog.reflection" 
            rows="4"
            placeholder="What did you accomplish today? What did you learn?"
            v-voix="'Daily Reflection Input Field'"
            hint="Write about your professional accomplishments, learnings, and experiences for the day"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label v-voix="'Achievements Label'">Achievements</label>
          
          <ul class="achievements-list">
            <li 
              v-for="(achievement, index) in currentLog.achievements" 
              :key="achievement.id"
              class="achievement-item"
            >
              <div class="achievement-details">
                <div class="achievement-title">{{ achievement.title }}</div>
                <div class="achievement-category">{{ achievement.category }}</div>
              </div>
              <button 
                class="btn-icon delete-btn"
                @click="removeAchievement(index)"
                v-voix="`Remove Achievement ${index + 1}`"
                :hint="`Remove the achievement '${achievement.title}'`"
              >
                ×
              </button>
            </li>
          </ul>
          
          <div class="add-achievement-form">
            <div class="achievement-inputs">
              <input 
                type="text" 
                v-model="newAchievement.title" 
                placeholder="Achievement title"
                v-voix="'Achievement Title Input Field'"
                hint="Enter a title for your achievement"
              />
              <select 
                v-model="newAchievement.category"
                v-voix="'Achievement Category Dropdown'"
                hint="Select a category for your achievement"
              >
                <option value="" disabled>Select category</option>
                <option v-for="category in achievementCategories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            <button 
              class="btn-secondary add-btn"
              @click="addAchievement"
              v-voix="'Add Achievement Button'"
              hint="Add this achievement to your daily log"
            >
              Add
            </button>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="mood" v-voix="'Mood Label'">Professional Mood</label>
            <select 
              id="mood" 
              v-model="currentLog.mood"
              v-voix="'Mood Selection Dropdown'"
              hint="Select how you felt professionally today"
            >
              <option v-for="mood in moods" :key="mood.value" :value="mood.value">
                {{ mood.emoji }} {{ mood.label }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="productivity" v-voix="'Productivity Label'">Productivity Level</label>
            <select 
              id="productivity" 
              v-model="currentLog.productivity"
              v-voix="'Productivity Level Dropdown'"
              hint="Rate your productivity level for the day"
            >
              <option v-for="level in productivityLevels" :key="level.value" :value="level.value">
                {{ level.label }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="challenges" v-voix="'Challenges Label'">Challenges Faced</label>
          <textarea 
            id="challenges" 
            v-model="currentLog.challenges" 
            rows="3"
            placeholder="What difficulties did you encounter? How did you address them?"
            v-voix="'Challenges Input Field'"
            hint="Describe any professional challenges you faced today and how you dealt with them"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button 
            class="btn-primary save-btn"
            @click="saveLog"
            v-voix="'Save Log Button'"
            hint="Save this daily log entry"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.daily-log-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.daily-log-header {
  margin-bottom: 2rem;
  text-align: center;
}

.daily-log-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.subheading {
  color: #666;
  margin: 0;
}

.log-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.calendar-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.calendar-header h2 {
  font-size: 1.3rem;
  margin: 0;
  color: #2c3e50;
}

.calendar-days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 0.5rem;
}

.calendar-day-name {
  text-align: center;
  font-weight: 600;
  font-size: 0.8rem;
  color: #666;
  padding: 0.5rem 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-day {
  aspect-ratio: 1/1;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  background-color: #f5f7fa;
  transition: background-color 0.2s;
}

.calendar-day:hover {
  background-color: #e8f4f0;
}

.calendar-day.current-month {
  color: #333;
}

.calendar-day:not(.current-month) {
  color: #bbb;
  background-color: #f5f5f5;
}

.calendar-day.has-log {
  font-weight: 600;
}

.calendar-day.is-today {
  border: 2px solid #42b983;
}

.calendar-day.is-selected {
  background-color: #42b983;
  color: white;
}

.day-number {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.mood-indicator {
  font-size: 0.9rem;
}

.log-form-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.log-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.log-date h2 {
  font-size: 1.3rem;
  margin: 0;
  color: #2c3e50;
}

.log-status {
  background-color: #e8f4f0;
  color: #42b983;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.achievements-list {
  padding: 0;
  margin: 0 0 1rem 0;
  list-style-type: none;
}

.achievement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.achievement-details {
  flex: 1;
}

.achievement-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.achievement-category {
  font-size: 0.8rem;
  color: #666;
}

.add-achievement-form {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.achievement-inputs {
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 0.5rem;
}

.add-btn {
  white-space: nowrap;
}

.delete-btn {
  color: #e74c3c;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: #f5f5f5;
}

.btn-primary {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 2rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #3aa876;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

@media (max-width: 768px) {
  .log-content {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .achievement-inputs {
    grid-template-columns: 1fr;
  }
  
  .add-achievement-form {
    flex-direction: column;
  }
  
  .add-btn {
    width: 100%;
  }
}
</style>