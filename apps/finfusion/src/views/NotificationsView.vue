<script setup>
import { ref, onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import CardComponent from '@/components/ui/CardComponent.vue'

const notificationStore = useNotificationStore()
const isLoading = ref(false)

// Initialize data if needed
onMounted(() => {
  isLoading.value = true
  
  if (!notificationStore.isDataLoaded) {
    notificationStore.initializeData()
  }
  
  // Give time for the data to initialize
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})

// Refresh data
const refreshData = () => {
  isLoading.value = true
  notificationStore.refreshData()
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

// Mark all as read
const markAllAsRead = () => {
  notificationStore.markAllAsRead()
}

// Mark individual notification as read
const markAsRead = (id) => {
  notificationStore.markAsRead(id)
}

// Delete notification
const deleteNotification = (id) => {
  notificationStore.deleteNotification(id)
}
</script>

<template>
  <div class="notifications-view" v-voix="'Notifications Page'">
    <div class="page-header">
      <h1 class="page-title">Notifications</h1>
      <div class="header-actions">
        <button 
          @click="markAllAsRead" 
          class="secondary-button"
          v-voix="'Mark All Notifications as Read'"
        >
          Mark All as Read
        </button>
        <button 
          @click="refreshData" 
          class="refresh-button"
          :class="{ 'refreshing': isLoading }"
          v-voix="'Refresh Notifications'"
        >
          <span class="refresh-icon">🔄</span>
          <span class="refresh-text">Refresh</span>
        </button>
      </div>
    </div>
    
    <!-- Urgent Notifications -->
    <CardComponent
      v-if="notificationStore.urgentNotifications.length > 0"
      title="Urgent Notifications"
      :loading="isLoading"
      v-voix="'Urgent Notifications'"
    >
      <div class="notifications-list urgent-notifications">
        <div 
          v-for="notification in notificationStore.urgentNotifications" 
          :key="notification.id" 
          class="notification-item"
          :class="{ 'unread': !notification.isRead }"
          v-voix="notification.title + ' notification'"
          :hint="notification.message + '. Received on ' + notification.formattedDate"
        >
          <div class="notification-icon urgent">
            <span>{{ notification.icon }}</span>
          </div>
          
          <div class="notification-content">
            <div class="notification-header">
              <h4 class="notification-title">{{ notification.title }}</h4>
              <div class="notification-date">{{ notification.formattedDate }}</div>
            </div>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
          
          <div class="notification-actions">
            <button 
              v-if="!notification.isRead" 
              @click.stop="markAsRead(notification.id)" 
              class="action-button"
              v-voix="'Mark as Read'"
            >
              <span class="icon">✓</span>
            </button>
            <button 
              @click.stop="deleteNotification(notification.id)" 
              class="action-button"
              v-voix="'Delete Notification'"
            >
              <span class="icon">×</span>
            </button>
          </div>
        </div>
      </div>
    </CardComponent>
    
    <!-- Today's Notifications -->
    <CardComponent
      v-if="notificationStore.groupedNotifications.today.length > 0"
      title="Today"
      :loading="isLoading"
      v-voix="'Today Notifications'"
    >
      <div class="notifications-list">
        <div 
          v-for="notification in notificationStore.groupedNotifications.today" 
          :key="notification.id" 
          class="notification-item"
          :class="{ 'unread': !notification.isRead }"
          v-voix="notification.title + ' notification'"
          :hint="notification.message + '. Received on ' + notification.formattedDate"
        >
          <div class="notification-icon">
            <span>{{ notification.icon }}</span>
          </div>
          
          <div class="notification-content">
            <div class="notification-header">
              <h4 class="notification-title">{{ notification.title }}</h4>
              <div class="notification-date">{{ notification.formattedDate }}</div>
            </div>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
          
          <div class="notification-actions">
            <button 
              v-if="!notification.isRead" 
              @click.stop="markAsRead(notification.id)" 
              class="action-button"
              v-voix="'Mark as Read'"
            >
              <span class="icon">✓</span>
            </button>
            <button 
              @click.stop="deleteNotification(notification.id)" 
              class="action-button"
              v-voix="'Delete Notification'"
            >
              <span class="icon">×</span>
            </button>
          </div>
        </div>
      </div>
    </CardComponent>
    
    <!-- Yesterday's Notifications -->
    <CardComponent
      v-if="notificationStore.groupedNotifications.yesterday.length > 0"
      title="Yesterday"
      :loading="isLoading"
      v-voix="'Yesterday Notifications'"
    >
      <div class="notifications-list">
        <div 
          v-for="notification in notificationStore.groupedNotifications.yesterday" 
          :key="notification.id" 
          class="notification-item"
          :class="{ 'unread': !notification.isRead }"
          v-voix="notification.title + ' notification'"
          :hint="notification.message + '. Received on ' + notification.formattedDate"
        >
          <div class="notification-icon">
            <span>{{ notification.icon }}</span>
          </div>
          
          <div class="notification-content">
            <div class="notification-header">
              <h4 class="notification-title">{{ notification.title }}</h4>
              <div class="notification-date">{{ notification.formattedDate }}</div>
            </div>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
          
          <div class="notification-actions">
            <button 
              v-if="!notification.isRead" 
              @click.stop="markAsRead(notification.id)" 
              class="action-button"
              v-voix="'Mark as Read'"
            >
              <span class="icon">✓</span>
            </button>
            <button 
              @click.stop="deleteNotification(notification.id)" 
              class="action-button"
              v-voix="'Delete Notification'"
            >
              <span class="icon">×</span>
            </button>
          </div>
        </div>
      </div>
    </CardComponent>
    
    <!-- Older Notifications -->
    <CardComponent
      v-if="notificationStore.groupedNotifications.older.length > 0"
      title="Older"
      :loading="isLoading"
      v-voix="'Older Notifications'"
    >
      <div class="notifications-list">
        <div 
          v-for="notification in notificationStore.groupedNotifications.older" 
          :key="notification.id" 
          class="notification-item"
          :class="{ 'unread': !notification.isRead }"
          v-voix="notification.title + ' notification'"
          :hint="notification.message + '. Received on ' + notification.formattedDate"
        >
          <div class="notification-icon">
            <span>{{ notification.icon }}</span>
          </div>
          
          <div class="notification-content">
            <div class="notification-header">
              <h4 class="notification-title">{{ notification.title }}</h4>
              <div class="notification-date">{{ notification.formattedDate }}</div>
            </div>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
          
          <div class="notification-actions">
            <button 
              v-if="!notification.isRead" 
              @click.stop="markAsRead(notification.id)" 
              class="action-button"
              v-voix="'Mark as Read'"
            >
              <span class="icon">✓</span>
            </button>
            <button 
              @click.stop="deleteNotification(notification.id)" 
              class="action-button"
              v-voix="'Delete Notification'"
            >
              <span class="icon">×</span>
            </button>
          </div>
        </div>
      </div>
    </CardComponent>
  </div>
</template>

<style scoped>
.notifications-view {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.refresh-button {
  display: flex;
  align-items: center;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.secondary-button {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.secondary-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.refresh-icon {
  margin-right: 0.5rem;
}

.refresh-button.refreshing .refresh-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.notifications-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item.unread {
  background-color: rgba(52, 152, 219, 0.05);
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(52, 152, 219, 0.1);
  margin-right: 1rem;
  flex-shrink: 0;
  font-size: 1.25rem;
}

.notification-icon.urgent {
  background-color: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.notification-content {
  flex-grow: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.notification-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.notification-date {
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.7;
}

.notification-message {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.notification-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--text-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.urgent-notifications .notification-item {
  background-color: rgba(231, 76, 60, 0.05);
  border-radius: 8px;
  border-left: 4px solid #e74c3c;
  padding-left: 1rem;
}
</style>