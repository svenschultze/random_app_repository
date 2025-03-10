<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NotificationCard from '../components/NotificationCard.vue';
import { getAllNotifications, markAsRead, getNotificationById } from '../models/notification';
import { getClassById } from '../models/class';

const router = useRouter();
const notifications = ref([]);
const activeFilter = ref('all');

// Load all notifications
const loadNotifications = () => {
  notifications.value = getAllNotifications();
};

// Mark a notification as read
const handleMarkAsRead = (notificationId) => {
  markAsRead(notificationId);
  
  // Update the notification in our list
  const notification = getNotificationById(notificationId);
  if (notification) {
    notification.isRead = true;
  }
};

// View the event related to a notification
const handleViewEvent = (eventId) => {
  router.push(`/event/${eventId}`);
};

// Filter notifications
const filterNotifications = (filter) => {
  activeFilter.value = filter;
};

// Get filtered notifications based on current filter
const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') {
    return notifications.value;
  } else if (activeFilter.value === 'unread') {
    return notifications.value.filter(n => !n.isRead);
  } else if (activeFilter.value === 'high') {
    return notifications.value.filter(n => n.priority === 'high');
  }
  return notifications.value;
});

// Mark all as read
const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  });
};

onMounted(() => {
  loadNotifications();
});
</script>

<template>
  <div class="notifications-view">
    <div class="view-header">
      <h2 v-voix="'notifications-heading'">Notifications</h2>
      
      <button 
        v-if="notifications.some(n => !n.isRead)" 
        class="mark-all-read-btn"
        @click="markAllAsRead"
        v-voix="'mark-all-as-read-button'"
        hint="Mark all notifications as read"
      >
        Mark All as Read
      </button>
    </div>
    
    <div class="filters">
      <button 
        :class="['filter-btn', { active: activeFilter === 'all' }]" 
        @click="filterNotifications('all')"
        v-voix="'all-notifications-filter'"
        hint="Show all notifications"
      >
        All
      </button>
      <button 
        :class="['filter-btn', { active: activeFilter === 'unread' }]" 
        @click="filterNotifications('unread')"
        v-voix="'unread-notifications-filter'"
        hint="Show only unread notifications"
      >
        Unread
      </button>
      <button 
        :class="['filter-btn', { active: activeFilter === 'high' }]" 
        @click="filterNotifications('high')"
        v-voix="'high-priority-filter'"
        hint="Show only high priority notifications"
      >
        High Priority
      </button>
    </div>
    
    <div class="notifications-list">
      <div v-if="filteredNotifications.length === 0" class="empty-state">
        <p v-voix="'no-notifications'">No notifications to display.</p>
      </div>
      
      <template v-else>
        <NotificationCard 
          v-for="notification in filteredNotifications" 
          :key="notification.id" 
          :notification="notification"
          @markAsRead="handleMarkAsRead"
          @viewEvent="handleViewEvent"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.notifications-view {
  max-width: 800px;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-header h2 {
  color: #4a6fa5;
  margin: 0;
}

.mark-all-read-btn {
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mark-all-read-btn:hover {
  background-color: #3a5a84;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-btn {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background-color: #e9ecef;
}

.filter-btn.active {
  background-color: #4a6fa5;
  color: white;
  border-color: #4a6fa5;
}

.notifications-list {
  margin-top: 20px;
}

.empty-state {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .filters {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 5px;
  }
  
  .filter-btn {
    white-space: nowrap;
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}
</style>