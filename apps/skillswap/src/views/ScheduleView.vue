<script setup>
import { ref, computed } from 'vue';

// Mock data for calendar events
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();
const currentDate = new Date().getDate();

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const selectedMonth = ref(currentMonth);
const selectedYear = ref(currentYear);

// Mock events data
const events = ref([
  {
    id: 1,
    title: 'Spanish Conversation Practice',
    partner: 'Elena Rodriguez',
    date: new Date(currentYear, currentMonth, currentDate + 2, 14, 30),
    duration: 60,
    type: 'teaching',
    status: 'confirmed'
  },
  {
    id: 2,
    title: 'JavaScript Fundamentals',
    partner: 'Marcus Chen',
    date: new Date(currentYear, currentMonth, currentDate - 1, 10, 0),
    duration: 90,
    type: 'learning',
    status: 'completed'
  },
  {
    id: 3,
    title: 'Beginner Yoga',
    partner: 'Sarah Johnson',
    date: new Date(currentYear, currentMonth, currentDate + 5, 18, 0),
    duration: 45,
    type: 'learning',
    status: 'pending'
  },
  {
    id: 4,
    title: 'Photography Basics',
    partner: 'David Kim',
    date: new Date(currentYear, currentMonth, currentDate + 10, 16, 0),
    duration: 60,
    type: 'teaching',
    status: 'confirmed'
  }
]);

// Get calendar days for current month view
const calendarDays = computed(() => {
  const daysInMonth = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear.value, selectedMonth.value, 1).getDay();
  
  const calendarArray = [];
  
  // Add empty cells for days before the first of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarArray.push({ day: null, date: null, events: [] });
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(selectedYear.value, selectedMonth.value, day);
    const dayEvents = events.value.filter(event => 
      event.date.getDate() === day && 
      event.date.getMonth() === selectedMonth.value &&
      event.date.getFullYear() === selectedYear.value
    );
    
    calendarArray.push({
      day,
      date,
      events: dayEvents,
      isToday: day === currentDate && selectedMonth.value === currentMonth && selectedYear.value === currentYear
    });
  }
  
  return calendarArray;
});

const formattedMonth = computed(() => {
  return `${months[selectedMonth.value]} ${selectedYear.value}`;
});

const goToPreviousMonth = () => {
  if (selectedMonth.value === 0) {
    selectedMonth.value = 11;
    selectedYear.value--;
  } else {
    selectedMonth.value--;
  }
};

const goToNextMonth = () => {
  if (selectedMonth.value === 11) {
    selectedMonth.value = 0;
    selectedYear.value++;
  } else {
    selectedMonth.value++;
  }
};

const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const formatDate = (date) => {
  const day = date.getDate();
  const month = months[date.getMonth()].substring(0, 3);
  return `${month} ${day}`;
};

const upcomingSessions = computed(() => {
  const now = new Date();
  return events.value
    .filter(event => event.date > now && event.status !== 'cancelled')
    .sort((a, b) => a.date - b.date);
});

const pastSessions = computed(() => {
  const now = new Date();
  return events.value
    .filter(event => event.date < now || event.status === 'completed')
    .sort((a, b) => b.date - a.date);
});

const showNewSessionModal = ref(false);

const toggleNewSessionModal = () => {
  showNewSessionModal.value = !showNewSessionModal.value;
};
</script>

<template>
  <div class="schedule-container">
    <div class="schedule-header">
      <h1 v-voix="'schedule-title'">Schedule</h1>
      <button class="primary-button" @click="toggleNewSessionModal">New Session</button>
    </div>

    <div class="schedule-tabs">
      <div class="calendar-view">
        <div class="calendar-header">
          <button class="icon-button" @click="goToPreviousMonth">&lt;</button>
          <h2 v-voix="'calendar-month'">{{ formattedMonth }}</h2>
          <button class="icon-button" @click="goToNextMonth">&gt;</button>
        </div>

        <div class="calendar-grid">
          <div class="calendar-day-header" v-for="day in days" :key="day">{{ day }}</div>
          <div 
            v-for="(cell, index) in calendarDays" 
            :key="index" 
            class="calendar-day" 
            :class="{ 
              'empty-day': !cell.day, 
              'today': cell.isToday,
              'has-events': cell.events && cell.events.length > 0 
            }"
          >
            <div v-if="cell.day" class="day-number">{{ cell.day }}</div>
            <div v-if="cell.events && cell.events.length > 0" class="day-events">
              <div 
                v-for="event in cell.events" 
                :key="event.id" 
                class="day-event"
                :class="{'event-teaching': event.type === 'teaching', 'event-learning': event.type === 'learning'}"
              >
                {{ formatTime(event.date) }} - {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="upcoming-sessions">
      <h2 v-voix="'upcoming-sessions-title'">Upcoming Sessions</h2>
      <div v-if="upcomingSessions.length === 0" class="no-sessions">
        No upcoming sessions scheduled
      </div>
      <div v-else class="sessions-list">
        <div 
          v-for="session in upcomingSessions" 
          :key="session.id" 
          class="session-card"
          :class="{'session-teaching': session.type === 'teaching', 'session-learning': session.type === 'learning'}"
        >
          <div class="session-date">{{ formatDate(session.date) }}</div>
          <div class="session-details">
            <h3>{{ session.title }}</h3>
            <p class="session-time">{{ formatTime(session.date) }} ({{ session.duration }} minutes)</p>
            <p class="session-partner">With {{ session.partner }}</p>
            <div class="session-status" :class="`status-${session.status}`">{{ session.status }}</div>
          </div>
          <div class="session-actions">
            <button class="secondary-button">Join</button>
            <button class="outline-button">Reschedule</button>
          </div>
        </div>
      </div>
    </div>

    <div class="past-sessions">
      <h2 v-voix="'past-sessions-title'">Past Sessions</h2>
      <div v-if="pastSessions.length === 0" class="no-sessions">
        No past sessions
      </div>
      <div v-else class="sessions-list">
        <div 
          v-for="session in pastSessions" 
          :key="session.id" 
          class="session-card past-session"
          :class="{'session-teaching': session.type === 'teaching', 'session-learning': session.type === 'learning'}"
        >
          <div class="session-date">{{ formatDate(session.date) }}</div>
          <div class="session-details">
            <h3>{{ session.title }}</h3>
            <p class="session-time">{{ formatTime(session.date) }} ({{ session.duration }} minutes)</p>
            <p class="session-partner">With {{ session.partner }}</p>
            <div class="session-status status-completed">completed</div>
          </div>
          <div class="session-actions">
            <button class="secondary-button">Review</button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Session Modal - This would be a complete form in a real implementation -->
    <div v-if="showNewSessionModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>Schedule New Session</h2>
          <button class="close-button" @click="toggleNewSessionModal">×</button>
        </div>
        <div class="modal-content">
          <p>Form to schedule a new session would go here</p>
          <div class="modal-actions">
            <button class="outline-button" @click="toggleNewSessionModal">Cancel</button>
            <button class="primary-button" @click="toggleNewSessionModal">Schedule</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.schedule-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.schedule-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--border-color, #e0e0e0);
  margin-bottom: 2rem;
}

.calendar-day-header {
  background-color: var(--background-color-light, #f5f5f5);
  text-align: center;
  padding: 10px;
  font-weight: 600;
  color: var(--text-color-muted, #666);
}

.calendar-day {
  background-color: white;
  min-height: 100px;
  padding: 5px;
  position: relative;
}

.day-number {
  font-weight: 600;
  margin-bottom: 5px;
}

.empty-day {
  background-color: var(--background-color-light, #f5f5f5);
}

.today {
  background-color: var(--background-accent, #f0f7ff);
  border: 2px solid var(--primary-color, #4a90e2);
}

.has-events {
  cursor: pointer;
}

.day-events {
  font-size: 0.8rem;
}

.day-event {
  margin-bottom: 2px;
  padding: 3px 5px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: var(--primary-color-light, #e0f0ff);
  color: var(--primary-color-dark, #0056b3);
}

.event-teaching {
  background-color: var(--success-color-light, #e6fff0);
  color: var(--success-color-dark, #006633);
  border-left: 3px solid var(--success-color, #00cc66);
}

.event-learning {
  background-color: var(--primary-color-light, #e0f0ff);
  color: var(--primary-color-dark, #0056b3);
  border-left: 3px solid var(--primary-color, #4a90e2);
}

.upcoming-sessions, .past-sessions {
  margin-bottom: 2rem;
}

.upcoming-sessions h2, .past-sessions h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.sessions-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
}

.session-card {
  display: flex;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.session-teaching {
  border-left: 4px solid var(--success-color, #00cc66);
}

.session-learning {
  border-left: 4px solid var(--primary-color, #4a90e2);
}

.past-session {
  opacity: 0.8;
}

.session-date {
  background-color: var(--background-color-light, #f5f5f5);
  border-radius: 4px;
  padding: 0.5rem;
  text-align: center;
  font-weight: 600;
  min-width: 70px;
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.session-details {
  flex: 1;
}

.session-details h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.session-time, .session-partner {
  margin: 0.2rem 0;
  color: var(--text-color-muted, #666);
  font-size: 0.9rem;
}

.session-status {
  display: inline-block;
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 0.5rem;
}

.status-confirmed {
  background-color: var(--primary-color-light, #e0f0ff);
  color: var(--primary-color-dark, #0056b3);
}

.status-pending {
  background-color: var(--warning-color-light, #fff8e0);
  color: var(--warning-color-dark, #b3780c);
}

.status-completed {
  background-color: var(--success-color-light, #e6fff0);
  color: var(--success-color-dark, #006633);
}

.session-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  margin-left: 1rem;
}

.no-sessions {
  color: var(--text-color-muted, #666);
  font-style: italic;
  padding: 1rem;
  border: 1px dashed var(--border-color, #e0e0e0);
  border-radius: 8px;
  text-align: center;
}

/* Button styles */
.primary-button {
  background-color: var(--primary-color, #4a90e2);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: var(--primary-color-dark, #0056b3);
}

.secondary-button {
  background-color: var(--success-color, #00cc66);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.secondary-button:hover {
  background-color: var(--success-color-dark, #006633);
}

.outline-button {
  background-color: transparent;
  color: var(--text-color, #333);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.outline-button:hover {
  background-color: var(--background-color-light, #f5f5f5);
}

.icon-button {
  background-color: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-color, #333);
}

.icon-button:hover {
  color: var(--primary-color, #4a90e2);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color-muted, #666);
}

.modal-content {
  padding: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sessions-list {
    grid-template-columns: 1fr;
  }
  
  .calendar-day {
    min-height: 60px;
  }
  
  .day-events {
    display: none;
  }
}
</style>