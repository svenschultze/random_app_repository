<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useEmailStore } from '@/stores/emailStore';
import EmailDetail from '@/components/EmailDetail.vue';
import NotificationBanner from '@/components/NotificationBanner.vue';

const router = useRouter();

const emailStore = useEmailStore();
const isLoading = ref(true);
const searchQuery = ref('');
const showUnreadOnly = ref(false);
const showStarredOnly = ref(false);

// Email modal state
const selectedEmail = ref(null);
const showEmailDetail = ref(false);

// Notification state
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref('success');

// Initialize data
onMounted(() => {
  // Set current view
  emailStore.setCurrentView('inbox');
  
  // Show loading indicator
  isLoading.value = true;
  
  // Initialize with emails if needed
  // This will preserve any manually sent emails
  setTimeout(() => {
    emailStore.fetchEmails(true);
    isLoading.value = false;
  }, 300);
});

// Handle email selection
const selectEmail = (email) => {
  selectedEmail.value = email;
  showEmailDetail.value = true;
  
  // Mark as read
  if (email && !email.read) {
    emailStore.markAsRead(email.id);
  }
};

// Close email detail
const closeEmailDetail = () => {
  showEmailDetail.value = false;
  selectedEmail.value = null;
};

// Handle refresh
const handleRefresh = () => {
  isLoading.value = true;
  // In a real app, this would fetch new emails
  // Pass true to preserve manually sent emails
  emailStore.fetchEmails(true);
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

// Handle compose
const handleCompose = () => {
  router.push({ name: 'email-compose' });
};

// Handle search
const updateSearch = (query) => {
  searchQuery.value = query;
  emailStore.setFilter('searchQuery', query);
};

// Handle filter toggles
const toggleUnreadFilter = () => {
  showUnreadOnly.value = !showUnreadOnly.value;
  emailStore.setFilter('showUnread', showUnreadOnly.value);
};

const toggleStarredFilter = () => {
  showStarredOnly.value = !showStarredOnly.value;
  emailStore.setFilter('showStarred', showStarredOnly.value);
};

// Handle email deletion
const handleDelete = (emailId) => {
  emailStore.deleteEmail(emailId);
  closeEmailDetail();
};

// Handle reply 
const handleReply = (emailId) => {
  // Navigate to compose view with reply query parameter
  router.push({ 
    name: 'email-compose',
    query: { reply: emailId }
  });
};

// Handle reply all
const handleReplyAll = (emailId) => {
  // Navigate to compose view with replyAll query parameter
  router.push({ 
    name: 'email-compose',
    query: { replyAll: emailId }
  });
};

// Handle forward
const handleForward = (emailId) => {
  // Navigate to compose view with forward query parameter
  router.push({ 
    name: 'email-compose',
    query: { forward: emailId }
  });
};

// Notification functions
const showNotificationMessage = (message, type = 'success') => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
};

const closeNotification = () => {
  showNotification.value = false;
};

// Handle quick replies
const handleReplySent = (sentEmail) => {
  if (sentEmail) {
    // Show notification or feedback
    showNotificationMessage('Reply sent successfully!');
  }
};

// Computed properties
const emailGroups = computed(() => {
  // Use filtered emails when search or filters are active
  if (searchQuery.value || showUnreadOnly.value || showStarredOnly.value) {
    // Create groups object with filtered emails
    const filteredEmails = emailStore.filteredEmails.value;
    return {
      today: filteredEmails.filter(email => {
        const emailDate = new Date(email.timestamp);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        emailDate.setHours(0, 0, 0, 0);
        return emailDate.getTime() === today.getTime();
      }),
      yesterday: filteredEmails.filter(email => {
        const emailDate = new Date(email.timestamp);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        emailDate.setHours(0, 0, 0, 0);
        return emailDate.getTime() === yesterday.getTime();
      }),
      earlier: filteredEmails.filter(email => {
        const emailDate = new Date(email.timestamp);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        emailDate.setHours(0, 0, 0, 0);
        return emailDate.getTime() < yesterday.getTime();
      })
    };
  }
  
  // Use all emails when no search or filters
  return emailStore.emailGroups.value;
});
</script>

<template>
  <div 
    class="inbox-view"
    v-voix:role="'region'"
    v-voix:label="'Email inbox'"
  >
    <!-- Notification banner -->
    <NotificationBanner
      :message="notificationMessage"
      :type="notificationType"
      :show="showNotification"
      @close="closeNotification"
    />
    <!-- Search and filter header -->
    <div class="inbox-header" v-if="!showEmailDetail">
      <div 
        class="search-bar"
        v-voix:role="'search'"
      >
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="updateSearch(searchQuery)"
          placeholder="Search emails..."
          class="search-input"
          v-voix:role="'searchbox'"
          v-voix:label="'Search emails'"
        />
        <button 
          v-if="searchQuery" 
          @click="updateSearch('')" 
          class="clear-search"
          v-voix:role="'button'"
          v-voix:label="'Clear search'"
        >
          ✕
        </button>
      </div>
      
      <div class="filter-buttons">
        <button 
          @click="toggleUnreadFilter" 
          class="filter-button" 
          :class="{ 'active': showUnreadOnly }"
          v-voix:role="'button'"
          v-voix:label="'Show unread only'"
          v-voix:pressed="showUnreadOnly"
          :title="showUnreadOnly ? 'Show all emails' : 'Show unread emails only'"
        >
          <span class="filter-icon">✉️</span>
        </button>
        <button 
          @click="toggleStarredFilter" 
          class="filter-button" 
          :class="{ 'active': showStarredOnly }"
          v-voix:role="'button'"
          v-voix:label="'Show starred only'"
          v-voix:pressed="showStarredOnly"
          :title="showStarredOnly ? 'Show all emails' : 'Show starred emails only'"
        >
          <span class="filter-icon">⭐</span>
        </button>
      </div>
    </div>
    
    <!-- Email Detail View (shown when an email is selected) -->
    <div v-if="showEmailDetail && selectedEmail" class="email-detail-container">
      <EmailDetail 
        :email="selectedEmail"
        @back="closeEmailDetail"
        @delete="handleDelete"
        @reply="handleReply"
        @reply-all="handleReplyAll"
        @forward="handleForward"
        @reply-sent="handleReplySent"
      />
    </div>
    
    <!-- Email List View (shown when no email is selected) -->
    <div v-else>
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <div>Loading your emails...</div>
      </div>
      
      <!-- Email list -->
      <div v-else class="email-list">
        <!-- Today's emails -->
        <div v-if="emailGroups.today && emailGroups.today.length > 0" class="email-group">
          <h2 class="group-header" v-voix:role="'heading'" v-voix:level="2">Today</h2>
          <div 
            v-for="email in emailGroups.today" 
            :key="email.id" 
            class="email-card"
            :class="{ 'read': email.read }"
            @click="selectEmail(email)"
            v-voix:role="'listitem'"
            v-voix:label="`Email from ${email.sender.name}, Subject: ${email.subject}`"
          >
            <div class="email-unread-indicator" v-if="!email.read"></div>
            <div class="email-content">
              <div class="email-header">
                <div class="email-sender" v-voix:role="'text'">{{ email.sender.name }}</div>
                <div class="email-time" v-voix:role="'text'">{{ emailStore.formatDate(email.timestamp) }}</div>
              </div>
              <div class="email-subject" v-voix:role="'text'">{{ email.subject }}</div>
              <div class="email-snippet" v-voix:role="'text'">{{ email.body.substring(0, 100) }}{{ email.body.length > 100 ? '...' : '' }}</div>
            </div>
          </div>
        </div>
        
        <!-- Yesterday's emails -->
        <div v-if="emailGroups.yesterday && emailGroups.yesterday.length > 0" class="email-group">
          <h2 class="group-header" v-voix:role="'heading'" v-voix:level="2">Yesterday</h2>
          <div 
            v-for="email in emailGroups.yesterday" 
            :key="email.id" 
            class="email-card"
            :class="{ 'read': email.read }"
            @click="selectEmail(email)"
            v-voix:role="'listitem'"
            v-voix:label="`Email from ${email.sender.name}, Subject: ${email.subject}`"
          >
            <div class="email-unread-indicator" v-if="!email.read"></div>
            <div class="email-content">
              <div class="email-header">
                <div class="email-sender" v-voix:role="'text'">{{ email.sender.name }}</div>
                <div class="email-time" v-voix:role="'text'">{{ emailStore.formatDate(email.timestamp) }}</div>
              </div>
              <div class="email-subject" v-voix:role="'text'">{{ email.subject }}</div>
              <div class="email-snippet" v-voix:role="'text'">{{ email.body.substring(0, 100) }}{{ email.body.length > 100 ? '...' : '' }}</div>
            </div>
          </div>
        </div>
        
        <!-- Earlier emails -->
        <div v-if="emailGroups.earlier && emailGroups.earlier.length > 0" class="email-group">
          <h2 class="group-header" v-voix:role="'heading'" v-voix:level="2">Earlier</h2>
          <div 
            v-for="email in emailGroups.earlier" 
            :key="email.id" 
            class="email-card"
            :class="{ 'read': email.read }"
            @click="selectEmail(email)"
            v-voix:role="'listitem'"
            v-voix:label="`Email from ${email.sender.name}, Subject: ${email.subject}`"
          >
            <div class="email-unread-indicator" v-if="!email.read"></div>
            <div class="email-content">
              <div class="email-header">
                <div class="email-sender" v-voix:role="'text'">{{ email.sender.name }}</div>
                <div class="email-time" v-voix:role="'text'">{{ emailStore.formatDate(email.timestamp) }}</div>
              </div>
              <div class="email-subject" v-voix:role="'text'">{{ email.subject }}</div>
              <div class="email-snippet" v-voix:role="'text'">{{ email.body.substring(0, 100) }}{{ email.body.length > 100 ? '...' : '' }}</div>
            </div>
          </div>
        </div>
        
        <!-- No emails message -->
        <div v-if="!emailGroups.today.length && !emailGroups.yesterday.length && !emailGroups.earlier.length" class="no-emails" v-voix:role="'text'">
          No emails found
        </div>
      </div>
      
      <!-- Compose button removed as it's now centralized in TheNavigation -->
    </div>
  </div>
</template>

<style scoped>
.inbox-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
}

.inbox-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  padding: 12px 16px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-bar {
  flex: 1;
  position: relative;
  margin-right: 12px;
}

.search-input {
  width: 100%;
  padding: 10px 12px;
  padding-right: 36px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 16px;
  background-color: #f5f5f5;
}

.clear-search {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.filter-button {
  background: none;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.filter-button.active {
  background-color: #e3f2fd;
  border-color: #1a73e8;
  color: #1a73e8;
}

.filter-icon {
  font-size: 16px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 32px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #1a73e8;
  border-radius: 50%;
  animation: spinner 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.email-list {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px; /* Space for FAB */
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
  margin: 4px 16px;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
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

/* Compose FAB removed and centralized in TheNavigation */

/* Email detail container */
.email-detail-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  height: 100%;
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