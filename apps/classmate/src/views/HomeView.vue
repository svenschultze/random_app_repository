<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ClassCard from '../components/ClassCard.vue';
import { getClassesForToday, sampleClasses } from '../models/class';
import { getUnreadCount, getAllNotifications } from '../models/notification';

const router = useRouter();
const today = ref(new Date());
const todayClasses = ref([]);
const upcomingEvents = ref([]);
const notificationCount = ref(0);
const recentNotifications = ref([]);

// Format today's date
const formattedDate = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return today.value.toLocaleDateString(undefined, options);
});

// Get day name (Monday, Tuesday, etc.)
const dayName = computed(() => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[today.value.getDay()];
});

// Get upcoming classes and events
const loadData = () => {
  // Get today's classes
  todayClasses.value = getClassesForToday().sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });
  
  // Get a few upcoming classes from other days
  const otherClasses = sampleClasses.filter(c => c.day !== dayName.value);
  upcomingEvents.value = otherClasses.slice(0, 3);
  
  // Get notification count
  notificationCount.value = getUnreadCount();
  
  // Get recent notifications
  recentNotifications.value = getAllNotifications().slice(0, 3);
};

// Navigate to class detail
const viewClassDetails = (classEvent) => {
  router.push(`/event/${classEvent.id}`);
};

// Navigate to notifications
const viewAllNotifications = () => {
  router.push('/notifications');
};

// Navigate to daily view
const viewDailySchedule = () => {
  router.push('/daily');
};

// Navigate to weekly view
const viewWeeklySchedule = () => {
  router.push('/weekly');
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="dashboard">
    <section class="date-header">
      <h2 v-voix="'today-date'">{{ formattedDate }}</h2>
      
      <div class="actions">
        <button 
          class="view-notifications" 
          @click="viewAllNotifications"
          v-voix="'view-notifications-button'"
          hint="View all your notifications"
        >
          <span class="icon">🔔</span>
          <span v-if="notificationCount > 0" class="badge">{{ notificationCount }}</span>
        </button>
      </div>
    </section>
    
    <section class="today-schedule">
      <div class="section-header">
        <h3 v-voix="'todays-schedule-heading'">Today's Schedule</h3>
        <button 
          class="view-all-btn" 
          @click="viewDailySchedule"
          v-voix="'view-daily-schedule-button'"
          hint="View detailed daily schedule"
        >
          View Full Day
        </button>
      </div>
      
      <div v-if="todayClasses.length === 0" class="empty-state">
        <p v-voix="'no-classes-today'">No classes scheduled for today.</p>
      </div>
      
      <div v-else class="class-list">
        <ClassCard 
          v-for="classEvent in todayClasses" 
          :key="classEvent.id" 
          :classEvent="classEvent"
          @view="viewClassDetails(classEvent)"
        />
      </div>
    </section>
    
    <section class="upcoming-events">
      <div class="section-header">
        <h3 v-voix="'upcoming-events-heading'">Upcoming Events</h3>
        <button 
          class="view-all-btn" 
          @click="viewWeeklySchedule"
          v-voix="'view-weekly-schedule-button'"
          hint="View weekly schedule"
        >
          View Week
        </button>
      </div>
      
      <div v-if="upcomingEvents.length === 0" class="empty-state">
        <p v-voix="'no-upcoming-events'">No upcoming events.</p>
      </div>
      
      <div v-else class="event-list">
        <div 
          v-for="event in upcomingEvents" 
          :key="event.id" 
          class="upcoming-event-card"
          v-voix="'upcoming-event-' + event.id"
          :hint="`${event.title} on ${event.day} at ${event.startTime}`"
          @click="viewClassDetails(event)"
        >
          <div class="event-day">{{ event.day }}</div>
          <div class="event-details">
            <div class="event-time">{{ event.startTime }} - {{ event.endTime }}</div>
            <div class="event-title">{{ event.title }}</div>
            <div class="event-location">{{ event.location }}</div>
          </div>
        </div>
      </div>
    </section>
    
    <section v-if="recentNotifications.length > 0" class="recent-notifications">
      <div class="section-header">
        <h3 v-voix="'recent-notifications-heading'">Recent Notifications</h3>
        <button 
          class="view-all-btn" 
          @click="viewAllNotifications"
          v-voix="'view-all-notifications-button'"
          hint="View all notifications"
        >
          View All
        </button>
      </div>
      
      <div class="notification-list">
        <div 
          v-for="notification in recentNotifications" 
          :key="notification.id" 
          class="notification-item"
          v-voix="'dashboard-notification-' + notification.id"
          hint="Recent notification"
          @click="viewAllNotifications"
        >
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
        </div>
      </div>
    </section>
    
    <div class="quick-actions">
      <button 
        class="action-btn" 
        @click="$router.push('/event')"
        v-voix="'add-event-button'"
        hint="Add a new class or event"
      >
        <span class="icon">➕</span>
        <span>Add Event</span>
      </button>
      
      <button 
        class="action-btn" 
        @click="viewWeeklySchedule"
        v-voix="'view-week-button'"
        hint="View weekly timetable"
      >
        <span class="icon">📅</span>
        <span>Weekly View</span>
      </button>
      
      <button 
        class="action-btn" 
        @click="$router.push('/calendar')"
        v-voix="'calendar-button'"
        hint="View monthly calendar"
      >
        <span class="icon">🗓️</span>
        <span>Calendar</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.date-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: #4a6fa5;
}

.actions {
  display: flex;
  gap: 10px;
}

.view-notifications {
  background: none;
  border: none;
  position: relative;
  cursor: pointer;
  padding: 8px;
  font-size: 1.3rem;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #212529;
}

.view-all-btn {
  background: none;
  border: none;
  color: #4a6fa5;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
}

.today-schedule, .upcoming-events, .recent-notifications {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #6c757d;
  font-style: italic;
}

.upcoming-event-card {
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.upcoming-event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.event-day {
  background-color: #4a6fa5;
  color: white;
  border-radius: 4px;
  padding: 8px;
  width: 80px;
  text-align: center;
  font-weight: bold;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-details {
  flex: 1;
}

.event-time {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 4px;
}

.event-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.event-location {
  font-size: 0.9rem;
  color: #6c757d;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification-item {
  background-color: #f8f9fa;
  border-left: 3px solid #4a6fa5;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #e9ecef;
}

.notification-title {
  font-weight: bold;
  margin-bottom: 4px;
  font-size: 0.95rem;
}

.notification-message {
  font-size: 0.85rem;
  color: #6c757d;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 24px;
  margin-bottom: 16px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 30%;
}

.action-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-btn .icon {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .date-header h2 {
    font-size: 1.1rem;
  }
  
  .section-header h3 {
    font-size: 1.1rem;
  }
  
  .event-day {
    width: 70px;
    padding: 6px;
    font-size: 0.9rem;
  }
  
  .action-btn {
    padding: 12px;
  }
  
  .action-btn .icon {
    font-size: 1.3rem;
  }
  
  .action-btn span:not(.icon) {
    font-size: 0.9rem;
  }
}
</style>
