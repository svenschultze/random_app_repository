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

// Email detail state
const selectedEmail = ref(null);
const showEmailDetail = ref(false);

// Notification state
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref('success');

// Initialize data
onMounted(() => {
  // Set the view in the store
  emailStore.setCurrentView('sent');
  
  // Always show loading indicator briefly when navigating to sent view
  isLoading.value = true;
  
  // Small delay to show loading indicator
  // Don't fetch emails here - we want to keep manually sent emails
  setTimeout(() => {
    // If we have no emails at all, initialize with some demo emails
    if (emailStore.sentEmails.value.length === 0) {
      emailStore.fetchEmails(true); // true to preserve any existing emails
    }
    isLoading.value = false;
  }, 300);
});

// Handle email selection
const selectEmail = (email) => {
  selectedEmail.value = email;
  showEmailDetail.value = true;
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
};

// Handle email deletion
const handleDelete = (emailId) => {
  emailStore.deleteEmail(emailId);
  closeEmailDetail();
};

// Handle reply attempts from sent email view
const handleReply = (emailId) => {
  // Instead of replying to yourself, we'll let user forward it
  showNotificationMessage('You cannot reply to your own sent emails', 'info');
};

// Handle reply all attempts from sent email view
const handleReplyAll = (emailId) => {
  showNotificationMessage('You cannot reply to your own sent emails', 'info');
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

// Handle sent replies (shouldn't really happen from sent emails view)
const handleReplySent = (sentEmail) => {
  if (sentEmail) {
    showNotificationMessage('Reply sent successfully!');
  }
};

// Filter sent emails by search query
const filteredSentEmails = computed(() => {
  if (!searchQuery.value) {
    return emailStore.sentEmails.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return emailStore.sentEmails.value.filter(email => 
    email.subject.toLowerCase().includes(query) ||
    (email.recipient?.name && email.recipient.name.toLowerCase().includes(query)) ||
    email.body.toLowerCase().includes(query)
  );
});
</script>

<template>
  <div 
    class="sent-view"
    v-voix:role="'region'"
    v-voix:label="'Sent emails'"
  >
    <!-- Notification Banner -->
    <NotificationBanner
      :message="notificationMessage"
      :type="notificationType"
      :show="showNotification"
      @close="closeNotification"
    />
    <!-- Search header -->
    <div class="inbox-header" v-if="!showEmailDetail">
      <div 
        class="search-bar"
        v-voix:role="'search'"
      >
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="updateSearch(searchQuery)"
          placeholder="Search sent emails..."
          class="search-input"
          v-voix:role="'searchbox'"
          v-voix:label="'Search sent emails'"
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
    </div>
    
    <!-- Email Detail View -->
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
    
    <!-- Sent emails list -->
    <div v-else class="email-list-container">
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <div>Loading your emails...</div>
      </div>
      
      <!-- Email list -->
      <div v-else>
        <h2 class="sent-header" v-voix:role="'heading'" v-voix:level="2">Sent Emails</h2>
        
        <!-- Empty state -->
        <div v-if="filteredSentEmails.length === 0" class="no-emails" v-voix:role="'text'">
          No sent emails found
        </div>
        
        <!-- Email list -->
        <div 
          v-for="email in filteredSentEmails" 
          :key="email.id" 
          class="email-card"
          @click="selectEmail(email)"
          v-voix:role="'listitem'"
          v-voix:label="`Email to ${email.recipient?.name || 'recipient'}, Subject: ${email.subject}`"
        >
          <div class="email-content">
            <div class="email-header">
              <div class="email-recipient" v-voix:role="'text'">
                To: {{ email.recipient?.name || email.recipient?.email || 'Recipient' }}
              </div>
              <div class="email-time" v-voix:role="'text'">
                {{ emailStore.formatDate(email.timestamp) }}
              </div>
            </div>
            <div class="email-subject" v-voix:role="'text'">{{ email.subject }}</div>
            <div class="email-snippet" v-voix:role="'text'">
              {{ email.body.substring(0, 100) }}{{ email.body.length > 100 ? '...' : '' }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Compose button removed as it's now centralized in TheNavigation -->
    </div>
  </div>
</template>

<style scoped>
.sent-view {
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

.email-list-container {
  position: relative;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px; /* Space for FAB */
}

.sent-header {
  padding: 16px;
  font-size: 18px;
  color: #333;
  margin: 0;
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

.email-content {
  flex: 1;
  min-width: 0; /* Enables text truncation */
}

.email-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.email-recipient {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #666;
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
  .inbox-header {
    padding: 16px 24px;
  }
}
</style>