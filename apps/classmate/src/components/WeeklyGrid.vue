<script setup>
import { computed } from 'vue';
import { getClassesForDay } from '../models/class';

// Time slots from 8am to 8pm
const timeSlots = [
  '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

// Days of the week
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Emit events
const emit = defineEmits(['viewClass']);

// Get all classes for each day
const classMap = computed(() => {
  const map = {};
  
  days.forEach(day => {
    map[day] = getClassesForDay(day);
  });
  
  return map;
});

// Check if a time slot has a class for a specific day
const getClassForTimeSlot = (day, timeSlot) => {
  const classes = classMap.value[day] || [];
  return classes.find(c => {
    const startHour = parseInt(c.startTime.split(':')[0]);
    const endHour = parseInt(c.endTime.split(':')[0]);
    const slotHour = parseInt(timeSlot.split(':')[0]);
    
    return slotHour >= startHour && slotHour < endHour;
  });
};

// Generate a unique ID for a cell
const generateCellId = (day, timeSlot) => {
  return `grid-cell-${day}-${timeSlot}`;
};
</script>

<template>
  <div class="weekly-grid-container">
    <table class="weekly-grid">
      <thead>
        <tr>
          <th class="time-header">Time</th>
          <th v-for="day in days" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="time in timeSlots" :key="time">
          <td class="time-cell">{{ time }}</td>
          <td 
            v-for="day in days" 
            :key="`${day}-${time}`"
            :class="{ 'has-class': getClassForTimeSlot(day, time) }"
            v-voix="generateCellId(day, time)"
            :hint="getClassForTimeSlot(day, time) ? `${getClassForTimeSlot(day, time).title} at ${time}` : `No class at ${time} on ${day}`"
          >
            <div 
              v-if="getClassForTimeSlot(day, time)" 
              class="class-cell"
              :class="{ 
                'cancelled': getClassForTimeSlot(day, time).isCancelled,
                'special': getClassForTimeSlot(day, time).isSpecialEvent
              }"
              :style="{ backgroundColor: getClassForTimeSlot(day, time).color }"
              @click="emit('viewClass', getClassForTimeSlot(day, time))"
            >
              <div class="class-cell-content">
                <div class="class-code">{{ getClassForTimeSlot(day, time).subject }}</div>
                <div class="class-title">{{ getClassForTimeSlot(day, time).title }}</div>
                <div class="class-location">{{ getClassForTimeSlot(day, time).location }}</div>
                <div v-if="getClassForTimeSlot(day, time).isCancelled" class="cancelled-badge">
                  CANCELLED
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.weekly-grid-container {
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;
}

.weekly-grid {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #dee2e6;
  table-layout: fixed;
}

.weekly-grid th, .weekly-grid td {
  border: 1px solid #dee2e6;
  padding: 10px;
  text-align: center;
  position: relative;
}

.time-header, .time-cell {
  width: 80px;
  background-color: #f8f9fa;
  font-weight: bold;
}

thead th {
  background-color: #4a6fa5;
  color: white;
  padding: 12px;
}

.has-class {
  background-color: #f8f9fa;
}

.class-cell {
  height: 100%;
  width: 100%;
  border-radius: 4px;
  color: white;
  padding: 6px;
  cursor: pointer;
  transition: transform 0.2s;
  overflow: hidden;
}

.class-cell:hover {
  transform: scale(1.05);
}

.class-cell-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.class-code {
  font-weight: bold;
  font-size: 0.9rem;
}

.class-title {
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.class-location {
  font-size: 0.8rem;
  opacity: 0.9;
}

.cancelled-badge {
  background-color: rgba(220, 53, 69, 0.8);
  color: white;
  font-size: 0.75rem;
  padding: 2px 4px;
  border-radius: 2px;
  margin-top: 2px;
  font-weight: bold;
}

.cancelled {
  opacity: 0.5;
}

@media (max-width: 768px) {
  .weekly-grid th, .weekly-grid td {
    padding: 6px;
    font-size: 0.9rem;
  }
  
  .time-header, .time-cell {
    width: 60px;
  }
  
  .class-code {
    font-size: 0.8rem;
  }
  
  .class-title, .class-location {
    font-size: 0.75rem;
  }
}
</style>