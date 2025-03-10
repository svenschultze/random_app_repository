<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ClassCard from '../components/ClassCard.vue';
import { getClassesForDay, getClassesForDate } from '../models/class';

const router = useRouter();
const route = useRoute();
const selectedDate = ref(new Date());
const classes = ref([]);

// Format date for display
const formattedDate = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return selectedDate.value.toLocaleDateString(undefined, options);
});

// Get the day name from the date
const dayName = computed(() => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[selectedDate.value.getDay()];
});

// Format date for input field
const dateInputValue = computed(() => {
  const year = selectedDate.value.getFullYear();
  const month = String(selectedDate.value.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDate.value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

// Load classes for the selected date
const loadClasses = () => {
  // For simplicity in this demo, we'll get classes based on the day of week
  classes.value = getClassesForDay(dayName.value).sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );
};

// Change the selected date
const changeDate = (event) => {
  selectedDate.value = new Date(event.target.value);
  loadClasses();
};

// Navigate to previous day
const previousDay = () => {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() - 1);
  selectedDate.value = newDate;
  loadClasses();
};

// Navigate to next day
const nextDay = () => {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() + 1);
  selectedDate.value = newDate;
  loadClasses();
};

// Go to today
const goToToday = () => {
  selectedDate.value = new Date();
  loadClasses();
};

// View class details
const viewClassDetails = (classEvent) => {
  router.push(`/event/${classEvent.id}`);
};

onMounted(() => {
  // Check if date is provided in route params
  if (route.params.date) {
    selectedDate.value = new Date(route.params.date);
  }
  
  loadClasses();
});
</script>

<template>
  <div class="daily-view">
    <div class="date-navigation">
      <button 
        class="nav-btn" 
        @click="previousDay"
        v-voix="'previous-day-button'"
        hint="Go to previous day"
      >
        ◀
      </button>
      
      <div class="date-selector">
        <h2 class="date-display" v-voix="'selected-date'">{{ formattedDate }}</h2>
        <input 
          type="date" 
          :value="dateInputValue" 
          @change="changeDate" 
          class="date-input"
          v-voix="'date-picker'"
          hint="Choose a date to view schedule"
        />
      </div>
      
      <button 
        class="nav-btn" 
        @click="nextDay"
        v-voix="'next-day-button'"
        hint="Go to next day"
      >
        ▶
      </button>
    </div>
    
    <div class="today-btn-container">
      <button 
        class="today-btn" 
        @click="goToToday"
        v-voix="'go-to-today-button'"
        hint="View today's schedule"
      >
        Today
      </button>
    </div>
    
    <div class="timeline">
      <div class="time-column">
        <div class="time-slot" v-for="hour in 13" :key="hour">
          {{ (hour + 7) }}:00
        </div>
      </div>
      
      <div class="events-column">
        <div v-if="classes.length === 0" class="empty-state">
          <p v-voix="'no-classes-this-day'">No classes scheduled for this day.</p>
        </div>
        
        <template v-else>
          <ClassCard 
            v-for="classEvent in classes" 
            :key="classEvent.id" 
            :classEvent="classEvent"
            @view="viewClassDetails(classEvent)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.daily-view {
  max-width: 800px;
  margin: 0 auto;
}

.date-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.nav-btn {
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background-color: #3a5a84;
}

.date-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-display {
  margin: 0 0 8px 0;
  color: #4a6fa5;
  font-size: 1.3rem;
}

.date-input {
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
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

.timeline {
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.time-column {
  width: 80px;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  padding: 20px 0;
}

.time-slot {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #6c757d;
  border-bottom: 1px dashed #dee2e6;
}

.events-column {
  flex: 1;
  padding: 20px;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #6c757d;
  font-style: italic;
}

@media (max-width: 768px) {
  .date-display {
    font-size: 1.1rem;
  }
  
  .time-column {
    width: 60px;
  }
  
  .time-slot {
    height: 50px;
    font-size: 0.8rem;
  }
  
  .events-column {
    padding: 15px;
  }
}
</style>