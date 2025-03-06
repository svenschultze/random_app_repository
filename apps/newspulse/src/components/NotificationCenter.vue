<script setup>
import { ref, computed, onMounted } from 'vue'

// Mock data for notifications
const notifications = ref([
  {
    id: 1,
    type: 'breaking',
    title: 'Breaking News',
    message: 'Major policy change announced by government officials',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    action: {
      text: 'Read more',
      url: '#'
    }
  },
  {
    id: 2,
    type: 'app',
    title: 'App Update',
    message: 'NewsPulse v2.1 is now available with improved features',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: true,
    action: {
      text: 'Update now',
      url: '#'
    }
  },
  {
    id: 3,
    type: 'personal',
    title: 'Personalized Alert',
    message: 'New article matching your interests: "Tech industry trends 2025"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: false,
    action: null
  },
  {
    id: 4,
    type: 'breaking',
    title: 'Breaking News',
    message: 'Election results officially announced',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    action: {
      text: 'View results',
      url: '#'
    }
  }
])

const isOpen = ref(false)
const notificationPanelRef = ref(null)
const bellIconRef = ref(null)
const hasNewNotification = ref(false)

// Computed properties
const unreadCount = computed(() => {
  return notifications.value.filter(notification => !notification.read).length
})

const sortedNotifications = computed(() => {
  return [...notifications.value].sort((a, b) => b.timestamp - a.timestamp)
})

// Methods
const toggleNotifications = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    hasNewNotification.value = false
  }
}

const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

const getTypeIcon = (type) => {
  switch (type) {
    case 'breaking':
      return 'flash_on'
    case 'app':
      return 'notifications'
    case 'personal':
      return 'person'
    default:
      return 'info'
  }
}

const getTypeClass = (type) => {
  return `notification-${type}`
}

const formatTimestamp = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp

  // Less than a minute
  if (diff < 60 * 1000) {
    return 'Just now'
  }
  // Less than an hour
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000))
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  }
  // Less than a day
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  }
  // Less than a week
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }
  
  // Format date as MM/DD/YYYY
  return timestamp.toLocaleDateString()
}

// Close notifications panel when clicking outside
const handleClickOutside = (event) => {
  if (
    isOpen.value &&
    notificationPanelRef.value &&
    !notificationPanelRef.value.contains(event.target) &&
    bellIconRef.value &&
    !bellIconRef.value.contains(event.target)
  ) {
    isOpen.value = false
  }
}

// Setup event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Simulate receiving a new notification after 10 seconds
  setTimeout(() => {
    const newNotification = {
      id: Date.now(),
      type: 'breaking',
      title: 'New Breaking News',
      message: 'This is a simulated new notification that arrived while you were using the app',
      timestamp: new Date(),
      read: false,
      action: {
        text: 'View details',
        url: '#'
      }
    }
    
    notifications.value.unshift(newNotification)
    hasNewNotification.value = true
  }, 10000)
})
</script>

<template>
  <div class="notification-center">
    <!-- Notification Bell Icon -->
    <div 
      ref="bellIconRef"
      class="notification-bell" 
      @click="toggleNotifications"
      :class="{ 'has-new': hasNewNotification }"
      v-voix="'Notifications bell. ' + unreadCount + ' unread notifications'"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      role="button"
      tabindex="0"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
      <span 
        v-if="unreadCount > 0" 
        class="notification-badge"
        aria-hidden="true"
      >
        {{ unreadCount }}
      </span>
    </div>

    <!-- Notification Panel -->
    <div 
      v-show="isOpen" 
      ref="notificationPanelRef"
      class="notification-panel"
      role="menu"
      aria-label="Notifications"
    >
      <div class="notification-header">
        <h3 v-voix="'Notifications panel'">Notifications</h3>
        <button 
          v-if="unreadCount > 0"
          @click="markAllAsRead" 
          class="mark-all-read"
          v-voix="'Mark all as read button'"
        >
          Mark all as read
        </button>
      </div>

      <!-- Notification List -->
      <div class="notification-list" v-if="sortedNotifications.length > 0">
        <div 
          v-for="notification in sortedNotifications" 
          :key="notification.id"
          class="notification-item"
          :class="[
            getTypeClass(notification.type), 
            { 'unread': !notification.read }
          ]"
          v-voix="notification.title + ', ' + notification.message + ', ' + (notification.read ? 'Read' : 'Unread')"
        >
          <div class="notification-icon">
            <svg v-if="notification.type === 'breaking'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            <svg v-else-if="notification.type === 'app'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <svg v-else-if="notification.type === 'personal'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </div>
          <div class="notification-content">
            <div class="notification-title">
              {{ notification.title }}
              <span v-if="!notification.read" class="unread-indicator"></span>
            </div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-footer">
              <span class="notification-time">{{ formatTimestamp(notification.timestamp) }}</span>
              <a 
                v-if="notification.action" 
                :href="notification.action.url" 
                class="notification-action"
              >
                {{ notification.action.text }}
              </a>
              <button 
                v-if="!notification.read" 
                @click="markAsRead(notification.id)" 
                class="mark-read-btn"
                v-voix="'Mark as read button'"
              >
                Mark as read
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="notification-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path><path d="M18 8a6 6 0 0 0-9.33-5"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
        <p>No notifications yet</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-center {
  position: relative;
}

.notification-bell {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--background-color-soft, rgba(235, 235, 235, 0.6));
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.notification-bell:hover {
  transform: scale(1.05);
}

.notification-bell.has-new {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(44, 62, 80, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(44, 62, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(44, 62, 80, 0);
  }
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--accent-color, #e74c3c);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: badgeFadeIn 0.3s ease-out;
}

@keyframes badgeFadeIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.notification-panel {
  position: fixed;
  top: calc(1rem + 50px);
  right: 1rem;
  width: 350px;
  max-width: calc(100vw - 2rem);
  max-height: 80vh;
  background-color: var(--background-color-alt, #fff);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 99;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notification-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, #e1e8ed);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.mark-all-read {
  background: none;
  border: none;
  color: var(--primary-color, #3498db);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.mark-all-read:hover {
  background-color: var(--background-color, #f8f9fa);
}

.notification-list {
  overflow-y: auto;
  max-height: calc(80vh - 60px);
}

.notification-item {
  padding: 1rem;
  display: flex;
  border-bottom: 1px solid var(--border-color, #e1e8ed);
  transition: background-color 0.2s ease;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.notification-item:hover {
  background-color: var(--background-color, #f8f9fa);
}

.notification-item.unread {
  background-color: rgba(52, 152, 219, 0.05);
}

.notification-icon {
  margin-right: 0.75rem;
  display: flex;
  align-items: flex-start;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.unread-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--accent-color, #e74c3c);
  margin-left: 0.5rem;
}

.notification-message {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  color: var(--text-color, #333);
}

.notification-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.notification-time {
  color: var(--text-color-light, #666);
}

.notification-action {
  color: var(--primary-color, #3498db);
  text-decoration: none;
  font-weight: 500;
}

.notification-action:hover {
  text-decoration: underline;
}

.mark-read-btn {
  background: none;
  border: none;
  font-size: 0.85rem;
  color: var(--text-color-light, #666);
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.mark-read-btn:hover {
  background-color: var(--background-color, #f8f9fa);
  color: var(--text-color, #333);
}

.notification-empty {
  padding: 3rem 1rem;
  text-align: center;
  color: var(--text-color-light, #666);
}

.notification-empty svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Notification type styling */
.notification-breaking .notification-icon svg {
  stroke: var(--accent-color, #e74c3c);
}

.notification-app .notification-icon svg {
  stroke: var(--text-color, #333);
}

.notification-personal .notification-icon svg {
  stroke: var(--secondary-color, #2ecc71);
}

/* Mobile responsive design */
@media (max-width: 480px) {
  .notification-panel {
    width: calc(100vw - 2rem);
    right: 1rem;
    max-height: 70vh;
  }
  
  .notification-bell {
    width: 36px;
    height: 36px;
  }
  
  .notification-badge {
    width: 18px;
    height: 18px;
    font-size: 10px;
  }
}
</style>