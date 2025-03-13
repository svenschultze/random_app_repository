<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  replyTo: {
    type: Object,
    default: null
  },
  replyAll: {
    type: Boolean,
    default: false
  },
  forward: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'send']);

// Form state
const to = ref('');
const cc = ref('');
const bcc = ref('');
const subject = ref('');
const body = ref('');
const showCcBcc = ref(false);
const attachments = ref([]);

// Initialize form based on props
onMounted(() => {
  if (props.replyTo) {
    // For reply
    to.value = props.replyTo.sender?.email || '';
    
    // Set subject with Re: prefix if not already present
    subject.value = props.replyTo.subject?.startsWith('Re:') 
      ? props.replyTo.subject 
      : `Re: ${props.replyTo.subject}`;
    
    // Add quote to body
    const quoteHeader = `On ${new Date(props.replyTo.timestamp).toLocaleString()}, ${props.replyTo.sender?.name} <${props.replyTo.sender?.email}> wrote:`;
    const quotedBody = props.replyTo.body.split('\n').map(line => `> ${line}`).join('\n');
    body.value = `\n\n${quoteHeader}\n${quotedBody}`;
    
    // Focus the body field after mounting
    setTimeout(() => {
      document.getElementById('compose-body').focus();
    }, 0);
  }
  
  if (props.forward && props.replyTo) {
    // For forward
    subject.value = props.replyTo.subject?.startsWith('Fwd:') 
      ? props.replyTo.subject 
      : `Fwd: ${props.replyTo.subject}`;
    
    const forwardHeader = `---------- Forwarded message ---------\nFrom: ${props.replyTo.sender?.name} <${props.replyTo.sender?.email}>\nDate: ${new Date(props.replyTo.timestamp).toLocaleString()}\nSubject: ${props.replyTo.subject}\nTo: ${props.replyTo.to?.email || 'me'}\n\n`;
    body.value = `${forwardHeader}${props.replyTo.body}`;
  }
});

// Toggle CC/BCC fields
const toggleCcBcc = () => {
  showCcBcc.value = !showCcBcc.value;
};

// Handle file attachments
const fileInput = ref(null);

const openFileDialog = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    // In a real app, you would handle file uploads
    for (let i = 0; i < files.length; i++) {
      attachments.value.push({
        name: files[i].name,
        size: files[i].size,
        type: files[i].type
      });
    }
  }
  // Reset file input
  event.target.value = '';
};

const removeAttachment = (index) => {
  attachments.value.splice(index, 1);
};

// Send and cancel actions
const handleSend = () => {
  if (to.value.trim()) {
    // Prepare the email data
    const emailData = {
      to: to.value,
      cc: cc.value,
      bcc: bcc.value,
      subject: subject.value,
      body: body.value,
      attachments: attachments.value
    };
    
    // Emit the send event with the email data
    emit('send', emailData);
  }
};

const handleCancel = () => {
  emit('close');
};
</script>

<template>
  <div 
    class="compose-container"
    v-voix:role="'form'"
    v-voix:label="'Compose new email'"
  >
    <div class="compose-header">
      <h2 class="compose-title" v-voix:role="'heading'" v-voix:level="2">
        {{ props.replyTo ? (props.forward ? 'Forward' : 'Reply') : 'New Message' }}
      </h2>
      
      <button 
        class="close-button" 
        @click="handleCancel"
        v-voix:role="'button'"
        v-voix:label="'Close composer'"
      >
        ✕
      </button>
    </div>
    
    <div class="compose-form">
      <div class="form-row">
        <label for="compose-to" class="sr-only">To</label>
        <input 
          id="compose-to" 
          type="text" 
          v-model="to" 
          placeholder="To"
          class="compose-input"
          v-voix:role="'textbox'"
          v-voix:label="'Email recipient'"
          v-voix:required="true"
        />
      </div>
      
      <div class="form-row cc-bcc-toggle" v-if="!showCcBcc">
        <button 
          class="text-button" 
          @click="toggleCcBcc"
          v-voix:role="'button'"
          v-voix:label="'Show CC and BCC fields'"
        >
          Add CC/BCC
        </button>
      </div>
      
      <div v-if="showCcBcc">
        <div class="form-row">
          <label for="compose-cc" class="sr-only">CC</label>
          <input 
            id="compose-cc" 
            type="text" 
            v-model="cc" 
            placeholder="Cc"
            class="compose-input"
            v-voix:role="'textbox'"
            v-voix:label="'Carbon copy recipients'"
          />
        </div>
        
        <div class="form-row">
          <label for="compose-bcc" class="sr-only">BCC</label>
          <input 
            id="compose-bcc" 
            type="text" 
            v-model="bcc" 
            placeholder="Bcc"
            class="compose-input"
            v-voix:role="'textbox'"
            v-voix:label="'Blind carbon copy recipients'"
          />
        </div>
      </div>
      
      <div class="form-row">
        <label for="compose-subject" class="sr-only">Subject</label>
        <input 
          id="compose-subject" 
          type="text" 
          v-model="subject" 
          placeholder="Subject"
          class="compose-input"
          v-voix:role="'textbox'"
          v-voix:label="'Email subject'"
        />
      </div>
      
      <div class="form-row">
        <label for="compose-body" class="sr-only">Message</label>
        <textarea 
          id="compose-body" 
          v-model="body" 
          placeholder="Compose your message..."
          class="compose-textarea"
          v-voix:role="'textbox'"
          v-voix:label="'Email body'"
          v-voix:multiline="true"
        ></textarea>
      </div>
      
      <!-- Attachments -->
      <div class="attachments-container" v-if="attachments.length > 0">
        <div 
          class="attachment-item" 
          v-for="(attachment, index) in attachments" 
          :key="index"
          v-voix:role="'region'"
          v-voix:label="'Attachment: ' + attachment.name"
        >
          <div class="attachment-info">
            <span class="attachment-icon">📎</span>
            <span class="attachment-name">{{ attachment.name }}</span>
            <span class="attachment-size">{{ Math.round(attachment.size / 1024) }} KB</span>
          </div>
          <button 
            class="remove-attachment" 
            @click="removeAttachment(index)"
            v-voix:role="'button'"
            v-voix:label="'Remove attachment ' + attachment.name"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
    
    <div class="compose-actions">
      <div class="compose-toolbar">
        <input 
          type="file" 
          ref="fileInput" 
          @change="handleFileSelect" 
          multiple 
          class="file-input"
          v-voix:role="'button'"
          v-voix:label="'Add attachment'"
        />
        <button 
          class="toolbar-button" 
          @click="openFileDialog"
          v-voix:role="'button'"
          v-voix:label="'Add attachment'"
        >
          📎
        </button>
      </div>
      
      <div class="send-actions">
        <button 
          class="send-button" 
          @click="handleSend"
          :disabled="!to.trim()"
          v-voix:role="'button'"
          v-voix:label="'Send email'"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.compose-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
}

.compose-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.compose-title {
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  color: #666;
}

.compose-form {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.form-row {
  margin-bottom: 16px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.compose-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.compose-textarea {
  width: 100%;
  min-height: 200px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
  font-family: inherit;
}

.cc-bcc-toggle {
  margin-top: -8px;
}

.text-button {
  background: none;
  border: none;
  color: #1a73e8;
  cursor: pointer;
  padding: 4px 0;
  font-size: 14px;
}

.attachments-container {
  margin-top: 16px;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 8px;
}

.attachment-info {
  display: flex;
  align-items: center;
}

.attachment-icon {
  margin-right: 8px;
}

.attachment-name {
  margin-right: 8px;
  font-size: 14px;
}

.attachment-size {
  font-size: 12px;
  color: #666;
}

.remove-attachment {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
}

.file-input {
  display: none;
}

.compose-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
}

.compose-toolbar {
  display: flex;
  gap: 12px;
}

.toolbar-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  color: #444;
}

.send-button {
  padding: 10px 24px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.send-button:disabled {
  background-color: #9fc1ee;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  .compose-header,
  .compose-form,
  .compose-actions {
    padding: 24px;
  }
}
</style>