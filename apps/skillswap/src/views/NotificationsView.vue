<script setup>
import { ref, computed } from 'vue';

// Mock notifications data
const notifications = ref([
  {
    id: 1,
    type: 'match',
    title: 'New Skill Match',
    message: 'Elena Rodriguez matched with your JavaScript skill',
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    actionUrl: '/matches'
  },
  {
    id: 2,
    type: 'session',
    title: 'Session Starting Soon',
    message: 'Your Spanish Conversation session with Marcus Chen starts in 15 minutes',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
    actionUrl: '/schedule'
  },
  {
    id: 3,
    type: 'message',
    title: 'New Message',
    message: 'Sarah Johnson sent you a message about your upcoming Yoga session',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: false,
    actionUrl: '/messages'
  },
  {
    id: 4,
    type: 'review',
    title: 'New Review Received',
    message: 'David Kim gave you a 5-star review for your Photography lesson',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    actionUrl: '/profile'
  },
  {
    id: 5,
    type: 'system',
    title: 'Profile Completion',
    message: 'Complete your skill details to improve your matching opportunities',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: false,
    actionUrl: '/profile'
  },
  {
    id: 6,
    type: 'match',
    title: 'New Skill Match',
    message: 'Alex Thompson matched with your Photography skill',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    read: true,
    actionUrl: '/matches'
  },
  {
    id: 7,
    type: 'system',
    title: 'Welcome to SkillSwap',
    message: 'Start your journey by exploring potential skill matches',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    read: true,
    actionUrl: '/matches'
  }
]);

// Filter states
const filterType = ref('all');
const showUnreadOnly = ref(false);

// Filtered notifications based on current filter settings
const filteredNotifications = computed(() => {
  return notifications.value
    .filter(notification => {
      // Filter by type
      if (filterType.value !== 'all' && notification.type !== filterType.value) {
        return false;
      }
      
      // Filter by read status
      if (showUnreadOnly.value && notification.read) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => b.date - a.date); // Sort by date, newest first
});

// Count of unread notifications
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

// Format relative time (e.g., "2 hours ago")
const formatRelativeTime = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  } else {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${month} ${day}`;
  }
};

// Mark a notification as read
const markAsRead = (notificationId) => {
  const notification = notifications.value.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};

// Mark all notifications as read
const markAllAsRead = () => {
  notifications.value.forEach(n => {
    n.read = true;
  });
};

// Toggle filter for unread notifications
const toggleUnreadFilter = () => {
  showUnreadOnly.value = !showUnreadOnly.value;
};

// Set notification type filter
const setTypeFilter = (type) => {
  filterType.value = type;
};

// Function to get icon based on notification type
const getIconClass = (type) => {
  switch (type) {
    case 'match':
      return 'icon-match';
    case 'session':
      return 'icon-session';
    case 'message':
      return 'icon-message';
    case 'review':
      return 'icon-review';
    case 'system':
      return 'icon-system';
    default:
      return 'icon-system';
  }
};
</script>

<template>
  <div class="notifications-container">
    <div class="notifications-header">
      <h1 v-voix="'notifications-title'">Notifications</h1>
      <div class="notification-count" v-if="unreadCount > 0">{{ unreadCount }}</div>
    </div>
    
    <div class="notifications-filters">
      <div class="filter-buttons">
        <button 
          class="filter-button" 
          :class="{ active: filterType === 'all' }"
          @click="setTypeFilter('all')"
        >
          All
        </button>
        <button 
          class="filter-button" 
          :class="{ active: filterType === 'match' }"
          @click="setTypeFilter('match')"
        >
          Matches
        </button>
        <button 
          class="filter-button" 
          :class="{ active: filterType === 'session' }"
          @click="setTypeFilter('session')"
        >
          Sessions
        </button>
        <button 
          class="filter-button" 
          :class="{ active: filterType === 'message' }"
          @click="setTypeFilter('message')"
        >
          Messages
        </button>
        <button 
          class="filter-button" 
          :class="{ active: filterType === 'review' }"
          @click="setTypeFilter('review')"
        >
          Reviews
        </button>
        <button 
          class="filter-button" 
          :class="{ active: filterType === 'system' }"
          @click="setTypeFilter('system')"
        >
          System
        </button>
      </div>
      
      <div class="filter-actions">
        <label class="unread-toggle">
          <input 
            type="checkbox" 
            v-model="showUnreadOnly"
            @change="toggleUnreadFilter"
          >
          <span>Unread only</span>
        </label>
        <button 
          class="read-all-button"
          @click="markAllAsRead"
          :disabled="unreadCount === 0"
        >
          Mark all as read
        </button>
      </div>
    </div>
    
    <div class="notifications-list">
      <div v-if="filteredNotifications.length === 0" class="no-notifications">
        <p>No notifications to display</p>
      </div>
      
      <template v-else>
        <div 
          v-for="notification in filteredNotifications" 
          :key="notification.id" 
          class="notification-item"
          :class="{ 'unread': !notification.read }"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-icon" :class="getIconClass(notification.type)"></div>
          
          <div class="notification-content">
            <div class="notification-header">
              <h3 class="notification-title">{{ notification.title }}</h3>
              <span class="notification-time">{{ formatRelativeTime(notification.date) }}</span>
            </div>
            <p class="notification-message">{{ notification.message }}</p>
            <div class="notification-actions">
              <a :href="notification.actionUrl" class="action-link">View details</a>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.notifications-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.notifications-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.notifications-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.notification-count {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1rem;
  background-color: var(--primary-color, #4a90e2);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 600;
}

.notifications-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-button {
  background-color: transparent;
  color: var(--text-color, #333);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 20px;
  padding: 0.4rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.filter-button.active {
  background-color: var(--primary-color, #4a90e2);
  color: white;
  border-color: var(--primary-color, #4a90e2);
}

.filter-button:hover:not(.active) {
  background-color: var(--background-color-light, #f5f5f5);
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.unread-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-color, #333);
  cursor: pointer;
}

.read-all-button {
  background-color: transparent;
  color: var(--primary-color, #4a90e2);
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
}

.read-all-button:disabled {
  color: var(--text-color-muted, #666);
  cursor: not-allowed;
  text-decoration: none;
}

.notifications-list {
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  overflow: hidden;
}

.no-notifications {
  padding: 2rem;
  text-align: center;
  color: var(--text-color-muted, #666);
  font-style: italic;
}

.notification-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  background-color: white;
  transition: background-color 0.2s;
  cursor: pointer;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: var(--background-color-light, #f5f5f5);
}

.notification-item.unread {
  background-color: var(--background-accent, #f0f7ff);
  border-left: 3px solid var(--primary-color, #4a90e2);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--background-color-light, #f5f5f5);
  margin-right: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

/* Icon placeholders - in a real app these would be SVGs or icon font */
.icon-match::before {
  content: "👥";
}

.icon-session::before {
  content: "📅";
}

.icon-message::before {
  content: "💬";
}

.icon-review::before {
  content: "⭐";
}

.icon-system::before {
  content: "🔔";
}

.notification-content {
  flex: 1;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.notification-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-color, #333);
}

.notification-time {
  font-size: 0.8rem;
  color: var(--text-color-muted, #666);
}

.notification-message {
  margin: 0 0 0.5rem 0;
  color: var(--text-color, #333);
  line-height: 1.4;
}

.notification-actions {
  margin-top: 0.5rem;
}

.action-link {
  color: var(--primary-color, #4a90e2);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.action-link:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .notifications-filters {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-buttons {
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .filter-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>