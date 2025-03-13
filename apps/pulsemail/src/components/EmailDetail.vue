<script setup>
import { ref, computed, onMounted } from 'vue';
import { useEmailStore } from '@/stores/emailStore';
import ConfirmationModal from './ConfirmationModal.vue';

const emailStore = useEmailStore();

const props = defineProps({
  email: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['back', 'delete', 'reply', 'reply-all', 'forward', 'reply-sent']);

// Delete confirmation modal
const showDeleteConfirmation = ref(false);

// Format date for display
const formattedDate = computed(() => {
  if (!props.email || !props.email.timestamp) return '';
  
  const date = new Date(props.email.timestamp);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
});

// Quick reply functionality
const quickReplyText = ref('');
const isComposing = ref(false);

const startQuickReply = () => {
  isComposing.value = true;
  // Focus on the textarea
  setTimeout(() => {
    document.getElementById('quick-reply-textarea').focus();
  }, 0);
};

const cancelQuickReply = () => {
  quickReplyText.value = '';
  isComposing.value = false;
};

const sendQuickReply = () => {
  if (quickReplyText.value.trim()) {
    // Use our handler for sending quick replies
    handleQuickReplySend();
  }
};

// Swipe down to close
const touchStart = ref({ y: 0 });
const touchEnd = ref({ y: 0 });
const swipeThreshold = 100;

const handleTouchStart = (event) => {
  touchStart.value = {
    y: event.touches[0].clientY
  };
};

const handleTouchMove = (event) => {
  // Optional: Add visual feedback during swipe
};

const handleTouchEnd = (event) => {
  touchEnd.value = {
    y: event.changedTouches[0].clientY
  };
  
  const diffY = touchEnd.value.y - touchStart.value.y;
  
  // If swiped down far enough
  if (diffY > swipeThreshold) {
    emit('back');
  }
};

// Handle navigation buttons
const goBack = () => {
  // Make sure navigation works
  console.log('EmailDetail - Back button clicked');
  emit('back');
};

const handleDelete = () => {
  // Show confirmation modal instead of alert
  showDeleteConfirmation.value = true;
};

// Handle confirmation of delete
const confirmDelete = () => {
  emit('delete', props.email.id);
  showDeleteConfirmation.value = false;
};

// Handle cancel of delete
const cancelDelete = () => {
  showDeleteConfirmation.value = false;
};

const handleReply = () => {
  emit('reply', props.email.id);
};

const handleReplyAll = () => {
  emit('reply-all', props.email.id);
};

const handleForward = () => {
  emit('forward', props.email.id);
};

// Auto resize textarea for quick reply
const autoResizeTextarea = (event) => {
  const textarea = event.target;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
};

// Handle quick reply submission
const handleQuickReplySend = () => {
  if (quickReplyText.value.trim()) {
    // In a real app, this would send the reply to an API
    
    // Prepare email data
    const emailData = {
      to: props.email.sender?.email || '',
      subject: props.email.subject.startsWith('Re:') ? props.email.subject : `Re: ${props.email.subject}`,
      body: quickReplyText.value,
      isReply: true,
      originalEmail: props.email
    };
    
    // Add the reply to sent emails
    const sentEmail = props.email.sent 
      ? null // Don't reply to your own sent emails
      : emailStore.addToSent(emailData);
    
    // Reset and close the quick reply
    quickReplyText.value = '';
    isComposing.value = false;
    
    // Emit the reply event (parent component can handle success notification)
    emit('reply-sent', sentEmail);
  }
};
</script>

<template>
  <div 
    class="email-detail-container"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    v-voix:role="'region'"
    v-voix:label="'Email details'"
  >
    <!-- Delete confirmation modal -->
    <ConfirmationModal
      :show="showDeleteConfirmation"
      title="Delete Email"
      message="Are you sure you want to delete this email? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      type="error"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
    <!-- Header with back button and actions -->
    <div class="email-header">
      <button 
        class="back-button" 
        @click="goBack"
        v-voix:role="'button'"
        v-voix:label="'Back to inbox'"
      >
        <span class="back-icon">←</span>
      </button>
      
      <div class="header-actions">
        <button 
          class="action-button" 
          @click="handleDelete"
          v-voix:role="'button'" 
          v-voix:label="'Delete email'"
        >
          <span class="action-icon">🗑️</span>
        </button>
      </div>
    </div>
    
    <!-- Email subject and sender info -->
    <div class="email-subject-container">
      <h1 class="email-subject" v-voix:role="'heading'" v-voix:level="1">
        {{ email.subject }}
      </h1>
      
      <div class="sender-info">
        <div 
          class="sender-avatar"
          v-voix:role="'image'"
          v-voix:label="email.sent ? 'Profile picture of recipient ' + (email.recipient?.name || '') : 'Profile picture of ' + (email.sender?.name || '')"
        >
          {{ email.sent ? (email.recipient?.name?.charAt(0) || 'R') : (email.sender?.name?.charAt(0) || 'S') }}
        </div>
        
        <div class="sender-details">
          <div class="sender-name" v-voix:role="'text'">
            {{ email.sent ? (email.recipient?.name || 'Recipient') : (email.sender?.name || 'Sender') }}
            <span class="sender-email">
              {{ email.sent ? (email.recipient?.email || '') : (email.sender?.email || '') }}
            </span>
          </div>
          
          <div class="email-date" v-voix:role="'text'">
            {{ formattedDate }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Email body content -->
    <div 
      class="email-body"
      v-voix:role="'text'"
      v-voix:label="'Email content'"
    >
      <p v-if="email.body">{{ email.body }}</p>
      <div v-else class="loading-placeholder">
        <div class="loading-line"></div>
        <div class="loading-line"></div>
        <div class="loading-line"></div>
      </div>
    </div>
    
    <!-- Attachments section (if any) -->
    <div 
      v-if="email.hasAttachment" 
      class="email-attachments"
      v-voix:role="'region'"
      v-voix:label="'Attachments'"
    >
      <div class="attachment">
        <span class="attachment-icon">📎</span>
        <span class="attachment-name">Document.pdf</span>
      </div>
    </div>
    
    <!-- Email actions -->
    <div 
      class="email-actions"
      v-voix:role="'toolbar'"
      v-voix:label="'Email actions'"
    >
      <button 
        class="action-button" 
        @click="handleReply"
        :disabled="email.sent"
        v-voix:role="'button'"
        v-voix:label="'Reply'"
      >
        <span class="material-icons action-icon">reply</span>
        <span class="action-text">Reply</span>
      </button>
      
      <button 
        class="action-button" 
        @click="handleReplyAll"
        :disabled="email.sent"
        v-voix:role="'button'"
        v-voix:label="'Reply all'"
      >
        <span class="material-icons action-icon">reply_all</span>
        <span class="action-text">Reply All</span>
      </button>
      
      <button 
        class="action-button" 
        @click="handleForward"
        v-voix:role="'button'"
        v-voix:label="'Forward'"
      >
        <span class="material-icons action-icon">forward</span>
        <span class="action-text">Forward</span>
      </button>
    </div>
    
    <!-- Quick reply section -->
    <div 
      class="quick-reply-container" 
      :class="{ 'composing': isComposing }"
      v-voix:role="'form'"
      v-voix:label="'Quick reply'"
      v-if="!email.sent" 
    >
      <div v-if="!isComposing" class="quick-reply-prompt">
        <button 
          class="quick-reply-button" 
          @click="startQuickReply"
          v-voix:role="'button'"
          v-voix:label="'Write a reply'"
        >
          <span class="material-icons quick-reply-icon">chat</span>
          Reply to this email...
        </button>
      </div>
      
      <div v-else class="quick-reply-composer">
        <textarea 
          id="quick-reply-textarea"
          v-model="quickReplyText"
          @input="autoResizeTextarea"
          placeholder="Type your reply here..."
          class="quick-reply-textarea"
          v-voix:role="'textbox'"
          v-voix:label="'Reply message'"
        ></textarea>
        
        <div class="quick-reply-actions">
          <button 
            class="cancel-button" 
            @click="cancelQuickReply"
            v-voix:role="'button'"
            v-voix:label="'Cancel reply'"
          >
            <span class="material-icons">close</span>
            Cancel
          </button>
          
          <button 
            class="send-button" 
            @click="sendQuickReply"
            :disabled="!quickReplyText.trim()"
            v-voix:role="'button'"
            v-voix:label="'Send reply'"
          >
            <span class="material-icons">send</span>
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.email-detail-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
  padding-bottom: 16px;
}

.email-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444;
}

.back-icon {
  font-size: 20px;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #444;
  font-size: 12px;
  gap: 4px;
  transition: color 0.2s;
}

.action-button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.action-button:hover:not(:disabled) {
  color: #1a73e8;
}

.action-icon {
  font-size: 20px;
}

.email-subject-container {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.email-subject {
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 16px 0;
  line-height: 1.3;
}

.sender-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sender-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1a73e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
}

.sender-details {
  flex: 1;
}

.sender-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.sender-email {
  font-weight: 400;
  color: #666;
  margin-left: 8px;
  font-size: 14px;
}

.email-date {
  font-size: 14px;
  color: #666;
}

.email-body {
  padding: 24px 16px;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  min-height: 200px;
}

.email-body p {
  margin-bottom: 16px;
  white-space: pre-line;
}

.loading-placeholder {
  padding: 16px 0;
}

.loading-line {
  height: 14px;
  margin-bottom: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.loading-line:nth-child(2) {
  width: 90%;
}

.loading-line:nth-child(3) {
  width: 75%;
}

.email-attachments {
  padding: 0 16px 16px;
  border-top: 1px solid #eee;
}

.attachment {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-top: 16px;
}

.attachment-icon {
  margin-right: 8px;
  font-size: 18px;
}

.attachment-name {
  font-size: 14px;
}

.email-actions {
  display: flex;
  justify-content: space-around;
  padding: 16px;
  border-top: 1px solid #eee;
  background-color: #fff;
}

.action-text {
  font-size: 14px;
  margin-top: 4px;
}

.quick-reply-container {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
}

.quick-reply-container.composing {
  background-color: #fff;
}

.quick-reply-prompt {
  display: flex;
  justify-content: center;
}

.quick-reply-button {
  width: 100%;
  padding: 12px;
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  border-radius: 24px;
  text-align: left;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.quick-reply-icon {
  font-size: 20px;
  color: #666;
}

.quick-reply-composer {
  display: flex;
  flex-direction: column;
}

.quick-reply-textarea {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 16px;
}

.quick-reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.cancel-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #e9e9e9;
}

.send-button {
  padding: 8px 16px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.2s;
}

.send-button:hover:not(:disabled) {
  background-color: #1765cc;
}

.send-button:disabled {
  background-color: #9fc1ee;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  .email-header, 
  .email-subject-container, 
  .email-body,
  .email-attachments,
  .email-actions,
  .quick-reply-container {
    padding-left: 32px;
    padding-right: 32px;
  }
  
  .email-subject {
    font-size: 24px;
  }
}
</style>