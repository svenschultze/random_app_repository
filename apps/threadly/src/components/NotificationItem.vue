<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store';
import { getTimeSince } from '../services/mockData';

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const user = computed(() => {
  return store.state.mockData.users.find(u => u.id === props.notification.userId);
});

const formattedTime = computed(() => {
  return getTimeSince(props.notification.timestamp);
});

const typeIcon = computed(() => {
  switch (props.notification.type) {
    case 'like':
      return {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#E0245E" stroke="#E0245E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>`,
        bgColor: 'rgba(224, 36, 94, 0.1)',
        label: 'liked your thread'
      };
    case 'reply':
      return {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#1DA1F2" stroke="#1DA1F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>`,
        bgColor: 'rgba(29, 161, 242, 0.1)',
        label: 'replied to your thread'
      };
    case 'mention':
      return {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#17BF63" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
              </svg>`,
        bgColor: 'rgba(23, 191, 99, 0.1)',
        label: 'mentioned you'
      };
    case 'follow':
      return {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#794BC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>`,
        bgColor: 'rgba(121, 75, 196, 0.1)',
        label: 'started following you'
      };
    default:
      return {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>`,
        bgColor: 'rgba(0, 0, 0, 0.1)',
        label: 'interacted with you'
      };
  }
});

function handleClick() {
  if (props.notification.threadId) {
    router.push({ name: 'thread', params: { id: props.notification.threadId }});
  } else if (props.notification.type === 'follow') {
    router.push({ name: 'profile', params: { id: props.notification.userId }});
  }
}
</script>

<template>
  <div 
    :class="['notification-item', { 'notification-item--unread': !notification.isRead }]" 
    @click="handleClick"
    v-voix="'Notification: ' + user.displayName + ' ' + typeIcon.label"
  >
    <div class="notification-item__icon" :style="{ backgroundColor: typeIcon.bgColor }">
      <div v-html="typeIcon.svg"></div>
    </div>
    
    <div class="notification-item__avatar">
      <img :src="user.avatar" :alt="user.username" v-voix="'User avatar'" />
    </div>
    
    <div class="notification-item__content">
      <div class="notification-item__header">
        <div class="notification-item__user">
          <span class="notification-item__display-name">{{ user.displayName }}</span>
          <span class="notification-item__action">{{ typeIcon.label }}</span>
        </div>
        <span class="notification-item__time">{{ formattedTime }}</span>
      </div>
      
      <div v-if="notification.content" class="notification-item__text">
        {{ notification.content.length > 100 ? notification.content.substring(0, 100) + '...' : notification.content }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.notification-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.notification-item--unread {
  background-color: rgba(29, 161, 242, 0.05);
}

.notification-item--unread:hover {
  background-color: rgba(29, 161, 242, 0.08);
}

.notification-item__icon {
  margin-right: 0.75rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-item__avatar {
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.notification-item__avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.notification-item__content {
  flex-grow: 1;
  overflow: hidden;
}

.notification-item__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.25rem;
}

.notification-item__user {
  font-size: 15px;
}

.notification-item__display-name {
  font-weight: 700;
  margin-right: 0.25rem;
}

.notification-item__action {
  color: var(--color-text);
}

.notification-item__time {
  color: var(--color-text-muted);
  font-size: 14px;
  white-space: nowrap;
  margin-left: 0.5rem;
}

.notification-item__text {
  color: var(--color-text-muted);
  margin-top: 0.25rem;
  overflow-wrap: break-word;
  word-break: break-word;
}
</style>