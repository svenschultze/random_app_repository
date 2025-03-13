<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useEmailStore } from '@/stores/emailStore';
import ComposeEmailForm from '@/components/ComposeEmailForm.vue';
import NotificationBanner from '@/components/NotificationBanner.vue';

const router = useRouter();
const route = useRoute();

// Get the email store
const emailStore = useEmailStore();

// State for original email (if replying or forwarding)
const replyToEmail = ref(null);
const isReplyAll = ref(false);
const isForward = ref(false);

// Notification state
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref('success');

// Determine if we have query parameters for reply/forward
function handleQueryParams(query) {
  // Check for reply/forward query params
  if (query.reply) {
    replyToEmail.value = emailStore.findEmailById(query.reply);
    isReplyAll.value = false;
    isForward.value = false;
  } else if (query.replyAll) {
    replyToEmail.value = emailStore.findEmailById(query.replyAll);
    isReplyAll.value = true;
    isForward.value = false;
  } else if (query.forward) {
    replyToEmail.value = emailStore.findEmailById(query.forward);
    isReplyAll.value = false;
    isForward.value = true;
  }
}

// Initialize with any query params
onMounted(() => {
  if (route.query) {
    handleQueryParams(route.query);
  }
});

// Notification functions
function showSuccess(message) {
  notificationMessage.value = message;
  notificationType.value = 'success';
  showNotification.value = true;
}

function showError(message) {
  notificationMessage.value = message;
  notificationType.value = 'error';
  showNotification.value = true;
}

function closeNotification() {
  showNotification.value = false;
}

// Handle closing the compose view
function handleClose() {
  showSuccess('Draft discarded');
  setTimeout(() => {
    router.push({ name: 'inbox' });
  }, 1000);
}

// Handle sending an email
function handleSend(emailData) {
  try {
    // In a real app, this would be an API call
    console.log('Email sent:', emailData);
    
    // Show success notification
    showSuccess('Email sent successfully!');
    
    // Set the current view to sent in the store
    emailStore.setCurrentView('sent');
    
    // Navigate to the sent view after a short delay
    setTimeout(() => {
      router.push({ name: 'sent' });
    }, 1000);
  } catch (error) {
    showError('Failed to send email. Please try again.');
  }
}
</script>

<template>
  <div class="compose-view">
    <!-- Notification Banner -->
    <NotificationBanner
      :message="notificationMessage"
      :type="notificationType"
      :show="showNotification"
      @close="closeNotification"
    />
    
    <!-- Compose Form -->
    <ComposeEmailForm
      :reply-to="replyToEmail"
      :reply-all="isReplyAll"
      :forward="isForward"
      @close="handleClose"
      @send="handleSend"
    />
  </div>
</template>

<style scoped>
.compose-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
}
</style>