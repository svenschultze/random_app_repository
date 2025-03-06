<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import NotificationItem from '../components/NotificationItem.vue';
import store from '../store';

const router = useRouter();

const notifications = computed(() => {
  return store.state.mockData.notifications;
});

const isLoading = computed(() => store.state.isRefreshing);

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.isRead).length;
});

function markAllAsRead() {
  store.markAllNotificationsAsRead();
}

function goBack() {
  router.go(-1);
}
</script>

<template>
  <AppLayout>
    <div class="notifications-view">
      <div class="notifications-view__header">
        <h1 v-voix="'Notifications'">Notifications</h1>
        <button 
          v-if="unreadCount > 0" 
          class="notifications-view__mark-read-btn" 
          @click="markAllAsRead"
          v-voix="'Mark all as read'"
        >
          Mark all as read
        </button>
      </div>
      
      <div v-if="isLoading" class="notifications-view__loading">
        <div class="notifications-view__loading-spinner"></div>
        <p>Loading notifications...</p>
      </div>
      
      <div v-else-if="notifications.length === 0" class="notifications-view__empty">
        <p>No notifications yet</p>
      </div>
      
      <div v-else class="notifications-view__list">
        <NotificationItem 
          v-for="notification in notifications" 
          :key="notification.id" 
          :notification="notification" 
        />
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.notifications-view {
  width: 100%;
}

.notifications-view__header {
  position: sticky;
  top: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notifications-view__header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.notifications-view__mark-read-btn {
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: #1da1f2;
  border: 1px solid #1da1f2;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notifications-view__mark-read-btn:hover {
  background-color: rgba(29, 161, 242, 0.1);
}

.notifications-view__loading,
.notifications-view__empty {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

.notifications-view__loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(29, 161, 242, 0.2);
  border-radius: 50%;
  border-top-color: #1da1f2;
  margin: 0 auto 1rem;
  animation: spinner 1s linear infinite;
}

@keyframes spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* For dark mode */
:root[data-theme="dark"] .notifications-view__header {
  background-color: rgba(21, 32, 43, 0.9);
}
</style>