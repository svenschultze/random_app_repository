<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import WeeklyGrid from '../components/WeeklyGrid.vue';

const router = useRouter();

// Handle a click on a class in the grid
const handleClassClick = (classEvent) => {
  if (classEvent && classEvent.id) {
    router.push(`/event/${classEvent.id}`);
  }
};
</script>

<template>
  <div class="weekly-view">
    <div class="view-header">
      <h2 v-voix="'weekly-timetable-heading'">Weekly Timetable</h2>
    </div>
    
    <div class="content">
      <p class="instructions" v-voix="'weekly-view-instructions'">
        Your weekly schedule is displayed below. Click on any class to view details.
      </p>
      
      <WeeklyGrid @viewClass="handleClassClick" />
    </div>
  </div>
</template>

<style scoped>
.weekly-view {
  max-width: 1200px;
  margin: 0 auto;
}

.view-header {
  margin-bottom: 20px;
}

.view-header h2 {
  color: #4a6fa5;
  margin: 0;
}

.content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.instructions {
  color: #6c757d;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .content {
    padding: 15px;
  }
  
  .view-header h2 {
    font-size: 1.3rem;
  }
}
</style>