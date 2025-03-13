<script setup>
import { ref, watchEffect, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useEmailStore } from '@/stores/emailStore';
import EmailDetail from '@/components/EmailDetail.vue';

const router = useRouter();
const route = useRoute();
const emailStore = useEmailStore();

// Email State
const emailId = ref(null);
const email = ref(null);
const loading = ref(true);

// When component is mounted, load the email
onMounted(() => {
  // Get the email ID from route
  emailId.value = route.params.id;
  console.log('EmailDetailView mounted with ID:', emailId.value);
  
  // Find the email
  loadEmail();
});

// Set up watcher to react to route changes
watchEffect(() => {
  if (route.params.id !== emailId.value) {
    emailId.value = route.params.id;
    loadEmail();
  }
});

// Load email from store
function loadEmail() {
  loading.value = true;
  
  if (!emailId.value) {
    console.error('No email ID provided');
    loading.value = false;
    return;
  }
  
  // Try to find the email directly (no need to use selectedEmail)
  const foundEmail = emailStore.findEmailById(emailId.value);
  
  if (foundEmail) {
    // Email found
    email.value = foundEmail;
    
    // Mark as read if not already
    if (!foundEmail.read) {
      emailStore.markAsRead(emailId.value);
    }
    
    loading.value = false;
  } else {
    // Email not found
    console.error('Email not found with ID:', emailId.value);
    setTimeout(() => {
      // Try one more time after a delay
      const retryEmail = emailStore.findEmailById(emailId.value);
      if (retryEmail) {
        email.value = retryEmail;
      } else {
        // Give up and go back to inbox
        router.replace({ name: 'inbox' });
      }
      loading.value = false;
    }, 300);
  }
}

// Handle back navigation
function handleBack() {
  // Check if the email is sent, to determine where to go back to
  if (email.value?.sent) {
    router.push({ name: 'sent' });
  } else {
    router.push({ name: 'inbox' });
  }
}

// Handle email deletion
function handleDelete(id) {
  emailStore.deleteEmail(id);
  
  // Route back to the appropriate view
  if (email.value?.sent) {
    router.push({ name: 'sent' });
  } else {
    router.push({ name: 'inbox' });
  }
}

// Handle reply, reply all, and forward
function handleReply(id) {
  router.push({ 
    name: 'email-compose',
    query: { reply: id }
  });
}

function handleReplyAll(id) {
  router.push({ 
    name: 'email-compose',
    query: { replyAll: id }
  });
}

function handleForward(id) {
  router.push({ 
    name: 'email-compose',
    query: { forward: id }
  });
}
</script>

<template>
  <div 
    class="email-detail-view"
    v-voix:role="'region'"
    v-voix:label="'Email details view'"
  >
    <EmailDetail 
      v-if="email && !loading"
      :email="email"
      @back="handleBack"
      @delete="handleDelete"
      @reply="handleReply"
      @reply-all="handleReplyAll"
      @forward="handleForward"
    />
    
    <div v-else class="loading-state">
      <div class="spinner"></div>
      <div>Loading email...</div>
    </div>
  </div>
</template>

<style scoped>
.email-detail-view {
  height: 100%;
  background-color: #fff;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
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
</style>