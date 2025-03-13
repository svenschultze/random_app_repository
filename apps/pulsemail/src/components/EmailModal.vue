<script setup>
import { computed, watch } from 'vue';
import { useEmailStore } from '@/stores/emailStore';
import EmailDetail from './EmailDetail.vue';

// Props
const props = defineProps({
  emailId: {
    type: String,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const emailStore = useEmailStore();

// Get the email from the store
const email = computed(() => {
  if (!props.emailId) return null;
  return emailStore.findEmailById(props.emailId);
});

// Handle clicks on the email detail
const handleBack = () => {
  emit('close');
};

// Handle email deletion
const handleDelete = (id) => {
  emailStore.deleteEmail(id);
  emit('close');
};

// Watch for show prop changes
watch(() => props.show, (newVal) => {
  if (newVal && props.emailId) {
    // Mark email as read when shown
    emailStore.markAsRead(props.emailId);
  }
});

// Handle reply, reply all, and forward
const handleReply = (id) => {
  // In a real app, this would navigate to compose view
  console.log('Reply to:', id);
};

const handleReplyAll = (id) => {
  // In a real app, this would navigate to compose view
  console.log('Reply all to:', id);
};

const handleForward = (id) => {
  // In a real app, this would navigate to compose view
  console.log('Forward:', id);
};

// Handle modal close when clicking backdrop
const handleBackdropClick = (event) => {
  // Only close if clicking directly on the backdrop, not its children
  if (event.target === event.currentTarget) {
    emit('close');
  }
};
</script>

<template>
  <div 
    v-if="show" 
    class="email-modal"
    @click="handleBackdropClick"
    v-voix:role="'dialog'"
    v-voix:modal="true"
    v-voix:label="'Email details'"
  >
    <div class="email-modal-content">
      <EmailDetail 
        v-if="email"
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
  </div>
</template>

<style scoped>
.email-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.email-modal-content {
  background-color: #fff;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
  position: relative;
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

@media (min-width: 768px) {
  .email-modal-content {
    width: 80%;
    height: 80%;
    border-radius: 8px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  }
}
</style>