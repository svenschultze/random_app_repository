<script setup>
// Basic message view placeholder
import { ref } from 'vue'

const conversations = ref([
  {
    id: 301,
    name: 'Sarah Miller',
    avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
    lastMessage: 'Looking forward to our JavaScript session tomorrow!',
    timestamp: '2025-03-06T18:45:00',
    unread: true
  },
  {
    id: 302,
    name: 'Eduardo Garcia',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    lastMessage: 'Can we go over verb conjugations during our session?',
    timestamp: '2025-03-06T14:20:00',
    unread: false
  },
  {
    id: 303,
    name: 'Maria Chen',
    avatar: 'https://randomuser.me/api/portraits/women/49.jpg',
    lastMessage: 'Hi Alex! I saw we are a match. Would you be interested in swapping Spanish for JavaScript lessons?',
    timestamp: '2025-03-05T09:15:00',
    unread: false
  },
  {
    id: 304,
    name: 'David Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    lastMessage: 'Thanks for accepting my match request! When would you be available for a guitar lesson?',
    timestamp: '2025-03-04T16:30:00',
    unread: false
  }
])

const selectedConversation = ref(null)
const newMessage = ref('')

const selectConversation = (conversation) => {
  selectedConversation.value = conversation
}

const sendMessage = () => {
  if (newMessage.value.trim() === '') return
  
  // In a real app, this would send to an API
  alert('Message sent: ' + newMessage.value)
  newMessage.value = ''
}

// Get relative time for messages
const getRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHr = Math.round(diffMin / 60)
  const diffDays = Math.round(diffHr / 24)

  if (diffSec < 60) {
    return 'Just now'
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`
  } else if (diffHr < 24) {
    return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }
}
</script>

<template>
  <div class="messages-container">
    <h1 v-voix="'messages-title'">Messages</h1>
    
    <div class="messages-layout">
      <!-- Conversations List -->
      <div class="conversations-list">
        <div class="conversations-header">
          <h2 v-voix="'conversations-title'">Conversations</h2>
          <input 
            type="text" 
            placeholder="Search messages" 
            class="search-input"
            v-voix="'search-messages-input'"
            hint="Search your conversations"
          />
        </div>
        
        <div class="conversations">
          <div 
            v-for="conversation in conversations" 
            :key="conversation.id" 
            class="conversation-item" 
            :class="{ 'unread': conversation.unread, 'selected': selectedConversation === conversation }"
            @click="selectConversation(conversation)"
            v-voix="`conversation-${conversation.id}`"
            :hint="`Conversation with ${conversation.name}, ${conversation.unread ? 'unread' : 'read'}`"
          >
            <div class="avatar-container">
              <img :src="conversation.avatar" :alt="conversation.name" class="avatar" />
              <div v-if="conversation.unread" class="unread-indicator"></div>
            </div>
            <div class="conversation-info">
              <div class="conversation-header">
                <h3 class="name">{{ conversation.name }}</h3>
                <span class="time">{{ getRelativeTime(conversation.timestamp) }}</span>
              </div>
              <p class="preview">{{ conversation.lastMessage }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Chat Area -->
      <div class="chat-area">
        <div v-if="!selectedConversation" class="no-chat-selected">
          <div class="no-chat-icon">💬</div>
          <h3 v-voix="'no-chat-title'">Select a conversation</h3>
          <p v-voix="'no-chat-subtitle'">Choose a conversation from the list to start messaging</p>
        </div>
        
        <template v-else>
          <div class="chat-header">
            <div class="chat-user-info">
              <img :src="selectedConversation.avatar" :alt="selectedConversation.name" class="avatar" />
              <h3 v-voix="'chat-with-user'">{{ selectedConversation.name }}</h3>
            </div>
            <div class="chat-actions">
              <button 
                class="schedule-button"
                v-voix="'schedule-session-button'"
                hint="Schedule a skill exchange session with this person"
              >
                Schedule Session
              </button>
            </div>
          </div>
          
          <div class="chat-messages">
            <div class="chat-date-separator" v-voix="'today-separator'">
              <span>Today</span>
            </div>
            
            <!-- This would be a real chat history in a complete implementation -->
            <div class="message-received">
              <p class="message-content">Hi there! How are you doing today?</p>
              <span class="message-time">10:30 AM</span>
            </div>
            
            <div class="message-sent">
              <p class="message-content">I'm doing great, thanks for asking! How about you?</p>
              <span class="message-time">10:32 AM</span>
            </div>
            
            <div class="message-received">
              <p class="message-content">I'm doing well too! I was wondering if you're available for a skill exchange session this weekend?</p>
              <span class="message-time">10:35 AM</span>
            </div>

            <div class="message-received">
              <p class="message-content">{{ selectedConversation.lastMessage }}</p>
              <span class="message-time">{{ new Date(selectedConversation.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
            </div>
          </div>
          
          <div class="chat-input-area">
            <textarea 
              v-model="newMessage" 
              placeholder="Type a message..." 
              class="message-input"
              v-voix="'message-input'"
              hint="Type your message here"
            ></textarea>
            <button 
              class="send-button" 
              @click="sendMessage"
              v-voix="'send-button'"
              hint="Send your message"
              :disabled="!newMessage.trim()"
            >
              Send
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.messages-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.messages-container h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-color);
}

.messages-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 1.5rem;
  height: calc(100vh - 180px);
  min-height: 600px;
}

/* Conversations List */
.conversations-list {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.conversations-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.conversations-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 140, 255, 0.2);
}

.conversations {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.conversation-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.conversation-item.selected {
  background-color: rgba(74, 140, 255, 0.1);
}

.conversation-item.unread {
  background-color: rgba(74, 140, 255, 0.05);
}

.avatar-container {
  position: relative;
  margin-right: 1rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.unread-indicator {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: var(--primary-color);
  border-radius: 50%;
  border: 2px solid white;
}

.conversation-info {
  flex: 1;
  min-width: 0; /* For text truncation */
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.name {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-color);
  margin: 0;
}

.time {
  color: var(--light-text);
  font-size: 0.8rem;
}

.preview {
  color: var(--light-text);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.conversation-item.unread .name,
.conversation-item.unread .preview {
  color: var(--text-color);
  font-weight: 500;
}

/* Chat Area */
.chat-area {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.no-chat-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--light-text);
  text-align: center;
}

.no-chat-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-chat-selected h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chat-user-info h3 {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-color);
  margin: 0;
}

.chat-actions {
  display: flex;
  gap: 0.75rem;
}

.schedule-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: var(--transition);
}

.schedule-button:hover {
  background-color: var(--secondary-color);
}

.chat-messages {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #f8f9fa;
}

.chat-date-separator {
  display: flex;
  align-items: center;
  margin: 1rem 0;
  color: var(--light-text);
  font-size: 0.85rem;
}

.chat-date-separator::before,
.chat-date-separator::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--border-color);
}

.chat-date-separator span {
  padding: 0 1rem;
}

.message-received,
.message-sent {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  position: relative;
}

.message-received {
  align-self: flex-start;
  background-color: white;
  border: 1px solid var(--border-color);
}

.message-sent {
  align-self: flex-end;
  background-color: var(--primary-color);
  color: white;
}

.message-content {
  margin: 0;
  line-height: 1.5;
}

.message-time {
  display: block;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  text-align: right;
  opacity: 0.8;
}

.chat-input-area {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 1rem;
}

.message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.95rem;
  resize: none;
  height: 80px;
  transition: border-color 0.3s;
}

.message-input:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 140, 255, 0.2);
}

.send-button {
  align-self: flex-end;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: var(--transition);
}

.send-button:hover:not(:disabled) {
  background-color: var(--secondary-color);
}

.send-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .messages-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  
  .conversations-list {
    height: 400px;
  }
  
  .chat-area {
    height: 600px;
  }
}

@media (max-width: 768px) {
  .messages-container {
    padding: 1rem;
  }
}
</style>