<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store';
import { getTimeSince } from '../services/mockData';

const props = defineProps({
  thread: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();

const user = computed(() => {
  return store.state.mockData.users.find(u => u.id === props.thread.userId);
});

const formattedTime = computed(() => {
  return getTimeSince(props.thread.timestamp);
});

const goToThread = () => {
  router.push({ name: 'thread', params: { id: props.thread.id }});
};

const goToProfile = (event) => {
  event.stopPropagation();
  router.push({ name: 'profile', params: { id: props.thread.userId }});
};

const handleLike = (event) => {
  event.stopPropagation();
  store.toggleLike(props.thread.id);
};

const replyToThread = (event) => {
  event.stopPropagation();
  router.push({ 
    name: 'thread', 
    params: { id: props.thread.id },
    query: { reply: 'true' }
  });
};
</script>

<template>
  <div 
    :class="['thread-item', { 'thread-item--compact': compact }]" 
    @click="goToThread"
    v-voix="'Thread by ' + user.username"
    :hint="thread.content.substring(0, 50) + '...'"
  >
    <div class="thread-item__avatar" @click.stop="goToProfile">
      <img :src="user.avatar" :alt="user.username" v-voix="'Profile of ' + user.username"/>
    </div>
    
    <div class="thread-item__content">
      <div class="thread-item__header">
        <div class="thread-item__user" @click.stop="goToProfile">
          <span class="thread-item__display-name">{{ user.displayName }}</span>
          <span class="thread-item__username">@{{ user.username }}</span>
        </div>
        <span class="thread-item__time">· {{ formattedTime }}</span>
      </div>
      
      <div class="thread-item__text">
        {{ thread.content }}
      </div>
      
      <div v-if="thread.hasMedia" class="thread-item__media">
        <img :src="thread.mediaUrl" alt="Thread media" v-voix="'Thread image'"/>
      </div>
      
      <div class="thread-item__actions">
        <button 
          class="thread-item__action-btn thread-item__reply-btn" 
          @click="replyToThread"
          v-voix="'Reply to thread'"
          aria-label="Reply"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span v-if="thread.replyCount > 0" class="thread-item__action-count">{{ thread.replyCount }}</span>
        </button>
        
        <button 
          :class="['thread-item__action-btn thread-item__like-btn', { 'thread-item__like-btn--active': thread.isLiked }]" 
          @click="handleLike"
          v-voix="thread.isLiked ? 'Unlike thread' : 'Like thread'"
          aria-label="Like"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span class="thread-item__action-count">{{ thread.likes }}</span>
        </button>
        
        <button 
          class="thread-item__action-btn thread-item__share-btn" 
          @click.stop
          v-voix="'Share thread'"
          aria-label="Share"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thread-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color 0.2s;
}

.thread-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.thread-item--compact {
  padding: 0.75rem 1rem;
}

.thread-item__avatar {
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.thread-item__avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.thread-item--compact .thread-item__avatar img {
  width: 40px;
  height: 40px;
}

.thread-item__content {
  flex-grow: 1;
  overflow: hidden;
}

.thread-item__header {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
}

.thread-item__user {
  display: flex;
  align-items: center;
  font-size: 15px;
  overflow: hidden;
}

.thread-item__display-name {
  font-weight: 700;
  margin-right: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.thread-item__username, .thread-item__time {
  color: var(--color-text-muted);
  white-space: nowrap;
}

.thread-item__text {
  margin-bottom: 0.5rem;
  overflow-wrap: break-word;
  word-break: break-word;
}

.thread-item--compact .thread-item__text {
  max-height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.thread-item__media {
  margin-bottom: 0.75rem;
  border-radius: 16px;
  overflow: hidden;
}

.thread-item__media img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
}

.thread-item__actions {
  display: flex;
  justify-content: space-between;
  max-width: 300px;
}

.thread-item__action-btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50px;
  transition: all 0.2s;
}

.thread-item__action-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.thread-item__like-btn--active {
  color: #e0245e;
}

.thread-item__like-btn--active svg {
  fill: #e0245e;
}

.thread-item__action-count {
  margin-left: 0.25rem;
  font-size: 13px;
}
</style>