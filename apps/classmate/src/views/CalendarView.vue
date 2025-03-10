<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { sampleClasses } from '../models/class';

const router = useRouter();
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const selectedDate = ref(null);
const events = ref([...sampleClasses]);

// Month names for display
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Format date as YYYY-MM-DD for comparisons
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get days in current month
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

// Get first day of month (0 = Sunday, 1 = Monday, etc.)
const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

// Calculate calendar days including padding days from previous/next months
const calendarDays = computed(() => {
  const days = [];
  
  // Previous month padding days
  const prevMonthDays = firstDayOfMonth.value === 0 ? 6 : firstDayOfMonth.value - 1;
  const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate();
  
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const date = new Date(currentYear.value, currentMonth.value - 1, day);
    days.push({
      day,
      date,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(date)
    });
  }
  
  // Current month days
  const today = new Date();
  for (let day = 1; day <= daysInMonth.value; day++) {
    const date = new Date(currentYear.value, currentMonth.value, day);
    const isToday = 
      date.getDate() === today.getDate() && 
      date.getMonth() === today.getMonth() && 
      date.getFullYear() === today.getFullYear();
    
    days.push({
      day,
      date,
      isCurrentMonth: true,
      isToday,
      events: getEventsForDate(date)
    });
  }
  
  // Next month padding days
  const totalDaysNeeded = Math.ceil((prevMonthDays + daysInMonth.value) / 7) * 7;
  const nextMonthDays = totalDaysNeeded - (prevMonthDays + daysInMonth.value);
  
  for (let day = 1; day <= nextMonthDays; day++) {
    const date = new Date(currentYear.value, currentMonth.value + 1, day);
    days.push({
      day,
      date,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(date)
    });
  }
  
  return days;
});

// Month and year display
const monthYearDisplay = computed(() => {
  return `${monthNames[currentMonth.value]} ${currentYear.value}`;
});

// Get events for a specific date
function getEventsForDate(date) {
  const formatted = formatDate(date);
  return events.value.filter(event => event.date === formatted);
}

// Go to previous month
const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

// Go to next month
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

// Go to today
const goToToday = () => {
  const today = new Date();
  currentMonth.value = today.getMonth();
  currentYear.value = today.getFullYear();
};

// Handle date selection
const selectDate = (day) => {
  selectedDate.value = day.date;
  
  // Navigate to daily view for the selected date
  const formattedDate = formatDate(day.date);
  router.push(`/daily/${formattedDate}`);
};

onMounted(() => {
  // No additional setup needed
});
</script>

<template>
  <div class="calendar-view">
    <div class="view-header">
      <h2 v-voix="'calendar-heading'">Calendar</h2>
    </div>
    
    <div class="calendar-container">
      <div class="calendar-header">
        <button 
          class="nav-btn" 
          @click="previousMonth"
          v-voix="'previous-month-button'"
          hint="Go to previous month"
        >
          ◀
        </button>
        <h3 
          class="month-year" 
          v-voix="'current-month-year'"
        >
          {{ monthYearDisplay }}
        </h3>
        <button 
          class="nav-btn" 
          @click="nextMonth"
          v-voix="'next-month-button'"
          hint="Go to next month"
        >
          ▶
        </button>
      </div>
      
      <div class="today-btn-container">
        <button 
          class="today-btn" 
          @click="goToToday"
          v-voix="'go-to-today-button'"
          hint="Go to current month"
        >
          Today
        </button>
      </div>
      
      <div class="calendar-grid">
        <div class="weekday-header">Mon</div>
        <div class="weekday-header">Tue</div>
        <div class="weekday-header">Wed</div>
        <div class="weekday-header">Thu</div>
        <div class="weekday-header">Fri</div>
        <div class="weekday-header">Sat</div>
        <div class="weekday-header">Sun</div>
        
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index"
          class="calendar-day"
          :class="{
            'other-month': !day.isCurrentMonth,
            'today': day.isToday,
            'has-events': day.events.length > 0
          }"
          @click="selectDate(day)"
          v-voix="'calendar-day-' + formatDate(day.date)"
          :hint="day.events.length > 0 ? `${day.day}, ${day.events.length} events` : `${day.day}, no events`"
        >
          <div class="day-number">{{ day.day }}</div>
          <div v-if="day.events.length > 0" class="event-indicators">
            <span 
              v-for="(event, eventIndex) in day.events.slice(0, 3)" 
              :key="eventIndex" 
              class="event-dot"
              :style="{ backgroundColor: event.color }"
            ></span>
            <span v-if="day.events.length > 3" class="more-events">+{{ day.events.length - 3 }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="selectedDate" class="selected-date-events">
        <h4>Events on {{ selectedDate.toLocaleDateString() }}</h4>
        <div v-if="getEventsForDate(selectedDate).length === 0" class="no-events">
          No events scheduled for this date.
        </div>
        <div 
          v-else 
          v-for="event in getEventsForDate(selectedDate)" 
          :key="event.id" 
          class="event-item"
        >
          <div class="event-time">{{ event.startTime }} - {{ event.endTime }}</div>
          <div class="event-title">{{ event.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-view {
  max-width: 1000px;
  margin: 0 auto;
}

.view-header {
  margin-bottom: 20px;
}

.view-header h2 {
  color: #4a6fa5;
  margin: 0;
}

.calendar-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.month-year {
  margin: 0;
  font-size: 1.3rem;
  color: #212529;
}

.nav-btn {
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background-color: #3a5a84;
}

.today-btn-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.today-btn {
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.today-btn:hover {
  background-color: #3a5a84;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #dee2e6;
  border: 1px solid #dee2e6;
  margin-bottom: 20px;
}

.weekday-header {
  background-color: #f8f9fa;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  color: #495057;
}

.calendar-day {
  background-color: white;
  min-height: 80px;
  padding: 5px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}

.calendar-day:hover {
  background-color: #f8f9fa;
}

.other-month {
  background-color: #f8f9fa;
  color: #adb5bd;
}

.today {
  background-color: #e9ecef;
  font-weight: bold;
}

.today .day-number {
  background-color: #4a6fa5;
  color: white;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-number {
  display: inline-block;
  margin-bottom: 5px;
  width: 25px;
  height: 25px;
  text-align: center;
}

.event-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: 5px;
}

.event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #4a6fa5;
  display: inline-block;
}

.more-events {
  font-size: 0.7rem;
  color: #6c757d;
}

.has-events {
  position: relative;
}

.has-events::after {
  content: "";
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #4a6fa5;
}

.selected-date-events {
  margin-top: 20px;
  border-top: 1px solid #dee2e6;
  padding-top: 20px;
}

.selected-date-events h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #212529;
}

.no-events {
  color: #6c757d;
  font-style: italic;
}

.event-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-left: 3px solid #4a6fa5;
  margin-bottom: 10px;
  background-color: #f8f9fa;
}

.event-time {
  font-size: 0.85rem;
  color: #6c757d;
}

.event-title {
  font-weight: bold;
}

@media (max-width: 768px) {
  .calendar-day {
    min-height: 60px;
    padding: 3px;
  }
  
  .event-dot {
    width: 6px;
    height: 6px;
  }
  
  .day-number {
    font-size: 0.9rem;
    width: 20px;
    height: 20px;
  }
  
  .weekday-header {
    padding: 5px;
    font-size: 0.9rem;
  }
}
</style>