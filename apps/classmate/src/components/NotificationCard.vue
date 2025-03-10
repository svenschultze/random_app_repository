<script setup>
import { computed } from 'vue';

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
});

const emits = defineEmits(['markAsRead', 'viewEvent']);

// Generate type-specific styling and icons
const typeInfo = computed(() => {
  switch (props.notification.type) {
    case 'reminder':
      return {
        icon: '⏰',
        color: '#4a6fa5'
      };
    case 'cancellation':
      return {
        icon: '❌',
        color: '#dc3545'
      };
    case 'update':
      return {
        icon: '📝',
        color: '#fd7e14'
      };
    default:
      return {
        icon: '📌',
        color: '#6c757d'
      };
  }
});

// Format timestamp to readable date/time
const formattedTime = computed(() => {
  const date = new Date(props.notification.timestamp);
  return date.toLocaleString();
});

// Compute styles for the notification
const notificationStyle = computed(() => ({
  borderLeftColor: typeInfo.value.color,
  backgroundColor: props.notification.isRead ? '#f8f9fa' : 'white'
}));
</script>

<template>
  <div 
    class="notification-card" 
    :class="{ 'is-read': notification.isRead }"
    :style="notificationStyle"
    v-voix="'notification-' + notification.id"
    :hint="`${notification.title}: ${notification.message}`"
  >
    <div class="notification-icon" :style="{ backgroundColor: typeInfo.color }">
      {{ typeInfo.icon }}
    </div>
    
    <div class="notification-content">
      <h3 class="notification-title">{{ notification.title }}</h3>
      <p class="notification-message">{{ notification.message }}</p>
      <div class="notification-time">{{ formattedTime }}</div>
      
      <div class="notification-actions">
        <button 
          v-if="!notification.isRead" 
          class="mark-read-btn"
          @click="$emit('markAsRead', notification.id)"
          v-voix="'mark-read-' + notification.id"
          hint="Mark this notification as read"
        >
          Mark as Read
        </button>
        
        <button 
          v-if="notification.eventId"
          class="view-event-btn"
          @click="$emit('viewEvent', notification.eventId)"
          v-voix="'view-notif-event-' + notification.id"
          hint="View the related class event"
        >
          View Event
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-card {
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 16px;
  border-left: 4px solid #4a6fa5;
  position: relative;
  transition: all 0.2s;
}

.notification-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.is-read {
  opacity: 0.8;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4a6fa5;
  color: white;
  font-size: 1.2rem;
  margin-right: 16px;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-title {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #212529;
}

.notification-message {
  margin: 0 0 8px 0;
  font-size: 0.95rem;
  color: #495057;
}

.notification-time {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 12px;
}

.notification-actions {
  display: flex;
  gap: 8px;
}

.mark-read-btn, .view-event-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mark-read-btn {
  background-color: #e9ecef;
  color: #495057;
}

.mark-read-btn:hover {
  background-color: #dee2e6;
}

.view-event-btn {
  background-color: #4a6fa5;
  color: white;
}

.view-event-btn:hover {
  background-color: #3a5a84;
}
</style>