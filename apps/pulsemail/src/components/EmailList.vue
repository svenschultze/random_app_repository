<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEmailStore } from '@/stores/emailStore';

// Props
const props = defineProps({
  emailGroups: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['email-selected', 'refresh', 'compose']);

const router = useRouter();
const emailStore = useEmailStore();

// Touch handling for swipe gestures
const touchStart = ref({ x: 0, y: 0 });
const touchEnd = ref({ x: 0, y: 0 });
const swipeThreshold = 50;
const verticalThreshold = 30;
let pullStartY = 0;
let pullMoveY = 0;
const maxPullDistance = 80;
const isPulling = ref(false);
const pullDistance = ref(0);
const isRefreshing = ref(false);

const handleTouchStart = (event, emailType) => {
  if (emailType === 'container') {
    // For pull-to-refresh
    pullStartY = event.touches[0].clientY;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop <= 0) {
      isPulling.value = true;
    }
  } else {
    // For swipe actions
    touchStart.value = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }
};

const handleTouchMove = (event, emailType) => {
  if (emailType === 'container' && isPulling.value) {
    // For pull-to-refresh
    pullMoveY = event.touches[0].clientY;
    pullDistance.value = Math.min(maxPullDistance, Math.max(0, pullMoveY - pullStartY));
    if (pullDistance.value > 0) {
      event.preventDefault();
    }
  } else if (emailType !== 'container') {
    // Prevent default only for horizontal swipes on emails
    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;
    const diffX = touchStart.value.x - currentX;
    const diffY = Math.abs(touchStart.value.y - currentY);
    
    // If horizontal swipe and not scrolling vertically
    if (Math.abs(diffX) > 10 && diffY < 30) {
      event.preventDefault();
    }
  }
};

const handleTouchEnd = (event, emailId, emailType) => {
  if (emailType === 'container' && isPulling.value) {
    // For pull-to-refresh
    isPulling.value = false;
    if (pullDistance.value >= maxPullDistance / 2) {
      refreshList();
    }
    pullDistance.value = 0;
  } else if (emailType !== 'container') {
    // For swipe actions
    touchEnd.value = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY
    };
    
    const diffX = touchStart.value.x - touchEnd.value.x;
    const diffY = Math.abs(touchStart.value.y - touchEnd.value.y);
    
    // Ensure the swipe is horizontal (not a scroll)
    if (Math.abs(diffX) > swipeThreshold && diffY < verticalThreshold) {
      if (diffX > 0) {
        // Swipe left - archive
        handleArchive(emailId);
      } else {
        // Swipe right - mark as read/unread
        handleToggleRead(emailId);
      }
    }
  }
};

// Email actions
const handleArchive = (emailId) => {
  emailStore.deleteEmail(emailId);
};

const handleToggleRead = (emailId) => {
  const email = emailStore.allEmails.value.find(email => email.id === emailId);
  if (email) {
    if (email.read) {
      emailStore.markAsUnread(emailId);
    } else {
      emailStore.markAsRead(emailId);
    }
  }
};

const handleEmailClick = (emailId) => {
  if (emailId) {
    console.log('EmailList - Email clicked:', emailId);
    // First select the email in the store
    emailStore.selectEmail(emailId);
    // Then emit the event to navigate
    emit('email-selected', emailId);
    
    // As a backup, directly navigate if needed
    // This is a fallback in case the emit doesn't work
    if (window.location.pathname !== `/email/${emailId}`) {
      setTimeout(() => {
        if (window.location.pathname !== `/email/${emailId}`) {
          console.log('Fallback navigation to email detail');
          router.push({ path: `/email/${emailId}` });
        }
      }, 100);
    }
  }
};

const refreshList = () => {
  isRefreshing.value = true;
  emit('refresh');
  setTimeout(() => {
    isRefreshing.value = false;
  }, 1500);
};

const openComposeEmail = () => {
  emit('compose');
};

const formatTime = (timestamp) => {
  return emailStore.formatDate(timestamp);
};
</script>

<template>
  <div 
    class="email-list-container"
    @touchstart="(e) => handleTouchStart(e, 'container')"
    @touchmove="(e) => handleTouchMove(e, 'container')"
    @touchend="(e) => handleTouchEnd(e, null, 'container')"
    v-voix:role="'list'"
    v-voix:label="'Email inbox'"
  >
    <!-- Pull to refresh indicator -->
    <div class="pull-to-refresh" :style="{ height: `${pullDistance}px` }" v-if="pullDistance > 0">
      <div class="refresh-icon" :class="{ 'refreshing': isRefreshing }">
        <span v-if="!isRefreshing">↓</span>
        <span v-else>↻</span>
      </div>
      <div class="refresh-text">{{ isRefreshing ? 'Refreshing...' : 'Pull to refresh' }}</div>
    </div>

    <!-- Refreshing indicator -->
    <div class="refreshing-indicator" v-if="isRefreshing && pullDistance === 0">
      <div class="spinner"></div>
      <div>Refreshing...</div>
    </div>

    <!-- Email groups -->
    <div v-if="emailGroups.today.length > 0" class="email-group">
      <h2 class="group-header" v-voix:role="'heading'" v-voix:level="2">Today</h2>
      <div 
        v-for="email in emailGroups.today" 
        :key="email.id" 
        class="email-card"
        :class="{ 'read': email.read }"
        @click="handleEmailClick(email.id)"
        @touchstart="(e) => handleTouchStart(e, 'email')"
        @touchmove="(e) => handleTouchMove(e, 'email')"
        @touchend="(e) => handleTouchEnd(e, email.id, 'email')"
        v-voix:role="'listitem'"
        v-voix:label="`Email from ${email.sender.name}, Subject: ${email.subject}`"
      >
        <div class="email-unread-indicator" v-if="!email.read"></div>
        <div class="email-content">
          <div class="email-header">
            <div class="email-sender" v-voix:role="'text'">{{ email.sender.name }}</div>
            <div class="email-time" v-voix:role="'text'">{{ formatTime(email.timestamp) }}</div>
          </div>
          <div class="email-subject" v-voix:role="'text'">{{ email.subject }}</div>
          <div class="email-snippet" v-voix:role="'text'">{{ email.body.substring(0, 100) }}{{ email.body.length > 100 ? '...' : '' }}</div>
        </div>
      </div>
    </div>

    <div v-if="emailGroups.yesterday.length > 0" class="email-group">
      <h2 class="group-header" v-voix:role="'heading'" v-voix:level="2">Yesterday</h2>
      <div 
        v-for="email in emailGroups.yesterday" 
        :key="email.id" 
        class="email-card"
        :class="{ 'read': email.read }"
        @click="handleEmailClick(email.id)"
        @touchstart="(e) => handleTouchStart(e, 'email')"
        @touchmove="(e) => handleTouchMove(e, 'email')"
        @touchend="(e) => handleTouchEnd(e, email.id, 'email')"
        v-voix:role="'listitem'"
        v-voix:label="`Email from ${email.sender.name}, Subject: ${email.subject}`"
      >
        <div class="email-unread-indicator" v-if="!email.read"></div>
        <div class="email-content">
          <div class="email-header">
            <div class="email-sender" v-voix:role="'text'">{{ email.sender.name }}</div>
            <div class="email-time" v-voix:role="'text'">{{ formatTime(email.timestamp) }}</div>
          </div>
          <div class="email-subject" v-voix:role="'text'">{{ email.subject }}</div>
          <div class="email-snippet" v-voix:role="'text'">{{ email.body.substring(0, 100) }}{{ email.body.length > 100 ? '...' : '' }}</div>
        </div>
      </div>
    </div>

    <div v-if="emailGroups.earlier.length > 0" class="email-group">
      <h2 class="group-header" v-voix:role="'heading'" v-voix:level="2">Earlier</h2>
      <div 
        v-for="email in emailGroups.earlier" 
        :key="email.id" 
        class="email-card"
        :class="{ 'read': email.read }"
        @click="handleEmailClick(email.id)"
        @touchstart="(e) => handleTouchStart(e, 'email')"
        @touchmove="(e) => handleTouchMove(e, 'email')"
        @touchend="(e) => handleTouchEnd(e, email.id, 'email')"
        v-voix:role="'listitem'"
        v-voix:label="`Email from ${email.sender.name}, Subject: ${email.subject}`"
      >
        <div class="email-unread-indicator" v-if="!email.read"></div>
        <div class="email-content">
          <div class="email-header">
            <div class="email-sender" v-voix:role="'text'">{{ email.sender.name }}</div>
            <div class="email-time" v-voix:role="'text'">{{ formatTime(email.timestamp) }}</div>
          </div>
          <div class="email-subject" v-voix:role="'text'">{{ email.subject }}</div>
          <div class="email-snippet" v-voix:role="'text'">{{ email.body.substring(0, 100) }}{{ email.body.length > 100 ? '...' : '' }}</div>
        </div>
      </div>
    </div>

    <!-- No emails placeholder -->
    <div v-if="Object.values(emailGroups).every(group => group.length === 0)" class="no-emails" v-voix:role="'text'">
      Your inbox is empty
    </div>

    <!-- Floating action button for compose -->
    <button 
      class="compose-fab" 
      @click="openComposeEmail"
      v-voix:role="'button'"
      v-voix:label="'Compose new email'"
    >
      <span class="plus-icon">+</span>
    </button>

    <!-- Swipe hint overlay (shown on first load) -->
    <div class="swipe-hint" v-if="false">
      <div class="swipe-hint-text">
        <div>Swipe right to mark as read/unread</div>
        <div>Swipe left to archive</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.email-list-container {
  position: relative;
  height: 100%;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding-bottom: 80px; /* Space for FAB */
}

.pull-to-refresh {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  transition: height 0.2s;
}

.refresh-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.refresh-icon.refreshing {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.refresh-text {
  font-size: 14px;
  color: #666;
}

.refreshing-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

.email-group {
  margin-bottom: 16px;
}

.group-header {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  background-color: #f5f5f5;
  margin: 0;
  position: sticky;
  top: 0;
  z-index: 1;
}

.email-card {
  display: flex;
  background-color: #fff;
  margin: 4px 0;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  transition: transform 0.2s, opacity 0.2s;
  cursor: pointer;
}

.email-card.read {
  background-color: #f9f9f9;
}

.email-unread-indicator {
  width: 8px;
  height: 8px;
  background-color: #1a73e8;
  border-radius: 50%;
  margin-right: 12px;
  margin-top: 8px;
}

.email-content {
  flex: 1;
  min-width: 0; /* Enables text truncation */
}

.email-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.email-sender {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.email-time {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  margin-left: 8px;
}

.email-subject {
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.email-card.read .email-subject {
  font-weight: 400;
}

.email-snippet {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-emails {
  text-align: center;
  padding: 48px 16px;
  color: #666;
  font-size: 16px;
}

.compose-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: #1a73e8;
  color: white;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  z-index: 10;
}

.compose-fab:hover {
  background-color: #1765cc;
}

.plus-icon {
  font-size: 24px;
  font-weight: 300;
}

.swipe-hint {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.swipe-hint-text {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  line-height: 1.5;
}

/* The following classes simulate the swipe effect */
.swipe-left {
  transform: translateX(-100px);
  opacity: 0.5;
}

.swipe-right {
  transform: translateX(100px);
  opacity: 0.5;
}

@media (min-width: 768px) {
  .email-card {
    margin: 4px 16px;
  }
  
  .compose-fab {
    bottom: 32px;
    right: 32px;
  }
}
</style>